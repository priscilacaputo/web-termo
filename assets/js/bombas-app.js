/* ─── Stats ──────────────────────────────────────────── */
(function renderBombasStats() {
  const total     = BOMBAS_DATA.length;
  const incendio  = BOMBAS_DATA.filter(b => bombaTipo(b.denominacion) === "incendio").length;
  const cloacal   = BOMBAS_DATA.filter(b => bombaTipo(b.denominacion) === "cloacal").length;
  const pluvial   = BOMBAS_DATA.filter(b => bombaTipo(b.denominacion) === "pluvial").length;

  const cards = [
    { label: "Total bombas",      value: total,    icon: "💧", color: "#1a56a4" },
    { label: "Incendio",          value: incendio, icon: "🔴", color: "#dc2626" },
    { label: "Cloacal",           value: cloacal,  icon: "🟣", color: "#7c3aed" },
    { label: "Pluvial / Napa",    value: pluvial,  icon: "🔵", color: "#0891b2" },
  ];

  document.getElementById("bom-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".bom-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".bom-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planesVisible = view === "planes";
    document.getElementById("bom-grid-view")  .classList.toggle("hidden", view !== "grid");
    document.getElementById("bom-table-view") .classList.toggle("hidden", view !== "table");
    document.getElementById("bom-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("bomTipoFilter").closest(".filter-group").classList.toggle("hidden", planesVisible);
  });
});

/* ─── Tipo filter ────────────────────────────────────── */
const bomTipoFilter = document.getElementById("bomTipoFilter");
bomTipoFilter.addEventListener("change", () => {
  renderBombasGrid();
  renderBombasTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredBom() {
  const tipo = bomTipoFilter.value;
  return tipo
    ? BOMBAS_DATA.filter(b => bombaTipo(b.denominacion) === tipo)
    : BOMBAS_DATA;
}

/* ─── Grid ───────────────────────────────────────────── */
function renderBombasGrid() {
  const filtered    = getFilteredBom();
  const filteredSet = new Set(filtered.map(b => b.equipo));

  document.getElementById("bom-grid").innerHTML = BOMBAS_DATA.map(b => {
    const tipo   = bombaTipo(b.denominacion);
    const color  = TIPO_COLORS_BOM[tipo];
    const dimmed = filtered.length === BOMBAS_DATA.length || filteredSet.has(b.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${b.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${b.equipo}</span>
          <span class="asc-fab-label">${TIPO_LABELS_BOM[tipo]}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${b.denominacion}</div>
          ${b.fabricante ? `<div class="asc-fab" style="color:${color};font-size:11px;font-weight:600;margin-top:4px">${b.fabricante}</div>` : ''}
          ${b.modelo    ? `<div style="font-size:10px;color:var(--color-muted);font-family:monospace;margin-top:2px">${b.modelo}</div>` : ''}
          <div class="asc-location">${b.ubi_desc}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("#bom-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openBomModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderBombasTable() {
  const filtered = getFilteredBom();
  const tbody    = document.getElementById("bomBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    const tipo  = bombaTipo(b.denominacion);
    const color = TIPO_COLORS_BOM[tipo];
    return `
      <tr data-equipo="${b.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${b.equipo}</span></td>
        <td>${b.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${TIPO_LABELS_BOM[tipo]}</span></td>
        <td style="font-size:11px">${b.fabricante || '<span style="color:var(--color-muted)">—</span>'}</td>
        <td style="font-size:10px;font-family:monospace;color:var(--color-muted)">${b.modelo || '—'}</td>
        <td style="font-size:11px;color:var(--color-muted)">${b.ubi_desc}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openBomModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const bomModal      = document.getElementById("bomModalOverlay");
const bomModalClose = document.getElementById("bomModalClose");
const bomModalHdr   = document.getElementById("bomModalHeader");
const bomModalBody  = document.getElementById("bomModalBody");

function openBomModal(equipo) {
  const b = BOMBAS_DATA.find(x => x.equipo === equipo);
  if (!b) return;
  const tipo  = bombaTipo(b.denominacion);
  const color = TIPO_COLORS_BOM[tipo];

  bomModalHdr.style.background = color;
  bomModalHdr.innerHTML = `
    <span class="modal-equipo">${b.equipo}</span>
    <div class="modal-denom">${TIPO_LABELS_BOM[tipo]}</div>
    <div class="modal-dominio">${b.denominacion}</div>
  `;

  const dim   = b.dimension ? `<div class="modal-field"><span class="modal-field-label">Dimensión / Potencia</span><span class="modal-field-value mono">${b.dimension}</span></div>` : '';
  const fab   = b.fabricante ? `<div class="modal-field"><span class="modal-field-label">Fabricante</span><span class="modal-field-value">${b.fabricante}</span></div>` : '';
  const model = b.modelo ? `<div class="modal-field"><span class="modal-field-label">Modelo</span><span class="modal-field-value mono">${b.modelo}</span></div>` : '';

  bomModalBody.innerHTML = `
    ${fab}
    ${model}
    ${dim}
    <div class="modal-field">
      <span class="modal-field-label">Tipo</span>
      <span class="modal-field-value">${TIPO_LABELS_BOM[tipo]}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${b.ubi_desc}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación</span>
      <span class="modal-field-value">${b.denominacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${b.ubicacion}</span>
    </div>
  `;

  bomModal.classList.add("open");
}

bomModalClose.addEventListener("click", () => bomModal.classList.remove("open"));
bomModal.addEventListener("click", ev => { if (ev.target === bomModal) bomModal.classList.remove("open"); });
document.addEventListener("keydown", ev => {
  if (ev.key === "Escape") {
    bomModal.classList.remove("open");
  }
});

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedBomPlan = null;

function renderBomPlanesSelector() {
  const container = document.getElementById("bomPlanesSelector");
  container.innerHTML = BOMBAS_DATA.map(b => {
    const planId  = BOMBA_A_PLAN[b.equipo];
    const tipo    = bombaTipo(b.denominacion);
    const color   = TIPO_COLORS_BOM[tipo];
    const hasPlan = !!planId;
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedBomPlan === b.equipo ? 'selected' : ''}" data-equipo="${b.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${b.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${b.denominacion.substring(0, 28)}</div>
        <div class="manga-sel-fab" style="color:${color};font-size:10px">${b.ubi_desc}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedBomPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      renderBomPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderBomPlan(equipo) {
  const b       = BOMBAS_DATA.find(x => x.equipo === equipo);
  const planId  = BOMBA_A_PLAN[equipo];
  const container = document.getElementById("bomPlanContent");
  const tipo    = bombaTipo(b.denominacion);
  const color   = TIPO_COLORS_BOM[tipo];

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${b.denominacion}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan = BOMBAS_PLANES.find(p => p.id === planId);
  const eqTags = plan.equipos.map(eq => {
    const bx   = BOMBAS_DATA.find(x => x.equipo === eq);
    const t2   = bx ? bombaTipo(bx.denominacion) : "agua";
    const c2   = TIPO_COLORS_BOM[t2];
    return `<span class="manga-equipo-tag" style="background:${c2}" title="${bx ? bx.ubi_desc : ''}">${eq}</span>`;
  }).join(" ");

  const freqSections = plan.frecuencias.map(frec => {
    const totalTareas = frec.grupos.reduce((sum, g) => sum + g.tareas.length, 0);
    const grupos = frec.grupos.map(g => `
      <div class="manga-grupo">
        <div class="manga-grupo-nombre">${g.nombre}</div>
        <ul class="km-task-list">
          ${g.tareas.map(t => `<li>${t}</li>`).join("")}
        </ul>
      </div>`).join("");
    return `
      <div class="manga-freq-section">
        <div class="manga-freq-header" style="background:${frec.color}">
          <div>
            <span class="manga-freq-label">${frec.sublabel} — Frecuencia</span>
            <span class="manga-freq-badge">${frec.label}</span>
          </div>
          <span class="manga-freq-count">${totalTareas} tareas</span>
        </div>
        <div class="manga-grupo-grid">${grupos}</div>
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title">${plan.denominacion}</h2>
        <p class="mant-section-desc" style="margin-top:4px">
          <span style="color:${color};font-weight:700">${TIPO_LABELS_BOM[tipo]}</span> · ${b.denominacion} · ${b.ubi_desc}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${eqTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Init ───────────────────────────────────────────── */
renderBombasGrid();
renderBombasTable();
renderBomPlanesSelector();
