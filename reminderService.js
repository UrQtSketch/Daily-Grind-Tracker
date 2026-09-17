const db = require("./database");
const mailer = require("./mailer");

function getIstDateInfo() {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffsetMs);
  const dateStr = istTime.toISOString().slice(0, 10);
  const hour = istTime.getUTCHours();
  const minutes = istTime.getUTCMinutes();
  return { dateStr, hour, minutes, istTime };
}

async function checkAndSendDailyReminders({ force = false } = {}) {
  const { dateStr, hour, minutes } = getIstDateInfo();
  console.log(`[REMINDER RUN] Checking pending tasks for date: ${dateStr} (IST Time: ${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}, force: ${force})`);

  // Unless forced, only send reminders during the evening reminder window (>= 20:00 / 8:00 PM IST)
  if (!force && hour < 20) {
    console.log(`[REMINDER RUN] Current IST hour is ${hour}:00. Reminder window begins at 20:00 IST (8:00 PM). Skipping.`);
    return {
      status: "skipped_outside_window",
      currentIstHour: hour,
      dateStr,
      remindedCount: 0
    };
  }

  const users = await db.getAllUsers();
  const summary = {
    date: dateStr,
    totalUsers: users.length,
    reminded: [],
    skippedAlreadySent: [],
    skippedTasksDone: [],
    errors: []
  };

  for (const user of users) {
    try {
      if (!user.email || !user.email.endsWith("@gmail.com")) continue;

      const state = await db.getTrackerState(user.email);
      const todayTasks = state.dailyTasks && state.dailyTasks[dateStr];

      let completedCount = 0;
      let totalTasks = 9; // standard default Daily Grind tasks count

      if (Array.isArray(todayTasks) && todayTasks.length > 0) {
        totalTasks = todayTasks.length;
        completedCount = todayTasks.filter((t) => t && t.done).length;
      }

      // If user has completed at least 1 task today, they are active!
      if (completedCount > 0) {
        summary.skippedTasksDone.push({
          email: user.email,
          completedCount,
          totalTasks
        });
        continue;
      }

      // If user was already sent a reminder for todayStr, skip
      if (state.lastReminderDate === dateStr && !force) {
        summary.skippedAlreadySent.push({
          email: user.email,
          lastReminderDate: state.lastReminderDate
        });
        continue;
      }

      const pendingTasksCount = totalTasks - completedCount;
      const sendRes = await mailer.sendDailyTaskReminder({
        to: user.email,
        name: user.name || "Grinder",
        trophies: state.trophies || 0,
        pendingTasksCount,
        dateStr
      });

      // Update lastReminderDate so they don't get duplicate emails today
      state.lastReminderDate = dateStr;
      await db.saveTrackerState(user.email, state);

      summary.reminded.push({
        email: user.email,
        name: user.name,
        pendingTasksCount,
        trophies: state.trophies || 0,
        result: sendRes
      });
    } catch (userErr) {
      console.error(`❌ [REMINDER ERROR] User ${user.email}:`, userErr.message);
      summary.errors.push({ email: user.email, error: userErr.message });
    }
  }

  console.log(`[REMINDER SUMMARY] Checked ${summary.totalUsers} users. Reminders sent/simulated: ${summary.reminded.length}, Already sent: ${summary.skippedAlreadySent.length}, Active today: ${summary.skippedTasksDone.length}`);
  return summary;
}

async function sendTestReminderToEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  const user = (await db.findUserByEmail(cleanEmail)) || { email: cleanEmail, name: "Grinder" };
  const state = await db.getTrackerState(cleanEmail);
  const { dateStr } = getIstDateInfo();

  return await mailer.sendDailyTaskReminder({
    to: user.email,
    name: user.name || "Grinder",
    trophies: state.trophies || 0,
    pendingTasksCount: 9,
    dateStr
  });
}

let schedulerTimer = null;

function startReminderScheduler() {
  if (schedulerTimer) return;

  console.log("⏰ Daily Grind Reminder Scheduler activated (Interval: 30 mins).");
  
  // Initial check on start (in background, non-blocking)
  setTimeout(() => {
    checkAndSendDailyReminders({ force: false }).catch(err => {
      console.warn("Notice: Initial reminder check encountered:", err.message);
    });
  }, 10000);

  // Check every 30 minutes
  schedulerTimer = setInterval(() => {
    checkAndSendDailyReminders({ force: false }).catch(err => {
      console.warn("Notice: Periodic reminder check encountered:", err.message);
    });
  }, 30 * 60 * 1000);
}

module.exports = {
  getIstDateInfo,
  checkAndSendDailyReminders,
  sendTestReminderToEmail,
  startReminderScheduler
};
