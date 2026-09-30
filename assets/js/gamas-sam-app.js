/* ─── Gamas para SAM ───────────────────────────────────────────────────
   Toma el texto de cada operación de las hojas de ruta (HDR_GAMAS, del IA17) y lo rearma en
   texto plano legible para SAP SAM: una tarea por línea, numeradas, con encabezados por
   frecuencia. SAM no respeta el formato del SAP GUI (une los renglones sin espacio), por eso:
     · cada tarea lleva número / símbolo al inicio (se distingue aunque se peguen los renglones);
     · las líneas largas se parten con sangría de 2 espacios (si SAM las une, queda el espacio);
     · se separan las frases pegadas ("operación.Limpieza") y se corrigen palabras pegadas conocidas.
   Regenerar datos: python scratchpad/gen_hdr_gamas.py "<ia17.xlsx>". */
(function () {
  if (typeof HDR_GAMAS === 'undefined') return;

  /* Palabras pegadas conocidas en los textos largos de SAP → corrección (sólo palabra completa). */
  const PEGADAS = {
    controlesde: 'controles de', dedrenaje: 'de drenaje', yforzador: 'y forzador', delevaporador: 'del evaporador',
    deltermostato: 'del termostato', defuncionamiento: 'de funcionamiento', encaso: 'en caso', deaguapor: 'de agua por',
    'y/obandeja': 'y/o bandeja', ycarteles: 'y carteles', delárea: 'del área', nivelde: 'nivel de', convalores: 'con valores',
    pinturaen: 'pintura en', graly: 'gral. y', deretorno: 'de retorno', delcondensado: 'del condensado',
    vibraciones: 'vibraciones', pantallassimatic: 'pantallas Simatic', ymecanismos: 'y mecanismos',
    delos: 'de los', delequipo: 'del equipo', delmotor: 'del motor', deequipo: 'de equipo'
  };
  const FRECS = [['DIARIA', /diari/], ['SEMANAL', /semanal/], ['QUINCENAL', /quincenal/], ['MENSUAL', /mensual/], ['BIMESTRAL', /bimestral/],
    ['TRIMESTRAL', /trimestral/], ['CUATRIMESTRAL', /cuatrimestral/], ['SEMESTRAL', /semestral/], ['ANUAL', /anual/], ['BIENAL', /bienal/]];
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const st = { key: null, ops: {}, sel: null };

  /* ── equipos por hoja de ruta (HDR_PLAN: [equipo, plan, desc, ruta, cont, ...]) ── */
  const equiposPorKey = {};
  if (typeof HDR_PLAN !== 'undefined') HDR_PLAN.forEach(r => { (equiposPorKey[r[3] + '/' + r[4]] = equiposPorKey[r[3] + '/' + r[4]] || []).push(r[0]); });

  /* ════════ Normalización del texto ════════ */
  function arreglarPegadas(t) {
    return t.replace(/[A-Za-zÁÉÍÓÚáéíóúñÑ\/]+/g, w => PEGADAS[w.toLowerCase()] ? (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()
      ? PEGADAS[w.toLowerCase()].replace(/^./, c => c.toUpperCase()) : PEGADAS[w.toLowerCase()]) : w);
  }
  /* "operación.Limpieza de" → frases separadas; devuelve lista de tareas. */
  function partirFrases(t) {
    t = arreglarPegadas(t).replace(/\s+/g, ' ').trim();
    t = t.replace(/,(?=[A-Za-záéíóúñ])/g, ', ').replace(/([a-záéíóúñ]{3})(?=(?:Verificar|Verificación|Limpieza|Limpiar|Realizar|Efectuar|Controlar|Retirar|Garantizar|Energizado|Medir|Ajustar|Revisar|Inspeccionar|Lubricar|Cambiar)\b)/g, '$1\n');
    t = t.replace(/([a-záéíóúñ\)\d])\.(?=[A-ZÁÉÍÓÚ¿])/g, '$1.\n');
    return t.split('\n').map(x => x.trim()).filter(Boolean);
  }
  function fcOf(h) { const n = norm(h); for (const [k, re] of FRECS) if (re.test(n)) return k; return ''; }
  function tituloFrec(h) { const f = fcOf(h); if (f) return f; return h.replace(/^gama$/i, '').toUpperCase(); }

  /* ── Operación → {seg:[], tareas:[{h,i:[]}], auto:[], libre:[]} ── */
  function estructurar(o) {
    const r = { seg: [], tareas: [], auto: [], libre: [] };
    if (o.S != null) r.seg = HDR_GAMAS_TXT[o.S].slice();
    if (o.A != null) r.auto = HDR_GAMAS_TXT[o.A].slice();
    (o.ga || []).forEach(g => r.tareas.push({ h: g.h, i: g.i.flatMap(partirFrases) }));
    (o.li || []).forEach(x => r.libre.push(...partirFrases(x)));
    (o.sb || []).forEach(s => {
      const x = (s.d + ' ' + s.x).trim(), n = norm(s.d);
      if (/^1\s*-\s*consignas de seguridad/.test(n)) return;           // título, sin texto propio
      if (/^consignas de autocontrol/.test(n)) {                        // texto largo pegado en la suboperación
        partirFrases((s.x || '').replace(/^CONSIGNAS DE AUTOCONTROL\s*/i, '')).forEach(t => r.auto.push(t)); return;
      }
      if (/^gama de tareas/.test(n) || /^gama de tareas/.test(norm(s.x))) {
        let tx = (s.x || s.d).replace(/^GAMA DE TAREAS\s*/i, '');
        r.tareas.push({ h: '', i: partirFrases(tx) }); return;
      }
      const tx = (s.x || s.d).trim();
      r.tareas.push({ h: '', i: partirFrases(tx) });                  // suboperación suelta = una tarea
    });
    const dupAuto = new Set(); r.auto = r.auto.filter(t => !dupAuto.has(t) && dupAuto.add(t));
    return r;
  }

  /* ════════ Formato de salida ════════ */
  function marca(i, estilo) { return estilo === 'guion' ? '- ' : estilo === 'simbolo' ? '▪ ' + (i + 1) + ') ' : (i + 1) + ') '; }
  function partir(linea, ancho) {                   // líneas largas: continuación con 2 espacios de sangría
    if (!ancho || linea.length <= ancho) return [linea];
    const out = []; let cur = '';
    linea.split(' ').forEach(w => {
      if ((cur + ' ' + w).trim().length > ancho && cur) { out.push(cur); cur = '  ' + w; } else cur = cur ? cur + ' ' + w : w;
    });
    out.push(cur); return out;
  }
  function opcs() {
    return { estilo: $('gsm-estilo').value, ancho: +$('gsm-ancho').value || 0, seg: $('gsm-seg').value, auto: $('gsm-auto').value,
      frec: $('gsm-frec').value, titulo: $('gsm-titulo').checked, vacias: $('gsm-blank').checked };
  }
  function formatearOp(o, op) {
    const e = estructurar(o), L = [];
    const tl = (o.d || '').trim();
    if (op.titulo) L.push('GAMA DE TAREAS - ' + tl.toUpperCase());
    const seccion = (nombre, arr, modo) => {
      if (!arr.length || modo === 'omitir') return;
      if (modo === 'linea') { L.push(nombre + ': ' + arr.map(x => x.replace(/[.;\s]+$/, '')).join('; ') + '.'); return; }
      L.push(nombre + ':'); arr.forEach((t, i) => L.push(marca(i, op.estilo) + t));
    };
    seccion('SEGURIDAD', e.seg, op.seg);
    e.libre.forEach((t, i) => { if (i === 0) L.push('NOTA:'); L.push(t); });
    const bloques = e.tareas.filter(b => {
      if (op.frec === 'todas') return true;
      const f = fcOf(b.h); return !f || f === op.frec;
    });
    bloques.forEach(b => {
      if (!b.i.length) return;
      const h = tituloFrec(b.h);
      L.push((h || 'TAREAS') + ':');
      b.i.forEach((t, i) => L.push(marca(i, op.estilo) + t));
    });
    seccion('AL FINALIZAR', e.auto, op.auto);
    const flat = []; L.forEach(l => partir(l, op.ancho).forEach(x => flat.push(x)));
    return op.vacias ? flat.join('\n\n') : flat.join('\n');
  }
  /* "MENSUAL:" etc. como primera línea de bloque: una línea en blanco antes da aire visual en SAM. */
  function conAire(txt) { return txt.replace(/\n(?=(?:[A-ZÁÉÍÓÚ ]+:$|AL FINALIZAR:|SEGURIDAD:|NOTA:))/gm, '\n\n').replace(/\n{3,}/g, '\n\n'); }

  function frecsDeRuta(k) {
    const s = new Set(); HDR_GAMAS[k].o.forEach(o => (o.ga || []).forEach(g => { const f = fcOf(g.h); if (f) s.add(f); }));
    return FRECS.map(x => x[0]).filter(f => s.has(f));
  }
  function opsConTexto(k) { return HDR_GAMAS[k].o.filter(o => o.ga || o.sb || o.li); }

  /* ════════ UI ════════ */
  function listar() {
    const q = norm($('gsm-buscar').value).trim();
    const items = Object.keys(HDR_GAMAS).filter(k => opsConTexto(k).length).filter(k => {
      if (!q) return true;
      const h = HDR_GAMAS[k];
      return norm(k + ' ' + h.d).includes(q) || (equiposPorKey[k] || []).some(e => norm(e).includes(q));
    }).sort();
    $('gsm-lista').innerHTML = items.map(k => {
      const h = HDR_GAMAS[k], n = opsConTexto(k).length, ne = (equiposPorKey[k] || []).length;
      return `<button class="gsm-item${k === st.key ? ' on' : ''}" data-k="${esc(k)}"><b>${esc(k)}</b><span>${esc(h.d)}</span>` +
        `<em>${n} oper.${ne ? ' · ' + ne + ' equipos' : ''}</em></button>`;
    }).join('') || '<div class="gsm-vacio">Sin resultados.</div>';
    $('gsm-lista').querySelectorAll('.gsm-item').forEach(b => b.onclick = () => elegir(b.dataset.k));
    $('gsm-cuenta').textContent = items.length + ' hojas de ruta / contadores';
  }
  function elegir(k) {
    st.key = k; st.sel = null;
    const fs = frecsDeRuta(k);
    $('gsm-frec').innerHTML = '<option value="todas">Todas las frecuencias de la operación</option>' + fs.map(f => `<option value="${f}">Solo ${f.toLowerCase()}</option>`).join('');
    const ops = opsConTexto(k);
    $('gsm-ops').innerHTML = ops.map((o, i) => `<button class="gsm-op" data-i="${i}"><b>${esc(o.n)}</b> ${esc(o.d)}` +
      `${o.pq && o.pq.length ? `<em>${esc(o.pq.join(', '))}</em>` : ''}</button>`).join('');
    $('gsm-ops').querySelectorAll('.gsm-op').forEach(b => b.onclick = () => { st.sel = +b.dataset.i; render(); });
    st.ops = ops; st.sel = 0;
    const eq = equiposPorKey[k] || [];
    $('gsm-eq').innerHTML = eq.length ? 'Equipos con esta hoja de ruta: ' + esc(eq.slice(0, 14).join(', ')) + (eq.length > 14 ? ` … (+${eq.length - 14})` : '') : '';
    listar(); render();
  }
  function problemas(txt) {
    const P = [];
    const largas = txt.split('\n').filter(l => l.length > 72).length;
    if (largas) P.push(`${largas} línea(s) superan los 72 caracteres (SAP las parte).`);
    const pegadas = (txt.match(/[a-záéíóú]{2,}\.[A-ZÁÉÍÓÚ]/g) || []).length;
    if (pegadas) P.push(`${pegadas} frase(s) pegadas ("palabra.Otra").`);
    return P;
  }
  function textoActual() {
    if (st.sel == null || !st.ops[st.sel]) return '';
    return conAire(formatearOp(st.ops[st.sel], opcs()));
  }
  function render() {
    $('gsm-ops').querySelectorAll('.gsm-op').forEach((b, i) => b.classList.toggle('on', i === st.sel));
    if (!st.key) { $('gsm-salida').value = ''; return; }
    const txt = textoActual();
    $('gsm-salida').value = txt;
    actualizar();
  }
  function actualizar() {
    const txt = $('gsm-salida').value;
    $('gsm-contador').textContent = txt.length + ' caracteres · ' + (txt ? txt.split('\n').length : 0) + ' líneas';
    const P = problemas(txt);
    $('gsm-alertas').innerHTML = P.length ? P.map(p => `<div class="gsm-warn">⚠ ${esc(p)}</div>`).join('') : (txt ? '<div class="gsm-ok">✓ Sin alertas de formato.</div>' : '');
    /* vista como en SAM: la versión "une renglones" o la normal */
    const join = $('gsm-sim').checked;
    const v = join ? txt.replace(/\n/g, '') : txt;
    $('gsm-vista').innerHTML = esc(v).replace(/\n/g, '<br>') || '<span style="color:#999">Elegí una hoja de ruta</span>';
  }
  async function copiar(txt, btn) {
    try { await navigator.clipboard.writeText(txt); } catch (e) { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    const old = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => btn.textContent = old, 1400);
  }
  function textoRuta(k, op) {
    return opsConTexto(k).map(o => formatearOp(o, op)).map(conAire).join('\n\n' + '-'.repeat(40) + '\n\n');
  }
  function descargarTodo() {
    const op = opcs(), partes = [];
    Object.keys(HDR_GAMAS).sort().forEach(k => {
      opsConTexto(k).forEach(o => {
        partes.push('=== ' + k + ' · ' + HDR_GAMAS[k].d + ' · op ' + o.n + ' ===\n' + conAire(formatearOp(o, op)));
      });
    });
    const blob = new Blob(['﻿' + partes.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gamas-para-sam.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  function init() {
    if (!$('gsm-buscar')) return;
    $('gsm-buscar').oninput = listar;
    ['gsm-estilo', 'gsm-ancho', 'gsm-seg', 'gsm-auto', 'gsm-frec', 'gsm-titulo', 'gsm-blank'].forEach(id => $(id).onchange = render);
    $('gsm-sim').onchange = actualizar;
    $('gsm-salida').oninput = actualizar;
    $('gsm-copiar').onclick = e => copiar($('gsm-salida').value, e.target);
    $('gsm-copiar-ruta').onclick = e => st.key && copiar(textoRuta(st.key, opcs()), e.target);
    $('gsm-descargar').onclick = descargarTodo;
    $('gsm-orig').onclick = () => {
      if (st.sel == null) return;
      const o = st.ops[st.sel];
      const raw = [(o.sb || []).map(s => s.n + ' ' + s.d + '\n' + s.x).join('\n'), (o.ga || []).map(g => g.h + '\n' + g.i.join(' ')).join('\n')].join('\n').trim();
      $('gsm-vista').textContent = raw || '(sin texto)';
    };
    listar();
  }
  init();
  window.gamasSamRender = () => { listar(); };
})();
