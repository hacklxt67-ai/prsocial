// Mobile hamburger
function renderHamburger() {
  return `<button class="hamburger" onclick="toggleSidebar()">
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h14M3 10h14M3 14h14"/></svg>
  </button>
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>`;
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebarOverlay')?.classList.toggle('open');
}
