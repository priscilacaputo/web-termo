/* ─── Stats ──────────────────────────────────────────── */
(function renderEscalerasStats() {
  const total    = ESCALERAS_DATA.length;
  const thyssen  = ESCALERAS_DATA.filter(e => e.fabricante === "THYSSEN").length;
  const fujitec  = ESCALERAS_DATA.filter(e => e.fabricante === "FUJITEC").length;
  const sectores = [...new Set(ESCALERAS_DATA.map(e => e.ubi_desc))].length;

  const cards = [
    { label: "Total escaleras", value: total,    icon: "🪜", color: "#7c3aed" },
    { label: "THYSSEN",         value: thyssen,  icon: "⭐", color: "#1a56a4" },
    { label: "FUJITEC",         value: fujitec,  icon: "⭐", color: "#7c3aed" },
    { label: "Sectores",        value: sectores, icon: "📍", color: "#10b981" },
  ];

  document.getElementById("esc-stats").innerHTML = cards.map(c => `
    <div class="stat-card stat-card-clickable" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".esc-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".esc-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planoVisible  = view === "plano";
    const planesVisible = view === "planes";
    document.getElementById("esc-grid-view") .classList.toggle("hidden", view !== "grid");
    document.getElementById("esc-table-view").classList.toggle("hidden", view !== "table");
    document.getElementById("esc-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("esc-plano-view").classList.toggle("hidden", !planoVisible);
    document.getElementById("escFabFilter").closest(".filter-group").classList.toggle("hidden", planoVisible || planesVisible);
    if (planoVisible && !window._escPlanoInit) {
      window._escPlanoInit = true;
      initEscPlanoViewer();
    }
  });
});

/* ─── Fabricante filter ──────────────────────────────── */
const escFabFilter = document.getElementById("escFabFilter");
[...new Set(ESCALERAS_DATA.map(e => e.fabricante))].sort().forEach(f => {
  const o = document.createElement("option");
  o.value = f; o.textContent = f;
  escFabFilter.appendChild(o);
});
escFabFilter.addEventListener("change", () => {
  renderEscalerasGrid();
  renderEscalerasTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredEsc() {
  const fab = escFabFilter.value;
  return fab ? ESCALERAS_DATA.filter(e => e.fabricante === fab) : ESCALERAS_DATA;
}

function dirTag(denominacion) {
  const dir = escDir(denominacion);
  if (dir === "subida") return `<span class="esc-dir-tag subida">↑ Subida</span>`;
  if (dir === "bajada") return `<span class="esc-dir-tag bajada">↓ Bajada</span>`;
  return "";
}

/* ─── Grid ───────────────────────────────────────────── */
function renderEscalerasGrid() {
  const filtered     = getFilteredEsc();
  const filteredSet  = new Set(filtered.map(e => e.equipo));

  document.getElementById("esc-grid").innerHTML = ESCALERAS_DATA.map(e => {
    const color  = FAB_COLORS_ESCALERAS[e.fabricante] || "#888";
    const dimmed = filtered.length === ESCALERAS_DATA.length || filteredSet.has(e.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${e.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${e.equipo}</span>
          <span class="asc-fab-label">${e.fabricante}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${e.denominacion}</div>
          <div class="asc-location">${e.ubi_desc}</div>
          ${dirTag(e.denominacion)}
          ${e.tipo ? `<span class="asc-tipo-tag">${e.tipo}</span>` : ''}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("#esc-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openEscModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderEscalerasTable() {
  const filtered = getFilteredEsc();
  const tbody    = document.getElementById("escBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(e => {
    const color = FAB_COLORS_ESCALERAS[e.fabricante] || "#888";
    const dir   = escDir(e.denominacion);
    const dirCell = dir === "subida"
      ? `<span class="esc-dir-tag subida">↑ Subida</span>`
      : dir === "bajada"
      ? `<span class="esc-dir-tag bajada">↓ Bajada</span>`
      : `<span class="no-data">—</span>`;
    return `
      <tr data-equipo="${e.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${e.equipo}</span></td>
        <td>${e.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${e.fabricante}</span></td>
        <td>${dirCell}</td>
        <td>${e.tipo ? `<code class="tipo-code">${e.tipo}</code>` : '<span class="no-data">—</span>'}</td>
        <td style="font-size:11px;color:var(--color-muted)">${e.ubi_desc}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openEscModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const escModal      = document.getElementById("escModalOverlay");
const escModalClose = document.getElementById("escModalClose");
const escModalHdr   = document.getElementById("escModalHeader");
const escModalBody  = document.getElementById("escModalBody");

function openEscModal(equipo) {
  const e = ESCALERAS_DATA.find(x => x.equipo === equipo);
  if (!e) return;
  const color = FAB_COLORS_ESCALERAS[e.fabricante] || "#888";
  const dir   = escDir(e.denominacion);

  escModalHdr.style.background = color;
  escModalHdr.innerHTML = `
    <span class="modal-equipo">${e.equipo}</span>
    <div class="modal-denom">${e.fabricante}</div>
    <div class="modal-dominio">${e.denominacion}</div>
  `;

  escModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Fabricante</span>
      <span class="modal-field-value">${e.fabricante}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${e.ubi_desc}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Dirección</span>
      <span class="modal-field-value">
        ${dir === "subida" ? "↑ Subida" : dir === "bajada" ? "↓ Bajada" : "—"}
      </span>
    </div>
    ${e.tipo ? `
    <div class="modal-field full">
      <span class="modal-field-label">Tipo / Modelo</span>
      <span class="modal-field-value mono">${e.tipo}</span>
    </div>` : ''}
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${e.ubicacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación completa</span>
      <span class="modal-field-value">${e.denominacion}</span>
    </div>
  `;

  escModal.classList.add("open");
}

escModalClose.addEventListener("click", () => escModal.classList.remove("open"));
escModal.addEventListener("click", ev => { if (ev.target === escModal) escModal.classList.remove("open"); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") escModal.classList.remove("open"); });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedEscPlan = null;

function renderEscPlanesSelector() {
  const container = document.getElementById("escPlanesSelector");
  container.innerHTML = ESCALERAS_DATA.map(e => {
    const planId  = ESCALERA_A_PLAN[e.equipo];
    const color   = FAB_COLORS_ESCALERAS[e.fabricante] || "#888";
    const hasPlan = !!planId;
    const dir     = escDir(e.denominacion);
    const dirBadge = dir === "subida" ? `<span class="esc-dir-tag subida" style="font-size:10px;padding:1px 6px">↑</span>`
                   : dir === "bajada" ? `<span class="esc-dir-tag bajada" style="font-size:10px;padding:1px 6px">↓</span>`
                   : "";
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedEscPlan === e.equipo ? 'selected' : ''}" data-equipo="${e.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${e.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${e.denominacion.substring(0, 28)}</div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:2px">
          <span class="manga-sel-fab" style="color:${color}">${e.fabricante}</span>
          ${dirBadge}
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedEscPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderEscPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderEscPlan(equipo) {
  const e       = ESCALERAS_DATA.find(x => x.equipo === equipo);
  const planId  = ESCALERA_A_PLAN[equipo];
  const container = document.getElementById("escPlanContent");
  const color   = FAB_COLORS_ESCALERAS[e.fabricante] || "#888";

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${e.denominacion}</strong> — fabricante <strong style="color:${color}">${e.fabricante}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan = ESCALERAS_PLANES.find(p => p.id === planId);
  const escTags = plan.escaleras.map(eq => {
    const esc = ESCALERAS_DATA.find(x => x.equipo === eq);
    const c   = FAB_COLORS_ESCALERAS[esc ? esc.fabricante : ''] || '#888';
    return `<span class="manga-equipo-tag" style="background:${c}" title="${esc ? esc.denominacion : ''}">${eq}</span>`;
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
          <span class="manga-freq-count">${frec.grupos.length} grupos · ${totalTareas} tareas</span>
        </div>
        <div class="manga-grupo-grid">${grupos}</div>
      </div>`;
  }).join("");

  container.innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title">${plan.denominacion}</h2>
        <p class="mant-section-desc" style="margin-top:4px">
          <span style="color:${color};font-weight:700">${e.fabricante}</span> · ${e.denominacion}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${escTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Visor de plano con zoom y pan ─────────────────── */
function initEscPlanoViewer() {
  const wrap  = document.getElementById("escPlanoWrap");
  const img   = document.getElementById("escPlanoImg");
  const label = document.getElementById("escPlanoZoomLabel");
  let scale = 1;
  let isDragging = false, startX, startY, scrollLeft, scrollTop;

  function setScale(s) {
    scale = Math.min(4, Math.max(0.15, s));
    img.style.width = (scale * 100) + "%";
    label.textContent = Math.round(scale * 100) + "%";
  }

  function fitToWrap() {
    const wrapW  = wrap.clientWidth - 32;
    const imgNatW = img.naturalWidth || 5960;
    setScale(wrapW / imgNatW);
    wrap.scrollLeft = 0;
    wrap.scrollTop  = 0;
  }

  img.addEventListener("load", fitToWrap);
  if (img.complete) fitToWrap();

  document.getElementById("escPlanoZoomIn") .addEventListener("click", () => setScale(scale * 1.3));
  document.getElementById("escPlanoZoomOut").addEventListener("click", () => setScale(scale / 1.3));
  document.getElementById("escPlanoZoomFit").addEventListener("click", fitToWrap);

  wrap.addEventListener("wheel", e => {
    e.preventDefault();
    setScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  }, { passive: false });

  wrap.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - wrap.offsetLeft;
    startY = e.pageY - wrap.offsetTop;
    scrollLeft = wrap.scrollLeft;
    scrollTop  = wrap.scrollTop;
    wrap.style.cursor = "grabbing";
  });
  document.addEventListener("mouseup", () => { isDragging = false; wrap.style.cursor = "grab"; });
  wrap.addEventListener("mousemove", e => {
    if (!isDragging) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX);
    wrap.scrollTop  = scrollTop  - (e.pageY - wrap.offsetTop  - startY);
  });
}

/* ─── Init ───────────────────────────────────────────── */
renderEscalerasGrid();
renderEscalerasTable();
renderEscPlanesSelector();
