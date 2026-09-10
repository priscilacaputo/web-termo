/* ─── Campanas de extracción — AEP ──────────────────────── */

let campanasFiltered = [...CAMPANAS_DATA];
let campanasSearch   = '';
let campanasEdificio = '';

/* ─── Init ───────────────────────────────────────────────── */
(function initCampanas() {
  renderCampanasStats();
  buildCampanasFilters();
  renderCampanasTable();

  document.getElementById('campanas-search').addEventListener('input', function () {
    campanasSearch = this.value.trim().toLowerCase();
    document.getElementById('campanas-clear-search').style.display = campanasSearch ? 'flex' : 'none';
    applyCampanasFilters();
  });
  document.getElementById('campanas-clear-search').addEventListener('click', function () {
    campanasSearch = '';
    document.getElementById('campanas-search').value = '';
    this.style.display = 'none';
    applyCampanasFilters();
  });
  document.getElementById('campanas-filter-edificio').addEventListener('change', function () {
    campanasEdificio = this.value;
    applyCampanasFilters();
  });

  document.getElementById('campanas-modal-close').addEventListener('click', closeCampanasModal);
  document.getElementById('campanas-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeCampanasModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCampanasModal();
  });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function renderCampanasStats() {
  const edificios = new Set(CAMPANAS_DATA.map(e => e.edificio).filter(Boolean)).size;
  const operativas = CAMPANAS_DATA.filter(e => e.status === 'MONT').length;
  const cards = [
    { label: 'Total campanas',   value: CAMPANAS_DATA.length, icon: '🍳', color: '#1a56a4' },
    { label: 'Operativas (MONT)', value: operativas,          icon: '✅', color: '#10b981' },
    { label: 'Edificios',        value: edificios,            icon: '🏢', color: '#7c3aed' },
    { label: 'Locales gastron.', value: CAMPANAS_DATA.length, icon: '📍', color: '#d97706' },
  ];

  document.getElementById('campanas-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

/* ─── Filtro por edificio ────────────────────────────────── */
function buildCampanasFilters() {
  const sel = document.getElementById('campanas-filter-edificio');
  const eds = [...new Set(CAMPANAS_DATA.map(e => e.edificio).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
  sel.innerHTML = '<option value="">Todos los edificios</option>' +
    eds.map(e => `<option value="${e}">${e}</option>`).join('');
}

/* ─── Filters ────────────────────────────────────────────── */
function applyCampanasFilters() {
  campanasFiltered = CAMPANAS_DATA.filter(e => {
    if (campanasEdificio && e.edificio !== campanasEdificio) return false;
    if (campanasSearch) {
      const hay = [e.equipo, e.denominacion, e.edificio, e.local, e.ubicacion]
        .join(' ').toLowerCase();
      if (!hay.includes(campanasSearch)) return false;
    }
    return true;
  });
  renderCampanasTable();
}

/* ─── Table ──────────────────────────────────────────────── */
function renderCampanasTable() {
  const tbody   = document.getElementById('campanas-tbody');
  const countEl = document.getElementById('campanas-result-count');
  countEl.textContent = `${campanasFiltered.length} de ${CAMPANAS_DATA.length} campanas`;

  if (!campanasFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="4">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron campanas.</p></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = campanasFiltered.map(e => `
    <tr data-equipo="${e.equipo}" style="cursor:pointer">
      <td><span class="equipo-tag">${e.equipo}</span></td>
      <td>${e.denominacion}</td>
      <td>${e.edificio || '<span class="no-data">—</span>'}</td>
      <td><span class="table-local-text" title="${e.ubicacion}">${e.local || '—'}</span></td>
    </tr>`).join('');

  tbody.querySelectorAll('tr[data-equipo]').forEach(row => {
    row.addEventListener('click', () => openCampanasModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
function openCampanasModal(equipo) {
  const e = CAMPANAS_DATA.find(x => x.equipo === equipo);
  if (!e) return;

  document.getElementById('campanas-modal-header').innerHTML = `
    <span class="modal-equipo">${e.equipo}</span>
    <div class="modal-denom">${e.denominacion}</div>
    <div style="margin-top:6px">
      <span class="aac-tipo-badge" style="background:#1a56a415;color:#1a56a4;border:1px solid #1a56a430">Campana de extracción</span>
    </div>
  `;

  function mf(label, value, full, mono) {
    if (!value) return '';
    return `<div class="modal-field${full ? ' full' : ''}">
      <span class="modal-field-label">${label}</span>
      <span class="modal-field-value${mono ? ' mono' : ''}">${value}</span>
    </div>`;
  }

  document.getElementById('campanas-modal-body').innerHTML = `
    ${mf('Edificio',      e.edificio)}
    ${mf('Local / Sector', e.local, true)}
    ${mf('Ubicación SAP',  e.ubicacion, true, true)}
  `;

  if (typeof sapFichaHTML === 'function') document.getElementById('campanas-modal-body').insertAdjacentHTML('beforeend', sapFichaHTML(equipo));

  document.getElementById('campanas-modal-overlay').classList.add('open');
}

function closeCampanasModal() {
  document.getElementById('campanas-modal-overlay').classList.remove('open');
}
