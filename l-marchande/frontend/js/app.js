/**
 * L-MARCHANDE ENTERPRISE - Frontend Single-Page Application
 * Moteur client natif sans dépendance externe · Performances instantanées
 */

// --- Formatters & Helpers ---
function fmtPrice(n) {
  if (n === undefined || n === null) return "$0.0000";
  const num = Number(n);
  if (num >= 1) return "$" + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return "$" + num.toFixed(4);
}

// --- Platform Icons SVG Map ---
const PLATFORM_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="#00f2ea"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  telegram: `<svg viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="#1DA1F2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  website: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
};

// --- API Client Engine ---
const API = {
  token: localStorage.getItem("lm_token") || "",
  user: null,

  async request(method, path, body = null) {
    const headers = { "Content-Type": "application/json" };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch("/api" + path, opts);
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = { detail: "Erreur serveur inattendue" };
    }
    if (!res.ok) {
      throw new Error(data.detail || data.error || "Requête échouée");
    }
    return data;
  },

  async login(username_or_email, password) {
    const data = await this.request("POST", "/auth/login", { username_or_email, password });
    this.token = data.access_token;
    this.user = data.user;
    localStorage.setItem("lm_token", data.access_token);
    try { localStorage.setItem("lm-user-cache-v1", JSON.stringify(data.user)); } catch (_) {}
    return data;
  },

  async register(username, email, password, role = "worker") {
    const data = await this.request("POST", "/auth/register", { username, email, password, role });
    this.token = data.access_token;
    this.user = data.user;
    localStorage.setItem("lm_token", data.access_token);
    try { localStorage.setItem("lm-user-cache-v1", JSON.stringify(data.user)); } catch (_) {}
    return data;
  },

  async getMe() {
    let cached = null;
    try {
      const raw = localStorage.getItem("lm-user-cache-v1");
      if (raw) cached = JSON.parse(raw);
    } catch (_) {}

    if (cached && cached.id) {
      this.user = cached;
      // Re-validate in background
      this.request("GET", "/auth/me").then(data => {
        if (data && data.user) {
          this.user = data.user;
          try { localStorage.setItem("lm-user-cache-v1", JSON.stringify(data.user)); } catch (_) {}
          updateAppHeader();
        }
      }).catch(() => {
        this.logout();
      });
      return cached;
    }

    try {
      const data = await this.request("GET", "/auth/me");
      this.user = data.user;
      try { localStorage.setItem("lm-user-cache-v1", JSON.stringify(data.user)); } catch (_) {}
      return data.user;
    } catch (e) {
      this.logout();
      return null;
    }
  },

  logout() {
    this.token = "";
    this.user = null;
    localStorage.removeItem("lm_token");
    localStorage.removeItem("lm-user-cache-v1");
    renderGuestView();
    showToast("Déconnexion réussie.", "info");
  }
};

// --- Application State ---
let currentTab = "tasks";
let selectedPlatform = "all";
let authMode = "login"; // 'login' ou 'register'
let activeClaimedExecution = null;
let currentWalletMode = "deposit";

// --- Toast System ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.2s";
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// --- Toggle Password Visibility ---
function togglePasswordVisibility() {
  const inp = document.getElementById("input-password");
  if (inp) {
    inp.type = inp.type === "password" ? "text" : "password";
  }
}

// --- Auth Mode Switcher (Login / Register) ---
function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  const title = document.getElementById("guest-card-title");
  const emailGroup = document.getElementById("group-email");
  const labelUser = document.getElementById("label-username");
  const rowForgot = document.getElementById("row-forgot");
  const btnSubmit = document.getElementById("btn-guest-submit");
  const qText = document.getElementById("text-auth-switch-question");
  const linkSwitch = document.getElementById("link-auth-switch");

  if (authMode === "login") {
    if (title) title.innerText = "Se connecter";
    if (emailGroup) emailGroup.style.display = "none";
    if (labelUser) labelUser.innerText = "E-mail ou nom sur le site";
    if (rowForgot) rowForgot.style.display = "flex";
    if (btnSubmit) btnSubmit.innerText = "Se connecter";
    if (qText) qText.innerText = "Vous n'avez pas encore de compte ?";
    if (linkSwitch) linkSwitch.innerText = "Créer un compte";
  } else {
    if (title) title.innerText = "Créer un compte";
    if (emailGroup) emailGroup.style.display = "flex";
    if (labelUser) labelUser.innerText = "Nom d'utilisateur sur le site";
    if (rowForgot) rowForgot.style.display = "none";
    if (btnSubmit) btnSubmit.innerText = "Créer mon compte";
    if (qText) qText.innerText = "Vous avez déjà un compte ?";
    if (linkSwitch) linkSwitch.innerText = "Se connecter";
  }
}

// --- Handle Guest Auth Submission ---
async function handleGuestAuth(e) {
  e.preventDefault();
  const username = document.getElementById("input-username").value.trim();
  const password = document.getElementById("input-password").value;
  const email = document.getElementById("input-email")?.value.trim() || "";

  try {
    if (authMode === "login") {
      await API.login(username, password);
      showToast("Connexion réussie !", "success");
    } else {
      await API.register(username, email, password, "worker");
      showToast("Compte créé avec succès !", "success");
    }
    renderAppView();
  } catch (err) {
    showToast(err.message || "Erreur d'authentification", "error");
  }
}

// --- Quick Demo Login (Worker / Advertiser) ---
async function loginDemo(role) {
  try {
    if (role === "worker") {
      await API.login("top_worker", "WorkerPass2026!");
      showToast("Session Démo Worker activée !", "success");
    } else {
      await API.login("lux_agency", "AdvertPass2026!");
      showToast("Session Démo Annonceur activée !", "success");
    }
    renderAppView();
  } catch (err) {
    showToast("Échec connexion démo : " + err.message, "error");
  }
}

function handleLogout() {
  API.logout();
}

// --- View Renderers (Guest vs Logged In) ---
function renderGuestView() {
  document.getElementById("view-guest").style.display = "flex";
  document.getElementById("view-app").style.display = "none";
}

function renderAppView() {
  document.getElementById("view-guest").style.display = "none";
  document.getElementById("view-app").style.display = "flex";
  updateAppHeader();
  switchTab("tasks");
}

function updateAppHeader() {
  const u = API.user;
  if (!u) return;
  const balFmt = fmtPrice(u.balance);

  const headerBal = document.getElementById("header-balance");
  if (headerBal) headerBal.innerText = balFmt;

  const sideBal = document.getElementById("side-balance");
  if (sideBal) sideBal.innerText = balFmt;

  const sideUser = document.getElementById("side-username");
  if (sideUser) sideUser.innerText = "@" + u.username;

  const adminNav = document.getElementById("tab-btn-admin");
  if (adminNav) {
    adminNav.style.display = u.role === "admin" ? "flex" : "none";
  }
}

// --- Tab Navigation Switcher ---
function switchTab(tabName) {
  currentTab = tabName;
  const tabs = ["tasks", "my-tasks", "wallet", "orders", "profile", "referrals", "admin"];
  tabs.forEach(t => {
    const sec = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`tab-btn-${t}`);
    if (sec) sec.style.display = t === tabName ? "block" : "none";
    if (btn) btn.classList.toggle("active", t === tabName);
  });

  // Mettre à jour titre et sous-titre
  const titles = {
    tasks: ["Tâches", "Accomplissez des micro-tâches pour être payé immédiatement."],
    "my-tasks": ["Mes tâches", "Consultez l'historique et le statut de vos missions."],
    wallet: ["Portefeuille", "Solde, retraits instantanés et grand livre comptable."],
    orders: ["Campagnes", "Gérez vos commandes d'abonnés et d'interactions."],
    profile: ["Profil & Réseaux", "Associez vos profils sociaux pour exécuter les tâches."],
    referrals: ["Parrainage (10%)", "Invitez vos contacts et touchez 10% de leurs gains à vie."],
    admin: ["Sentinel Admin", "Supervision globale et neutralisation des fraudes."]
  };

  const pTitle = document.getElementById("page-title");
  const pSub = document.getElementById("page-subtitle");
  if (pTitle && titles[tabName]) pTitle.innerText = titles[tabName][0];
  if (pSub && titles[tabName]) pSub.innerText = titles[tabName][1];

  // Chargement spécifique par onglet
  if (tabName === "tasks") loadTasks();
  if (tabName === "my-tasks") loadMyTasks();
  if (tabName === "wallet") loadWallet();
  if (tabName === "orders") loadOrders();
  if (tabName === "profile") loadProfile();
  if (tabName === "referrals") loadReferrals();
  if (tabName === "admin") loadAdmin();
}

// ==========================================================================
// 1. GESTION DES TÂCHES (FEED STYLE PR.SOCIAL)
// ==========================================================================
function filterPlatform(plat) {
  selectedPlatform = plat;
  document.querySelectorAll(".platform-chip").forEach(c => {
    c.classList.toggle("active", c.getAttribute("data-platform") === plat);
  });
  loadTasks();
}

async function loadTasks() {
  const container = document.getElementById("tasks-list");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:30px; font-size:0.8rem; color:var(--text-muted);">Chargement des tâches...</div>`;

  checkActiveClaimedTask();

  try {
    const platQuery = selectedPlatform === "all" ? "" : `&platform=${selectedPlatform}`;
    const data = await API.request("GET", `/tasks?limit=50${platQuery}`);
    const tasks = data.tasks || [];

    // Mettre à jour compteur 'Tous'
    const chipAll = document.getElementById("chip-count-all");
    if (chipAll) chipAll.innerText = data.total || tasks.length;

    if (tasks.length === 0) {
      container.innerHTML = `
        <div style="background:var(--card); border:1px solid var(--border); border-radius:14px; padding:36px; text-align:center;">
          <p style="font-size:0.85rem; font-weight:700; color:#fff;">Aucune tâche disponible dans cette catégorie</p>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Revenez d'ici quelques minutes ou filtrez par un autre réseau.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = tasks.map(t => {
      const iconSvg = PLATFORM_ICONS[t.platform] || PLATFORM_ICONS.website;
      const reward = fmtPrice(t.reward_per_action);
      const remaining = t.remaining_slots || (t.target_quantity - t.completed_quantity);

      return `
        <div class="task-card" onclick="openClaimModal(${t.id})">
          <div class="task-card-row">
            <div class="tc-icon">${iconSvg}</div>
            <div class="tc-body">
              <div class="tc-name">${t.title}</div>
              <div class="tc-sub">
                <span>${t.platform.toUpperCase()}</span>
                <span>·</span>
                <span class="tc-rem">${remaining} restantes</span>
              </div>
            </div>
            <div class="tc-reward">+${reward}</div>
            <button class="btn-start-task" onclick="event.stopPropagation(); openClaimModal(${t.id})">Démarrer</button>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    container.innerHTML = `<div style="text-align:center; color:var(--red); padding:20px;">Erreur de chargement des tâches : ${err.message}</div>`;
  }
}

async function checkActiveClaimedTask() {
  try {
    const data = await API.request("GET", "/tasks/my/list?status=in_progress");
    const active = data.tasks || [];
    const banner = document.getElementById("active-task-banner");

    if (active.length > 0) {
      activeClaimedExecution = active[0];
      if (banner) {
        banner.style.display = "flex";
        const bDesc = document.getElementById("active-banner-desc");
        if (bDesc) bDesc.innerText = `${activeClaimedExecution.title} (+${fmtPrice(activeClaimedExecution.reward_amount)})`;
      }
    } else {
      activeClaimedExecution = null;
      if (banner) banner.style.display = "none";
    }
  } catch (_) {}
}

async function openClaimModal(campaignId) {
  try {
    const res = await API.request("POST", `/tasks/${campaignId}/start`, {});
    activeClaimedExecution = res.execution;
    showTaskModal(res.execution);
    checkActiveClaimedTask();
    showToast("Tâche réservée avec succès ! Vous avez 25 minutes.", "success");
  } catch (err) {
    showToast(err.message || "Impossible de démarrer la tâche.", "error");
  }
}

function showTaskModal(exec) {
  const modal = document.getElementById("modal-task");
  if (!modal) return;

  document.getElementById("m-task-badge").innerText = (exec.platform || "Réseau").toUpperCase();
  document.getElementById("m-task-title").innerText = exec.title || "Mission Réseau";
  document.getElementById("m-task-desc").innerText = exec.description || "Suivez le lien officiel et effectuez l'action demandée.";
  document.getElementById("m-task-reward").innerText = `+${fmtPrice(exec.reward_amount)}`;
  
  const linkBtn = document.getElementById("m-task-url-btn");
  if (linkBtn) linkBtn.href = exec.target_url || "#";

  modal.classList.remove("hidden");
}

function closeTaskModal() {
  const modal = document.getElementById("modal-task");
  if (modal) modal.classList.add("hidden");
}

function resumeClaimedTask() {
  if (activeClaimedExecution) {
    showTaskModal(activeClaimedExecution);
  }
}

async function confirmTaskExecution() {
  if (!activeClaimedExecution) return;
  const btn = document.getElementById("btn-confirm-api-check");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "⏳ Vérification en cours...";
  }

  try {
    const res = await API.request("POST", `/tasks/${activeClaimedExecution.id}/api-check`);
    closeTaskModal();
    showToast(res.message || "Tâche validée avec succès !", "success");
    activeClaimedExecution = null;
    API.getMe();
    loadTasks();
  } catch (err) {
    showToast(err.message || "Échec de validation de la tâche.", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = "⚡ Confirmer (API Check 1-Clic)";
    }
  }
}

async function cancelTaskExecution() {
  if (!activeClaimedExecution) return;
  try {
    await API.request("POST", `/tasks/${activeClaimedExecution.id}/cancel`);
    closeTaskModal();
    activeClaimedExecution = null;
    checkActiveClaimedTask();
    loadTasks();
    showToast("Tâche abandonnée.", "info");
  } catch (err) {
    showToast(err.message || "Erreur lors de l'annulation.", "error");
  }
}

// ==========================================================================
// 2. MES TÂCHES
// ==========================================================================
async function loadMyTasks() {
  const container = document.getElementById("my-tasks-list");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:20px; font-size:0.8rem; color:var(--text-muted);">Chargement de vos tâches...</div>`;

  try {
    const data = await API.request("GET", "/tasks/my/list?status=verified");
    const tasks = data.tasks || [];

    if (tasks.length === 0) {
      container.innerHTML = `<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; padding:30px; text-align:center; font-size:0.8rem; color:var(--text-muted);">Aucune tâche complétée pour le moment.</div>`;
      return;
    }

    container.innerHTML = tasks.map(t => `
      <div class="task-card" style="cursor:default;">
        <div class="task-card-row">
          <div class="tc-icon">${PLATFORM_ICONS[t.platform] || PLATFORM_ICONS.website}</div>
          <div class="tc-body">
            <div class="tc-name">${t.title}</div>
            <div class="tc-sub">Validée le ${t.verified_at || t.claimed_at}</div>
          </div>
          <div class="tc-reward" style="color:var(--green);">+${fmtPrice(t.reward_amount)}</div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<div style="color:var(--red); text-align:center;">Erreur : ${err.message}</div>`;
  }
}

// ==========================================================================
// 3. PORTEFEUILLE & RETRAITS
// ==========================================================================
async function loadWallet() {
  API.getMe().then(u => {
    if (u) {
      const bEl = document.getElementById("wallet-total-bal");
      if (bEl) bEl.innerText = fmtPrice(u.balance);
    }
  });

  const txContainer = document.getElementById("wallet-txs-container");
  if (!txContainer) return;
  txContainer.innerHTML = `<div style="text-align:center; padding:15px; font-size:0.8rem; color:var(--text-muted);">Chargement du grand livre...</div>`;

  try {
    const data = await API.request("GET", "/profile/wallet");
    const txs = data.transactions || [];

    if (txs.length === 0) {
      txContainer.innerHTML = `<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px; text-align:center; font-size:0.78rem; color:var(--text-muted);">Aucune transaction enregistrée.</div>`;
      return;
    }

    txContainer.innerHTML = txs.map(t => {
      const isPos = t.amount >= 0;
      return `
        <div class="task-card" style="cursor:default;">
          <div class="task-card-row">
            <div class="tc-icon" style="font-size:1.1rem; color:${isPos ? 'var(--green)' : 'var(--pc)'}">
              ${isPos ? '↓' : '↑'}
            </div>
            <div class="tc-body">
              <div class="tc-name">${t.description}</div>
              <div class="tc-sub">${t.created_at} · Solde après : ${fmtPrice(t.balance_after)}</div>
            </div>
            <div class="tc-reward" style="color:${isPos ? 'var(--green)' : 'var(--pc)'}">
              ${isPos ? '+' : ''}${fmtPrice(t.amount)}
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    txContainer.innerHTML = `<div style="color:var(--red); text-align:center;">Erreur : ${err.message}</div>`;
  }
}

function openDepositModal() {
  currentWalletMode = "deposit";
  const m = document.getElementById("modal-wallet");
  document.getElementById("m-wallet-title").innerText = "Recharger mon Compte";
  document.getElementById("w-group-details").style.display = "none";
  document.getElementById("w-btn-submit").innerText = "Confirmer le Dépôt";
  if (m) m.classList.remove("hidden");
}

function openWithdrawModal() {
  currentWalletMode = "withdraw";
  const m = document.getElementById("modal-wallet");
  document.getElementById("m-wallet-title").innerText = "Demander un Retrait";
  document.getElementById("w-group-details").style.display = "flex";
  document.getElementById("w-btn-submit").innerText = "Demander le Retrait";
  if (m) m.classList.remove("hidden");
}

function closeWalletModal() {
  const m = document.getElementById("modal-wallet");
  if (m) m.classList.add("hidden");
}

async function handleWalletSubmit(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("w-input-amount").value);
  const method = document.getElementById("w-select-method").value;
  const details = document.getElementById("w-input-details").value;

  const endpoint = currentWalletMode === "deposit" ? "/wallet/deposit" : "/wallet/withdraw";
  const body = currentWalletMode === "deposit" 
    ? { amount, payment_method: method }
    : { amount, payment_method: method, account_details: details };

  try {
    const res = await API.request("POST", endpoint, body);
    closeWalletModal();
    showToast(res.message || "Opération réussie !", "success");
    API.getMe();
    loadWallet();
  } catch (err) {
    showToast(err.message || "Erreur portefeuille.", "error");
  }
}

// ==========================================================================
// 4. CAMPAGNES (ANNONCEURS)
// ==========================================================================
async function loadOrders() {
  const container = document.getElementById("orders-list");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:20px; font-size:0.8rem; color:var(--text-muted);">Chargement de vos campagnes...</div>`;

  try {
    const data = await API.request("GET", "/campaigns");
    const camps = data.campaigns || [];

    if (camps.length === 0) {
      container.innerHTML = `<div style="background:var(--card); border:1px solid var(--border); border-radius:14px; padding:30px; text-align:center; font-size:0.8rem; color:var(--text-muted);">Vous n'avez pas encore créé de campagnes. Cliquez sur "+ Créer une Campagne".</div>`;
      return;
    }

    container.innerHTML = camps.map(c => `
      <div class="task-card" style="cursor:default;">
        <div class="task-card-row">
          <div class="tc-icon">${PLATFORM_ICONS[c.platform] || PLATFORM_ICONS.website}</div>
          <div class="tc-body">
            <div class="tc-name">${c.title}</div>
            <div class="tc-sub">
              Progression : <b>${c.completed_quantity} / ${c.target_quantity}</b> · Budget restant : ${fmtPrice(c.remaining_budget)}
            </div>
          </div>
          <div class="tc-reward" style="font-size:0.8rem; color:var(--text-muted);">${c.status.toUpperCase()}</div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<div style="color:var(--red); text-align:center;">Erreur : ${err.message}</div>`;
  }
}

function openCreateOrderModal() {
  const m = document.getElementById("modal-order");
  if (m) m.classList.remove("hidden");
  calcOrderBudget();
}

function closeOrderModal() {
  const m = document.getElementById("modal-order");
  if (m) m.classList.add("hidden");
}

function calcOrderBudget() {
  const qty = parseInt(document.getElementById("ord-qty")?.value || 100);
  const price = parseFloat(document.getElementById("ord-price")?.value || 0.008);
  const cost = price * 1.4; // 40% marge
  const total = qty * cost;
  const totEl = document.getElementById("ord-total-calc");
  if (totEl) totEl.innerText = fmtPrice(total);
}

async function handleCreateOrder(e) {
  e.preventDefault();
  const title = document.getElementById("ord-title").value;
  const platform = document.getElementById("ord-platform").value;
  const action_type = document.getElementById("ord-action").value;
  const target_url = document.getElementById("ord-url").value;
  const target_quantity = parseInt(document.getElementById("ord-qty").value);
  const reward_per_action = parseFloat(document.getElementById("ord-price").value);

  try {
    const res = await API.request("POST", "/campaigns", {
      title, platform, action_type, target_url, target_quantity, reward_per_action
    });
    closeOrderModal();
    showToast("Campagne déployée avec succès !", "success");
    API.getMe();
    loadOrders();
  } catch (err) {
    showToast(err.message || "Erreur de création de la campagne.", "error");
  }
}

// ==========================================================================
// 5. PROFIL & RÉSEAUX SOCIAUX
// ==========================================================================
async function loadProfile() {
  const container = document.getElementById("socials-list");
  if (!container) return;
  container.innerHTML = `<div style="text-align:center; padding:15px; font-size:0.8rem; color:var(--text-muted);">Chargement des réseaux...</div>`;

  try {
    const data = await API.request("GET", "/profile/socials");
    const accs = data.accounts || [];

    if (accs.length === 0) {
      container.innerHTML = `<div style="font-size:0.75rem; color:var(--text-muted); padding:10px;">Aucun réseau associé pour le moment.</div>`;
      return;
    }

    container.innerHTML = accs.map(a => `
      <div style="background:var(--card-inner); border:1px solid var(--border-subtle); border-radius:10px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:24px; height:24px;">${PLATFORM_ICONS[a.platform] || PLATFORM_ICONS.website}</div>
          <div>
            <b style="font-size:0.82rem; color:#fff;">${a.account_identifier}</b>
            <span style="font-size:0.7rem; color:var(--green); margin-left:6px;">✓ Vérifié</span>
          </div>
        </div>
        <button onclick="removeSocialAccount(${a.id})" style="background:none; border:none; color:var(--red); font-size:0.75rem; cursor:pointer;">Supprimer</button>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<div style="color:var(--red); text-align:center;">Erreur : ${err.message}</div>`;
  }
}

async function removeSocialAccount(id) {
  if (!confirm("Voulez-vous dissocier ce compte ?")) return;
  try {
    await API.request("DELETE", `/profile/socials/${id}`);
    showToast("Compte dissocié.", "info");
    loadProfile();
  } catch (err) {
    showToast(err.message || "Erreur.", "error");
  }
}

// ==========================================================================
// 6. PARRAINAGE (10%)
// ==========================================================================
async function loadReferrals() {
  try {
    const data = await API.request("GET", "/referrals");
    const linkFld = document.getElementById("ref-link-field");
    if (linkFld) linkFld.value = data.referral_link || "";

    const cVal = document.getElementById("ref-count-val");
    if (cVal) cVal.innerText = data.total_referrals || 0;

    const eVal = document.getElementById("ref-earned-val");
    if (eVal) eVal.innerText = fmtPrice(data.total_commission_earned);
  } catch (_) {}
}

function copyRefLink() {
  const fld = document.getElementById("ref-link-field");
  if (fld) {
    navigator.clipboard.writeText(fld.value);
    showToast("Lien de parrainage copié !", "success");
  }
}

// ==========================================================================
// 7. SENTINEL ADMIN
// ==========================================================================
async function loadAdmin() {
  if (!API.user || API.user.role !== "admin") return;

  try {
    const stats = await API.request("GET", "/admin/stats");
    document.getElementById("admin-kpi-u").innerText = stats.total_users;
    document.getElementById("admin-kpi-c").innerText = stats.total_campaigns;
    document.getElementById("admin-kpi-e").innerText = stats.total_executions;

    const usersData = await API.request("GET", "/admin/users");
    const list = document.getElementById("admin-users-list");
    if (list) {
      list.innerHTML = (usersData.users || []).map(u => `
        <div class="task-card" style="cursor:default;">
          <div class="task-card-row">
            <div class="tc-body">
              <div class="tc-name">@${u.username} (${u.email})</div>
              <div class="tc-sub">Rôle : <b>${u.role}</b> · Solde : ${fmtPrice(u.balance)} · Confiance : ${Math.round(u.trust_score)}%</div>
            </div>
            <div>
              ${u.is_banned ? 
                `<button class="btn-demo-chip" onclick="unbanAdmin(${u.id})">Réactiver</button>` :
                `<button class="btn-demo-chip" style="color:var(--red);" onclick="banAdmin(${u.id})">Bannir</button>`
              }
            </div>
          </div>
        </div>
      `).join("");
    }
  } catch (_) {}
}

async function banAdmin(id) {
  if (!confirm(`Bannir l'utilisateur #${id} ?`)) return;
  try {
    await API.request("POST", `/admin/users/${id}/ban`);
    showToast(`Utilisateur #${id} banni.`, "info");
    loadAdmin();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function unbanAdmin(id) {
  try {
    await API.request("POST", `/admin/users/${id}/unban`);
    showToast(`Utilisateur #${id} réactivé.`, "success");
    loadAdmin();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ==========================================================================
// INITIALISATION AU CHARGEMENT DU DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  if (API.token) {
    const user = await API.getMe();
    if (user) {
      renderAppView();
    } else {
      renderGuestView();
    }
  } else {
    renderGuestView();
  }
});
