// ============================================================================
// PR.SOCIAL - ADMIN PANEL JAVASCRIPT
// ============================================================================

let currentNav = 'dashboard';
let cachedLicenses = [];
let cachedPayments = [];
let cachedClients = [];
let cachedStats = null;
let currentPaymentFilter = 'ALL';

let salesChartInstance = null;
let donutChartInstance = null;
let reportsChartInstance = null;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('pr_admin_token');
  if (token) {
    showDashboard();
  } else {
    showLogin();
  }

  // Affichage date du jour
  const now = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('fr-FR', options);
  const dateDisplay = document.getElementById('currentDateDisplay');
  if (dateDisplay) {
    dateDisplay.textContent = `Aujourd'hui : ${dateStr}`;
  }
});

function showLogin() {
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('dashboardSection').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('dashboardSection').style.display = 'flex';
  const user = localStorage.getItem('pr_admin_user') || 'Admin';
  document.getElementById('topAdminUsername').textContent = user;
  switchNav('dashboard');
  loadAllData();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  if (sidebar.style.display === 'none') {
    sidebar.style.display = 'flex';
  } else {
    sidebar.style.display = 'none';
  }
}

// ============================================================================
// AUTHENTIFICATION
// ============================================================================
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.detail || 'Erreur de connexion', 'error');
      return;
    }
    localStorage.setItem('pr_admin_token', data.token);
    localStorage.setItem('pr_admin_user', data.username);
    showToast('Connexion réussie ! Bienvenue sur PR.SOCIAL.', 'success');
    showDashboard();
  } catch (err) {
    showToast('Impossible de contacter le serveur API.', 'error');
  }
}

function logout() {
  localStorage.removeItem('pr_admin_token');
  localStorage.removeItem('pr_admin_user');
  showLogin();
  showToast('Déconnecté avec succès.', 'info');
}

function getAuthHeaders() {
  const token = localStorage.getItem('pr_admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// ============================================================================
// NAVIGATION TABS
// ============================================================================
function switchNav(navKey) {
  currentNav = navKey;
  
  // Masquer toutes les sections
  document.querySelectorAll('.panel-section').forEach(sec => sec.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const sectionMap = {
    dashboard: 'sectionDashboard',
    clients: 'sectionClients',
    subscriptions: 'sectionSubscriptions',
    payments: 'sectionPayments',
    licenses: 'sectionLicenses',
    devices: 'sectionDevices',
    reports: 'sectionReports',
    settings: 'sectionSettings'
  };

  const activeSecId = sectionMap[navKey] || 'sectionDashboard';
  const targetSec = document.getElementById(activeSecId);
  if (targetSec) targetSec.style.display = 'block';

  // Activer le bon lien sidebar
  const links = document.querySelectorAll('.nav-link');
  const indexMap = { dashboard: 0, clients: 1, subscriptions: 2, payments: 3, licenses: 4, devices: 5, reports: 6, settings: 7 };
  if (links[indexMap[navKey]]) {
    links[indexMap[navKey]].classList.add('active');
  }

  // Charger ou rafraîchir les vues
  if (navKey === 'dashboard') {
    renderDashboardOverview();
  } else if (navKey === 'clients') {
    renderClientsTable(cachedClients);
  } else if (navKey === 'subscriptions') {
    renderSubscriptionsTable(cachedLicenses);
  } else if (navKey === 'payments') {
    renderPaymentsTable(cachedPayments);
  } else if (navKey === 'licenses') {
    renderLicensesTable(cachedLicenses);
  } else if (navKey === 'devices') {
    renderDevicesTable(cachedClients);
  } else if (navKey === 'reports') {
    renderReportsChart();
  } else if (navKey === 'settings') {
    loadSettingsData();
  }
}

// ============================================================================
// CHARGEMENT CENTRALISÉ DES DONNÉES
// ============================================================================
async function loadAllData() {
  try {
    // 1. Stats globales
    const resStats = await fetch('/api/admin/stats', { headers: getAuthHeaders() });
    if (resStats.status === 401) { logout(); return; }
    const dataStats = await resStats.json();
    
    // 2. Licences
    const resLic = await fetch('/api/admin/licenses', { headers: getAuthHeaders() });
    const dataLic = await resLic.json();
    if (dataLic.ok) cachedLicenses = dataLic.licenses;

    // 3. Paiements
    const resPay = await fetch('/api/admin/payments', { headers: getAuthHeaders() });
    const dataPay = await resPay.json();
    if (dataPay.ok) cachedPayments = dataPay.payments;

    // 4. Clients
    const resCli = await fetch('/api/admin/clients', { headers: getAuthHeaders() });
    const dataCli = await resCli.json();
    if (dataCli.ok) cachedClients = dataCli.clients;

    // Mettre à jour les badges et le dashboard
    if (dataStats.ok) {
      cachedStats = dataStats.stats;
      updateStatsCards(dataStats.stats);
    }
    renderDashboardOverview();

  } catch (err) {
    console.error('Erreur chargement données:', err);
  }
}

function updateStatsCards(stats) {
  // Badges compteurs
  const pendingCount = stats.pending_payments || 0;
  const navBadge = document.getElementById('navPendingBadge');
  const bellCount = document.getElementById('topBellCount');
  
  if (pendingCount > 0) {
    if (navBadge) { navBadge.textContent = pendingCount; navBadge.style.display = 'inline-block'; }
    if (bellCount) bellCount.textContent = pendingCount;
  } else {
    if (navBadge) navBadge.style.display = 'none';
    if (bellCount) bellCount.textContent = '0';
  }

  // 1. Total clients
  const totalCli = stats.total_clients !== undefined ? stats.total_clients : cachedClients.length;
  document.getElementById('cardTotalClients').textContent = totalCli;
  const subCli = document.getElementById('subtextNewClients');
  if (subCli) subCli.textContent = `Nouveaux ce mois : ${stats.new_clients_this_month || 0}`;
  const badgeCli = document.getElementById('badgeClientsTrend');
  if (badgeCli) {
    if (stats.new_clients_this_month > 0) {
      badgeCli.className = 'trend-badge up';
      badgeCli.textContent = `↑ +${stats.new_clients_this_month}`;
    } else {
      badgeCli.className = 'trend-badge neutral';
      badgeCli.textContent = '• Stable';
    }
  }

  // 2. Licences actives
  document.getElementById('cardActiveLicenses').textContent = stats.active_licenses || 0;
  const subExp = document.getElementById('subtextExpiring');
  if (subExp) subExp.textContent = `Expirant sous 7j : ${stats.expiring_this_week || 0}`;
  const badgeLic = document.getElementById('badgeLicensesTrend');
  if (badgeLic) {
    if (stats.expiring_this_week > 0) {
      badgeLic.className = 'trend-badge warning';
      badgeLic.textContent = `⚠️ ${stats.expiring_this_week}`;
    } else {
      badgeLic.className = 'trend-badge up';
      badgeLic.textContent = '✓ À jour';
    }
  }

  // 3. Paiements en attente
  document.getElementById('cardPendingPayments').textContent = pendingCount;
  const mvolaCount = stats.pending_mvola !== undefined ? stats.pending_mvola : cachedPayments.filter(p => p.method === 'MVOLA' && p.status === 'PENDING').length;
  const usdtCount = stats.pending_usdt !== undefined ? stats.pending_usdt : cachedPayments.filter(p => p.method === 'USDT' && p.status === 'PENDING').length;
  const subMeth = document.getElementById('subtextMethods');
  if (subMeth) subMeth.textContent = `MVola : ${mvolaCount} | USDT : ${usdtCount}`;
  const trendPend = document.getElementById('trendPending');
  if (trendPend) {
    if (pendingCount > 0) {
      trendPend.style.color = 'var(--warning)';
      trendPend.textContent = `🔔 ${pendingCount} à valider`;
    } else {
      trendPend.style.color = 'var(--success)';
      trendPend.textContent = '✓ Aucun retard';
    }
  }

  // 4. Revenu total
  const revTotal = stats.total_revenue_usd !== undefined ? stats.total_revenue_usd : 0;
  const revMonth = stats.revenue_this_month !== undefined ? stats.revenue_this_month : revTotal;
  document.getElementById('cardTotalRevenue').textContent = `${Math.round(revTotal)} $`;
  const subRev = document.getElementById('subtextRevenueMonth');
  if (subRev) subRev.textContent = `Ce mois : ${Math.round(revMonth)} $`;
  const badgeRev = document.getElementById('badgeRevenueTrend');
  if (badgeRev) {
    if (revMonth > 0) {
      badgeRev.className = 'trend-badge up';
      badgeRev.textContent = `↑ +${Math.round(revMonth)} $`;
    } else {
      badgeRev.className = 'trend-badge neutral';
      badgeRev.textContent = '0 $';
    }
  }
}

// ============================================================================
// 1. DASHBOARD & GRAPHIQUES (CHART.JS)
// ============================================================================
function renderDashboardOverview() {
  renderWidgetPayments();
  initOrUpdateSalesChart();
  initOrUpdateDonutChart();
}

function renderWidgetPayments() {
  const tbody = document.getElementById('widgetPaymentsTbody');
  if (!cachedPayments.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-light); padding: 20px;">Aucun paiement enregistré</td></tr>`;
    return;
  }

  const latest = cachedPayments.slice(0, 5);
  tbody.innerHTML = latest.map(p => {
    const isApproved = p.status === 'APPROVED';
    const statusClass = isApproved ? 'confirmé' : 'en-attente';
    const statusLabel = isApproved ? 'Confirmé' : 'En attente';
    const userLabel = p.sender_contact ? escapeHtml(p.sender_contact.substring(0, 10)) : `user_${p.id}`;

    return `
      <tr>
        <td><strong>${userLabel}</strong></td>
        <td>${p.amount_usd} $</td>
        <td><span class="method-tag ${p.method.toLowerCase()}">${p.method}</span></td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td style="color: var(--text-muted); font-size: 11px;">${p.created_at ? p.created_at.substring(5, 16) : '-'}</td>
      </tr>
    `;
  }).join('');
}

function initOrUpdateSalesChart() {
  const ctx = document.getElementById('salesLineChart');
  if (!ctx) return;

  let labels = [];
  let dataPoints = [];

  if (cachedStats && cachedStats.sales_7_days && cachedStats.sales_7_days.length > 0) {
    labels = cachedStats.sales_7_days.map(d => d.date);
    dataPoints = cachedStats.sales_7_days.map(d => d.amount);
  } else {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      labels.push(`${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`);
      dataPoints.push(0);
    }
  }

  const maxVal = Math.max(...dataPoints, 0);

  if (salesChartInstance) {
    try { salesChartInstance.destroy(); } catch (e) {}
    salesChartInstance = null;
  }

  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ventes ($)',
        data: dataPoints,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: function(context) {
              return ` Ventes : ${context.parsed.y} $`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 11 } }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            color: '#94a3b8',
            font: { size: 11 },
            callback: function(value) { return value + ' $'; }
          },
          min: 0,
          suggestedMax: maxVal > 0 ? maxVal * 1.25 : 10
        }
      }
    }
  });
}

function initOrUpdateDonutChart() {
  const ctx = document.getElementById('paymentDonutChart');
  if (!ctx) return;

  let totalUsdt = 0;
  let totalMvola = 0;
  let total = 0;
  let pctUsdt = 0;
  let pctMvola = 0;

  if (cachedStats && cachedStats.distribution) {
    totalUsdt = cachedStats.distribution.total_usdt || 0;
    totalMvola = cachedStats.distribution.total_mvola || 0;
    total = cachedStats.distribution.total || 0;
    pctUsdt = cachedStats.distribution.pct_usdt || 0;
    pctMvola = cachedStats.distribution.pct_mvola || 0;
  } else {
    totalUsdt = cachedPayments.filter(p => p.method === 'USDT' && p.status === 'APPROVED').reduce((acc, p) => acc + (p.amount_usd || 0), 0);
    totalMvola = cachedPayments.filter(p => p.method === 'MVOLA' && p.status === 'APPROVED').reduce((acc, p) => acc + (p.amount_usd || 0), 0);
    total = totalUsdt + totalMvola;
    pctUsdt = total > 0 ? Math.round((totalUsdt / total) * 100) : 0;
    pctMvola = total > 0 ? (100 - pctUsdt) : 0;
  }

  document.getElementById('donutTotalAmount').textContent = `${Math.round(total)} $`;
  document.getElementById('donutPercentUsdt').textContent = `${pctUsdt}%`;
  document.getElementById('donutPercentMvola').textContent = `${pctMvola}%`;

  const chartData = total > 0 ? [totalUsdt, totalMvola] : [1];
  const chartLabels = total > 0 ? ['USDT', 'MVola'] : ['En attente de ventes'];
  const chartColors = total > 0 ? ['#10b981', '#f97316'] : ['#e2e8f0'];

  if (donutChartInstance) {
    try { donutChartInstance.destroy(); } catch (e) {}
    donutChartInstance = null;
  }

  donutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: chartColors,
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          cornerRadius: 6,
          callbacks: {
            label: function(context) {
              if (total === 0) return ' Aucune vente encaissée';
              return ` ${context.label} : ${context.parsed} $`;
            }
          }
        }
      }
    }
  });
}

// ============================================================================
// 2. GESTION DES CLIENTS
// ============================================================================
function renderClientsTable(clients) {
  const tbody = document.getElementById('clientsTableBody');
  if (!clients.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light); padding: 30px;">Aucun client enregistré pour l'instant.</td></tr>`;
    return;
  }

  tbody.innerHTML = clients.map((c, index) => {
    const idFormatted = `#${String(c.id || index + 1).padStart(3, '0')}`;
    const username = c.device_id ? `user_${c.device_id.substring(7, 13)}` : `client_${c.id}`;
    const contact = c.contact || `${username}@gmail.com`;
    const count = c.total_licenses || 1;

    return `
      <tr>
        <td><strong>${idFormatted}</strong></td>
        <td><strong>${username}</strong></td>
        <td>${escapeHtml(contact)}</td>
        <td><span class="status-pill actif">Actif</span></td>
        <td><strong>${count}</strong></td>
        <td>
          <button class="action-icon-btn" title="Voir l'appareil" onclick="switchNav('devices')">👁️</button>
          <button class="action-icon-btn" title="Générer une licence" onclick="openGenerateModal('${username}')">✏️</button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('clientPaginationInfo').textContent = `Affichage de 1 à ${clients.length} sur ${clients.length} clients`;
}

function filterClientsTable() {
  const q = document.getElementById('clientSearchInput').value.toLowerCase().trim();
  const filtered = cachedClients.filter(c => 
    (c.device_id && c.device_id.toLowerCase().includes(q)) ||
    (c.contact && c.contact.toLowerCase().includes(q)) ||
    (c.device_info && c.device_info.toLowerCase().includes(q))
  );
  renderClientsTable(filtered);
}

// ============================================================================
// 3. GESTION DES ABONNEMENTS
// ============================================================================
function renderSubscriptionsTable(licenses) {
  const tbody = document.getElementById('subscriptionsTableBody');
  if (!licenses.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 30px;">Aucun abonnement trouvé.</td></tr>`;
    return;
  }

  tbody.innerHTML = licenses.map((l, index) => {
    const idFormatted = `#S${String(l.id || index + 1).padStart(3, '0')}`;
    const clientName = l.client_contact ? escapeHtml(l.client_contact) : (l.device_id ? `user_${l.device_id.substring(7, 12)}` : 'client_web');
    const isAct = l.status === 'ACTIVE';
    const statusClass = isAct ? 'actif' : (l.status === 'EXPIRED' ? 'expiré' : 'en-attente');
    const statusLabel = isAct ? 'Actif' : (l.status === 'EXPIRED' ? 'Expiré' : l.status);
    const expDate = l.expires_at ? l.expires_at.substring(0, 10) : 'Dès activation';

    return `
      <tr>
        <td><strong>${idFormatted}</strong></td>
        <td><strong>${clientName}</strong></td>
        <td><span class="code-snippet" onclick="copyToClipboard('${l.license_key}')">${l.license_key}</span></td>
        <td>${l.duration_days} jours</td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td>${expDate}</td>
        <td>
          <button class="action-icon-btn" title="Prolonger +7 jours" onclick="extendLicense(${l.id})">✏️</button>
          ${l.status !== 'REVOKED' 
            ? `<button class="action-icon-btn delete" title="Révoquer / Bloquer" onclick="revokeLicense(${l.id})">🚫</button>` 
            : `<button class="action-icon-btn" title="Réactiver" onclick="reactivateLicense(${l.id})">🔄</button>`}
          <button class="action-icon-btn delete" title="Supprimer définitivement" onclick="deleteLicense(${l.id})">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('subPaginationInfo').textContent = `Affichage de 1 à ${licenses.length} sur ${licenses.length} abonnements`;
}

// ============================================================================
// 4. GESTION DES PAIEMENTS
// ============================================================================
function setPaymentFilter(filterType, btnEl) {
  currentPaymentFilter = filterType;
  document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  filterPaymentsTable();
}

function filterPaymentsTable() {
  const query = document.getElementById('paymentSearchInput').value.toLowerCase().trim();
  let list = cachedPayments;

  if (currentPaymentFilter !== 'ALL') {
    list = list.filter(p => p.method === currentPaymentFilter);
  }

  if (query) {
    list = list.filter(p => 
      (p.transaction_ref && p.transaction_ref.toLowerCase().includes(query)) ||
      (p.sender_contact && p.sender_contact.toLowerCase().includes(query)) ||
      (p.method && p.method.toLowerCase().includes(query))
    );
  }

  renderPaymentsTable(list);
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('paymentsTableBody');
  if (!payments.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-light); padding: 30px;">Aucune transaction correspondant au filtre.</td></tr>`;
    return;
  }

  tbody.innerHTML = payments.map((p, idx) => {
    const idFormatted = `#P${String(p.id || idx + 1).padStart(3, '0')}`;
    const userLabel = p.sender_contact ? escapeHtml(p.sender_contact) : `user_${p.id}`;
    const isApproved = p.status === 'APPROVED';
    const statusClass = isApproved ? 'confirmé' : (p.status === 'REJECTED' ? 'expiré' : 'en-attente');
    const statusLabel = isApproved ? 'Confirmé' : (p.status === 'REJECTED' ? 'Rejeté' : 'En attente');
    const dateFormatted = p.created_at ? p.created_at.substring(0, 16) : '-';

    let actions = `<span style="color: var(--text-muted); font-size: 11px;">Validé</span>`;
    if (p.status === 'PENDING') {
      actions = `
        <button class="btn-primary-blue" style="padding: 5px 10px; font-size: 11px;" onclick="approvePayment(${p.id})">✓ Valider (+7j)</button>
        <button class="action-icon-btn delete" onclick="rejectPayment(${p.id})" title="Rejeter">✕</button>
      `;
    }

    return `
      <tr>
        <td><strong>${idFormatted}</strong></td>
        <td><strong>${userLabel}</strong></td>
        <td><strong>${p.amount_usd} $</strong> (${p.amount_local || ''})</td>
        <td><span class="method-tag ${p.method.toLowerCase()}">${p.method}</span></td>
        <td><span class="code-snippet" title="${escapeHtml(p.transaction_ref)}">${escapeHtml(p.transaction_ref)}</span></td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td>${dateFormatted}</td>
        <td>${actions}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('paymentPaginationInfo').textContent = `Affichage de 1 à ${payments.length} sur ${cachedPayments.length} paiements`;
}

// ============================================================================
// 5. GESTION DES LICENCES
// ============================================================================
function renderLicensesTable(licenses) {
  const tbody = document.getElementById('licensesTableBody');
  if (!licenses.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 30px;">Aucune clé de licence générée.</td></tr>`;
    return;
  }

  tbody.innerHTML = licenses.map((l, idx) => {
    const idFormatted = `#L${String(l.id || idx + 1).padStart(3, '0')}`;
    const clientName = l.client_contact ? escapeHtml(l.client_contact) : (l.device_id ? `user_${l.device_id.substring(7, 12)}` : 'Non assigné');
    const deviceName = l.device_id ? (l.device_id.includes('SM-') ? 'Samsung S22' : 'Android Termux') : '—';
    const isAct = l.status === 'ACTIVE';
    const statusClass = isAct ? 'actif' : (l.status === 'EXPIRED' ? 'expiré' : 'en-attente');
    const statusLabel = isAct ? 'Actif' : (l.status === 'EXPIRED' ? 'Expiré' : l.status);
    const expDate = l.expires_at ? l.expires_at.substring(0, 10) : 'Dès activation';

    return `
      <tr>
        <td><strong>${idFormatted}</strong></td>
        <td><strong>${clientName}</strong></td>
        <td><span class="code-snippet" onclick="copyToClipboard('${l.license_key}')" title="Cliquer pour copier">${l.license_key}</span></td>
        <td>${deviceName}</td>
        <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
        <td>${expDate}</td>
        <td>
          <button class="action-icon-btn" title="Copier" onclick="copyToClipboard('${l.license_key}')">📋</button>
          <button class="action-icon-btn" title="Prolonger +7j" onclick="extendLicense(${l.id})">✏️</button>
          ${l.status !== 'REVOKED' 
            ? `<button class="action-icon-btn delete" title="Révoquer / Bloquer" onclick="revokeLicense(${l.id})">🚫</button>` 
            : `<button class="action-icon-btn" title="Réactiver" onclick="reactivateLicense(${l.id})">🔄</button>`}
          <button class="action-icon-btn delete" title="Supprimer définitivement" onclick="deleteLicense(${l.id})">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('licensePaginationInfo').textContent = `Affichage de 1 à ${licenses.length} sur ${licenses.length} licences`;
}

function filterLicensesTable() {
  const query = document.getElementById('licenseSearchInput').value.toLowerCase().trim();
  const statusFilter = document.getElementById('licenseStatusFilter').value;

  let list = cachedLicenses;
  if (statusFilter) {
    list = list.filter(l => l.status === statusFilter);
  }
  if (query) {
    list = list.filter(l => 
      l.license_key.toLowerCase().includes(query) ||
      (l.client_contact && l.client_contact.toLowerCase().includes(query)) ||
      (l.device_id && l.device_id.toLowerCase().includes(query))
    );
  }
  renderLicensesTable(list);
}

// ============================================================================
// 6. APPAREILS (SMARTPHONES TERMUX)
// ============================================================================
function renderDevicesTable(clients) {
  const tbody = document.getElementById('devicesTableBody');
  if (!clients.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-light); padding: 30px;">Aucun smartphone Termux connecté pour le moment.</td></tr>`;
    return;
  }

  tbody.innerHTML = clients.map(c => `
    <tr>
      <td><span class="code-snippet">${escapeHtml(c.device_id)}</span></td>
      <td><strong>${escapeHtml(c.device_info || 'Android ARM64 / Termux')}</strong></td>
      <td>${escapeHtml(c.contact || 'Non renseigné')}</td>
      <td>${c.last_seen || c.first_seen}</td>
      <td><strong>${c.total_licenses || 1}</strong> licence(s)</td>
    </tr>
  `).join('');
}

// ============================================================================
// 7. RAPPORTS
// ============================================================================
function renderReportsChart() {
  const ctx = document.getElementById('reportsDetailedChart');
  if (!ctx) return;

  if (reportsChartInstance) {
    reportsChartInstance.destroy();
  }

  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const mvolaWeeks = [0, 0, 0, 0];
  const usdtWeeks = [0, 0, 0, 0];

  cachedPayments.forEach(p => {
    if (p.status === 'APPROVED' && p.created_at && p.created_at.startsWith(currentYearMonth)) {
      try {
        const day = parseInt(p.created_at.substring(8, 10), 10);
        const wIndex = Math.min(Math.floor((day - 1) / 7), 3);
        const amt = p.amount_usd || 0;
        if (p.method === 'MVOLA') mvolaWeeks[wIndex] += amt;
        else if (p.method === 'USDT') usdtWeeks[wIndex] += amt;
      } catch (e) {}
    }
  });

  reportsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Semaine 1 (1-7)', 'Semaine 2 (8-14)', 'Semaine 3 (15-21)', 'Semaine 4 (22+)'],
      datasets: [
        { label: 'MVola ($)', data: mvolaWeeks, backgroundColor: '#f97316' },
        { label: 'USDT ($)', data: usdtWeeks, backgroundColor: '#10b981' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label} : ${context.parsed.y} $`;
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) { return value + ' $'; }
          }
        }
      }
    }
  });
}

// ============================================================================
// 8. PARAMÈTRES COMMERCIAUX
// ============================================================================
async function loadSettingsData() {
  try {
    const res = await fetch('/api/admin/settings', { headers: getAuthHeaders() });
    const data = await res.json();
    if (data.ok) {
      const s = data.settings;
      if (s.mvola_number) document.getElementById('setting_mvola_number').value = s.mvola_number;
      if (s.mvola_name) document.getElementById('setting_mvola_name').value = s.mvola_name;
      if (s.mvola_rate_mga) document.getElementById('setting_mvola_rate_mga').value = s.mvola_rate_mga;
      if (s.usdt_address) document.getElementById('setting_usdt_address').value = s.usdt_address;
      if (s.usdt_network) document.getElementById('setting_usdt_network').value = s.usdt_network;
      if (s.price_usd) document.getElementById('setting_price_usd').value = s.price_usd;
      if (s.support_telegram) document.getElementById('setting_support_telegram').value = s.support_telegram;
    }
  } catch (err) {}
}

async function handleSaveSettings(e) {
  e.preventDefault();
  const settings = {
    mvola_number: document.getElementById('setting_mvola_number').value.trim(),
    mvola_name: document.getElementById('setting_mvola_name').value.trim(),
    mvola_rate_mga: document.getElementById('setting_mvola_rate_mga').value.trim(),
    usdt_address: document.getElementById('setting_usdt_address').value.trim(),
    usdt_network: document.getElementById('setting_usdt_network').value.trim(),
    price_usd: document.getElementById('setting_price_usd').value.trim(),
    support_telegram: document.getElementById('setting_support_telegram').value.trim()
  };

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings })
    });
    const data = await res.json();
    if (data.ok) {
      showToast('Paramètres mis à jour avec succès !', 'success');
    }
  } catch (err) {
    showToast('Erreur sauvegarde paramètres', 'error');
  }
}

// ============================================================================
// ACTIONS SUR LES LICENCES ET PAIEMENTS
// ============================================================================
async function approvePayment(id) {
  try {
    const res = await fetch(`/api/admin/payments/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.ok) {
      showToast(`Paiement #${id} validé ! Clé générée : ${data.license_key}`, 'success');
      copyToClipboard(data.license_key);
      loadAllData();
    } else {
      showToast(data.detail || 'Erreur validation', 'error');
    }
  } catch (err) {
    showToast('Erreur validation paiement', 'error');
  }
}

async function rejectPayment(id) {
  const reason = prompt('Motif du rejet :');
  if (reason === null) return;
  try {
    const res = await fetch(`/api/admin/payments/${id}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (data.ok) {
      showToast(`Paiement #${id} rejeté.`, 'info');
      loadAllData();
    }
  } catch (err) {
    showToast('Erreur rejet', 'error');
  }
}

async function extendLicense(id) {
  try {
    const res = await fetch(`/api/admin/licenses/${id}/extend`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ extra_days: 7 })
    });
    const data = await res.json();
    if (data.ok) {
      showToast('Licence prolongée de +7 jours !', 'success');
      loadAllData();
    }
  } catch (err) {
    showToast('Erreur prolongation', 'error');
  }
}

async function revokeLicense(id) {
  if (!confirm(`Voulez-vous vraiment révoquer la licence #${id} ? L'utilisateur sera immédiatement bloqué.`)) return;
  try {
    const res = await fetch(`/api/admin/licenses/${id}/revoke`, { method: 'POST', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.ok) {
      showToast('Licence révoquée et utilisateur bloqué !', 'warning');
      loadAllData();
    }
  } catch (err) {
    showToast('Erreur révocation', 'error');
  }
}

async function reactivateLicense(id) {
  if (!confirm(`Voulez-vous réactiver la licence #${id} ?`)) return;
  try {
    const res = await fetch(`/api/admin/licenses/${id}/reactivate`, { method: 'POST', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.ok) {
      showToast('Licence réactivée avec succès !', 'success');
      loadAllData();
    }
  } catch (err) {
    showToast('Erreur réactivation', 'error');
  }
}

async function deleteLicense(id) {
  if (!confirm(`ATTENTION : Supprimer définitivement la licence #${id} de la base de données ?`)) return;
  try {
    const res = await fetch(`/api/admin/licenses/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.ok) {
      showToast('Licence définitivement supprimée.', 'success');
      loadAllData();
    }
  } catch (err) {
    showToast('Erreur suppression', 'error');
  }
}

async function handleGenerateLicense(e) {
  e.preventDefault();
  const count = parseInt(document.getElementById('genCount').value) || 1;
  const duration_days = parseInt(document.getElementById('genDays').value) || 7;
  const client_contact = document.getElementById('genContact').value.trim();
  const notes = document.getElementById('genNotes').value.trim();

  try {
    const res = await fetch('/api/admin/licenses/generate', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ count, duration_days, client_contact, notes })
    });
    const data = await res.json();
    if (data.ok) {
      closeModal('generateModal');
      showToast(`${data.count} licence(s) créée(s) !`, 'success');
      loadAllData();
      if (data.created && data.created.length === 1) {
        copyToClipboard(data.created[0].license_key);
      }
    }
  } catch (err) {
    showToast('Erreur génération', 'error');
  }
}

function openGenerateModal(clientPreset = '') {
  document.getElementById('generateModal').classList.add('open');
  if (clientPreset) {
    document.getElementById('genContact').value = clientPreset;
  }
}

function openAddClientModal() {
  openGenerateModal();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Clé copiée : ${text}`, 'success');
  }).catch(() => {
    prompt('Copiez la clé :', text);
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : (type === 'error' ? '✖' : 'ℹ');
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
