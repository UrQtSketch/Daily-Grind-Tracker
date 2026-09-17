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
    }

    const register = $("#registerForm");
    if (register) {
      register.addEventListener("submit", async (event) => {
        event.preventDefault();
        const error = $("#registerError");
        error.textContent = "";
        const name = $("#registerName").value.trim();
        const email = $("#registerEmail").value.trim();
        const password = $("#registerPassword").value;
        if (name.length < 2) { error.textContent = "Please tell us your name."; return; }
        if (!email || !password) { error.textContent = "Complete all fields to create your tracker."; return; }
        if (!isGmailAddress(email)) {
          error.textContent = "Only @gmail.com email addresses are allowed.";
          return;
        }
        try {
          await auth.register(name, email, password);
          window.location.assign("index.html");
        } catch (message) {
          error.textContent = message.message;
        }
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
  const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const validViews = ["dashboard", "habits", "goals", "analytics", "history", "journal", "notes", "settings", "support"];

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

  function calculateTotalTrophies() {
    if (typeof trackerState !== "undefined" && trackerState && trackerState.trophies != null && !isNaN(trackerState.trophies)) {
      return Number(trackerState.trophies);
    }
    const rewards = (typeof trackerState !== "undefined" && trackerState?.rewards) || {};
    return Object.values(rewards).reduce((acc, r) => acc + (Number(r.trophiesEarned) || getTrophiesForDay(r.day || 1)), 0);
  }

  function updateTrophyDisplay() {
    const count = calculateTotalTrophies();
    const userBadge = $("#userTrophyCount");
    if (userBadge) userBadge.textContent = count;
    const profileBadge = $("#profileTrophyCount");
    if (profileBadge) profileBadge.textContent = count;
    const historyBadge = $("#historyTrophiesVal");
    if (historyBadge) historyBadge.textContent = count;
  }

  function trackerStorageKey() { return `daily-grind-tracker:${user().email.toLowerCase()}`; }
  function freshTrackerState() { return { dailyTasks: {}, goals: [], notes: [], journal: [], rewards: {}, trophies: 0, lastActiveDate: localDateKey(), recentPenalty: null }; }
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
          if (data.state.trophies != null && !isNaN(data.state.trophies)) {
            trackerState.trophies = Number(data.state.trophies);
          } else {
            trackerState.trophies = calculateTotalTrophies();
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
    $$('[data-avatar]').forEach((node) => { node.textContent = initials(profile.name); });
    $$('[data-profile-email]').forEach((node) => { node.textContent = profile.email; });
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

  function renderSecondaryView(view) {
    const secondary = $("#secondaryView");
    const metrics = trackerMetrics();
    const pageMeta = {
      habits: ["Daily habits", "Small actions repeated become your system.", "◌"],
      goals: ["Your goals", "Three focused goals. One stronger version of you.", "⌁"],
      analytics: ["Analytics", "See the proof of your consistency.", "▥"],
      history: ["Activity History", "Every single day, documented. See what you built.", "◷"],
      journal: ["Journal", "Capture the moments that shaped your day.", "▤"],
      notes: ["Notes", "Keep your ideas close and your mind clear.", "▧"],
      settings: ["Settings", "Make Daily Grind Tracker feel like yours.", "⚙"],
      support: ["Support & Help Center", "Have a question, feedback, or need assistance? We're here for you.", "✉"]
    }[view];
    if (!pageMeta) return;
    const [title, subtitle, icon] = pageMeta;
    let content = "";

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
      content = `<div class="settings-layout"><article class="profile-card"><span class="settings-avatar">${initials(profile.name)}</span><div><span class="eyebrow">YOUR PROFILE</span><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.email)} · <b style="color:#ffca42;">🏆 ${calculateTotalTrophies()} Trophies</b></p></div><a href="login.html">Switch account →</a></article><article class="setting-list"><div><span><b>🏛️</b> Theme Style: <strong id="settingsModeLabel" style="color:var(--accent,#00d26a);">${currentMode}</strong></span><button class="history-jump-btn" id="settingsModeToggle" type="button">Switch Mode ⇄</button></div><div><span><b>✦</b> Daily reminder</span><button class="toggle is-on" type="button" aria-label="Daily reminder enabled"><i></i></button></div><div><span><b>◒</b> Focus mode</span><button class="toggle" type="button" aria-label="Focus mode disabled"><i></i></button></div><div><span><b>◌</b> Week starts on Monday</span><button class="toggle is-on" type="button" aria-label="Week starts on Monday"><i></i></button></div><div><span><b>✉</b> Need Help or Have Feedback?</span><button class="history-jump-btn" type="button" data-page-action="support">Open Support Center →</button></div></article><article class="danger-zone"><div><h3>${isDemo() ? "Demo mode" : "Your tracker data"}</h3><p>${isDemo() ? "Demo changes are not saved. Create an account to begin your own Day 0." : "Your progress is stored privately in this browser for this account."}</p></div><button type="button" data-page-action="dashboard">Back to dashboard</button></article></div>`;
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
                <strong id="supportEmailAddress">sketchfallinlove@gmail.com</strong>
              </div>
              <button class="support-copy-btn" id="copyEmailBtn" type="button">Copy 📋</button>
            </div>
            <a class="support-email-btn" href="mailto:sketchfallinlove@gmail.com?subject=Daily%20Grind%20Tracker%20Support%20Request">
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
            </div>
          </div>
        </div>
      `;
    }
    secondary.innerHTML = `<header class="view-header"><span class="view-icon">${icon}</span><div><p class="eyebrow">DAILY GRIND TRACKER</p><h1>${title}</h1><p>${subtitle}</p></div><button class="view-back" type="button" data-page-action="dashboard">⌂ Dashboard</button></header>${content}`;
    secondary.querySelectorAll("[data-page-task]").forEach((button) => button.addEventListener("click", () => toggleTask(Number(button.dataset.pageTask))));
    secondary.querySelectorAll("[data-page-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.pageAction;
      if (action === "dashboard") { navigate("dashboard"); return; }
      if (action === "support") { navigate("support"); return; }
      configureCapture(action);
    }));
    const settingsModeBtn = secondary.querySelector("#settingsModeToggle");
    if (settingsModeBtn) {
      settingsModeBtn.addEventListener("click", () => {
        const nextMode = getAppMode() === "classic" ? "basic" : "classic";
        applyMode(nextMode, true);
        const lbl = secondary.querySelector("#settingsModeLabel");
        if (lbl) lbl.textContent = nextMode === "classic" ? "Classic Mode" : "Basic Mode";
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
          await navigator.clipboard.writeText("sketchfallinlove@gmail.com");
          showToast("Copied to clipboard: sketchfallinlove@gmail.com");
        } catch {
          showToast("Email: sketchfallinlove@gmail.com");
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
          }
        } catch {}
        feedbackForm.reset();
        showToast("Message sent to creator! We'll review your message.");
      });
    }
  }

  function navigate(view, updateHash = true) {
    const nextView = validViews.includes(view) ? view : "dashboard";
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
      const modal = $("#rewardModal");
      if (modal && modal.open) {
        modal.close();
        showToast("Day conquered! Daily reward recorded in your Quest History.");
      }
    };
    if ($("#rewardCloseBtn")) $("#rewardCloseBtn").addEventListener("click", closeRewardModal);
    if ($("#claimRewardBtn")) $("#claimRewardBtn").addEventListener("click", closeRewardModal);

    $("#signOutButton").addEventListener("click", async () => { await auth.signOut(); window.location.assign("login.html"); });
    $("#menuToggle").addEventListener("click", () => page.classList.toggle("sidebar-open"));
    $$(".nav-link[data-view]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); navigate(link.dataset.view); }));
    window.addEventListener("hashchange", () => navigate(window.location.hash.slice(1), false));
  }

  applyProfile(); setDate(activeDate, true); bindInteractions(); initModeSelector(); bindLegalModals(); navigate(window.location.hash.slice(1) || "dashboard", false); syncFromBackend();
})();
