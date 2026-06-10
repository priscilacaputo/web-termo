const CORTINAS_DATA = [
  { equipo:"ACO001", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED5-NIVEL0-UBITEC460", ubi_desc:"Gatera 3"                     },
  { equipo:"ACO014", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED7-NIVEL0-UBITEC041", ubi_desc:"Arribos Internacionales"       },
  { equipo:"ACO021", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED6-NIVEL2-UBITEC156", ubi_desc:"Preembarque Internacional"     },
  { equipo:"ACO022", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED6-NIVEL2-UBITEC156", ubi_desc:"Preembarque Internacional"     },
  { equipo:"ACO023", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED5-NIVEL0-UBITEC465", ubi_desc:"Gatera 4"                     },
  { equipo:"ACO027", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED5-NIVEL0-UBITEC455", ubi_desc:"Gatera 2"                     },
  { equipo:"ACO032", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED5-NIVEL0-UBITEC450", ubi_desc:"Gatera 1"                     },
  { equipo:"ACO035", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO036", denominacion:"Cortina de aire forzado con calefacción",    ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO041", denominacion:"Cortina de aire gatera PM-200",              ubicacion:"AEP-ED5-NIVEL0-UBITEC012", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO042", denominacion:"Cortina de aire gatera PM-300",              ubicacion:"AEP-ED5-NIVEL0-UBITEC012", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO043", denominacion:"Cortina de aire gatera PM-400",              ubicacion:"AEP-ED5-NIVEL0-UBITEC012", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO044", denominacion:"Cortina de aire gatera PM-500",              ubicacion:"AEP-ED5-NIVEL0-UBITEC012", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO051", denominacion:"Cortina aire forzado con calefacción 1",     ubicacion:"AEP-ED4-NIVEL0-UBITEC012", ubi_desc:"Acceso Norte"                  },
  { equipo:"ACO052", denominacion:"Cortina aire forzado con calefacción 2",     ubicacion:"AEP-ED4-NIVEL0-UBITEC012", ubi_desc:"Acceso Norte"                  },
  { equipo:"ACO053", denominacion:"Cortina aire forzado con calefacción 3",     ubicacion:"AEP-ED4-NIVEL0-UBITEC012", ubi_desc:"Acceso Norte"                  },
  { equipo:"ACO054", denominacion:"Cortina aire forzado con calefacción 4",     ubicacion:"AEP-ED4-NIVEL0-UBITEC012", ubi_desc:"Acceso Norte"                  },
  { equipo:"ACO055", denominacion:"Cortina aire forzado con calefacción 1",     ubicacion:"AEP-ED4-NIVEL0-UBITEC013", ubi_desc:"Núcleo Ascensor PB E4 Sur"     },
  { equipo:"ACO056", denominacion:"Cortina aire forzado con calefacción 2",     ubicacion:"AEP-ED4-NIVEL0-UBITEC013", ubi_desc:"Núcleo Ascensor PB E4 Sur"     },
  { equipo:"ACO057", denominacion:"Cortina aire forzado con calefacción 3",     ubicacion:"AEP-ED4-NIVEL0-UBITEC013", ubi_desc:"Núcleo Ascensor PB E4 Sur"     },
  { equipo:"ACO058", denominacion:"Cortina aire forzado con calefacción 4",     ubicacion:"AEP-ED4-NIVEL0-UBITEC013", ubi_desc:"Núcleo Ascensor PB E4 Sur"     },
  { equipo:"ACO059", denominacion:"Cortina aire forzado con calefacción 1",     ubicacion:"AEP-ED5-NIVEL0-UBITEC014", ubi_desc:"Acceso Remoto"                 },
  { equipo:"ACO060", denominacion:"Cortina aire forzado con calefacción 2",     ubicacion:"AEP-ED5-NIVEL0-UBITEC014", ubi_desc:"Acceso Remoto"                 },
  { equipo:"ACO061", denominacion:"Cortina aire forzado con calefacción 3",     ubicacion:"AEP-ED5-NIVEL0-UBITEC014", ubi_desc:"Acceso Remoto"                 },
  { equipo:"ACO062", denominacion:"Cortina aire forzado con calefacción 4",     ubicacion:"AEP-ED5-NIVEL0-UBITEC014", ubi_desc:"Acceso Remoto"                 },
  { equipo:"ACO378", denominacion:"Cortina de aire con calef. 20KW N°1",        ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO379", denominacion:"Cortina de aire con calef. 20KW N°2",        ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO380", denominacion:"Cortina de aire con calef. 20KW N°3",        ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO381", denominacion:"Cortina de aire con calef. 20KW N°4",        ubicacion:"AEP-ED6-NIVEL0-UBITEC060", ubi_desc:"Hall Público Check in"         },
  { equipo:"ACO382", denominacion:"Cortina de aire con calef. 20KW N°1",        ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO383", denominacion:"Cortina de aire con calef. 20KW N°2",        ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO467", denominacion:"Cortina de aire Salida Inter",               ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO468", denominacion:"Cortina aire forzado con calefacción 1",     ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO469", denominacion:"Cortina aire forzado con calefacción 2",     ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO470", denominacion:"Cortina aire forzado con calefacción 3",     ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
  { equipo:"ACO471", denominacion:"Cortina aire forzado con calefacción 4",     ubicacion:"AEP-ED7-NIVEL0-UBITEC065", ubi_desc:"Hall Arribos Internacionales"  },
];

const CORTINAS_PLANES = [
  {
    id: "cortinas-aire",
    denominacion: "Cortinas de Aire",
    equipos: [
      "ACO001","ACO014","ACO021","ACO022","ACO023","ACO027","ACO032",
      "ACO035","ACO036","ACO041","ACO042","ACO043","ACO044",
      "ACO051","ACO052","ACO053","ACO054",
      "ACO055","ACO056","ACO057","ACO058",
      "ACO059","ACO060","ACO061","ACO062",
      "ACO378","ACO379","ACO380","ACO381",
      "ACO382","ACO383","ACO467","ACO468","ACO469","ACO470","ACO471"
    ],
    frecuencias: [
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX", color: "#f59e0b",
        grupos: [
          { nombre: "Tareas", tareas: [
            "Limpieza de Filtros (si posee)",
            "Limpieza interna y externa del gabinete",
            "Control de vibraciones",
            "Verificación estado de rodamientos",
            "Control del desplazamiento axial de las turbinas",
            "Verificación y ajuste de borneras del tablero eléctrico",
            "Control y ajuste de bornera de comando",
            "Verificar protecciones y puesta a tierra",
            "Medir y registrar consumo (A) del motor N°1 - Fase L1",
            "Medir y registrar consumo (A) del motor N°1 - Fase L2",
            "Medir y registrar consumo (A) del motor N°1 - Fase L3",
            "Medir y registrar consumo (A) del motor N°2 - Fase L1",
            "Medir y registrar consumo (A) del motor N°2 - Fase L2",
            "Medir y registrar consumo (A) del motor N°2 - Fase L3",
            "Medir y registrar corriente de resistencia de calefacción (contrastar con chapa característica)"
          ]}
        ]
      }
    ]
  }
];

const CORTINA_A_PLAN = Object.fromEntries(
  CORTINAS_PLANES.flatMap(p => p.equipos.map(eq => [eq, p.id]))
);

/* Grupo de sector para colores y filtro */
function cortinaGrupo(ubi_desc) {
  if (/gatera\s*\d/i.test(ubi_desc))     return "gatera";
  if (/check\s*in/i.test(ubi_desc))      return "checkin";
  if (/internac|preembarque/i.test(ubi_desc)) return "internacional";
  return "acceso";
}

const GRUPO_COLORS_COR = {
  gatera:        "#f59e0b",
  checkin:       "#1a56a4",
  internacional: "#0891b2",
  acceso:        "#10b981",
};

const GRUPO_LABELS_COR = {
  gatera:        "Gatera",
  checkin:       "Check In",
  internacional: "Internacional",
  acceso:        "Acceso",
};
