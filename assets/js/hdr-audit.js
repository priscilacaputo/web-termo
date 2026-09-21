/* ─── Auditoría de Hojas de Ruta (IA17) ───────────────────────────────
   Panel que se agrega al final de la página "Auditoría SAP". Cruza
   PLANES_SAP (posiciones de plan, IP24) contra HDR_DATA (maestro de
   hojas de ruta) para detectar:
     · Planes SIN hoja de ruta clara → generan OTs sin operaciones.
     · Planes que apuntan a un contador "NO USAR" o vacío (0 HH).
   Vínculo posición→hoja de ruta: EXACTO desde HDR_PLAN (hdr-plan-data.js, "Planes de
   Mantenimiento" de SAP) cuando está cargado; si no, match por texto (hdrBestMatch).
   Además compara la gama de tareas de SAP contra el estándar del Manual de Mtto
   (HDR_ESTANDAR, hdr-estandar-data.js). */

(function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function hdrAuditData() {
    if (typeof HDR_DATA === 'undefined' || typeof hdrBestMatch !== 'function') return null;
    const planes = (typeof PLANES_SAP !== 'undefined' && Array.isArray(PLANES_SAP)) ? PLANES_SAP : [];
    const rutas = new Set(HDR_DATA.map(e => e.ruta));
    const nOps = HDR_DATA.reduce((s, e) => s + (e.ops || 0), 0);

    const sinRuta = {};        // desc → { n, equipos:Set }
    const aDeprecado = {};     // clave → { n, equipos:Set, ruta, motivo }
    const noCorresponde = {};  // plan → hoja de ruta cuyo texto no se parece
    let conRuta = 0, total = 0, exactoMode = false, difTexto = 0, cmpTexto = 0;

    const marcarProblemas = (desc, equipo, e) => {
      const vacio = (e.trabajoMin || 0) === 0 && (e.duracionMin || 0) === 0;
      if (e.noUsar || vacio) {
        const key = desc + ' → ' + e.ruta + '/' + e.cont;
        const d = aDeprecado[key] || (aDeprecado[key] = {
          n: 0, equipos: new Set(), desc: desc || '', ruta: e.ruta + '/' + e.cont,
          motivo: e.noUsar ? 'contador marcado "NO USAR"' : 'hoja de ruta sin operaciones (0 HH)',
          rutaDesc: e.desc,
        });
        d.n++; if (equipo) d.equipos.add(equipo);
      }
    };

    if (typeof HDR_PLAN !== 'undefined' && Array.isArray(HDR_PLAN) && HDR_PLAN.length) {
      exactoMode = true;
      const porKey = new Map(HDR_DATA.map(e => [e.ruta + '/' + e.cont, e]));
      HDR_PLAN.forEach(r => {
        const [equipo, , desc, ruta, cont] = r;
        total++;
        const e = porKey.get(ruta + '/' + cont);
        if (!e) {
          const k = desc + ' → ' + ruta + '/' + cont + ' (no está en el export IA17)';
          const d = sinRuta[k] || (sinRuta[k] = { n: 0, equipos: new Set() });
          d.n++; if (equipo) d.equipos.add(equipo);
          return;
        }
        conRuta++;
        marcarProblemas(desc, equipo, e);
        /* ¿la hoja de ruta asignada "habla" de lo mismo que el plan? */
        const sc = hdrJaccard(hdrTokens(desc), hdrTokens(e.desc));
        if (sc < 0.2) {
          const k = desc + ' → ' + ruta + '/' + cont + ' «' + e.desc + '»';
          const d = noCorresponde[k] || (noCorresponde[k] = { n: 0, equipos: new Set(), desc, ruta: ruta + '/' + cont, rutaDesc: e.desc });
          d.n++; if (equipo) d.equipos.add(equipo);
        }
        /* ¿el match por texto habría acertado? (mide cuánto valía la pena el vínculo exacto) */
        const m = hdrBestMatch(desc);
        cmpTexto++;
        if (!m || hdrJaccard(hdrTokens(m.entry.desc), hdrTokens(e.desc)) < 0.6) difTexto++;   // otra rutina distinta (las hojas 'S' duplicadas cuentan como igual)
      });
    } else {
      const vistos = new Set();
      planes.forEach(p => {
        const k = (p.equipo || '') + '|' + (p.desc || '');
        if (vistos.has(k)) return;
        vistos.add(k);
        total++;
        const m = hdrBestMatch(p.desc);
        if (!m) {
          const d = sinRuta[p.desc] || (sinRuta[p.desc] = { n: 0, equipos: new Set() });
          d.n++; if (p.equipo) d.equipos.add(p.equipo);
          return;
        }
        conRuta++;
        marcarProblemas(p.desc, p.equipo, m.entry);
      });
    }

    const sinRutaArr = Object.entries(sinRuta)
      .map(([desc, d]) => ({ desc, n: d.n, equipos: [...d.equipos] }))
      .sort((a, b) => b.n - a.n);
    const deprecArr = Object.values(aDeprecado)
      .map(d => ({ ...d, equipos: [...d.equipos] }))
      .sort((a, b) => b.n - a.n);

    const noCorrArr = Object.values(noCorresponde)
      .map(d => ({ ...d, equipos: [...d.equipos] }))
      .sort((a, b) => b.n - a.n);

    return {
      exactoMode, difTexto, cmpTexto, noCorrArr,
      nRutas: rutas.size, nCont: HDR_DATA.length, nOps,
      total, conRuta, sinRutaArr, deprecArr,
      cobertura: total ? Math.round(conRuta / total * 100) : 0,
      contNoUsar: HDR_DATA.filter(e => e.noUsar).length,
      contVacios: HDR_DATA.filter(e => (e.trabajoMin || 0) === 0 && (e.duracionMin || 0) === 0).length,
    };
  }

  let _cache = null;
  function data() { return _cache || (_cache = hdrAuditData()); }

  window.hdrAuditCardHTML = function () {
    const d = data();
    if (!d) return '';
    const stat = (label, val, color) =>
      `<div class="stat-card" style="--stat-color:${color};min-width:150px">
        <span class="stat-label">${label}</span><span class="stat-value">${val}</span></div>`;

    const sinRutaRows = d.sinRutaArr.length
      ? d.sinRutaArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 8).map(esc).join(', ')}${r.equipos.length > 8 ? ` +${r.equipos.length - 8}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="3" style="color:var(--color-muted)">Todas las posiciones de plan matchean una hoja de ruta.</td></tr>`;

    const deprecRows = d.deprecArr.length
      ? d.deprecArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td><code>${esc(r.ruta)}</code></td>
          <td>${esc(r.motivo)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 6).map(esc).join(', ')}${r.equipos.length > 6 ? ` +${r.equipos.length - 6}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" style="color:var(--color-muted)">Ningún plan apunta a un contador "NO USAR" ni a una hoja de ruta vacía.</td></tr>`;

    return `
    <div class="table-card" style="margin-bottom:20px" id="aud-hdr">
      <div style="padding:16px 16px 0;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        <h3 style="margin:0;font-size:15px;color:var(--color-navy)">🧭 Hojas de Ruta (IA17)</h3>
        <span style="font-size:12px;color:var(--color-muted)">Maestro de tareas de SAP · duración y Nº de personas por rutina</span>
        <button class="mant-tab" style="margin-left:auto" onclick="hdrAuditExport()">⬇ Exportar Excel</button>
      </div>
      <div class="stats-grid" style="padding:14px 16px 4px">
        ${stat('Hojas de ruta', d.nRutas, '#0096d6')}
        ${stat('Contadores', d.nCont, '#0096d6')}
        ${stat('Operaciones', d.nOps.toLocaleString('es-AR'), '#0096d6')}
        ${stat(d.exactoMode ? 'Posiciones con hoja de ruta (exacto)' : 'Planes con hoja de ruta (por texto)', d.cobertura + '%', d.cobertura >= 95 ? '#10b981' : '#f59e0b')}
        ${d.exactoMode ? stat('Match por texto erraba', d.cmpTexto ? Math.round(d.difTexto / d.cmpTexto * 100) + '%' : '–', '#8b5cf6') : ''}
        ${stat('Contadores "NO USAR"', d.contNoUsar, d.contNoUsar ? '#f59e0b' : '#10b981')}
        ${stat('Hojas de ruta vacías', d.contVacios, d.contVacios ? '#f59e0b' : '#10b981')}
      </div>

      <div style="padding:8px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Planes sin hoja de ruta clara <span style="font-weight:400;color:var(--color-muted)">— generan OTs sin operaciones / sin HH planificadas</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Descripción del plan</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${sinRutaRows}</tbody>
      </table></div>

      <div style="padding:14px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Planes apuntando a contadores "NO USAR" o vacíos
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Descripción del plan</th><th>Hoja de ruta</th><th>Problema</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${deprecRows}</tbody>
      </table></div>
      ${noCorrHTML(d)}
      ${estandarHTML()}
    </div>`;
  };

  function noCorrHTML(d) {
    if (!d.exactoMode) return '';
    const rows = d.noCorrArr.length
      ? d.noCorrArr.map(r => `<tr>
          <td>${esc(r.desc)}</td>
          <td><code>${esc(r.ruta)}</code> ${esc(r.rutaDesc)}</td>
          <td style="text-align:center">${r.n}</td>
          <td>${r.equipos.slice(0, 6).map(esc).join(', ')}${r.equipos.length > 6 ? ` +${r.equipos.length - 6}` : ''}</td>
        </tr>`).join('')
      : `<tr><td colspan="4" style="color:var(--color-muted)">Todas las hojas de ruta asignadas coinciden con la descripción del plan.</td></tr>`;
    return `
      <div style="padding:14px 16px 4px;font-weight:700;font-size:13px;color:var(--color-navy)">
        Hoja de ruta asignada que no parece corresponder al plan
        <span style="font-weight:400;color:var(--color-muted)">— posible error de asignación en SAP</span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Plan</th><th>Hoja de ruta asignada</th><th style="text-align:center">Posic.</th><th>Equipos</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }

  /* ── Gama de tareas de SAP vs estándar del Manual de Mtto ── */
  function estandarHTML() {
    if (typeof HDR_ESTANDAR === 'undefined') return '';
    const E = HDR_ESTANDAR;
    const pct = g => g.nStd ? Math.round(g.cub / g.nStd * 100) : 0;
    const color = p => p >= 85 ? '#10b981' : p >= 60 ? '#f59e0b' : '#ef4444';
    const conDet = E.grupos.filter(g => g.conDetalle);
    const sinDet = E.grupos.filter(g => !g.conDetalle);
    const tot = conDet.reduce((a, g) => ({ std: a.std + g.nStd, cub: a.cub + g.cub }), { std: 0, cub: 0 });
    const pTot = tot.std ? Math.round(tot.cub / tot.std * 100) : 0;

    const detalle = g => {
      const falta = g.falta.map(t => `<li><b>${esc(t.f || '–')}</b>${t.moex ? ' <i>(MOEX)</i>' : ''}: ${esc(t.t)}</li>`).join('');
      const otra = g.otraFrecL.map(t => `<li><b>Estándar ${esc(t.f || '–')} / SAP ${esc(t.sap || '–')}</b>: ${esc(t.t)}</li>`).join('');
      const sobr = g.sobrEj.map(t => `<li>${esc(t)}</li>`).join('');
      const pares = g.pares.map(x => `<code>${esc(x.rc)}</code> (${x.nEquipos} eq.${x.detalle ? '' : ', sin texto de tareas'}${x.existe ? '' : ', no está en el export'})`).join(' · ');
      return `<details><summary style="cursor:pointer;color:var(--color-blue,#0096d6)">ver</summary>
        <div style="font-size:12px;padding:6px 0">
          <div style="margin-bottom:6px"><b>Hojas de ruta:</b> ${pares}</div>
          ${falta ? `<div><b>Tareas del estándar que no están en SAP (${g.falta.length}):</b><ul style="margin:4px 0 8px 18px">${falta}</ul></div>` : ''}
          ${otra ? `<div><b>Están, pero con otra frecuencia (${g.otraFrec}):</b><ul style="margin:4px 0 8px 18px">${otra}</ul></div>` : ''}
          ${sobr ? `<div><b>Tareas de SAP que el estándar no tiene (${g.nSobrantes}, ejemplos):</b><ul style="margin:4px 0 8px 18px">${sobr}</ul></div>` : ''}
        </div></details>`;
    };

    const rows = conDet.slice().sort((a, b) => pct(a) - pct(b)).map(g => {
      const p = pct(g);
      return `<tr>
        <td>${esc(g.nombre)}</td>
        <td style="text-align:center">${g.nEquipos}</td>
        <td style="text-align:center">${g.nStd}</td>
        <td style="text-align:center">${g.cub}</td>
        <td style="text-align:center">${g.otraFrec}</td>
        <td style="text-align:center">${g.falta.length}</td>
        <td style="text-align:center"><b style="color:${color(p)}">${p}%</b></td>
        <td>${detalle(g)}</td></tr>`;
    }).join('');

    const sinDetRows = sinDet.map(g => `<tr><td>${esc(g.nombre)}</td><td style="text-align:center">${g.nEquipos}</td>
        <td style="text-align:center">${g.nStd}</td>
        <td colspan="5" style="color:var(--color-muted)">${g.pares.map(x => esc(x.rc)).join(', ')} — la hoja de ruta de SAP no trae el texto de las tareas (falta el texto largo del IA17; puede ser MOEX)</td></tr>`).join('');
    const sinHR = E.sinHojaDeRuta.map(g => `<li>${esc(g.nombre)} <span style="color:var(--color-muted)">(${g.nStd} tareas en el estándar)</span></li>`).join('');

    return `
      <div style="padding:18px 16px 4px;font-weight:700;font-size:14px;color:var(--color-navy)">
        📐 Gama de tareas vs estándar del Manual de Mtto
        <span style="font-weight:400;font-size:12px;color:var(--color-muted)">— ¿las hojas de ruta de SAP hacen lo que dice el estándar?</span>
      </div>
      <div class="stats-grid" style="padding:10px 16px 4px">
        <div class="stat-card" style="--stat-color:${color(pTot)};min-width:150px"><span class="stat-label">Tareas del estándar cubiertas</span><span class="stat-value">${pTot}%</span></div>
        <div class="stat-card" style="--stat-color:#0096d6;min-width:150px"><span class="stat-label">Tipos comparados</span><span class="stat-value">${conDet.length}</span></div>
        <div class="stat-card" style="--stat-color:#f59e0b;min-width:150px"><span class="stat-label">Tipos sin texto de tareas en SAP</span><span class="stat-value">${sinDet.length}</span></div>
        <div class="stat-card" style="--stat-color:#ef4444;min-width:150px"><span class="stat-label">Tipos del estándar sin hoja de ruta</span><span class="stat-value">${E.sinHojaDeRuta.length}</span></div>
      </div>
      <div style="padding:0 16px 8px;font-size:11px;color:var(--color-muted)">
        Cruce por palabras (aproximado): una tarea del estándar se considera cubierta si una tarea de la hoja de ruta comparte ≥60% de sus palabras, con la misma frecuencia.
        Los vehículos (por kilómetros) no se comparan.
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Tipo de equipo</th><th style="text-align:center">Equipos</th><th style="text-align:center">Tareas estándar</th><th style="text-align:center">Cubiertas</th><th style="text-align:center">Otra frecuencia</th><th style="text-align:center">Faltan en SAP</th><th style="text-align:center">Cobertura</th><th>Detalle</th></tr></thead>
        <tbody>${rows}${sinDetRows}</tbody>
      </table></div>
      <div style="padding:10px 16px 14px;font-size:12px">
        <b>Tipos del estándar sin ninguna hoja de ruta en SAP:</b>
        <ul style="margin:4px 0 0 18px">${sinHR}</ul>
      </div>`;
  }

  window.hdrAuditExport = function () {
    const d = data();
    if (!d || typeof XLSX === 'undefined') return;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      d.sinRutaArr.map(r => ({ 'Descripción plan': r.desc, 'Posiciones': r.n, 'Equipos': r.equipos.join(', ') }))
    ), 'Planes sin hoja de ruta');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      d.deprecArr.map(r => ({ 'Descripción plan': r.desc, 'Hoja de ruta': r.ruta, 'Problema': r.motivo, 'Posiciones': r.n, 'Equipos': r.equipos.join(', ') }))
    ), 'Contadores NO USAR o vacíos');
    if (typeof HDR_ESTANDAR !== 'undefined') {
      const filas = [];
      HDR_ESTANDAR.grupos.forEach(g => {
        g.falta.forEach(t => filas.push({ 'Tipo de equipo': g.nombre, 'Resultado': 'Falta en SAP', 'Frecuencia estándar': t.f || '', 'Tarea (estándar)': t.t, 'Frecuencia en SAP': '' }));
        g.otraFrecL.forEach(t => filas.push({ 'Tipo de equipo': g.nombre, 'Resultado': 'Otra frecuencia', 'Frecuencia estándar': t.f || '', 'Tarea (estándar)': t.t, 'Frecuencia en SAP': t.sap || '' }));
      });
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filas), 'Gama vs estándar');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(HDR_ESTANDAR.grupos.map(g => ({
        'Tipo de equipo': g.nombre, 'Equipos': g.nEquipos, 'Tareas estándar': g.nStd,
        'Con texto de tareas en SAP': g.conDetalle ? 'Sí' : 'No', 'Cubiertas': g.cub,
        'Otra frecuencia': g.otraFrec, 'Faltan': g.falta.length, 'Hojas de ruta': g.pares.map(x => x.rc).join(', '),
      }))), 'Resumen estándar');
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      (typeof HDR_DATA !== 'undefined' ? HDR_DATA : []).map(e => ({
        'Hoja de ruta': e.ruta, 'Contador': e.cont, 'Descripción': e.desc,
        'Puesto': e.puesto, 'Operaciones': e.ops, 'Personas': e.nPers,
        'Trabajo (min)': e.trabajoMin, 'Duración (min)': e.duracionMin, 'NO USAR': e.noUsar ? 'Sí' : '',
      }))
    ), 'Maestro HDR');
    XLSX.writeFile(wb, 'Auditoria_HojasDeRuta.xlsx');
  };

  /* ── Limpieza de puestos de trabajo: planes/operaciones cuyo puesto NO es AUX_TER / AUX_MEC / MOEX ── */
  const PUESTOS_OK = ['AUX_TER', 'AUX_MEC', 'MOEX'];
  function puestosFuera() {
    if (typeof HDR_PLAN === 'undefined' || typeof HDR_OPS_FUERA === 'undefined') return null;
    const okp = (x) => !x || PUESTOS_OK.includes(x);
    const opsPorRC = new Map();
    HDR_OPS_FUERA.forEach((o) => {
      const k = o[0] + '/' + o[1];
      (opsPorRC.get(k) || opsPorRC.set(k, []).get(k)).push(o);
    });
    const planPos = new Map();
    const denom = new Map();
    if (typeof PLANES_SAP !== 'undefined') {
      PLANES_SAP.forEach((p) => { planPos.set(p.plan, p.pos); if (p.denomOT) denom.set(p.plan, p.denomOT); });
    }
    const filas = [];
    HDR_PLAN.forEach((r) => {
      const [equipo, plan, desc, ruta, cont, estr, puesto] = r;
      const ops = opsPorRC.get(ruta + '/' + cont) || [];
      const planFuera = !okp(puesto);
      if (!planFuera && !ops.length) return;
      const puestos = new Set(ops.map((o) => o[5]));
      if (planFuera) puestos.add(puesto);
      filas.push({ equipo, denom: denom.get(plan) || '', plan, pos: planPos.get(plan) || '', desc, estr, ruta, cont, puesto,
        planFuera, ops, puestos: [...puestos] });
    });
    const porPuesto = {};
    filas.forEach((f) => f.puestos.forEach((pu) => {
      const d = porPuesto[pu] || (porPuesto[pu] = { planes: 0, equipos: new Set(), rutas: new Set() });
      d.planes++; d.equipos.add(f.equipo); d.rutas.add(f.ruta + '/' + f.cont);
    }));
    return { filas, porPuesto, opsFuera: HDR_OPS_FUERA };
  }

  window.hdrPuestosResumen = function () {
    const d = puestosFuera();
    if (!d) return null;
    return { planes: d.filas.length, equipos: new Set(d.filas.map((f) => f.equipo)).size, puestos: Object.keys(d.porPuesto) };
  };

  window.hdrPuestosExport = function () {
    const d = puestosFuera();
    if (!d || typeof XLSX === 'undefined') return;
    const wb = XLSX.utils.book_new();
    const add = (rows, name, cols) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      if (cols) ws['!cols'] = cols.map((w) => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, name);
    };
    add(Object.entries(d.porPuesto).sort((a, b) => b[1].planes - a[1].planes).map(([pu, v]) => ({
      'Puesto de trabajo': pu, 'Posiciones de plan afectadas': v.planes, 'Equipos': v.equipos.size, 'Hojas de ruta/contadores': v.rutas.size,
    })), 'Resumen por puesto', [20, 26, 10, 24]);
    add(d.filas.sort((a, b) => a.ruta.localeCompare(b.ruta) || a.equipo.localeCompare(b.equipo)).map((f) => ({
      'Equipo': f.equipo, 'Denominación': f.denom, 'Plan': f.plan, 'Posición': f.pos, 'Descripción del plan': f.desc, 'Estrategia': f.estr,
      'Hoja de ruta': f.ruta, 'Contador': f.cont,
      'Puesto responsable del plan': f.puesto || '',
      'Puesto responsable fuera de estándar': f.planFuera ? 'Sí' : '',
      'Operaciones con puesto fuera de estándar': f.ops.map((o) => `${o[3]} ${o[4]} [${o[5]}]`).join(' · '),
      'Puestos a limpiar': f.puestos.join(', '),
      'Puesto destino (completar)': '',
    })), 'Planes a revisar', [10, 34, 8, 9, 40, 9, 12, 8, 14, 14, 60, 18, 18]);
    add(d.opsFuera.map((o) => {
      const usan = HDR_PLAN.filter((r) => r[3] === o[0] && r[4] === o[1]);
      return {
        'Hoja de ruta': o[0], 'Contador': o[1], 'Descripción del contador': o[2], 'Operación': o[3], 'Descripción de la operación': o[4],
        'Puesto': o[5], 'N° personas': o[6], 'Trabajo': o[7] + (o[8] ? ' ' + o[8] : ''),
        'Posiciones de plan que la usan': usan.length, 'Equipos': [...new Set(usan.map((r) => r[0]))].slice(0, 25).join(', '),
        'Puesto destino (completar)': '',
      };
    }), 'Operaciones', [12, 8, 36, 9, 40, 10, 10, 12, 14, 60, 18]);
    XLSX.writeFile(wb, 'Planes_puestos_fuera_de_estandar.xlsx');
  };
})();
