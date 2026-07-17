/* ═══════════════════════════════════════════════════════
   OTs Analyzer — Motor de análisis de historial SAP
   ═══════════════════════════════════════════════════════ */

const OTS_STORAGE_KEY = 'termo_ots_v2';

/* ── Palabras clave por nivel ─────────────────────────── */
const KEYWORDS_URGENTE = [
  "no funciona","fuera de servicio","no se pudo reparar",
  "sin funcionamiento","equipo parado","no opera","no arranca",
  "falla grave","avería grave","averia grave",
  "no se puede reparar","imposible reparar","sin reparar",
  "bajó a tierra","bajo a tierra","riesgo","peligro"
];

const KEYWORDS_CORRECTIVO = [
  "requiere cambio","falta repuesto","pierde agua",
  "pérdida de refrigerante","perdida de refrigerante",
  "no enfría","no enfria","no calefacciona",
  "ruido anormal","vibración","vibracion",
  "requiere intervención","requiere intervencion",
  "falla recurrente","reiteración","reiteracion","recurrente",
  "filtra","gotea","corrosión","corrosion",
  "desgaste","rotura","roto","dañado","dañada",
  "detectó falla","detecto falla","falla detectada",
  "requiere reparación","requiere reparacion",
  "botonera","sensor defectuoso","sensor dañado",
  "falta de frío","falta de frio","sin frío","sin frio",
  "no cierra","no abre","atascado","trabado","bloqueado",
  "sobrecalent","overload","falla electr","cortocircuito"
];

const KEYWORDS_SEGUIMIENTO = [
  "queda pendiente","pendiente de","a revisar",
  "se recomienda","monitorear","controlar",
  "observar","verificar","revisar próximamente","revisar proxim",
  "seguimiento","próxima guardia","proxima guardia",
  "próxima visita","próximo preventivo","proximo preventivo",
  "novedad","con novedad","pendiente por",
  "se detectó","se detecto","posible falla","intermitente"
];

/* ── Extractores SAP ──────────────────────────────────── */
function extractOTNum(orden) {
  const m = String(orden).match(/\((\d+)\)\s*$/);
  return m ? m[1] : String(orden).trim();
}

function extractOTName(orden) {
  const m = String(orden).match(/^(.*?)\s*\(\d+\)\s*$/);
  return m ? m[1].trim() : String(orden).trim();
}

function extractEquipoCode(objTecnico) {
  const s = String(objTecnico || '');
  const m = s.match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim().toUpperCase() : s.trim().toUpperCase();
}

function extractEquipoDesc(objTecnico) {
  const s = String(objTecnico || '');
  const m = s.match(/^(.*?)\s*\([^)]+\)\s*$/);
  return m ? m[1].trim() : s.trim();
}

function extractTecnicoName(numPersonal) {
  const s = String(numPersonal || '');
  const m = s.match(/^(.*?)\s*\(\d+\)\s*$/);
  return m ? m[1].trim() : s.trim();
}

function detectTipoOT(otNombre) {
  const up = String(otNombre || '').toUpperCase().trimStart();
  if (up.startsWith('MP ') || up === 'MP' ||
      up.startsWith('TAREAS') || up.startsWith('RECORRIDA') ||
      up.startsWith('HIDROLAVAR') || up.startsWith('LUBRIC')) {
    return 'preventivo';
  }
  if (up.startsWith('ATENCION') || up.startsWith('ATENCIÓN') ||
      up.startsWith('REPARAR')  || up.startsWith('RECLAMOS') ||
      up.startsWith('REVISAR')  || up.startsWith('SETEO')    ||
      up.startsWith('CORRECTIVO') || up.startsWith('EMERGENCIA') ||
      up.startsWith('IP ')      || up.startsWith('FALLA')    ||
      up.startsWith('CAMBIO')) {
    return 'correctivo';
  }
  return 'otro';
}

/* ── Análisis de comentario ─────────────────────────────── */
function analyzeComment(text, motivo, tipo, otNombre) {
  const lower    = (text     || '').toLowerCase();
  const motivoLow= (motivo   || '').toLowerCase();
  const nombreLow= (otNombre || '').toLowerCase();

  /* "Seteo de equipos" — tarea de configuración, no es una falla: siempre OK. */
  if (lower.includes('seteo de equipos') || nombreLow.includes('seteo de equipos')) {
    return { estado:'ok', accion:'Seteo de equipos — tarea de configuración, sin falla.' };
  }

  if (motivoLow.includes('no resuelto')) {
    return { estado:'urgente',    accion:'No resuelto según SAP. Requiere atención inmediata.' };
  }
  if (motivoLow.includes('pendiente')) {
    return { estado:'seguimiento', accion:`Pendiente: "${motivo}". Requiere seguimiento.` };
  }
  if (motivoLow.includes('novedades')) {
    return { estado:'seguimiento', accion:'Resuelto con novedades. Monitorear evolución.' };
  }

  for (const kw of KEYWORDS_URGENTE) {
    if (lower.includes(kw))
      return { estado:'urgente',    accion:`Falla crítica detectada: "${kw}". Requiere atención inmediata.` };
  }
  for (const kw of KEYWORDS_CORRECTIVO) {
    if (lower.includes(kw))
      return { estado:'correctivo', accion:`Se detectó: "${kw}". Se recomienda generar OT correctiva.` };
  }
  for (const kw of KEYWORDS_SEGUIMIENTO) {
    if (lower.includes(kw))
      return { estado:'seguimiento', accion:`Indicador: "${kw}". Requiere monitoreo.` };
  }

  if (tipo === 'correctivo') {
    return { estado:'seguimiento', accion:'OT correctiva registrada. Verificar cierre y resolución.' };
  }
  return { estado:'ok', accion:'Sin observaciones relevantes detectadas.' };
}

/* ── Análisis por equipo ────────────────────────────────── */
function analyzeEquipmentHistory(ots) {
  const empty = { nivel:'ok', recomendacion:'Sin OTs registradas.',
    urgentes:0, correctivos:0, seguimiento:0, recurrentes:[],
    tiempoTotal:0, totalOTs:0, totalPreventivos:0, totalCorrectivos:0 };
  if (!ots || ots.length === 0) return empty;

  const urgentes         = ots.filter(o => o.estado === 'urgente').length;
  const correctivos      = ots.filter(o => o.estado === 'correctivo').length;
  const seguimiento      = ots.filter(o => o.estado === 'seguimiento').length;
  const tiempoTotal      = ots.reduce((s,o) => s + (parseFloat(o.tiempo)||0), 0);
  const totalPreventivos = ots.filter(o => o.tipo === 'preventivo').length;
  const totalCorrectivos = ots.filter(o => o.tipo === 'correctivo').length;

  /* Detectar fallas repetidas en comentarios */
  const kwCount = {};
  const allKW   = [...KEYWORDS_URGENTE, ...KEYWORDS_CORRECTIVO, ...KEYWORDS_SEGUIMIENTO];
  ots.forEach(o => {
    const lower = (o.comentario||'').toLowerCase();
    allKW.forEach(kw => { if (lower.includes(kw)) kwCount[kw] = (kwCount[kw]||0)+1; });
  });
  const recurrentes = Object.entries(kwCount)
    .filter(([,n]) => n >= 2)
    .sort((a,b) => b[1]-a[1]);

  let nivel = 'ok';
  let recomendacion = 'El equipo no presenta alertas en el período analizado.';

  if (urgentes > 0) {
    nivel = 'urgente';
    recomendacion = `El equipo presenta ${urgentes} OT(s) con fallas críticas. Se requiere intervención inmediata.`;
  } else if (recurrentes.length > 0) {
    nivel = 'correctivo';
    const top = recurrentes.slice(0,2).map(([kw,n])=>`"${kw}" (${n} veces)`).join(' y ');
    recomendacion = `El equipo presenta reiteración de fallas: ${top}. Se recomienda generar una OT correctiva para diagnóstico integral.`;
  } else if (totalCorrectivos >= 3) {
    nivel = 'correctivo';
    recomendacion = `El equipo registra ${totalCorrectivos} OTs correctivas en el período. Evaluar si corresponde intervención de mayor envergadura.`;
  } else if (correctivos >= 2) {
    nivel = 'correctivo';
    recomendacion = `El equipo acumula ${correctivos} OTs con indicadores de falla correctiva. Se recomienda generar OT correctiva.`;
  } else if (correctivos === 1 || totalCorrectivos >= 2) {
    nivel = 'correctivo';
    recomendacion = 'El equipo presenta fallas que requieren intervención correctiva.';
  } else if (seguimiento > 0) {
    nivel = 'seguimiento';
    recomendacion = `El equipo tiene ${seguimiento} OT(s) con ítems pendientes de seguimiento.`;
  }

  return { nivel, recomendacion, urgentes, correctivos, seguimiento,
    recurrentes, tiempoTotal, totalOTs:ots.length, totalPreventivos, totalCorrectivos };
}

/* ── Storage + Merge ────────────────────────────────────── */
function getOTs() {
  try { return JSON.parse(localStorage.getItem(OTS_STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveOTs(data) {
  try {
    localStorage.setItem(OTS_STORAGE_KEY, JSON.stringify(data));
  } catch(e) {
    if (e.name === 'QuotaExceededError') {
      alert('El almacenamiento local está lleno. Limpiá los datos existentes antes de cargar un archivo nuevo.');
    } else throw e;
  }
}

/* Combina las OTs existentes con las nuevas.
   Las nuevas reemplazan por ot_num, las viejas que no estén en el
   nuevo archivo se conservan. */
function mergeOTs(existing, incoming) {
  const byKey = {};
  existing.forEach(o => { byKey[o.ot_num || o.ot || Math.random()] = o; });
  incoming.forEach(o => { byKey[o.ot_num] = o; });
  return Object.values(byKey);
}

function getOTsByEquipo(equipo) {
  return getOTs().filter(o => o.equipo === equipo);
}

function clearOTs() {
  localStorage.removeItem(OTS_STORAGE_KEY);
}

/* ── Metadatos de estado / tipo ─────────────────────────── */
const OTS_ESTADO_META = {
  urgente:    { label:'Urgente',             emoji:'🔴', cls:'ots-badge-urgente',    color:'#dc2626' },
  correctivo: { label:'Correctivo sugerido', emoji:'🟠', cls:'ots-badge-correctivo', color:'#ea580c' },
  seguimiento:{ label:'Seguimiento',         emoji:'🟡', cls:'ots-badge-seguimiento',color:'#d97706' },
  ok:         { label:'OK',                  emoji:'🟢', cls:'ots-badge-ok',         color:'#10b981' }
};

const OTS_TIPO_META = {
  preventivo: { label:'Preventivo', emoji:'🛡', cls:'ots-tipo-prev', color:'#1a56a4' },
  correctivo: { label:'Correctivo', emoji:'🔧', cls:'ots-tipo-corr', color:'#9a3412' },
  otro:       { label:'Otro',       emoji:'📌', cls:'ots-tipo-otro', color:'#6b7280' }
};

/* ── Estado efectivo (manual > automático) ──────────────── */
function getEffectiveEstado(o) {
  return o.estado_manual || o.estado;
}

/* ── Override manual de una OT ─────────────────────────── */
function updateOTManual(ot_num, changes) {
  const all = getOTs();
  const idx = all.findIndex(o => (o.ot_num || o.ot) === String(ot_num));
  if (idx === -1) return false;
  Object.assign(all[idx], changes);
  saveOTs(all);
  return true;
}

/* ── Persistencia en servidor (GitHub vía API) ──────────── */
function decompressOT(r) {
  return {
    ot_num:      r.n,
    ot:          r.n,
    ot_nombre:   r.on || '',
    tipo:        r.t === 'p' ? 'preventivo' : r.t === 'c' ? 'correctivo' : 'otro',
    equipo:      r.e,
    equipo_desc: '',
    fecha:       r.f,
    tecnico:     r.tc,
    tiempo:      r.h,
    comentario:  r.c,
    motivo:      '',
    estado_orden:'',
    estado:      r.s,
    accion:      r.a,
    ...(r.sm ? { estado_manual: r.sm } : {}),
    ...(r.nn ? { nota_manual:   r.nn } : {}),
    ...(r.fr ? { fecha_revision:r.fr } : {}),
  };
}

async function loadOTsFromServer() {
  try {
    const resp = await fetch('/data/ots-historico.json?t=' + Date.now());
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const data = await resp.json();
    if (!data.ots || !Array.isArray(data.ots) || data.ots.length === 0) return null;
    return data.ots.map(decompressOT);
  } catch(e) {
    console.warn('No se pudo cargar desde servidor:', e.message);
    return null;
  }
}

async function saveOTsToServer(password) {
  const ots = getOTs();
  if (!ots.length) return { ok: false, error: 'No hay datos para guardar.' };
  try {
    const resp = await fetch('/api/save-ots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, ots })
    });
    const json = await resp.json();
    if (!resp.ok) return { ok: false, error: (json.error || 'Error ' + resp.status) + (json.detail ? ': ' + json.detail : '') };
    return { ok: true, total: json.total };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}
