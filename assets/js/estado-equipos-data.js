/* ─── Estado de Equipos — overrides manuales y comentarios ───────
   Array disperso: solo aparecen acá los equipos que tienen un estado
   fijado a mano por un administrador y/o al menos un comentario. Todo
   equipo que no esté en esta lista muestra el estado calculado
   automáticamente a partir de su última OT en el historial. */

const ESTADO_OVERRIDES = [
  // {
  //   equipo: "AAC1234",
  //   estadoManual: "reparacion",   // "ok" | "atencion" | "reparacion" | "fuera_servicio" | null
  //   comentarios: [
  //     { autor: "Juan Pérez", texto: "Se pidió el repuesto, llega la semana que viene.", fecha: "2026-07-16T10:30:00.000Z" }
  //   ]
  // },
];
