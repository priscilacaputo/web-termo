/* ─── Tab switching ─────────────────────────────────── */
document.querySelectorAll(".mant-tab[data-tab]").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".mant-tab[data-tab]").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".mant-panel").forEach(p => p.classList.add("hidden"));
    tab.classList.add("active");
    document.getElementById("tab-" + tab.dataset.tab).classList.remove("hidden");
  });
});

/* ─── Tab Calendario ────────────────────────────────── */
const calBody = document.getElementById("calBody");
calBody.innerHTML = MANT_CALENDARIO.map((tarea, i) => `
  <tr>
    <td style="color:var(--color-muted);font-size:12px;text-align:center">${i + 1}</td>
    <td>${tarea}</td>
  </tr>
`).join("");

/* ─── Tab Por KM — Model cards ──────────────────────── */
const modelCards = document.getElementById("modelCards");
modelCards.innerHTML = MANT_KM.map(plan => `
  <button class="model-card" data-plan="${plan.id}">
    <span class="model-card-fab" style="background:${FAB_COLORS[plan.modelo.split(' ')[0]] || '#888'}">${plan.modelo.split(' ')[0]}</span>
    <span class="model-card-name">${plan.modelo}</span>
    <span class="model-card-veh">${plan.vehiculos.length} vehículo${plan.vehiculos.length !== 1 ? 's' : ''}</span>
  </button>
`).join("");

modelCards.querySelectorAll(".model-card").forEach(card => {
  card.addEventListener("click", () => {
    modelCards.querySelectorAll(".model-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    renderKmPlan(card.dataset.plan);
  });
});

// Show first plan by default
if (MANT_KM.length > 0) {
  modelCards.querySelector(".model-card").classList.add("selected");
  renderKmPlan(MANT_KM[0].id);
}

function renderKmPlan(planId) {
  const plan = MANT_KM.find(p => p.id === planId);
  if (!plan) return;

  const vehTags = plan.vehiculos.map(eq => {
    const v = FLOTA_DATA.find(x => x.equipo === eq);
    return `<span class="equipo-tag" title="${v ? v.denominacion : ''}">${eq}</span>`;
  }).join(" ");

  const intervContent = plan.intervalos.map(int => `
    <div class="km-interval">
      <div class="km-interval-header">
        <span class="km-badge">${int.km.toLocaleString('es-AR')} km</span>
        <span class="km-count">${int.tareas.length} tarea${int.tareas.length !== 1 ? 's' : ''}</span>
      </div>
      <ul class="km-task-list">
        ${int.tareas.map(t => {
          const parts = t.split(': ');
          if (parts.length > 1) {
            return `<li><span class="task-cat">${parts[0]}:</span> ${parts.slice(1).join(': ')}</li>`;
          }
          return `<li>${t}</li>`;
        }).join('')}
      </ul>
    </div>
  `).join("");

  document.getElementById("kmPlanContent").innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title">${plan.modelo}</h2>
        <p class="mant-section-desc">Condición: ${plan.condicion}</p>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${vehTags}</div>
      </div>
    </div>
    <div class="km-intervals-grid">${intervContent}</div>
  `;
}

/* ─── Tab Por Vehículo ──────────────────────────────── */
let selectedVehiculo = null;

function renderVehiculos(query = "") {
  const q = query.toLowerCase();
  const filtered = FLOTA_DATA.filter(v =>
    [v.equipo, v.dominio, v.denominacion].join(" ").toLowerCase().includes(q)
  );

  const grid = document.getElementById("vehiculoGrid");
  grid.innerHTML = filtered.map(v => {
    const planId = EQUIPO_A_PLAN[v.equipo];
    const hasPlan = !!planId;
    const color = FAB_COLORS[v.fabricante] || "#888";
    return `
      <div class="veh-card ${hasPlan ? '' : 'no-plan'} ${selectedVehiculo === v.equipo ? 'selected' : ''}" data-equipo="${v.equipo}">
        <div class="veh-card-top" style="border-top-color:${color}">
          <span class="equipo-tag">${v.equipo}</span>
          ${hasPlan ? '<span class="has-plan-dot" title="Tiene plan KM">✓</span>' : '<span class="no-plan-dot" title="Sin plan KM específico">—</span>'}
        </div>
        <div class="veh-card-dominio">${v.dominio}</div>
        <div class="veh-card-denom">${v.denominacion}</div>
        <div class="veh-card-fab" style="color:${color}">${v.fabricante} · ${v.anio}</div>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".veh-card[data-equipo]").forEach(card => {
    card.addEventListener("click", () => {
      selectedVehiculo = card.dataset.equipo;
      renderVehiculoPlan(card.dataset.equipo);
      grid.querySelectorAll(".veh-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
}

function renderVehiculoPlan(equipo) {
  const v = FLOTA_DATA.find(x => x.equipo === equipo);
  const planId = EQUIPO_A_PLAN[equipo];
  const container = document.getElementById("vehiculoPlanContent");

  if (!planId) {
    const color = FAB_COLORS[v.fabricante] || "#888";
    container.innerHTML = `
      <div class="mant-section-header" style="margin-top:20px">
        <div>
          <h2 class="mant-section-title" style="display:flex;align-items:center;gap:10px">
            <span class="equipo-tag">${equipo}</span> ${v.denominacion}
          </h2>
          <p class="mant-section-desc" style="margin-top:4px">
            <span style="color:${color};font-weight:700">${v.fabricante}</span> · ${v.tipo} · ${v.anio}
          </p>
        </div>
      </div>
      <div class="mant-service-fab">
        <div class="mant-service-icon">🔧</div>
        <div class="mant-service-body">
          <p class="mant-service-title">Realizar el service correspondiente a los kilómetros actuales del vehículo</p>
          <p class="mant-service-desc">Este vehículo no tiene un plan MOEX definido en el sistema. Consultá el manual del fabricante (<strong>${v.fabricante}</strong>) para determinar las tareas según el kilometraje actual, y seguí las especificaciones del modelo <strong>${v.tipo}</strong>.</p>
        </div>
      </div>
    `;
    return;
  }

  const plan = MANT_KM.find(p => p.id === planId);
  const color = FAB_COLORS[v.fabricante] || "#888";

  const intervContent = plan.intervalos.map(int => `
    <div class="km-interval">
      <div class="km-interval-header">
        <span class="km-badge">${int.km.toLocaleString('es-AR')} km</span>
        <span class="km-count">${int.tareas.length} tarea${int.tareas.length !== 1 ? 's' : ''}</span>
      </div>
      <ul class="km-task-list">
        ${int.tareas.map(t => {
          const parts = t.split(': ');
          if (parts.length > 1) {
            return `<li><span class="task-cat">${parts[0]}:</span> ${parts.slice(1).join(': ')}</li>`;
          }
          return `<li>${t}</li>`;
        }).join('')}
      </ul>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="mant-section-header" style="margin-top:20px">
      <div>
        <h2 class="mant-section-title" style="display:flex;align-items:center;gap:10px">
          <span class="equipo-tag">${equipo}</span> ${v.denominacion}
        </h2>
        <p class="mant-section-desc" style="margin-top:4px">
          <span style="color:${color};font-weight:700">${v.fabricante}</span> · ${plan.modelo} · ${v.anio}
        </p>
        <p class="mant-section-desc">Condición: ${plan.condicion}</p>
      </div>
    </div>
    <div class="km-intervals-grid">${intervContent}</div>
  `;
}

document.getElementById("vehiculoSearch").addEventListener("input", e => {
  renderVehiculos(e.target.value);
});

renderVehiculos();
