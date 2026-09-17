const express = require("express");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const db = require("./database");
const mailer = require("./mailer");
const reminderService = require("./reminderService");

const app = express();
const PORT = process.env.PORT || 3000;

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
