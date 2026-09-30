/* ─── Nivelación de la carga: qué planes mover de mes en SAP para que no haya meses sobrecargados ───
   Parte de la programación real del año (PROG_ANUAL) y del costo en horas-hombre de cada OT
   (capCostoOT, de capacidad-app.js). Agrupa las OTs en SERIES (equipo + hoja de ruta = un plan/posición).
   El patrón de cada serie se toma como periódico de 12 meses (lo que pasa en ene-dic se repite el año
   siguiente), se completan con OTs "sintéticas" los meses que SAP todavía no generó (p. ej. diciembre) y se
   prueba desplazar cada serie ±N meses.

   Algoritmo: voraz. En cada paso aplica el desplazamiento (de una serie que todavía no se movió) que más
   baja la suma de cuadrados de la carga mensual de su gremio (= la que más parejo deja el año), hasta
   llegar al máximo de cambios pedido. Los primeros cambios son los que más aportan. Cada serie se mueve
   entera (todas sus tomas el mismo número de meses), así que mantiene su ciclo y su secuencia de paquetes. */

const NIV_MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
let nivState = { maxShift: 3, tol: 15, memo: null, memoKey: '', seriesMemo: null, seriesKey: '' };

function nivFecha(s) { return new Date(s + 'T12:00:00'); }
function nivAddMeses(d, k) { return new Date(d.getFullYear(), d.getMonth() + k, d.getDate(), 12); }
function nivIso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function nivMediana(a) { const s = a.slice().sort((x, y) => x - y); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : 0; }

/* ─── Series del año ─── */
function nivSeries() {
  const key = (capState.params.hidrolavado ? 1 : 0) + '|' + capState.params.persDefault;
  if (nivState.seriesMemo && nivState.seriesKey === key) return nivState.seriesMemo;
  capIndices();
  const pe = capPlanesPorEquipo();
  const y = Math.min(...PROG_ANUAL.filas.map(o => +o[3].slice(0, 4)));
  const hoy = new Date();
  const fin = new Date(y, 11, 31, 12);
  const map = new Map();
  PROG_ANUAL.filas.forEach(o => {
    const texto = PROG_ANUAL.textos[o[6]];
    const entry = _capHdrEntry.get(o[4]);
    const moex = (entry && (entry.puesto === 'MOEX' || /moex/i.test(entry.desc))) || /moex/i.test(texto);
    if (moex) return;
    const g = (o[2] === 'AUX_TER' || o[2] === 'AUA_TER') ? 'aire' : ((o[2] === 'AUX_MEC' || o[2] === 'AUE_MEC') ? 'mecanico' : null);
    if (!g) return;
    const key = o[1] + '|' + o[4];
    const c = capCostoOT(o, texto, pe);
    const s = map.get(key) || map.set(key, { key, equipo: o[1], ruta: o[4], g, texto, ots: [], proxima: null }).get(key);
    const d = nivFecha(o[3]);
    s.ots.push({ d, h: c.min / 60, alt: capEsAltura(o[1]) ? 1 : 0, sint: false, fu: c.fuente });
    if (d > hoy && (!s.proxima || d < s.proxima)) s.proxima = d;
  });
  const out = [];
  map.forEach(s => {
    s.ots.sort((a, b) => a.d - b.d);
    const hProm = s.ots.reduce((z, x) => z + x.h, 0) / s.ots.length;
    const altF = s.ots[0].alt;
    /* período: mediana de los intervalos entre OTs; si hay una sola, el ciclo del plan */
    let pd = 0;
    if (s.ots.length > 1) pd = nivMediana(s.ots.slice(1).map((x, i) => (x.d - s.ots[i].d) / 86400000));
    let pl = (pe.get(s.equipo) || []).find(x => { const hp = _capHdrPorPlan.get(x.plan); return hp && hp.ruta + '/' + hp.cont === s.ruta; });
    if (!pd && pl) { const f = capFrecuencias(pl); if (f.length) pd = f[0].meses * 30.4375; }
    s.planes = (pe.get(s.equipo) || []).filter(x => { const hp = _capHdrPorPlan.get(x.plan); return hp && hp.ruta + '/' + hp.cont === s.ruta; });
    /* sin vínculo exacto por hoja de ruta: el plan del equipo que más se parece al texto de la OT */
    if (!s.planes.length) {
      const todos = pe.get(s.equipo) || [];
      const tOT = hdrTokens(s.texto);
      const rank = todos.map(x => ({ x, sc: hdrJaccard(tOT, hdrTokens(x.desc)) })).sort((u, v) => v.sc - u.sc);
      if (rank.length && (rank.length === 1 || rank[0].sc >= 0.25)) s.planes = [rank[0].x];
    }
    if (!s.proxima && s.planes[0] && s.planes[0].proxima) s.proxima = nivFecha(s.planes[0].proxima);
    if (!pd && s.planes[0]) { const f = capFrecuencias(s.planes[0]); if (f.length) pd = f[0].meses * 30.4375; }
    s.pMeses = pd ? Math.max(1, Math.round(pd / 30.4375)) : 12;
    /* completar meses que SAP todavía no generó (hasta dic) */
    if (pd >= 25) {
      const sint = [];
      for (let i = 0; i < s.ots.length - 1; i++) {
        let cur = s.ots[i].d;
        while ((s.ots[i + 1].d - cur) / 86400000 > 1.5 * pd) { cur = new Date(cur.getTime() + pd * 86400000); if (cur.getFullYear() === y) sint.push({ d: cur, h: hProm, alt: altF, sint: true, fu: 'ciclo' }); }
      }
      const last = s.ots[s.ots.length - 1].d;
      if (last >= new Date(y, 8, 1)) {
        let cur = last;
        for (;;) { cur = new Date(cur.getTime() + pd * 86400000); if (cur > fin) break; sint.push({ d: cur, h: hProm, alt: altF, sint: true, fu: 'ciclo' }); }
      }
      s.ots = s.ots.concat(sint);
    }
    /* perfil mensual del año base */
    s.v = Array(12).fill(0); s.a = Array(12).fill(0);
    s.ots.forEach(x => { if (x.d.getFullYear() === y) { s.v[x.d.getMonth()] += x.h; s.a[x.d.getMonth()] += x.alt; } });
    s.total = s.v.reduce((z, x) => z + x, 0);
    if (s.total > 0) out.push(s);
  });
  /* un plan de SAP se reprograma entero: las series (equipo + hoja de ruta) del mismo plan se mueven juntas */
  const unidades = new Map();
  out.forEach(s => {
    const k = (s.planes[0] ? 'P' + s.planes[0].plan : 'S' + s.key) + '|' + s.g;
    const u = unidades.get(k);
    if (!u) { unidades.set(k, s); return; }
    u.v = u.v.map((x, m) => x + s.v[m]); u.a = u.a.map((x, m) => x + s.a[m]);
    u.total += s.total; u.ots = u.ots.concat(s.ots);
    if (s.proxima && (!u.proxima || s.proxima < u.proxima)) u.proxima = s.proxima;
    u.pMeses = Math.min(u.pMeses, s.pMeses);
  });
  out.length = 0; unidades.forEach(u => out.push(u));
  nivState.seriesMemo = { series: out, year: y }; nivState.seriesKey = key;
  return nivState.seriesMemo;
}

/* Demanda estimada de un mes que SAP todavía no generó: las OTs de ese mes calendario en el año base
   (reales + las completadas con el ciclo del plan). Mismo formato que capDemandaReal. */
function capDemandaPatron(mes) {
  const { series, year } = nivSeries();
  const mi = +mes.slice(5, 7) - 1;
  const mk = () => ({ ots: 0, horas: 0, horasSap: 0, horasEstim: 0, otsSap: 0, otsEstim: 0, dia: 0, noche: 0, libre: 0, altura: 0, alturaH: 0, porFamilia: {} });
  const res = { aire: mk(), mecanico: mk(), externo: { ots: 0 }, otro: { ots: 0 }, detalle: [], origen: 'patron' };
  series.forEach(s => {
    const g = res[s.g];
    s.ots.forEach(o => {
      if (o.d.getFullYear() !== year || o.d.getMonth() !== mi) return;
      g.ots++; g.horas += o.h;
      if (o.fu === 'estim') { g.horasEstim += o.h; g.otsEstim++; } else { g.horasSap += o.h; g.otsSap++; }
      g[capTurnoObligatorio(s.equipo, s.texto) || 'libre'] += o.h;
      if (o.alt) { g.altura++; g.alturaH += o.h; }
      const fam = capFamilia(s.equipo) || '—';
      const f = g.porFamilia[fam] || (g.porFamilia[fam] = { ots: 0, horas: 0 });
      f.ots++; f.horas += o.h;
      res.detalle.push({ gremio: s.g, plan: s.planes[0] ? s.planes[0].plan : '', pos: s.planes[0] ? s.planes[0].pos : '', equipo: s.equipo, desc: s.texto, declara: s.planes[0] ? s.planes[0].declara : '',
        tomas: 1, hhPorToma: Math.round(o.h * 60 / 6) / 10, personas: '', horas: Math.round(o.h * 10) / 10, fuente: o.fu === 'estim' ? 'estim' : 'sap', ruta: s.ruta, turno: capTurnoObligatorio(s.equipo, s.texto) || 'libre' });
    });
  });
  /* contratistas y otros gremios: los del mismo mes del año base */
  const base = capDemandaReal(`${year}-${String(mi + 1).padStart(2, '0')}`);
  if (base) { res.externo.ots = base.externo.ots; res.otro.ots = base.otro.ots; }
  return res;
}

const nivShift = (v, sh) => { const r = Array(12).fill(0); for (let m = 0; m < 12; m++) r[(m + sh + 120) % 12] = v[m]; return r; };

function nivCalcular() {
  const key = [nivState.maxShift, nivState.tol, capState.params.hidrolavado, capState.params.persDefault].join('|');
  if (nivState.memo && nivState.memoKey === key) return nivState.memo;
  const { series, year } = nivSeries();
  const L0 = { aire: Array(12).fill(0), mecanico: Array(12).fill(0) };
  const A0 = { aire: Array(12).fill(0), mecanico: Array(12).fill(0) };
  series.forEach(s => s.v.forEach((x, m) => { L0[s.g][m] += x; A0[s.g][m] += s.a[m]; }));
  /* candidatos por serie: desplazamientos distintos y que cambian el patrón */
  const manana = new Date(Date.now() + 86400000);
  series.forEach(s => {
    s.cands = [];
    for (let sh = -nivState.maxShift; sh <= nivState.maxShift; sh++) {
      if (!sh) continue;
      if (s.proxima && nivAddMeses(s.proxima, sh) < manana) continue;   // adelantar solo si la nueva fecha sigue siendo futura
      const w = nivShift(s.v, sh);
      if (w.some((x, m) => Math.abs(x - s.v[m]) > 0.01)) s.cands.push(sh);
    }
  });
  const GR = ['aire', 'mecanico'];
  const copia = o => ({ aire: o.aire.slice(), mecanico: o.mecanico.slice() });
  /* objetivo: ningún mes pasa del promedio del año + tol % (por gremio). Se buscan los MENOS cambios que lo logren. */
  const tgt = {}; GR.forEach(g => { tgt[g] = (L0[g].reduce((z, x) => z + x, 0) / 12) * (1 + nivState.tol / 100) + 0.5; });
  const cumple = (L, g) => Math.max(...L[g]) <= tgt[g];
  /* 1) voraz: el cambio que más baja Σ carga² entre los gremios que todavía no llegan al objetivo */
  const L = copia(L0), elegidos = [], usada = new Set();
  while (elegidos.length < 600 && !GR.every(g => cumple(L, g))) {
    let best = null;
    series.forEach(s => {
      if (usada.has(s) || !s.cands.length || cumple(L, s.g)) return;
      const l = L[s.g], T = tgt[s.g];
      s.cands.forEach(sh => {
        const w = nivShift(s.v, sh);
        /* lo que importa es bajar lo que pasa del objetivo; Σ carga² solo desempata */
        let d = 0, e = 0;
        for (let m = 0; m < 12; m++) {
          const n = l[m] - s.v[m] + w[m];
          d += n * n - l[m] * l[m];
          e += (Math.max(0, n - T) ** 2) - (Math.max(0, l[m] - T) ** 2);
        }
        const obj = e + d * 1e-4;
        if (!best || obj < best.obj) best = { s, sh, d, obj, e };
      });
    });
    if (!best || (best.e >= 0 && best.d > -50)) break;
    const w = nivShift(best.s.v, best.sh);
    for (let m = 0; m < 12; m++) L[best.s.g][m] += w[m] - best.s.v[m];
    usada.add(best.s); elegidos.push({ s: best.s, sh: best.sh });
  }
  const alcanzado = GR.every(g => cumple(L, g));
  /* 2) poda: si sacar un cambio (empezando por los últimos) sigue cumpliendo el objetivo, se saca */
  if (alcanzado) {
    for (let i = elegidos.length - 1; i >= 0; i--) {
      const { s, sh } = elegidos[i], w = nivShift(s.v, sh);
      const l2 = L[s.g].map((x, m) => x - w[m] + s.v[m]);
      if (Math.max(...l2) <= tgt[s.g]) { L[s.g] = l2; elegidos.splice(i, 1); }
    }
  }
  /* 3) orden final: de más a menos efecto, aplicándolos de a uno desde la situación de hoy */
  const Lo = copia(L0), Ao = copia(A0), resto = elegidos.slice(), moves = [];
  const pico = { aire: [Math.max(...L0.aire)], mecanico: [Math.max(...L0.mecanico)] };
  while (resto.length) {
    let bi = 0, bd = Infinity;
    resto.forEach((e, i) => {
      const w = nivShift(e.s.v, e.sh), l = Lo[e.s.g];
      let d = 0;
      for (let m = 0; m < 12; m++) { const n = l[m] - e.s.v[m] + w[m]; d += n * n - l[m] * l[m]; }
      if (d < bd) { bd = d; bi = i; }
    });
    const e = resto.splice(bi, 1)[0], w = nivShift(e.s.v, e.sh), wa = nivShift(e.s.a, e.sh);
    for (let m = 0; m < 12; m++) { Lo[e.s.g][m] += w[m] - e.s.v[m]; Ao[e.s.g][m] += wa[m] - e.s.a[m]; }
    moves.push({ s: e.s, sh: e.sh, gain: -bd });
    pico.aire.push(Math.max(...Lo.aire)); pico.mecanico.push(Math.max(...Lo.mecanico));
  }
  const res = { year, series, moves, antes: copia(L0), despues: Lo, altAntes: copia(A0), altDespues: Ao, pico, alcanzado,
    objetivo: { aire: tgt.aire - 0.5, mecanico: tgt.mecanico - 0.5 }, sinMover: series.length - moves.length };
  nivState.memo = res; nivState.memoKey = key;
  return res;
}

/* ─── Vista ─── */
const nivH = h => Math.round(h).toLocaleString('es-AR') + ' h';
/* orden de los meses en pantalla: empieza en el primer mes del horizonte (oct, nov, … sep) */
const nivOrd = () => capMesesAnalisis().map(m => +m.slice(5, 7) - 1);
function nivMesesDe(v) { return nivOrd().filter(m => v[m] > 0.01).map(m => NIV_MES[m]).join(' · '); }
function nivDesc(sh) { return sh > 0 ? `atrasar ${sh} mes${sh > 1 ? 'es' : ''}` : `adelantar ${-sh} mes${sh < -1 ? 'es' : ''}`; }

function nivFilasTabla(R, max) {
  return R.moves.slice(0, max).map((mv, i) => {
    const s = mv.s, pl = s.planes[0];
    const nuevaD = s.proxima ? nivAddMeses(s.proxima, mv.sh) : null, dm = mv.sh;
    const nueva = nuevaD ? nivIso(nuevaD) : '';
    return { n: i + 1, g: s.g === 'aire' ? 'Aire' : 'Mecánicos', equipo: s.equipo, texto: s.texto, plan: pl ? pl.plan : '', pos: pl ? pl.pos : '', nPlanes: s.planes.length,
      ciclo: pl ? pl.declara : '', horasAnio: s.total, hoy: nivMesesDe(s.v), nuevo: nivMesesDe(nivShift(s.v, mv.sh)), accion: s.proxima ? (dm === 0 ? 'sin cambio de fecha' : nivDesc(dm)) : nivDesc(mv.sh),
      proxima: s.proxima ? nivIso(s.proxima) : '', nueva, ruta: s.ruta };
  });
}

function nivHTML() {
  if (typeof PROG_ANUAL === 'undefined' || typeof capCostoOT !== 'function') return '';
  const R = nivCalcular();
  const p = capState.params;
  const of = capOferta(R.year + '-01');   // horas netas por mes (nominal)
  const cap = g => of.netoH[g];
  const cv = a => { const m = a.reduce((z, x) => z + x, 0) / 12; return Math.sqrt(a.reduce((z, x) => z + (x - m) ** 2, 0) / 12) / m; };
  const gr = g => {
    const a = R.antes[g], d = R.despues[g];
    const pa = Math.max(...a), pd = Math.max(...d);
    const mesPa = NIV_MES[a.indexOf(pa)], mesPd = NIV_MES[d.indexOf(pd)];
    return `<div style="flex:1;min-width:280px;padding:12px 14px;border-left:4px solid ${g === 'aire' ? '#0096d6' : '#6366f1'};background:rgba(127,127,127,.06);border-radius:6px">
      <b>${g === 'aire' ? '❄️ Aire' : '⚙️ Mecánicos'}</b>
      <div style="font-size:12.5px;margin-top:4px">Mes más cargado: <b>${nivH(pa)}</b> (${mesPa}, ${Math.round(100 * pa / cap(g))}% de la capacidad) → <b>${nivH(pd)}</b> (${mesPd}, ${Math.round(100 * pd / cap(g))}%).</div>
      <div style="font-size:12px;color:var(--color-muted);margin-top:2px">Mes menos cargado: ${nivH(Math.min(...a))} → ${nivH(Math.min(...d))} · desparejo entre meses (coef. de variación): ${Math.round(cv(a) * 100)}% → ${Math.round(cv(d) * 100)}%</div></div>`;
  };
  const pk = (g, k) => R.pico[g][Math.min(k, R.pico[g].length - 1)];
  const nm = R.moves.length;
  const puntos = [...new Set([...[5, 10, 25, 50, 100, 200].filter(k => k < nm), nm])].filter(k => k > 0);
  const tabPuntos = `<table style="font-size:12px;margin-top:8px"><thead><tr><th style="text-align:left;padding-right:14px">Si se hacen…</th>${puntos.map(k => `<th style="text-align:right;padding:0 10px">${k} cambios</th>`).join('')}</tr></thead><tbody>
    <tr><td>Pico Aire</td>${puntos.map(k => `<td style="text-align:right;padding:0 10px">${nivH(pk('aire', k))}</td>`).join('')}</tr>
    <tr><td>Pico Mecánicos</td>${puntos.map(k => `<td style="text-align:right;padding:0 10px">${nivH(pk('mecanico', k))}</td>`).join('')}</tr></tbody></table>
    <div style="font-size:11px;color:var(--color-muted);margin-top:2px">Hoy: pico Aire ${nivH(pk('aire', 0))} · pico Mecánicos ${nivH(pk('mecanico', 0))}. Los primeros cambios son los que más aportan.</div>`;
  const filas = nivFilasTabla(R, 60);
  const altPico = g => Math.max(...R.altAntes[g]) + ' → ' + Math.max(...R.altDespues[g]);
  const tabla = `<div class="table-wrap" style="max-height:480px;overflow:auto"><table style="font-size:12px"><thead><tr><th>#</th><th>Gremio</th><th>Equipo</th><th>Plan en SAP</th><th>Posición</th><th>Denominación</th><th>Ciclo</th><th style="text-align:right">h/año</th><th>Hoy cae en</th><th>Qué hacer</th><th>Quedaría en</th><th>Próxima toma</th><th>Nueva fecha</th></tr></thead><tbody>${
    filas.map(f => `<tr><td>${f.n}</td><td>${f.g}</td><td><b>${capEsc(f.equipo)}</b></td><td>${capEsc(f.plan)}${f.nPlanes > 1 ? ' +' + (f.nPlanes - 1) : ''}</td><td>${capEsc(f.pos)}</td><td>${capEsc(f.texto)}</td><td>${capEsc(f.ciclo)}</td><td style="text-align:right">${Math.round(f.horasAnio)}</td><td>${f.hoy}</td><td><b>${f.accion}</b></td><td>${f.nuevo}</td><td>${f.proxima}</td><td><b>${f.nueva}</b></td></tr>`).join('')}</tbody></table></div>
    <div style="font-size:11.5px;color:var(--color-muted);margin-top:6px">Se muestran los primeros ${filas.length} de ${R.moves.length} cambios (los de mayor efecto primero). El Excel trae la lista completa.</div>`;

  return `<div class="table-card" style="margin-top:16px;padding:16px" id="niv-root">
    <b style="font-size:15px">🧮 Cómo programar SAP para que la carga quede pareja</b>
    <div style="font-size:12.5px;color:var(--color-muted);margin:4px 0 10px">Propone mover de mes la <b>fecha de las tomas</b> de algunos planes (cada plan se mueve entero, conserva su ciclo). Mira hacia adelante (desde octubre): parte de los ${R.series.length} planes con OTs en la programación ${R.year}, que se repite en los meses siguientes, y completa con el ciclo del plan lo que SAP todavía no generó. Lo que ya pasó no se toca.</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end">
      ${capInputNiv('maxShift', 'Mover hasta (meses)')}${capInputNiv('tol', 'Mes más cargado hasta (% sobre el promedio)')}
      <button class="mant-tab" onclick="nivExport()">⬇ Excel para trabajar en SAP</button></div>
    <div style="font-size:13px;margin-top:12px;padding:8px 12px;border-radius:6px;background:${R.alcanzado ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.15)'}">${R.alcanzado
      ? `✅ Bastan <b>${R.moves.length} cambios</b> (los mínimos que encontré) para que ningún mes pase un ${nivState.tol}% del promedio: Aire hasta ${nivH(R.objetivo.aire)} y Mecánicos hasta ${nivH(R.objetivo.mecanico)}.`
      : `⚠️ Con hasta ${nivState.maxShift} meses de movimiento no se llega a que ningún mes pase un ${nivState.tol}% del promedio; estos ${R.moves.length} cambios son los que más ayudan. Subí los meses o la tolerancia.`}</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:12px">${gr('aire')}${gr('mecanico')}</div>
    <div style="margin-top:10px">${tabPuntos}</div>
    <div style="font-size:12px;margin-top:8px">Trabajo en altura (mes con más OTs): Aire ${altPico('aire')} · Mecánicos ${altPico('mecanico')}.</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:14px">
      <div style="flex:1;min-width:320px;height:290px;position:relative"><canvas id="niv-ch-aire"></canvas></div>
      <div style="flex:1;min-width:320px;height:290px;position:relative"><canvas id="niv-ch-mec"></canvas></div></div>
    <div style="margin-top:16px"><b>Qué cambios hacer (en este orden)</b>${tabla}</div>
    <div style="font-size:12px;color:var(--color-muted);margin-top:12px;line-height:1.55"><b style="color:inherit">Cómo aplicarlo en SAP</b><ul style="margin:4px 0 0 18px">
      <li>Por cada fila: reprogramar el plan para que su próxima toma caiga en la <b>nueva fecha</b> (IP10 → programar/reprogramar el plan con nueva fecha de inicio, o IP02 si el plan todavía no tiene llamadas). Las tomas siguientes se corren solas con el mismo ciclo.</li>
      <li>Las OTs que SAP <b>ya creó</b> para los próximos meses hay que moverlas una por una (IW32 → fecha de inicio), o dejarlas y aplicar el cambio desde la toma siguiente.</li>
      <li>Empezá por los primeros cambios de la lista: son los que más bajan el pico. Confirmá el procedimiento exacto con quien administra los planes en SAP, porque depende de cómo estén parametrizados.</li></ul>
    <b style="color:inherit;display:block;margin-top:8px">Límites</b><ul style="margin:4px 0 0 18px">
      <li>Supone que el año se repite (las tomas de marzo de este año vuelven en marzo del siguiente): vale para ciclos que dividen 12 meses.</li>
      <li>No mira turnos, zonas ni el agrupamiento de sistemas de aire: mover un equipo de un sistema sin mover a los demás rompe la visita conjunta. Revisá esos casos antes de cargarlos.</li>
      <li>Nivela horas-hombre por gremio (Aire y Mecánicos por separado); no toma en cuenta vacaciones de verano ni feriados.</li></ul></div>
  </div>`;
}
function capInputNiv(k, label) {
  return `<label style="display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:var(--color-muted)">${label}
    <input type="number" min="1" value="${nivState[k]}" style="width:96px;padding:5px 7px;border:1px solid var(--color-border,#d1d5db);border-radius:6px;background:transparent;color:inherit" onchange="nivSet('${k}', this.value)"></label>`;
}
function nivSet(k, v) { const n = Math.max(k === 'tol' ? 0 : 1, Math.round(Number(v))); if (!isFinite(n)) return; nivState[k] = k === 'maxShift' ? Math.min(6, n) : Math.min(100, n); capRender(); }

function nivDibujar(txt, base) {
  if (!document.getElementById('niv-ch-aire')) return;
  const R = nivCalcular();
  const dib = (g, id, titulo, color) => {
    const o = base();
    o.plugins.title = { display: true, text: titulo, color: txt };
    o.scales.y.title = { display: true, text: 'horas-persona / mes', color: txt };
    const cap = Math.round(capOferta(R.year + '-01').netoH[g]);
    const ord = nivOrd();
    _capCharts.push(new Chart(document.getElementById(id), { data: { labels: ord.map(m => NIV_MES[m]), datasets: [
      { type: 'bar', label: 'Hoy', data: ord.map(m => Math.round(R.antes[g][m])), backgroundColor: 'rgba(127,127,127,.55)' },
      { type: 'bar', label: 'Con los cambios', data: ord.map(m => Math.round(R.despues[g][m])), backgroundColor: color },
      { type: 'line', label: 'Capacidad neta', data: ord.map(() => cap), borderColor: '#dc2626', backgroundColor: '#dc2626', borderWidth: 2, pointRadius: 0 },
    ] }, options: o }));
  };
  dib('aire', 'niv-ch-aire', '❄️ Aire — carga por mes: hoy vs. nivelada', '#0096d6');
  dib('mecanico', 'niv-ch-mec', '⚙️ Mecánicos — carga por mes: hoy vs. nivelada', '#6366f1');
}

function nivExport() {
  if (typeof XLSX === 'undefined') { alert('Falta la librería XLSX.'); return; }
  const R = nivCalcular();
  const wb = XLSX.utils.book_new();
  const f = nivFilasTabla(R, 9999);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(f.map(x => ({ '#': x.n, Gremio: x.g, Equipo: x.equipo, 'Plan SAP': x.plan, Posición: x.pos, 'Planes en el equipo con esa hoja de ruta': x.nPlanes, Denominación: x.texto,
    Ciclo: x.ciclo, 'Horas/año': Math.round(x.horasAnio), 'Hoy cae en': x.hoy, 'Qué hacer': x.accion, 'Quedaría en': x.nuevo, 'Próxima toma': x.proxima, 'Nueva fecha sugerida': x.nueva, 'Hoja de ruta': x.ruta }))), 'Cambios a hacer');
  const res = nivOrd().map(i => ({ Mes: NIV_MES[i], 'Aire hoy (h)': Math.round(R.antes.aire[i]), 'Aire nivelado (h)': Math.round(R.despues.aire[i]), 'Mecánicos hoy (h)': Math.round(R.antes.mecanico[i]), 'Mecánicos nivelado (h)': Math.round(R.despues.mecanico[i]),
    'Altura Aire hoy': Math.round(R.altAntes.aire[i]), 'Altura Aire nivelada': Math.round(R.altDespues.aire[i]), 'Altura Mec. hoy': Math.round(R.altAntes.mecanico[i]), 'Altura Mec. nivelada': Math.round(R.altDespues.mecanico[i]) }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(res), 'Carga por mes');
  /* Escenarios de ausencias (vacaciones/licencias) sobre la dotación nominal: mismos cambios, distinta capacidad */
  const pr = capState.params, minNeto = capMinNetosTurno(pr);
  const capH = (g, aus) => (g === 'aire' ? pr.tecAire : pr.tecMec) * pr.diasMes * (1 - aus / 100) * minNeto / 60;
  const pct = x => Math.round(x * 100);
  const esc = [];
  [0, 10].forEach(aus => nivOrd().forEach(i => {
    const fila = { Escenario: `${aus}% de ausencias`, Mes: NIV_MES[i] };
    [['aire', 'Aire'], ['mecanico', 'Mecánicos']].forEach(([g, n]) => {
      const c = capH(g, aus);
      Object.assign(fila, { [`${n}: capacidad neta (h)`]: Math.round(c), [`${n}: carga hoy (h)`]: Math.round(R.antes[g][i]), [`${n}: carga nivelada (h)`]: Math.round(R.despues[g][i]),
        [`${n}: uso hoy %`]: pct(R.antes[g][i] / c), [`${n}: uso nivelado %`]: pct(R.despues[g][i] / c) });
    });
    esc.push(fila);
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(esc), 'Ausencias 0% vs 10%');
  const k = R.moves.length;
  const resumen = [];
  [0, 10].forEach(aus => ['aire', 'mecanico'].forEach(g => {
    const c = capH(g, aus);
    resumen.push({ Escenario: `${aus}% de ausencias`, Gremio: g === 'aire' ? 'Aire' : 'Mecánicos', 'Capacidad neta (h/mes)': Math.round(c), 'Pico hoy (h)': Math.round(R.pico[g][0]), 'Pico hoy (% cap.)': pct(R.pico[g][0] / c),
      'Pico nivelado (h)': Math.round(R.pico[g][k]), 'Pico nivelado (% cap.)': pct(R.pico[g][k] / c), 'Meses sobre 85% hoy': R.antes[g].filter(x => x / c > 0.85).length, 'Meses sobre 85% nivelado': R.despues[g].filter(x => x / c > 0.85).length,
      'Meses sobre 100% hoy': R.antes[g].filter(x => x / c > 1).length, 'Meses sobre 100% nivelado': R.despues[g].filter(x => x / c > 1).length, 'Cambios de plan': k }); }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), 'Resumen ausencias');
  XLSX.writeFile(wb, 'nivelacion-carga-sap.xlsx');
}

/* Tarea para "Qué corregir en SAP": los cambios de fecha propuestos por la nivelación. El cálculo tarda ~1 s, así que
   la primera vez se hace en segundo plano y se vuelve a pintar la pestaña cuando está listo. */
function nivAccion() {
  if (typeof PROG_ANUAL === 'undefined' || typeof capCostoOT !== 'function') return null;
  if (!nivState.memo) {
    if (!nivState.acc) {
      nivState.acc = true;
      setTimeout(() => { try { nivCalcular(); } catch (e) { /* sin datos */ } if (typeof audRefrescarAcciones === 'function') audRefrescarAcciones(); }, 50);
    }
    return null;
  }
  const R = nivCalcular();
  const filas = nivFilasTabla(R, 9999).filter(f => f.accion !== 'sin cambio de fecha');
  if (!filas.length) return null;
  const pa = R.pico.aire, pm = R.pico.mecanico, k = R.moves.length;
  const pAntes = Math.max(pa[0], pm[0]);
  const capA = capOferta(R.year + '-01').netoH.aire;
  return {
    prio: pa[0] / capA > 0.85 ? 'alta' : 'media',
    que: `Hoy hay meses muy cargados (pico Aire ${Math.round(pa[0])} h, Mecánicos ${Math.round(pm[0])} h) y otros casi vacíos. Mover la próxima toma de los planes de esta lista (cada plan conserva su ciclo) baja el pico de Aire a ${Math.round(pa[k])} h y el de Mecánicos a ${Math.round(pm[k])} h. Son los cambios mínimos para que ningún mes pase un ${nivState.tol}% del promedio; empezá por los primeros. Detalle, gráficos y Excel en la pestaña "Capacidad del personal".`,
    objetos: filas.map(f => ({ cod: f.equipo, det: `${f.accion} — plan ${f.plan || '?'}${f.pos ? ' pos. ' + f.pos : ''}${f.ciclo ? ' (' + f.ciclo + ')' : ''} · ${f.texto}` + (f.proxima ? ` · próxima toma ${f.proxima} → ${f.nueva}` : '') })),
  };
}
