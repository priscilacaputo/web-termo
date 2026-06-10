/* ─── ECAs — Incendios ─────────────────────── */

let ecasFiltered      = [...ECAS_DATA];
let ecasView          = 'grid';
let ecasSearch        = '';
let ecasTipoFilter    = '';
let ecasSistemaFilter = '';
let ecasPisoFilter    = '';

/* ─── Init ───────────────────────────────────────────────── */
(function initECAS() {
  renderECASStats();
  buildECASFilters();
  applyECASFilters();

  document.getElementById('ecas-search').addEventListener('input', function () {
    ecasSearch = this.value.trim().toLowerCase();
    document.getElementById('ecas-clear-search').style.display = ecasSearch ? 'flex' : 'none';
    applyECASFilters();
  });
  document.getElementById('ecas-clear-search').addEventListener('click', function () {
    ecasSearch = '';
    document.getElementById('ecas-search').value = '';
    this.style.display = 'none';
    applyECASFilters();
  });
  document.getElementById('ecas-filter-tipo').addEventListener('change', function () {
    ecasTipoFilter = this.value;
    applyECASFilters();
  });
  document.getElementById('ecas-filter-sistema').addEventListener('change', function () {
    ecasSistemaFilter = this.value;
    applyECASFilters();
  });
  document.getElementById('ecas-filter-piso').addEventListener('change', function () {
    ecasPisoFilter = this.value;
    applyECASFilters();
  });

  document.querySelectorAll('.aac-view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.aac-view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      ecasView = this.dataset.view;
      renderECAS();
    });
  });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function renderECASStats() {
  const total      = ECAS_DATA.length;
  const sprinklers = ECAS_DATA.filter(e => e.tipo === 'Sprinkler').length;
  const hidrantes  = ECAS_DATA.filter(e => e.tipo === 'Hidrante').length;

  const cards = [
    { label: 'Total ECAs',    value: total,      icon: '🔥', color: '#dc2626' },
    { label: 'Sprinklers',    value: sprinklers, icon: '💧', color: '#059669' },
    { label: 'Hidrantes',     value: hidrantes,  icon: '🚨', color: '#2563eb' },
  ];

  document.getElementById('ecas-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

/* ─── Filters ────────────────────────────────────────────── */
function buildECASFilters() {
  const sistemas = [...new Set(ECAS_DATA.map(e => e.sistema))].filter(Boolean).sort();
  const pisos    = [...new Set(ECAS_DATA.map(e => e.piso))].sort();

  const selSistema = document.getElementById('ecas-filter-sistema');
  const selPiso    = document.getElementById('ecas-filter-piso');

  sistemas.forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    selSistema.appendChild(o);
  });
  pisos.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    selPiso.appendChild(o);
  });
}

function applyECASFilters() {
  ecasFiltered = ECAS_DATA.filter(e => {
    if (ecasTipoFilter && e.tipo !== ecasTipoFilter) return false;
    if (ecasSistemaFilter && e.sistema !== ecasSistemaFilter) return false;
    if (ecasPisoFilter && e.piso !== ecasPisoFilter) return false;
    if (ecasSearch) {
      const hay = [e.equipo, e.ubicacion, e.sistema, e.sap]
        .join(' ').toLowerCase();
      if (!hay.includes(ecasSearch)) return false;
    }
    return true;
  });
  renderECAS();
}

/* ─── Render dispatcher ──────────────────────────────────── */
function renderECAS() {
  const isData = ecasView === 'grid' || ecasView === 'table';

  document.getElementById('ecas-result-count').textContent =
    isData ? `${ecasFiltered.length} de ${ECAS_DATA.length} ECAs` : '';

  document.getElementById('ecas-grid').classList.toggle('hidden',       ecasView !== 'grid');
  document.getElementById('ecas-table-wrap').classList.toggle('hidden', ecasView !== 'table');

  if (ecasView === 'grid')  renderECASGrid();
  if (ecasView === 'table') renderECASTable();
}

/* ─── Grid ───────────────────────────────────────────────── */
function renderECASGrid() {
  const container = document.getElementById('ecas-grid');

  if (!ecasFiltered.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <p>No se encontraron ECAs con los filtros aplicados.</p>
    </div>`;
    return;
  }

  const tipoColor = { 'Sprinkler': '#059669', 'Hidrante': '#dc2626' };

  container.innerHTML = ecasFiltered.map(e => {
    const color = tipoColor[e.tipo] || '#6b7280';
    return `<div class="aac-card">
      <div class="aac-card-header">
        <span class="aac-card-code" style="background:${color}20;color:${color}">${e.equipo}</span>
        <span class="aac-tipo-badge" style="background:${color}18;color:${color};border-color:${color}35">${e.tipo}</span>
      </div>
      <div class="aac-card-denom">${e.ubicacion}</div>
      <div class="aac-card-meta">
        <span class="aac-fab-text"><strong>Sistema:</strong> ${e.sistema}</span>
      </div>
      <div class="aac-card-footer">
        <span class="aac-zona-badge" style="background:#f3f4f6;color:#374151"><strong>Piso:</strong> ${e.piso}</span>
        <span class="aac-sector-text" title="${e.alimenta}"><strong>Alimenta:</strong> ${e.alimenta.substring(0, 30)}...</span>
      </div>
    </div>`;
  }).join('');
}

/* ─── Table ──────────────────────────────────────────────── */
function renderECASTable() {
  const tbody = document.getElementById('ecas-tbody');

  if (!ecasFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron ECAs con los filtros aplicados.</p></div>
    </td></tr>`;
    return;
  }

  const tipoColor = { 'Sprinkler': '#059669', 'Hidrante': '#dc2626' };

  tbody.innerHTML = ecasFiltered.map(e => {
    const color = tipoColor[e.tipo] || '#6b7280';
    return `<tr>
      <td><span class="equipo-tag">${e.equipo}</span></td>
      <td><span class="aac-tipo-badge" style="background:${color}15;color:${color};border-color:${color}30">${e.tipo}</span></td>
      <td>${e.ubicacion}</td>
      <td><strong>${e.piso}</strong></td>
      <td>${e.sistema}</td>
      <td>${e.alimenta}</td>
    </tr>`;
  }).join('');
}
