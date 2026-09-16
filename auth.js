/* Full-Stack Authentication Client with Hybrid Backend Sync and Offline Fallback */
(function () {
  const USERS_KEY = "daily-grind-users";
  const SESSION_KEY = "daily-grind-session";
  const TOKEN_KEY = "daily-grind-token";
  const demoUser = { name: "Sketch", email: "guest@dailygrind.local", isDemo: true };

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function setSession(user, token = null) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, isDemo: !!user.isDemo }));
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  function isHttp() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }

  function validateGmail(email) {
    if (!email || typeof email !== "string") return false;
    const clean = email.trim().toLowerCase();
    const parts = clean.split("@");
    return parts.length === 2 && parts[0].length >= 1 && parts[1] === "gmail.com";
  }

  window.DailyGrindAuth = {
    current() {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
    },
    getToken() {
      return localStorage.getItem(TOKEN_KEY) || "";
    },
    async register(name, email, password) {
      if (!validateGmail(email)) {
        throw new Error("Only @gmail.com email addresses are allowed.");
      }
      if (isHttp()) {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email: email.trim().toLowerCase(), password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Registration failed");
          setSession(data.user, data.token);
          // Also save in local cache
          const users = getUsers();
          if (!users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
            users.push({ name: data.user.name, email: data.user.email, password });
            saveUsers(users);
          }
          return data.user;
        } catch (err) {
          // If server is not reachable on localhost, fallback to client-side
          if (err.message.includes("failed to fetch") || err.message.includes("NetworkError")) {
            console.warn("Backend server not reached, using local fallback");
          } else {
            throw err;
          }
        }
      }

      // Offline / file:/// fallback
      const users = getUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const user = { name: name.trim(), email: email.trim().toLowerCase(), password };
      users.push(user);
      saveUsers(users);
      setSession(user);
      return user;
    },

    async login(email, password) {
      if (!validateGmail(email)) {
        throw new Error("Only @gmail.com email addresses are allowed.");
      }
      if (isHttp()) {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "That email or password doesn’t match.");
          setSession(data.user, data.token);
          return data.user;
        } catch (err) {
          if (err.message.includes("failed to fetch") || err.message.includes("NetworkError")) {
            console.warn("Backend server not reached, using local fallback");
          } else {
            throw err;
          }
        }
      }

      // Offline / file:/// fallback
      const user = getUsers().find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
      if (!user) throw new Error("That email or password doesn’t match.");
      setSession(user);
      return user;
    },

    demo() {
      setSession(demoUser);
      return demoUser;
    },

    async signOut() {
      const token = this.getToken();
      if (isHttp() && token) {
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
          });
        } catch {}
      }
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };
})();
