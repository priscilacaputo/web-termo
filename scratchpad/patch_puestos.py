import os
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'js')

# ── hdr-audit.js: cálculo + export ──
p = os.path.join(base, 'hdr-audit.js')
s = open(p, encoding='utf-8').read()
end = s.rindex('})();')
FN = r'''
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
'''
s = s[:end] + FN + s[end:]
open(p, 'w', encoding='utf-8').write(s)

# ── auditoria-app.js: botón en el bloque de carga de trabajo ──
p = os.path.join(base, 'auditoria-app.js')
s = open(p, encoding='utf-8').read()
old = """        <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.h.toLocaleString('es-AR')} h</span></div>`).join('');
  }"""
new = """        <span style="flex:0 0 64px;text-align:right;font-weight:700">${x.h.toLocaleString('es-AR')} h</span></div>`).join('') +
      (() => {
        const r = (typeof hdrPuestosResumen === 'function') ? hdrPuestosResumen() : null;
        if (!r) return '';
        return `<div style="margin-top:10px;padding:10px 12px;border:1px dashed var(--color-border);border-radius:8px;font-size:12px;display:flex;flex-wrap:wrap;gap:10px;align-items:center">
          <div style="flex:1;min-width:220px"><b>Limpieza de puestos:</b> ${r.planes} posiciones de plan (${r.equipos} equipos) tienen alguna operación o responsable con puesto distinto de AUX_TER / AUX_MEC / MOEX
            (${r.puestos.map(esc).join(', ')}). El Excel lista cada plan con su hoja de ruta y las operaciones a corregir en SAP (IA17 / IP02).</div>
          <button class="mant-tab" onclick="hdrPuestosExport()">⬇ Descargar planes a limpiar</button></div>`;
      })();
  }"""
assert old in s
s = s.replace(old, new, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
