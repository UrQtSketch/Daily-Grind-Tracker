const nodemailer = require("nodemailer");

const SENDER_EMAIL = process.env.EMAIL_USER || "support.dailygrind@gmail.com";
const FALLBACK_PASS = Buffer.from("dGNpaCB0a21tIHpvbHcgeGF6dw==", "base64").toString("utf8");
const SENDER_PASS = process.env.EMAIL_PASS || FALLBACK_PASS;
const APP_URL = process.env.APP_URL || "https://daily-grind-tracker.onrender.com";

let transporter = null;

function getTransporter() {
  if (!transporter && SENDER_PASS) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASS
      },
      connectionTimeout: 3500,
      greetingTimeout: 3000,
      socketTimeout: 4000
    });
  }
  return transporter;
}

function generateReminderHtml({ name, trophies = 0, pendingTasksCount = 9, dateStr = "" }) {
  const safeName = name || "Grinder";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Grind Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080b13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080b13; width: 100% !important; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 36px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; width: 100%; background: linear-gradient(180deg, #111827 0%, #0c101d 100%); border: 1px solid rgba(255, 193, 7, 0.28); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 32px 20px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: radial-gradient(ellipse at top, rgba(255, 193, 7, 0.15), transparent 70%);">
              <div style="display: inline-block; font-size: 30px; line-height: 1; margin-bottom: 6px;">⚡</div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #ffc107; text-transform: uppercase;">DAILY GRIND TRACKER</h1>
              <p style="margin: 6px 0 0; font-size: 12px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">751-Day Quest to Apex Discipline</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #ffffff;">
                Namaste ${safeName}, your grind is calling! 🔥
              </h2>
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                We noticed that <strong style="color: #f59e0b;">none of your daily tasks have been checked off today</strong> (${dateStr || "Today"}). The day is slipping away, but your journey to mastery is built one completed task at a time.
              </p>

              <!-- Stat Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 193, 7, 0.2); border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px; text-align: center; width: 50%; border-right: 1px solid rgba(255, 255, 255, 0.08);">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px;">Trophies Owned</div>
                    <div style="font-size: 24px; font-weight: 800; color: #ffc107;">🏆 ${trophies}</div>
                  </td>
                  <td style="padding: 16px 20px; text-align: center; width: 50%;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 4px;">Pending Tasks</div>
                    <div style="font-size: 24px; font-weight: 800; color: #f43f5e;">⚡ ${pendingTasksCount} Tasks</div>
                  </td>
                </tr>
              </table>

              <!-- Warning Callout: 5-Day Penalty -->
              <div style="margin: 0 0 24px; padding: 16px 18px; background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #fca5a5;">
                  ⚠️ <strong style="color: #ffffff;">Streak & Penalty Alert:</strong> Missing consecutive days can break your momentum. Remember: <strong>5 consecutive days of inactivity triggers a daily -1 trophy penalty</strong>. Protect the trophies you fought so hard to earn!
                </p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0 20px;">
                <a href="${APP_URL}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ffc107 0%, #f59e0b 100%); color: #080b13; font-weight: 800; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 14px 34px; border-radius: 30px; box-shadow: 0 6px 20px rgba(255, 193, 7, 0.35);">
                  TICK YOUR TASKS NOW ⚡
                </a>
              </div>

              <p style="margin: 24px 0 0; text-align: center; font-size: 13px; font-style: italic; color: #94a3b8;">
                “Karmanye vadhikaraste ma phaleshu kadachana — Focus on your daily actions, conquer all excuses.”
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #080b13; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                Daily Grind Tracker · Unshakable Consistency System
              </p>
              <p style="margin: 0; font-size: 12px; color: #475569;">
                Need help or have questions? Contact <a href="mailto:${SENDER_EMAIL}" style="color: #ffc107; text-decoration: none;">${SENDER_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendDailyTaskReminder({ to, name, trophies = 0, pendingTasksCount = 9, dateStr = "" }) {
  if (!to) throw new Error("Recipient email is required");

  const subject = `⚡ Daily Grind Alert: Complete your tasks today, ${name || "Grinder"}!`;
  const html = generateReminderHtml({ name, trophies, pendingTasksCount, dateStr });

  if (!SENDER_PASS) {
    console.log(`[EMAIL SIMULATION] Reminder triggered for ${to} (${name}). Pending: ${pendingTasksCount}, Trophies: ${trophies}`);
    return {
      success: true,
      simulated: true,
      to,
      subject,
      note: "Running in simulation mode because EMAIL_PASS is not set in environment variables."
    };
  }

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: `"Daily Grind Tracker" <${SENDER_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log(`✅ [EMAIL SENT] Daily reminder delivered to ${to}. MessageId: ${info.messageId}`);
    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
      to
    };
  } catch (err) {
    console.error(`❌ [EMAIL ERROR] Failed to send reminder to ${to}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      to
    };
  }
}

function generateOtpHtml({ name, otp }) {
  const safeName = name || "Grinder";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - Daily Grind Tracker</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080b13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080b13; width: 100% !important; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 36px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; width: 100%; background: linear-gradient(180deg, #111827 0%, #0c101d 100%); border: 1px solid rgba(255, 193, 7, 0.28); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 26px 32px 18px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: radial-gradient(ellipse at top, rgba(255, 193, 7, 0.15), transparent 70%);">
              <div style="display: inline-block; font-size: 28px; line-height: 1; margin-bottom: 6px;">♨</div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #ffc107; text-transform: uppercase;">DAILY GRIND TRACKER</h1>
              <p style="margin: 4px 0 0; font-size: 11px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">Account Security & Verification</p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 32px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #ffffff;">
                Verify your email, ${safeName} ⚡
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for taking the first step towards unbroken discipline. Use the 6-digit verification code below to complete your account setup:
              </p>

              <!-- OTP Code Display -->
              <div style="margin: 24px 0; padding: 20px 16px; text-align: center; background: rgba(255, 193, 7, 0.08); border: 2px dashed rgba(255, 193, 7, 0.55); border-radius: 14px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 8px;">ONE-TIME VERIFICATION CODE</div>
                <div style="font-family: 'DM Mono', Menlo, Consolas, Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #ffc107; padding-left: 12px;">
                  ${otp}
                </div>
              </div>

              <!-- Security Info -->
              <div style="margin: 0 0 20px; padding: 14px 16px; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.06);">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                  ⏱️ <strong>Valid for 10 minutes.</strong> Never share this code with anyone. If you didn’t request this registration, you can safely ignore this email.
                </p>
              </div>

              <p style="margin: 20px 0 0; text-align: center; font-size: 12px; font-style: italic; color: #64748b;">
                “Discipline is choosing between what you want now and what you want most.”
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 18px 32px; background-color: #080b13; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Daily Grind Tracker · Official Support: <a href="mailto:${SENDER_EMAIL}" style="color: #ffc107; text-decoration: none;">${SENDER_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendOtpEmail({ to, name, otp }) {
  if (!to || !otp) throw new Error("Recipient email and OTP are required");

  const subject = `🔐 ${otp} is your Daily Grind verification code`;
  const html = generateOtpHtml({ name, otp });

  if (!SENDER_PASS) {
    console.log(`[EMAIL SIMULATION] OTP sent to ${to} (${name}): ${otp}`);
    return {
      success: true,
      simulated: true,
      to,
      subject,
      otp
    };
  }

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: `"Daily Grind Tracker" <${SENDER_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log(`✅ [OTP EMAIL SENT] Verification code delivered to ${to}. MessageId: ${info.messageId}`);
    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
      to
    };
  } catch (err) {
    console.error(`❌ [OTP EMAIL ERROR] Failed to send OTP to ${to}: ${err.message}`);
    return {
      success: false,
      error: err.message,
      to
    };
  }
}

module.exports = {
  SENDER_EMAIL,
  isConfigured: () => Boolean(SENDER_PASS),
  generateReminderHtml,
  sendDailyTaskReminder,
  generateOtpHtml,
  sendOtpEmail
};
