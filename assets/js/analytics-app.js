/* ─── Equipment Analytics — All Equipment Distribution ─── */

function parseLocation(ubicacion) {
  if (!ubicacion) return { building: 'Desconocido', floor: '0' };

  const str = ubicacion.toLowerCase();
  let building = 'Desconocido';
  let floor = '0';

  // Try to extract ED# pattern (e.g., ED5, ED4, etc.)
  const edMatch = ubicacion.match(/ED\d+/i) || ubicacion.match(/Ed\s*\d+/i);
  if (edMatch) {
    const num = edMatch[0].replace(/\D/g, '');
    building = `Edificio ${num}`;

    // Extract NIVEL# pattern
    const nivelMatch = ubicacion.match(/NIVEL(\d+)/i);
    if (nivelMatch) floor = nivelMatch[1];
  }

  // LAA (Lounge Area / Plataforma)
  if (str.includes('laa')) {
    building = 'Plataforma Comercial';
    floor = 'PB';
  }

  // TER (Técnica/Terminal)
  if (str.includes('-ter-') || str.includes('terminal')) {
    building = 'Área Terminal';
    floor = 'PB';
  }

  // ESR (Subsuelo/Underground)
  if (str.includes('-esr-') || str.includes('subsuelo')) {
    building = 'Subsuelo';
    floor = 'SUB';
  }

  // ECAs specific format (e.g., "Sala R", "Hall", etc.)
  if (str.includes('sala') || str.includes('hall') || str.includes('núcleo')) {
    building = 'Espacios Comunes';
    floor = 'PB';
  }

  return { building, floor };
}

function aggregateAllEquipment() {
  const datasets = [
    { name: 'AAC', data: typeof AAC_DATA !== 'undefined' ? AAC_DATA : [], icon: '❄️' },
    { name: 'Mangas', data: typeof MANGAS_DATA !== 'undefined' ? MANGAS_DATA : [], icon: '🛬' },
    { name: 'Ascensores', data: typeof ASCENSORES_DATA !== 'undefined' ? ASCENSORES_DATA : [], icon: '🛗' },
    { name: 'Escaleras', data: typeof ESCALERAS_DATA !== 'undefined' ? ESCALERAS_DATA : [], icon: '🪜' },
    { name: 'Extractores', data: typeof EXTRACTORES_DATA !== 'undefined' ? EXTRACTORES_DATA : [], icon: '💨' },
    { name: 'Persianas', data: typeof PERSIANAS_DATA !== 'undefined' ? PERSIANAS_DATA : [], icon: '🪟' },
    { name: 'Cortinas', data: typeof CORTINAS_DATA !== 'undefined' ? CORTINAS_DATA : [], icon: '🌬️' },
    { name: 'Bombas', data: typeof BOMBAS_DATA !== 'undefined' ? BOMBAS_DATA : [], icon: '💧' },
    { name: 'Patio', data: typeof PATIO_DATA !== 'undefined' ? PATIO_DATA : [], icon: '🧳' },
    { name: 'Puertas', data: typeof PUERTAS_DATA !== 'undefined' ? PUERTAS_DATA : [], icon: '🚪' },
    { name: 'ECAs', data: typeof ECAS_DATA !== 'undefined' ? ECAS_DATA : [], icon: '🔥' },
    { name: 'Otros', data: typeof OTROS_DATA !== 'undefined' ? OTROS_DATA : [], icon: '⚙️' },
  ];

  const byBuilding = {};
  const byFloor = {};
  const byBuildingFloor = {};
  let totalEquipment = 0;

  datasets.forEach(dataset => {
    dataset.data.forEach(item => {
      const ubicacion = item.ubicacion || item.piso || '';
      const { building, floor } = parseLocation(ubicacion);

      // Count by building
      if (!byBuilding[building]) {
        byBuilding[building] = { count: 0, types: {} };
      }
      byBuilding[building].count++;
      byBuilding[building].types[dataset.name] = (byBuilding[building].types[dataset.name] || 0) + 1;

      // Count by floor
      if (!byFloor[floor]) {
        byFloor[floor] = { count: 0, buildings: {} };
      }
      byFloor[floor].count++;
      byFloor[floor].buildings[building] = (byFloor[floor].buildings[building] || 0) + 1;

      // Count by building+floor
      const key = `${building}|${floor}`;
      if (!byBuildingFloor[key]) {
        byBuildingFloor[key] = { building, floor, count: 0 };
      }
      byBuildingFloor[key].count++;

      totalEquipment++;
    });
  });

  return {
    total: totalEquipment,
    byBuilding: Object.entries(byBuilding).sort((a, b) => b[1].count - a[1].count),
    byFloor: Object.entries(byFloor).sort((a, b) => b[1].count - a[1].count),
    byBuildingFloor: Object.values(byBuildingFloor).sort((a, b) => {
      if (a.building !== b.building) return a.building.localeCompare(b.building);
      return a.floor.localeCompare(b.floor);
    }),
  };
}

function renderAnalyticsStats() {
  const data = aggregateAllEquipment();
  const buildingCount = data.byBuilding.length;
  const floorCount = data.byFloor.length;

  const cards = [
    { label: 'Total Equipos', value: data.total, icon: '🎯', color: '#3b82f6' },
    { label: 'Edificios', value: buildingCount, icon: '🏢', color: '#8b5cf6' },
    { label: 'Pisos/Niveles', value: floorCount, icon: '📐', color: '#ec4899' },
  ];

  document.getElementById('analytics-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');
}

function renderAnalyticsContent() {
  const data = aggregateAllEquipment();
  const container = document.getElementById('analytics-content');

  let html = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:24px">
      <!-- Por Edificio -->
      <div>
        <h3 style="color:var(--color-navy); font-weight:700; margin-bottom:16px; font-size:18px">🏢 Por Edificio</h3>
        <div style="display:grid; gap:12px">
  `;

  const maxBuilding = Math.max(...data.byBuilding.map(([_, d]) => d.count), 1);
  const buildingColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  data.byBuilding.forEach(([building, d], idx) => {
    const percentage = Math.round((d.count / maxBuilding) * 100);
    const color = buildingColors[idx % buildingColors.length];
    html += `
      <div style="padding:12px; background:var(--color-surface); border-radius:8px; border-left:4px solid ${color}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <span style="font-weight:600; color:var(--color-text); font-size:14px">${building}</span>
          <span style="font-weight:700; font-size:15px; color:${color}">${d.count}</span>
        </div>
        <div style="width:100%; height:6px; background:var(--color-border); border-radius:3px; overflow:hidden">
          <div style="height:100%; background:${color}; width:${percentage}%"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- Por Piso -->
      <div>
        <h3 style="color:var(--color-navy); font-weight:700; margin-bottom:16px; font-size:18px">🏗️ Por Piso/Nivel</h3>
        <div style="display:grid; gap:12px">
  `;

  const maxFloor = Math.max(...data.byFloor.map(([_, d]) => d.count), 1);
  const floorColors = {
    'PB': '#ef4444',
    'SUB': '#8b5cf6',
    '0': '#f97316',
    '1': '#eab308',
    '2': '#84cc16',
    '3': '#22c55e',
    '4': '#10b981',
    '5': '#14b8a6',
    '6': '#06b6d4',
    '7': '#3b82f6',
  };

  data.byFloor.forEach(([floor, d]) => {
    const percentage = Math.round((d.count / maxFloor) * 100);
    const color = floorColors[floor] || '#6b7280';
    const displayFloor = floor === 'PB' ? 'Planta Baja' : floor === 'SUB' ? 'Subsuelo' : `Piso ${floor}`;
    html += `
      <div style="padding:12px; background:var(--color-surface); border-radius:8px; border-left:4px solid ${color}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <span style="font-weight:600; color:var(--color-text); font-size:14px">${displayFloor}</span>
          <span style="font-weight:700; font-size:15px; color:${color}">${d.count}</span>
        </div>
        <div style="width:100%; height:6px; background:var(--color-border); border-radius:3px; overflow:hidden">
          <div style="height:100%; background:${color}; width:${percentage}%"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>

    <!-- Tabla detallada -->
    <div style="margin-top:32px; padding-top:24px; border-top:2px solid var(--color-border)">
      <h3 style="color:var(--color-navy); font-weight:700; margin-bottom:16px; font-size:18px">📋 Detalle por Edificio y Piso</h3>
      <div class="table-card">
        <div class="table-wrap">
          <table style="width:100%">
            <thead>
              <tr>
                <th style="text-align:left; padding:12px; font-weight:600; background:var(--color-surface)">Edificio</th>
                <th style="text-align:left; padding:12px; font-weight:600; background:var(--color-surface)">Piso</th>
                <th style="text-align:center; padding:12px; font-weight:600; background:var(--color-surface)">Equipos</th>
              </tr>
            </thead>
            <tbody>
  `;

  data.byBuildingFloor.forEach(item => {
    html += `
      <tr>
        <td style="padding:12px; border-bottom:1px solid var(--color-border)">${item.building}</td>
        <td style="padding:12px; border-bottom:1px solid var(--color-border)">${item.floor === 'PB' ? 'Planta Baja' : item.floor === 'SUB' ? 'Subsuelo' : `Piso ${item.floor}`}</td>
        <td style="padding:12px; border-bottom:1px solid var(--color-border); text-align:center; font-weight:600; color:#3b82f6">${item.count}</td>
      </tr>
    `;
  });

  html += `
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function initAnalytics() {
  renderAnalyticsStats();
  renderAnalyticsContent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}
