/* ─── Válvulas — Sistema de Incendio · AEP ──────────────── */

let valvulasFiltered = [...VALVULAS_DATA];
let valvulasSearch   = '';
let valvulasTipo     = '';

/* ─── Init ───────────────────────────────────────────────── */
(function initValvulas() {
  renderValvulasStats();
  buildValvulasFilters();
  renderValvulasTable();

  document.getElementById('valvulas-search').addEventListener('input', function () {
    valvulasSearch = this.value.trim().toLowerCase();
    document.getElementById('valvulas-clear-search').style.display = valvulasSearch ? 'flex' : 'none';
    applyValvulasFilters();
  });
  document.getElementById('valvulas-clear-search').addEventListener('click', function () {
    valvulasSearch = '';
    document.getElementById('valvulas-search').value = '';
    this.style.display = 'none';
    applyValvulasFilters();
  });
  document.getElementById('valvulas-filter-tipo').addEventListener('change', function () {
    valvulasTipo = this.value;
    applyValvulasFilters();
  });

  document.getElementById('valvulas-modal-close').addEventListener('click', closeValvulasModal);
  document.getElementById('valvulas-modal-overlay').addEventListener('click', function (e) {
    if (e.target === this) closeValvulasModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeValvulasModal();
  });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function renderValvulasStats() {
  const cnt = (t) => VALVULAS_DATA.filter(e => e.tipo === t).length;
  const cards = [
    { label: 'Total válvulas',     value: VALVULAS_DATA.length, icon: '🔧', color: '#1a56a4' },
    { label: 'Mariposa',           value: cnt('Mariposa'),      icon: '🦋', color: '#7c3aed' },
    { label: 'Esclusa',            value: cnt('Esclusa'),       icon: '🚪', color: '#1a56a4' },
    { label: 'Retención / Alivio', value: cnt('Retención') + cnt('Alivio'), icon: '↩️', color: '#d97706' },
  ];

  document.getElementById('valvulas-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

/* ─── Filtro por tipo ────────────────────────────────────── */
function buildValvulasFilters() {
  const sel = document.getElementById('valvulas-filter-tipo');
  const tipos = [...new Set(VALVULAS_DATA.map(e => e.tipo))].sort();
  sel.innerHTML = '<option value="">Todos los tipos</option>' +
    tipos.map(t => `<option value="${t}">${t}</option>`).join('');
}

/* ─── Filters ────────────────────────────────────────────── */
function applyValvulasFilters() {
  valvulasFiltered = VALVULAS_DATA.filter(e => {
    if (valvulasTipo && e.tipo !== valvulasTipo) return false;
    if (valvulasSearch) {
      const hay = [e.equipo, e.denominacion, e.tipo, e.medida, e.fabricante, e.material, e.local, e.ubicacion]
        .join(' ').toLowerCase();
      if (!hay.includes(valvulasSearch)) return false;
    }
    return true;
  });
  renderValvulasTable();
}

/* ─── Table ──────────────────────────────────────────────── */
function renderValvulasTable() {
  const tbody   = document.getElementById('valvulas-tbody');
  const countEl = document.getElementById('valvulas-result-count');
  countEl.textContent = `${valvulasFiltered.length} de ${VALVULAS_DATA.length} válvulas`;

  if (!valvulasFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron válvulas.</p></div>
    </td></tr>`;
    return;
  }

  tbody.innerHTML = valvulasFiltered.map(e => {
    const tipoColor = VALVULAS_TIPO_COLORS[e.tipo] || '#6b7280';
    return `<tr data-equipo="${e.equipo}" style="cursor:pointer">
      <td><span class="equipo-tag">${e.equipo}</span></td>
      <td>${e.denominacion}</td>
      <td><span class="aac-tipo-badge" style="background:${tipoColor}15;color:${tipoColor};border:1px solid ${tipoColor}30">${e.tipo}</span></td>
      <td>${e.medida || '<span class="no-data">—</span>'}</td>
      <td><span class="table-local-text" title="${e.ubicacion}">${e.local || '—'}</span></td>
    </tr>`;
  }).join('');

  tbody.querySelectorAll('tr[data-equipo]').forEach(row => {
    row.addEventListener('click', () => openValvulasModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────────── */
function openValvulasModal(equipo) {
  const e = VALVULAS_DATA.find(x => x.equipo === equipo);
  if (!e) return;

  const tipoColor = VALVULAS_TIPO_COLORS[e.tipo] || '#6b7280';

  document.getElementById('valvulas-modal-header').innerHTML = `
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

  document.getElementById('valvulas-modal-body').innerHTML = `
    ${mf('Tipo',              e.tipo)}
    ${mf('Medida / Diámetro', e.medida)}
    ${mf('Material / Modelo', e.material)}
    ${mf('Fabricante',        e.fabricante)}
    ${mf('Puesta en servicio', e.fecha)}
    ${mf('Sistema',           'Incendio')}
    ${mf('Local',             e.local, true)}
    ${mf('Ubicación SAP',     e.ubicacion, true, true)}
  `;

  if (typeof sapFichaHTML === 'function') document.getElementById('valvulas-modal-body').insertAdjacentHTML('beforeend', sapFichaHTML(equipo));

  document.getElementById('valvulas-modal-overlay').classList.add('open');
}

function closeValvulasModal() {
  document.getElementById('valvulas-modal-overlay').classList.remove('open');
}
