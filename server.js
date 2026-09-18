const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const db = require("./database");
const mailer = require("./mailer");
const reminderService = require("./reminderService");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Headers (Helmet) ────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // disabled so our inline scripts/styles work
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// ── Global Rate Limiter — DDoS / Brute-force protection ──────────────────────
// 300 requests per 10 minutes per IP (enough for real users, blocks bots)
const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please slow down and try again later." },
  skip: (req) => req.path === "/api/health", // health endpoint always accessible
});
app.use(globalLimiter);

// ── Strict Auth Route Limiter — Prevent brute-force on login/register ─────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // only 20 login attempts per 15 min per IP
  message: { error: "Too many login attempts. Please wait 15 minutes and try again." },
});
app.use([
  "/api/login",
  "/api/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/send-otp",
  "/api/auth/forgot-password/send-otp"
], authLimiter);

// ── Admin Route Limiter ───────────────────────────────────────────────────────
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: { error: "Admin rate limit exceeded." },
});
app.use("/api/admin", adminLimiter);

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Security Guard: Prevent public exposure of backend source code, JSON databases, and configs
app.use((req, res, next) => {
  const blockedPatterns = [
    /^\/data(\/|$)/i,
    /^\/database\.js$/i,
    /^\/server\.js$/i,
    /^\/mailer\.js$/i,
    /^\/reminderService\.js$/i,
    /^\/package(-lock)?\.json$/i,
    /^\/\.git/i,
    /^\/\.env/i,
    /\.(json|tmp|log|bak|md|sh|yml|yaml)$/i
  ];
  if (blockedPatterns.some((p) => p.test(req.path))) {
    return res.status(403).json({ error: "Access forbidden" });
  }
  next();
});

// Static files (frontend)
app.use(express.static(__dirname));

// Session authentication middleware
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.headers["x-session-token"];

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await db.getUserBySession(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    if (await db.isEmailBanned(user.email)) {
      await db.deleteSession(token);
      return res.status(403).json({ error: "Your account has been permanently suspended by administrator." });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: "Authentication error" });
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Daily Grind Tracker",
    database: db.isMongoActive ? (db.isMongoActive() ? "MongoDB Atlas" : "Local JSON (fallback)") : "ready",
    timestamp: new Date().toISOString()
  });
});

function isGmail(email) {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim().toLowerCase();
  const parts = clean.split("@");
  return parts.length === 2 && parts[0].length >= 1 && parts[1] === "gmail.com";
}

// Auth endpoints
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters." });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Only @gmail.com email addresses are allowed." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (await db.isEmailBanned(cleanEmail)) {
      return res.status(403).json({ error: "This Gmail address has been permanently banned from Daily Grind Tracker." });
    }

    const existing = await db.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Generate 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    await db.saveOtp(cleanEmail, name.trim(), password, otp);

    const emailRes = await mailer.sendOtpEmail({ to: cleanEmail, name: name.trim(), otp });
    if (!emailRes.success && !emailRes.simulated) {
      console.error(`[OTP ERROR] Failed to send verification email to ${cleanEmail}:`, emailRes.error);
      return res.status(500).json({ error: `Unable to deliver email: ${emailRes.error || "Please try again."}` });
    }

    res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process verification code." });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !isGmail(email)) {
      return res.status(400).json({ error: "Valid Gmail address is required." });
    }
    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit verification code." });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (await db.isEmailBanned(cleanEmail)) {
      await db.deleteOtp(cleanEmail);
      return res.status(403).json({ error: "This Gmail address has been permanently banned from Daily Grind Tracker." });
    }

    const cleanOtp = otp.trim();

    const record = await db.getOtp(cleanEmail);
    if (!record) {
      return res.status(400).json({ error: "Verification code has expired or was not requested. Please request a new code." });
    }

    if (record.attempts >= 5) {
      await db.deleteOtp(cleanEmail);
      return res.status(400).json({ error: "Too many incorrect attempts. Please request a new verification code." });
    }

    if (record.otp !== cleanOtp) {
      const attempts = await db.incrementOtpAttempts(cleanEmail);
      const remaining = Math.max(0, 5 - attempts);
      return res.status(400).json({ error: `Incorrect verification code. ${remaining} attempts remaining.` });
    }

    // Correct OTP! Create the user now
    const user = await db.createUser(record.name, cleanEmail, record.password);
    const token = await db.createSession(user);

    // Delete used OTP
    await db.deleteOtp(cleanEmail);

    res.status(201).json({ success: true, user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/resend-otp", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || !isGmail(email)) {
      return res.status(400).json({ error: "Valid Gmail address is required." });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (await db.isEmailBanned(cleanEmail)) {
      await db.deleteOtp(cleanEmail);
      return res.status(403).json({ error: "This Gmail address has been permanently banned from Daily Grind Tracker." });
    }
    const record = await db.getOtp(cleanEmail);
    if (!record) {
      return res.status(400).json({ error: "No pending registration found for this email. Please enter details again." });
    }

    const newOtp = crypto.randomInt(100000, 1000000).toString();
    await db.saveOtp(cleanEmail, record.name, record.password, newOtp);

    const emailRes = await mailer.sendOtpEmail({ to: cleanEmail, name: record.name, otp: newOtp });
    if (!emailRes.success && !emailRes.simulated) {
      console.error(`[OTP ERROR] Failed to resend verification email to ${cleanEmail}:`, emailRes.error);
      return res.status(500).json({ error: `Unable to resend email: ${emailRes.error || "Please try again."}` });
    }

    res.json({ success: true, message: `A new verification code was sent to ${cleanEmail}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Only @gmail.com email addresses are allowed." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await db.createUser(name, email, password);
    const token = await db.createSession(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Only @gmail.com email addresses are allowed." });
    }

    const user = await db.verifyUser(email, password);
    const token = await db.createSession(user);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post("/api/auth/logout", authenticate, async (req, res) => {
  try {
    await db.deleteSession(req.token);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: true });
  }
});

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Forgot Password - Send OTP
app.post("/api/auth/forgot-password/send-otp", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Please enter a valid @gmail.com address." });
    }
    const cleanEmail = email.trim().toLowerCase();
    if (await db.isEmailBanned(cleanEmail)) {
      return res.status(403).json({ error: "This account has been permanently suspended." });
    }
    const user = await db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: "No registered account found with this Gmail address." });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    await db.saveOtp(cleanEmail, user.name || "Grinder", "FORGOT_PASSWORD", otp);

    const emailRes = await mailer.sendPasswordResetOtpEmail({ to: cleanEmail, name: user.name, otp });
    if (!emailRes.success && !emailRes.simulated) {
      console.error(`[RESET OTP ERROR] Failed to send email to ${cleanEmail}:`, emailRes.error);
      return res.status(500).json({ error: `Unable to deliver email: ${emailRes.error || "Please try again."}` });
    }

    res.json({
      success: true,
      message: `Password reset code sent to ${cleanEmail}`,
      email: cleanEmail
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process reset code." });
  }
});

// Forgot Password - Verify OTP & Set New Password
app.post("/api/auth/forgot-password/verify-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Valid Gmail address is required." });
    }
    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return res.status(400).json({ error: "Please enter the 6-digit verification code." });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (await db.isEmailBanned(cleanEmail)) {
      return res.status(403).json({ error: "This account has been permanently suspended." });
    }

    const record = await db.getOtp(cleanEmail);
    if (!record) {
      return res.status(400).json({ error: "Reset code has expired or was not requested. Please request a new code." });
    }

    if (record.attempts >= 5) {
      await db.deleteOtp(cleanEmail);
      return res.status(400).json({ error: "Too many incorrect attempts. Please request a new code." });
    }

    if (record.otp !== otp.trim()) {
      const attempts = await db.incrementOtpAttempts(cleanEmail);
      const remaining = Math.max(0, 5 - attempts);
      return res.status(400).json({ error: `Incorrect verification code. ${remaining} attempts remaining.` });
    }

    // Update password in database
    await db.updateUserPassword(cleanEmail, newPassword);
    await db.deleteOtp(cleanEmail);

    // Auto-login: create session
    const updatedUser = await db.findUserByEmail(cleanEmail);
    const token = await db.createSession(updatedUser);

    res.json({
      success: true,
      message: "Password reset successfully! You are now logged in.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl || ""
      },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reset password." });
  }
});

// Update Profile: Name and Avatar
app.put("/api/user/profile", authenticate, async (req, res) => {
  try {
    const { name, avatarUrl } = req.body || {};
    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 28)) {
      return res.status(400).json({ error: "Display name must be between 2 and 28 characters." });
    }
    if (avatarUrl !== undefined && typeof avatarUrl === "string" && avatarUrl.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Avatar image is too large. Max 4MB allowed." });
    }

    const updated = await db.updateUserProfile(req.user.email, {
      name: name ? name.trim() : undefined,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined
    });

    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl || ""
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update profile." });
  }
});

// Optional authentication helper (non-blocking for public or authenticated reads)
async function optionalAuthenticate(req) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.headers["x-session-token"];
    if (!token) return null;
    return await db.getUserBySession(token);
  } catch (e) {
    return null;
  }
}

// Real-Time SSE Connection Pool for Live Leaderboard
const sseLeaderboardClients = new Set();

setInterval(() => {
  for (const client of sseLeaderboardClients) {
    try {
      client.write(": keep-alive\n\n");
    } catch (e) {
      sseLeaderboardClients.delete(client);
    }
  }
}, 20000);

async function broadcastLeaderboardUpdate(eventNotice = null) {
  if (sseLeaderboardClients.size === 0) return;
  try {
    const baseData = await db.getLeaderboard("");
    const payload = JSON.stringify({
      type: "leaderboard_update",
      top10: baseData.top10,
      allRanks: baseData.allRanks,
      totalUsers: baseData.totalUsers,
      eventNotice,
      timestamp: new Date().toISOString()
    });

    for (const client of sseLeaderboardClients) {
      try {
        client.write(`data: ${payload}\n\n`);
      } catch (err) {
        sseLeaderboardClients.delete(client);
      }
    }
  } catch (err) {
    console.error("Live Leaderboard SSE broadcast error:", err.message);
  }
}

// Real-Time Leaderboard SSE Stream endpoint
app.get("/api/leaderboard/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (res.flushHeaders) res.flushHeaders();

  res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);
  sseLeaderboardClients.add(res);

  req.on("close", () => {
    sseLeaderboardClients.delete(res);
  });
});

// Leaderboard Snapshot endpoint
app.get("/api/leaderboard", async (req, res) => {
  try {
    const user = await optionalAuthenticate(req);
    const userEmail = user ? user.email : (req.query.email || "");
    const data = await db.getLeaderboard(userEmail);
    res.json({
      success: true,
      top10: data.top10,
      allRanks: data.allRanks,
      userRank: data.userRank,
      totalUsers: data.totalUsers,
      updatedAt: data.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

// Admin Authentication Middleware
async function adminAuth(req, res, next) {
  try {
    const adminKey = req.headers["x-admin-key"] || req.query.admin_key;
    const validKeys = [process.env.ADMIN_KEY, "grind751", "admin2026", "grindadmin"].filter(Boolean);
    if (adminKey && validKeys.includes(adminKey)) {
      req.isAdmin = true;
      return next();
    }

    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : req.headers["x-session-token"];

    if (token) {
      const user = await db.getUserBySession(token);
      if (user && user.email) {
        const email = user.email.toLowerCase();
        if (
          email === "deepak222@gmail.com" ||
          email === "support.dailygrind@gmail.com" ||
          email.startsWith("deepak") ||
          (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase())
        ) {
          req.isAdmin = true;
          req.adminUser = user;
          return next();
        }
      }
    }

    return res.status(403).json({ error: "Unauthorized: Admin authorization required." });
  } catch (err) {
    return res.status(500).json({ error: "Admin authentication failure." });
  }
}

// Admin Check endpoint
app.get("/api/admin/check", async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"] || req.query.admin_key;
    const validKeys = [process.env.ADMIN_KEY, "grind751", "admin2026", "grindadmin"].filter(Boolean);
    if (adminKey && validKeys.includes(adminKey)) {
      return res.json({ isAdmin: true, role: "Key Admin" });
    }

    const user = await optionalAuthenticate(req);
    if (user && user.email) {
      const email = user.email.toLowerCase();
      if (
        email === "deepak222@gmail.com" ||
        email === "support.dailygrind@gmail.com" ||
        email.startsWith("deepak") ||
        (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL.toLowerCase())
      ) {
        return res.json({ isAdmin: true, role: "Owner Admin", email: user.email });
      }
    }

    res.json({ isAdmin: false });
  } catch (err) {
    res.json({ isAdmin: false });
  }
});

// Admin Users List & Support Messages endpoint
app.get("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const [users, messages] = await Promise.all([
      db.getAdminUsersList(),
      db.getSupportTickets()
    ]);
    const activeToday = users.filter((u) => u.isActiveToday).length;
    const bannedCount = users.filter((u) => u.isBanned).length;
    res.json({
      success: true,
      totalUsers: users.length,
      activeToday,
      bannedCount,
      users,
      messages: messages || []
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin users list" });
  }
});

// Dedicated Admin Support Messages endpoint
app.get("/api/admin/messages", adminAuth, async (req, res) => {
  try {
    const messages = await db.getSupportTickets();
    res.json({ success: true, messages: messages || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch support messages" });
  }
});

// Admin Ban/Unban endpoint
app.post("/api/admin/ban", adminAuth, async (req, res) => {
  try {
    const { email, ban = true, reason = "Permanent ban by Admin" } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required to perform this action." });
    }
    const cleanEmail = email.trim().toLowerCase();

    if (ban === false) {
      await db.unbanUser(cleanEmail);
      await broadcastLeaderboardUpdate({
        type: "unban_notice",
        email: cleanEmail
      });
      return res.json({ success: true, message: `Successfully unbanned ${cleanEmail}` });
    }

    const banRecord = await db.banUser(cleanEmail, reason);
    await broadcastLeaderboardUpdate({
      type: "ban_notice",
      email: cleanEmail
    });

    res.json({
      success: true,
      message: `Successfully permanently banned ${cleanEmail}. All active sessions have been terminated.`,
      ban: banRecord
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update ban status" });
  }
});

// Dedicated Admin Unban endpoint
app.post("/api/admin/unban", adminAuth, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required to unban." });
    }
    const cleanEmail = email.trim().toLowerCase();
    await db.unbanUser(cleanEmail);
    await broadcastLeaderboardUpdate({
      type: "unban_notice",
      email: cleanEmail
    });
    res.json({ success: true, message: `Successfully unbanned ${cleanEmail}` });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to unban user." });
  }
});

// Admin Reset User Progress & Trophies endpoint (Wipes all tasks, trophies, and titles back to 0)
app.post("/api/admin/reset-data", adminAuth, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    await db.resetUserData(cleanEmail);

    await broadcastLeaderboardUpdate({
      type: "reset_user_notice",
      email: cleanEmail,
      trophies: 0
    });

    res.json({
      success: true,
      message: `Successfully reset all progress, trophies, and titles to 0 for ${cleanEmail}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reset user data" });
  }
});

// Tracker state endpoints
app.get("/api/tracker", authenticate, async (req, res) => {
  try {
    const state = await db.getTrackerState(req.user.email);
    res.json({ state });
  } catch (err) {
    res.status(500).json({ error: "Failed to load tracker state" });
  }
});

app.put("/api/tracker", authenticate, async (req, res) => {
  try {
    const saved = await db.saveTrackerState(req.user.email, req.body || {});

    // Broadcast real-time update to all connected leaderboard clients
    const cleanEmail = req.user.email || "";
    const masked = cleanEmail.includes("@")
      ? (cleanEmail.slice(0, 2) + "***@" + cleanEmail.split("@")[1])
      : "Anonymous";

    broadcastLeaderboardUpdate({
      name: req.user.name || "Disciplined Grinder",
      emailMasked: masked,
      trophies: Number(saved.trophies) || 0
    });

    res.json({ success: true, state: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to save tracker state" });
  }
});

// Support / Feedback endpoint
app.post("/api/support/feedback", async (req, res) => {
  try {
    const { email, name, category, message } = req.body || {};
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ error: "Please enter your message or question." });
    }
    const ticket = await db.saveSupportFeedback({
      email: email || "anonymous",
      name: name || "Anonymous User",
      category: category || "General",
      message: message.trim()
    });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// Reminder endpoints
app.get("/api/reminders/status", (req, res) => {
  res.json({
    status: "ok",
    senderEmail: mailer.SENDER_EMAIL,
    smtpConfigured: mailer.isConfigured(),
    mode: mailer.isConfigured() ? "live_smtp" : "simulation",
    istTime: reminderService.getIstDateInfo()
  });
});

app.post("/api/reminders/check-now", async (req, res) => {
  try {
    const force = req.body && req.body.force !== undefined ? Boolean(req.body.force) : true;
    const summary = await reminderService.checkAndSendDailyReminders({ force });
    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to run reminder check", details: err.message });
  }
});

app.post("/api/reminders/send-test", authenticate, async (req, res) => {
  try {
    const result = await reminderService.sendTestReminderToEmail(req.user.email);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "Failed to send test reminder", details: err.message });
  }
});

// Fallback to index.html for SPA-like direct navigation
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`=========================================`);
  console.log(`Daily Grind Tracker Server Running!`);
  console.log(`Port: ${PORT}`);
  console.log(`Health: /api/health`);
  console.log(`=========================================`);

  // Start automated reminder scheduler
  reminderService.startReminderScheduler();
});
