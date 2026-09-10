/* ─── Estado de Equipos — overrides manuales y comentarios ───────
   Array disperso: solo aparecen acá los equipos que tienen un estado
   fijado a mano por un administrador, un hidrolavado cargado a mano
   y/o al menos un comentario. Todo equipo que no esté en esta lista
   muestra el estado calculado automáticamente a partir de su última
   OT en el historial.

   `hidrolavadoManual`: fecha (YYYY-MM-DD) del último hidrolavado real
   del equipo. Se usa en la pestaña "Hidrolavado UTA/RTF" cuando la OT
   no quedó bien registrada en el historial. Las fechas de abajo se
   cargaron desde el export SAP de Órdenes de mantenimiento (2026-09-10):
   último hidrolavado por equipo UTA / Roof Top. */

const ESTADO_OVERRIDES = [
  // {
  //   equipo: "AAC1234",
  //   estadoManual: "reparacion",   // "ok" | "atencion" | "reparacion" | "fuera_servicio" | null
  //   hidrolavadoManual: "2026-08-25",
  //   comentarios: [
  //     { autor: "Juan Pérez", texto: "Se pidió el repuesto, llega la semana que viene.", fecha: "2026-07-16T10:30:00.000Z" }
  //   ]
  // },
  { equipo: "AAC2064", hidrolavadoManual: "2026-05-18" },
  { equipo: "AAC2065", hidrolavadoManual: "2026-04-27" },
  { equipo: "AAC2071", hidrolavadoManual: "2026-05-18" },
  { equipo: "AAC2118", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC2119", hidrolavadoManual: "2026-06-10" },
  { equipo: "AAC2120", hidrolavadoManual: "2026-06-18" },
  { equipo: "AAC2121", hidrolavadoManual: "2026-05-26" },
  { equipo: "AAC2127", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2128", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2129", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2130", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2131", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2132", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2133", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2134", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2135", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2138", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2139", hidrolavadoManual: "2026-08-31" },
  { equipo: "AAC2144", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC2145", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC2146", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC2147", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC2167", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2168", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2169", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2170", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2171", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2172", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2173", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2174", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2230", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2231", hidrolavadoManual: "2026-08-25" },
  { equipo: "AAC2262", hidrolavadoManual: "2026-04-20" },
  { equipo: "AAC2263", hidrolavadoManual: "2026-04-20" },
  { equipo: "AAC2735", hidrolavadoManual: "2026-05-18" },
  { equipo: "AAC3479", hidrolavadoManual: "2026-03-09" },
  { equipo: "AAC3820", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3821", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3822", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3823", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3824", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3825", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3826", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3827", hidrolavadoManual: "2026-08-28" },
  { equipo: "AAC3828", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC3829", hidrolavadoManual: "2026-08-27" },
  { equipo: "AAC3832", hidrolavadoManual: "2026-04-20" },
  { equipo: "AAC3834", hidrolavadoManual: "2026-04-27" },
  { equipo: "AAC3838", hidrolavadoManual: "2026-03-02" },
];
