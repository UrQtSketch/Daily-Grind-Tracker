(function () {
  const auth = window.DailyGrindAuth;
  const page = document.body;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = (value) => value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  const spiritualQuotes = [
    { quote: "Arise, awake, and stop not until the goal is reached.", author: "SWAMI VIVEKANANDA" },
    { quote: "Karmanye vadhikaraste ma phaleshu kadachana (Focus entirely on your action, conquer all distraction).", author: "BHAGAVAD GITA 2.47" },
    { quote: "You have power over your mind - not outside events. Realize this, and you will find immense strength.", author: "MARCUS AURELIUS" },
    { quote: "Before you start any work, always ask yourself: Why am I doing it? What might the results be? Will I be successful?", author: "CHANAKYA" },
    { quote: "To succeed in your mission, you must have single-minded devotion to your goal.", author: "DR. A.P.J. ABDUL KALAM" },
    { quote: "The mind is everything. What you think you become. Guard your thoughts with unbroken discipline.", author: "BUDDHA" }
  ];

  function startSpiritualCanvas() {
    const canvas = document.getElementById("spiritualCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const particles = [];
    const count = 46;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.4 + 0.8,
        speedY: Math.random() * 0.7 + 0.25,
        speedX: (Math.random() - 0.5) * 0.45,
        alpha: Math.random() * 0.65 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? "255, 193, 7" : "255, 122, 69"
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Radial warmth for sacred glow
      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.6, 20, width * 0.5, height * 0.6, width * 0.65);
      gradient.addColorStop(0, "rgba(255, 193, 7, 0.06)");
      gradient.addColorStop(0.5, "rgba(255, 112, 67, 0.025)");
      gradient.addColorStop(1, "rgba(8, 11, 19, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulsePhase += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = Math.max(0.08, p.alpha + Math.sin(p.pulsePhase) * 0.25);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(render);
    }
    render();
  }

  function startSpiritualQuoteRotation() {
    const quoteEl = document.getElementById("spiritualQuote");
    const authorEl = document.getElementById("spiritualAuthor");
    if (!quoteEl || !authorEl) return;

    let index = 0;
    setInterval(() => {
      index = (index + 1) % spiritualQuotes.length;
      quoteEl.style.transition = "opacity 0.4s ease";
      authorEl.style.transition = "opacity 0.4s ease";
      quoteEl.style.opacity = "0";
      authorEl.style.opacity = "0";
      setTimeout(() => {
        quoteEl.textContent = `“${spiritualQuotes[index].quote}”`;
        authorEl.textContent = `— ${spiritualQuotes[index].author}`;
        quoteEl.style.opacity = "1";
        authorEl.style.opacity = "1";
      }, 400);
    }, 7500);
  }

  function bindLegalModals() {
    const termsModal = document.getElementById("termsModal");
    const privacyModal = document.getElementById("privacyModal");

    const openTerms = (e) => { if (e) e.preventDefault(); if (termsModal) termsModal.showModal(); };
    const openPrivacy = (e) => { if (e) e.preventDefault(); if (privacyModal) privacyModal.showModal(); };

    const termsBtn = document.getElementById("openTermsBtn");
    if (termsBtn) termsBtn.addEventListener("click", openTerms);

    const privacyBtn = document.getElementById("openPrivacyBtn");
    if (privacyBtn) privacyBtn.addEventListener("click", openPrivacy);

    const sidebarTermsBtn = document.getElementById("sidebarTermsBtn");
    if (sidebarTermsBtn) sidebarTermsBtn.addEventListener("click", openTerms);

    const sidebarPrivacyBtn = document.getElementById("sidebarPrivacyBtn");
    if (sidebarPrivacyBtn) sidebarPrivacyBtn.addEventListener("click", openPrivacy);
  }

  function getAppMode() {
    return localStorage.getItem("daily-grind-mode") || null;
  }

  function applyMode(mode, showNotification = false) {
    const isClassic = mode === "classic";
    document.body.classList.toggle("classic-mode", isClassic);
    localStorage.setItem("daily-grind-mode", isClassic ? "classic" : "basic");

    const modeIcon = document.getElementById("modeIcon");
    const modeLabel = document.getElementById("modeLabel");
    if (modeIcon && modeLabel) {
      modeIcon.textContent = isClassic ? "🏛️" : "⚡";
      modeLabel.textContent = isClassic ? "Classic Mode" : "Basic Mode";
    }

    const settingsLabel = document.getElementById("settingsModeLabel");
    if (settingsLabel) {
      settingsLabel.textContent = isClassic ? "Classic Mode" : "Basic Mode";
    }

    if (showNotification && typeof showToast === "function") {
      showToast(isClassic ? "Classic Mode activated: Sacred aura & ancient discipline wisdom." : "Basic Mode activated: Distraction-free clean focus.");
    }
  }

  function initModeSelector() {
    const savedMode = getAppMode();
    const modeModal = document.getElementById("modeSelectorModal");

    if (!savedMode && modeModal) {
      modeModal.showModal();
    } else {
      applyMode(savedMode || "basic", false);
    }

    const basicCard = document.getElementById("selectBasicCard");
    if (basicCard) {
      basicCard.addEventListener("click", () => {
        applyMode("basic", true);
        if (modeModal && modeModal.open) modeModal.close();
      });
    }

    const classicCard = document.getElementById("selectClassicCard");
    if (classicCard) {
      classicCard.addEventListener("click", () => {
        applyMode("classic", true);
        if (modeModal && modeModal.open) modeModal.close();
      });
    }

    const toggleBtn = document.getElementById("modeToggleBtn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = getAppMode() === "classic" ? "classic" : "basic";
        const next = current === "classic" ? "basic" : "classic";
        applyMode(next, true);
      });
    }
  }

  function isGmailAddress(email) {
    if (!email || typeof email !== "string") return false;
    const clean = email.trim().toLowerCase();
    const parts = clean.split("@");
    return parts.length === 2 && parts[0].length >= 1 && parts[1] === "gmail.com";
  }

  function showAuthPage() {
    startSpiritualCanvas();
    startSpiritualQuoteRotation();
    bindLegalModals();

    // Universal password visibility toggle
    document.addEventListener("click", (event) => {
      const btn = event.target.closest(".password-toggle-btn");
      if (!btn) return;
      event.preventDefault();
      const wrap = btn.closest(".password-input-wrap");
      if (!wrap) return;
      const input = wrap.querySelector("input");
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
        btn.setAttribute("aria-label", "Hide password");
      } else {
        input.type = "password";
        btn.textContent = "👁️";
        btn.setAttribute("aria-label", "Show password");
      }
    });

    const form = $("#loginForm");
    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const error = $("#loginError");
        error.textContent = "";
        const email = $("#loginEmail").value.trim();
        const password = $("#loginPassword").value;
        if (!isGmailAddress(email)) {
          error.textContent = "Only @gmail.com email addresses are allowed.";
          return;
        }
        try {
          await auth.login(email, password);
          window.location.assign("index.html");
        } catch (message) {
          error.textContent = message.message;
        }
      });
      $("#demoLogin").addEventListener("click", () => { auth.demo(); window.location.assign("index.html"); });

      // Forgot Password Modal Wiring
      const openForgotBtn = $("#openForgotPassBtn");
      const forgotModal = $("#forgotPassModal");
      const forgotStep1 = $("#forgotStep1");
      const forgotStep2 = $("#forgotStep2");
      const forgotForm1 = $("#forgotForm1");
      const forgotForm2 = $("#forgotForm2");
      const forgotEmailInput = $("#forgotEmailInput");
      const forgotEmailDisplay = $("#forgotEmailDisplay");
      const forgotError1 = $("#forgotError1");
      const forgotError2 = $("#forgotError2");
      const forgotSuccess = $("#forgotSuccess");
      const sendResetCodeBtn = $("#sendResetCodeBtn");
      const confirmResetBtn = $("#confirmResetBtn");
      const resendForgotOtpBtn = $("#resendForgotOtpBtn");
      const forgotResendTimer = $("#forgotResendTimer");
      const backToStep1Btn = $("#backToStep1Btn");

      let forgotPendingEmail = "";
      let forgotCountdown = 30;
      let forgotInterval = null;

      function startForgotResendTimer() {
        forgotCountdown = 30;
        if (resendForgotOtpBtn) resendForgotOtpBtn.disabled = true;
        if (forgotResendTimer) forgotResendTimer.textContent = `${forgotCountdown}s`;
        clearInterval(forgotInterval);
        forgotInterval = setInterval(() => {
          forgotCountdown--;
          if (forgotResendTimer) forgotResendTimer.textContent = `${forgotCountdown}s`;
          if (forgotCountdown <= 0) {
            clearInterval(forgotInterval);
            if (resendForgotOtpBtn) {
              resendForgotOtpBtn.disabled = false;
              resendForgotOtpBtn.textContent = "Resend Code";
            }
          }
        }, 1000);
      }

      if (openForgotBtn && forgotModal) {
        openForgotBtn.addEventListener("click", () => {
          if (forgotEmailInput && $("#loginEmail")) {
            forgotEmailInput.value = $("#loginEmail").value.trim();
          }
          if (forgotError1) { forgotError1.textContent = ""; forgotError1.style.display = "none"; }
          if (forgotError2) { forgotError2.textContent = ""; forgotError2.style.display = "none"; }
          if (forgotSuccess) { forgotSuccess.textContent = ""; forgotSuccess.style.display = "none"; }
          if (forgotStep1) forgotStep1.style.display = "block";
          if (forgotStep2) forgotStep2.style.display = "none";
          forgotModal.showModal();
        });

        if (forgotForm1) {
          forgotForm1.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = (forgotEmailInput ? forgotEmailInput.value : "").trim().toLowerCase();
            if (!isGmailAddress(email)) {
              if (forgotError1) {
                forgotError1.textContent = "Please enter a valid @gmail.com address.";
                forgotError1.style.display = "block";
              }
              return;
            }
            if (forgotError1) forgotError1.style.display = "none";
            if (sendResetCodeBtn) {
              sendResetCodeBtn.disabled = true;
              sendResetCodeBtn.textContent = "Sending Code...";
            }
            try {
              await auth.sendForgotPasswordOtp(email);
              forgotPendingEmail = email;
              if (forgotEmailDisplay) forgotEmailDisplay.textContent = email;
              if (forgotStep1) forgotStep1.style.display = "none";
              if (forgotStep2) forgotStep2.style.display = "block";
              startForgotResendTimer();
            } catch (err) {
              if (forgotError1) {
                forgotError1.textContent = err.message || "Failed to send reset code.";
                forgotError1.style.display = "block";
              }
            } finally {
              if (sendResetCodeBtn) {
                sendResetCodeBtn.disabled = false;
                sendResetCodeBtn.textContent = "Send Reset Code ⚡";
              }
            }
          });
        }

        if (forgotForm2) {
          forgotForm2.addEventListener("submit", async (e) => {
            e.preventDefault();
            const otp = ($("#resetOtpInput") ? $("#resetOtpInput").value : "").trim();
            const newPassword = ($("#newPasswordInput") ? $("#newPasswordInput").value : "");
            if (otp.length !== 6) {
              if (forgotError2) {
                forgotError2.textContent = "Please enter the complete 6-digit code.";
                forgotError2.style.display = "block";
              }
              return;
            }
            if (newPassword.length < 6) {
              if (forgotError2) {
                forgotError2.textContent = "Password must be at least 6 characters long.";
                forgotError2.style.display = "block";
              }
              return;
            }
            if (forgotError2) forgotError2.style.display = "none";
            if (confirmResetBtn) {
              confirmResetBtn.disabled = true;
              confirmResetBtn.textContent = "Updating Password...";
            }
            try {
              await auth.verifyForgotPasswordOtp(forgotPendingEmail, otp, newPassword);
              if (forgotSuccess) {
                forgotSuccess.textContent = "Password updated! Redirecting to grind...";
                forgotSuccess.style.display = "block";
              }
              setTimeout(() => {
                window.location.assign("index.html");
              }, 1000);
            } catch (err) {
              if (forgotError2) {
                forgotError2.textContent = err.message || "Failed to reset password.";
                forgotError2.style.display = "block";
              }
              if (confirmResetBtn) {
                confirmResetBtn.disabled = false;
                confirmResetBtn.textContent = "Update Password & Login 🔒";
              }
            }
          });
        }

        if (resendForgotOtpBtn) {
          resendForgotOtpBtn.addEventListener("click", async () => {
            if (forgotCountdown > 0 || !forgotPendingEmail) return;
            resendForgotOtpBtn.disabled = true;
            resendForgotOtpBtn.textContent = "Sending...";
            try {
              await auth.sendForgotPasswordOtp(forgotPendingEmail);
              startForgotResendTimer();
              if (forgotError2) forgotError2.style.display = "none";
            } catch (err) {
              if (forgotError2) {
                forgotError2.textContent = err.message || "Failed to resend code.";
                forgotError2.style.display = "block";
              }
            }
          });
        }

        if (backToStep1Btn) {
          backToStep1Btn.addEventListener("click", () => {
            clearInterval(forgotInterval);
            if (forgotStep1) forgotStep1.style.display = "block";
            if (forgotStep2) forgotStep2.style.display = "none";
            if (forgotError1) forgotError1.style.display = "none";
            if (forgotError2) forgotError2.style.display = "none";
          });
        }
      }
    }

    const register = $("#registerForm");
    const stepDetails = $("#stepDetails");
    const stepOtp = $("#stepOtp");
    const otpForm = $("#otpForm");
    const sendOtpBtn = $("#sendOtpBtn");
    const verifyOtpBtn = $("#verifyOtpBtn");
    const resendOtpBtn = $("#resendOtpBtn");
    const changeEmailBtn = $("#changeEmailBtn");
    const otpEmailTarget = $("#otpEmailTarget");
    const otpCodeInput = $("#otpCodeInput");
    const otpError = $("#otpError");
    const otpSuccess = $("#otpSuccess");
    const registerError = $("#registerError");

    let pendingEmail = "";
    let resendCountdown = 30;
    let resendInterval = null;

    function startResendTimer() {
      if (resendInterval) clearInterval(resendInterval);
      resendCountdown = 30;
      if (!resendOtpBtn) return;
      resendOtpBtn.disabled = true;
      resendOtpBtn.style.opacity = "0.6";
      resendOtpBtn.innerHTML = `Resend Code (<span id="resendTimer">${resendCountdown}s</span>)`;

      resendInterval = setInterval(() => {
        resendCountdown--;
        const timerSpan = $("#resendTimer");
        if (timerSpan) timerSpan.textContent = `${resendCountdown}s`;
        if (resendCountdown <= 0) {
          clearInterval(resendInterval);
          resendOtpBtn.disabled = false;
          resendOtpBtn.style.opacity = "1";
          resendOtpBtn.textContent = "Resend Code ↻";
        }
      }, 1000);
    }

    if (register) {
      register.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (registerError) registerError.textContent = "";
        const name = $("#registerName")?.value.trim();
        const email = $("#registerEmail")?.value.trim();
        const password = $("#registerPassword")?.value;

        if (!name || name.length < 2) {
          if (registerError) registerError.textContent = "Please tell us your name (at least 2 characters).";
          return;
        }
        if (!email || !isGmailAddress(email)) {
          if (registerError) registerError.textContent = "Only @gmail.com email addresses are allowed.";
          return;
        }
        if (!password || password.length < 6) {
          if (registerError) registerError.textContent = "Password must be at least 6 characters.";
          return;
        }

        let statusTimer = null;
        if (sendOtpBtn) {
          sendOtpBtn.disabled = true;
          sendOtpBtn.textContent = "Sending Code to Gmail...";
          statusTimer = setTimeout(() => {
            if (sendOtpBtn && sendOtpBtn.disabled) {
              sendOtpBtn.textContent = "Connecting to email server...";
            }
          }, 3500);
        }

        try {
          const resData = await auth.sendRegistrationOtp(name, email, password);
          if (statusTimer) clearTimeout(statusTimer);
          pendingEmail = email.toLowerCase();
          if (otpEmailTarget) otpEmailTarget.textContent = pendingEmail;

          // Transition to Step 2
          if (stepDetails) stepDetails.style.display = "none";
          if (stepOtp) stepOtp.style.display = "block";
          if (otpCodeInput) {
            otpCodeInput.value = "";
            otpCodeInput.focus();
          }
          if (otpError) otpError.textContent = "";
          if (otpSuccess) {
            otpSuccess.style.display = "block";
            otpSuccess.textContent = `A 6-digit verification code has been sent to ${pendingEmail}. Please check your Gmail inbox (or Spam folder).`;
            setTimeout(() => { if (otpSuccess) otpSuccess.style.display = "none"; }, 10000);
          }
          startResendTimer();
        } catch (err) {
          if (statusTimer) clearTimeout(statusTimer);
          if (registerError) registerError.textContent = err.message || "Failed to send verification code.";
        } finally {
          if (sendOtpBtn) {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = "Send Verification Code ⚡";
          }
        }
      });
    }

    if (otpForm) {
      otpForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (otpError) otpError.textContent = "";
        const code = otpCodeInput?.value.trim() || "";
        if (code.length !== 6) {
          if (otpError) otpError.textContent = "Please enter the complete 6-digit code.";
          return;
        }

        if (verifyOtpBtn) {
          verifyOtpBtn.disabled = true;
          verifyOtpBtn.textContent = "Verifying...";
        }

        try {
          await auth.verifyRegistrationOtp(pendingEmail, code);
          window.location.assign("index.html");
        } catch (err) {
          if (otpError) otpError.textContent = err.message || "Verification failed.";
        } finally {
          if (verifyOtpBtn) {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.innerHTML = "Verify & Enter Grind <span>→</span>";
          }
        }
      });
    }

    if (resendOtpBtn) {
      resendOtpBtn.addEventListener("click", async () => {
        if (!pendingEmail) return;
        if (resendCountdown > 0 && resendOtpBtn.disabled) return;
        try {
          resendOtpBtn.disabled = true;
          resendOtpBtn.textContent = "Resending...";
          const resendData = await auth.resendRegistrationOtp(pendingEmail);
          if (otpSuccess) {
            otpSuccess.style.display = "block";
            otpSuccess.textContent = `A fresh verification code has been sent to ${pendingEmail}.`;
            setTimeout(() => { if (otpSuccess) otpSuccess.style.display = "none"; }, 10000);
          }
          startResendTimer();
        } catch (err) {
          if (otpError) otpError.textContent = err.message || "Failed to resend code.";
          resendOtpBtn.disabled = false;
          resendOtpBtn.textContent = "Resend Code ↻";
        }
      });
    }

    if (changeEmailBtn) {
      changeEmailBtn.addEventListener("click", () => {
        if (stepOtp) stepOtp.style.display = "none";
        if (stepDetails) stepDetails.style.display = "block";
        if (registerError) registerError.textContent = "";
        if (otpError) otpError.textContent = "";
        if (resendInterval) clearInterval(resendInterval);
      });
    }
  }

  if (!$("#taskList")) { showAuthPage(); return; }

  const seededTasks = [
    { id: 1, label: "Gym / Workout", icon: "⌁", type: "fitness", done: true },
    { id: 2, label: "Coding Practice", icon: "‹/›", type: "learning", done: true },
    { id: 3, label: "GrindNation Work", icon: "▣", type: "focus", done: false },
    { id: 4, label: "Journaling", icon: "▤", type: "mindset", done: true },
    { id: 5, label: "Meditation / Detox", icon: "◒", type: "mindset", done: false },
    { id: 6, label: "Language Learning", icon: "A", type: "learning", done: false },
    { id: 7, label: "Mock Test / Revision", icon: "▥", type: "learning", done: true },
    { id: 8, label: "Water Intake", icon: "◈", type: "fitness", done: true },
    { id: 9, label: "Sleep (Hours)", icon: "☾", type: "mindset", done: false }
  ];
  const demoDate = "2026-09-11";
  const demoWeekly = [50, 65, 52, 93, 0, 0, 0];
  const demoGoals = [
    { icon: "⌁", title: "Build a disciplined body", detail: "4 workouts planned this week", progress: 75, tone: "goal-blue" },
    { icon: "‹/›", title: "Become sharper at coding", detail: "28 of 40 study sessions done", progress: 70, tone: "goal-violet" },
    { icon: "◆", title: "Launch GrindNation", detail: "Weekly focus blocks completed", progress: 45, tone: "goal-coral" }
  ];
  const demoNotes = [
    { tone: "blue", tag: "CODING", text: "Build one small feature before watching another tutorial.", date: "Just now" },
    { tone: "violet", tag: "IDEA", text: "Make the dashboard feel like a quest log—not a spreadsheet.", date: "Today" },
    { tone: "coral", tag: "REMINDER", text: "Discipline is choosing what you want most over what you want now.", date: "Yesterday" }
  ];
  const demoJournal = [
    { date: "THU · SEP 11", title: "Showing up counts.", text: "Finished the mock test and made space for a quieter evening." },
    { date: "WED · SEP 10", title: "Momentum over mood.", text: "A short practice session still moved the needle." }
  ];
  let query = "";
  let currentView = "dashboard";
  let quizSelectedDomain = "programming";
  let quizSelectedTopic = "prog_python";
  let activeQuizReport = null;
  let currentQuestionSelectedOption = null;
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const validViews = ["dashboard", "vault", "quiz", "leaderboard", "habits", "goals", "analytics", "history", "journal", "notes", "settings", "support", "admin"];

  /* -------------------------------------------------------------
     30-TIER DISCIPLINED TITLES PROGRESSION ROSTER
     Milestones strictly honor the 5, 10, 20, 40, 50, 100 pattern
     across Tier 1 (1-100), Tier 2 (101-200), Tier 3 (201-300),
     and Tier 4 (301-751 Endgame GOAT status).
  ------------------------------------------------------------- */
  const TITLES_ROSTER = [
    // Tier 1: 1 - 100 Trophies
    { id: 1, title: "The Starter", icon: "🌱", trophies: 5, tier: "Tier 1", energy: "First Spark of Commitment" },
    { id: 2, title: "The Initiator", icon: "⚡", trophies: 10, tier: "Tier 1", energy: "Ignition of Daily Momentum" },
    { id: 3, title: "The Grinder", icon: "🔥", trophies: 20, tier: "Tier 1", energy: "Forged in the Furnace of Repetition" },
    { id: 4, title: "The Warrior", icon: "⚔️", trophies: 40, tier: "Tier 1", energy: "Conquering Weakness & Excuses" },
    { id: 5, title: "Iron Discipline", icon: "🦾", trophies: 50, tier: "Tier 1", energy: "Unbending Will & Absolute Consistency" },
    { id: 6, title: "Locked In", icon: "👁️", trophies: 75, tier: "Tier 1", energy: "Pure Tunnel Vision & Zero Distraction" },
    { id: 7, title: "The Unbreakable", icon: "🗿", trophies: 100, tier: "Tier 1", energy: "A Century of Solid Granite Habits" },

    // Tier 2: 101 - 200 Trophies
    { id: 8, title: "Shadow Grinder", icon: "🥷", trophies: 105, tier: "Tier 2", energy: "Quiet Execution When Nobody Watches" },
    { id: 9, title: "Lone Grinder", icon: "🐺", trophies: 110, tier: "Tier 2", energy: "Hungry, Self-Sufficient & Relentless" },
    { id: 10, title: "The Relentless One", icon: "🔥", trophies: 120, tier: "Tier 2", energy: "An Unquenchable Hunger for Victory" },
    { id: 11, title: "Battle Hardened", icon: "⚔️", trophies: 140, tier: "Tier 2", energy: "Tested in Tough Days and Victorious" },
    { id: 12, title: "Momentum Master", icon: "⚡", trophies: 150, tier: "Tier 2", energy: "Effortless Flow & High Speed Output" },
    { id: 13, title: "Discipline Beast", icon: "🛡️", trophies: 175, tier: "Tier 2", energy: "Ferocious Focus & Fortress of Habit" },
    { id: 14, title: "Mind Over Matter", icon: "🧠", trophies: 200, tier: "Tier 2", energy: "Mastery Over Every Negative Impulse" },

    // Tier 3: 201 - 300 Trophies
    { id: 15, title: "Dark Horse", icon: "🌑", trophies: 205, tier: "Tier 3", energy: "The Silent Contender Ready to Rule" },
    { id: 16, title: "Peak Performer", icon: "🏆", trophies: 210, tier: "Tier 3", energy: "Operating at the Highest Level" },
    { id: 17, title: "Diamond Mind", icon: "💎", trophies: 220, tier: "Tier 3", energy: "Formed Under Pressure, Impossible to Shatter" },
    { id: 18, title: "The Conqueror", icon: "🔱", trophies: 240, tier: "Tier 3", energy: "Dominating Every Challenge in Sight" },
    { id: 19, title: "Built Different", icon: "🗿", trophies: 250, tier: "Tier 3", energy: "Standing Out From the Ordinary Crowd" },
    { id: 20, title: "The Elite", icon: "💎", trophies: 275, tier: "Tier 3", energy: "The Upper Echelon of True Grind" },
    { id: 21, title: "The Mastermind", icon: "👑", trophies: 300, tier: "Tier 3", energy: "Architect of Long-Term Greatness" },

    // Tier 4: 301 - 751 Trophies (Endgame & Immortal Legacy)
    { id: 22, title: "The Dominator", icon: "🐺", trophies: 320, tier: "Tier 4", energy: "Supreme Reign Over Daily Routines" },
    { id: 23, title: "No Quit", icon: "🔥", trophies: 350, tier: "Tier 4", energy: "Surrender is Erased From the Vocabulary" },
    { id: 24, title: "Unstoppable Force", icon: "⚡", trophies: 400, tier: "Tier 4", energy: "No Obstacle on Earth Can Slow You Down" },
    { id: 25, title: "Apex Legend", icon: "🐉", trophies: 450, tier: "Tier 4", energy: "At the Pinnacle of the Mountain" },
    { id: 26, title: "The Unmatched", icon: "👑", trophies: 500, tier: "Tier 4", energy: "In a Class Completely of Your Own" },
    { id: 27, title: "Limitless", icon: "💀", trophies: 550, tier: "Tier 4", energy: "Beyond Conventional Human Bounds" },
    { id: 28, title: "The Legend", icon: "🐉", trophies: 600, tier: "Tier 4", energy: "Stories Will Be Told of This Quest" },
    { id: 29, title: "Beyond Limits", icon: "🐐", trophies: 675, tier: "Tier 4", energy: "Transcendence of the Finite Mind" },
    { id: 30, title: "THE GOAT", icon: "🐐", trophies: 751, tier: "Tier 4", energy: "Greatest of All Time · 751 Days Unbroken" },

    // Tier 5: Immortal & Mythic God Tier (1,000 - 5,000 Trophies)
    { id: 31, title: "GRIND OVERLORD", icon: "👑", trophies: 1000, tier: "Tier 5 · God Tier", energy: "You don't chase consistency anymore. You ARE consistency." },
    { id: 32, title: "ETERNAL GRINDER", icon: "🐉", trophies: 3000, tier: "Tier 5 · God Tier", energy: "Thousands of wins. One mindset. Never stopped." },
    { id: 33, title: "THE UNTOUCHABLE", icon: "🐐", trophies: 5000, tier: "Tier 5 · Mythic Tier", energy: "5,000 trophies. A level almost nobody reaches." }
  ];

  function getTitleProgress(totalTrophies) {
    const t = Math.max(0, Number(totalTrophies) || 0);
    const unlocked = TITLES_ROSTER.filter(item => t >= item.trophies);
    const current = unlocked.length ? unlocked[unlocked.length - 1] : {
      id: 0,
      title: "Initiate Grinder",
      icon: "🌱",
      trophies: 0,
      tier: "Pre-Rank",
      energy: "Beginning the 751-day ascent."
    };
    const next = TITLES_ROSTER.find(item => t < item.trophies) || null;
    const needed = next ? Math.max(0, next.trophies - t) : 0;
    const base = current.trophies || 0;
    const pct = next ? Math.min(100, Math.max(0, Math.round(((t - base) / (next.trophies - base)) * 100))) : 100;

    return {
      current,
      next,
      needed,
      totalTrophies: t,
      unlocked,
      unlockedCount: unlocked.length,
      totalCount: TITLES_ROSTER.length,
      progressPercent: pct
    };
  }

  function getTrophyLedger() {
    const records = [];
    const rewards = (trackerState && trackerState.rewards) || {};
    Object.keys(rewards).forEach(date => {
      const r = rewards[date];
      records.push({
        id: `reward-${date}`,
        date: date,
        day: r.day || 1,
        type: "reward",
        trophies: Number(r.trophiesEarned) || getTrophiesForDay(r.day || 1),
        source: `Day ${r.day || 1} Quest Conquered · 100% Tasks Complete`,
        quote: r.quote || "",
        author: r.author || "",
        timestamp: r.completedAt || `${date}T20:00:00Z`
      });
    });

    if (trackerState && trackerState.recentPenalty && trackerState.recentPenalty.trophiesLost > 0) {
      const p = trackerState.recentPenalty;
      records.push({
        id: `penalty-${p.date}`,
        date: p.date,
        day: "—",
        type: "penalty",
        trophies: -Math.abs(Number(p.trophiesLost) || 1),
        source: `5-Day Inactivity Penalty (${p.daysInactive} days inactive)`,
        quote: "Discipline is what you do every day, not just when you feel like it.",
        author: "SYSTEM PENALTY",
        timestamp: `${p.date}T00:00:00Z`
      });
    }

    if (trackerState && Array.isArray(trackerState.quizRewards)) {
      trackerState.quizRewards.forEach((q, idx) => {
        records.push({
          id: `quiz-${q.timestamp || idx}`,
          date: q.date || localDateKey(),
          day: "Arena",
          type: "reward",
          trophies: Number(q.trophies) || 1,
          source: `Skill Arena: ${q.topicTitle} (${(q.level || 'Beginner').toUpperCase()}) · Score ${q.score}/10`,
          quote: q.rankTitle || "Knowledge meets relentless execution.",
          author: "SKILL ARENA",
          timestamp: new Date(q.timestamp || Date.now()).toISOString()
        });
      });
    }

    records.sort((a, b) => new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime());
    return records;
  }

  function user() { return auth.current() || { name: "Sketch", email: "guest@dailygrind.local", isDemo: true }; }
  function initials(name) { return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase(); }
  function isDemo() { return !!user().isDemo; }
  function localDateKey(date = new Date()) { const local = new Date(date); return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`; }
  function dateKeyAtOffset(days) { const date = new Date(); date.setDate(date.getDate() + days); return localDateKey(date); }
  function starterTasks(markComplete = false) { return seededTasks.map((task) => ({ ...task, done: markComplete ? task.done : false })); }
  function getTrophiesForDay(dayNum) {
    const d = Number(dayNum) || 1;
    if (d >= 601) return 5;
    if (d >= 401) return 4;
    if (d >= 201) return 3;
    if (d >= 101) return 2;
    return 1;
  }

  function getDailyQuizUsage() {
    const today = localDateKey();
    if (!trackerState || !trackerState.quizDailyUsage || trackerState.quizDailyUsage.date !== today) {
      if (trackerState) {
        trackerState.quizDailyUsage = { date: today, count: 0, sessions: [] };
      } else {
        return { date: today, count: 0, sessions: [] };
      }
    }
    return trackerState.quizDailyUsage;
  }

  function calculateTotalTrophies() {
    if (typeof trackerState !== "undefined" && trackerState && trackerState.trophies != null && !isNaN(trackerState.trophies)) {
      return Number(trackerState.trophies);
    }
    const rewards = (typeof trackerState !== "undefined" && trackerState?.rewards) || {};
    let total = Object.values(rewards).reduce((acc, r) => acc + (Number(r.trophiesEarned) || getTrophiesForDay(r.day || 1)), 0);
    const quizRewards = (typeof trackerState !== "undefined" && trackerState?.quizRewards) || [];
    total += quizRewards.reduce((acc, q) => acc + (Number(q.trophies) || 1), 0);
    return total;
  }

  function updateTrophyDisplay() {
    const count = calculateTotalTrophies();
    const progress = getTitleProgress(count);
    const userBadge = $("#userTrophyCount");
    if (userBadge) userBadge.textContent = count;
    const profileBadge = $("#profileTrophyCount");
    if (profileBadge) profileBadge.textContent = count;
    const historyBadge = $("#historyTrophiesVal");
    if (historyBadge) historyBadge.textContent = count;
    const vaultHero = $("#vaultHeroBalance");
    if (vaultHero) vaultHero.textContent = count;
    if ($("#userTrophyBadge")) {
      $("#userTrophyBadge").title = `${count} Trophies · Current Title: ${progress.current.icon} ${progress.current.title}`;
    }
  }

  function trackerStorageKey() { return `daily-grind-tracker:${user().email.toLowerCase()}`; }
  function freshTrackerState() { return { dailyTasks: {}, goals: [], notes: [], journal: [], rewards: {}, quizRewards: [], quizDailyUsage: null, trophies: 0, lastActiveDate: localDateKey(), recentPenalty: null, songBaseOffset: null }; }
  function freshDemoState() {
    return {
      dailyTasks: {
        "2026-09-12": seededTasks.map((t, idx) => ({ ...t, done: idx % 2 === 0 || idx === 1 })), // 6 of 9
        "2026-09-13": seededTasks.map((t) => ({ ...t, done: true })), // 9 of 9 (100%)
        "2026-09-14": seededTasks.map((t, idx) => ({ ...t, done: idx < 7 })), // 7 of 9
        "2026-09-15": seededTasks.map((t, idx) => ({ ...t, done: idx !== 2 && idx !== 5 })), // 7 of 9
        [demoDate]: starterTasks(true), // 5 of 9
        "2026-09-16": seededTasks.map((t, idx) => ({ ...t, done: idx < 4 })) // 4 of 9
      },
      goals: demoGoals.map((goal) => ({ ...goal })),
      notes: demoNotes.map((note) => ({ ...note })),
      quizRewards: [],
      quizDailyUsage: null,
      trophies: 1,
      lastActiveDate: localDateKey(),
      recentPenalty: null,
      rewards: {
        "2026-09-13": { day: 8, quote: "Victory is not an event—it is a daily collection of small, disciplined wins.", author: "DAY 8 · MASTERY", trophiesEarned: 1 }
      },
      journal: [
        { date: "WED · SEP 16", title: "Discipline compounds.", text: "Kept momentum high today with zero excuses." },
        ...demoJournal.map((entry) => ({ ...entry })),
        { date: "SAT · SEP 13", title: "Flawless execution.", text: "Hit all 9 tasks and felt complete control of the day." },
        { date: "FRI · SEP 12", title: "Pushed through resistance.", text: "Started slow but finished 6 core blocks." }
      ]
    };
  }

  function checkLocalInactivity(state) {
    if (!state || !state.lastActiveDate) return state;
    const todayStr = localDateKey();
    const d1 = new Date(state.lastActiveDate + "T00:00:00Z");
    const d2 = new Date(todayStr + "T00:00:00Z");
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 5) {
      const penaltyDays = diffDays - 5;
      const current = Math.max(0, Number(state.trophies || 0));
      const lost = Math.min(current, penaltyDays);
      state.trophies = Math.max(0, current - penaltyDays);
      state.lastActiveDate = todayStr;
      state.recentPenalty = {
        daysInactive: diffDays,
        penaltyDays,
        trophiesLost: lost,
        date: todayStr
      };
    }
    return state;
  }

  function loadTrackerState() {
    if (isDemo()) return freshDemoState();
    try {
      const saved = JSON.parse(localStorage.getItem(trackerStorageKey()));
      const rewards = saved?.rewards || {};
      const computedTrophies = Object.values(rewards).reduce((acc, r) => acc + (Number(r.trophiesEarned) || getTrophiesForDay(r.day || 1)), 0);
      const state = {
        dailyTasks: saved?.dailyTasks || {},
        goals: saved?.goals || [],
        notes: saved?.notes || [],
        journal: saved?.journal || [],
        rewards: rewards,
        quizRewards: saved?.quizRewards || [],
        quizDailyUsage: saved?.quizDailyUsage || null,
        trophies: saved?.trophies != null && !isNaN(saved.trophies) ? Number(saved.trophies) : computedTrophies,
        lastActiveDate: saved?.lastActiveDate || localDateKey(),
        recentPenalty: saved?.recentPenalty || null
      };
      return checkLocalInactivity(state);
    } catch { return freshTrackerState(); }
  }

  let syncDebounceTimer = null;
  function saveTrackerState(syncToBackend = true) {
    if (!isDemo()) {
      trackerState.lastActiveDate = localDateKey();
      localStorage.setItem(trackerStorageKey(), JSON.stringify(trackerState));
      const token = auth.getToken();
      if (syncToBackend && token && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = setTimeout(() => {
          fetch("/api/tracker", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(trackerState)
          }).catch(() => {});
        }, 120);
      }
    }
  }

  function showPenaltyModal(penalty, currentTrophies) {
    const modal = $("#penaltyModal");
    if (!modal) return;
    const daysEl = $("#penaltyDaysCount");
    const lossEl = $("#penaltyLossCount");
    const balanceEl = $("#penaltyCurrentTrophies");
    const descEl = $("#penaltyDesc");

    if (daysEl) daysEl.textContent = penalty.daysInactive || 6;
    if (lossEl) lossEl.textContent = `-${penalty.trophiesLost != null ? penalty.trophiesLost : 1}`;
    if (balanceEl) balanceEl.textContent = currentTrophies;
    if (descEl) {
      descEl.textContent = `You were inactive for ${penalty.daysInactive} days. The 5-day inactivity rule deducted ${penalty.trophiesLost} ${penalty.trophiesLost === 1 ? "trophy" : "trophies"} (-1 per day after 5 days).`;
    }

    try { modal.showModal(); } catch { modal.setAttribute("open", "true"); }
  }

  async function syncFromBackend() {
    if (isDemo()) return;
    const token = auth.getToken();
    if (!token || !(window.location.protocol === "http:" || window.location.protocol === "https:")) return;
    try {
      const res = await fetch("/api/tracker", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.state) {
          trackerState.dailyTasks = { ...data.state.dailyTasks, ...trackerState.dailyTasks };
          if (data.state.goals && data.state.goals.length) trackerState.goals = data.state.goals;
          if (data.state.notes && data.state.notes.length) trackerState.notes = data.state.notes;
          if (data.state.journal && data.state.journal.length) trackerState.journal = data.state.journal;
          trackerState.rewards = { ...data.state.rewards, ...trackerState.rewards };
          if (Array.isArray(data.state.quizRewards)) {
            const existingIds = new Set((trackerState.quizRewards || []).map((r) => r.id || r.completedAt));
            const newRewards = data.state.quizRewards.filter((r) => !existingIds.has(r.id || r.completedAt));
            trackerState.quizRewards = [...(trackerState.quizRewards || []), ...newRewards];
          }
          if (data.state.trophies != null && !isNaN(data.state.trophies)) {
            trackerState.trophies = Number(data.state.trophies);
          } else {
            trackerState.trophies = calculateTotalTrophies();
          }
          if (data.state.quizDailyUsage) {
            const today = localDateKey();
            if (data.state.quizDailyUsage.date === today) {
              trackerState.quizDailyUsage = data.state.quizDailyUsage;
            }
          }
          if (data.state.lastActiveDate) trackerState.lastActiveDate = data.state.lastActiveDate;
          if (data.state.recentPenalty) trackerState.recentPenalty = data.state.recentPenalty;

          saveTrackerState(false);
          tasks = tasksForDate(activeDate);
          renderTasks();
          renderChart();
          refreshMetrics();
          updateTrophyDisplay();

          if (data.state.recentPenalty && data.state.recentPenalty.trophiesLost > 0) {
            const key = `penalty_seen_${data.state.recentPenalty.date}_${data.state.recentPenalty.daysInactive}`;
            if (!sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, "1");
              showPenaltyModal(data.state.recentPenalty, trackerState.trophies);
            }
          }
        }
      }
    } catch {}
  }

  function tasksForDate(date) {
    if (!trackerState.dailyTasks[date]) {
      trackerState.dailyTasks[date] = starterTasks(isDemo());
      saveTrackerState();
    }
    return trackerState.dailyTasks[date];
  }
  let trackerState = loadTrackerState();
  let activeDate = isDemo() ? demoDate : localDateKey();
  let tasks = tasksForDate(activeDate);

  function applyProfile() {
    const profile = user();
    $$('[data-profile-name]').forEach((node) => { node.textContent = node.tagName === "SPAN" && node.closest(".sidebar-quote") ? profile.name.toUpperCase() : profile.name; });
    $$('[data-avatar]').forEach((node) => {
      if (profile && profile.avatarUrl) {
        node.innerHTML = `<img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.name)}" class="topbar-avatar-img" />`;
      } else {
        node.textContent = initials(profile ? profile.name : "Grinder");
      }
    });
    $$('[data-profile-email]').forEach((node) => { node.textContent = profile ? profile.email : ""; });
  }

  function renderTasks() {
    const list = $("#taskList");
    const visibleTasks = tasks.filter((task) => task.label.toLowerCase().includes(query));
    list.innerHTML = visibleTasks.map((task) => `
      <div class="task-row ${task.done ? "is-done" : ""}" data-task-id="${task.id}">
        <button class="check-button" type="button" aria-label="Mark ${escapeHtml(task.label)} as ${task.done ? "not done" : "done"}" aria-pressed="${task.done}">${task.done ? "✓" : ""}</button>
        <span class="task-symbol ${task.type}">${task.icon}</span>
        <span class="task-name">${escapeHtml(task.label)}</span>
        <span class="task-status">${task.done ? "Done" : "Not Done"}</span>
        <button class="more-button" type="button" aria-label="More options for ${escapeHtml(task.label)}">•••</button>
      </div>`).join("");
    $("#emptyTasks").hidden = visibleTasks.length !== 0;
    list.querySelectorAll(".check-button").forEach((button) => button.addEventListener("click", () => toggleTask(Number(button.closest(".task-row").dataset.taskId))));
    list.querySelectorAll(".more-button").forEach((button) => button.addEventListener("click", () => removeTask(Number(button.closest(".task-row").dataset.taskId))));
    refreshMetrics();
    if (currentView === "habits") renderSecondaryView("habits");
  }

  const DAILY_DISCIPLINE_QUOTES = [
    { text: "You didn't negotiate with your mind today. You showed up, executed every task, and earned your self-respect.", author: "DAY 1 · INITIATION" },
    { text: "Discipline is choosing between what you want now and what you want most. Today you chose who you will become.", author: "DAY 2 · COMMITMENT" },
    { text: "Two days was a start; three days is the birth of momentum. The hardest days are behind you.", author: "DAY 3 · MOMENTUM" },
    { text: "While the world made excuses today, you made progress. Consistency is your true competitive edge.", author: "DAY 4 · RESILIENCE" },
    { text: "Small promises kept to yourself every single day build an unbreakable character.", author: "DAY 5 · INTEGRITY" },
    { text: "You put in the reps when nobody was watching. The quiet work always speaks the loudest.", author: "DAY 6 · THE WORK" },
    { text: "One full week conquered. Look in the mirror—that is the person who follows through.", author: "DAY 7 · WEEK ONE" },
    { text: "Motivation gets you going, but discipline keeps you growing. You are mastering your impulses.", author: "DAY 8 · MASTERY" },
    { text: "Every completed task today was a vote of confidence in your future self.", author: "DAY 9 · IDENTITY" },
    { text: "Double digits achieved. The foundation is set. Your standard has permanently been elevated.", author: "DAY 10 · ELEVATION" },
    { text: "You don't need easy days. You just need the grit to conquer the hard ones. Another day done.", author: "DAY 11 · GRIT" },
    { text: "Success is the sum of small efforts repeated day in and day out. Today’s brick is firmly laid.", author: "DAY 12 · COMPOUNDING" },
    { text: "When you control your daily actions, you control your destiny. Day complete. Stand proud.", author: "DAY 13 · CONTROL" },
    { text: "Two weeks of showing up. You are no longer someone who just talks about goals—you execute them.", author: "DAY 14 · FORTITUDE" },
    { text: "Discipline is the bridge between intention and reality. You walked that bridge today.", author: "DAY 15 · FOCUS" },
    { text: "Comfort is the enemy of progress. Today you chose discomfort and grew stronger for it.", author: "DAY 16 · GROWTH" },
    { text: "The difference between who you were and who you want to be is what you did today.", author: "DAY 17 · TRANSFORMATION" },
    { text: "Do not count the days—make the days count. Today was made legendary.", author: "DAY 18 · IMPACT" },
    { text: "Your future is created by what you do today, not tomorrow. Outstanding follow-through.", author: "DAY 19 · PERSISTENCE" },
    { text: "Twenty days strong. The mind will quit a thousand times before the body. You conquered both.", author: "DAY 20 · WILLPOWER" },
    { text: "Three full weeks of relentless execution. This is no longer a challenge—it is your standard.", author: "DAY 21 · NEW HABIT" },
    { text: "Never shrink your ambition to fit your current comfort. You stretched your capability today.", author: "DAY 22 · AMBITION" },
    { text: "The man who loves walking will walk further than the man who loves the destination.", author: "DAY 23 · EMBRACE" },
    { text: "Tough situations never last, but tough, disciplined people do. Promise kept.", author: "DAY 24 · TOUGHNESS" },
    { text: "A quarter century of days in this quest. Look back at where you started. Feel that progress.", author: "DAY 25 · MILESTONE" },
    { text: "Victory is not an event—it is a daily collection of small, disciplined wins.", author: "DAY 26 · REPETITION" },
    { text: "You did what needed to be done, regardless of how you felt. That is the definition of power.", author: "DAY 27 · SOVEREIGNTY" },
    { text: "Four weeks unbroken. Most people gave up days ago. You are built differently.", author: "DAY 28 · ENDURANCE" },
    { text: "Doubt kills more dreams than failure ever will. Today, action killed all doubt.", author: "DAY 29 · ACTION" },
    { text: "One month of unbroken resolve. You have forged a shield of daily discipline.", author: "DAY 30 · CENTURY RUN" }
  ];

  function getDailyQuote(dayNum, dateStr = "") {
    if (dayNum > 0 && dayNum <= DAILY_DISCIPLINE_QUOTES.length) return DAILY_DISCIPLINE_QUOTES[dayNum - 1];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    const idx = Math.abs(hash + dayNum) % DAILY_DISCIPLINE_QUOTES.length;
    return DAILY_DISCIPLINE_QUOTES[idx];
  }

  let confettiAnimId = null;
  function startConfetti() {
    const canvas = $("#rewardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 440;
    canvas.height = rect.height || 480;

    const colors = ["#ff3d59", "#ff9500", "#ffd000", "#45eaa8", "#32b9ff", "#b65aff"];
    const particles = Array.from({ length: 65 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      opacity: 1,
      decay: Math.random() * 0.008 + 0.008
    }));

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.vx *= 0.98;
        p.rotation += p.vrot;
        p.opacity -= p.decay;
        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive) confettiAnimId = requestAnimationFrame(frame);
    }
    frame();
  }

  /* -------------------------------------------------------------
     MOTIVATIONAL CELEBRATION ANTHEMS (ORIGINAL YOUTUBE SONGS)
     Full 51-Track Roster from songs.txt: 30 Hindi + 11 English + 10 Bhojpuri
     All verified official full songs/videos (0 trailers)
     Non-repeating 51-day rotation cycle (repeats on Day 52)
  ------------------------------------------------------------- */
  const CELEBRATION_TRACKS = [
    // 30 HINDI SONGS
    { id: 1, title: "Kar Har Maidaan Fateh — Sanju", ytId: "9iIX4PBplAY", lang: "HINDI", flag: "🇮🇳", energy: "Triumphant Warrior March · Sanju" },
    { id: 2, title: "Zinda — Bhaag Milkha Bhaag", ytId: "Ax0G_P2dSBw", lang: "HINDI", flag: "🇮🇳", energy: "High Voltage Fire & Agility · Bhaag Milkha Bhaag" },
    { id: 3, title: "Lakshya Title Track — Lakshya", ytId: "8DMF0U6xV78", lang: "HINDI", flag: "🇮🇳", energy: "Laser Focus & Unshakable Purpose · Lakshya" },
    { id: 4, title: "Aashayein — Iqbal", ytId: "bmyv0nRkDmc", lang: "HINDI", flag: "🇮🇳", energy: "Hope, Faith & Limitless Dreams · Iqbal" },
    { id: 5, title: "Besabriyaan — M.S. Dhoni", ytId: "UBBHpoW3AKA", lang: "HINDI", flag: "🇮🇳", energy: "Hunger For Excellence & Relentless Drive · M.S. Dhoni" },
    { id: 6, title: "Aarambh Hai Prachand — Gulaal", ytId: "x9feF5rtMAc", lang: "HINDI", flag: "🇮🇳", energy: "Sacred War Cry & High Voltage Prana · Gulaal" },
    { id: 7, title: "Chak De India — Chak De! India", ytId: "bnqLzCsffwY", lang: "HINDI", flag: "🇮🇳", energy: "Adrenaline Blood Rush · Chak De! India" },
    { id: 8, title: "Sultan Title Song — Sultan", ytId: "abiL84EAWSY", lang: "HINDI", flag: "🇮🇳", energy: "Khoon Mein Mitti, Akhaada Comeback · Sultan" },
    { id: 9, title: "Dangal Title Track — Dangal", ytId: "91ZI3IrojMU", lang: "HINDI", flag: "🇮🇳", energy: "Relentless Beast Mode & Iron Discipline · Dangal" },
    { id: 10, title: "Jhuk Na Paunga — Raid", ytId: "OV37j0SJy_U", lang: "HINDI", flag: "🇮🇳", energy: "Unbending Integrity & Spine of Steel · Raid" },
    { id: 11, title: "Ziddi Dil — Mary Kom", ytId: "puKD3nkB1h4", lang: "HINDI", flag: "🇮🇳", energy: "Unyielding Roar & Unbroken Spirit · Mary Kom" },
    { id: 12, title: "Apna Time Aayega — Gully Boy", ytId: "jFGKJBPFdUA", lang: "HINDI", flag: "🇮🇳", energy: "Raw Hustle & Manifesting Destiny · Gully Boy" },
    { id: 13, title: "Parwah Nahi — M.S. Dhoni", ytId: "PMXducIESQE", lang: "HINDI", flag: "🇮🇳", energy: "Fearless Execution, Zero Doubts · M.S. Dhoni" },
    { id: 14, title: "Brothers Anthem — Brothers", ytId: "IjBAgWKW12Y", lang: "HINDI", flag: "🇮🇳", energy: "Raw Power, Grit & Unstoppable Will · Brothers" },
    { id: 15, title: "Jag Ghoomeya — Sultan", ytId: "t10sQb0Zmjs", lang: "HINDI", flag: "🇮🇳", energy: "Soulful Inner Peace & Victory · Sultan" },
    { id: 16, title: "Chak Lein De — Chandni Chowk to China", ytId: "kd-6aw99DpA", lang: "HINDI", flag: "🇮🇳", energy: "Rise After Every Fall · Chandni Chowk to China" },
    { id: 17, title: "Ruk Jana Nahin — Imtihaan", ytId: "9XhkhCMHU7I", lang: "HINDI", flag: "🇮🇳", energy: "Timeless Resilience & The Long March · Imtihaan" },
    { id: 18, title: "Yun Hi Chala Chal — Swades", ytId: "JbNlkYQG5XI", lang: "HINDI", flag: "🇮🇳", energy: "Joy of The Journey & Inner Calling · Swades" },
    { id: 19, title: "Khoon Chala — Rang De Basanti", ytId: "fbbHNMXp5dU", lang: "HINDI", flag: "🇮🇳", energy: "Sacrifice & Unshakable Devotion · Rang De Basanti" },
    { id: 20, title: "Aazaadiyan — Udaan", ytId: "ugm2SOScEqA", lang: "HINDI", flag: "🇮🇳", energy: "Breaking Every Chain & Soaring Free · Udaan" },
    { id: 21, title: "Jeete Hain Chal — Neerja", ytId: "GZIh0bhuFtg", lang: "HINDI", flag: "🇮🇳", energy: "Celebrate Every Breath With Courage · Neerja" },
    { id: 22, title: "Phir Se Ud Chala — Rockstar", ytId: "2mWaqsC3U7k", lang: "HINDI", flag: "🇮🇳", energy: "Transcending Limits & Flying High · Rockstar" },
    { id: 23, title: "Kandhon Se Milte Hain Kandhe — Lakshya", ytId: "s_-tthrE0Hg", lang: "HINDI", flag: "🇮🇳", energy: "Brotherhood, Unity & War March · Lakshya" },
    { id: 24, title: "Roobaroo — Rang De Basanti", ytId: "8kMv5ssr6Dw", lang: "HINDI", flag: "🇮🇳", energy: "Rays of Dawn & Triumphant Glory · Rang De Basanti" },
    { id: 25, title: "Zindagi Aa Raha Hoon Main — Atif Aslam", ytId: "82eM7QRtoRo", lang: "HINDI", flag: "🇮🇳", energy: "Full Throttle Passion & Embracing Life" },
    { id: 26, title: "Soorma Anthem — Soorma", ytId: "cF2yqyiJACk", lang: "HINDI", flag: "🇮🇳", energy: "Unbreakable Comeback From The Ashes · Soorma" },
    { id: 27, title: "Mitwa — Lagaan", ytId: "uC3DmRfEigg", lang: "HINDI", flag: "🇮🇳", energy: "The Unconquered Spirit of Belief · Lagaan" },
    { id: 28, title: "Yahan Ke Hum Sikandar — JJWS", ytId: "YFKv-cpqMHw", lang: "HINDI", flag: "🇮🇳", energy: "The Swagger of Kings & Champions · Jo Jeeta Wohi Sikandar" },
    { id: 29, title: "Badal Pe Paon Hai — Chak De! India", ytId: "DmsOinqrPvQ", lang: "HINDI", flag: "🇮🇳", energy: "Walking on Clouds, Crowned Champions · Chak De! India" },
    { id: 30, title: "Naav — Udaan", ytId: "6RLRUNoTHRY", lang: "HINDI", flag: "🇮🇳", energy: "Navigating Wild Rapids & Overcoming Storms · Udaan" },

    // 11 ENGLISH SONGS
    { id: 31, title: "Golden Hour — JVKE", ytId: "PEM0Vs8jf1w", lang: "ENGLISH", flag: "🌍", energy: "Luminous Euphoria & Golden Triumphs" },
    { id: 32, title: "Die With A Smile — Lady Gaga & Bruno Mars", ytId: "kPa7bsKwL-c", lang: "ENGLISH", flag: "🌍", energy: "Timeless Emotion & Legendary Vocals" },
    { id: 33, title: "Birds of a Feather — Billie Eilish", ytId: "V9PVRfjEBTI", lang: "ENGLISH", flag: "🌍", energy: "Mesmerizing Harmony & Soul Resonance" },
    { id: 34, title: "Alone, Pt. II — Alan Walker & Ava Max", ytId: "HhjHYkPQ8F0", lang: "ENGLISH", flag: "🌍", energy: "Never Alone in The Grind · Anthemic Electronic" },
    { id: 35, title: "Let Me Love You — DJ Snake ft. Justin Bieber", ytId: "euCqAq6BRa4", lang: "ENGLISH", flag: "🌍", energy: "Don't You Give Up, Nah Nah Nah · Global Hit" },
    { id: 36, title: "Sugar & Brownies — DHARIA", ytId: "X-cQSTPie14", lang: "ENGLISH", flag: "🌍", energy: "Irresistible Groove & High Vibe Spark" },
    { id: 37, title: "Faded — Alan Walker", ytId: "60ItHLz5WEA", lang: "ENGLISH", flag: "🌍", energy: "Atmospheric Masterpiece & Legend Status" },
    { id: 38, title: "Cheap Thrills — Sia", ytId: "nYh-n7EOtMA", lang: "ENGLISH", flag: "🌍", energy: "Unstoppable Dance Groove & Pure Celebration" },
    { id: 39, title: "Starboy — The Weeknd", ytId: "34Na4j8AVgA", lang: "ENGLISH", flag: "🌍", energy: "Top of The World Swagger & Electric Nights" },
    { id: 40, title: "Love Me Like You Do — Ellie Goulding", ytId: "AJtDXIazrMo", lang: "ENGLISH", flag: "🌍", energy: "Soaring Cinematic Passion & Grace" },
    { id: 41, title: "The Spectre — Alan Walker", ytId: "wJnBTPUQS5A", lang: "ENGLISH", flag: "🌍", energy: "Hello World, Are You With Me · Stadium Energy" },

    // 10 BHOJPURI SONGS
    { id: 42, title: "Lollipop Lagelu — Pawan Singh", ytId: "Gr8G_ldltDE", lang: "BHOJPURI", flag: "🔥", energy: "All-Time Historic Desi Anthem · Wave Music" },
    { id: 43, title: "Raja Raja Kareja Mein Samaja — Pawan Singh", ytId: "1y57siuuoX8", lang: "BHOJPURI", flag: "🔥", energy: "Desi High-Adrenaline Folk Party · Classic Vibe" },
    { id: 44, title: "Raate Diya Butake — Pawan Singh & Aamrapali", ytId: "Q3sS5v2kQQU", lang: "BHOJPURI", flag: "🔥", energy: "Record-Breaking Mega Blockbuster · Wave Music" },
    { id: 45, title: "Kamariya Hila Rahi Hai — Pawan Singh & Payal Dev", ytId: "kayOHvB-vX8", lang: "BHOJPURI", flag: "🔥", energy: "High-Energy Holi Anthem · Jjust Music" },
    { id: 46, title: "Chhalakata Hamro Jawaniya — Pawan Singh", ytId: "c4JD7rEtIj8", lang: "BHOJPURI", flag: "🔥", energy: "Unstoppable Groove & Maximum Masti · Worldwide Records" },
    { id: 47, title: "Hello Koun — Ritesh Pandey & Sneh Upadhyay", ytId: "0hGGaVCCqPk", lang: "BHOJPURI", flag: "🔥", energy: "Viral Desi Rap Sensation · Riddhi Music" },
    { id: 48, title: "Lehenga Lucknowa — Khesari Lal Yadav", ytId: "VtoeHGD2fnw", lang: "BHOJPURI", flag: "🔥", energy: "Massive Dance Floor Power · Aadishakti Films" },
    { id: 49, title: "Pudina Ae Haseena — Pawan Singh", ytId: "WHU4Z3CZCK8", lang: "BHOJPURI", flag: "🔥", energy: "Chartbuster Summer Groove · Wave Music" },
    { id: 50, title: "Bani Laika — Pawan Singh & Shilpi Raj", ytId: "xE3BGWksJas", lang: "BHOJPURI", flag: "🔥", energy: "Fresh High-Speed Energy · Pammy Records" },
    { id: 51, title: "Kamar Me Dagi — Khesari Lal Yadav & Shilpi Raj", ytId: "EtynM6-FoNw", lang: "BHOJPURI", flag: "🔥", energy: "Electrifying Beat & Desi Swing · Aaradhya Films" }
  ];

  let activeCelebrationTrack = null;

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getCelebrationTrack(dayNum, currentUser, dateStr) {
    if (typeof trackerState === "undefined" || !trackerState) {
      trackerState = {};
    }
    if (trackerState.songBaseOffset == null || isNaN(trackerState.songBaseOffset)) {
      const calendarDay = Math.floor(new Date(dateStr || localDateKey()).getTime() / (1000 * 60 * 60 * 24));
      const userIdent = (currentUser && (currentUser.email || currentUser.name)) || (typeof user === "function" ? (user().email || user().name) : "guest");
      const uHash = hashString(userIdent);
      trackerState.songBaseOffset = Math.abs(calendarDay + uHash) % CELEBRATION_TRACKS.length;
      if (typeof saveTrackerState === "function") saveTrackerState();
    }
    const offset = Number(trackerState.songBaseOffset) || 0;
    const trackIndex = (offset + (Number(dayNum || 1) - 1)) % CELEBRATION_TRACKS.length;
    return CELEBRATION_TRACKS[trackIndex];
  }

  function playMotivationalCelebration(dayNum, currentUser, dateStr) {
    stopMotivationalCelebration();

    const track = getCelebrationTrack(dayNum, currentUser, dateStr);
    activeCelebrationTrack = track;

    // Update UI Elements in #rewardSongCard
    const badge = $("#rewardSongLangBadge");
    const title = $("#rewardSongTitle");
    const desc = $("#rewardSongDesc");
    const ytLink = $("#rewardSongYtLink");
    const iframe = $("#rewardSongIframe");

    if (badge) badge.innerHTML = `${track.flag} ${track.lang} MOTIVATIONAL ANTHEM`;
    if (title) title.textContent = track.title;
    if (desc) desc.textContent = `${track.energy} · Day ${dayNum} Conquered`;
    if (ytLink) {
      ytLink.href = `https://www.youtube.com/watch?v=${track.ytId}`;
      ytLink.title = `Listen to ${track.title} on YouTube`;
    }

    if (iframe) {
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      const origin = window.location.origin ? encodeURIComponent(window.location.origin) : "";
      const originParam = origin ? `&origin=${origin}` : "";
      iframe.src = `https://www.youtube.com/embed/${track.ytId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1${originParam}`;
    }
  }

  function stopMotivationalCelebration() {
    const iframe = $("#rewardSongIframe");
    if (iframe && iframe.src) {
      iframe.src = "";
    }
  }

  function triggerDailyReward(date) {
    trackerState.rewards = trackerState.rewards || {};
    const metrics = trackerMetrics();
    const dayNum = metrics.day || 1;
    const quote = getDailyQuote(dayNum, date);
    const earnedTrophies = getTrophiesForDay(dayNum);

    const alreadyRewarded = !!trackerState.rewards[date];
    if (!alreadyRewarded) {
      trackerState.trophies = (Number(trackerState.trophies) || calculateTotalTrophies()) + earnedTrophies;
    }

    trackerState.rewards[date] = {
      day: dayNum,
      quote: quote.text,
      author: quote.author,
      trophiesEarned: earnedTrophies,
      completedAt: new Date().toISOString()
    };
    saveTrackerState();
    updateTrophyDisplay();

    const totalTrophies = calculateTotalTrophies();
    const modal = $("#rewardModal");
    if (!modal) return;
    const currentUser = user();
    if ($("#rewardHeading")) $("#rewardHeading").innerHTML = `Outstanding, <em>${escapeHtml(currentUser.name)}</em>!`;
    $("#rewardQuoteText").textContent = quote.text;
    $("#rewardQuoteAuthor").textContent = `— ${quote.author}`;
    $("#rewardStreakVal").textContent = metrics.streak;
    $("#rewardDayVal").textContent = `Day ${dayNum}`;
    $("#rewardTasksVal").textContent = `${tasks.length} / ${tasks.length}`;
    if ($("#rewardEyebrow")) $("#rewardEyebrow").textContent = `QUEST DAY ${dayNum} CONQUERED · 100% COMPLETE`;
    if ($("#rewardTrophiesEarned")) $("#rewardTrophiesEarned").textContent = `+${earnedTrophies} Trophy${earnedTrophies > 1 ? 's' : ''} Added to Vault!`;
    if ($("#rewardTotalTrophies")) $("#rewardTotalTrophies").textContent = `You now have ${totalTrophies} ${totalTrophies === 1 ? 'Trophy' : 'Trophies'} in your vault`;

    modal.showModal();
    startConfetti();
    playMotivationalCelebration(dayNum, currentUser, date);
  }

  function toggleTask(id) {
    const wasAllDone = tasks.length > 0 && tasks.every((task) => task.done);
    tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
    trackerState.dailyTasks[activeDate] = tasks;
    saveTrackerState(); renderTasks(); renderChart();
    const isNowAllDone = tasks.length > 0 && tasks.every((task) => task.done);

    if (!wasAllDone && isNowAllDone) {
      triggerDailyReward(activeDate);
    } else {
      const task = tasks.find((t) => t.id === id);
      showToast(task.done ? (isDemo() ? "Demo task complete — create an account to save your own progress." : "Task complete. Keep the streak alive.") : "Task reopened. You’ve got this.");
    }
  }

  function removeTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task || !window.confirm(`Remove “${task.label}” from today?`)) return;
    tasks = tasks.filter((item) => item.id !== id); trackerState.dailyTasks[activeDate] = tasks; saveTrackerState(); renderTasks(); renderChart(); showToast(isDemo() ? "Demo task removed for this preview only." : "Task removed from today.");
  }

  function taskCompletion(taskList) { return taskList.length ? Math.round((taskList.filter((task) => task.done).length / taskList.length) * 100) : 0; }
  function hasCompletedTasks(date) { return (trackerState.dailyTasks[date] || []).some((task) => task.done); }
  function getWeekProgress() {
    if (isDemo()) return demoWeekly;
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today); date.setDate(today.getDate() - mondayOffset + index);
      return taskCompletion(trackerState.dailyTasks[localDateKey(date)] || []);
    });
  }
  function calculateStreak() {
    if (isDemo()) return 9;
    let offset = 0;
    if (!hasCompletedTasks(dateKeyAtOffset(0))) {
      if (!hasCompletedTasks(dateKeyAtOffset(-1))) return 0;
      offset = -1;
    }
    let streak = 0;
    while (hasCompletedTasks(dateKeyAtOffset(offset))) { streak += 1; offset -= 1; }
    return streak;
  }
  function trackerMetrics() {
    const complete = tasks.filter((task) => task.done).length;
    const activeDates = Object.keys(trackerState.dailyTasks).filter((date) => hasCompletedTasks(date));
    const totalDone = Object.values(trackerState.dailyTasks).flat().filter((task) => task.done).length;
    const weeklyValues = getWeekProgress().filter((value) => value > 0);
    const questDays = isDemo() ? 9 : activeDates.length;
    const questPercent = Math.min(100, Math.round((questDays / 751) * 1000) / 10);
    return {
      complete,
      progress: taskCompletion(tasks),
      weekly: weeklyValues.length ? Math.round(weeklyValues.reduce((sum, value) => sum + value, 0) / weeklyValues.length) : 0,
      total: isDemo() ? 23 + totalDone : totalDone,
      streak: calculateStreak(),
      day: questDays,
      questDays,
      questPercent,
      goals: trackerState.goals.length
    };
  }

  function refreshMetrics() {
    const metrics = trackerMetrics();
    $("#completeCount").textContent = metrics.complete;
    $("#taskCount").textContent = tasks.length;
    $("#progressValue").textContent = `${metrics.weekly}%`;
    $("#totalValue").textContent = metrics.total;
    $("#streakValue").textContent = metrics.streak;
    $("#goalValue").textContent = metrics.goals;
    $("#heroDay").textContent = String(metrics.day).padStart(2, "0");
    if ($("#heroDayPlain")) $("#heroDayPlain").textContent = metrics.day;
    $("#momentumCurrent").textContent = metrics.complete;
    $("#momentumTotal").textContent = tasks.length;
    $("#momentumPercent").textContent = `${metrics.progress}%`;
    $("#momentumBar").style.width = `${metrics.progress}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(metrics.progress));

    if ($("#questCompletedDays")) $("#questCompletedDays").textContent = metrics.questDays;
    if ($("#questPercent")) $("#questPercent").textContent = `${metrics.questPercent.toFixed(1)}%`;
    if ($("#questBar")) $("#questBar").style.width = `${Math.max(metrics.questPercent, metrics.questDays > 0 ? 1.5 : 0)}%`;
    if ($("#questSubtext")) $("#questSubtext").textContent = `Day ${metrics.questDays} of 751 Days completed (${metrics.questPercent.toFixed(1)}%)`;

    const milestoneText = metrics.questDays >= 751 ? "Quest Complete! 🏆" : metrics.questDays >= 600 ? "Grandmaster Phase ⚡" : metrics.questDays >= 400 ? "Iron Will Phase 🔥" : metrics.questDays >= 200 ? "Mastery Phase ⚔️" : metrics.questDays >= 100 ? "Centurion Milestone 🛡️" : metrics.questDays > 0 ? "Momentum Building ✦" : "Day 0 · Starting Out";
    if ($("#questMilestoneBadge")) $("#questMilestoneBadge").textContent = `Day ${metrics.questDays} · ${milestoneText}`;

    ["0", "100", "200", "400", "600", "751"].forEach((num) => {
      const dot = $(`#ms${num}`);
      if (dot) dot.classList.toggle("is-reached", metrics.questDays >= Number(num));
    });
    updateTrophyDisplay();
  }

  function renderChart() {
    const values = getWeekProgress();
    const todayIndex = isDemo() ? 3 : (new Date().getDay() + 6) % 7;
    $("#barChart").innerHTML = values.map((value, index) => `<div class="bar-slot ${index === todayIndex ? "today" : ""}"><div class="bar" style="height:${Math.max(value, 2)}%"></div><span>${weekLabels[index]}</span></div>`).join("");
  }

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message; toast.classList.add("is-visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function formatDate(value) {
    const date = new Date(`${value}T12:00:00`);
    return new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date);
  }

  function setDate(value, silent = false) {
    activeDate = value;
    tasks = tasksForDate(activeDate);
    const formatted = formatDate(value);
    $("#dateLabel").textContent = formatted;
    $("#taskDateLabel").textContent = formatted;
    $("#datePicker").value = value;
    renderTasks(); renderChart();
    if (!silent) showToast(`Showing your plan for ${formatted}.`);
  }

  function configureCapture(kind) {
    const settings = {
      note: ["QUICK CAPTURE", "Add a note", "What’s on your mind?", "Write it down before it disappears..."],
      journal: ["DAILY REFLECTION", "Journal your win", "What moved you forward today?", "A small reflection can sharpen tomorrow..."],
      goal: ["NEXT MILESTONE", "Set a goal", "What are you committing to?", "e.g. Finish two coding problems every day"],
    };
    const [kicker, title, label, placeholder] = settings[kind];
    $("#captureKicker").textContent = kicker; $("#captureTitle").textContent = title;
    $("#captureLabel").firstChild.textContent = label; $("#captureInput").placeholder = placeholder;
    $("#captureModal").dataset.kind = kind; $("#captureModal").showModal(); $("#captureInput").focus();
  }

  function goalCard(icon, title, detail, progress, tone) {
    return `<article class="goal-overview ${tone}"><span class="overview-icon">${icon}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p><div class="mini-progress"><span style="width:${progress}%"></span></div><strong>${progress}% complete</strong></div></article>`;
  }

  /* -------------------------------------------------------------
     REAL-TIME LIVE LEADERBOARD (SSE + TOP 10 + USER RANK + ALL RANKS)
     ------------------------------------------------------------- */
  let liveLeaderboardData = { top10: [], allRanks: [], userRank: null, totalUsers: 0, sseConnected: false };
  let leaderboardEventSource = null;
  let leaderboardActiveTab = "top10"; // "top10" | "all"
  let leaderboardSearchQuery = "";

  /* -------------------------------------------------------------
     OWNER ADMIN COMMAND CENTER STATE & HELPERS
     ------------------------------------------------------------- */
  let adminState = { unlocked: false, users: [], messages: [], totalUsers: 0, activeToday: 0, bannedCount: 0, searchQuery: "", activeTab: "users" };

  async function fetchAdminUsers() {
    try {
      const token = auth.getToken();
      const pin = localStorage.getItem("dgt_admin_pin") || "";
      const headers = {
        "x-admin-key": pin
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/admin/users", { headers });
      if (res.ok) {
        const data = await res.json();
        adminState.unlocked = true;
        adminState.users = data.users || [];
        adminState.messages = data.messages || [];
        adminState.totalUsers = data.totalUsers || 0;
        adminState.activeToday = data.activeToday || 0;
        adminState.bannedCount = data.bannedCount || 0;
        if (currentView === "admin") {
          renderSecondaryView("admin");
        }
      } else if (res.status === 403) {
        adminState.unlocked = false;
        if (currentView === "admin") {
          renderSecondaryView("admin");
        }
      }
    } catch (err) {
      console.warn("Admin fetch error:", err);
    }
  }

  async function handleBanUser(email, ban = true) {
    const token = auth.getToken();
    const pin = localStorage.getItem("dgt_admin_pin") || "grind751";
    const headers = {
      "Content-Type": "application/json",
      "x-admin-key": pin
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch("/api/admin/ban", {
        method: "POST",
        headers,
        body: JSON.stringify({ email, ban, reason: ban ? "Permanent ban by Owner Admin" : "" })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(ban ? `🚫 Permanently banned ${email}` : `✅ Unbanned ${email}`);
        await fetchAdminUsers();
        await fetchLeaderboardData();
      } else {
        showToast(data.error || "Failed to update ban status.");
      }
    } catch (err) {
      showToast("Network error executing ban action.");
    }
  }

  async function fetchLeaderboardData() {
    try {
      const token = auth.getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/leaderboard", { headers });
      if (res.ok) {
        const data = await res.json();
        liveLeaderboardData.top10 = data.top10 || [];
        liveLeaderboardData.allRanks = data.allRanks || [];
        liveLeaderboardData.userRank = data.userRank || null;
        liveLeaderboardData.totalUsers = data.totalUsers || (data.allRanks && data.allRanks.length) || (data.top10 ? data.top10.length : 0);
        renderDashboardLeaderboardWidget();
        if (currentView === "leaderboard") {
          renderSecondaryView("leaderboard");
        }
      }
    } catch (e) {
      console.warn("Leaderboard fetch error:", e);
    }
  }

  function initLeaderboardSSE() {
    if (typeof EventSource === "undefined") return;
    if (leaderboardEventSource) {
      try { leaderboardEventSource.close(); } catch (e) {}
    }

    try {
      leaderboardEventSource = new EventSource("/api/leaderboard/stream");

      leaderboardEventSource.onopen = () => {
        liveLeaderboardData.sseConnected = true;
        updateLeaderboardLiveStatus();
      };

      leaderboardEventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "connected") {
            liveLeaderboardData.sseConnected = true;
            updateLeaderboardLiveStatus();
            fetchLeaderboardData();
          } else if (payload.type === "leaderboard_update") {
            liveLeaderboardData.top10 = payload.top10 || [];
            liveLeaderboardData.allRanks = payload.allRanks || [];
            liveLeaderboardData.totalUsers = payload.totalUsers || (liveLeaderboardData.allRanks.length || liveLeaderboardData.top10.length);

            // Trigger real-time alert ticker / toast if someone gained trophies
            if (payload.eventNotice && payload.eventNotice.name) {
              showLeaderboardLiveAlert(payload.eventNotice);
            }

            // Sync user rank with latest data
            const currentUser = auth.current();
            const currentEmail = currentUser ? currentUser.email.toLowerCase() : "";
            if (currentEmail) {
              const matchedInTop10 = (payload.top10 || []).find(u => u.isCurrentUser || (u.email && u.email.toLowerCase() === currentEmail));
              if (matchedInTop10) {
                liveLeaderboardData.userRank = matchedInTop10;
              } else {
                fetchLeaderboardData();
              }
            }

            renderDashboardLeaderboardWidget();
            if (currentView === "leaderboard") {
              renderSecondaryView("leaderboard");
              flashLeaderboardRow(payload.eventNotice);
            }
          }
        } catch (err) {
          console.error("SSE parse error:", err);
        }
      };

      leaderboardEventSource.onerror = () => {
        liveLeaderboardData.sseConnected = false;
        updateLeaderboardLiveStatus();
      };
    } catch (e) {
      console.warn("SSE init error:", e);
    }
  }

  function showLeaderboardLiveAlert(notice) {
    const ticker = $("#leaderboardLiveTicker");
    const safeName = escapeHtml(notice.name || "A grinder");
    const text = `⚡ Real-Time Trophy Update: <strong>${safeName}</strong> earned trophies! Vault balance: <strong>${notice.trophies} 🏆</strong>`;
    if (ticker) {
      ticker.innerHTML = text;
      ticker.hidden = false;
      ticker.classList.remove("ticker-flash");
      void ticker.offsetWidth;
      ticker.classList.add("ticker-flash");
      clearTimeout(ticker._hideTimeout);
      ticker._hideTimeout = setTimeout(() => { ticker.hidden = true; }, 6000);
    }
    if (currentView !== "leaderboard") {
      showToast(`🏆 Live Leaderboard: ${notice.name} just earned trophies (${notice.trophies} 🏆 total)!`);
    }
  }

  function updateLeaderboardLiveStatus() {
    const dot = $("#leaderboardLiveDot");
    const text = $("#leaderboardLiveStatusText");
    if (dot) dot.className = liveLeaderboardData.sseConnected ? "live-dot is-connected" : "live-dot is-reconnecting";
    if (text) text.textContent = liveLeaderboardData.sseConnected ? "LIVE SYNC ACTIVE" : "RECONNECTING...";
  }

  function flashLeaderboardRow(notice) {
    if (!notice || !notice.name) return;
    const rows = document.querySelectorAll(".leaderboard-row, .podium-card");
    rows.forEach(r => {
      if (r.textContent.includes(notice.name)) {
        r.classList.add("rank-row-flash");
        setTimeout(() => r.classList.remove("rank-row-flash"), 2000);
      }
    });
  }

  function renderDashboardLeaderboardWidget() {
    const container = $("#dashboardLeaderboardWidget");
    if (!container) return;
    const top10 = liveLeaderboardData.top10 || [];
    const top3 = top10.slice(0, 3);
    const userRank = liveLeaderboardData.userRank;

    if (top3.length === 0) {
      container.innerHTML = `<div class="lb-widget-empty">No contenders yet. Earn trophies to take #1!</div>`;
      return;
    }

    const rowsHtml = top3.map((u, i) => {
      const medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : '🥉');
      return `
        <div class="lb-widget-row ${u.isCurrentUser ? 'is-self' : ''}">
          <span class="lb-widget-medal">${medal}</span>
          <span class="lb-widget-name">${escapeHtml(u.name)}</span>
          <strong class="lb-widget-trophies">${u.trophies} 🏆</strong>
        </div>`;
    }).join("");

    let userSnippet = "";
    if (userRank) {
      userSnippet = `
        <div class="lb-widget-user-pill">
          <span>Your Rank: <b>#${userRank.rank}</b></span>
          <span><b>${userRank.trophies}</b> Trophies</span>
        </div>`;
    }

    container.innerHTML = `
      <div class="lb-widget-list">${rowsHtml}</div>
      ${userSnippet}
      <button class="lb-widget-full-btn" id="widgetViewLeaderboardBtn" type="button">View Full Top 10 Board →</button>
    `;

    const btn = container.querySelector("#widgetViewLeaderboardBtn");
    if (btn) {
      btn.addEventListener("click", () => navigate("leaderboard"));
    }
  }

  function renderSecondaryView(view) {
    const secondary = $("#secondaryView");
    const metrics = trackerMetrics();
    const pageMeta = {
      vault: ["Trophy Vault & Titles", "Your disciplined achievements, hard-earned titles, and daily trophy ledger.", "🏆"],
      quiz: ["Skill Quiz Arena", "Test your knowledge in Data Science, Web Dev, and AI/ML with 2-minute timed questions & earn vault trophies.", "⚡"],
      leaderboard: ["Global Live Leaderboard", "Real-time rankings of disciplined grinders worldwide. Compete, complete daily tasks, earn trophies, and climb to #1.", "🏅"],
      habits: ["Daily habits", "Small actions repeated become your system.", "◌"],
      goals: ["Your goals", "Three focused goals. One stronger version of you.", "⌁"],
      analytics: ["Analytics", "See the proof of your consistency.", "▥"],
      history: ["Activity History", "Every single day, documented. See what you built.", "◷"],
      journal: ["Journal", "Capture the moments that shaped your day.", "▤"],
      notes: ["Notes", "Keep your ideas close and your mind clear.", "▧"],
      settings: ["Settings", "Make Daily Grind Tracker feel like yours.", "⚙"],
      support: ["Support & Help Center", "Have a question, feedback, or need assistance? We're here for you.", "✉"],
      admin: ["Owner Admin Center", "Manage all registered grinders, check live activity, and manage permanent access bans.", "🛡️"]
    }[view];
    if (!pageMeta) return;
    const [title, subtitle, icon] = pageMeta;
    let content = "";

    if (view === "vault") {
      const totalTrophies = calculateTotalTrophies();
      const progressInfo = getTitleProgress(totalTrophies);
      const ledger = getTrophyLedger();
      const totalEarned = ledger.filter(r => r.type === "reward").reduce((acc, r) => acc + Math.abs(r.trophies), 0);
      const totalPenalties = ledger.filter(r => r.type === "penalty").reduce((acc, r) => acc + Math.abs(r.trophies), 0);

      const unlockedCardsHtml = progressInfo.unlocked.length ? progressInfo.unlocked.map((item) => `
        <article class="title-card title-card-unlocked">
          <div class="title-card-top">
            <span class="title-card-icon">${item.icon}</span>
            <div class="title-card-meta">
              <span class="title-tier-badge">${item.tier} · ${item.trophies} Trophies</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            ${item.id === progressInfo.current.id ? '<span class="title-active-badge">EQUIPPED RANK</span>' : '<span class="title-achieved-badge">UNLOCKED ✓</span>'}
          </div>
          <p class="title-energy">“${escapeHtml(item.energy)}”</p>
          <div class="title-honor-seal">
            <span class="honor-icon">🏅</span>
            <span class="honor-text">You have obtained this title from your hard work and discipline.</span>
          </div>
        </article>
      `).join("") : `
        <article class="empty-collection" style="grid-column: 1 / -1;">
          <span>🌱</span>
          <h3>No Titles Unlocked Yet</h3>
          <p>Complete daily quests to earn trophies. Your first official title <b>🌱 The Starter</b> unlocks at <b>5 Trophies</b>!</p>
        </article>
      `;

      const lockedCardsHtml = TITLES_ROSTER.filter(item => totalTrophies < item.trophies).map((item) => {
        const remaining = item.trophies - totalTrophies;
        return `
          <div class="title-card title-card-locked">
            <div class="locked-icon-wrap">
              <span class="locked-emoji">${item.icon}</span>
              <span class="locked-lock-glyph">🔒</span>
            </div>
            <div class="locked-info">
              <h4>${escapeHtml(item.title)}</h4>
              <small>${item.tier} · Requires ${item.trophies} Trophies</small>
            </div>
            <div class="locked-req-pill">
              <strong>Need ${remaining} more</strong>
            </div>
          </div>
        `;
      }).join("");

      const ledgerRowsHtml = ledger.length ? ledger.map((rec) => {
        const isReward = rec.type === "reward";
        const formattedDate = formatDate(rec.date);
        return `
          <div class="vault-ledger-item ${isReward ? 'is-reward' : 'is-penalty'}">
            <div class="ledger-col-date">
              <strong>${escapeHtml(formattedDate)}</strong>
              <small>${rec.day !== "—" ? `Quest Day ${rec.day}` : "Account Audit"}</small>
            </div>
            <div class="ledger-col-source">
              <span class="ledger-source-tag ${isReward ? 'tag-reward' : 'tag-penalty'}">
                ${isReward ? '🏆 QUEST CONQUERED' : '⚠️ INACTIVITY PENALTY'}
              </span>
              <p class="ledger-source-desc">${escapeHtml(rec.source)}</p>
              ${rec.quote ? `<span class="ledger-quote-snippet">“${escapeHtml(rec.quote)}”</span>` : ''}
            </div>
            <div class="ledger-col-amount">
              <strong class="${isReward ? 'amount-plus' : 'amount-minus'}">
                ${isReward ? `+${rec.trophies}` : `${rec.trophies}`} 🏆
              </strong>
              <small>${isReward ? 'Added to Vault' : 'Deducted'}</small>
            </div>
          </div>
        `;
      }).join("") : `
        <div class="empty-collection">
          <span>📜</span>
          <h3>No Trophy Activity Logged Yet</h3>
          <p>Conquer 100% of today's tasks to earn your first day reward and deposit trophies into your vault.</p>
        </div>
      `;

      content = `
        <div class="vault-layout">
          <!-- Vault Hero Banner -->
          <div class="vault-hero">
            <div class="vault-hero-main">
              <div class="vault-emblem-cluster">
                <div class="vault-emblem-glow"></div>
                <div class="vault-trophy-symbol">🏆</div>
              </div>
              <div class="vault-hero-info">
                <span class="eyebrow">SANCTUM OF DISCIPLINE · 751-DAY QUEST</span>
                <h2>Your Trophy Vault &<br /><em>Disciplined Titles.</em></h2>
                <p>Every trophy in this vault represents an unbroken day of executed promises.</p>
                <div class="vault-rank-pill">
                  <span class="rank-label">CURRENT TITLE:</span>
                  <strong class="rank-name">${progressInfo.current.icon} ${escapeHtml(progressInfo.current.title)}</strong>
                  <span class="rank-tier">(${progressInfo.current.tier})</span>
                </div>
              </div>
            </div>

            <!-- Vault Stat Pills -->
            <div class="vault-stats-grid">
              <div class="vault-stat-box">
                <strong id="vaultHeroBalance">${totalTrophies}</strong>
                <span>VAULT TROPHIES</span>
              </div>
              <div class="vault-stat-box">
                <strong>${progressInfo.unlockedCount}<i>/${progressInfo.totalCount}</i></strong>
                <span>TITLES OBTAINED</span>
              </div>
              <div class="vault-stat-box">
                <strong style="color:#2ecc71;">+${totalEarned}</strong>
                <span>TOTAL REWARDED</span>
              </div>
              <div class="vault-stat-box">
                <strong style="color:${totalPenalties > 0 ? '#ff5252' : '#8899aa'};">-${totalPenalties}</strong>
                <span>PENALTY DEDUCTIONS</span>
              </div>
            </div>
          </div>

          <!-- Next Title Progression Card -->
          <div class="vault-progress-card">
            <div class="vault-progress-header">
              <div>
                <span class="eyebrow">TITLE UNLOCK PROGRESS</span>
                ${progressInfo.next ? `
                  <h3>You have <em>${totalTrophies} ${totalTrophies === 1 ? 'Trophy' : 'Trophies'}</em> — need <em>${progressInfo.needed} more</em> to unlock <b>${progressInfo.next.icon} ${escapeHtml(progressInfo.next.title)}</b></h3>
                ` : `
                  <h3>🏆 Maximum Legendary Rank Achieved! <b>${progressInfo.current.icon} ${escapeHtml(progressInfo.current.title)}</b></h3>
                `}
              </div>
              ${progressInfo.next ? `
                <div class="vault-next-chip">
                  <span>TARGET:</span>
                  <strong>${progressInfo.next.icon} ${escapeHtml(progressInfo.next.title)} (${progressInfo.next.trophies} 🏆)</strong>
                </div>
              ` : ''}
            </div>

            ${progressInfo.next ? `
              <div class="vault-meter-wrap">
                <div class="vault-meter-bar">
                  <div class="vault-meter-fill" style="width: ${progressInfo.progressPercent}%;"></div>
                </div>
                <div class="vault-meter-labels">
                  <span>Current: ${totalTrophies} 🏆 (${escapeHtml(progressInfo.current.title)})</span>
                  <span><strong>${progressInfo.progressPercent}%</strong> toward next rank</span>
                  <span>Goal: ${progressInfo.next.trophies} 🏆 (${escapeHtml(progressInfo.next.title)})</span>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Unlocked Titles Shelf -->
          <div class="vault-section-wrap">
            <div class="vault-section-title">
              <div>
                <span class="eyebrow">HARDWORK & DISCIPLINE HONORS</span>
                <h2>Obtained Titles <em>(${progressInfo.unlockedCount} / ${progressInfo.totalCount})</em></h2>
                <p>Prestigious titles permanently etched in your discipline ledger.</p>
              </div>
            </div>
            <div class="vault-titles-grid">
              ${unlockedCardsHtml}
            </div>
          </div>

          <!-- Upcoming Locked Titles Preview -->
          ${TITLES_ROSTER.some(item => totalTrophies < item.trophies) ? `
            <div class="vault-section-wrap">
              <div class="vault-section-title">
                <div>
                  <span class="eyebrow">THE ROAD AHEAD</span>
                  <h2>Upcoming Locked Titles</h2>
                  <p>Keep your daily streak alive to conquer higher milestone tiers.</p>
                </div>
              </div>
              <div class="vault-locked-grid">
                ${lockedCardsHtml}
              </div>
            </div>
          ` : ''}

          <!-- Daily Trophy History Ledger ("kab kha se kitne trophie mile daily usko") -->
          <div class="vault-section-wrap">
            <div class="vault-section-title">
              <div>
                <span class="eyebrow">AUDITABLE TRANSACTION LOG</span>
                <h2>Daily Trophy History Ledger</h2>
                <p>Complete historical breakdown of when, where, and how many trophies were deposited or penalized.</p>
              </div>
            </div>
            <div class="vault-ledger-container">
              ${ledgerRowsHtml}
            </div>
          </div>
        </div>
      `;
    }

    if (view === "quiz") {
      const sess = (typeof DailyGrindQuiz !== "undefined") ? DailyGrindQuiz.getSession() : { questions: [], completed: true };

      if (sess && sess.questions && sess.questions.length > 0 && !sess.completed) {
        // ACTIVE ARENA VIEW (10 Questions · 5-Minute Master Timer)
        const q = sess.questions[sess.currentIndex];
        const progressPct = Math.round(((sess.currentIndex) / sess.questions.length) * 100);
        const optionsHtml = q.options.map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx);
          const isSelected = currentQuestionSelectedOption === optIdx;
          return `
            <button class="arena-option-btn ${isSelected ? 'is-selected' : ''}" type="button" data-opt-index="${optIdx}">
              <span class="arena-opt-letter">${letter}</span>
              <span class="arena-opt-text">${escapeHtml(opt)}</span>
            </button>
          `;
        }).join("");

        const mins = Math.floor(sess.timeRemaining / 60);
        const secs = sess.timeRemaining % 60;
        const formattedTimer = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        content = `
          <div class="quiz-layout">
            <div class="arena-card">
              <div class="arena-topbar">
                <div class="arena-topic-badge">
                  <span>${sess.topicIcon || '⚡'}</span>
                  <span>${escapeHtml(sess.topicTitle)}</span>
                </div>
                <div style="display:flex; align-items:center; gap:12px;">
                  <span class="arena-counter-pill">Question ${sess.currentIndex + 1} of ${sess.questions.length}</span>
                  <div class="arena-timer-wrap">
                    <span style="font-size:12px;">⏱️</span>
                    <span id="arenaTimerDisplay" class="arena-timer-pill ${sess.timeRemaining <= 60 ? 'timer-warning' : ''} ${sess.timeRemaining <= 20 ? 'timer-danger' : ''}">${formattedTimer}</span>
                  </div>
                </div>
              </div>
              <div class="arena-progress-line">
                <div class="arena-progress-fill" style="width: ${progressPct}%;"></div>
              </div>
              <div class="arena-body">
                <h2 class="arena-question-heading">${escapeHtml(q.q)}</h2>
                ${q.code ? `<pre class="arena-code-block"><code>${escapeHtml(q.code)}</code></pre>` : ''}
                <div class="arena-options-grid">
                  ${optionsHtml}
                </div>
                <div class="arena-footer">
                  <span class="arena-time-tip">⏳ 5:00 Mins Master Countdown · Auto-evaluates at 00:00</span>
                  <button class="arena-next-btn" id="arenaSubmitBtn" type="button" ${currentQuestionSelectedOption === null ? 'disabled' : ''}>
                    ${sess.currentIndex === sess.questions.length - 1 ? 'Finish & View Scorecard ➔' : 'Submit & Next Question ➔'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (activeQuizReport) {
        // HIGH-IMPACT SCORECARD & TROPHY REWARD VIEW
        const rep = activeQuizReport;
        const totalTrophies = calculateTotalTrophies();
        const mins = Math.floor((rep.totalTimeSpent || 0) / 60);
        const secs = (rep.totalTimeSpent || 0) % 60;
        const timeFormatted = `${mins}m ${String(secs).padStart(2, '0')}s`;
        const avgSpeed = Math.round((rep.totalTimeSpent || 0) / (rep.total || 10));
        const targetOffset = (408.4 * (1 - rep.percentage / 100)).toFixed(1);

        const reviewsHtml = rep.review.map((item) => {
          const isCorrect = item.isCorrect;
          const userChosenText = item.userAnswerIndex !== null ? item.options[item.userAnswerIndex] : "No answer selected (Time Expired)";
          const correctText = item.options[item.correctAnswerIndex];

          return `
            <article class="review-card-item ${isCorrect ? 'is-correct' : 'is-wrong'}">
              <div class="review-top-meta">
                <span style="font-family:'DM Mono', monospace; color:#94a3b8;">Question ${item.index} of ${rep.total}</span>
                ${isCorrect 
                  ? '<span class="review-badge-correct">✓ Correct (+1 Mark)</span>' 
                  : '<span class="review-badge-wrong">✗ Incorrect</span>'}
              </div>
              <h4 class="review-q-title">${escapeHtml(item.question)}</h4>
              ${item.code ? `<pre class="arena-code-block" style="margin:8px 0 12px; font-size:12px; padding:10px 14px;"><code>${escapeHtml(item.code)}</code></pre>` : ''}
              <div class="review-ans-row" style="color: ${isCorrect ? '#10b981' : '#f87171'};">
                <strong>Your Answer:</strong> ${escapeHtml(userChosenText)}
              </div>
              ${!isCorrect ? `
                <div class="review-ans-row" style="color: #10b981;">
                  <strong>Correct Answer:</strong> ${escapeHtml(correctText)}
                </div>
              ` : ''}
              <div class="review-explanation-box">
                <b style="color:#ffc107;">💡 Key Insight & Explanation:</b> ${escapeHtml(item.explanation)}
              </div>
            </article>
          `;
        }).join("");

        content = `
          <div class="quiz-layout">
            <div class="showcase-hero-card">
              <span class="showcase-header-eyebrow">⚡ MISSION DEBRIEF · PERFORMANCE SCORECARD</span>
              
              <!-- Circular SVG Radial Meter -->
              <div class="showcase-radial-wrap">
                <svg class="showcase-radial-svg" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#2dd4bf" />
                      <stop offset="100%" stop-color="#ffc107" />
                    </linearGradient>
                  </defs>
                  <circle class="showcase-radial-bg" cx="80" cy="80" r="65" />
                  <circle class="showcase-radial-fill" cx="80" cy="80" r="65" style="--target-offset: ${targetOffset};" />
                </svg>
                <div class="showcase-radial-center">
                  <span class="showcase-score-val" id="animatedScoreNum">${rep.score}<small>/${rep.total}</small></span>
                  <span class="showcase-pct-val" id="animatedPctNum">${rep.percentage}%</span>
                  <span class="showcase-acc-label">ACCURACY</span>
                </div>
              </div>

              <!-- Glowing Rank Crest -->
              <div class="showcase-rank-box">
                <span class="showcase-rank-badge ${rep.percentage >= 70 ? 'rank-elite' : ''}">${escapeHtml(rep.rankTitle)}</span>
                <p class="showcase-rank-desc">${escapeHtml(rep.rankDesc)}</p>
              </div>

              <!-- 4-Stat Metric Tiles -->
              <div class="showcase-stats-grid">
                <div class="showcase-stat-tile">
                  <span class="stat-tile-icon">🎯</span>
                  <strong class="stat-tile-val">${rep.score} / ${rep.total}</strong>
                  <span class="stat-tile-lbl">Correct Answers</span>
                </div>
                <div class="showcase-stat-tile">
                  <span class="stat-tile-icon">⏱️</span>
                  <strong class="stat-tile-val">${timeFormatted}</strong>
                  <span class="stat-tile-lbl">Total Time</span>
                </div>
                <div class="showcase-stat-tile">
                  <span class="stat-tile-icon">⚡</span>
                  <strong class="stat-tile-val">${avgSpeed}s</strong>
                  <span class="stat-tile-lbl">Avg / Question</span>
                </div>
                <div class="showcase-stat-tile">
                  <span class="stat-tile-icon">🏆</span>
                  <strong class="stat-tile-val">${totalTrophies}</strong>
                  <span class="stat-tile-lbl">Vault Balance</span>
                </div>
              </div>

              <!-- Deterministic Trophy Award Banner -->
              <div class="trophy-award-banner ${rep.trophies === 7 ? 'award-gold' : (rep.trophies === 3 ? 'award-silver' : 'award-none')}">
                <canvas id="quizConfettiCanvas" class="quiz-confetti-canvas"></canvas>
                <div class="trophy-award-header">
                  <span class="trophy-award-icon">${rep.trophies === 7 ? '👑' : (rep.trophies === 3 ? '⚔️' : '🌱')}</span>
                  <div>
                    <h3>${rep.trophies === 7 
                      ? 'FLAWLESS 10/10! +7 VAULT TROPHIES AWARDED' 
                      : (rep.trophies === 3 
                        ? 'DISCIPLINED VICTORY! +3 VAULT TROPHIES AWARDED' 
                        : 'CHALLENGER IN TRAINING · 0 TROPHIES')}</h3>
                    <p>${rep.trophies === 7 
                      ? 'Incredible mastery! You scored 10 out of 10. Maximum +7 Trophies deposited directly into your Vault.' 
                      : (rep.trophies === 3 
                        ? `Great work! You scored ${rep.score}/10 (5 or more correct). +3 Trophies deposited directly into your Vault.` 
                        : `You scored ${rep.score}/10. You need at least 5 correct to earn 3 Trophies, or all 10 to earn 7 Trophies.`)}</p>
                  </div>
                </div>
                <div class="trophy-award-pill">
                  <span>🏆 Vault Deposit:</span>
                  <strong>+${rep.trophies} TROPHIES</strong>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="showcase-actions-row">
                <button class="primary-button showcase-play-btn" id="closeQuizBtn" type="button" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#fff; font-weight:800; border:none; padding:12px 26px; border-radius:24px; cursor:pointer;">
                  Close Quiz & Return to Dashboard ➔
                </button>
                <button class="primary-button" id="quizPlayAgainBtn" type="button" style="background:rgba(255,193,7,0.15); border:1px solid rgba(255,193,7,0.4); color:#ffc107; font-weight:700; padding:12px 24px; border-radius:24px; cursor:pointer;">
                  Play Another Domain / Retry ⚡
                </button>
                <button class="primary-button" id="quizViewVaultBtn" type="button" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#cbd5e1; font-weight:700; padding:12px 24px; border-radius:24px; cursor:pointer;">
                  View Trophy Vault (${totalTrophies} 🏆) →
                </button>
              </div>
            </div>

            <!-- Detailed Question Breakdown -->
            <div class="review-section">
              <div class="quiz-section-title">
                <span>📋</span>
                <span>Question-by-Question Detailed Review & Key Insights</span>
              </div>
              ${reviewsHtml}
            </div>
          </div>
        `;
      } else {
        // DOMAIN & TOPIC SELECTION LOBBY VIEW
        const domains = (typeof DailyGrindQuiz !== "undefined") ? DailyGrindQuiz.getDomains() : {};
        const totalTrophies = calculateTotalTrophies();
        const curDomain = domains[quizSelectedDomain] || domains.programming || { title: "Programming", topics: [] };
        const curTopicObj = (curDomain.topics || []).find(t => t.id === quizSelectedTopic) || (curDomain.topics && curDomain.topics[0]) || { name: "Python", icon: "🐍" };

        content = `
          <div class="quiz-layout">
            <div class="quiz-hero-card">
              <div class="quiz-hero-top">
                <div class="quiz-hero-title">
                  <span class="eyebrow" style="color:#ffc107;">SKILL ARENA · MULTI-DOMAIN KNOWLEDGE COMBAT</span>
                  <h2>Test Your Mastery.<br /><em>Earn Vault Trophies.</em></h2>
                  <p>Choose your domain, select your topic, and face 10 timed challenges drawn from LeetCode, GeeksforGeeks, textbooks & competitive exams.</p>
                </div>
                <div class="quiz-hero-vault-badge">
                  <span>🏆 Vault Balance:</span>
                  <strong id="quizVaultBalance">${totalTrophies}</strong>
                </div>
              </div>
              <div class="quiz-pills-row">
                <span class="quiz-pill-item"><span>⚡</span> 10 Questions Per Session</span>
                <span class="quiz-pill-item"><span>⏱️</span> 5-Minute Overall Timer</span>
                <span class="quiz-pill-item"><span>🏆</span> 10/10 Score = +7 Trophies</span>
                <span class="quiz-pill-item"><span>🏆</span> 5-9/10 Score = +3 Trophies</span>
                <span class="quiz-pill-item"><span>💡</span> Daily Non-Repeating Questions</span>
              </div>
            </div>

            <!-- Domain Selection (4 Domains) -->
            <div>
              <div class="quiz-section-title">
                <span>1️⃣</span>
                <span>Choose Your Domain</span>
              </div>
              <div class="quiz-domains-grid">
                ${Object.keys(domains).map(domKey => {
                  const d = domains[domKey];
                  const isSelected = quizSelectedDomain === domKey;
                  return `
                    <article class="quiz-domain-card ${isSelected ? 'is-selected' : ''}" data-domain="${domKey}">
                      <div class="quiz-topic-icon">${d.icon}</div>
                      <h3>${escapeHtml(d.title)}</h3>
                      <p>${escapeHtml(d.desc)}</p>
                      <span class="quiz-domain-count">${d.topics ? d.topics.length : 0} Topics Available</span>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Topic Selection for Selected Domain -->
            <div>
              <div class="quiz-section-title">
                <span>2️⃣</span>
                <span>Select Topic in ${escapeHtml(curDomain.title)}</span>
              </div>
              <div class="quiz-topics-grid">
                ${(curDomain.topics || []).map(t => {
                  const isSelected = quizSelectedTopic === t.id;
                  return `
                    <article class="quiz-topic-card ${isSelected ? 'is-selected' : ''}" data-topic="${t.id}">
                      <div class="quiz-topic-icon">${t.icon}</div>
                      <h3>${escapeHtml(t.name)}</h3>
                      <span class="quiz-topic-tag">${escapeHtml(t.tag || '')}</span>
                    </article>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Launch Bar -->
            <div class="quiz-launch-bar">
              <div class="quiz-launch-meta">
                <strong id="quizSelectedSummary">${curTopicObj.icon} ${escapeHtml(curTopicObj.name)} (${escapeHtml(curDomain.title)})</strong>
                <span>10 Questions · 5-Minute Overall Timer · +7 🏆 for 10/10 · +3 🏆 for 5-9/10</span>
              </div>
              <button class="quiz-start-action-btn" id="startQuizBtn" type="button">
                Enter Combat Arena (10 Questions · 5 Mins) ⚡
              </button>
            </div>
          </div>
        `;
      }
    }

    if (view === "history") {
      const dates = Object.keys(trackerState.dailyTasks).sort().reverse();
      const allActiveDates = dates.filter((d) => hasCompletedTasks(d));
      const totalDaysCount = isDemo() ? 9 : allActiveDates.length;

      const cardsHtml = dates.length ? dates.map((d) => {
        const dayTasks = trackerState.dailyTasks[d] || [];
        const doneCount = dayTasks.filter((t) => t.done).length;
        const rate = taskCompletion(dayTasks);
        const isToday = d === localDateKey();
        const formatted = formatDate(d);
        const dayEntries = trackerState.journal.filter((j) => j.date && j.date.includes(formatted.slice(0, 10).toUpperCase()));
        const reward = trackerState.rewards && trackerState.rewards[d];
        const isConquered = reward || (dayTasks.length > 0 && doneCount === dayTasks.length);
        const earnedDayTrophies = (reward && reward.trophiesEarned) || getTrophiesForDay(reward ? reward.day : (totalDaysCount - index));

        return `
          <article class="history-card" data-history-date="${d}">
            <div class="history-card-header">
              <div class="history-date-info">
                <h3>${escapeHtml(formatted)}</h3>
                ${isToday ? '<span class="history-date-badge">TODAY</span>' : ''}
                ${isConquered ? `<span class="history-badge-reward">🏆 ${reward ? `Day ${reward.day}` : "100%"} Conquered (+${earnedDayTrophies} 🏆)</span>` : ''}
              </div>
              <div class="history-actions">
                <span class="history-rate">${doneCount}/${dayTasks.length} Done (${rate}%)</span>
                <button class="history-jump-btn" type="button" data-jump-date="${d}">Edit this day →</button>
              </div>
            </div>
            <div class="history-task-grid">
              ${dayTasks.map((t) => `
                <div class="history-task-item ${t.done ? "is-done" : ""}">
                  <span class="history-check">${t.done ? "✓" : ""}</span>
                  <span class="task-symbol ${t.type}" style="font-size:13px;">${t.icon}</span>
                  <span class="history-task-label">${escapeHtml(t.label)}</span>
                </div>
              `).join("")}
            </div>
            ${reward ? `
              <div class="history-reward-strip">
                <b>🏆 Daily Reward (+${earnedDayTrophies} 🏆):</b>
                <span>“${escapeHtml(reward.quote)}” — ${escapeHtml(reward.author)}</span>
              </div>
            ` : ""}
            ${dayEntries.length ? `
              <div class="history-notes-strip">
                <b>▤ Journal:</b>
                <span>“${escapeHtml(dayEntries[0].title || dayEntries[0].text)}”</span>
              </div>
            ` : ""}
          </article>
        `;
      }).join("") : `
        <article class="empty-collection">
          <span>◷</span>
          <h3>No recorded history yet</h3>
          <p>Complete tasks today to start building your chronological quest history.</p>
        </article>
      `;

      content = `
        <div class="history-layout">
          <div class="history-hero">
            <div>
              <span class="eyebrow">YOUR DISCIPLINE ARCHIVE</span>
              <h2>History of Every<br /><em>Promise Kept.</em></h2>
              <p>Check any past day to see exactly what you accomplished.</p>
            </div>
            <div class="history-stats-pill">
              <div><strong>${totalDaysCount}</strong><span>DAYS ACTIVE</span></div>
              <div><strong>751</strong><span>QUEST TARGET</span></div>
              <div><strong id="historyTrophiesVal">${calculateTotalTrophies()}</strong><span>TROPHIES EARNED</span></div>
              <div><strong>${metrics.total}</strong><span>TOTAL TASKS</span></div>
            </div>
          </div>
          <div class="history-timeline">
            ${cardsHtml}
          </div>
        </div>
      `;
    }
    if (view === "habits") {
      content = `<div class="habit-summary"><div><span>DONE TODAY</span><strong>${metrics.complete}<i>/${tasks.length}</i></strong></div><div class="large-progress"><span style="width:${metrics.progress}%"></span></div><b>${metrics.progress}%</b></div><div class="habit-grid">${tasks.map((task) => `<button class="habit-tile ${task.done ? "is-done" : ""}" type="button" data-page-task="${task.id}"><span class="habit-tile-icon ${task.type}">${task.icon}</span><span><strong>${escapeHtml(task.label)}</strong><small>${task.done ? "Completed — keep it up" : "Waiting for you"}</small></span><i>${task.done ? "✓" : ""}</i></button>`).join("")}</div>`;
    }
    if (view === "goals") {
      const goals = trackerState.goals;
      const goalCards = goals.length ? goals.map((goal, index) => goalCard(goal.icon || ["⌁", "‹/›", "◆"][index % 3], goal.title, goal.detail || "Start small. Keep your promise.", goal.progress || 0, goal.tone || ["goal-blue", "goal-violet", "goal-coral"][index % 3])).join("") : `<article class="empty-collection"><span>⌁</span><h3>No goals yet</h3><p>Add the one goal that matters most right now.</p></article>`;
      content = `<div class="goal-hero"><div><span class="eyebrow">${goals.length ? "IN PROGRESS" : "START HERE"}</span><h2>Keep the long game<br /><em>in sight.</em></h2><p>Your daily tasks are the vote for each goal.</p></div><button class="primary-button" type="button" data-page-action="goal">Set a goal <span>→</span></button></div><div class="goal-list">${goalCards}</div>`;
    }
    if (view === "analytics") {
      const weeklyValues = getWeekProgress();
      const bestValue = Math.max(...weeklyValues);
      const bestIndex = weeklyValues.indexOf(bestValue);
      const insight = bestValue ? `${weekLabels[bestIndex]} is your strongest day so far. Schedule your hardest task there.` : "Complete your first task to start revealing your strongest day.";
      content = `<div class="analytics-summary"><article><span>THIS WEEK</span><strong>${metrics.weekly}%</strong><small>${metrics.weekly ? "Built from your active days" : "Your first week starts now"}</small></article><article><span>BEST DAY</span><strong>${bestValue ? weekLabels[bestIndex] : "—"}</strong><small>${bestValue ? `${bestValue}% completion` : "No activity yet"}</small></article><article><span>DAY STREAK</span><strong>${metrics.streak}</strong><small>${metrics.streak ? "Keep showing up" : "Start your first streak"}</small></article></div><article class="analytics-chart-card"><div><h2>Your week in motion</h2><p>Each bar is a promise kept.</p></div><div class="wide-chart">${weeklyValues.map((value, index) => `<div class="wide-bar ${value && value === bestValue ? "is-best" : ""}"><b style="height:${Math.max(value, 4)}%"></b><span>${weekLabels[index]}</span></div>`).join("")}</div></article><div class="insight-card"><span>✦</span><p><strong>Consistency insight:</strong> ${insight}</p></div>`;
    }
    if (view === "journal") {
      const entries = trackerState.journal;
      const entryMarkup = entries.length ? entries.map((entry) => `<article><span>${escapeHtml(entry.date)}</span><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.text)}</p></article>`).join("") : `<article class="empty-collection"><span>▤</span><h3>Your journal is empty</h3><p>Capture one win, one lesson, or one honest thought.</p></article>`;
      content = `<div class="journal-layout"><article class="journal-prompt"><span class="eyebrow">TODAY’S PROMPT</span><h2>What did you do today<br />that your future self will <em>thank you for?</em></h2><button class="primary-button" type="button" data-page-action="journal">Write today’s entry <span>→</span></button></article><div class="entry-list">${entryMarkup}</div></div>`;
    }
    if (view === "notes") {
      const notes = trackerState.notes;
      const noteMarkup = notes.length ? notes.map((note, index) => `<article class="note-card ${note.tone || ["blue", "violet", "coral"][index % 3]}"><span>${escapeHtml(note.tag || "NOTE")}</span><p>${escapeHtml(note.text)}</p><small>${escapeHtml(note.date || "Today")}</small></article>`).join("") : `<article class="empty-collection"><span>▧</span><h3>No notes saved</h3><p>Keep a thought before it disappears.</p></article>`;
      content = `<div class="notes-top"><div><span class="eyebrow">YOUR IDEA VAULT</span><h2>Save it before<br />it <em>disappears.</em></h2></div><button class="primary-button" type="button" data-page-action="note">Add a note <span>＋</span></button></div><div class="notes-grid">${noteMarkup}</div>`;
    }
    if (view === "settings") {
      const profile = user();
      const currentMode = getAppMode() === "classic" ? "Classic Mode" : "Basic Mode";
      const avatarHtml = (profile && profile.avatarUrl)
        ? `<img src="${escapeHtml(profile.avatarUrl)}" alt="${escapeHtml(profile.name)}" class="avatar-img" />`
        : initials(profile ? profile.name : "Grinder");

      content = `
        <div class="settings-layout">
          <article class="profile-card profile-card-extended">
            <div class="profile-card-left">
              <div class="avatar-upload-wrap">
                <div class="settings-avatar" id="settingsAvatarPreview">${avatarHtml}</div>
                <label class="avatar-upload-btn" for="avatarFileInput" title="Upload profile picture">
                  📷 Change Photo
                </label>
                <input type="file" id="avatarFileInput" accept="image/*" class="visually-hidden" />
              </div>
              <div class="profile-details">
                <span class="eyebrow">YOUR PROFILE</span>
                <h2 id="profileDisplayName">${escapeHtml(profile.name)}</h2>
                <p id="profileDisplayEmail">${escapeHtml(profile.email)} · <b style="color:#ffca42;">🏆 ${calculateTotalTrophies()} Trophies</b></p>
              </div>
            </div>
            <div class="profile-actions-wrap">
              <button class="edit-profile-btn" id="editProfileToggleBtn" type="button">✏️ Edit Profile</button>
              <a href="login.html" style="color:#9cdbff; font-size:11px; font-weight:700;">Switch account →</a>
            </div>
          </article>

          <!-- Edit Profile Panel (Collapsible) -->
          <article class="edit-profile-panel" id="editProfileFormPanel" style="display:none;">
            <h3>✏️ Edit Your Profile</h3>
            <form id="editProfileForm">
              <label>Display Name (What should we call you?)
                <input type="text" id="editNameInput" value="${escapeHtml(profile.name)}" maxlength="28" required autocomplete="name" />
              </label>
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
                <label class="avatar-upload-btn" for="avatarFileInput" style="padding:7px 14px; font-size:12px;">
                  📷 Choose New Photo
                </label>
                <button type="button" class="history-jump-btn" id="removeAvatarBtn" style="color:#f87171; border-color:rgba(239,68,68,0.3); ${profile.avatarUrl ? '' : 'display:none;'}">
                  🗑 Remove Photo
                </button>
              </div>
              <p id="editProfileStatus" style="font-size:12px; margin:0 0 12px; display:none;"></p>
              <div class="edit-profile-buttons">
                <button type="submit" class="primary-button" id="saveProfileBtn">Save Changes ✓</button>
                <button type="button" class="history-jump-btn" id="cancelEditProfileBtn">Cancel</button>
              </div>
            </form>
          </article>

          <article class="setting-list">
            <div>
              <span><b>🏛️</b> Theme Style: <strong id="settingsModeLabel" style="color:var(--accent,#00d26a);">${currentMode}</strong></span>
              <button class="history-jump-btn" id="settingsModeToggle" type="button">Switch Mode ⇄</button>
            </div>
            <div>
              <div>
                <span><b>⚡</b> Daily Pending Task Reminder</span>
                <small style="display:block; font-size:11px; color:#8ba2bd; margin-top:2px;">Automated alert from support.dailygrind@gmail.com if no tasks are ticked by 8:00 PM</small>
              </div>
              <button class="history-jump-btn" id="sendTestReminderBtn" type="button">Test Reminder ✉</button>
            </div>
            <div>
              <span><b>◒</b> Focus mode</span>
              <button class="toggle" type="button" aria-label="Focus mode disabled"><i></i></button>
            </div>
            <div>
              <span><b>◌</b> Week starts on Monday</span>
              <button class="toggle is-on" type="button" aria-label="Week starts on Monday"><i></i></button>
            </div>
            <div>
              <span><b>✉</b> Need Help or Have Feedback?</span>
              <button class="history-jump-btn" type="button" data-page-action="support">Open Support Center →</button>
            </div>
          </article>

          <article class="danger-zone">
            <div>
              <h3>${isDemo() ? "Demo mode" : "Your tracker data"}</h3>
              <p>${isDemo() ? "Demo changes are not saved. Create an account to begin your own Day 0." : "Your progress is stored privately in this browser for this account."}</p>
            </div>
            <button type="button" data-page-action="dashboard">Back to dashboard</button>
          </article>
        </div>`;
    }
    if (view === "support") {
      const profile = user();
      content = `
        <div class="support-layout">
          <article class="support-contact-card">
            <div class="support-creator-badge">
              <span class="support-creator-avatar">♨</span>
              <div class="support-creator-info">
                <h3>Daily Grind Creator Support</h3>
                <p>Official Developer Helpdesk</p>
              </div>
            </div>
            <p style="font-size:13px; color:#cbd7e7; margin:0; line-height:1.55;">
              Facing an issue with your quest, spotted a bug, or have an idea to sharpen this experience? You have direct access to the creator.
            </p>
            <div class="support-email-pill">
              <div>
                <small style="display:block; font-size:10px; color:#8ba2bd; font-family:'DM Mono', monospace;">SUPPORT EMAIL</small>
                <strong id="supportEmailAddress">support.dailygrind@gmail.com</strong>
              </div>
              <button class="support-copy-btn" id="copyEmailBtn" type="button">Copy 📋</button>
            </div>
            <a class="support-email-btn" href="mailto:support.dailygrind@gmail.com?subject=Daily%20Grind%20Tracker%20Support%20Request">
              ✉ Send Email Directly →
            </a>
          </article>

          <article class="support-form-card">
            <h2>Send Quick Message</h2>
            <p>Your message will be sent straight to the creator and logged in the system.</p>
            <form id="supportFeedbackForm">
              <label>Topic / Category
                <select id="supportCategory">
                  <option value="General Question">General Question</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Idea">Feature Suggestion</option>
                  <option value="751 Quest Help">751-Day Quest Milestone Help</option>
                </select>
              </label>
              <label>Your Message
                <textarea id="supportMessage" required placeholder="Describe your question or feedback in detail..."></textarea>
              </label>
              <button class="primary-button" type="submit" style="width:100%; min-height:44px; margin-top:4px;">
                Submit Message <span>→</span>
              </button>
            </form>
          </article>

          <div class="support-faq-section">
            <div class="panel-heading" style="padding:0; margin-bottom:8px;">
              <h2>Frequently Asked Questions</h2>
            </div>
            <div class="support-faq-grid">
              <div class="support-faq-item">
                <h4><b>✦</b> How does the 751-Day Quest work?</h4>
                <p>Each day you mark grind tasks done increments your quest counter toward the ultimate 751-day discipline milestone.</p>
              </div>
              <div class="support-faq-item">
                <h4><b>🏆</b> How do daily celebration rewards work?</h4>
                <p>Completing 100% of tasks on any day triggers a golden trophy celebration, confetti burst, and a tailored motivational quote.</p>
              </div>
              <div class="support-faq-item">
                <h4><b>🔒</b> Is my progress saved securely?</h4>
                <p>Yes. Your account and history are isolated to your profile, protected by PBKDF2 cryptography, and safely saved in the server database.</p>
              </div>
              <div class="support-faq-item">
                <h4><b>⚡</b> What if I forget to tick my tasks today?</h4>
                <p>If no tasks are checked by 8:00 PM, an automated reminder is sent to your registered Gmail address from support.dailygrind@gmail.com to protect your streak and prevent the 5-day inactivity penalty.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (view === "leaderboard") {
      const top10 = liveLeaderboardData.top10 || [];
      const allRanks = (liveLeaderboardData.allRanks && liveLeaderboardData.allRanks.length) ? liveLeaderboardData.allRanks : top10;
      const userRank = liveLeaderboardData.userRank;
      const totalUsers = liveLeaderboardData.totalUsers || allRanks.length || top10.length;
      const currentUser = auth.current();
      const isUserAuthed = !!currentUser && !isDemo();

      const rank1 = top10[0] || null;
      const rank2 = top10[1] || null;
      const rank3 = top10[2] || null;
      const ranks4to10 = top10.slice(3, 10);

      let userBannerHtml = "";
      if (isUserAuthed) {
        if (userRank) {
          const r = userRank.rank;
          const userTrophies = userRank.trophies || 0;
          let rankPillClass = "rank-pill-top10";
          let badgeIcon = "🔥";
          let rankMessage = "";

          if (r === 1) {
            rankPillClass = "rank-pill-gold";
            badgeIcon = "👑";
            rankMessage = `You are leading the world at <strong>Rank #1</strong>! Absolute Champion!`;
          } else if (r <= 3) {
            rankPillClass = "rank-pill-podium";
            badgeIcon = "🥈";
            rankMessage = `You are on the Arena Podium at <strong>Rank #${r}</strong>! Push for the Crown!`;
          } else if (r <= 10) {
            rankPillClass = "rank-pill-top10";
            badgeIcon = "🔥";
            const diff = (top10[r - 2] ? (top10[r - 2].trophies - userTrophies) : 1);
            rankMessage = `You are <strong>Rank #${r}</strong> in the Top 10! Only ${Math.max(1, diff)} more ${diff === 1 ? 'trophy' : 'trophies'} to overtake #${r - 1}!`;
          } else {
            rankPillClass = "rank-pill-grinder";
            badgeIcon = "⚡";
            const tenthTrophies = top10[9] ? top10[9].trophies : 0;
            const needed = Math.max(1, (tenthTrophies - userTrophies) + 1);
            rankMessage = `You are <strong>Rank #${r}</strong> of ${totalUsers}. Need <strong>${needed}</strong> more ${needed === 1 ? 'trophy' : 'trophies'} to enter Top 10!`;
          }

          userBannerHtml = `
            <div class="user-live-rank-card ${rankPillClass}">
              <div class="user-rank-left">
                <span class="user-rank-badge-icon">${badgeIcon}</span>
                <div>
                  <div class="user-rank-title-row">
                    <span class="user-rank-number">RANK #${r}</span>
                    <span class="user-rank-tag">YOUR LIVE STANDING</span>
                  </div>
                  <p class="user-rank-desc">${rankMessage}</p>
                </div>
              </div>
              <div class="user-rank-right">
                <div class="user-rank-trophy-box">
                  <strong>${userTrophies}</strong>
                  <small>TROPHIES</small>
                </div>
                <button class="primary-button user-rank-grind-btn" id="lbGrindNowBtn" data-page-action="quiz" type="button">Earn Trophies <span>⚡</span></button>
              </div>
            </div>`;
        } else {
          userBannerHtml = `
            <div class="user-live-rank-card rank-pill-grinder">
              <div class="user-rank-left">
                <span class="user-rank-badge-icon">⚡</span>
                <div>
                  <span class="user-rank-number">CALCULATING RANK...</span>
                  <p class="user-rank-desc">Complete daily tasks or play the Skill Arena to earn trophies and lock in your global rank!</p>
                </div>
              </div>
              <div class="user-rank-right">
                <button class="primary-button user-rank-grind-btn" id="lbGrindNowBtn" data-page-action="quiz" type="button">Earn Trophies <span>⚡</span></button>
              </div>
            </div>`;
        }
      } else {
        userBannerHtml = `
          <div class="user-live-rank-card rank-pill-guest">
            <div class="user-rank-left">
              <span class="user-rank-badge-icon">🔒</span>
              <div>
                <span class="user-rank-number">GUEST / PREVIEW MODE</span>
                <p class="user-rank-desc">Create an account or log in to track your trophies and claim your permanent rank on the live global board!</p>
              </div>
            </div>
            <div class="user-rank-right">
              <a href="register.html" class="primary-button user-rank-grind-btn">Join Arena <span>→</span></a>
            </div>
          </div>`;
      }

      function renderPodiumSlot(user, rankNum, modifier) {
        if (!user) {
          return `
            <div class="podium-card podium-${modifier} is-empty">
              <div class="podium-rank-crown">${rankNum === 1 ? '👑' : (rankNum === 2 ? '🥈' : '🥉')}</div>
              <div class="podium-avatar">?</div>
              <h3 class="podium-name">Empty Spot</h3>
              <p class="podium-email">Be the first!</p>
              <div class="podium-trophies">0 <span>🏆</span></div>
              <div class="podium-pedestal"><span class="podium-pedestal-num">#${rankNum}</span></div>
            </div>`;
        }
        const isCurrent = user.isCurrentUser;
        const initial = (user.name || "G").charAt(0).toUpperCase();
        return `
          <div class="podium-card podium-${modifier} ${isCurrent ? 'is-self' : ''}">
            <div class="podium-rank-crown">${rankNum === 1 ? '👑' : (rankNum === 2 ? '🥈' : '🥉')}</div>
            <div class="podium-avatar">${initial}</div>
            <h3 class="podium-name">${escapeHtml(user.name)}${isCurrent ? ' <span class="self-tag">(You)</span>' : ''}</h3>
            <p class="podium-email">${user.emailMasked}</p>
            <div class="podium-trophies">${user.trophies} <span>🏆</span></div>
            <div class="podium-pedestal">
              <span class="podium-pedestal-num">#${rankNum}</span>
              <small class="podium-pedestal-lbl">${rankNum === 1 ? 'CHAMPION' : (rankNum === 2 ? 'RUNNER UP' : 'THIRD PLACE')}</small>
            </div>
          </div>`;
      }

      function renderLeaderboardRow(u) {
        const isSelf = u.isCurrentUser;
        const initial = (u.name || "G").charAt(0).toUpperCase();
        const todayStr = new Date().toISOString().slice(0, 10);
        const isActiveToday = u.lastActive === todayStr;
        return `
          <div class="leaderboard-row ${isSelf ? 'is-self' : ''}">
            <div class="lb-rank-col">
              <span class="lb-rank-badge">#${u.rank}</span>
            </div>
            <div class="lb-user-col">
              <div class="lb-avatar">${initial}</div>
              <div class="lb-user-info">
                <strong>${escapeHtml(u.name)}${isSelf ? ' <em class="self-tag">(You)</em>' : ''}</strong>
                <small>${u.emailMasked}</small>
              </div>
            </div>
            <div class="lb-status-col">
              <span class="lb-status-pill" style="${isActiveToday ? 'background:rgba(34,197,94,0.15); color:#4ade80;' : ''}">${isActiveToday ? '● Active Today' : 'Disciplined Grinder'}</span>
            </div>
            <div class="lb-trophy-col">
              <span class="lb-trophy-val">${u.trophies}</span>
              <span class="lb-trophy-icon">🏆</span>
            </div>
          </div>`;
      }

      const q = (leaderboardSearchQuery || "").trim().toLowerCase();
      const sourceList = (leaderboardActiveTab === "all" || q) ? allRanks : ranks4to10;
      const filteredList = q
        ? allRanks.filter(u => (u.name || "").toLowerCase().includes(q) || (u.emailMasked || "").toLowerCase().includes(q) || String(u.rank) === q.replace("#", ""))
        : sourceList;

      let listRowsHtml = "";
      if (filteredList.length === 0) {
        listRowsHtml = `<div class="empty-state" style="padding:32px; text-align:center;">No competitors found matching "${escapeHtml(q)}".</div>`;
      } else {
        listRowsHtml = filteredList.map(renderLeaderboardRow).join("");
      }

      const isShowingTop10Tab = leaderboardActiveTab === "top10" && !q;

      content = `
        <div class="leaderboard-view-wrap">
          <div class="arena-live-bar">
            <div class="live-status-chip">
              <span class="live-dot is-connected" id="leaderboardLiveDot"></span>
              <span class="live-status-label" id="leaderboardLiveStatusText">LIVE SYNC ACTIVE</span>
            </div>
            <div class="arena-stats-pills">
              <span class="arena-pill"><strong>${totalUsers}</strong> Registered Grinders</span>
              <span class="arena-pill"><strong>Global #1 to #${totalUsers}</strong></span>
              <button class="arena-refresh-btn" id="lbRefreshBtn" type="button" title="Refresh Live Data">↻ Sync</button>
            </div>
          </div>

          <div class="leaderboard-live-ticker" id="leaderboardLiveTicker" hidden></div>

          ${userBannerHtml}

          <div class="lb-tabs-container">
            <div class="lb-tabs-nav">
              <button class="lb-tab-btn ${isShowingTop10Tab ? 'is-active' : ''}" id="lbTabTop10" type="button">🏆 Top 10 Arena</button>
              <button class="lb-tab-btn ${!isShowingTop10Tab ? 'is-active' : ''}" id="lbTabAll" type="button">👥 All Grinders (${totalUsers})</button>
            </div>
            <div class="lb-search-box">
              <span class="lb-search-icon">🔍</span>
              <input type="text" class="lb-search-input" id="lbSearchInput" placeholder="Search grinder name or #rank..." value="${escapeHtml(leaderboardSearchQuery)}" />
            </div>
          </div>

          ${isShowingTop10Tab ? `
            <div class="podium-section">
              <h2 class="podium-section-title">🏆 ARENA PODIUM · TOP 3 CHAMPIONS</h2>
              <div class="podium-container">
                ${renderPodiumSlot(rank2, 2, 'second')}
                ${renderPodiumSlot(rank1, 1, 'first')}
                ${renderPodiumSlot(rank3, 3, 'third')}
              </div>
            </div>

            <div class="leaderboard-table-panel">
              <div class="lb-panel-header">
                <h3>⚔️ Ranks #4 to #10 · Top Contenders</h3>
                <span>Updated Live by Trophies</span>
              </div>
              <div class="leaderboard-list">
                ${listRowsHtml}
              </div>
            </div>
          ` : `
            <div class="leaderboard-table-panel">
              <div class="lb-panel-header">
                <h3>⚔️ All Registered Grinders (#1 to #${totalUsers}) · Official Ranks</h3>
                <span>Every user has a confirmed permanent rank</span>
              </div>
              <div class="leaderboard-list">
                ${listRowsHtml}
              </div>
            </div>
          `}
        </div>
      `;
    }

    if (view === "admin") {
      const storedPin = localStorage.getItem("dgt_admin_pin") || "";
      const isPinValid = storedPin === "grind751" || storedPin === "admin2026";

      if (!adminState.unlocked && !isPinValid) {
        content = `
          <div class="admin-view-wrap">
            <div class="admin-lock-card">
              <div class="admin-lock-icon">🔒</div>
              <h2>Owner Admin Command Center</h2>
              <p style="color:#94a3b8; font-size:13px; margin: 8px 0 20px; line-height:1.5;">
                Restricted access for Daily Grind Tracker creator & administrators. Enter your Master Owner PIN to manage registered grinders, active sessions, and access bans:
              </p>
              <form id="adminUnlockForm">
                <div class="password-input-wrap" style="margin-bottom:12px;">
                  <input type="password" class="admin-pin-field" id="adminPinInput" placeholder="ENTER MASTER PIN" autofocus autocomplete="off" style="margin-bottom:0;" />
                  <button type="button" class="password-toggle-btn" aria-label="Show/Hide PIN" title="Show/Hide PIN">👁️</button>
                </div>
                <div id="adminPinError" style="color:#ef4444; font-size:12px; margin-bottom:12px;" hidden>Invalid PIN. Access denied.</div>
                <button class="primary-button" style="width:100%;" type="submit">Unlock Command Center 🛡️</button>
              </form>
              <div style="margin-top:16px; font-size:11px; color:#64748b;">
                🔒 Confidential Owner Portal · Authorized Access Only
              </div>
            </div>
          </div>
        `;
      } else {
        adminState.unlocked = true;
        if (!adminState.users || adminState.users.length === 0) {
          fetchAdminUsers();
        }

        const users = adminState.users || [];
        const messages = adminState.messages || [];
        const q = (adminState.searchQuery || "").trim().toLowerCase();
        const filtered = q
          ? users.filter(u => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q))
          : users;

        const rowsHtml = filtered.length === 0
          ? `<tr><td colspan="7" style="text-align:center; padding:32px; color:#64748b;">No registered users match your search.</td></tr>`
          : filtered.map(u => {
              const initial = (u.name || "G").charAt(0).toUpperCase();
              const joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "N/A";
              const lastActive = u.lastActiveDate || "Never";
              let statusBadge = "";
              let actionBtn = "";

              if (u.isBanned) {
                statusBadge = `<span class="badge-banned">🔴 BANNED</span>`;
                actionBtn = `<button class="btn-unban-action" data-ban-email="${escapeHtml(u.email)}" data-ban-action="unban" type="button">✅ Unban</button>`;
              } else if (u.isActiveToday) {
                statusBadge = `<span class="badge-active-today">🟢 Active Today</span>`;
                actionBtn = `<button class="btn-ban-action" data-ban-email="${escapeHtml(u.email)}" data-ban-action="ban" type="button">🚫 Ban User</button>`;
              } else {
                statusBadge = `<span class="badge-offline">⚪ Offline</span>`;
                actionBtn = `<button class="btn-ban-action" data-ban-email="${escapeHtml(u.email)}" data-ban-action="ban" type="button">🚫 Ban User</button>`;
              }

              return `
                <tr>
                  <td>
                    <div class="admin-user-cell">
                      <div class="admin-avatar">${initial}</div>
                      <strong>${escapeHtml(u.name)}</strong>
                    </div>
                  </td>
                  <td><span class="admin-email-tag">${escapeHtml(u.email)}</span></td>
                  <td>${joinDate}</td>
                  <td>${lastActive}</td>
                  <td>${statusBadge}</td>
                  <td><strong style="color:#ffc107;">${u.trophies || 0} 🏆</strong></td>
                  <td>${actionBtn}</td>
                </tr>
              `;
            }).join("");

        const messagesHtml = messages.length === 0
          ? `<div style="text-align:center; padding:48px 20px; color:#64748b;">
              <span style="font-size:36px; display:block; margin-bottom:12px;">📭</span>
              <strong style="font-size:15px; color:#cbd5e1; display:block;">No messages received yet</strong>
              <p style="font-size:13px; margin:6px 0 0;">When grinders send a message from the Support & Help section, it will immediately appear right here.</p>
            </div>`
          : messages.map(msg => {
              const initial = (msg.name || "G").charAt(0).toUpperCase();
              const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent";
              return `
                <article class="admin-message-card" style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:18px 20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                      <div class="admin-avatar" style="width:38px; height:38px; font-size:15px;">${initial}</div>
                      <div>
                        <strong style="color:#f8fafc; font-size:15px;">${escapeHtml(msg.name || "Grinder")}</strong>
                        <span class="admin-email-tag" style="margin-left:8px; font-size:12px;">${escapeHtml(msg.email)}</span>
                      </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <span class="badge-active-today" style="background:rgba(96,165,250,0.15); color:#60a5fa; border-color:rgba(96,165,250,0.3); font-size:11px;">🏷️ ${escapeHtml(msg.category || "General")}</span>
                      <small style="color:#94a3b8; font-family:'DM Mono', monospace; font-size:11px;">${dateStr}</small>
                    </div>
                  </div>
                  <div style="background:rgba(2,6,23,0.5); border-left:3px solid #38bdf8; padding:14px 18px; border-radius:0 8px 8px 0; color:#e2e8f0; font-size:13.5px; line-height:1.65; white-space:pre-wrap;">${escapeHtml(msg.message)}</div>
                  <div style="display:flex; justify-content:flex-end; margin-top:12px;">
                    <a href="mailto:${encodeURIComponent(msg.email)}?subject=Regarding%20your%20Daily%20Grind%20Tracker%20ticket:%20${encodeURIComponent(msg.category || 'Support')}" class="primary-button" style="padding:7px 16px; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
                      ✉ Reply to Grinder via Gmail →
                    </a>
                  </div>
                </article>
              `;
            }).join("");

        content = `
          <div class="admin-view-wrap">
            <div class="admin-banner">
              <div class="admin-banner-left">
                <div class="admin-banner-shield">🛡️</div>
                <div>
                  <h2 class="admin-banner-title">OWNER COMMAND CENTER</h2>
                  <p class="admin-banner-subtitle">Real-time user directory, live user messages inbox, and permanent ban management.</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <button class="arena-refresh-btn" id="adminRefreshBtn" type="button">↻ Refresh Directory</button>
                <button class="btn-admin-logout" id="adminLogoutBtn" type="button">🚪 Logout Admin</button>
              </div>
            </div>

            <div class="admin-stats-grid" style="grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));">
              <div class="admin-stat-card">
                <div class="admin-stat-icon stat-icon-users">👥</div>
                <div>
                  <div class="admin-stat-val">${adminState.totalUsers}</div>
                  <div class="admin-stat-lbl">Registered Grinders</div>
                </div>
              </div>
              <div class="admin-stat-card">
                <div class="admin-stat-icon stat-icon-active">🟢</div>
                <div>
                  <div class="admin-stat-val">${adminState.activeToday}</div>
                  <div class="admin-stat-lbl">Active Today</div>
                </div>
              </div>
              <div class="admin-stat-card">
                <div class="admin-stat-icon stat-icon-banned">🚫</div>
                <div>
                  <div class="admin-stat-val">${adminState.bannedCount}</div>
                  <div class="admin-stat-lbl">Banned Users</div>
                </div>
              </div>
              <div class="admin-stat-card">
                <div class="admin-stat-icon" style="background:rgba(96,165,250,0.15); border:1px solid rgba(96,165,250,0.3); color:#60a5fa;">📬</div>
                <div>
                  <div class="admin-stat-val">${messages.length}</div>
                  <div class="admin-stat-lbl">Support Messages</div>
                </div>
              </div>
            </div>

            <!-- Admin Nav Tabs -->
            <div style="display:flex; gap:10px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px;">
              <button class="leaderboard-tab-btn ${adminState.activeTab === 'users' ? 'is-active' : ''}" id="adminTabUsers" type="button">
                👥 Registered Accounts (${users.length})
              </button>
              <button class="leaderboard-tab-btn ${adminState.activeTab === 'messages' ? 'is-active' : ''}" id="adminTabMessages" type="button">
                📬 User Support Messages (${messages.length})
              </button>
            </div>

            ${adminState.activeTab === 'users' ? `
              <div class="admin-table-panel">
                <div class="admin-table-header">
                  <div class="admin-table-title">
                    <span>📋</span>
                    <strong>Registered Accounts Directory (${filtered.length} Users)</strong>
                  </div>
                  <input type="search" class="admin-search-input" id="adminSearchInput" placeholder="Search by name or email..." value="${escapeHtml(adminState.searchQuery || '')}" />
                </div>
                <div class="admin-table-wrapper">
                  <table class="admin-users-table">
                    <thead>
                      <tr>
                        <th>Grinder Name</th>
                        <th>Gmail Address</th>
                        <th>Joined Date</th>
                        <th>Last Active</th>
                        <th>Live Status</th>
                        <th>Trophies</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : `
              <div class="admin-table-panel">
                <div class="admin-table-header">
                  <div class="admin-table-title">
                    <span>📬</span>
                    <strong>Support & Feedback Messages Inbox (${messages.length})</strong>
                  </div>
                  <button class="arena-refresh-btn" id="adminRefreshMessagesBtn" type="button">↻ Reload Messages</button>
                </div>
                <div style="padding:16px; display:grid; gap:14px;">
                  ${messagesHtml}
                </div>
              </div>
            `}
          </div>
        `;
      }
    }

    secondary.innerHTML = `<header class="view-header"><span class="view-icon">${icon}</span><div><p class="eyebrow">DAILY GRIND TRACKER</p><h1>${title}</h1><p>${subtitle}</p></div><button class="view-back" type="button" data-page-action="dashboard">⌂ Dashboard</button></header>${content}`;
    secondary.querySelectorAll("[data-page-task]").forEach((button) => button.addEventListener("click", () => toggleTask(Number(button.dataset.pageTask))));
    secondary.querySelectorAll("[data-page-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.pageAction;
      if (action === "dashboard") { navigate("dashboard"); return; }
      if (action === "support") { navigate("support"); return; }
      if (action === "quiz") { navigate("quiz"); return; }
      if (action === "vault") { navigate("vault"); return; }
      if (action === "leaderboard") { navigate("leaderboard"); return; }
      if (action === "admin") { navigate("admin"); return; }
      configureCapture(action);
    }));

    // Settings: Profile Edit & Avatar Upload
    const editProfileToggleBtn = secondary.querySelector("#editProfileToggleBtn");
    const editProfilePanel = secondary.querySelector("#editProfileFormPanel");
    const cancelEditProfileBtn = secondary.querySelector("#cancelEditProfileBtn");
    const editProfileForm = secondary.querySelector("#editProfileForm");
    const avatarFileInput = secondary.querySelector("#avatarFileInput");
    const settingsAvatarPreview = secondary.querySelector("#settingsAvatarPreview");
    const removeAvatarBtn = secondary.querySelector("#removeAvatarBtn");
    const editNameInput = secondary.querySelector("#editNameInput");
    const editProfileStatus = secondary.querySelector("#editProfileStatus");
    const saveProfileBtn = secondary.querySelector("#saveProfileBtn");

    let stagedAvatarUrl = (user() && user().avatarUrl) || "";

    if (editProfileToggleBtn && editProfilePanel) {
      editProfileToggleBtn.addEventListener("click", () => {
        const isHidden = editProfilePanel.style.display === "none";
        editProfilePanel.style.display = isHidden ? "block" : "none";
        editProfileToggleBtn.textContent = isHidden ? "✕ Close Editor" : "✏️ Edit Profile";
        if (isHidden && editNameInput) {
          editNameInput.focus();
        }
      });
    }

    if (cancelEditProfileBtn && editProfilePanel) {
      cancelEditProfileBtn.addEventListener("click", () => {
        editProfilePanel.style.display = "none";
        if (editProfileToggleBtn) editProfileToggleBtn.textContent = "✏️ Edit Profile";
        stagedAvatarUrl = (user() && user().avatarUrl) || "";
        if (settingsAvatarPreview) {
          if (stagedAvatarUrl) {
            settingsAvatarPreview.innerHTML = `<img src="${escapeHtml(stagedAvatarUrl)}" alt="${escapeHtml(user().name)}" class="avatar-img" />`;
          } else {
            settingsAvatarPreview.textContent = initials(user() ? user().name : "Grinder");
          }
        }
      });
    }

    if (avatarFileInput) {
      avatarFileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          showToast("Please select an image file (PNG, JPG, WEBP, etc.)");
          return;
        }
        if (file.size > 8 * 1024 * 1024) {
          showToast("Image size is too large. Please select an image under 8MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const rawDataUrl = loadEvt.target.result;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxDim = 256;
            let width = img.width;
            let height = img.height;
            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            stagedAvatarUrl = canvas.toDataURL("image/jpeg", 0.85);

            if (settingsAvatarPreview) {
              settingsAvatarPreview.innerHTML = `<img src="${stagedAvatarUrl}" alt="Avatar Preview" class="avatar-img" />`;
            }
            if (removeAvatarBtn) removeAvatarBtn.style.display = "inline-flex";
            if (editProfilePanel && editProfilePanel.style.display === "none") {
              editProfilePanel.style.display = "block";
              if (editProfileToggleBtn) editProfileToggleBtn.textContent = "✕ Close Editor";
            }
            showToast("Photo selected! Click 'Save Changes' to update profile.");
          };
          img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
      });
    }

    if (removeAvatarBtn) {
      removeAvatarBtn.addEventListener("click", () => {
        stagedAvatarUrl = "";
        if (settingsAvatarPreview) {
          const curName = editNameInput ? editNameInput.value.trim() : (user() ? user().name : "Grinder");
          settingsAvatarPreview.textContent = initials(curName);
        }
        removeAvatarBtn.style.display = "none";
        showToast("Photo removed. Click 'Save Changes' to confirm.");
      });
    }

    if (editProfileForm) {
      editProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const newName = (editNameInput ? editNameInput.value : "").trim();
        if (newName.length < 2) {
          showToast("Name must be at least 2 characters long.");
          return;
        }
        if (saveProfileBtn) {
          saveProfileBtn.disabled = true;
          saveProfileBtn.textContent = "Saving...";
        }
        if (editProfileStatus) {
          editProfileStatus.textContent = "Updating your profile...";
          editProfileStatus.style.color = "#60a5fa";
          editProfileStatus.style.display = "block";
        }

        try {
          const updated = await auth.updateProfile({
            name: newName,
            avatarUrl: stagedAvatarUrl
          });
          applyProfile();
          const displayNameEl = secondary.querySelector("#profileDisplayName");
          if (displayNameEl) displayNameEl.textContent = updated.name;
          if (editProfileStatus) {
            editProfileStatus.textContent = "Profile updated successfully! ✨";
            editProfileStatus.style.color = "#10b981";
          }
          showToast("Profile updated successfully! ✨");
          setTimeout(() => {
            if (editProfilePanel) editProfilePanel.style.display = "none";
            if (editProfileToggleBtn) editProfileToggleBtn.textContent = "✏️ Edit Profile";
            if (editProfileStatus) editProfileStatus.style.display = "none";
          }, 800);
        } catch (err) {
          if (editProfileStatus) {
            editProfileStatus.textContent = err.message || "Failed to update profile.";
            editProfileStatus.style.color = "#ef4444";
          }
          showToast(err.message || "Failed to update profile.");
        } finally {
          if (saveProfileBtn) {
            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = "Save Changes ✓";
          }
        }
      });
    }

    const settingsModeBtn = secondary.querySelector("#settingsModeToggle");
    if (settingsModeBtn) {
      settingsModeBtn.addEventListener("click", () => {
        const nextMode = getAppMode() === "classic" ? "basic" : "classic";
        applyMode(nextMode, true);
        const lbl = secondary.querySelector("#settingsModeLabel");
        if (lbl) lbl.textContent = nextMode === "classic" ? "Classic Mode" : "Basic Mode";
      });
    }
    const sendTestReminderBtn = secondary.querySelector("#sendTestReminderBtn");
    if (sendTestReminderBtn) {
      sendTestReminderBtn.addEventListener("click", async () => {
        if (isDemo()) {
          showToast("Create or log in to an account to test email reminders.");
          return;
        }
        const token = auth.getToken();
        sendTestReminderBtn.disabled = true;
        sendTestReminderBtn.textContent = "Sending...";
        try {
          const res = await fetch("/api/reminders/send-test", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast(`⚡ Reminder sent to ${user().email}!`);
          } else {
            showToast(data.error || "Failed to trigger reminder.");
          }
        } catch {
          showToast("Unable to reach server to test reminder.");
        } finally {
          sendTestReminderBtn.disabled = false;
          sendTestReminderBtn.textContent = "Test Reminder ✉";
        }
      });
    }
    secondary.querySelectorAll(".toggle").forEach((button) => button.addEventListener("click", () => { button.classList.toggle("is-on"); button.setAttribute("aria-label", button.classList.contains("is-on") ? "Setting enabled" : "Setting disabled"); showToast(button.classList.contains("is-on") ? "Setting turned on." : "Setting turned off."); }));
    secondary.querySelectorAll("[data-jump-date]").forEach((button) => button.addEventListener("click", () => {
      const targetDate = button.dataset.jumpDate;
      setDate(targetDate);
      navigate("dashboard");
      showToast(`Showing ${formatDate(targetDate)}.`);
    }));
    const copyBtn = secondary.querySelector("#copyEmailBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("support.dailygrind@gmail.com");
          showToast("Copied to clipboard: support.dailygrind@gmail.com");
        } catch {
          showToast("Email: support.dailygrind@gmail.com");
        }
      });
    }
    const feedbackForm = secondary.querySelector("#supportFeedbackForm");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const category = secondary.querySelector("#supportCategory").value;
        const message = secondary.querySelector("#supportMessage").value.trim();
        if (!message) return;
        const profile = user();
        try {
          if (window.location.protocol.startsWith("http")) {
            await fetch("/api/support/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: profile.email, name: profile.name, category, message })
            });
            if (adminState.unlocked) {
              fetchAdminUsers();
            }
          }
        } catch {}
        feedbackForm.reset();
        showToast("Message sent to Admin! Creator has received your message in Admin Center.");
      });
    }
    if (view === "quiz") {
      // Confetti helper
      function triggerQuizConfetti(canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        const particles = [];
        const colors = ["#ffc107", "#2dd4bf", "#10b981", "#f59e0b", "#ffffff", "#38bdf8"];
        for (let i = 0; i < 60; i++) {
          particles.push({
            x: width / 2 + (Math.random() - 0.5) * 60,
            y: height / 2 + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 12,
            vy: -Math.random() * 8 - 4,
            size: Math.random() * 7 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 15,
            alpha: 1
          });
        }
        let frame = 0;
        function renderConfetti() {
          ctx.clearRect(0, 0, width, height);
          let alive = false;
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // gravity
            p.rotation += p.vRot;
            p.alpha -= 0.015;
            if (p.alpha > 0) {
              alive = true;
              ctx.save();
              ctx.globalAlpha = Math.max(0, p.alpha);
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              ctx.fillStyle = p.color;
              ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
              ctx.restore();
            }
          });
          if (alive && frame < 90) {
            frame++;
            requestAnimationFrame(renderConfetti);
          } else {
            ctx.clearRect(0, 0, width, height);
          }
        }
        requestAnimationFrame(renderConfetti);
      }

      // 1. Lobby Domain & Topic Selectors
      secondary.querySelectorAll(".quiz-domain-card").forEach((card) => {
        card.addEventListener("click", () => {
          const domKey = card.dataset.domain;
          if (domKey && domKey !== quizSelectedDomain) {
            quizSelectedDomain = domKey;
            if (typeof DailyGrindQuiz !== "undefined") {
              const d = DailyGrindQuiz.getDomains()[domKey];
              if (d && d.topics && d.topics.length > 0) {
                quizSelectedTopic = d.topics[0].id;
              }
            }
            renderSecondaryView("quiz");
          }
        });
      });

      secondary.querySelectorAll(".quiz-topic-card").forEach((card) => {
        card.addEventListener("click", () => {
          quizSelectedTopic = card.dataset.topic;
          secondary.querySelectorAll(".quiz-topic-card").forEach(c => c.classList.toggle("is-selected", c.dataset.topic === quizSelectedTopic));
          updateLobbySummary();
        });
      });

      function updateLobbySummary() {
        const sumEl = secondary.querySelector("#quizSelectedSummary");
        if (sumEl && typeof DailyGrindQuiz !== "undefined") {
          const domains = DailyGrindQuiz.getDomains();
          const curDomain = domains[quizSelectedDomain] || domains.programming;
          const curTopic = (curDomain.topics || []).find(t => t.id === quizSelectedTopic) || (curDomain.topics && curDomain.topics[0]);
          if (curTopic) {
            sumEl.textContent = `${curTopic.icon} ${curTopic.name} (${curDomain.title})`;
          }
        }
      }

      const startBtn = secondary.querySelector("#startQuizBtn");
      if (startBtn) {
        startBtn.addEventListener("click", () => {
          if (typeof DailyGrindQuiz !== "undefined") {
            trackerState.quizAnsweredIds = trackerState.quizAnsweredIds || [];
            DailyGrindQuiz.startSession(quizSelectedTopic, user().email, localDateKey(), trackerState.quizAnsweredIds);
            currentQuestionSelectedOption = null;
            activeQuizReport = null;
            renderSecondaryView("quiz");
          }
        });
      }

      function finishAndAwardQuiz() {
        if (typeof DailyGrindQuiz === "undefined") return;
        activeQuizReport = DailyGrindQuiz.generateFinalReport();
        const earnedTrophies = activeQuizReport.trophies || 0;

        // Auto-deposit trophies to Vault if score >= 5
        if (earnedTrophies > 0) {
          trackerState.trophies = (Number(trackerState.trophies) || 0) + earnedTrophies;
        }

        trackerState.quizRewards = trackerState.quizRewards || [];
        trackerState.quizRewards.unshift({
          timestamp: Date.now(),
          date: localDateKey(),
          topic: activeQuizReport.topic,
          topicTitle: activeQuizReport.topicTitle,
          score: activeQuizReport.score,
          total: activeQuizReport.total,
          trophies: earnedTrophies,
          rankTitle: activeQuizReport.rankTitle
        });

        // Record answered question IDs so questions don't repeat daily
        trackerState.quizAnsweredIds = trackerState.quizAnsweredIds || [];
        activeQuizReport.review.forEach(r => {
          if (r.id && !trackerState.quizAnsweredIds.includes(r.id)) {
            trackerState.quizAnsweredIds.push(r.id);
          }
        });

        saveTrackerState();
        refreshMetrics();
        updateTrophyDisplay();

        renderSecondaryView("quiz");

        if (earnedTrophies > 0) {
          const confettiCanvas = secondary.querySelector("#quizConfettiCanvas");
          if (confettiCanvas) triggerQuizConfetti(confettiCanvas);
          showToast(`🏆 +${earnedTrophies} ${earnedTrophies === 1 ? 'Trophy' : 'Trophies'} added to your Vault!`);
        }
      }

      // 2. Active Arena bindings (5-Minute Overall Timer)
      const sess = (typeof DailyGrindQuiz !== "undefined") ? DailyGrindQuiz.getSession() : null;
      if (sess && sess.questions && sess.questions.length > 0 && !sess.completed) {
        DailyGrindQuiz.startOverallTimer(
          (secondsLeft) => {
            const timerEl = secondary.querySelector("#arenaTimerDisplay");
            if (!timerEl) return;
            const mins = Math.floor(secondsLeft / 60);
            const secs = secondsLeft % 60;
            timerEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
            timerEl.classList.toggle("timer-warning", secondsLeft <= 60 && secondsLeft > 20);
            timerEl.classList.toggle("timer-danger", secondsLeft <= 20);
          },
          () => {
            // 5 minutes expired! Auto-record current answer and finish quiz
            DailyGrindQuiz.recordAnswer(sess.currentIndex, currentQuestionSelectedOption);
            showToast("⏱️ 5-minute combat timer expired! Submitting final results.");
            finishAndAwardQuiz();
          }
        );

        // Options selection
        secondary.querySelectorAll(".arena-option-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const optIdx = Number(btn.dataset.optIndex);
            currentQuestionSelectedOption = optIdx;
            secondary.querySelectorAll(".arena-option-btn").forEach(b => b.classList.toggle("is-selected", Number(b.dataset.optIndex) === optIdx));
            const subBtn = secondary.querySelector("#arenaSubmitBtn");
            if (subBtn) subBtn.disabled = false;
          });
        });

        // Submit button
        const submitBtn = secondary.querySelector("#arenaSubmitBtn");
        if (submitBtn) {
          submitBtn.addEventListener("click", () => {
            DailyGrindQuiz.recordAnswer(sess.currentIndex, currentQuestionSelectedOption);
            if (sess.currentIndex < sess.questions.length - 1) {
              sess.currentIndex++;
              currentQuestionSelectedOption = null;
              renderSecondaryView("quiz");
            } else {
              finishAndAwardQuiz();
            }
          });
        }
      }

      // 3. Scorecard & Action bindings
      if (activeQuizReport) {
        // Run animated number counter
        const scoreValEl = secondary.querySelector("#animatedScoreNum");
        const pctValEl = secondary.querySelector("#animatedPctNum");
        if (scoreValEl && pctValEl) {
          const targetS = activeQuizReport.score;
          const targetT = activeQuizReport.total;
          const targetP = activeQuizReport.percentage;
          const startT = performance.now();
          function animateNum(now) {
            const elapsed = now - startT;
            const progress = Math.min(1, elapsed / 1000);
            const ease = 1 - Math.pow(1 - progress, 3);
            scoreValEl.innerHTML = `${Math.round(ease * targetS)}<small>/${targetT}</small>`;
            pctValEl.textContent = `${Math.round(ease * targetP)}%`;
            if (progress < 1) requestAnimationFrame(animateNum);
          }
          requestAnimationFrame(animateNum);
        }

        // Close Quiz and Return to Dashboard
        const closeBtn = secondary.querySelector("#closeQuizBtn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            activeQuizReport = null;
            currentQuestionSelectedOption = null;
            if (typeof DailyGrindQuiz !== "undefined") {
              DailyGrindQuiz.stopTimer();
              const s = DailyGrindQuiz.getSession();
              if (s) {
                s.questions = [];
                s.completed = true;
              }
            }
            navigate("dashboard");
          });
        }

        // Play Again / Select another domain
        const playAgainBtn = secondary.querySelector("#quizPlayAgainBtn");
        if (playAgainBtn) {
          playAgainBtn.addEventListener("click", () => {
            activeQuizReport = null;
            currentQuestionSelectedOption = null;
            if (typeof DailyGrindQuiz !== "undefined") {
              DailyGrindQuiz.stopTimer();
              const s = DailyGrindQuiz.getSession();
              if (s) {
                s.questions = [];
                s.completed = true;
              }
            }
            renderSecondaryView("quiz");
          });
        }

        const viewVaultBtn = secondary.querySelector("#quizViewVaultBtn");
        if (viewVaultBtn) {
          viewVaultBtn.addEventListener("click", () => {
            navigate("vault");
          });
        }
      }
    }

    if (view === "leaderboard") {
      const refreshBtn = secondary.querySelector("#lbRefreshBtn");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
          refreshBtn.textContent = "Syncing...";
          fetchLeaderboardData().then(() => {
            showToast("Leaderboard synced with live server.");
          });
        });
      }
      const grindBtn = secondary.querySelector("#lbGrindNowBtn");
      if (grindBtn) {
        grindBtn.addEventListener("click", (e) => {
          e.preventDefault();
          navigate("quiz");
        });
      }
      const tabTop10 = secondary.querySelector("#lbTabTop10");
      if (tabTop10) {
        tabTop10.addEventListener("click", () => {
          leaderboardActiveTab = "top10";
          renderSecondaryView("leaderboard");
        });
      }
      const tabAll = secondary.querySelector("#lbTabAll");
      if (tabAll) {
        tabAll.addEventListener("click", () => {
          leaderboardActiveTab = "all";
          renderSecondaryView("leaderboard");
        });
      }
      const searchInput = secondary.querySelector("#lbSearchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          leaderboardSearchQuery = e.target.value.trim().toLowerCase();
          renderSecondaryView("leaderboard");
          const reInput = secondary.querySelector("#lbSearchInput");
          if (reInput) {
            reInput.focus();
            reInput.setSelectionRange(reInput.value.length, reInput.value.length);
          }
        });
      }
    }

    if (view === "admin") {
      const unlockForm = secondary.querySelector("#adminUnlockForm");
      if (unlockForm) {
        unlockForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const pin = (secondary.querySelector("#adminPinInput").value || "").trim();
          if (pin === "grind751" || pin === "admin2026") {
            localStorage.setItem("dgt_admin_pin", pin);
            adminState.unlocked = true;
            fetchAdminUsers();
          } else {
            const errEl = secondary.querySelector("#adminPinError");
            if (errEl) errEl.hidden = false;
          }
        });
      }

      const adminRefreshBtn = secondary.querySelector("#adminRefreshBtn");
      if (adminRefreshBtn) {
        adminRefreshBtn.addEventListener("click", () => {
          adminRefreshBtn.textContent = "Syncing...";
          fetchAdminUsers().then(() => {
            showToast("Admin directory refreshed.");
          });
        });
      }

      const adminLogoutBtn = secondary.querySelector("#adminLogoutBtn");
      if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
          localStorage.removeItem("dgt_admin_pin");
          adminState.unlocked = false;
          adminState.users = [];
          adminState.messages = [];
          showToast("Successfully logged out of Admin Panel. 🔒");
          navigate("dashboard");
        });
      }

      const tabUsers = secondary.querySelector("#adminTabUsers");
      if (tabUsers) {
        tabUsers.addEventListener("click", () => {
          adminState.activeTab = "users";
          renderSecondaryView("admin");
        });
      }

      const tabMessages = secondary.querySelector("#adminTabMessages");
      if (tabMessages) {
        tabMessages.addEventListener("click", () => {
          adminState.activeTab = "messages";
          renderSecondaryView("admin");
        });
      }

      const refreshMessagesBtn = secondary.querySelector("#adminRefreshMessagesBtn");
      if (refreshMessagesBtn) {
        refreshMessagesBtn.addEventListener("click", () => {
          refreshMessagesBtn.textContent = "Syncing...";
          fetchAdminUsers().then(() => {
            showToast("Support messages refreshed.");
          });
        });
      }

      const adminSearchInput = secondary.querySelector("#adminSearchInput");
      if (adminSearchInput) {
        adminSearchInput.addEventListener("input", (e) => {
          adminState.searchQuery = e.target.value;
          renderSecondaryView("admin");
          const reInput = secondary.querySelector("#adminSearchInput");
          if (reInput) {
            reInput.focus();
            reInput.setSelectionRange(reInput.value.length, reInput.value.length);
          }
        });
      }

      secondary.querySelectorAll("[data-ban-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const email = btn.dataset.banEmail;
          const action = btn.dataset.banAction;
          if (action === "ban") {
            const ok = confirm(`Permanently ban ${email}?\n\nThey will be immediately disconnected and blocked forever from logging in or registering with this Gmail.`);
            if (ok) handleBanUser(email, true);
          } else if (action === "unban") {
            const ok = confirm(`Unban ${email}?\n\nThis will restore access for this Gmail address.`);
            if (ok) handleBanUser(email, false);
          }
        });
      });
    }
  }

  function navigate(view, updateHash = true) {
    const nextView = validViews.includes(view) ? view : "dashboard";
    if (currentView === "quiz" && nextView !== "quiz" && typeof DailyGrindQuiz !== "undefined") {
      DailyGrindQuiz.stopTimer();
    }
    currentView = nextView;
    $("#dashboardView").hidden = nextView !== "dashboard";
    $("#secondaryView").hidden = nextView === "dashboard";
    if (nextView !== "dashboard") renderSecondaryView(nextView);
    $$(".nav-link[data-view]").forEach((link) => link.classList.toggle("is-active", link.dataset.view === nextView));
    page.classList.remove("sidebar-open");
    if (updateHash && window.location.hash !== `#${nextView}`) window.history.pushState(null, "", `#${nextView}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindInteractions() {
    $("#taskSearch").addEventListener("input", (event) => { query = event.target.value.trim().toLowerCase(); renderTasks(); });
    $("#openTaskModal").addEventListener("click", () => { $("#taskModal").showModal(); $("#newTaskName").focus(); });
    $("#taskForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#newTaskName").value.trim(); if (!name) return;
      const type = $("#newTaskCategory").value;
      const icon = { focus: "◆", fitness: "⌁", learning: "‹/›", mindset: "◒" }[type];
      tasks.unshift({ id: Date.now(), label: name, icon, type, done: false }); trackerState.dailyTasks[activeDate] = tasks; saveTrackerState(); renderTasks(); renderChart(); $("#taskModal").close(); event.target.reset(); showToast(isDemo() ? "Demo task added for this preview only." : "Task added. Make it count.");
    });
    $$(".quick-action").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "stats") { const metrics = trackerMetrics(); navigate("analytics"); showToast(metrics.weekly ? `Your weekly momentum is ${metrics.weekly}%.` : "Your progress will appear after your first completed task."); return; }
      configureCapture(action);
    }));
    $("#captureForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const kind = $("#captureModal").dataset.kind;
      const text = $("#captureInput").value.trim();
      if (!text) return;
      $("#captureModal").close(); event.target.reset();
      if (isDemo()) { showToast("Demo mode: this is only a preview. Create an account to save your own data."); return; }
      if (kind === "goal") trackerState.goals.unshift({ title: text, detail: "New goal — add your first action today.", progress: 0 });
      if (kind === "note") trackerState.notes.unshift({ tag: "NOTE", text, date: "Today" });
      if (kind === "journal") trackerState.journal.unshift({ date: formatDate(activeDate).toUpperCase(), title: text.length > 42 ? `${text.slice(0, 42)}…` : text, text });
      saveTrackerState(); refreshMetrics();
      if (currentView === `${kind}s` || (kind === "journal" && currentView === "journal")) renderSecondaryView(currentView);
      showToast(kind === "goal" ? "Goal saved. Now honour the commitment." : "Saved to your daily space.");
    });
    $("#dateButton").addEventListener("click", () => $("#datePicker").showPicker ? $("#datePicker").showPicker() : $("#datePicker").click());
    $("#datePicker").addEventListener("change", (event) => setDate(event.target.value));
    $("#profileButton").addEventListener("click", () => { const menu = $("#profileMenu"); menu.hidden = !menu.hidden; $("#profileButton").setAttribute("aria-expanded", String(!menu.hidden)); });
    document.addEventListener("click", (event) => { if (!event.target.closest(".profile-wrap")) { $("#profileMenu").hidden = true; $("#profileButton").setAttribute("aria-expanded", "false"); } });
    const closeRewardModal = () => {
      stopMotivationalCelebration();
      const modal = $("#rewardModal");
      if (modal && modal.open) {
        modal.close();
        showToast("Day conquered! Daily reward recorded in your Quest History.");
      }
    };
    if ($("#rewardCloseBtn")) $("#rewardCloseBtn").addEventListener("click", closeRewardModal);
    if ($("#claimRewardBtn")) $("#claimRewardBtn").addEventListener("click", closeRewardModal);
    if ($("#rewardModal")) $("#rewardModal").addEventListener("cancel", stopMotivationalCelebration);
    if ($("#userTrophyBadge")) $("#userTrophyBadge").addEventListener("click", () => navigate("vault"));
    if ($("#profileVaultLink")) $("#profileVaultLink").addEventListener("click", (e) => {
      e.preventDefault();
      $("#profileMenu").hidden = true;
      navigate("vault");
    });

    $("#signOutButton").addEventListener("click", async () => { await auth.signOut(); window.location.assign("login.html"); });

    function toggleSidebar() {
      if (window.innerWidth <= 768) {
        page.classList.toggle("sidebar-open");
      } else {
        const isCollapsed = page.classList.toggle("sidebar-collapsed");
        const toggleBtn = $("#sidebarToggleBtn");
        if (toggleBtn) toggleBtn.classList.toggle("is-active", isCollapsed);
      }
    }

    const toggleBtn = $("#sidebarToggleBtn") || $("#menuToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSidebar();
      });
    }

    const collapseBtn = $("#sidebarCollapseBtn");
    if (collapseBtn) {
      collapseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleSidebar();
      });
    }

    const backdrop = $("#sidebarBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        page.classList.remove("sidebar-open");
      });
    }

    $$(".nav-link[data-view]").forEach((link) => link.addEventListener("click", (event) => {
      event.preventDefault();
      page.classList.remove("sidebar-open");
      navigate(link.dataset.view);
    }));
    window.addEventListener("hashchange", () => navigate(window.location.hash.slice(1), false));

    document.addEventListener("click", (e) => {
      const grindBtn = e.target.closest("#lbGrindNowBtn, [data-page-action='quiz']");
      if (grindBtn) {
        e.preventDefault();
        navigate("quiz");
      }
    });
  }

  // Ensure sidebar is always visible and expanded by default
  try {
    localStorage.removeItem("dgt_sidebar_collapsed");
    page.classList.remove("sidebar-collapsed");
    page.classList.remove("sidebar-open");
  } catch (e) {}

  applyProfile(); setDate(activeDate, true); bindInteractions(); initModeSelector(); bindLegalModals(); initLeaderboardSSE(); fetchLeaderboardData(); navigate(window.location.hash.slice(1) || "dashboard", false); syncFromBackend();
  if (window.location.search.includes("testCelebration")) {
    setTimeout(() => {
      triggerDailyReward(activeDate);
    }, 400);
  }
})();
