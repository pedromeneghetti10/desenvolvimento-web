(function () {
  const KEYS = {
    users: "miniSocialUsers",
    currentUserId: "miniSocialCurrentUserId",
    comments: "miniSocialComments",
    theme: "miniSocialTheme"
  };

  const GENERIC_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='100' fill='%23d9dde5'/%3E%3Ccircle cx='100' cy='78' r='36' fill='%2397a0af'/%3E%3Cpath d='M36 174c7-30 33-48 64-48s57 18 64 48' fill='%2397a0af'/%3E%3C/svg%3E";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seedData() {
    const users = read(KEYS.users, null);
    if (!users || users.length === 0) {
      write(KEYS.users, [
        {
          id: 1,
          username: "pedro",
          email: "pedro@exemplo.com",
          password: "123456",
          profile: {
            name: "Pedro Henrique",
            photo: "",
            bio: "",
            interests: ""
          }
        }
      ]);
    }

    const comments = read(KEYS.comments, null);
    if (!comments || comments.length === 0) {
      write(KEYS.comments, [
        {
          id: 1,
          authorId: 1,
          authorName: "Pedro Henrique",
          text: "Bem-vindos a mini rede social!",
          createdAt: new Date().toISOString()
        }
      ]);
    }

    if (!localStorage.getItem(KEYS.theme)) {
      localStorage.setItem(KEYS.theme, "light");
    }
  }

  function getUsers() {
    return read(KEYS.users, []);
  }

  function saveUsers(users) {
    write(KEYS.users, users);
  }

  function getCurrentUser() {
    const id = Number(localStorage.getItem(KEYS.currentUserId));
    if (!id) return null;
    return getUsers().find((u) => u.id === id) || null;
  }

  function getUserById(id) {
    return getUsers().find((u) => u.id === Number(id)) || null;
  }

  function setCurrentUser(id) {
    localStorage.setItem(KEYS.currentUserId, String(id));
  }

  function logout() {
    localStorage.removeItem(KEYS.currentUserId);
    window.location.href = "login.html";
  }

  function registerUser(data) {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { ok: false, message: "Este email ja esta cadastrado." };
    }

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const user = {
      id: nextId,
      username: data.username,
      email: data.email,
      password: data.password,
      profile: {
        name: data.username,
        photo: data.photo || "",
        bio: data.bio || "",
        interests: data.interests || ""
      }
    };

    users.push(user);
    saveUsers(users);
    setCurrentUser(user.id);
    return { ok: true, user };
  }

  function login(email, password) {
    const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { ok: false, message: "Email ou senha invalidos." };
    }

    setCurrentUser(user.id);
    return { ok: true, user };
  }

  function updateCurrentUserProfile(profilePatch) {
    const current = getCurrentUser();
    if (!current) return { ok: false, message: "Usuario nao autenticado." };

    const users = getUsers();
    const index = users.findIndex((u) => u.id === current.id);
    if (index === -1) return { ok: false, message: "Usuario nao encontrado." };

    users[index].profile = {
      ...users[index].profile,
      ...profilePatch
    };

    if (profilePatch.name) {
      users[index].username = profilePatch.name;
    }

    saveUsers(users);
    return { ok: true, user: users[index] };
  }

  function getComments() {
    return read(KEYS.comments, []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function addComment(text) {
    const current = getCurrentUser();
    if (!current) {
      return { ok: false, message: "Faca login para comentar." };
    }

    const comments = getComments();
    const nextId = comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1;

    comments.push({
      id: nextId,
      authorId: current.id,
      authorName: current.profile.name || current.username,
      text,
      createdAt: new Date().toISOString()
    });

    write(KEYS.comments, comments);
    return { ok: true };
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString("pt-BR");
  }

  function renderAuthState() {
    const current = getCurrentUser();
    const loginLinks = document.querySelectorAll(".when-guest");
    const userLinks = document.querySelectorAll(".when-user");
    const userNameTargets = document.querySelectorAll("[data-user-name]");

    loginLinks.forEach((el) => {
      el.style.display = current ? "none" : "";
    });

    userLinks.forEach((el) => {
      el.style.display = current ? "" : "none";
    });

    userNameTargets.forEach((el) => {
      el.textContent = current ? (current.profile.name || current.username) : "Visitante";
    });

    document.querySelectorAll("[data-logout]").forEach((btn) => {
      btn.onclick = logout;
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem(KEYS.theme, theme);
  }

  function setupThemeControls() {
    const currentTheme = localStorage.getItem(KEYS.theme) || "light";
    applyTheme(currentTheme);

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    });
  }

  function requireAuth() {
    if (!getCurrentUser()) {
      window.location.href = "login.html";
      return false;
    }
    return true;
  }

  function setActiveNav() {
    const file = window.location.pathname.split("/").pop() || "home.html";
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.getAttribute("href") === file) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
        const hiddenParent = a.closest(".when-guest, .when-user");
        if (hiddenParent) {
          hiddenParent.style.display = "";
        }
      }
    });
  }

  function getProfilePhotoUrl(user) {
    const photo = user?.profile?.photo?.trim();
    return photo ? photo : GENERIC_AVATAR;
  }

  seedData();

  window.MiniSocial = {
    getCurrentUser,
    getUserById,
    registerUser,
    login,
    logout,
    getComments,
    addComment,
    formatDate,
    updateCurrentUserProfile,
    renderAuthState,
    setupThemeControls,
    requireAuth,
    setActiveNav,
    applyTheme,
    getProfilePhotoUrl,
    KEYS
  };
})();
