/**
 * L-MARCHANDE ENTERPRISE - Frontend Single Page Application Engine
 * Architecture réactive, gestion d'état locale, graphiques dynamiques et Sentinel anti-fraude.
 */

// --- Global State ---
const State = {
    token: localStorage.getItem("lm_token") || "",
    user: JSON.parse(localStorage.getItem("lm_user") || "null"),
    currentView: "tasks",
    activePlatformFilter: "all",
    tasks: [],
    activeExecution: null,
    earningsChart: null,
    walletMode: "deposit",
    authMode: "login"
};

const API_BASE = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
    ? "" 
    : "";

// --- Headers Helper ---
function getAuthHeaders() {
    const headers = { "Content-Type": "application/json" };
    if (State.token) {
        headers["Authorization"] = `Bearer ${State.token}`;
    }
    return headers;
}

// --- Toast System ---
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `pointer-events-auto flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl transition transform translate-y-2 opacity-0 duration-300 ${
        type === "success" 
            ? "bg-slate-900 border border-emerald-500/40 text-emerald-300" 
            : type === "error"
            ? "bg-slate-900 border border-rose-500/40 text-rose-300"
            : "bg-slate-900 border border-cyan-500/40 text-cyan-300"
    }`;

    const icon = type === "success" ? "check-circle" : type === "error" ? "alert-circle" : "info";
    toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i><span>${message}</span>`;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-2");
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- Navigation Controller ---
function navigate(viewName) {
    State.currentView = viewName;
    const views = ["tasks", "dashboard", "campaigns", "socials", "wallet", "referrals", "admin"];
    
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        const btn = document.getElementById(`nav-btn-${v}`);
        if (el) el.classList.add("hidden");
        if (btn) {
            btn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200 hover:bg-slate-800/50 transition";
        }
    });

    const activeEl = document.getElementById(`view-${viewName}`);
    const activeBtn = document.getElementById(`nav-btn-${viewName}`);
    if (activeEl) activeEl.classList.remove("hidden");
    if (activeBtn) {
        activeBtn.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 transition";
    }

    // Vue spécifique déclencheurs
    if (viewName === "tasks") loadTasks();
    if (viewName === "dashboard") loadDashboard();
    if (viewName === "campaigns") loadCampaigns();
    if (viewName === "socials") loadSocialAccounts();
    if (viewName === "wallet") loadWallet();
    if (viewName === "referrals") loadReferrals();
    if (viewName === "admin") loadAdmin();

    lucide.createIcons();
}

// --- UI Updates ---
function updateAuthUI() {
    const guestControls = document.getElementById("auth-guest-controls");
    const userControls = document.getElementById("auth-user-controls");
    const adminSection = document.getElementById("admin-sidebar-section");

    if (State.user && State.token) {
        if (guestControls) guestControls.classList.add("hidden");
        if (userControls) userControls.classList.remove("hidden");

        const balEl = document.getElementById("user-balance-badge");
        if (balEl) balEl.innerText = `$${parseFloat(State.user.balance || 0).toFixed(4)}`;

        const trustEl = document.getElementById("user-trust-score");
        if (trustEl) trustEl.innerText = `${Math.round(State.user.trust_score || 100)}%`;

        const nameEl = document.getElementById("user-username-display");
        if (nameEl) nameEl.innerText = `@${State.user.username}`;

        const dropEmail = document.getElementById("dropdown-email");
        if (dropEmail) dropEmail.innerText = State.user.email;

        const initials = document.getElementById("user-avatar-initials");
        if (initials) initials.innerText = (State.user.username || "U").substring(0, 2).toUpperCase();

        if (adminSection) {
            if (State.user.role === "admin") {
                adminSection.classList.remove("hidden");
            } else {
                adminSection.classList.add("hidden");
            }
        }
    } else {
        if (guestControls) guestControls.classList.remove("hidden");
        if (userControls) userControls.classList.add("hidden");
        if (adminSection) adminSection.classList.add("hidden");
    }
}

// --- Public Platform Ticker Stats ---
async function fetchPublicStats() {
    try {
        const res = await fetch(`${API_BASE}/api/public/stats`);
        if (res.ok) {
            const data = await res.json();
            const wEl = document.getElementById("ticker-workers");
            const tEl = document.getElementById("ticker-tasks");
            const pEl = document.getElementById("ticker-paid");
            if (wEl) wEl.innerText = `${data.active_workers.toLocaleString()}+`;
            if (tEl) tEl.innerText = `${data.completed_tasks.toLocaleString()}+`;
            if (pEl) pEl.innerText = `$${data.total_paid_out.toLocaleString()}+`;
        }
    } catch (e) {
        console.error("Erreur stats publiques", e);
    }
}

// --- User Profile Sync ---
async function syncUserProfile() {
    if (!State.token) return;
    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            State.user = data.user;
            localStorage.setItem("lm_user", JSON.stringify(data.user));
            updateAuthUI();
        } else if (res.status === 401) {
            logout();
        }
    } catch (e) {
        console.error("Erreur sync user", e);
    }
}

// ==============================================================================
// 1. GESTION DES TÂCHES (WORKERS)
// ==============================================================================
function filterTasks(platform) {
    State.activePlatformFilter = platform;
    document.querySelectorAll(".platform-filter-btn").forEach(btn => {
        if (btn.getAttribute("data-platform") === platform) {
            btn.className = "platform-filter-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 transition";
        } else {
            btn.className = "platform-filter-btn px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-gray-300 hover:text-white transition";
        }
    });
    loadTasks();
}

async function loadTasks() {
    const container = document.getElementById("tasks-container");
    if (!container) return;

    if (!State.token) {
        container.innerHTML = `
            <div class="col-span-full p-8 text-center glass-panel rounded-3xl border border-cardborder">
                <i data-lucide="lock" class="w-10 h-10 mx-auto text-cyan-400 mb-3"></i>
                <h3 class="text-base font-bold text-white">Connectez-vous pour accéder au flux de missions</h3>
                <p class="text-xs text-gray-400 mt-1 max-w-md mx-auto">Créez un compte gratuit ou utilisez la connexion démo pour exécuter des missions rémunérées.</p>
                <button onclick="openAuthModal('login')" class="mt-4 px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition">
                    Se Connecter Immédiatement
                </button>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = `<div class="col-span-full py-12 text-center text-xs text-gray-400">Chargement des missions disponibles...</div>`;

    try {
        const platParam = State.activePlatformFilter === "all" ? "" : `&platform=${State.activePlatformFilter}`;
        const res = await fetch(`${API_BASE}/api/tasks?limit=50${platParam}`, { headers: getAuthHeaders() });
        const data = await res.json();
        State.tasks = data.tasks || [];

        // Vérifier si l'utilisateur a des tâches en cours
        checkActiveTasks();

        if (State.tasks.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center glass-panel rounded-3xl border border-cardborder">
                    <i data-lucide="check-circle" class="w-10 h-10 mx-auto text-emerald-400 mb-2"></i>
                    <h3 class="text-sm font-bold text-white">Aucune nouvelle mission disponible pour ce filtre</h3>
                    <p class="text-xs text-gray-400 mt-1">Revenez dans quelques instants ou sélectionnez un autre réseau social.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const platformBadges = {
            instagram: { icon: "camera", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20", text: "text-fuchsia-400", label: "INSTAGRAM" },
            telegram: { icon: "send", bg: "bg-sky-500/10", border: "border-sky-500/20", text: "text-sky-400", label: "TELEGRAM" },
            youtube: { icon: "play", bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", label: "YOUTUBE" },
            tiktok: { icon: "music", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", label: "TIKTOK" },
            twitter: { icon: "hash", bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", label: "TWITTER / X" },
            website: { icon: "globe", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", label: "SURF WEB" }
        };

        container.innerHTML = State.tasks.map(t => {
            const b = platformBadges[t.platform] || platformBadges.website;
            const rewardFmt = `$${parseFloat(t.reward_per_action).toFixed(4)}`;
            return `
                <div class="glass-panel p-5 rounded-3xl border border-cardborder hover:border-slate-700 transition flex flex-col justify-between space-y-4">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${b.bg} ${b.border} ${b.text} border">
                                <i data-lucide="${b.icon}" class="w-3 h-3"></i>
                                <span>${b.label}</span>
                            </span>
                            <span class="text-xs font-extrabold text-emerald-400 mono">${rewardFmt}</span>
                        </div>
                        <h4 class="text-sm font-bold text-white line-clamp-2 leading-snug">${t.title}</h4>
                        <p class="text-[11px] text-gray-400 line-clamp-2">${t.description || 'Complétez l’action demandée pour débloquer votre rémunération.'}</p>
                    </div>

                    <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span class="text-[11px] text-gray-500 font-mono">${t.remaining_slots || 50} places dispo</span>
                        <button onclick="claimAndStartTask(${t.id})" class="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition flex items-center space-x-1">
                            <span>Démarrer</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join("");

        lucide.createIcons();
    } catch (e) {
        container.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-rose-400">Erreur lors de la récupération des tâches.</div>`;
    }
}

// --- Active Tasks Checker ---
async function checkActiveTasks() {
    if (!State.token) return;
    try {
        const res = await fetch(`${API_BASE}/api/tasks/my/list?status=in_progress`, { headers: getAuthHeaders() });
        const data = await res.json();
        const activeTasks = data.tasks || [];
        const banner = document.getElementById("active-tasks-banner");

        if (activeTasks.length > 0) {
            State.activeExecution = activeTasks[0];
            if (banner) {
                banner.classList.remove("hidden");
                const desc = document.getElementById("active-task-desc");
                if (desc) desc.innerText = `${State.activeExecution.title} (Gain : +$${parseFloat(State.activeExecution.reward_amount).toFixed(4)})`;
            }
        } else {
            State.activeExecution = null;
            if (banner) banner.classList.add("hidden");
        }
    } catch (e) {
        console.error("Erreur active tasks check", e);
    }
}

async function claimAndStartTask(campaignId) {
    if (!State.token) {
        openAuthModal('login');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/tasks/${campaignId}/start`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({})
        });
        const data = await res.json();

        if (res.ok) {
            State.activeExecution = data.execution;
            openTaskModal(data.execution);
            checkActiveTasks();
            showToast("Mission réservée avec succès ! Vous disposez de 25 minutes.", "success");
        } else {
            showToast(data.detail || "Impossible de démarrer cette mission.", "error");
        }
    } catch (e) {
        showToast("Erreur de connexion au serveur.", "error");
    }
}

function openTaskModal(execution) {
    const modal = document.getElementById("modal-task-execution");
    if (!modal) return;

    document.getElementById("exec-task-title").innerText = execution.title || "Mission Réseau";
    document.getElementById("exec-task-desc").innerText = execution.description || "Suivez le lien officiel et effectuez l'action demandée.";
    document.getElementById("exec-task-reward").innerText = `+$${parseFloat(execution.reward_amount).toFixed(4)}`;
    
    const linkEl = document.getElementById("exec-task-link");
    linkEl.href = execution.target_url || "#";

    const badge = document.getElementById("exec-platform-badge");
    if (badge) badge.innerText = (execution.platform || "RESEAU").toUpperCase();

    modal.classList.remove("hidden");
    lucide.createIcons();
}

function closeTaskModal() {
    const modal = document.getElementById("modal-task-execution");
    if (modal) modal.classList.add("hidden");
}

function resumeCurrentTask() {
    if (State.activeExecution) {
        openTaskModal(State.activeExecution);
    }
}

async function confirmTaskApiCheck() {
    if (!State.activeExecution) return;
    const execId = State.activeExecution.id;

    try {
        const res = await fetch(`${API_BASE}/api/tasks/${execId}/api-check`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        const data = await res.json();

        if (res.ok) {
            closeTaskModal();
            showToast(data.message || "Mission validée avec succès !", "success");
            State.activeExecution = null;
            syncUserProfile();
            loadTasks();
        } else {
            showToast(data.detail || "Échec de la validation de la mission.", "error");
        }
    } catch (e) {
        showToast("Erreur lors de la vérification de la tâche.", "error");
    }
}

async function cancelActiveTask() {
    if (!State.activeExecution) return;
    const execId = State.activeExecution.id;

    try {
        const res = await fetch(`${API_BASE}/api/tasks/${execId}/cancel`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            closeTaskModal();
            State.activeExecution = null;
            checkActiveTasks();
            loadTasks();
            showToast("Mission abandonnée.", "info");
        }
    } catch (e) {
        showToast("Erreur lors de l'annulation.", "error");
    }
}

// ==============================================================================
// 2. TABLEAU DE BORD & ANALYTIQUE
// ==============================================================================
async function loadDashboard() {
    if (!State.token) return;
    syncUserProfile();

    const balEl = document.getElementById("dash-balance");
    if (balEl && State.user) balEl.innerText = `$${parseFloat(State.user.balance || 0).toFixed(4)}`;

    const trustEl = document.getElementById("dash-trust-score");
    if (trustEl && State.user) trustEl.innerText = `${Math.round(State.user.trust_score || 100)}%`;

    // Récupérer le nombre de tâches complétées
    try {
        const resTasks = await fetch(`${API_BASE}/api/tasks/my/list?status=verified`, { headers: getAuthHeaders() });
        if (resTasks.ok) {
            const data = await resTasks.json();
            const cntEl = document.getElementById("dash-completed-count");
            if (cntEl) cntEl.innerText = (data.tasks || []).length;
        }

        // Récupérer commissions affiliation
        const resRef = await fetch(`${API_BASE}/api/referrals`, { headers: getAuthHeaders() });
        if (resRef.ok) {
            const refData = await resRef.json();
            const refEl = document.getElementById("dash-referral-earnings");
            if (refEl) refEl.innerText = `$${parseFloat(refData.total_commission_earned || 0).toFixed(4)}`;
        }
    } catch (e) {
        console.error(e);
    }

    renderEarningsChart();
}

function renderEarningsChart() {
    const ctx = document.getElementById('earningsChart');
    if (!ctx) return;

    if (State.earningsChart) {
        State.earningsChart.destroy();
    }

    const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const dummyData = [0.12, 0.28, 0.45, 0.38, 0.62, 0.85, 1.15];

    State.earningsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gains Quotidiens ($)',
                data: dummyData,
                borderColor: '#06B6D4',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9CA3AF', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9CA3AF', font: { size: 10 } }
                }
            }
        }
    });
}

// ==============================================================================
// 3. ANNONCEURS & CAMPAGNES
// ==============================================================================
async function loadCampaigns() {
    const tbody = document.getElementById("campaigns-table-body");
    if (!tbody || !State.token) return;

    tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-500">Chargement des campagnes...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE}/api/campaigns`, { headers: getAuthHeaders() });
        const data = await res.json();
        const camps = data.campaigns || [];

        if (camps.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-gray-400">Aucune campagne créée pour le moment. Cliquez sur "Nouvelle Campagne" pour commencer.</td></tr>`;
            return;
        }

        tbody.innerHTML = camps.map(c => {
            const pct = Math.min(100, Math.round((c.completed_quantity / c.target_quantity) * 100));
            return `
                <tr class="hover:bg-slate-900/50 transition">
                    <td class="p-4 font-bold text-white">${c.title}</td>
                    <td class="p-4 uppercase text-cyan-400 font-semibold">${c.platform}</td>
                    <td class="p-4">
                        <div class="flex items-center space-x-2">
                            <div class="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div class="bg-gradient-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full" style="width: ${pct}%"></div>
                            </div>
                            <span class="text-[11px] text-gray-400 font-mono">${c.completed_quantity}/${c.target_quantity}</span>
                        </div>
                    </td>
                    <td class="p-4 font-mono text-emerald-400">$${parseFloat(c.reward_per_action).toFixed(4)}</td>
                    <td class="p-4 font-mono text-gray-300">$${parseFloat(c.remaining_budget).toFixed(4)}</td>
                    <td class="p-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}">
                            ${c.status.toUpperCase()}
                        </span>
                    </td>
                </tr>
            `;
        }).join("");
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-rose-400">Erreur chargement campagnes.</td></tr>`;
    }
}

function openCreateCampaignModal() {
    if (!State.token) {
        openAuthModal('login');
        return;
    }
    const modal = document.getElementById("modal-create-campaign");
    if (modal) modal.classList.remove("hidden");
    calculateCampaignBudget();
}

function closeCreateCampaignModal() {
    const modal = document.getElementById("modal-create-campaign");
    if (modal) modal.classList.add("hidden");
}

function calculateCampaignBudget() {
    const qty = parseInt(document.getElementById("camp-qty")?.value || 100);
    const reward = parseFloat(document.getElementById("camp-reward")?.value || 0.008);
    const cost = reward * 1.4; // 40% marge
    const total = qty * cost;
    const totalEl = document.getElementById("camp-total-budget");
    if (totalEl) totalEl.innerText = `$${total.toFixed(4)}`;
}

async function handleCreateCampaign(e) {
    e.preventDefault();
    const title = document.getElementById("camp-title").value;
    const platform = document.getElementById("camp-platform").value;
    const action_type = document.getElementById("camp-action").value;
    const target_url = document.getElementById("camp-url").value;
    const target_quantity = parseInt(document.getElementById("camp-qty").value);
    const reward_per_action = parseFloat(document.getElementById("camp-reward").value);

    try {
        const res = await fetch(`${API_BASE}/api/campaigns`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title, platform, action_type, target_url, target_quantity, reward_per_action
            })
        });
        const data = await res.json();

        if (res.ok) {
            closeCreateCampaignModal();
            showToast("Campagne déployée avec succès !", "success");
            syncUserProfile();
            loadCampaigns();
        } else {
            showToast(data.detail || "Erreur de création de la campagne.", "error");
        }
    } catch (e) {
        showToast("Erreur serveur lors de la création.", "error");
    }
}

// ==============================================================================
// 4. RÉSEAUX SOCIAUX
// ==============================================================================
async function loadSocialAccounts() {
    const container = document.getElementById("socials-container");
    if (!container || !State.token) return;

    container.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-gray-500">Chargement de vos profils...</div>`;

    try {
        const res = await fetch(`${API_BASE}/api/profile/socials`, { headers: getAuthHeaders() });
        const data = await res.json();
        const accs = data.accounts || [];

        if (accs.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center glass-panel rounded-3xl border border-cardborder">
                    <i data-lucide="share-2" class="w-10 h-10 mx-auto text-gray-500 mb-2"></i>
                    <h3 class="text-sm font-bold text-white">Aucun profil social connecté</h3>
                    <p class="text-xs text-gray-400 mt-1">Liez au moins un compte Instagram ou Telegram pour effectuer des actions sociales.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = accs.map(a => `
            <div class="glass-panel p-5 rounded-3xl border border-cardborder flex items-center justify-between">
                <div class="space-y-1">
                    <span class="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">${a.platform}</span>
                    <h4 class="text-sm font-bold text-white mt-1">${a.account_identifier}</h4>
                    <p class="text-[11px] text-emerald-400 flex items-center space-x-1">
                        <i data-lucide="check" class="w-3 h-3"></i>
                        <span>Vérifié & Actif</span>
                    </p>
                </div>
                <button onclick="deleteSocialAccount(${a.id})" class="p-2 text-gray-500 hover:text-rose-400 transition" title="Supprimer">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join("");

        lucide.createIcons();
    } catch (e) {
        container.innerHTML = `<div class="col-span-full py-6 text-center text-rose-400">Erreur comptes sociaux.</div>`;
    }
}

async function deleteSocialAccount(id) {
    if (!confirm("Voulez-vous supprimer ce compte ?")) return;
    try {
        const res = await fetch(`${API_BASE}/api/profile/socials/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast("Compte retiré avec succès.", "info");
            loadSocialAccounts();
        }
    } catch (e) {
        showToast("Erreur lors de la suppression.", "error");
    }
}

// ==============================================================================
// 5. PORTEFEUILLE & RETRAITS
// ==============================================================================
async function loadWallet() {
    if (!State.token) return;
    syncUserProfile();

    const bigBal = document.getElementById("wallet-balance-big");
    if (bigBal && State.user) bigBal.innerText = `$${parseFloat(State.user.balance || 0).toFixed(4)}`;

    const tbody = document.getElementById("wallet-transactions-body");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">Chargement du grand livre...</td></tr>`;

    try {
        const res = await fetch(`${API_BASE}/api/profile/wallet`, { headers: getAuthHeaders() });
        const data = await res.json();
        const txs = data.transactions || [];

        if (txs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-400">Aucune transaction enregistrée.</td></tr>`;
            return;
        }

        tbody.innerHTML = txs.map(t => {
            const isPos = t.amount >= 0;
            const amtFmt = `${isPos ? '+' : ''}$${parseFloat(t.amount).toFixed(4)}`;
            return `
                <tr class="hover:bg-slate-900/40 transition">
                    <td class="p-4 uppercase font-bold text-[10px] text-cyan-400">${t.type.replace('_', ' ')}</td>
                    <td class="p-4 text-gray-200">${t.description}</td>
                    <td class="p-4 font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}">${amtFmt}</td>
                    <td class="p-4 font-mono text-gray-400">$${parseFloat(t.balance_after).toFixed(4)}</td>
                    <td class="p-4 text-gray-500 font-mono text-[11px]">${t.created_at}</td>
                </tr>
            `;
        }).join("");
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-rose-400">Erreur historique portefeuille.</td></tr>`;
    }
}

function openWalletModal(mode = "deposit") {
    if (!State.token) {
        openAuthModal('login');
        return;
    }
    State.walletMode = mode;
    const modal = document.getElementById("modal-wallet");
    const title = document.getElementById("wallet-modal-title");
    const btn = document.getElementById("wallet-submit-btn");
    const detField = document.getElementById("wallet-field-details");

    if (mode === "deposit") {
        if (title) title.innerText = "Recharger votre Compte (Dépôt Annonceur)";
        if (btn) btn.innerText = "Confirmer le Dépôt Immédiat";
        if (detField) detField.classList.add("hidden");
    } else {
        if (title) title.innerText = "Demander un Retrait de Gains";
        if (btn) btn.innerText = "Demander le Retrait";
        if (detField) detField.classList.remove("hidden");
    }

    if (modal) modal.classList.remove("hidden");
}

function closeWalletModal() {
    const modal = document.getElementById("modal-wallet");
    if (modal) modal.classList.add("hidden");
}

async function handleWalletSubmit(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("wallet-input-amount").value);
    const method = document.getElementById("wallet-select-method").value;
    const details = document.getElementById("wallet-input-details").value;

    const endpoint = State.walletMode === "deposit" ? "/api/wallet/deposit" : "/api/wallet/withdraw";
    const body = State.walletMode === "deposit" 
        ? { amount, payment_method: method }
        : { amount, payment_method: method, account_details: details };

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            closeWalletModal();
            showToast(data.message || "Opération validée !", "success");
            syncUserProfile();
            loadWallet();
        } else {
            showToast(data.detail || "Erreur de transaction.", "error");
        }
    } catch (e) {
        showToast("Erreur de communication avec la passerelle.", "error");
    }
}

// ==============================================================================
// 6. PROGRAMME DE PARRAINAGE
// ==============================================================================
async function loadReferrals() {
    if (!State.token) return;
    try {
        const res = await fetch(`${API_BASE}/api/referrals`, { headers: getAuthHeaders() });
        const data = await res.json();

        const linkInput = document.getElementById("ref-link-input");
        if (linkInput) linkInput.value = data.referral_link || "";

        const cntEl = document.getElementById("ref-total-count");
        if (cntEl) cntEl.innerText = data.total_referrals || 0;

        const earnEl = document.getElementById("ref-total-earned");
        if (earnEl) earnEl.innerText = `$${parseFloat(data.total_commission_earned || 0).toFixed(4)}`;

        const listContainer = document.getElementById("referrals-list-container");
        if (listContainer) {
            const refs = data.referrals || [];
            if (refs.length === 0) {
                listContainer.innerHTML = `<p class="text-gray-500 py-3 text-center">Vous n'avez pas encore d'affiliés enregistrés. Partagez votre lien pour commencer à encaisser 10% !</p>`;
            } else {
                listContainer.innerHTML = refs.map(r => `
                    <div class="flex items-center justify-between py-2 border-b border-slate-800">
                        <span class="font-bold text-white">@${r.username}</span>
                        <span class="text-gray-400 font-mono text-[11px]">Inscrit le ${r.created_at}</span>
                    </div>
                `).join("");
            }
        }
    } catch (e) {
        console.error("Erreur referrals", e);
    }
}

function copyReferralLink() {
    const input = document.getElementById("ref-link-input");
    if (!input) return;
    navigator.clipboard.writeText(input.value);
    showToast("Lien de parrainage copié dans le presse-papiers !", "success");
}

// ==============================================================================
// 7. ADMINISTRATION & SENTINEL
// ==============================================================================
async function loadAdmin() {
    if (!State.token || State.user?.role !== "admin") return;

    try {
        const resStats = await fetch(`${API_BASE}/api/admin/stats`, { headers: getAuthHeaders() });
        if (resStats.ok) {
            const stats = await resStats.json();
            document.getElementById("admin-kpi-users").innerText = stats.total_users;
            document.getElementById("admin-kpi-campaigns").innerText = stats.total_campaigns;
            document.getElementById("admin-kpi-executions").innerText = stats.total_executions;
            document.getElementById("admin-kpi-fraud").innerText = stats.fraud_alerts_triggered;
        }

        const resUsers = await fetch(`${API_BASE}/api/admin/users`, { headers: getAuthHeaders() });
        if (resUsers.ok) {
            const data = await resUsers.json();
            const tbody = document.getElementById("admin-users-table-body");
            tbody.innerHTML = (data.users || []).map(u => `
                <tr class="hover:bg-slate-900/50">
                    <td class="p-3 font-mono text-gray-400">#${u.id}</td>
                    <td class="p-3 font-bold text-white">@${u.username} (${u.email})</td>
                    <td class="p-3 uppercase text-[10px] text-cyan-400">${u.role}</td>
                    <td class="p-3 font-mono text-emerald-400">$${parseFloat(u.balance).toFixed(4)}</td>
                    <td class="p-3 font-mono text-purple-400">${Math.round(u.trust_score)}%</td>
                    <td class="p-3 text-rose-400 font-bold">${u.warning_strikes}</td>
                    <td class="p-3">
                        ${u.is_banned ? 
                            `<button onclick="unbanUser(${u.id})" class="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-lg">Réactiver</button>` :
                            `<button onclick="banUser(${u.id})" class="px-2.5 py-1 text-[10px] font-bold bg-rose-500/20 text-rose-400 rounded-lg">Bannir</button>`
                        }
                    </td>
                </tr>
            `).join("");
        }
    } catch (e) {
        console.error("Erreur admin", e);
    }
}

async function banUser(id) {
    if (!confirm(`Bannir l'utilisateur #${id} ?`)) return;
    try {
        const res = await fetch(`${API_BASE}/api/admin/users/${id}/ban`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast(`Utilisateur #${id} banni avec succès.`, "info");
            loadAdmin();
        }
    } catch (e) {
        showToast("Erreur lors du bannissement.", "error");
    }
}

async function unbanUser(id) {
    try {
        const res = await fetch(`${API_BASE}/api/admin/users/${id}/unban`, {
            method: "POST",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast(`Utilisateur #${id} réactivé.`, "success");
            loadAdmin();
        }
    } catch (e) {
        showToast("Erreur lors de la réactivation.", "error");
    }
}

// ==============================================================================
// 8. AUTH MODAL & CONTROLS
// ==============================================================================
function openAuthModal(mode = "login") {
    State.authMode = mode;
    const modal = document.getElementById("modal-auth");
    const title = document.getElementById("auth-modal-title");
    const emailField = document.getElementById("auth-field-email");
    const userLabel = document.getElementById("auth-label-user");
    const submitBtn = document.getElementById("auth-submit-btn");
    const toggleBtn = document.getElementById("auth-toggle-mode-btn");

    if (mode === "login") {
        if (title) title.innerText = "Connexion à L-Marchande";
        if (emailField) emailField.classList.add("hidden");
        if (userLabel) userLabel.innerText = "Nom d'utilisateur ou Email";
        if (submitBtn) submitBtn.innerText = "Se Connecter";
        if (toggleBtn) toggleBtn.innerText = "Pas encore de compte ? S'inscrire";
    } else {
        if (title) title.innerText = "Inscription à L-Marchande";
        if (emailField) emailField.classList.remove("hidden");
        if (userLabel) userLabel.innerText = "Choisissez un Nom d'utilisateur";
        if (submitBtn) submitBtn.innerText = "Créer mon Compte";
        if (toggleBtn) toggleBtn.innerText = "Déjà inscrit ? Se connecter";
    }

    if (modal) modal.classList.remove("hidden");
}

function closeAuthModal() {
    const modal = document.getElementById("modal-auth");
    if (modal) modal.classList.add("hidden");
}

function toggleAuthMode() {
    openAuthModal(State.authMode === "login" ? "register" : "login");
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const username = document.getElementById("auth-input-username").value;
    const password = document.getElementById("auth-input-password").value;
    const email = document.getElementById("auth-input-email")?.value || "";

    const endpoint = State.authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = State.authMode === "login" 
        ? { username_or_email: username, password }
        : { username, email, password, role: "worker" };

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            State.token = data.access_token;
            State.user = data.user;
            localStorage.setItem("lm_token", data.access_token);
            localStorage.setItem("lm_user", JSON.stringify(data.user));

            closeAuthModal();
            updateAuthUI();
            navigate("tasks");
            showToast(`Bienvenue, @${data.user.username} !`, "success");
        } else {
            showToast(data.detail || "Échec d'authentification.", "error");
        }
    } catch (e) {
        showToast("Erreur lors de la connexion au serveur.", "error");
    }
}

async function quickLoginDemo(role = "worker") {
    const creds = role === "worker" 
        ? { username_or_email: "top_worker", password: "WorkerPass2026!" }
        : { username_or_email: "lux_agency", password: "AdvertPass2026!" };

    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(creds)
        });
        const data = await res.json();
        if (res.ok) {
            State.token = data.access_token;
            State.user = data.user;
            localStorage.setItem("lm_token", data.access_token);
            localStorage.setItem("lm_user", JSON.stringify(data.user));

            closeAuthModal();
            updateAuthUI();
            navigate(role === "worker" ? "tasks" : "campaigns");
            showToast(`Session démo activée (@${data.user.username})`, "success");
        }
    } catch (e) {
        showToast("Erreur connexion démo.", "error");
    }
}

function logout() {
    State.token = "";
    State.user = null;
    localStorage.removeItem("lm_token");
    localStorage.removeItem("lm_user");
    updateAuthUI();
    navigate("tasks");
    showToast("Déconnexion réussie.", "info");
}

function toggleUserDropdown() {
    const el = document.getElementById("user-dropdown-menu");
    if (el) el.classList.toggle("hidden");
}

// Close dropdown on outside click
window.addEventListener("click", (e) => {
    const menu = document.getElementById("user-dropdown-menu");
    if (menu && !menu.contains(e.target) && !e.target.closest("button[onclick*='toggleUserDropdown']")) {
        menu.classList.add("hidden");
    }
});

// --- Boot Application ---
document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    fetchPublicStats();
    navigate("tasks");
    lucide.createIcons();
    setInterval(fetchPublicStats, 30000);
});
