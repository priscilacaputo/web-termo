/* ─── Stats ──────────────────────────────────────────── */
(function renderPersianaStats() {
  const total   = PERSIANAS_DATA.length;
  const checkin = PERSIANAS_DATA.filter(p => persSector(p.ubi_desc) === "checkin").length;
  const nac     = PERSIANAS_DATA.filter(p => persSector(p.ubi_desc) === "nacional").length;
  const intl    = PERSIANAS_DATA.filter(p => persSector(p.ubi_desc) === "internacional").length;

  const cards = [
    { label: "Total persianas",  value: total,   icon: "🪟", color: "#1a56a4" },
    { label: "Check In Ed. VI",  value: checkin, icon: "✈️", color: "#1a56a4" },
    { label: "Arribos Nac.",     value: nac,     icon: "🏠", color: "#7c3aed" },
    { label: "Arribos Int.",     value: intl,    icon: "🌐", color: "#0891b2" },
  ];

  document.getElementById("pers-stats").innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join("");
})();

/* ─── Vista selector ─────────────────────────────────── */
document.querySelectorAll(".pers-view-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pers-view-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    const planesVisible = view === "planes";
    document.getElementById("pers-grid-view")  .classList.toggle("hidden", view !== "grid");
    document.getElementById("pers-table-view") .classList.toggle("hidden", view !== "table");
    document.getElementById("pers-planes-view").classList.toggle("hidden", !planesVisible);
    document.getElementById("persSectorFilter").closest(".filter-group").classList.toggle("hidden", planesVisible);
  });
});

/* ─── Sector filter ──────────────────────────────────── */
const persSectorFilter = document.getElementById("persSectorFilter");
persSectorFilter.addEventListener("change", () => {
  renderPersianaGrid();
  renderPersianaTable();
});

/* ─── Helpers ────────────────────────────────────────── */
function getFilteredPers() {
  const sector = persSectorFilter.value;
  return sector ? PERSIANAS_DATA.filter(p => persSector(p.ubi_desc) === sector) : PERSIANAS_DATA;
}

function posTag(denominacion) {
  const pos = persPos(denominacion);
  if (pos === "norte") return `<span class="pers-pos-tag norte">↑ Norte</span>`;
  if (pos === "sur")   return `<span class="pers-pos-tag sur">↓ Sur</span>`;
  return "";
}

/* ─── Grid ───────────────────────────────────────────── */
function renderPersianaGrid() {
  const filtered    = getFilteredPers();
  const filteredSet = new Set(filtered.map(p => p.equipo));

  document.getElementById("pers-grid").innerHTML = PERSIANAS_DATA.map(p => {
    const sector = persSector(p.ubi_desc);
    const color  = SECTOR_COLORS_PERS[sector];
    const dimmed = filtered.length === PERSIANAS_DATA.length || filteredSet.has(p.equipo);
    return `
      <div class="asc-card ${dimmed ? '' : 'dimmed'}" data-equipo="${p.equipo}">
        <div class="asc-card-header" style="background:${color}">
          <span class="asc-equipo-code">${p.equipo}</span>
          <span class="asc-fab-label">${SECTOR_LABELS_PERS[sector]}</span>
        </div>
        <div class="asc-card-body">
          <div class="asc-denom">${p.denominacion}</div>
          <div class="asc-location">${p.ubi_desc}</div>
          ${posTag(p.denominacion)}
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("#pers-grid .asc-card").forEach(card => {
    card.addEventListener("click", () => openPersModal(card.dataset.equipo));
  });
}

/* ─── Table ──────────────────────────────────────────── */
function renderPersianaTable() {
  const filtered = getFilteredPers();
  const tbody    = document.getElementById("persBody");

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">🔍</div><p>Sin resultados.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const sector = persSector(p.ubi_desc);
    const color  = SECTOR_COLORS_PERS[sector];
    const pos    = persPos(p.denominacion);
    const posCell = pos === "norte"
      ? `<span class="pers-pos-tag norte">↑ Norte</span>`
      : pos === "sur"
      ? `<span class="pers-pos-tag sur">↓ Sur</span>`
      : `<span class="no-data">—</span>`;
    return `
      <tr data-equipo="${p.equipo}" style="cursor:pointer">
        <td><span class="manga-equipo-tag" style="background:${color}">${p.equipo}</span></td>
        <td>${p.denominacion}</td>
        <td><span class="fab-badge"><span class="fab-dot" style="background:${color}"></span>${SECTOR_LABELS_PERS[sector]}</span></td>
        <td>${posCell}</td>
        <td style="font-size:11px;color:var(--color-muted)">${p.ubi_desc}</td>
      </tr>
    `;
  }).join("");

  tbody.querySelectorAll("tr[data-equipo]").forEach(row => {
    row.addEventListener("click", () => openPersModal(row.dataset.equipo));
  });
}

/* ─── Modal ──────────────────────────────────────────── */
const persModal      = document.getElementById("persModalOverlay");
const persModalClose = document.getElementById("persModalClose");
const persModalHdr   = document.getElementById("persModalHeader");
const persModalBody  = document.getElementById("persModalBody");

function openPersModal(equipo) {
  const p      = PERSIANAS_DATA.find(x => x.equipo === equipo);
  if (!p) return;
  const sector = persSector(p.ubi_desc);
  const color  = SECTOR_COLORS_PERS[sector];
  const pos    = persPos(p.denominacion);

  persModalHdr.style.background = color;
  persModalHdr.innerHTML = `
    <span class="modal-equipo">${p.equipo}</span>
    <div class="modal-denom">${SECTOR_LABELS_PERS[sector]}</div>
    <div class="modal-dominio">${p.denominacion}</div>
  `;

  persModalBody.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Sector</span>
      <span class="modal-field-value">${p.ubi_desc}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Posición</span>
      <span class="modal-field-value">${pos === "norte" ? "↑ Norte" : pos === "sur" ? "↓ Sur" : "—"}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Denominación completa</span>
      <span class="modal-field-value">${p.denominacion}</span>
    </div>
    <div class="modal-field full">
      <span class="modal-field-label">Ubicación técnica (SAP)</span>
      <span class="modal-field-value mono">${p.ubicacion}</span>
    </div>
  `;

  persModal.classList.add("open");
}

persModalClose.addEventListener("click", () => persModal.classList.remove("open"));
persModal.addEventListener("click", ev => { if (ev.target === persModal) persModal.classList.remove("open"); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") persModal.classList.remove("open"); });

/* ─── Planes Preventivos — Selector ─────────────────── */
let selectedPersPlan = null;

function renderPersPlanesSelector() {
  const container = document.getElementById("persPlanesSelector");
  container.innerHTML = PERSIANAS_DATA.map(p => {
    const planId  = PERSIANA_A_PLAN[p.equipo];
    const sector  = persSector(p.ubi_desc);
    const color   = SECTOR_COLORS_PERS[sector];
    const hasPlan = !!planId;
    const pos     = persPos(p.denominacion);
    const posBadge = pos === "norte"
      ? `<span class="pers-pos-tag norte" style="font-size:10px;padding:1px 6px">↑N</span>`
      : pos === "sur"
      ? `<span class="pers-pos-tag sur" style="font-size:10px;padding:1px 6px">↓S</span>`
      : "";
    return `
      <div class="manga-sel-card ${hasPlan ? '' : 'no-plan'} ${selectedPersPlan === p.equipo ? 'selected' : ''}" data-equipo="${p.equipo}">
        <div class="manga-sel-top" style="border-top-color:${color}">
          <span class="manga-equipo-tag" style="background:${color}">${p.equipo}</span>
          ${hasPlan
            ? '<span class="has-plan-dot" title="Tiene plan preventivo">✓</span>'
            : '<span class="no-plan-dot" title="Sin plan preventivo">—</span>'}
        </div>
        <div class="manga-sel-pos" style="font-size:11px;line-height:1.3">${p.denominacion.substring(0, 26)}</div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:2px">
          <span class="manga-sel-fab" style="color:${color};font-size:10px">${SECTOR_LABELS_PERS[sector]}</span>
          ${posBadge}
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".manga-sel-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedPersPlan = card.dataset.equipo;
      container.querySelectorAll(".manga-sel-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      renderPersPlan(card.dataset.equipo);
    });
  });
}

/* ─── Planes Preventivos — Render plan ──────────────── */
function renderPersPlan(equipo) {
  const p       = PERSIANAS_DATA.find(x => x.equipo === equipo);
  const planId  = PERSIANA_A_PLAN[equipo];
  const container = document.getElementById("persPlanContent");
  const sector  = persSector(p.ubi_desc);
  const color   = SECTOR_COLORS_PERS[sector];

  if (!planId) {
    container.innerHTML = `
      <div class="mant-service-fab" style="margin-top:4px">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Sin plan preventivo definido en el sistema</p>
          <p class="mant-service-desc">El equipo <strong>${equipo}</strong> — <strong>${p.denominacion}</strong> no tiene un plan MOEX cargado.</p>
        </div>
      </div>`;
    return;
  }

  const plan = PERSIANAS_PLANES.find(pl => pl.id === planId);
  const eqTags = plan.equipos.map(eq => {
    const pr    = PERSIANAS_DATA.find(x => x.equipo === eq);
    const sec   = pr ? persSector(pr.ubi_desc) : "checkin";
    const c     = SECTOR_COLORS_PERS[sec];
    return `<span class="manga-equipo-tag" style="background:${c}" title="${pr ? pr.denominacion : ''}">${eq}</span>`;
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
          <span style="color:${color};font-weight:700">${SECTOR_LABELS_PERS[sector]}</span> · ${p.denominacion}
        </p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${eqTags}</div>
      </div>
    </div>
    ${freqSections}`;
}

/* ─── Init ───────────────────────────────────────────── */
renderPersianaGrid();
renderPersianaTable();
renderPersPlanesSelector();
