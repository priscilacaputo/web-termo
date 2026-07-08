/* ═══════════════════════════════════════════════════════
   OTs Analyzer — Motor de análisis de historial SAP
   ═══════════════════════════════════════════════════════ */

const OTS_STORAGE_KEY = 'termo_ots_v1';

/* ── Palabras clave por nivel ─────────────────────────── */
const KEYWORDS_URGENTE = [
  "no funciona", "fuera de servicio", "no se pudo reparar",
  "sin funcionamiento", "equipo parado", "no opera", "no arranca",
  "correctivo urgente", "falla grave", "avería grave"
];

const KEYWORDS_CORRECTIVO = [
  "requiere cambio", "falta repuesto", "pierde agua",
  "pérdida de refrigerante", "perdida de refrigerante",
  "no enfría", "no enfria", "no calefacciona",
  "ruido anormal", "vibración", "vibracion",
  "se recomienda intervenir", "requiere intervención",
  "requiere intervencion", "falla recurrente",
  "reiteración", "reiteracion", "recurrente",
  "filtra", "gotea", "corrosión", "corrosion",
  "desgaste", "rotura", "roto", "dañado", "dañada"
];

const KEYWORDS_SEGUIMIENTO = [
  "queda pendiente", "pendiente de", "a revisar",
  "se recomienda", "monitorear", "controlar",
  "observar", "verificar", "revisar próximamente",
  "revisar proxim", "seguimiento", "próxima guardia",
  "proxima guardia", "próxima visita"
];

/* ── Aliases de columnas SAP ──────────────────────────── */
const OTS_SAP_ALIASES = {
  equipo:     ["equipo", "número de equipo", "nro equipo", "nro. equipo",
               "objeto técnico", "objeto tecnico", "equipment",
               "cod equipo", "código equipo", "codigo equipo",
               "puesto de trabajo", "ubic. técnica", "ubic. tecnica"],
  ot:         ["ot", "orden", "número de ot", "nro ot", "nro. ot",
               "notificación", "notificacion", "orden de trabajo",
               "número de orden", "numero de orden", "order", "nro orden"],
  fecha:      ["fecha", "fecha de creación", "fecha de creacion",
               "fecha ini.real", "fecha inicio", "fecha real inicio",
               "date", "fecha ejecución", "fecha ejecucion",
               "fecha notif.", "fecha notif", "fecha entrada",
               "fecha de aviso", "fecha de inicio"],
  tiempo:     ["tiempo imputado", "hrs.reales", "horas reales",
               "duración", "duracion", "horas", "tiempo", "hrs",
               "real work", "tiempo real", "hs imputadas",
               "horas imputadas", "cantidad de horas"],
  tecnico:    ["técnico", "tecnico", "nombre", "responsable",
               "ejecutado por", "nombre de técnico", "nombre tecnico",
               "worker", "personal", "operario", "inspector",
               "nombre del técnico", "encargado"],
  comentario: ["comentario", "comentario técnico", "comentario tecnico",
               "texto breve", "descripción", "descripcion",
               "notas", "observaciones", "text", "nota técnica",
               "nota tecnica", "descripción de la tarea",
               "descripcion de la tarea", "resumen", "detalle"]
};

function otsNormalizeHeader(h) {
  return String(h).toLowerCase().trim().replace(/\s+/g, ' ');
}

function mapOTSHeaders(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const norm = otsNormalizeHeader(h);
    for (const [key, aliases] of Object.entries(OTS_SAP_ALIASES)) {
      if (map[key] === undefined && aliases.includes(norm)) {
        map[key] = i;
      }
    }
  });
  return map;
}

/* ── Análisis de comentario individual ─────────────────── */
function analyzeComment(text) {
  if (!text || !text.trim()) return { estado: 'ok', accion: 'Sin observaciones.' };
  const lower = text.toLowerCase();

  for (const kw of KEYWORDS_URGENTE) {
    if (lower.includes(kw)) {
      return {
        estado: 'urgente',
        accion: `Falla crítica detectada: "${kw}". Requiere atención inmediata.`
      };
    }
  }
  for (const kw of KEYWORDS_CORRECTIVO) {
    if (lower.includes(kw)) {
      return {
        estado: 'correctivo',
        accion: `Se detectó: "${kw}". Se recomienda generar OT correctiva.`
      };
    }
  }
  for (const kw of KEYWORDS_SEGUIMIENTO) {
    if (lower.includes(kw)) {
      return {
        estado: 'seguimiento',
        accion: `Indicador de seguimiento: "${kw}". Requiere monitoreo.`
      };
    }
  }
  return { estado: 'ok', accion: 'Sin observaciones relevantes detectadas.' };
}

/* ── Análisis de historial completo por equipo ─────────── */
function analyzeEquipmentHistory(ots) {
  if (!ots || ots.length === 0) {
    return { nivel: 'ok', recomendacion: 'Sin OTs registradas.', urgentes: 0, correctivos: 0, seguimiento: 0, recurrentes: [], tiempoTotal: 0, totalOTs: 0 };
  }

  const urgentes    = ots.filter(o => o.estado === 'urgente').length;
  const correctivos = ots.filter(o => o.estado === 'correctivo').length;
  const seguimiento = ots.filter(o => o.estado === 'seguimiento').length;
  const tiempoTotal = ots.reduce((sum, o) => sum + (parseFloat(o.tiempo) || 0), 0);

  // Detectar palabras clave que se repiten en múltiples OTs
  const kwCount = {};
  const allKW = [...KEYWORDS_URGENTE, ...KEYWORDS_CORRECTIVO, ...KEYWORDS_SEGUIMIENTO];
  ots.forEach(o => {
    const lower = (o.comentario || '').toLowerCase();
    allKW.forEach(kw => {
      if (lower.includes(kw)) kwCount[kw] = (kwCount[kw] || 0) + 1;
    });
  });
  const recurrentes = Object.entries(kwCount)
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1]);

  let nivel = 'ok';
  let recomendacion = 'El equipo no presenta alertas en el período analizado.';

  if (urgentes > 0) {
    nivel = 'urgente';
    recomendacion = `El equipo presenta ${urgentes} OT(s) con fallas críticas. Se requiere intervención inmediata.`;
  } else if (recurrentes.length > 0) {
    nivel = 'correctivo';
    const top = recurrentes.slice(0, 2).map(([kw, n]) => `"${kw}" (${n} veces)`).join(' y ');
    recomendacion = `El equipo presenta reiteración de fallas: ${top}. Se recomienda generar una OT correctiva para diagnóstico integral.`;
  } else if (correctivos >= 2) {
    nivel = 'correctivo';
    recomendacion = `El equipo acumula ${correctivos} OTs con indicadores de falla correctiva. Se recomienda generar OT correctiva.`;
  } else if (correctivos === 1) {
    nivel = 'correctivo';
    recomendacion = 'El equipo presenta una falla que requiere intervención correctiva.';
  } else if (seguimiento > 0) {
    nivel = 'seguimiento';
    recomendacion = `El equipo tiene ${seguimiento} OT(s) con ítems pendientes de seguimiento.`;
  }

  return { nivel, recomendacion, urgentes, correctivos, seguimiento, recurrentes, tiempoTotal, totalOTs: ots.length };
}

/* ── Storage ───────────────────────────────────────────── */
function getOTs() {
  try { return JSON.parse(localStorage.getItem(OTS_STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveOTs(data) {
  localStorage.setItem(OTS_STORAGE_KEY, JSON.stringify(data));
}

function getOTsByEquipo(equipo) {
  return getOTs().filter(o => o.equipo === equipo);
}

function clearOTs() {
  localStorage.removeItem(OTS_STORAGE_KEY);
}

/* ── Labels de estado ──────────────────────────────────── */
const OTS_ESTADO_META = {
  urgente:    { label: 'Urgente',             emoji: '🔴', cls: 'ots-badge-urgente',    color: '#dc2626' },
  correctivo: { label: 'Correctivo sugerido', emoji: '🟠', cls: 'ots-badge-correctivo', color: '#ea580c' },
  seguimiento:{ label: 'Seguimiento',         emoji: '🟡', cls: 'ots-badge-seguimiento',color: '#d97706' },
  ok:         { label: 'OK',                  emoji: '🟢', cls: 'ots-badge-ok',         color: '#10b981' }
};
