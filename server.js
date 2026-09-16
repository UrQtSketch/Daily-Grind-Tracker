const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Static files (frontend)
app.use(express.static(__dirname));

// Session authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : req.headers["x-session-token"];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = db.getUserBySession(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  req.user = user;
  req.token = token;
  next();
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Daily Grind Tracker", timestamp: new Date().toISOString() });
});

function isGmail(email) {
  if (!email || typeof email !== "string") return false;
  const clean = email.trim().toLowerCase();
  const parts = clean.split("@");
  return parts.length === 2 && parts[0].length >= 1 && parts[1] === "gmail.com";
}

// Auth endpoints
app.post("/api/auth/register", (req, res) => {
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

    const user = db.createUser(name, email, password);
    const token = db.createSession(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (!isGmail(email)) {
      return res.status(400).json({ error: "Only @gmail.com email addresses are allowed." });
    }

    const user = db.verifyUser(email, password);
    const token = db.createSession(user);
    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post("/api/auth/logout", authenticate, (req, res) => {
  db.deleteSession(req.token);
  res.json({ success: true });
});

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Tracker state endpoints
app.get("/api/tracker", authenticate, (req, res) => {
  try {
    const state = db.getTrackerState(req.user.email);
    res.json({ state });
  } catch (err) {
    res.status(500).json({ error: "Failed to load tracker state" });
  }
});

app.put("/api/tracker", authenticate, (req, res) => {
  try {
    const saved = db.saveTrackerState(req.user.email, req.body || {});
    res.json({ success: true, state: saved });
  } catch (err) {
    res.status(500).json({ error: "Failed to save tracker state" });
  }
});

// Support / Feedback endpoint
app.post("/api/support/feedback", (req, res) => {
  try {
    const { email, name, category, message } = req.body || {};
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ error: "Please enter your message or question." });
    }
    const ticket = db.saveSupportFeedback({
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

// Fallback to index.html for SPA-like direct navigation
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Daily Grind Tracker Server Running!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
