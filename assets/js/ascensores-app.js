/* ─── Stats ──────────────────────────────────────────── */
(function renderAscensoresStats() {
  const total      = ASCENSORES_DATA.length;
  const fabricantes = [...new Set(ASCENSORES_DATA.map(a => a.fabricante))].length;
  const fujitec    = ASCENSORES_DATA.filter(a => a.fabricante === "FUJITEC" || a.fabricante === "FUJITEC-WITUR").length;
  const thyssen    = ASCENSORES_DATA.filter(a => a.fabricante === "THYSSEN").length;

  const cards = [
    { label: "Total ascensores", value: total,      icon: "🛗", color: "#7c3aed" },
    { label: "Fabricantes",      value: fabricantes, icon: "🏭", color: "#1a56a4" },
    { label: "FUJITEC",          value: fujitec,     icon: "⭐", color: "#7c3aed" },
    { label: "THYSSEN",          value: thyssen,     icon: "⭐", color: "#1a56a4" }
  ];

  document.getElementById("asc-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".asc-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".asc-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.getElementById("asc-grid-view").classList.toggle("hidden", view !== "grid");
    document.getElementById("asc-table-view").classList.toggle("hidden", view !== "table");
    const planoVisible  = view === "plano";
    const planesVisible = view === "planes";
    document.getElementById("asc-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("asc-plano-view").classList.toggle("hidden", !planoVisible);
    document.getElementById("ascFabFilter").closest(".filter-group").classList.toggle("hidden", planoVisible || planesVisible);
    if (planoVisible && !window._planoZoomInit) {
      window._planoZoomInit = true;
      initPlanoViewer();
    }
  });
});

/* ─── Fabricante filter ──────────────────────────────── */
const ascFabFilter = document.getElementById("ascFabFilter");
[...new Set(ASCENSORES_DATA.map(a => a.fabricante))].sort().forEach(f => {
  const o = document.createElement("option");
  o.value = f; o.textContent = f;
  ascFabFilter.appendChild(o);
});

ascFabFilter.addEventListener("change", () => {
  renderAscensoresGrid();
  renderAscensoresTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredAsc() {
  const fab = ascFabFilter.value;
  return fab ? ASCENSORES_DATA.filter(a => a.fabricante === fab) : ASCENSORES_DATA;
}

/* ─── Grid ───────────────────────────────────────────── */
function renderAscensoresGrid() {
  const filtered = getFilteredAsc();
  const filteredEquipos = new Set(filtered.map(a => a.equipo));

  document.getElementById("asc-grid").innerHTML = ASCENSORES_DATA.map(a => {
    const color  = FAB_COLORS_ASCENSORES[a.fabricante] || "#888";
    const dimmed = filtered.length === ASCENSORES_DATA.length || filteredEquipos.has(a.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${a.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${a.equipo}</span>
          <span class="asc-fab-label">${a.fabricante}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${a.denominacion}</div>
          <div class="asc-location">${a.ubi_desc}</div>
          ${a.tipo ? `<span class="asc-tipo-tag">${a.tipo}</span>` : ''}
          ${a.dimension ? `<span class="gate-dim">${a.dimension}</span>` : ''}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".asc-card").forEach(card => {
    card.addEventListener("click", () => openAscModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderAscensoresTable() {
  const filtered = getFilteredAsc();
  const tbody = document.getElementById("ascBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const color = FAB_COLORS_ASCENSORES[a.fabricante] || "#888";
    return `
      <tr data-equipo="${a.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${a.equipo}</span></td>
        <td>${a.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${a.fabricante}</span></td>
        <td>${a.tipo ? `<code class="tipo-code">${a.tipo}</code>` : '<span class="no-data">—</span>'}</td>
        <td>${a.dimension ? `<span class="dim-tag">${a.dimension}</span>` : '<span class="no-data">—</span>'}</td>
        <td style="font-size:11px;color:var(--color-muted)">${a.ubi_desc}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openAscModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const ascModal      = document.getElementById("ascModalOverlay");
const ascModalClose = document.getElementById("ascModalClose");
const ascModalHdr   = document.getElementById("ascModalHeader");
const ascModalBody  = document.getElementById("ascModalBody");

function openAscModal(equipo) {
  const a = ASCENSORES_DATA.find(x => x.equipo === equipo);
  if (!a) return;
  const color = FAB_COLORS_ASCENSORES[a.fabricante] || "#888";

  ascModalHdr.style.background = color;
  ascModalHdr.innerHTML = `
    <span class="modal-equipo">${a.equipo}</span>
    <div class="modal-denom">${a.fabricante}</div>
    <div class="modal-dominio">${a.denominacion}</div>
  `;

  ascModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Fabricante</span>
      <span class="modal-field-value">${a.fabricante}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${a.ubi_desc}</span>
    </div>
    ${a.tipo ? `
    <div class="modal-field full">
      <span class="modal-field-label">Tipo / Modelo</span>
      <span class="modal-field-value mono">${a.tipo}</span>
    </div>` : ''}
    ${a.dimension ? `
    <div class="modal-field full">
      <span class="modal-field-label">Dimensión</span>
      <span class="modal-field-value mono">${a.dimension}</span>
    </div>` : ''}
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${a.ubicacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación completa</span>
      <span class="modal-field-value">${a.denominacion}</span>
    </div>
  `;

  ascModal.classList.add("open");
}

ascModalClose.addEventListener("click", () => ascModal.classList.remove("open"));
ascModal.addEventListener("click", e => { if (e.target === ascModal) ascModal.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { ascModal.classList.remove("open"); } });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedAscPlan = null;

function renderAscPlanesSelector() {
  const container = document.getElementById("ascPlanesSelector");
  container.innerHTML = ASCENSORES_DATA.map(a => {
    const planId = ASCENSOR_A_PLAN[a.equipo];
    const color  = FAB_COLORS_ASCENSORES[a.fabricante] || "#888";
    const hasPlan = !!planId;
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedAscPlan === a.equipo ? 'selected' : ''}" data-equipo="${a.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${a.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${a.denominacion.replace("Ascensor Electromec","Asc.").substring(0,28)}</div>
        <div class="manga-sel-fab" style="color:${color}">${a.fabricante}</div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedAscPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderAscPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderAscPlan(equipo) {
  const a = ASCENSORES_DATA.find(x => x.equipo === equipo);
  const planId = ASCENSOR_A_PLAN[equipo];
  const container = document.getElementById("ascPlanContent");
  const color = FAB_COLORS_ASCENSORES[a.fabricante] || "#888";

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${a.denominacion}</strong> — fabricante <strong style="color:${color}">${a.fabricante}</strong> no tiene un plan MOEX cargado. Consultá la documentación técnica del fabricante.</p>
        </div>
      </div>`;
    return;
  }

  const plan = ASCENSORES_PLANES.find(p => p.id === planId);
  const ascTags = plan.ascensores.map(eq => {
    const asc = ASCENSORES_DATA.find(x => x.equipo === eq);
    const c = FAB_COLORS_ASCENSORES[asc ? asc.fabricante : ''] || '#888';
    return `<span class="manga-equipo-tag" style="background:${c}" title="${asc ? asc.denominacion : ''}">${eq}</span>`;
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
          <span style="color:${color};font-weight:700">${a.fabricante}</span> · ${a.denominacion}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${ascTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Visor de plano con zoom y pan ─────────────────── */
function initPlanoViewer() {
  const wrap = document.getElementById("ascPlanoWrap");
  const img  = document.getElementById("planoImg");
  const label = document.getElementById("planoZoomLabel");
  let scale = 1, minScale = 0.15;
  let isDragging = false, startX, startY, scrollLeft, scrollTop;

  function setScale(s) {
    scale = Math.min(4, Math.max(minScale, s));
    img.style.width  = (scale * 100) + "%";
    label.textContent = Math.round(scale * 100) + "%";
  }

  function fitToWrap() {
    const wrapW = wrap.clientWidth - 32;
    const imgNatW = img.naturalWidth || 5960;
    const s = wrapW / imgNatW;
    setScale(s);
    wrap.scrollLeft = 0;
    wrap.scrollTop  = 0;
  }

  // Ajustar cuando la imagen cargue
  img.addEventListener("load", fitToWrap);
  if (img.complete) fitToWrap();

  document.getElementById("planoZoomIn") .addEventListener("click", () => setScale(scale * 1.3));
  document.getElementById("planoZoomOut").addEventListener("click", () => setScale(scale / 1.3));
  document.getElementById("planoZoomFit").addEventListener("click", fitToWrap);

  // Zoom con rueda del mouse
  wrap.addEventListener("wheel", e => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    setScale(scale * delta);
  }, { passive: false });

  // Pan con arrastre
  wrap.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.pageX - wrap.offsetLeft;
    startY = e.pageY - wrap.offsetTop;
    scrollLeft = wrap.scrollLeft;
    scrollTop  = wrap.scrollTop;
    wrap.style.cursor = "grabbing";
  });
  document.addEventListener("mouseup",   () => { isDragging = false; wrap.style.cursor = "grab"; });
  wrap.addEventListener("mousemove", e => {
    if (!isDragging) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX);
    wrap.scrollTop  = scrollTop  - (e.pageY - wrap.offsetTop  - startY);
  });
}

/* ─── Init ───────────────────────────────────────────── */
renderAscensoresGrid();
renderAscensoresTable();
renderAscPlanesSelector();
