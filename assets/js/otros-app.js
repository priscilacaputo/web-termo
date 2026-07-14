/* ─── Otros Equipos — AEP ─────────────────────────────────── */

let otrosFiltered = [...OTROS_DATA];
let otrosSearch   = '';

/* ─── Init ───────────────────────────────────────────────── */
(function initOtros() {
  renderOtrosStats();
  renderOtrosTable();

  document.getElementById('otros-search').addEventListener('input', function () {
    otrosSearch = this.value.trim().toLowerCase();
    document.getElementById('otros-clear-search').style.display = otrosSearch ? 'flex' : 'none';
    applyOtrosFilters();
  });
  document.getElementById('otros-clear-search').addEventListener('click', function () {
    otrosSearch = '';
    document.getElementById('otros-search').value = '';
    this.style.display = 'none';
    applyOtrosFilters();
  });

  document.getElementById('otros-modal-close').addEventListener('click', closeOtrosModal);
  document.getElementById('otros-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeOtrosModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOtrosModal();
  });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function renderOtrosStats() {
  const tipos   = [...new Set(OTROS_DATA.map(e => e.tipo))];
  const cards = [
    { label: 'Total equipos',    value: OTROS_DATA.length,                                        icon: '⚙️',  color: '#1a56a4' },
    { label: 'Arcos de Lectura', value: OTROS_DATA.filter(e => e.tipo === 'Arco de Lectura').length, icon: '🔍',  color: '#7c3aed' },
    { label: 'Cisternas',        value: OTROS_DATA.filter(e => e.tipo === 'Cisterna').length,        icon: '💧',  color: '#0891b2' },
    { label: 'Compresores',      value: OTROS_DATA.filter(e => e.tipo === 'Compresor').length,       icon: '🔧',  color: '#d97706' },
  ];

  document.getElementById('otros-stats').innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

/* ─── Filters ────────────────────────────────────────────── */
function applyOtrosFilters() {
  otrosFiltered = OTROS_DATA.filter(e => {
    if (otrosSearch) {
      const hay = [e.equipo, e.denominacion, e.tipo, e.fabricante, e.capacidad, e.local, e.ubicacion]
        .join(' ').toLowerCase();
      if (!hay.includes(otrosSearch)) return false;
    }
    return true;
  });
  renderOtrosTable();
}

/* ─── Table ──────────────────────────────────────────────── */
function renderOtrosTable() {
  const tbody     = document.getElementById('otros-tbody');
  const countEl   = document.getElementById('otros-result-count');
  countEl.textContent = `${otrosFiltered.length} de ${OTROS_DATA.length} equipos`;

  if (!otrosFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron equipos.</p></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = otrosFiltered.map(e => {
    const tipoColor = OTROS_TIPO_COLORS[e.tipo] || '#6b7280';
    return `<tr data-equipo="${e.equipo}" style="cursor:pointer">
      <td><span class="equipo-tag">${e.equipo}</span></td>
      <td>${e.denominacion}</td>
      <td><span class="aac-tipo-badge" style="background:${tipoColor}15;color:${tipoColor};border:1px solid ${tipoColor}30">${e.tipo}</span></td>
      <td>${e.fabricante || '<span class="no-data">—</span>'}</td>
      <td>${e.capacidad  || '<span class="no-data">—</span>'}</td>
      <td><span class="table-local-text" title="${e.ubicacion}">${e.local}</span></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('tr[data-equipo]').forEach(row => {
    row.addEventListener('click', () => openOtrosModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
function openOtrosModal(equipo) {
  const e = OTROS_DATA.find(x => x.equipo === equipo);
  if (!e) return;

  const tipoColor = OTROS_TIPO_COLORS[e.tipo] || '#6b7280';

  document.getElementById('otros-modal-header').innerHTML = `
    <span class="modal-equipo">${e.equipo}</span>
    <div class="modal-denom">${e.denominacion}</div>
    <div style="margin-top:6px">
      <span class="aac-tipo-badge" style="background:${tipoColor}20;color:${tipoColor};border:1px solid ${tipoColor}40">${e.tipo}</span>
    </div>
  `;

  function mf(label, value, full, mono) {
    if (!value) return '';
    return `<div class="modal-field${full ? ' full' : ''}">
      <span class="modal-field-label">${label}</span>
      <span class="modal-field-value${mono ? ' mono' : ''}">${value}</span>
    </div>`;
  }

  document.getElementById('otros-modal-body').innerHTML = `
    ${mf('Tipo',          e.tipo)}
    ${mf('Fabricante',    e.fabricante || '—')}
    ${mf('Capacidad',     e.capacidad  || '—')}
    ${mf('Local',         e.local, true)}
    ${mf('Ubicación SAP', e.ubicacion, true, true)}
  `;

  document.getElementById('otros-modal-overlay').classList.add('open');
}

function closeOtrosModal() {
  document.getElementById('otros-modal-overlay').classList.remove('open');
}
