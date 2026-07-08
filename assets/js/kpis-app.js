/* ═══════════════════════════════════════════════════════
   KPIs App — Indicadores clave de mantenimiento
   ═══════════════════════════════════════════════════════ */

let _kpiCharts = {};

function destroyKPICharts() {
  Object.values(_kpiCharts).forEach(c => { try { c.destroy(); } catch(_) {} });
  _kpiCharts = {};
}

function renderKPIsSection() {
  destroyKPICharts();
  const section = document.getElementById('kpis-section');
  if (!section) return;

  const ots = getOTs();

  if (ots.length === 0) {
    section.innerHTML = `
      <div class="ots-empty-state">
        <div class="ots-empty-icon">📊</div>
        <p>No hay datos de OTs cargados.<br>
           Andá a <strong>Historial OTs / SAP</strong> y subí el Excel de SAP para ver los KPIs.</p>
      </div>
    `;
    return;
  }

  const equipos  = [...new Set(ots.map(o => o.equipo))];
  const tecnicos = [...new Set(ots.map(o => o.tecnico).filter(Boolean))];

  const urgentes    = ots.filter(o => o.estado === 'urgente').length;
  const correctivos = ots.filter(o => o.estado === 'correctivo').length;
  const seguimiento = ots.filter(o => o.estado === 'seguimiento').length;
  const ok          = ots.filter(o => o.estado === 'ok').length;
  const tiempoTotal = ots.reduce((s, o) => s + (parseFloat(o.tiempo) || 0), 0);

  const equipoAnalysis = equipos.map(eq => {
    const eqOTs = ots.filter(o => o.equipo === eq);
    return { equipo: eq, a: analyzeEquipmentHistory(eqOTs), count: eqOTs.length,
             tiempo: eqOTs.reduce((s, o) => s + (parseFloat(o.tiempo) || 0), 0) };
  });

  const conCorrectivo = equipoAnalysis.filter(e => ['urgente','correctivo'].includes(e.a.nivel)).length;
  const criticos      = equipoAnalysis.filter(e => e.a.nivel === 'urgente').length;

  section.innerHTML = `
    <!-- Botones exportación -->
    <div class="kpis-export-row">
      <button class="ots-export-btn" onclick="exportKPIsExcel()">⬇ Excel KPIs</button>
      <button class="ots-export-btn" onclick="exportCorrectivosExcel()">⬇ Excel correctivos</button>
      <button class="ots-export-btn" onclick="window.print()">🖨 Imprimir / PDF</button>
    </div>

    <!-- KPI Cards -->
    <div class="kpis-cards-grid">
      ${kpiCard('Total equipos',           equipos.length,              '🏭', '#1a56a4')}
      ${kpiCard('Total OTs analizadas',    ots.length,                  '📋', '#7c3aed')}
      ${kpiCard('Tiempo total (h)',         tiempoTotal.toFixed(1),      '⏱', '#0891b2')}
      ${kpiCard('Con correctivo sugerido', conCorrectivo,               '🟠', '#ea580c')}
      ${kpiCard('Equipos críticos',        criticos,                    '🔴', '#dc2626')}
      ${kpiCard('Técnicos activos',        tecnicos.length,             '👷', '#059669')}
    </div>

    <!-- Fila 1: Estado + Top equipos -->
    <div class="kpis-charts-row">
      <div class="kpis-chart-card" style="flex:0 0 320px">
        <h3 class="kpis-chart-title">Distribución por estado</h3>
        <canvas id="chartEstados"></canvas>
      </div>
      <div class="kpis-chart-card">
        <h3 class="kpis-chart-title">OTs por equipo — Top 12</h3>
        <canvas id="chartEquipos"></canvas>
      </div>
    </div>

    <!-- Fila 2: Evolución mensual + Técnicos -->
    <div class="kpis-charts-row">
      <div class="kpis-chart-card">
        <h3 class="kpis-chart-title">Evolución mensual de OTs</h3>
        <canvas id="chartMensual"></canvas>
      </div>
      <div class="kpis-chart-card">
        <h3 class="kpis-chart-title">Técnicos con más intervenciones</h3>
        <canvas id="chartTecnicos"></canvas>
      </div>
    </div>

    <!-- Fila 3: Fallas + Criticidad -->
    <div class="kpis-charts-row">
      <div class="kpis-chart-card">
        <h3 class="kpis-chart-title">Fallas más frecuentes</h3>
        <canvas id="chartFallas"></canvas>
      </div>
      <div class="kpis-chart-card">
        <h3 class="kpis-chart-title">Ranking de criticidad</h3>
        <div id="kpisCriticalityTable"></div>
      </div>
    </div>

    <!-- Fila 4: Tiempo imputado por equipo -->
    <div class="kpis-charts-row">
      <div class="kpis-chart-card" style="flex:1">
        <h3 class="kpis-chart-title">Tiempo imputado por equipo — Top 12 (horas)</h3>
        <canvas id="chartTiempo"></canvas>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    buildChartEstados(urgentes, correctivos, seguimiento, ok);
    buildChartEquipos(equipoAnalysis);
    buildChartMensual(ots);
    buildChartTecnicos(ots);
    buildChartFallas(ots);
    buildChartTiempo(equipoAnalysis);
    buildCriticalityTable(equipoAnalysis);
  });
}

function kpiCard(label, value, icon, color) {
  return `
    <div class="kpis-card" style="--kpi-color:${color}">
      <span class="kpis-card-icon">${icon}</span>
      <span class="kpis-card-value">${value}</span>
      <span class="kpis-card-label">${label}</span>
    </div>
  `;
}

/* ── Opciones base para todos los charts ───────────────── */
function baseChartOpts(extra = {}) {
  return {
    responsive:          true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: '#5c7592', font: { size: 11 } }, ...extra.legend },
      tooltip: { backgroundColor: '#0b1f35', titleColor: '#e2e8f0', bodyColor: '#cbd5e1' }
    },
    ...extra
  };
}

function axisOpts(grid = true) {
  return {
    ticks: { color: '#5c7592', font: { size: 11 } },
    grid:  { color: grid ? '#dde3ec' : 'transparent' }
  };
}

/* ── Doughnut: distribución por estado ─────────────────── */
function buildChartEstados(urgentes, correctivos, seguimiento, ok) {
  const ctx = document.getElementById('chartEstados');
  if (!ctx) return;
  _kpiCharts.estados = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels:   ['Urgente', 'Correctivo sugerido', 'Seguimiento', 'OK'],
      datasets: [{ data: [urgentes, correctivos, seguimiento, ok],
                   backgroundColor: ['#dc2626','#ea580c','#d97706','#10b981'],
                   borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      ...baseChartOpts(),
      plugins: {
        legend: { position: 'bottom', labels: { color: '#5c7592', font: { size: 11 }, padding: 12 } },
        tooltip: baseChartOpts().plugins.tooltip
      },
      cutout: '60%'
    }
  });
}

/* ── Bar: OTs por equipo (Top 12) ──────────────────────── */
function buildChartEquipos(equipoAnalysis) {
  const ctx = document.getElementById('chartEquipos');
  if (!ctx) return;
  const sorted = [...equipoAnalysis].sort((a, b) => b.count - a.count).slice(0, 12);
  const colors = sorted.map(e => ({
    urgente: '#dc2626', correctivo: '#ea580c', seguimiento: '#d97706', ok: '#0096d6'
  }[e.a.nivel] || '#0096d6'));

  _kpiCharts.equipos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:   sorted.map(e => e.equipo),
      datasets: [{ label: 'OTs', data: sorted.map(e => e.count),
                   backgroundColor: colors, borderRadius: 5, borderSkipped: false }]
    },
    options: {
      ...baseChartOpts({ plugins: { legend: { display: false } } }),
      scales: { y: axisOpts(), x: axisOpts(false) }
    }
  });
}

/* ── Line: evolución mensual ───────────────────────────── */
function buildChartMensual(ots) {
  const ctx = document.getElementById('chartMensual');
  if (!ctx) return;
  const months = {};
  ots.forEach(o => {
    if (!o.fecha) return;
    const m = o.fecha.substring(0, 7);
    months[m] = (months[m] || 0) + 1;
  });
  const sorted = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0]));

  _kpiCharts.mensual = new Chart(ctx, {
    type: 'line',
    data: {
      labels:   sorted.map(([m]) => m),
      datasets: [{
        label: 'OTs por mes', data: sorted.map(([, n]) => n),
        borderColor: '#0096d6', backgroundColor: 'rgba(0,150,214,0.08)',
        tension: 0.35, fill: true, pointRadius: 4,
        pointBackgroundColor: '#0096d6', pointBorderColor: '#fff', pointBorderWidth: 2
      }]
    },
    options: {
      ...baseChartOpts({ plugins: { legend: { display: false } } }),
      scales: { y: axisOpts(), x: { ...axisOpts(false), ticks: { color: '#5c7592', font: { size: 10 }, maxRotation: 45 } } }
    }
  });
}

/* ── Bar horizontal: técnicos ──────────────────────────── */
function buildChartTecnicos(ots) {
  const ctx = document.getElementById('chartTecnicos');
  if (!ctx) return;
  const counts = {};
  ots.forEach(o => { if (o.tecnico) counts[o.tecnico] = (counts[o.tecnico] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  _kpiCharts.tecnicos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:   sorted.map(([t]) => t.length > 22 ? t.substring(0, 22) + '…' : t),
      datasets: [{ label: 'Intervenciones', data: sorted.map(([, n]) => n),
                   backgroundColor: '#7c3aed', borderRadius: 4, borderSkipped: false }]
    },
    options: {
      indexAxis: 'y',
      ...baseChartOpts({ plugins: { legend: { display: false } } }),
      scales: { y: axisOpts(false), x: axisOpts() }
    }
  });
}

/* ── Bar horizontal: fallas más frecuentes ─────────────── */
function buildChartFallas(ots) {
  const ctx = document.getElementById('chartFallas');
  if (!ctx) return;
  const allKW = [...KEYWORDS_URGENTE, ...KEYWORDS_CORRECTIVO, ...KEYWORDS_SEGUIMIENTO];
  const counts = {};
  ots.forEach(o => {
    const lower = (o.comentario || '').toLowerCase();
    allKW.forEach(kw => { if (lower.includes(kw)) counts[kw] = (counts[kw] || 0) + 1; });
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  if (sorted.length === 0) {
    ctx.closest('.kpis-chart-card').innerHTML += '<p class="kpis-no-data">No se detectaron palabras clave en los comentarios.</p>';
    return;
  }

  _kpiCharts.fallas = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:   sorted.map(([k]) => k.length > 28 ? k.substring(0, 28) + '…' : k),
      datasets: [{ label: 'Ocurrencias', data: sorted.map(([, n]) => n),
                   backgroundColor: '#ea580c', borderRadius: 4, borderSkipped: false }]
    },
    options: {
      indexAxis: 'y',
      ...baseChartOpts({ plugins: { legend: { display: false } } }),
      scales: { y: { ...axisOpts(false), ticks: { color: '#5c7592', font: { size: 10 } } }, x: axisOpts() }
    }
  });
}

/* ── Bar: tiempo imputado por equipo ───────────────────── */
function buildChartTiempo(equipoAnalysis) {
  const ctx = document.getElementById('chartTiempo');
  if (!ctx) return;
  const sorted = [...equipoAnalysis].sort((a, b) => b.tiempo - a.tiempo).slice(0, 12);

  _kpiCharts.tiempo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels:   sorted.map(e => e.equipo),
      datasets: [{ label: 'Horas', data: sorted.map(e => +e.tiempo.toFixed(1)),
                   backgroundColor: '#0891b2', borderRadius: 5, borderSkipped: false }]
    },
    options: {
      ...baseChartOpts({ plugins: { legend: { display: false } } }),
      scales: { y: axisOpts(), x: axisOpts(false) }
    }
  });
}

/* ── Tabla de criticidad ───────────────────────────────── */
function buildCriticalityTable(equipoAnalysis) {
  const el = document.getElementById('kpisCriticalityTable');
  if (!el) return;
  const sorted = [...equipoAnalysis]
    .sort((a, b) => {
      const ord = { urgente: 0, correctivo: 1, seguimiento: 2, ok: 3 };
      return (ord[a.a.nivel] ?? 3) - (ord[b.a.nivel] ?? 3) || b.count - a.count;
    })
    .slice(0, 12);

  el.innerHTML = `
    <table class="kpis-crit-table">
      <thead>
        <tr>
          <th>#</th><th>Equipo</th><th>OTs</th><th>Horas</th><th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map((e, i) => {
          const m = OTS_ESTADO_META[e.a.nivel] || OTS_ESTADO_META.ok;
          return `
            <tr>
              <td class="kpis-crit-rank">${i + 1}</td>
              <td><span class="ots-equipo-tag">${e.equipo}</span></td>
              <td style="text-align:center">${e.count}</td>
              <td style="text-align:center">${e.tiempo.toFixed(1)}</td>
              <td><span class="ots-badge-sm ${m.cls}">${m.emoji} ${m.label}</span></td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

/* ── Exportar KPIs a Excel ─────────────────────────────── */
function exportKPIsExcel() {
  const ots = getOTs();
  if (ots.length === 0) { showOTsToast('Sin datos para exportar.', 'error'); return; }

  const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen
  const equipos  = [...new Set(ots.map(o => o.equipo))];
  const tecnicos = [...new Set(ots.map(o => o.tecnico).filter(Boolean))];
  const tiempoTotal = ots.reduce((s, o) => s + (parseFloat(o.tiempo) || 0), 0);

  const resumen = [
    { 'Indicador': 'Total equipos',            'Valor': equipos.length },
    { 'Indicador': 'Total OTs analizadas',     'Valor': ots.length },
    { 'Indicador': 'Tiempo total imputado (h)','Valor': tiempoTotal.toFixed(1) },
    { 'Indicador': 'OTs urgentes',             'Valor': ots.filter(o=>o.estado==='urgente').length },
    { 'Indicador': 'OTs correctivo sugerido',  'Valor': ots.filter(o=>o.estado==='correctivo').length },
    { 'Indicador': 'OTs seguimiento',          'Valor': ots.filter(o=>o.estado==='seguimiento').length },
    { 'Indicador': 'OTs OK',                   'Valor': ots.filter(o=>o.estado==='ok').length },
    { 'Indicador': 'Técnicos activos',         'Valor': tecnicos.length },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), 'Resumen KPIs');

  // Hoja 2: Por equipo
  const equipoAnalysis = equipos.map(eq => {
    const eqOTs = ots.filter(o => o.equipo === eq);
    const a = analyzeEquipmentHistory(eqOTs);
    return {
      'Equipo':         eq,
      'Total OTs':      a.totalOTs,
      'Tiempo (h)':     a.tiempoTotal.toFixed(1),
      'Urgentes':       a.urgentes,
      'Correctivos':    a.correctivos,
      'Seguimiento':    a.seguimiento,
      'OK':             a.totalOTs - a.urgentes - a.correctivos - a.seguimiento,
      'Nivel':          OTS_ESTADO_META[a.nivel]?.label || a.nivel,
      'Recomendación':  a.recomendacion
    };
  }).sort((a, b) => b['Total OTs'] - a['Total OTs']);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(equipoAnalysis), 'Por equipo');

  // Hoja 3: Por técnico
  const tecCounts = {};
  ots.forEach(o => {
    if (!o.tecnico) return;
    if (!tecCounts[o.tecnico]) tecCounts[o.tecnico] = { ots: 0, tiempo: 0 };
    tecCounts[o.tecnico].ots++;
    tecCounts[o.tecnico].tiempo += parseFloat(o.tiempo) || 0;
  });
  const tecRows = Object.entries(tecCounts)
    .sort((a, b) => b[1].ots - a[1].ots)
    .map(([t, d]) => ({ 'Técnico': t, 'OTs': d.ots, 'Tiempo total (h)': d.tiempo.toFixed(1) }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tecRows), 'Por técnico');

  XLSX.writeFile(wb, `kpis-mantenimiento-${new Date().toISOString().slice(0,10)}.xlsx`);
}
