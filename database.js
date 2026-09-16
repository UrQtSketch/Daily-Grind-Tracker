const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "tracker_db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [],
      trackerStates: {}, // keyed by email
      sessions: {} // keyed by token
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, recovering...", err);
    return { users: [], trackerStates: {}, sessions: {} };
  }
}

function writeDb(data) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempFile, DB_FILE);
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

module.exports = {
  findUserByEmail(email) {
    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  createUser(name, email, password) {
    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    const parts = cleanEmail.split("@");
    if (parts.length !== 2 || parts[0].length < 1 || parts[1] !== "gmail.com") {
      throw new Error("Only @gmail.com email addresses are allowed.");
    }
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      salt,
      hash,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    // Initialize user tracker state
    db.trackerStates[cleanEmail] = {
      dailyTasks: {},
      goals: [],
      notes: [],
      journal: [],
      rewards: {},
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return { id: user.id, name: user.name, email: user.email };
  },

  verifyUser(email, password) {
    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error("That email or password doesn’t match.");
    }
    const checkHash = hashPassword(password, user.salt);
    if (checkHash !== user.hash) {
      throw new Error("That email or password doesn’t match.");
    }
    return { id: user.id, name: user.name, email: user.email };
  },

  createSession(user) {
    const db = readDb();
    const token = crypto.randomBytes(32).toString("hex");
    db.sessions[token] = {
      user: { id: user.id, name: user.name, email: user.email },
      createdAt: new Date().toISOString()
    };
    writeDb(db);
    return token;
  },

  getUserBySession(token) {
    if (!token) return null;
    const db = readDb();
    const sess = db.sessions[token];
    return sess ? sess.user : null;
  },

  deleteSession(token) {
    if (!token) return;
    const db = readDb();
    if (db.sessions[token]) {
      delete db.sessions[token];
      writeDb(db);
    }
  },

  getTrackerState(email) {
    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    return (
      db.trackerStates[cleanEmail] || {
        dailyTasks: {},
        goals: [],
        notes: [],
        journal: [],
        rewards: {},
        trophies: 0,
        updatedAt: new Date().toISOString()
      }
    );
  },

  saveTrackerState(email, state) {
    const db = readDb();
    const cleanEmail = email.trim().toLowerCase();
    db.trackerStates[cleanEmail] = {
      dailyTasks: state.dailyTasks || {},
      goals: state.goals || [],
      notes: state.notes || [],
      journal: state.journal || [],
      rewards: state.rewards || {},
      trophies: state.trophies != null ? Number(state.trophies) : 0,
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return db.trackerStates[cleanEmail];
  },

  saveSupportFeedback(feedback) {
    const db = readDb();
    db.supportTickets = db.supportTickets || [];
    const ticket = {
      id: crypto.randomUUID(),
      email: feedback.email,
      name: feedback.name,
      category: feedback.category,
      message: feedback.message,
      createdAt: new Date().toISOString()
    };
    db.supportTickets.push(ticket);
    writeDb(db);
    return ticket;
  }
};
