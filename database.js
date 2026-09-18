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
      supportTickets: [],
      bannedEmails: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function readLocalDb() {
  initLocalDb();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    parsed.bannedEmails = parsed.bannedEmails || {};
    return parsed;
  } catch (err) {
    console.error("Error reading local database file:", err);
    return { users: [], trackerStates: {}, sessions: {}, supportTickets: [], bannedEmails: {} };
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
  avatarUrl: { type: String, default: "" },
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
  quizDailyUsage: { type: mongoose.Schema.Types.Mixed, default: null },
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
    email: String,
    avatarUrl: String
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

const bannedEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  reason: { type: String, default: "Violation of rules" },
  bannedAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
const TrackerStateModel = mongoose.models.TrackerState || mongoose.model("TrackerState", trackerStateSchema);
const SessionModel = mongoose.models.Session || mongoose.model("Session", sessionSchema);
const SupportTicketModel = mongoose.models.SupportTicket || mongoose.model("SupportTicket", supportTicketSchema);
const OtpModel = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
const BannedEmailModel = mongoose.models.BannedEmail || mongoose.model("BannedEmail", bannedEmailSchema);

let isMongoConnected = false;
const localOtpStore = new Map();

// Inactivity check (Trophies and titles are 100% permanent and NEVER deducted)
function applyInactivityPenalty(state) {
  if (!state) return { state, penalty: null };
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  if (!state.lastActiveDate) {
    state.lastActiveDate = todayStr;
  }
  // User trophies and titles are strictly permanent and immutable across logins
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
    if (await this.isEmailBanned(cleanEmail)) {
      throw new Error("This email has been permanently banned from accessing Daily Grind Tracker.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: cleanEmail,
      salt,
      hash,
      avatarUrl: "",
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
      return { id: user.id, name: user.name, email: user.email, avatarUrl: "" };
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
    return { id: user.id, name: user.name, email: user.email, avatarUrl: "" };
  },

  async verifyUser(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (await this.isEmailBanned(cleanEmail)) {
      throw new Error("This account has been permanently suspended by the website administrator.");
    }

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
    return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || "" };
  },

  async createSession(user) {
    const token = crypto.randomBytes(32).toString("hex");
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || ""
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
      quizDailyUsage: null,
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

    // Calculate earned trophies ledger (auto-heal if trophies were corrupted or zeroed by previous bugs)
    const taskRewards = state.rewards || {};
    let ledgerTrophies = 0;
    for (const r of Object.values(taskRewards)) {
      ledgerTrophies += (Number(r.trophiesEarned) || (r.day ? (r.day >= 301 ? 4 : r.day >= 201 ? 3 : r.day >= 101 ? 2 : 1) : 1));
    }
    const quizRewards = Array.isArray(state.quizRewards) ? state.quizRewards : [];
    for (const q of quizRewards) {
      ledgerTrophies += (Number(q.trophies) || 0);
    }
    const storedTrophies = Number(state.trophies) || 0;
    const finalTrophies = Math.max(storedTrophies, ledgerTrophies);

    if (storedTrophies < finalTrophies) {
      state.trophies = finalTrophies;
      if (isMongoConnected) {
        await TrackerStateModel.findOneAndUpdate(
          { email: cleanEmail },
          { $set: { trophies: finalTrophies, updatedAt: new Date() } }
        );
      } else {
        const db = readLocalDb();
        if (db.trackerStates && db.trackerStates[cleanEmail]) {
          db.trackerStates[cleanEmail].trophies = finalTrophies;
          writeLocalDb(db);
        }
      }
    }

    return {
      dailyTasks: state.dailyTasks || {},
      goals: state.goals || [],
      notes: state.notes || [],
      journal: state.journal || [],
      rewards: state.rewards || {},
      quizRewards: state.quizRewards || [],
      quizDailyUsage: state.quizDailyUsage || null,
      trophies: finalTrophies,
      lastActiveDate: state.lastActiveDate || todayStr,
      lastReminderDate: state.lastReminderDate || null,
      recentPenalty: null,
      updatedAt: state.updatedAt ? (state.updatedAt.toISOString ? state.updatedAt.toISOString() : state.updatedAt) : new Date().toISOString()
    };
  },

  async saveTrackerState(email, state) {
    const cleanEmail = email.trim().toLowerCase();
    const todayStr = new Date().toISOString().slice(0, 10);

    // Ensure trophies cannot be accidentally reduced below legitimate ledger rewards
    const taskRewards = state.rewards || {};
    let ledgerTrophies = 0;
    for (const r of Object.values(taskRewards)) {
      ledgerTrophies += (Number(r.trophiesEarned) || (r.day ? (r.day >= 301 ? 4 : r.day >= 201 ? 3 : r.day >= 101 ? 2 : 1) : 1));
    }
    const quizRewards = Array.isArray(state.quizRewards) ? state.quizRewards : [];
    for (const q of quizRewards) {
      ledgerTrophies += (Number(q.trophies) || 0);
    }
    const givenTrophies = Number(state.trophies) || 0;
    const finalTrophies = Math.max(givenTrophies, ledgerTrophies);

    const payload = {
      dailyTasks: state.dailyTasks || {},
      goals: state.goals || [],
      notes: state.notes || [],
      journal: state.journal || [],
      rewards: state.rewards || {},
      quizRewards: state.quizRewards || [],
      quizDailyUsage: state.quizDailyUsage !== undefined ? state.quizDailyUsage : null,
      trophies: finalTrophies,
      lastActiveDate: state.lastActiveDate || todayStr,
      lastReminderDate: state.lastReminderDate !== undefined ? state.lastReminderDate : null,
      recentPenalty: null,
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

  async resetUserData(email) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    const todayStr = new Date().toISOString().slice(0, 10);
    const freshState = {
      dailyTasks: {},
      goals: [],
      notes: [],
      journal: [],
      rewards: {},
      quizRewards: [],
      quizDailyUsage: null,
      trophies: 0,
      lastActiveDate: todayStr,
      lastReminderDate: null,
      recentPenalty: null,
      updatedAt: new Date()
    };

    if (isMongoConnected) {
      await TrackerStateModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: freshState },
        { upsert: true, new: true }
      );
      return true;
    }

    const db = readLocalDb();
    db.trackerStates[cleanEmail] = {
      ...freshState,
      updatedAt: new Date().toISOString()
    };
    writeLocalDb(db);
    return true;
  },

  async getLeaderboard(currentUserEmail = "") {
    const cleanUserEmail = (currentUserEmail || "").trim().toLowerCase();
    let usersList = [];
    const statesMap = {};
    const bansMap = {};

    if (isMongoConnected) {
      const dbUsers = await UserModel.find({}, "id name email createdAt").lean();
      const dbStates = await TrackerStateModel.find({}, "email trophies lastActiveDate updatedAt").lean();
      const dbBans = await BannedEmailModel.find({}, "email").lean();
      usersList = dbUsers || [];
      for (const s of dbStates || []) {
        if (s && s.email) statesMap[s.email.toLowerCase()] = s;
      }
      for (const b of dbBans || []) {
        if (b && b.email) bansMap[b.email.toLowerCase()] = true;
      }
    } else {
      const db = readLocalDb();
      usersList = db.users || [];
      Object.assign(statesMap, db.trackerStates || {});
      for (const bEmail of Object.keys(db.bannedEmails || {})) {
        bansMap[bEmail.toLowerCase()] = true;
      }
    }

    function maskEmail(email) {
      if (!email || !email.includes("@")) return "Anonymous";
      const [user, domain] = email.split("@");
      if (user.length <= 2) return user + "***@" + domain;
      return user.slice(0, 2) + "***@" + domain;
    }

    const competitors = usersList
      .filter((u) => !bansMap[(u.email || "").toLowerCase()])
      .map((u) => {
        const email = (u.email || "").toLowerCase();
        const state = statesMap[email] || {};
        const trophies = Number(state.trophies) || 0;
        const lastActive = state.lastActiveDate || (state.updatedAt ? String(state.updatedAt).slice(0, 10) : "");
        return {
          id: u.id,
          name: u.name || "Disciplined Grinder",
          emailMasked: maskEmail(email),
          email,
          trophies,
          lastActive
        };
      });

    for (const [emailKey, state] of Object.entries(statesMap)) {
      if (bansMap[emailKey.toLowerCase()]) continue;
      if (!competitors.some((c) => c.email === emailKey.toLowerCase())) {
        competitors.push({
          id: emailKey,
          name: "Disciplined Grinder",
          emailMasked: maskEmail(emailKey),
          email: emailKey.toLowerCase(),
          trophies: Number(state.trophies) || 0,
          lastActive: state.lastActiveDate || ""
        });
      }
    }

    // Sort descending by trophies, tie breaker: recent active date
    competitors.sort((a, b) => {
      if (b.trophies !== a.trophies) {
        return b.trophies - a.trophies;
      }
      return (b.lastActive || "").localeCompare(a.lastActive || "");
    });

    const rankedList = competitors.map((c, index) => {
      const isCurrentUser = cleanUserEmail && c.email === cleanUserEmail;
      return {
        rank: index + 1,
        name: c.name,
        emailMasked: c.emailMasked,
        trophies: c.trophies,
        lastActive: c.lastActive,
        isCurrentUser: !!isCurrentUser
      };
    });

    const top10 = rankedList.slice(0, 10);
    const userRank = cleanUserEmail
      ? rankedList.find((r) => r.isCurrentUser) || null
      : null;

    return {
      top10,
      allRanks: rankedList,
      userRank,
      totalUsers: rankedList.length,
      updatedAt: new Date().toISOString()
    };
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

  async getSupportTickets() {
    if (isMongoConnected) {
      try {
        const list = await SupportTicketModel.find({}).sort({ createdAt: -1 }).limit(100).lean();
        return list.map(t => ({
          id: t.id || t._id.toString(),
          email: t.email,
          name: t.name || "Grinder",
          category: t.category || "General Question",
          message: t.message,
          createdAt: t.createdAt
        }));
      } catch (err) {
        console.warn("MongoDB fetch support tickets error:", err.message);
      }
    }
    const db = readLocalDb();
    const tickets = db.supportTickets || [];
    return [...tickets].reverse();
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
  },

  async isEmailBanned(email) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      const found = await BannedEmailModel.findOne({ email: cleanEmail }).lean();
      return !!found;
    }
    const db = readLocalDb();
    return !!(db.bannedEmails && db.bannedEmails[cleanEmail]);
  },

  async banUser(email, reason = "Permanent ban by Admin") {
    if (!email) throw new Error("Email is required to ban user");
    const cleanEmail = email.trim().toLowerCase();
    const bannedRecord = {
      email: cleanEmail,
      reason: reason || "Permanent ban by Admin",
      bannedAt: new Date().toISOString(),
      bannedBy: "Owner Admin"
    };

    if (isMongoConnected) {
      await BannedEmailModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: { ...bannedRecord, bannedAt: new Date() } },
        { upsert: true, new: true }
      );
      // Invalidate all active sessions for this banned user immediately
      await SessionModel.deleteMany({ "user.email": cleanEmail });
      return bannedRecord;
    }

    const db = readLocalDb();
    db.bannedEmails = db.bannedEmails || {};
    db.bannedEmails[cleanEmail] = bannedRecord;
    // Invalidate sessions immediately
    for (const [t, s] of Object.entries(db.sessions || {})) {
      if (s && s.user && s.user.email && s.user.email.toLowerCase() === cleanEmail) {
        delete db.sessions[t];
      }
    }
    writeLocalDb(db);
    return bannedRecord;
  },

  async unbanUser(email) {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      await BannedEmailModel.deleteOne({ email: cleanEmail });
      return true;
    }
    const db = readLocalDb();
    if (db.bannedEmails && db.bannedEmails[cleanEmail]) {
      delete db.bannedEmails[cleanEmail];
      writeLocalDb(db);
      return true;
    }
    return false;
  },

  async getAdminUsersList() {
    const todayStr = new Date().toISOString().slice(0, 10);
    let usersList = [];
    const statesMap = {};
    const bansMap = {};

    if (isMongoConnected) {
      const dbUsers = await UserModel.find({}, "id name email createdAt").lean();
      const dbStates = await TrackerStateModel.find({}, "email trophies lastActiveDate updatedAt").lean();
      const dbBans = await BannedEmailModel.find({}).lean();
      usersList = dbUsers || [];
      for (const s of dbStates || []) {
        if (s && s.email) statesMap[s.email.toLowerCase()] = s;
      }
      for (const b of dbBans || []) {
        if (b && b.email) bansMap[b.email.toLowerCase()] = b;
      }
    } else {
      const db = readLocalDb();
      usersList = db.users || [];
      Object.assign(statesMap, db.trackerStates || {});
      Object.assign(bansMap, db.bannedEmails || {});
    }

    const adminUsers = usersList.map((u) => {
      const email = (u.email || "").toLowerCase();
      const state = statesMap[email] || {};
      const ban = bansMap[email];
      const trophies = Number(state.trophies) || 0;
      const lastActive = state.lastActiveDate || (state.updatedAt ? String(state.updatedAt).slice(0, 10) : "");
      return {
        id: u.id,
        name: u.name || "Disciplined Grinder",
        email: u.email,
        createdAt: u.createdAt || "",
        trophies,
        lastActiveDate: lastActive,
        isActiveToday: lastActive === todayStr,
        isBanned: !!ban,
        banReason: ban ? ban.reason : null,
        bannedAt: ban ? ban.bannedAt : null
      };
    });

    // Also include any banned emails that might have been created without a User record
    for (const [bEmail, ban] of Object.entries(bansMap)) {
      if (!adminUsers.some((u) => (u.email || "").toLowerCase() === bEmail.toLowerCase())) {
        adminUsers.push({
          id: bEmail,
          name: "Banned Account",
          email: bEmail,
          createdAt: ban.bannedAt || "",
          trophies: 0,
          lastActiveDate: "",
          isActiveToday: false,
          isBanned: true,
          banReason: ban.reason || "Permanent Ban",
          bannedAt: ban.bannedAt || null
        });
      }
    }

    // Sort: banned at bottom or top? Let's sort active today first, then most trophies, then banned at bottom
    adminUsers.sort((a, b) => {
      if (a.isBanned !== b.isBanned) return a.isBanned ? 1 : -1;
      if (a.isActiveToday !== b.isActiveToday) return a.isActiveToday ? -1 : 1;
      return (b.trophies || 0) - (a.trophies || 0);
    });

    return adminUsers;
  },

  async updateUserPassword(email, newPassword) {
    const cleanEmail = email.trim().toLowerCase();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(newPassword, salt);
    if (isMongoConnected) {
      const updated = await UserModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: { salt, hash } },
        { new: true }
      );
      if (!updated) throw new Error("Account not found.");
      return true;
    }
    const db = readLocalDb();
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) throw new Error("Account not found.");
    user.salt = salt;
    user.hash = hash;
    writeLocalDb(db);
    return true;
  },

  async updateUserProfile(email, { name, avatarUrl }) {
    const cleanEmail = email.trim().toLowerCase();
    if (isMongoConnected) {
      const update = {};
      if (name) update.name = name.trim();
      if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;
      const updated = await UserModel.findOneAndUpdate(
        { email: cleanEmail },
        { $set: update },
        { new: true }
      ).lean();
      if (!updated) throw new Error("Account not found.");
      // Also update any active sessions for this user
      await SessionModel.updateMany(
        { "user.email": cleanEmail },
        { $set: { "user.name": updated.name, "user.avatarUrl": updated.avatarUrl || "" } }
      );
      return { id: updated.id, name: updated.name, email: updated.email, avatarUrl: updated.avatarUrl || "" };
    }

    const db = readLocalDb();
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) throw new Error("Account not found.");
    if (name) user.name = name.trim();
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    // update active sessions in local JSON
    if (db.sessions) {
      for (const tok of Object.keys(db.sessions)) {
        if (db.sessions[tok] && db.sessions[tok].user && db.sessions[tok].user.email.toLowerCase() === cleanEmail) {
          if (name) db.sessions[tok].user.name = name.trim();
          if (avatarUrl !== undefined) db.sessions[tok].user.avatarUrl = avatarUrl;
        }
      }
    }
    writeLocalDb(db);
    return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl || "" };
  },

  applyInactivityPenalty(state) {
    if (!state) return state;
    state.recentPenalty = null;
    return state;
  }
};
