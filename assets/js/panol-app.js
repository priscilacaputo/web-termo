/* ─── Pañol / Repuestos — AEP ─────────────────────────────────
   Vista 1 (Catálogo): stock de almacén SAP (PANOL_DATA).
   Vista 2 (Repuestos por equipo): materiales de pañol asociados a
   cada equipo (PANOL_REPUESTOS), editable desde el modo admin y
   persistido vía /api/update-equipment igual que ESTADO_OVERRIDES.
   Además inyecta un bloque "Repuestos de pañol" en la ficha (modal)
   de cualquier equipo que tenga materiales asignados. */

/* ─── Índices ────────────────────────────────────────────── */
const PANOL_BY_COD = new Map(PANOL_DATA.map(m => [String(m.cod), m]));
const PANOL_PAGE_SIZE = 300;

function panolNum(v) {
  const n = Number(v) || 0;
  return Number.isInteger(n) ? n.toLocaleString('es-AR') : n.toLocaleString('es-AR', { maximumFractionDigits: 3 });
}
function panolEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function panolStockNum(cod) {
  const m = PANOL_BY_COD.get(String(cod));
  return m ? (Number(m.stock) || 0) : null;
}
function panolStockBadge(v) {
  if (v == null) return '<span class="panol-stock panol-stock-unk" title="No está en el catálogo de pañol">—</span>';
  if (v > 0)     return `<span class="panol-stock panol-stock-ok">${panolNum(v)}</span>`;
  return '<span class="panol-stock panol-stock-zero">Sin stock</span>';
}
/* Cantidad necesaria por línea de BOM (default 1, compatible con datos viejos sin qty) */
function panolMatQty(x) {
  const n = Number(x && x.qty);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
/* Códigos SAP alternativos equivalentes para una línea de BOM */
function panolMatOpciones(x) {
  return Array.isArray(x && x.opciones) ? x.opciones.map(String).filter(Boolean) : [];
}
/* Chips de opciones equivalentes (cod + descripción corta + stock) */
function panolOpcionesHTML(cods) {
  if (!cods || !cods.length) return '';
  const chips = cods.map(c => {
    const m = PANOL_BY_COD.get(String(c));
    const st = panolStockNum(c);
    const title = m ? `${m.desc} · stock ${st == null ? '—' : panolNum(st)}` : 'Fuera del catálogo';
    return `<span class="panol-opcion" title="${panolEsc(title)}"><span class="equipo-tag">${panolEsc(c)}</span>${
      m ? ` ${panolEsc(m.desc)}` : ''} ${panolStockBadge(st)}</span>`;
  }).join('');
  return `<div class="panol-opciones"><span class="panol-opciones-lbl">Opciones equivalentes:</span> ${chips}</div>`;
}
/* ¿La línea de BOM es un repuesto crítico? Flag explícito o nota que lo dice. */
function panolMatCritico(x) {
  if (x && x.critico === true) return true;
  return !!(x && x.nota && /\bcr[íi]tico\b/i.test(x.nota));
}
/* Cobertura de una línea: stock disponible vs cantidad necesaria */
function panolCobertura(stock, qty) {
  if (stock == null) return { cls: 'unk',     txt: '—' };
  if (stock >= qty)  return { cls: 'ok',      txt: 'OK' };
  if (stock > 0)     return { cls: 'parcial', txt: `Parcial (${panolNum(stock)}/${panolNum(qty)})` };
  return { cls: 'none', txt: 'Sin stock' };
}
function panolCoberturaBadge(stock, qty) {
  const c = panolCobertura(stock, qty);
  return `<span class="panol-cob panol-cob-${c.cls}">${c.txt}</span>`;
}

/* ─── Familias de equipos (para resolver denominación y navegar) ── */
const PANOL_FAMILIAS = [
  { page: 'aac',         get: () => AAC_DATA,         open: 'openAACModal'    },
  { page: 'patio',       get: () => PATIO_DATA,       open: 'openPatioModal'  },
  { page: 'mangas',      get: () => MANGAS_DATA,      open: 'openMangaModal'  },
  { page: 'ascensores',  get: () => ASCENSORES_DATA,  open: 'openAscModal'    },
  { page: 'escaleras',   get: () => ESCALERAS_DATA,   open: 'openEscModal'    },
  { page: 'extractores', get: () => EXTRACTORES_DATA, open: 'openExtModal'    },
  { page: 'persianas',   get: () => PERSIANAS_DATA,   open: 'openPersModal'   },
  { page: 'cortinas',    get: () => CORTINAS_DATA,    open: 'openCorModal'    },
  { page: 'bombas',      get: () => BOMBAS_DATA,      open: 'openBomModal'    },
  { page: 'puertas',     get: () => PUERTAS_DATA,     open: 'openPuertaModal' },
  { page: 'otros',       get: () => OTROS_DATA,       open: 'openOtrosModal'  },
  { page: 'flota',       get: () => FLOTA_DATA,       open: 'openModal'       },
];
function panolFamiliaGet(fn) { try { const d = fn(); return Array.isArray(d) ? d : []; } catch (e) { return []; } }

/* Etiquetas legibles de familia para la vista BOM (usado ya en el init) */
const PANOL_FAM_LABEL = {
  aac: 'Aire acondicionado', patio: 'Patio de valijas', mangas: 'Mangas de embarque',
  ascensores: 'Ascensores', escaleras: 'Escaleras mecánicas', extractores: 'Extractores',
  persianas: 'Persianas', cortinas: 'Cortinas de aire', bombas: 'Bombas',
  puertas: 'Puertas automáticas', otros: 'Otros equipos', flota: 'Flota',
};

function panolAllEquipos() {
  const map = new Map();
  PANOL_FAMILIAS.forEach(f => panolFamiliaGet(f.get).forEach(e => {
    const cod = String(e.equipo || '').trim();
    if (cod && !map.has(cod)) map.set(cod, e.denominacion || e.denom || '');
  }));
  return map;
}
function panolEquipoDenom(equipo) {
  const cod = String(equipo || '').trim();
  for (const f of PANOL_FAMILIAS) {
    const hit = panolFamiliaGet(f.get).find(e => String(e.equipo || '').trim() === cod);
    if (hit) return hit.denominacion || hit.denom || '';
  }
  return '';
}
function panolEquipoFamilia(equipo) {
  const cod = String(equipo || '').trim();
  return PANOL_FAMILIAS.find(f => panolFamiliaGet(f.get).some(e => String(e.equipo || '').trim() === cod)) || null;
}

/* ─── Estado de la vista catálogo ────────────────────────── */
let panolFiltered = [];
let panolShown = 0;

/* ─── Init ───────────────────────────────────────────────── */
(function initPanol() {
  panolRenderStats();
  panolBuildGrupoFilter();
  panolApplyFilters();
  panolRenderRepuestos();

  const search = document.getElementById('panol-search');
  const clear  = document.getElementById('panol-clear-search');
  search.addEventListener('input', () => {
    clear.style.display = search.value ? 'flex' : 'none';
    panolApplyFilters();
  });
  clear.addEventListener('click', () => {
    search.value = ''; clear.style.display = 'none'; panolApplyFilters();
  });
  document.getElementById('panol-grupo-filter').addEventListener('change', panolApplyFilters);
  document.getElementById('panol-solo-stock').addEventListener('change', panolApplyFilters);
  document.getElementById('panol-more-btn').addEventListener('click', () => {
    panolShown += PANOL_PAGE_SIZE; panolRenderTable();
  });

  // Filtros de la vista "Repuestos por equipo" (BOM)
  panolBuildRepFamFilter();
  const repSearch = document.getElementById('panol-rep-search');
  const repClear  = document.getElementById('panol-rep-clear-search');
  let repSearchTimer = null;
  repSearch.addEventListener('input', () => {
    repClear.style.display = repSearch.value ? 'flex' : 'none';
    clearTimeout(repSearchTimer);
    repSearchTimer = setTimeout(panolRenderRepuestos, 180); // debounce: la lista tiene cientos de equipos
  });
  repClear.addEventListener('click', () => {
    repSearch.value = ''; repClear.style.display = 'none'; panolRenderRepuestos();
  });
  document.getElementById('panol-rep-fam-filter').addEventListener('change', panolRenderRepuestos);
  document.getElementById('panol-rep-solo-faltante').addEventListener('change', panolRenderRepuestos);
  document.getElementById('panol-rep-solo-fuera').addEventListener('change', panolRenderRepuestos);
  document.getElementById('panol-rep-export-btn').addEventListener('click', panolExportBOM);

  // Filtros de la vista "Repuestos críticos"
  const critSearch = document.getElementById('panol-crit-search');
  const critClear  = document.getElementById('panol-crit-clear-search');
  let critSearchTimer = null;
  critSearch.addEventListener('input', () => {
    critClear.style.display = critSearch.value ? 'flex' : 'none';
    clearTimeout(critSearchTimer);
    critSearchTimer = setTimeout(panolRenderCriticos, 180);
  });
  critClear.addEventListener('click', () => {
    critSearch.value = ''; critClear.style.display = 'none'; panolRenderCriticos();
  });
  document.getElementById('panol-crit-solo-sin').addEventListener('change', panolRenderCriticos);
  document.getElementById('panol-crit-export-btn').addEventListener('click', panolExportCriticos);
  document.getElementById('panol-crit-tbody').addEventListener('click', e => {
    const chip = e.target.closest('[data-goto]');
    if (chip) panolGotoEquipo(chip.dataset.goto);
  });

  document.querySelectorAll('.panol-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.panol-view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const v = btn.dataset.view;
      document.getElementById('panol-catalogo-view').classList.toggle('hidden', v !== 'catalogo');
      document.getElementById('panol-repuestos-view').classList.toggle('hidden', v !== 'repuestos');
      document.getElementById('panol-criticos-view').classList.toggle('hidden', v !== 'criticos');
      if (v === 'repuestos') panolRenderRepuestos();
      if (v === 'criticos') panolRenderCriticos();
    });
  });

  // Modal material
  document.getElementById('panol-modal-close').addEventListener('click', panolCloseMaterialModal);
  document.getElementById('panol-modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) panolCloseMaterialModal();
  });

  // Editor de repuestos (admin)
  document.getElementById('panol-rep-add-btn').addEventListener('click', () => panolOpenEditor(null));
  document.getElementById('panol-rep-add-mat').addEventListener('click', () => panolAddMatRow('', ''));
  document.getElementById('panol-rep-cancel').addEventListener('click', panolCloseEditor);
  document.getElementById('panol-rep-save').addEventListener('click', panolSaveEditor);
  document.getElementById('panol-rep-list').addEventListener('click', e => {
    const ed = e.target.closest('[data-edit]');
    const dl = e.target.closest('[data-del]');
    if (ed) panolOpenEditor(ed.dataset.edit);
    if (dl) panolDeleteEquipo(dl.dataset.del);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    panolCloseMaterialModal();
    panolCloseEditor();
  });

  panolStartModalObserver();

  // Repuestos view depende del modo admin → re-render al togglear el candado
  new MutationObserver(() => {
    if (!document.getElementById('panol-repuestos-view').classList.contains('hidden')) panolRenderRepuestos();
    else document.getElementById('panol-rep-add-btn').style.display =
      document.body.classList.contains('admin-mode') ? '' : 'none';
    if (!document.getElementById('panol-criticos-view').classList.contains('hidden')) panolRenderCriticos();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

/* ─── Stats ──────────────────────────────────────────────── */
function panolRenderStats() {
  const con = PANOL_DATA.filter(m => (Number(m.stock) || 0) > 0).length;
  const grupos = new Set(PANOL_DATA.map(m => m.grupo).filter(Boolean)).size;
  const crit = panolCriticosAgg();
  const critSin = crit.filter(g => g.stock == null || g.stock === 0).length;
  const cards = [
    { label: 'Materiales en catálogo', value: PANOL_DATA.length.toLocaleString('es-AR'), icon: '📦', color: '#1a56a4' },
    { label: 'Con stock disponible',   value: con.toLocaleString('es-AR'),               icon: '✅', color: '#10b981' },
    { label: 'Sin stock (en 0)',       value: (PANOL_DATA.length - con).toLocaleString('es-AR'), icon: '⚪', color: '#6b7280' },
    { label: 'Grupos de artículos',    value: grupos,                                    icon: '🗂️', color: '#7c3aed' },
    { label: 'Equipos con repuestos',  value: PANOL_REPUESTOS.length,                    icon: '🔩', color: '#d97706' },
    { label: 'Repuestos críticos',     value: `${crit.length}${critSin ? ` · ${critSin} s/stock` : ''}`, icon: '⚠️', color: '#dc2626' },
  ];
  document.getElementById('panol-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>`).join('');
}

/* ─── Filtro de grupo ────────────────────────────────────── */
function panolBuildGrupoFilter() {
  const sel = document.getElementById('panol-grupo-filter');
  const grupos = [...new Set(PANOL_DATA.map(m => m.grupo).filter(Boolean))]
    .sort((a, b) => (Number(a) || 0) - (Number(b) || 0) || String(a).localeCompare(b));
  grupos.forEach(g => {
    const o = document.createElement('option');
    o.value = g; o.textContent = `Grupo ${g}`;
    sel.appendChild(o);
  });
}

/* ─── Filtros catálogo ───────────────────────────────────── */
function panolApplyFilters() {
  const q     = document.getElementById('panol-search').value.trim().toLowerCase();
  const grupo = document.getElementById('panol-grupo-filter').value;
  const solo  = document.getElementById('panol-solo-stock').checked;

  panolFiltered = PANOL_DATA.filter(m => {
    if (grupo && m.grupo !== grupo) return false;
    if (solo && !((Number(m.stock) || 0) > 0)) return false;
    if (q) {
      const hay = (m.cod + ' ' + m.desc).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => String(a.cod).localeCompare(String(b.cod)));

  panolShown = PANOL_PAGE_SIZE;
  panolRenderTable();
}

function panolRenderTable() {
  const tbody = document.getElementById('panol-tbody');
  const total = panolFiltered.length;
  const slice = panolFiltered.slice(0, panolShown);

  if (!total) {
    tbody.innerHTML = `<tr><td colspan="5">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron materiales con los filtros aplicados.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = slice.map(m => {
      const st = Number(m.stock) || 0;
      return `<tr data-cod="${panolEsc(m.cod)}" style="cursor:pointer">
        <td><span class="equipo-tag">${panolEsc(m.cod)}</span></td>
        <td>${panolEsc(m.desc) || '<span class="no-data">—</span>'}</td>
        <td>${panolEsc(m.um) || '<span class="no-data">—</span>'}</td>
        <td>${m.grupo ? panolEsc(m.grupo) : '<span class="no-data">—</span>'}</td>
        <td>${panolStockBadge(st)}</td>
      </tr>`;
    }).join('');
    tbody.querySelectorAll('tr[data-cod]').forEach(r =>
      r.addEventListener('click', () => panolOpenMaterialModal(r.dataset.cod)));
  }

  document.getElementById('panol-result-count').textContent =
    total ? `${Math.min(panolShown, total).toLocaleString('es-AR')} de ${total.toLocaleString('es-AR')} materiales` : 'Sin resultados';
  const moreBtn = document.getElementById('panol-more-btn');
  moreBtn.style.display = total > panolShown ? '' : 'none';
  moreBtn.textContent = `Mostrar ${Math.min(PANOL_PAGE_SIZE, total - panolShown)} más`;
}

/* ─── Modal detalle de material ──────────────────────────── */
function panolOpenMaterialModal(cod) {
  const m = PANOL_BY_COD.get(String(cod));
  if (!m) return;
  const st = Number(m.stock) || 0;
  // Nota: NO se usa la clase .modal-equipo acá a propósito — otros módulos
  // (ots-app.js) inyectan el historial de OTs en cualquier modal que la
  // tenga, tratando el código como si fuera un equipo.
  document.getElementById('panol-modal-header').innerHTML = `
    <span class="panol-modal-cod">${panolEsc(m.cod)}</span>
    <div class="modal-denom">${panolEsc(m.desc) || 'Material de pañol'}</div>`;

  const usa = PANOL_REPUESTOS
    .filter(r => (r.materiales || []).some(x => String(x.cod) === String(m.cod)))
    .map(r => ({ equipo: r.equipo, denom: panolEquipoDenom(r.equipo) }));

  document.getElementById('panol-modal-body').innerHTML = `
    <div class="modal-field"><span class="modal-field-label">Código SAP</span><span class="modal-field-value mono">${panolEsc(m.cod)}</span></div>
    <div class="modal-field"><span class="modal-field-label">Unidad de medida</span><span class="modal-field-value">${panolEsc(m.um) || '—'}</span></div>
    <div class="modal-field"><span class="modal-field-label">Grupo de artículos</span><span class="modal-field-value">${m.grupo ? panolEsc(m.grupo) : '—'}</span></div>
    <div class="modal-field"><span class="modal-field-label">Stock (libre utilización)</span><span class="modal-field-value">${panolStockBadge(st)}</span></div>
    <div class="modal-field full">
      <span class="modal-field-label">Equipos que lo usan como repuesto</span>
      <span class="modal-field-value">
        ${usa.length
          ? `<div class="panol-usa-list">${usa.map(u =>
              `<button class="panol-usa-chip" data-goto="${panolEsc(u.equipo)}"><span class="equipo-tag">${panolEsc(u.equipo)}</span> ${panolEsc(u.denom)}</button>`).join('')}</div>`
          : '<span class="no-data">Ninguno asignado todavía</span>'}
      </span>
    </div>`;

  document.getElementById('panol-modal-body').querySelectorAll('[data-goto]').forEach(b =>
    b.addEventListener('click', () => { panolCloseMaterialModal(); panolGotoEquipo(b.dataset.goto); }));

  document.getElementById('panol-modal-overlay').classList.add('open');
}
function panolCloseMaterialModal() {
  document.getElementById('panol-modal-overlay').classList.remove('open');
}
function panolGotoEquipo(equipo) {
  const fam = panolEquipoFamilia(equipo);
  if (!fam) return;
  if (typeof showPage === 'function') showPage(fam.page);
  setTimeout(() => { if (typeof window[fam.open] === 'function') window[fam.open](equipo); }, 200);
}

/* ─── Vista: Repuestos por equipo (BOM) ──────────────────── */
function panolEquipoFamLabel(equipo) {
  const fam = panolEquipoFamilia(equipo);
  return fam ? (PANOL_FAM_LABEL[fam.page] || fam.page) : 'Sin familia';
}

function panolBuildRepFamFilter() {
  const sel = document.getElementById('panol-rep-fam-filter');
  if (!sel || sel.options.length > 1) return;
  const labels = [...new Set(PANOL_REPUESTOS.map(e => panolEquipoFamLabel(e.equipo)))].sort();
  labels.forEach(l => {
    const o = document.createElement('option');
    o.value = l; o.textContent = l;
    sel.appendChild(o);
  });
}

/* Devuelve las entradas de BOM que pasan los filtros de la vista */
function panolRepFiltered() {
  const q    = (document.getElementById('panol-rep-search').value || '').trim().toLowerCase();
  const fam  = document.getElementById('panol-rep-fam-filter').value;
  const falt = document.getElementById('panol-rep-solo-faltante').checked;
  const fuera = document.getElementById('panol-rep-solo-fuera').checked;

  return [...PANOL_REPUESTOS]
    .sort((a, b) => String(a.equipo).localeCompare(String(b.equipo)))
    .map(entry => {
      const denom = panolEquipoDenom(entry.equipo);
      const famLbl = panolEquipoFamLabel(entry.equipo);
      const mats = (entry.materiales || []).map(x => {
        const m   = PANOL_BY_COD.get(String(x.cod));
        const st  = panolStockNum(x.cod);
        const qty = panolMatQty(x);
        const opciones = panolMatOpciones(x);
        return {
          cod: String(x.cod), nota: x.nota || '', qty, opciones,
          desc: m ? m.desc : '', um: m ? m.um : '',
          stock: st, enCatalogo: !!m,
          faltante: st != null && st < qty,
          critico: panolMatCritico(x),
        };
      });
      return { equipo: entry.equipo, denom, famLbl, mats };
    })
    .filter(e => {
      if (fam && e.famLbl !== fam) return false;
      if (falt && !e.mats.some(x => x.faltante)) return false;
      if (fuera && !e.mats.some(x => !x.enCatalogo)) return false;
      if (q) {
        const hay = (e.equipo + ' ' + e.denom + ' ' + e.famLbl + ' ' +
          e.mats.map(x => x.cod + ' ' + x.desc + ' ' + x.nota + ' ' + x.opciones.join(' ')).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
}

function panolRenderRepuestos() {
  const host  = document.getElementById('panol-rep-list');
  const admin = document.body.classList.contains('admin-mode');
  document.getElementById('panol-rep-add-btn').style.display = admin ? '' : 'none';
  panolBuildRepFamFilter();

  const countEl = document.getElementById('panol-rep-result-count');

  if (!PANOL_REPUESTOS.length) {
    if (countEl) countEl.textContent = '';
    host.innerHTML = `<div class="empty-state"><div class="empty-icon">🔩</div>
      <p>Todavía no hay repuestos asignados a ningún equipo.${
        admin ? ' Usá el botón <strong>“➕ Asignar repuestos a un equipo”</strong>.'
              : ' La carga se hace desde el modo administrador (candado 🔒).'}</p></div>`;
    return;
  }

  const list = panolRepFiltered();
  const totalMats = list.reduce((s, e) => s + e.mats.length, 0);
  if (countEl) {
    countEl.textContent = list.length
      ? `${list.length} equipo${list.length === 1 ? '' : 's'} · ${totalMats} línea${totalMats === 1 ? '' : 's'} de BOM`
      : 'Sin resultados';
  }

  if (!list.length) {
    host.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div>
      <p>Ningún equipo coincide con los filtros aplicados.</p></div>`;
    return;
  }

  host.innerHTML = list.map(entry => {
    const mats = entry.mats;
    const nFalt = mats.filter(x => x.faltante).length;
    const rows = mats.map(x => `<tr${x.faltante ? ' class="panol-rep-row-falt"' : ''}>
        <td><span class="equipo-tag">${panolEsc(x.cod)}</span>${x.critico ? ' <span class="panol-crit-tag" title="Repuesto crítico">⚠️</span>' : ''}</td>
        <td>${x.enCatalogo ? panolEsc(x.desc) : '<span class="no-data">Código fuera del catálogo</span>'}${
          x.nota ? ` <span class="panol-nota">— ${panolEsc(x.nota)}</span>` : ''}${panolOpcionesHTML(x.opciones)}</td>
        <td class="panol-rep-qty">${panolNum(x.qty)}</td>
        <td>${x.enCatalogo ? panolEsc(x.um) : ''}</td>
        <td>${panolStockBadge(x.stock)}</td>
        <td>${panolCoberturaBadge(x.stock, x.qty)}</td>
      </tr>`).join('');
    return `<div class="panol-rep-card">
      <div class="panol-rep-head">
        <span class="equipo-tag">${panolEsc(entry.equipo)}</span>
        <span class="panol-rep-denom">${panolEsc(entry.denom)}</span>
        <span class="panol-rep-fam">${panolEsc(entry.famLbl)}</span>
        <span class="panol-rep-count">${mats.length} material${mats.length === 1 ? '' : 'es'}</span>
        ${nFalt ? `<span class="panol-rep-count warn">${nFalt} con faltante</span>` : ''}
        ${admin ? `<span class="panol-rep-actions">
          <button class="panol-mini-btn" data-edit="${panolEsc(entry.equipo)}">✏ Editar</button>
          <button class="panol-mini-btn danger" data-del="${panolEsc(entry.equipo)}">🗑</button>
        </span>` : ''}
      </div>
      <div class="table-wrap"><table class="panol-rep-table">
        <thead><tr><th>Código SAP</th><th>Descripción</th><th>Cant.</th><th>UM</th><th>Stock</th><th>Cobertura</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6"><span class="no-data">Sin materiales</span></td></tr>'}</tbody>
      </table></div>
    </div>`;
  }).join('');
}

/* Exporta el BOM filtrado a Excel (una fila por línea equipo↔material) */
function panolExportBOM() {
  const list = panolRepFiltered();
  const rows = [];
  list.forEach(e => e.mats.forEach(x => {
    rows.push({
      equipo: e.equipo,
      denominacion: e.denom,
      familia: e.famLbl,
      cod: x.cod,
      desc: x.enCatalogo ? x.desc : 'FUERA DE CATÁLOGO',
      qty: x.qty,
      um: x.um,
      stock: x.stock == null ? '' : x.stock,
      cobertura: panolCobertura(x.stock, x.qty).txt,
      opciones: (x.opciones || []).join(' / '),
      nota: x.nota,
    });
  }));
  if (!rows.length) { panolToast('No hay líneas de BOM para exportar con los filtros actuales.', 'error'); return; }
  exportToExcel(rows, [
    { key: 'equipo',       header: 'Equipo' },
    { key: 'denominacion', header: 'Denominación' },
    { key: 'familia',      header: 'Familia' },
    { key: 'cod',          header: 'Código SAP' },
    { key: 'desc',         header: 'Descripción' },
    { key: 'qty',          header: 'Cant. necesaria' },
    { key: 'um',           header: 'UM' },
    { key: 'stock',        header: 'Stock actual' },
    { key: 'cobertura',    header: 'Cobertura' },
    { key: 'opciones',     header: 'Códigos alternativos' },
    { key: 'nota',         header: 'Nota' },
  ], 'AEP_Panol_BOM_por_equipo');
}

/* ─── Vista: Repuestos críticos ──────────────────────────── */
/* Agrupa todas las líneas de BOM marcadas como críticas por código SAP. */
function panolCriticosAgg() {
  const map = new Map();
  PANOL_REPUESTOS.forEach(entry => {
    (entry.materiales || []).forEach(x => {
      if (!panolMatCritico(x)) return;
      const cod = String(x.cod);
      let g = map.get(cod);
      if (!g) {
        const m = PANOL_BY_COD.get(cod);
        g = {
          cod, enCatalogo: !!m,
          desc: m ? m.desc : '', um: m ? m.um : '',
          stock: panolStockNum(cod),
          equipos: [],
        };
        map.set(cod, g);
      }
      g.equipos.push({
        equipo: entry.equipo,
        denom: panolEquipoDenom(entry.equipo),
        fam: panolEquipoFamLabel(entry.equipo),
        nota: x.nota || '',
      });
    });
  });
  return [...map.values()];
}

function panolCritRiesgo(g) {
  if (g.stock == null || g.stock === 0) return { cls: 'none', txt: 'Alto', ord: 0 };
  if (g.stock < g.equipos.length)       return { cls: 'parcial', txt: 'Medio', ord: 1 };
  return { cls: 'ok', txt: 'Cubierto', ord: 2 };
}

function panolCriticosFiltered() {
  const q   = (document.getElementById('panol-crit-search').value || '').trim().toLowerCase();
  const sin = document.getElementById('panol-crit-solo-sin').checked;
  return panolCriticosAgg()
    .filter(g => {
      if (sin && !(g.stock == null || g.stock === 0)) return false;
      if (q) {
        const hay = (g.cod + ' ' + g.desc + ' ' +
          g.equipos.map(e => e.equipo + ' ' + e.denom + ' ' + e.fam).join(' ')).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) =>
      panolCritRiesgo(a).ord - panolCritRiesgo(b).ord ||
      b.equipos.length - a.equipos.length ||
      String(a.cod).localeCompare(String(b.cod)));
}

function panolRenderCriticos() {
  const tbody = document.getElementById('panol-crit-tbody');
  const list  = panolCriticosFiltered();
  const countEl = document.getElementById('panol-crit-result-count');

  if (!list.length) {
    const total = panolCriticosAgg().length;
    if (countEl) countEl.textContent = total ? 'Sin resultados' : '';
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">${total ? '🔍' : '⚠️'}</div>
      <p>${total
        ? 'Ningún repuesto crítico coincide con los filtros.'
        : 'Todavía no hay repuestos marcados como críticos. Se marcan desde el modo administrador al editar los repuestos de un equipo.'}</p></div></td></tr>`;
    return;
  }

  const sinStock = list.filter(g => g.stock == null || g.stock === 0).length;
  if (countEl) {
    countEl.textContent = `${list.length} repuesto${list.length === 1 ? '' : 's'} crítico${list.length === 1 ? '' : 's'}` +
      (sinStock ? ` · ${sinStock} sin stock` : '');
  }

  tbody.innerHTML = list.map(g => {
    const r = panolCritRiesgo(g);
    const eqs = [...g.equipos].sort((a, b) => String(a.equipo).localeCompare(String(b.equipo)));
    const chips = eqs.map(e =>
      `<button class="panol-usa-chip" data-goto="${panolEsc(e.equipo)}" title="${panolEsc(e.denom)}"><span class="equipo-tag">${panolEsc(e.equipo)}</span></button>`).join('');
    return `<tr>
      <td><span class="panol-cob panol-cob-${r.cls}">${r.txt}</span></td>
      <td><span class="equipo-tag">${panolEsc(g.cod)}</span></td>
      <td>${g.enCatalogo ? panolEsc(g.desc) : '<span class="no-data">Fuera del catálogo</span>'}</td>
      <td>${g.enCatalogo ? panolEsc(g.um) : ''}</td>
      <td>${panolStockBadge(g.stock)}</td>
      <td><div class="panol-usa-list">${chips}</div></td>
    </tr>`;
  }).join('');
}

function panolExportCriticos() {
  const list = panolCriticosFiltered();
  if (!list.length) { panolToast('No hay repuestos críticos para exportar con los filtros actuales.', 'error'); return; }
  const rows = list.map(g => ({
    riesgo: panolCritRiesgo(g).txt,
    cod: g.cod,
    desc: g.enCatalogo ? g.desc : 'FUERA DE CATÁLOGO',
    um: g.um,
    stock: g.stock == null ? '' : g.stock,
    n_equipos: g.equipos.length,
    equipos: [...new Set(g.equipos.map(e => e.equipo))].sort().join(' / '),
  }));
  exportToExcel(rows, [
    { key: 'riesgo',    header: 'Riesgo' },
    { key: 'cod',       header: 'Código SAP' },
    { key: 'desc',      header: 'Descripción' },
    { key: 'um',        header: 'UM' },
    { key: 'stock',     header: 'Stock actual' },
    { key: 'n_equipos', header: 'N° equipos' },
    { key: 'equipos',   header: 'Equipos' },
  ], 'AEP_Panol_Repuestos_criticos');
}

/* ─── Editor de repuestos (admin) ────────────────────────── */
let panolEditing = null;

function panolOpenEditor(equipo) {
  if (!document.body.classList.contains('admin-mode')) {
    panolToast('🔒 Iniciá sesión como administrador (candado, abajo a la izquierda).', 'error');
    return;
  }
  panolEditing = equipo || null;
  const entry = equipo ? PANOL_REPUESTOS.find(r => r.equipo === equipo) : null;

  document.getElementById('panol-rep-editor-title').textContent =
    equipo ? `Editar repuestos — ${equipo}` : 'Asignar repuestos a un equipo';

  // datalist de equipos
  const eqDl = document.getElementById('panol-equipos-datalist');
  if (!eqDl.childElementCount) {
    const frag = document.createDocumentFragment();
    panolAllEquipos().forEach((den, cod) => {
      const o = document.createElement('option');
      o.value = cod; o.label = den; frag.appendChild(o);
    });
    eqDl.appendChild(frag);
  }

  const eqInput = document.getElementById('panol-rep-equipo');
  eqInput.value = equipo || '';
  eqInput.disabled = !!equipo;

  const rowsHost = document.getElementById('panol-rep-mat-rows');
  rowsHost.innerHTML = '';
  const mats = (entry && entry.materiales && entry.materiales.length) ? entry.materiales : [{ cod: '', nota: '' }];
  mats.forEach(m => panolAddMatRow(m.cod, m.nota, panolMatQty(m), panolMatOpciones(m), panolMatCritico(m)));

  document.getElementById('panol-rep-editor').classList.add('open');
}

function panolAddMatRow(cod, nota, qty, opciones, critico) {
  const host = document.getElementById('panol-rep-mat-rows');
  const row = document.createElement('div');
  row.className = 'panol-mat-row';
  // Se conservan las opciones equivalentes si la fila no cambia de código (no editables por UI)
  row.dataset.baseCod = cod || '';
  row.dataset.opciones = JSON.stringify(Array.isArray(opciones) ? opciones : []);
  row.innerHTML = `
    <input class="admin-field-input panol-mat-cod" list="panol-mat-datalist" placeholder="Código de material" value="${panolEsc(cod || '')}" />
    <input class="admin-field-input panol-mat-qty" type="number" min="1" step="1" title="Cantidad necesaria" value="${Number(qty) > 0 ? Number(qty) : 1}" />
    <input class="admin-field-input panol-mat-nota" placeholder="Nota (opcional)" value="${panolEsc(nota || '')}" />
    <label class="panol-mat-crit-lbl" title="Marcar como repuesto crítico"><input type="checkbox" class="panol-mat-crit"${critico ? ' checked' : ''} /> crítico</label>
    <span class="panol-mat-desc"></span>
    <button class="panol-mat-rm" title="Quitar">✕</button>`;
  host.appendChild(row);

  const codInput = row.querySelector('.panol-mat-cod');
  const descEl   = row.querySelector('.panol-mat-desc');
  const refresh = () => {
    const m = PANOL_BY_COD.get(codInput.value.trim());
    descEl.textContent = m ? `${m.desc} · stock ${panolNum(m.stock)}` : (codInput.value.trim() ? '⚠ no está en el catálogo' : '');
    descEl.className = 'panol-mat-desc' + (codInput.value.trim() && !m ? ' warn' : '');
  };
  codInput.addEventListener('input', () => { panolFillMatDatalist(codInput.value); refresh(); });
  row.querySelector('.panol-mat-rm').addEventListener('click', () => row.remove());
  refresh();
}

function panolFillMatDatalist(term) {
  const dl = document.getElementById('panol-mat-datalist');
  term = term.trim().toLowerCase();
  if (term.length < 2) { dl.innerHTML = ''; return; }
  const hits = [];
  for (const m of PANOL_DATA) {
    if ((m.cod + ' ' + m.desc).toLowerCase().includes(term)) {
      hits.push(m);
      if (hits.length >= 40) break;
    }
  }
  dl.innerHTML = hits.map(m => `<option value="${panolEsc(m.cod)}">${panolEsc(m.desc)} · stock ${panolNum(m.stock)}</option>`).join('');
}

function panolCloseEditor() {
  document.getElementById('panol-rep-editor').classList.remove('open');
  panolEditing = null;
}

async function panolSaveEditor() {
  const equipo = document.getElementById('panol-rep-equipo').value.trim().toUpperCase();
  if (!equipo) { panolToast('Indicá el código de equipo.', 'error'); return; }

  const seen = new Set();
  const materiales = [];
  document.querySelectorAll('#panol-rep-mat-rows .panol-mat-row').forEach(row => {
    const cod  = row.querySelector('.panol-mat-cod').value.trim();
    const nota = row.querySelector('.panol-mat-nota').value.trim();
    const qty  = Math.max(1, Math.round(Number(row.querySelector('.panol-mat-qty').value) || 1));
    if (!cod || seen.has(cod)) return;
    seen.add(cod);
    const m = { cod };
    if (qty !== 1) m.qty = qty;
    let opc = [];
    try { opc = JSON.parse(row.dataset.opciones || '[]'); } catch (e) { opc = []; }
    if (opc.length && row.dataset.baseCod === cod) m.opciones = opc;
    const critEl = row.querySelector('.panol-mat-crit');
    if (critEl && critEl.checked) m.critico = true;
    if (nota) m.nota = nota;
    materiales.push(m);
  });

  if (!materiales.length && !confirm(`El equipo ${equipo} quedará sin materiales asignados (se quita de la lista). ¿Continuar?`)) return;

  await panolCommitRepuestos(equipo, materiales);
}

function panolDeleteEquipo(equipo) {
  if (!confirm(`Quitar todos los repuestos asignados a ${equipo}?`)) return;
  panolCommitRepuestos(equipo, []);
}

/* ─── Guardado (admin, vía GitHub) ───────────────────────── */
async function panolFetchLatestRepuestos() {
  try {
    const r = await fetch('/assets/js/panol-repuestos-data.js?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return null;
    const t = await r.text();
    const arr = new Function(t + ';return (typeof PANOL_REPUESTOS !== "undefined") ? PANOL_REPUESTOS : null;')();
    return Array.isArray(arr) ? arr : null;
  } catch (e) { return null; }
}

async function panolCommitRepuestos(equipo, materiales) {
  const pwd = sessionStorage.getItem('admin_pwd');
  if (!pwd) { panolToast('🔒 Iniciá sesión como administrador para guardar cambios.', 'error'); return; }

  const fresh = (await panolFetchLatestRepuestos()) || PANOL_REPUESTOS;
  const working = fresh.map(e => ({ equipo: e.equipo, materiales: (e.materiales || []).map(m => ({ ...m })) }));
  const idx = working.findIndex(e => String(e.equipo) === String(equipo));
  if (!materiales.length) {
    if (idx >= 0) working.splice(idx, 1);
  } else if (idx >= 0) {
    working[idx].materiales = materiales;
  } else {
    working.push({ equipo, materiales });
  }

  panolToast('⏳ Guardando en GitHub…', '');
  try {
    const res = await fetch('/api/update-equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'panol-repuestos', data: working, password: pwd }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success) {
      PANOL_REPUESTOS.length = 0;
      Array.prototype.push.apply(PANOL_REPUESTOS, working);
      panolCloseEditor();
      panolRenderRepuestos();
      panolRenderStats();
      panolRefreshOpenModal();
      panolToast('✅ Guardado en GitHub. El sitio redespliega en ~1 min para el resto.', 'success');
    } else if (res.status === 401) {
      panolToast('❌ Contraseña de administrador incorrecta.', 'error');
    } else {
      panolToast('❌ ' + (json.error || ('Error ' + res.status)), 'error');
    }
  } catch (e) {
    panolToast('❌ Error de red: ' + e.message, 'error');
  }
}

function panolToast(msg, type) {
  const t = document.getElementById('admin-toast');
  if (!t) { if (type === 'error') alert(msg); return; }
  t.textContent = msg;
  t.className = 'admin-toast show' + (type ? ' ' + type : '');
  if (type === 'success' || type === 'error') setTimeout(() => t.classList.remove('show'), 9000);
}

/* ─── Bloque "Repuestos de pañol" dentro de la ficha de equipos ── */
function panolRepuestosBlockHTML(equipo) {
  const entry = PANOL_REPUESTOS.find(r => String(r.equipo) === String(equipo));
  if (!entry || !(entry.materiales || []).length) return '';
  const rows = entry.materiales.map(x => {
    const m   = PANOL_BY_COD.get(String(x.cod));
    const st  = panolStockNum(x.cod);
    const qty = panolMatQty(x);
    return `<tr>
      <td><span class="equipo-tag">${panolEsc(x.cod)}</span></td>
      <td>${m ? panolEsc(m.desc) : '<span class="no-data">Fuera del catálogo</span>'}${
        x.nota ? ` <span class="panol-nota">— ${panolEsc(x.nota)}</span>` : ''}${panolOpcionesHTML(panolMatOpciones(x))}</td>
      <td class="panol-rep-qty">${panolNum(qty)}</td>
      <td>${panolStockBadge(st)}</td>
      <td>${panolCoberturaBadge(st, qty)}</td>
    </tr>`;
  }).join('');
  return `<div class="panol-modal-block">
    <div class="panol-modal-block-title">🔩 Repuestos de pañol (BOM)</div>
    <div class="table-wrap"><table class="panol-rep-table">
      <thead><tr><th>Código SAP</th><th>Descripción</th><th>Cant.</th><th>Stock</th><th>Cobertura</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>`;
}

function panolInjectIntoModal(modal) {
  if (!modal || modal.id === 'panol-modal') return;
  const body = modal.querySelector('.modal-body');
  if (!body || body.querySelector('.panol-modal-block')) return;
  const codeEl = modal.querySelector('.modal-equipo');
  if (!codeEl) return;
  const html = panolRepuestosBlockHTML(codeEl.textContent.trim());
  if (html) body.insertAdjacentHTML('beforeend', html);
}

function panolRefreshOpenModal() {
  document.querySelectorAll('.modal.open, .modal-overlay.open .modal').forEach(modal => {
    const old = modal.querySelector('.panol-modal-block');
    if (old) old.remove();
    panolInjectIntoModal(modal);
  });
}

function panolStartModalObserver() {
  const scan = () => document.querySelectorAll('.modal.open, .modal-overlay.open .modal').forEach(panolInjectIntoModal);
  new MutationObserver(scan).observe(document.body, {
    attributes: true, attributeFilter: ['class'], subtree: true, childList: true,
  });
  scan();
}
