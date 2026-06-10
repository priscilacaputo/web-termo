const ESCALERAS_DATA = [
  { equipo:"MES101", denominacion:"Escalera Mecánica - Preembarque Inter",     dimension:"", ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"THYSSEN", tipo:"",           ubi_desc:"Migraciones Internacionales" },
  { equipo:"MES104", denominacion:"Escalera Mec - Subida hall 1°P cruzada",    dimension:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"THYSSEN", tipo:"",           ubi_desc:"Hall Público Check in" },
  { equipo:"MES105", denominacion:"Escalera Mec - Bajada hall 1°P cruzada",    dimension:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"THYSSEN", tipo:"",           ubi_desc:"Hall Público Check in" },
  { equipo:"MES107", denominacion:"Escalera Mec - Bajada hall 1°P paralela",   dimension:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"THYSSEN", tipo:"",           ubi_desc:"Hall Público Check in" },
  { equipo:"MES108", denominacion:"Escalera Mec - Subida hall 1°P paralela",   dimension:"", ubicacion:"AEP-ED6-NIVEL0-UBITEC060", fabricante:"THYSSEN", tipo:"",           ubi_desc:"Hall Público Check in" },
  { equipo:"MES117", denominacion:"Escalera Mecánica - Partidas Inter",        dimension:"", ubicacion:"AEP-ED7-NIVEL0-UBITEC049", fabricante:"FUJITEC", tipo:"",           ubi_desc:"Migraciones Internacionales" },
  { equipo:"MES118", denominacion:"Escalera Mecánica Desc - Hall Sur Ed IV",   dimension:"", ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"FUJITEC", tipo:"",           ubi_desc:"Hall Público" },
  { equipo:"MES119", denominacion:"Escalera Mecánica Asc - Hall Norte Ed IV",  dimension:"", ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"FUJITEC", tipo:"",           ubi_desc:"Hall Público" },
  { equipo:"MES120", denominacion:"Escalera Mecánica - Arribos Nacional N°1",  dimension:"", ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"FUJITEC", tipo:"GS8000-HV10", ubi_desc:"Hall Público" },
  { equipo:"MES121", denominacion:"Escalera Mecánica - Arribos Nacional N°2",  dimension:"", ubicacion:"AEP-ED4-NIVEL0-UBITEC105", fabricante:"FUJITEC", tipo:"GS8000-HV10", ubi_desc:"Hall Público" },
];

const ESCALERAS_PLANES = [
  {
    id: "electromecanica",
    denominacion: "Escaleras Mecánicas / Caminos Rodantes",
    escaleras: ["MES101","MES104","MES105","MES107","MES108","MES117","MES118","MES119","MES120","MES121"],
    frecuencias: [
      {
        id: "mensual", label: "MENSUAL", sublabel: "MOEX", color: "#1a56a4",
        grupos: [
          { nombre: "General", tareas: [
            "Condición de funcionamiento: ruido, vibración",
            "Filtraciones de agua",
            "Funcionamiento dispositivos Parada de emergencia",
            "Verificar estado de limpieza exterior",
            "Velocidad del pasamanos respecto al escalón",
            "Tornillos de fijación, tapas, zócalos laterales",
            "Limpieza sala de máquinas superior e inferior"
          ]},
          { nombre: "Sala de Máquinas", tareas: [
            "Limpieza de máquina de propulsión",
            "Limpieza de tablero de control",
            "Funcionamiento correcto del tablero de control",
            "Lubricación de cadenas, engranajes y rodamientos",
            "Puesta a tierra",
            "Funcionamiento de freno"
          ]},
          { nombre: "Embarque", tareas: [
            "Estado de los peines",
            "Iluminación de escalones sup. e inf. pasamanos",
            "Carteles de advertencia"
          ]},
          { nombre: "Escalón", tareas: [
            "Huelgo entre escalón y zócalo"
          ]}
        ]
      },
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX", color: "#f59e0b",
        grupos: [
          { nombre: "Sala de Máquinas", tareas: [
            "Solo ext. Limpieza y lubricación manual cadena tractora",
            "Solo ext. Lubricación en perno de cadena tractora"
          ]}
        ]
      },
      {
        id: "semestral", label: "SEMESTRAL", sublabel: "MOEX", color: "#7c3aed",
        grupos: [
          { nombre: "General", tareas: [
            "Funcionamiento dispositivo de seguridad"
          ]},
          { nombre: "Sala de Máquinas", tareas: [
            "Tensión cadena principal",
            "Tensión cadena escalones",
            "Tensión cadena pasamanos",
            "Mantenimiento del freno",
            "Nivel de aceite máquina y lubricadores"
          ]},
          { nombre: "Embarque", tareas: [
            "Luz entre escalones y peine"
          ]}
        ]
      },
      {
        id: "anual", label: "ANUAL", sublabel: "MOEX", color: "#10b981",
        grupos: [
          { nombre: "General", tareas: [
            "Funcionamiento de rueda de los escalones",
            "Condición ruedas tractoras de los pasamanos",
            "Condición guías de pasamanos",
            "Limpieza y ajuste de guías de escalones",
            "Desgaste de pasamanos"
          ]}
        ]
      }
    ]
  }
];

const ESCALERA_A_PLAN = Object.fromEntries(
  ESCALERAS_PLANES.flatMap(p => p.escaleras.map(eq => [eq, p.id]))
);

const FAB_COLORS_ESCALERAS = {
  THYSSEN: "#1a56a4",
  FUJITEC: "#7c3aed",
};

/* Detecta dirección de la escalera a partir de la denominación */
function escDir(denominacion) {
  const d = denominacion.toLowerCase();
  if (/subida|asc\b/.test(d)) return "subida";
  if (/bajada|desc\b/.test(d)) return "bajada";
  return null;
}
