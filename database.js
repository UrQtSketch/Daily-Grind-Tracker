const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "tracker_db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Local JSON file helpers
function initLocalDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [],
      trackerStates: {},
      sessions: {},
      supportTickets: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readLocalDb() {
  initLocalDb();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local database file:", err);
    return { users: [], trackerStates: {}, sessions: {}, supportTickets: [] };
  }
}

function writeLocalDb(data) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempFile, DB_FILE);
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const trackerStateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  dailyTasks: { type: mongoose.Schema.Types.Mixed, default: {} },
  goals: { type: mongoose.Schema.Types.Mixed, default: [] },
  notes: { type: mongoose.Schema.Types.Mixed, default: [] },
  journal: { type: mongoose.Schema.Types.Mixed, default: [] },
  rewards: { type: mongoose.Schema.Types.Mixed, default: {} },
  quizRewards: { type: mongoose.Schema.Types.Mixed, default: [] },
  trophies: { type: Number, default: 0 },
  lastActiveDate: { type: String },
  lastReminderDate: { type: String, default: null },
  recentPenalty: { type: mongoose.Schema.Types.Mixed, default: null },
  updatedAt: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: {
    id: String,
    name: String,
    email: String
  },
  createdAt: { type: Date, default: Date.now, expires: "30d" }
});

const supportTicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, default: "anonymous" },
  name: { type: String, default: "Anonymous User" },
  category: { type: String, default: "General" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: "10m" }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
const TrackerStateModel = mongoose.models.TrackerState || mongoose.model("TrackerState", trackerStateSchema);
const SessionModel = mongoose.models.Session || mongoose.model("Session", sessionSchema);
const SupportTicketModel = mongoose.models.SupportTicket || mongoose.model("SupportTicket", supportTicketSchema);
const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);

let isMongoConnected = false;
const localOtpStore = new Map();

// Inactivity penalty calculation (5 days without activity = daily -1 trophy penalty)
function applyInactivityPenalty(state) {
  if (!state) return { state, penalty: null };
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  let lastActiveStr = state.lastActiveDate;
  if (!lastActiveStr) {
    if (state.updatedAt) {
      lastActiveStr = new Date(state.updatedAt).toISOString().slice(0, 10);
    } else {
      lastActiveStr = todayStr;
    }
  }

  // Calculate day difference
  const d1 = new Date(lastActiveStr + "T00:00:00Z");
  const d2 = new Date(todayStr + "T00:00:00Z");
  const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 5) {
    const penaltyDays = diffDays - 5;
    const currentTrophies = Math.max(0, Number(state.trophies || 0));
    const trophiesLost = Math.min(currentTrophies, penaltyDays);
    const newTrophies = Math.max(0, currentTrophies - penaltyDays);

    state.trophies = newTrophies;
    state.lastActiveDate = todayStr;
    state.recentPenalty = {
      daysInactive: diffDays,
      penaltyDays,
      trophiesLost,
      date: todayStr,
      shown: false
    };
    return { state, penalty: state.recentPenalty };
  }

  if (!state.lastActiveDate) {
    state.lastActiveDate = todayStr;
  }
  return { state, penalty: null };
}

async function init() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️ MONGODB_URI not provided. Using local JSON storage (data/tracker_db.json).");
    return;
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB Atlas!");

    try {
      const count = await UserModel.countDocuments();
      if (count === 0) {
        const local = readLocalDb();
        if (local.users && local.users.length > 0) {
          console.log(`Migrating ${local.users.length} users to MongoDB...`);
          for (const u of local.users) {
            await UserModel.create(u);
          }
          for (const [email, state] of Object.entries(local.trackerStates || {})) {
            await TrackerStateModel.create({ email, ...state });
          }
          console.log("✅ Migration from local JSON to MongoDB completed!");
        }
      }
    } catch (migErr) {
      console.warn("Migration notice:", migErr.message);
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("⚠️ Falling back to local JSON storage.");
    isMongoConnected = false;
  }
}

// Auto-initialize connection
init();

module.exports = {
  isMongoActive() {
    return isMongoConnected;
  },

  async findUserByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      return await UserModel.findOne({ email: cleanEmail }).lean();
    }
    const db = readLocalDb();
    return db.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async getAllUsers() {
    if (isMongoConnected) {
      return await UserModel.find({}, "id name email createdAt").lean();
    }
    const db = readLocalDb();
    return (db.users || []).map((u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt }));
  },

  async createUser(name, email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const parts = cleanEmail.split("@");
    if (parts.length !== 2 || parts[0].length < 1 || parts[1] !== "gmail.com") {
      throw new Error("Only @gmail.com email addresses are allowed.");
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

    const todayStr = new Date().toISOString().slice(0, 10);

    if (isMongoConnected) {
      const exists = await UserModel.findOne({ email: cleanEmail });
      if (exists) {
        throw new Error("An account with this email already exists.");
      }
      await UserModel.create(user);
      await TrackerStateModel.create({
        email: cleanEmail,
        dailyTasks: {},
        goals: [],
        notes: [],
        journal: [],
        rewards: {},
        trophies: 0,
        lastActiveDate: todayStr,
        recentPenalty: null,
        updatedAt: new Date()
      });
      return { id: user.id, name: user.name, email: user.email };
    }

    const db = readLocalDb();
    if (db.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }
    db.users.push(user);
    db.trackerStates[cleanEmail] = {
      dailyTasks: {},
      goals: [],
      notes: [],
      journal: [],
      rewards: {},
      trophies: 0,
      lastActiveDate: todayStr,
      recentPenalty: null,
      updatedAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return { id: user.id, name: user.name, email: user.email };
  },

  async verifyUser(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    let user;
    if (isMongoConnected) {
      user = await UserModel.findOne({ email: cleanEmail }).lean();
    } else {
      const db = readLocalDb();
      user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      throw new Error("That email or password doesn’t match.");
    }
    const checkHash = hashPassword(password, user.salt);
    if (checkHash !== user.hash) {
      throw new Error("That email or password doesn’t match.");
    }
    return { id: user.id, name: user.name, email: user.email };
  },

  async createSession(user) {
    const token = crypto.randomBytes(32).toString("hex");
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    if (isMongoConnected) {
      await SessionModel.create({
        token,
        user: sessionData,
        createdAt: new Date()
      });
      return token;
    }

    const db = readLocalDb();
    db.sessions[token] = {
      user: sessionData,
      createdAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return token;
  },

  async getUserBySession(token) {
    if (!token) return null;
    if (isMongoConnected) {
      const sess = await SessionModel.findOne({ token }).lean();
      return sess ? sess.user : null;
    }
    const db = readLocalDb();
    const sess = db.sessions[token];
    return sess ? sess.user : null;
  },

  async deleteSession(token) {
    if (!token) return;
    if (isMongoConnected) {
      await SessionModel.deleteOne({ token });
      return;
    }
    const db = readLocalDb();
    if (db.sessions[token]) {
      delete db.sessions[token];
      writeLocalDb(db);
    }
  },

  async getTrackerState(email) {
    const cleanEmail = email.trim().toLowerCase();
    const todayStr = new Date().toISOString().slice(0, 10);
    const defaultState = {
      dailyTasks: {},
      goals: [],
      notes: [],
      journal: [],
      rewards: {},
      quizRewards: [],
      trophies: 0,
      lastActiveDate: todayStr,
      lastReminderDate: null,
      recentPenalty: null,
      updatedAt: new Date().toISOString()
    };

    let state;
    if (isMongoConnected) {
      state = await TrackerStateModel.findOne({ email: cleanEmail }).lean();
    } else {
      const db = readLocalDb();
      state = db.trackerStates[cleanEmail];
    }

    if (!state) return defaultState;

    // Evaluate 5-day inactivity penalty rule
    const { state: updatedState, penalty } = applyInactivityPenalty(state);
    if (penalty && penalty.trophiesLost > 0) {
      if (isMongoConnected) {
        await TrackerStateModel.findOneAndUpdate(
          { email: cleanEmail },
          {
            $set: {
              trophies: updatedState.trophies,
              lastActiveDate: updatedState.lastActiveDate,
              recentPenalty: updatedState.recentPenalty,
              updatedAt: new Date()
            }
          }
        );
      } else {
        const db = readLocalDb();
        db.trackerStates[cleanEmail] = updatedState;
        writeLocalDb(db);
      }
    }

    return {
      dailyTasks: updatedState.dailyTasks || {},
      goals: updatedState.goals || [],
      notes: updatedState.notes || [],
      journal: updatedState.journal || [],
      rewards: updatedState.rewards || {},
      quizRewards: updatedState.quizRewards || [],
      trophies: updatedState.trophies != null ? Number(updatedState.trophies) : 0,
      lastActiveDate: updatedState.lastActiveDate,
      lastReminderDate: updatedState.lastReminderDate || null,
      recentPenalty: updatedState.recentPenalty || null,
      updatedAt: updatedState.updatedAt ? (updatedState.updatedAt.toISOString ? updatedState.updatedAt.toISOString() : updatedState.updatedAt) : new Date().toISOString()
    };
  },

  async saveTrackerState(email, state) {
    const cleanEmail = email.trim().toLowerCase();
    const todayStr = new Date().toISOString().slice(0, 10);
    const payload = {
      dailyTasks: state.dailyTasks || {},
      goals: state.goals || [],
      notes: state.notes || [],
      journal: state.journal || [],
      rewards: state.rewards || {},
      quizRewards: state.quizRewards || [],
      trophies: state.trophies != null ? Number(state.trophies) : 0,
      lastActiveDate: state.lastActiveDate || todayStr,
      lastReminderDate: state.lastReminderDate !== undefined ? state.lastReminderDate : null,
      recentPenalty: state.recentPenalty || null,
      updatedAt: new Date()
    };

    if (isMongoConnected) {
      const updated = await TrackerStateModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: payload },
        { upsert: true, new: true }
      ).lean();
      return updated;
    }

    const db = readLocalDb();
    db.trackerStates[cleanEmail] = {
      ...payload,
      updatedAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return db.trackerStates[cleanEmail];
  },

  async saveSupportFeedback(feedback) {
    const ticket = {
      id: crypto.randomUUID(),
      email: feedback.email,
      name: feedback.name,
      category: feedback.category,
      message: feedback.message,
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected) {
      await SupportTicketModel.create(ticket);
      return ticket;
    }

    const db = readLocalDb();
    db.supportTickets = db.supportTickets || [];
    db.supportTickets.push(ticket);
    writeLocalDb(db);
    return ticket;
  },

  async saveOtp(email, name, password, otp) {
    const cleanEmail = email.trim().toLowerCase();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    if (isMongoConnected) {
      await OtpModel.findOneAndUpdate(
        { email: cleanEmail },
        {
          $set: {
            email: cleanEmail,
            otp,
            name: name.trim(),
            password,
            attempts: 0,
            createdAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
      return;
    }
    localOtpStore.set(cleanEmail, {
      email: cleanEmail,
      otp,
      name: name.trim(),
      password,
      attempts: 0,
      expiresAt
    });
    const db = readLocalDb();
    db.otps = db.otps || {};
    db.otps[cleanEmail] = { email: cleanEmail, otp, name: name.trim(), password, attempts: 0, expiresAt };
    writeLocalDb(db);
  },

  async getOtp(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      return await OtpModel.findOne({ email: cleanEmail }).lean();
    }
    const db = readLocalDb();
    const item = (db.otps && db.otps[cleanEmail]) || localOtpStore.get(cleanEmail);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      localOtpStore.delete(cleanEmail);
      if (db.otps && db.otps[cleanEmail]) {
        delete db.otps[cleanEmail];
        writeLocalDb(db);
      }
      return null;
    }
    return item;
  },

  async incrementOtpAttempts(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      const res = await OtpModel.findOneAndUpdate(
        { email: cleanEmail },
        { $inc: { attempts: 1 } },
        { new: true }
      ).lean();
      return res ? res.attempts : 1;
    }
    const db = readLocalDb();
    db.otps = db.otps || {};
    let attempts = 1;
    if (db.otps[cleanEmail]) {
      db.otps[cleanEmail].attempts = (db.otps[cleanEmail].attempts || 0) + 1;
      attempts = db.otps[cleanEmail].attempts;
      writeLocalDb(db);
    }
    const item = localOtpStore.get(cleanEmail);
    if (item) {
      item.attempts = (item.attempts || 0) + 1;
      attempts = item.attempts;
    }
    return attempts;
  },

  async deleteOtp(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      await OtpModel.deleteOne({ email: cleanEmail });
      return;
    }
    localOtpStore.delete(cleanEmail);
    const db = readLocalDb();
    if (db.otps && db.otps[cleanEmail]) {
      delete db.otps[cleanEmail];
      writeLocalDb(db);
    }
  }
};
