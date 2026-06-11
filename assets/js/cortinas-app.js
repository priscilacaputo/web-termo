/* ─── Stats ──────────────────────────────────────────── */
(function renderCortinasStats() {
  const total  = CORTINAS_DATA.length;
  const gateras = CORTINAS_DATA.filter(c => cortinaGrupo(c.ubi_desc) === "gatera").length;
  const checkin = CORTINAS_DATA.filter(c => cortinaGrupo(c.ubi_desc) === "checkin").length;
  const intl    = CORTINAS_DATA.filter(c => cortinaGrupo(c.ubi_desc) === "internacional").length;

  const cards = [
    { label: "Total cortinas",   value: total,   icon: "🌬️", color: "#1a56a4" },
    { label: "Gateras",          value: gateras, icon: "🚪", color: "#f59e0b" },
    { label: "Check In",         value: checkin, icon: "✈️", color: "#1a56a4" },
    { label: "Internacional",    value: intl,    icon: "🌐", color: "#0891b2" },
  ];

  document.getElementById("cor-stats").innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".cor-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cor-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planesVisible = view === "planes";
    document.getElementById("cor-grid-view")  .classList.toggle("hidden", view !== "grid");
    document.getElementById("cor-table-view") .classList.toggle("hidden", view !== "table");
    document.getElementById("cor-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("corGrupoFilter").closest(".filter-group").classList.toggle("hidden", planesVisible);
  });
});

/* ─── Grupo filter ───────────────────────────────────── */
const corGrupoFilter = document.getElementById("corGrupoFilter");
corGrupoFilter.addEventListener("change", () => {
  renderCortinasGrid();
  renderCortinasTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredCor() {
  const grupo = corGrupoFilter.value;
  return grupo ? CORTINAS_DATA.filter(c => cortinaGrupo(c.ubi_desc) === grupo) : CORTINAS_DATA;
}

/* ─── Grid ───────────────────────────────────────────── */
function renderCortinasGrid() {
  const filtered    = getFilteredCor();
  const filteredSet = new Set(filtered.map(c => c.equipo));

  document.getElementById("cor-grid").innerHTML = CORTINAS_DATA.map(c => {
    const grupo  = cortinaGrupo(c.ubi_desc);
    const color  = GRUPO_COLORS_COR[grupo];
    const dimmed = filtered.length === CORTINAS_DATA.length || filteredSet.has(c.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${c.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${c.equipo}</span>
          <span class="asc-fab-label">${GRUPO_LABELS_COR[grupo]}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${c.denominacion}</div>
          <div class="asc-location">${c.ubi_desc}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("#cor-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openCorModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderCortinasTable() {
  const filtered = getFilteredCor();
  const tbody    = document.getElementById("corBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const grupo = cortinaGrupo(c.ubi_desc);
    const color = GRUPO_COLORS_COR[grupo];
    return `
      <tr data-equipo="${c.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${c.equipo}</span></td>
        <td>${c.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${GRUPO_LABELS_COR[grupo]}</span></td>
        <td style="font-size:11px;color:var(--color-muted)">${c.ubi_desc}</td>
        <td><code class="tipo-code" style="font-size:10px">${c.ubicacion}</code></td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openCorModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const corModal      = document.getElementById("corModalOverlay");
const corModalClose = document.getElementById("corModalClose");
const corModalHdr   = document.getElementById("corModalHeader");
const corModalBody  = document.getElementById("corModalBody");

function openCorModal(equipo) {
  const c     = CORTINAS_DATA.find(x => x.equipo === equipo);
  if (!c) return;
  const grupo = cortinaGrupo(c.ubi_desc);
  const color = GRUPO_COLORS_COR[grupo];

  corModalHdr.style.background = color;
  corModalHdr.innerHTML = `
    <span class="modal-equipo">${c.equipo}</span>
    <div class="modal-denom">${GRUPO_LABELS_COR[grupo]}</div>
    <div class="modal-dominio">${c.denominacion}</div>
  `;

  corModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${c.ubi_desc}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación completa</span>
      <span class="modal-field-value">${c.denominacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${c.ubicacion}</span>
    </div>
  `;

  corModal.classList.add("open");
}

corModalClose.addEventListener("click", () => corModal.classList.remove("open"));
corModal.addEventListener("click", ev => { if (ev.target === corModal) corModal.classList.remove("open"); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") corModal.classList.remove("open"); });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedCorPlan = null;

function renderCorPlanesSelector() {
  const container = document.getElementById("corPlanesSelector");
  container.innerHTML = CORTINAS_DATA.map(c => {
    const planId  = CORTINA_A_PLAN[c.equipo];
    const grupo   = cortinaGrupo(c.ubi_desc);
    const color   = GRUPO_COLORS_COR[grupo];
    const hasPlan = !!planId;
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedCorPlan === c.equipo ? 'selected' : ''}" data-equipo="${c.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${c.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${c.denominacion.substring(0, 26)}</div>
        <div class="manga-sel-fab" style="color:${color};font-size:10px">${c.ubi_desc}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedCorPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      renderCorPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderCorPlan(equipo) {
  const c       = CORTINAS_DATA.find(x => x.equipo === equipo);
  const planId  = CORTINA_A_PLAN[equipo];
  const container = document.getElementById("corPlanContent");
  const grupo   = cortinaGrupo(c.ubi_desc);
  const color   = GRUPO_COLORS_COR[grupo];

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${c.denominacion}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan = CORTINAS_PLANES.find(p => p.id === planId);
  const eqTags = plan.equipos.map(eq => {
    const cr  = CORTINAS_DATA.find(x => x.equipo === eq);
    const g   = cr ? cortinaGrupo(cr.ubi_desc) : "checkin";
    const c2  = GRUPO_COLORS_COR[g];
    return `<span class="manga-equipo-tag" style="background:${c2}" title="${cr ? cr.ubi_desc : ''}">${eq}</span>`;
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
          <span style="color:${color};font-weight:700">${GRUPO_LABELS_COR[grupo]}</span> · ${c.denominacion} · ${c.ubi_desc}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${eqTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Init ───────────────────────────────────────────── */
renderCortinasGrid();
renderCortinasTable();
renderCorPlanesSelector();
