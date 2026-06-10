/* ─── Búsqueda Global de Equipos — AEP ─────────────────────── */

const GS_SOURCES = [
  { key:'aac',         label:'Equipos de Aire',      icon:'❄️',  color:'#1a56a4', page:'aac',         getData:()=>AAC_DATA },
  { key:'puertas',     label:'Puertas Automáticas',  icon:'🚪',  color:'#7c3aed', page:'puertas',     getData:()=>PUERTAS_DATA },
  { key:'ascensores',  label:'Ascensores',            icon:'🛗',  color:'#059669', page:'ascensores',  getData:()=>ASCENSORES_DATA },
  { key:'escaleras',   label:'Escaleras Mecánicas',  icon:'🪜',  color:'#d97706', page:'escaleras',   getData:()=>ESCALERAS_DATA },
  { key:'mangas',      label:'Mangas de Embarque',   icon:'🛬',  color:'#0891b2', page:'mangas',      getData:()=>MANGAS_DATA },
  { key:'extractores', label:'Extractores',           icon:'💨',  color:'#6b7280', page:'extractores', getData:()=>EXTRACTORES_DATA },
  { key:'persianas',   label:'Persianas de Gatera',  icon:'🪟',  color:'#b45309', page:'persianas',   getData:()=>PERSIANAS_DATA },
  { key:'cortinas',    label:'Cortinas de Aire',     icon:'🌬️', color:'#0f766e', page:'cortinas',    getData:()=>CORTINAS_DATA },
  { key:'bombas',      label:'Bombas',               icon:'💧',  color:'#1d4ed8', page:'bombas',      getData:()=>BOMBAS_DATA },
  { key:'patio',       label:'Patio de Valijas',     icon:'🧳',  color:'#7c3aed', page:'patio',       getData:()=>PATIO_DATA },
  { key:'otros',       label:'Otros Equipos',        icon:'⚙️',  color:'#374151', page:'otros',       getData:()=>OTROS_DATA },
];

let gsActiveIdx = -1;
let gsFlatItems  = [];

/* ── Open / Close ── */
function openGlobalSearch() {
  document.getElementById('gs-overlay').classList.add('open');
  const input = document.getElementById('gs-input');
  input.value = '';
  renderGSHint();
  input.focus();
  gsActiveIdx = -1;
  gsFlatItems  = [];
}

function closeGlobalSearch() {
  document.getElementById('gs-overlay').classList.remove('open');
}

/* ── Hint state (no query) ── */
function renderGSHint() {
  document.getElementById('gs-results').innerHTML = `
    <div class="gs-hint-state">
      <div class="gs-hint-icon">🔍</div>
      Escribí el <strong>código</strong>, <strong>denominación</strong>,
      <strong>fabricante</strong> o <strong>sector</strong> del equipo que buscás.
    </div>`;
}

/* ── Search ── */
function gsSearch(q) {
  const term = q.trim().toLowerCase();
  if (!term) { renderGSHint(); gsActiveIdx = -1; gsFlatItems = []; return; }

  const groups = [];
  for (const src of GS_SOURCES) {
    let data;
    try { data = src.getData(); } catch (e) { continue; }
    const hits = data.filter(item => {
      const hay = [item.equipo, item.denominacion, item.fabricante,
                   item.modelo, item.sector, item.tipo,
                   item.pos != null ? String(item.pos) : '']
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(term);
    }).slice(0, 6);
    if (hits.length) groups.push({ src, hits });
  }

  gsFlatItems = groups.flatMap(g => g.hits.map(h => ({ page: g.src.page, equipo: h.equipo })));
  gsActiveIdx = -1;

  if (!groups.length) {
    document.getElementById('gs-results').innerHTML = `
      <div class="gs-empty-state">
        <div class="gs-empty-icon">🔍</div>
        No se encontraron equipos para &ldquo;<strong>${escHtml(q)}</strong>&rdquo;
      </div>`;
    return;
  }

  let html = '';
  for (const { src, hits } of groups) {
    html += `<div class="gs-group-label">
      ${src.icon} ${escHtml(src.label)}
      <span class="gs-group-count">${hits.length}</span>
    </div>`;
    for (const item of hits) {
      const meta = [item.fabricante, item.tipo, item.sector].filter(Boolean).join(' · ');
      html += `<div class="gs-item" data-page="${src.page}" data-equipo="${escHtml(item.equipo)}">
        <span class="gs-item-code" style="background:${src.color}">${escHtml(item.equipo)}</span>
        <div class="gs-item-body">
          <div class="gs-item-denom">${escHtml(item.denominacion || '—')}</div>
          ${meta ? `<div class="gs-item-meta">${escHtml(meta)}</div>` : ''}
        </div>
        <span class="gs-item-arrow">›</span>
      </div>`;
    }
  }

  document.getElementById('gs-results').innerHTML = html;

  document.querySelectorAll('.gs-item').forEach(el => {
    el.addEventListener('click', () => gsNavigate(el.dataset.page, el.dataset.equipo));
  });
}

/* ── Navigate ── */
function gsNavigate(page, equipo) {
  closeGlobalSearch();
  showPage(page);
}

/* ── Keyboard nav ── */
function gsHandleKeydown(e) {
  if (!document.getElementById('gs-overlay').classList.contains('open')) return;

  const items = Array.from(document.querySelectorAll('.gs-item'));
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    gsActiveIdx = Math.min(gsActiveIdx + 1, items.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    gsActiveIdx = Math.max(gsActiveIdx - 1, 0);
  } else if (e.key === 'Enter' && gsActiveIdx >= 0) {
    e.preventDefault();
    const el = items[gsActiveIdx];
    gsNavigate(el.dataset.page, el.dataset.equipo);
    return;
  } else {
    return;
  }

  items.forEach((el, i) => el.classList.toggle('gs-active', i === gsActiveIdx));
  items[gsActiveIdx]?.scrollIntoView({ block: 'nearest' });
}

/* ── Escape HTML ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Init ── */
document.getElementById('gs-trigger').addEventListener('click', openGlobalSearch);

document.getElementById('gs-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeGlobalSearch();
});

document.getElementById('gs-input').addEventListener('input', function() {
  gsSearch(this.value);
});

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openGlobalSearch();
    return;
  }
  if (e.key === 'Escape' && document.getElementById('gs-overlay').classList.contains('open')) {
    closeGlobalSearch();
    return;
  }
  gsHandleKeydown(e);
});
