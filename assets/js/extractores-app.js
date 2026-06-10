/* ─── Stats ──────────────────────────────────────────── */
(function renderExtractoresStats() {
  const total        = EXTRACTORES_DATA.length;
  const extractores  = EXTRACTORES_DATA.filter(e => extTipo(e.denominacion) === "extractor").length;
  const ventiladores = EXTRACTORES_DATA.filter(e => extTipo(e.denominacion) === "ventilador").length;
  const sectores     = [...new Set(EXTRACTORES_DATA.map(e => e.ubi_desc))].length;

  const cards = [
    { label: "Total equipos",  value: total,        icon: "💨", color: "#1a56a4" },
    { label: "Extractores",    value: extractores,  icon: "🔩", color: "#1a56a4" },
    { label: "Ventiladores",   value: ventiladores, icon: "🌀", color: "#0891b2" },
    { label: "Sectores",       value: sectores,     icon: "📍", color: "#10b981" },
  ];

  document.getElementById("ext-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".ext-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ext-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planesVisible = view === "planes";
    document.getElementById("ext-grid-view")  .classList.toggle("hidden", view !== "grid");
    document.getElementById("ext-table-view") .classList.toggle("hidden", view !== "table");
    document.getElementById("ext-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("extTipoFilter").closest(".filter-group").classList.toggle("hidden", planesVisible);
  });
});

/* ─── Tipo filter ────────────────────────────────────── */
const extTipoFilter = document.getElementById("extTipoFilter");
extTipoFilter.addEventListener("change", () => {
  renderExtractoresGrid();
  renderExtractoresTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredExt() {
  const tipo = extTipoFilter.value;
  return tipo ? EXTRACTORES_DATA.filter(e => extTipo(e.denominacion) === tipo) : EXTRACTORES_DATA;
}

function tipoTag(denominacion) {
  const tipo  = extTipo(denominacion);
  const color = TIPO_COLORS_EXT[tipo];
  const label = TIPO_LABELS_EXT[tipo];
  const icon  = tipo === "ventilador" ? "🌀" : tipo === "presurizador" ? "⬆" : "💨";
  return `<span class="ext-tipo-tag" style="background:${color}15;color:${color};border:1px solid ${color}40">${icon} ${label}</span>`;
}

/* ─── Grid ───────────────────────────────────────────── */
function renderExtractoresGrid() {
  const filtered    = getFilteredExt();
  const filteredSet = new Set(filtered.map(e => e.equipo));

  document.getElementById("ext-grid").innerHTML = EXTRACTORES_DATA.map(e => {
    const tipo   = extTipo(e.denominacion);
    const color  = TIPO_COLORS_EXT[tipo];
    const dimmed = filtered.length === EXTRACTORES_DATA.length || filteredSet.has(e.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${e.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${e.equipo}</span>
          <span class="asc-fab-label">${TIPO_LABELS_EXT[tipo]}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${e.denominacion}</div>
          <div class="asc-location">${e.ubi_desc}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("#ext-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openExtModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderExtractoresTable() {
  const filtered = getFilteredExt();
  const tbody    = document.getElementById("extBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(e => {
    const tipo  = extTipo(e.denominacion);
    const color = TIPO_COLORS_EXT[tipo];
    return `
      <tr data-equipo="${e.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${e.equipo}</span></td>
        <td>${e.denominacion}</td>
        <td>${tipoTag(e.denominacion)}</td>
        <td style="font-size:11px;color:var(--color-muted)">${e.ubi_desc}</td>
        <td><code class="tipo-code" style="font-size:10px">${e.ubicacion}</code></td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openExtModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const extModal      = document.getElementById("extModalOverlay");
const extModalClose = document.getElementById("extModalClose");
const extModalHdr   = document.getElementById("extModalHeader");
const extModalBody  = document.getElementById("extModalBody");

function openExtModal(equipo) {
  const e    = EXTRACTORES_DATA.find(x => x.equipo === equipo);
  if (!e) return;
  const tipo  = extTipo(e.denominacion);
  const color = TIPO_COLORS_EXT[tipo];

  extModalHdr.style.background = color;
  extModalHdr.innerHTML = `
    <span class="modal-equipo">${e.equipo}</span>
    <div class="modal-denom">${TIPO_LABELS_EXT[tipo]}</div>
    <div class="modal-dominio">${e.denominacion}</div>
  `;

  extModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Tipo</span>
      <span class="modal-field-value">${TIPO_LABELS_EXT[tipo]}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${e.ubi_desc}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación completa</span>
      <span class="modal-field-value">${e.denominacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${e.ubicacion}</span>
    </div>
  `;

  extModal.classList.add("open");
}

extModalClose.addEventListener("click", () => extModal.classList.remove("open"));
extModal.addEventListener("click", ev => { if (ev.target === extModal) extModal.classList.remove("open"); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") extModal.classList.remove("open"); });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedExtPlan = null;

function renderExtPlanesSelector() {
  const container = document.getElementById("extPlanesSelector");
  container.innerHTML = EXTRACTORES_DATA.map(e => {
    const planId  = EXTRACTOR_A_PLAN[e.equipo];
    const tipo    = extTipo(e.denominacion);
    const color   = TIPO_COLORS_EXT[tipo];
    const hasPlan = !!planId;
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedExtPlan === e.equipo ? 'selected' : ''}" data-equipo="${e.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${e.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${e.denominacion.substring(0, 28)}</div>
        <div class="manga-sel-fab" style="color:${color}">${TIPO_LABELS_EXT[tipo]}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedExtPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderExtPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderExtPlan(equipo) {
  const e       = EXTRACTORES_DATA.find(x => x.equipo === equipo);
  const planId  = EXTRACTOR_A_PLAN[equipo];
  const container = document.getElementById("extPlanContent");
  const tipo    = extTipo(e.denominacion);
  const color   = TIPO_COLORS_EXT[tipo];

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${e.denominacion}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan = EXTRACTORES_PLANES.find(p => p.id === planId);
  const eqTags = plan.equipos.map(eq => {
    const ex   = EXTRACTORES_DATA.find(x => x.equipo === eq);
    const t    = ex ? extTipo(ex.denominacion) : "extractor";
    const c    = TIPO_COLORS_EXT[t];
    return `<span class="manga-equipo-tag" style="background:${c}" title="${ex ? ex.denominacion : ''}">${eq}</span>`;
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
          <span style="color:${color};font-weight:700">${TIPO_LABELS_EXT[tipo]}</span> · ${e.denominacion}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${eqTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Init ───────────────────────────────────────────── */
renderExtractoresGrid();
renderExtractoresTable();
renderExtPlanesSelector();
