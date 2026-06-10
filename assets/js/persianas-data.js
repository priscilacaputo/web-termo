const PERSIANAS_DATA = [
  { equipo:"MCD100", denominacion:"Persiana de gatera PM-200",         ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD101", denominacion:"Persiana de gatera PM-300",         ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD102", denominacion:"Persiana de gatera PM-400",         ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD103", denominacion:"Persiana de gatera PM-500",         ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD110", denominacion:"Persiana de gatera PM-3003",        ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD111", denominacion:"Persiana de gatera PM-3004",        ubicacion:"AEP-ED6-NIVEL0-UBITEC062", ubi_desc:"Check In Edificio VI"  },
  { equipo:"MCD112", denominacion:"Persiana gatera Sur Cinta 1 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD113", denominacion:"Persiana gatera Norte Cinta 1 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD114", denominacion:"Persiana gatera Sur Cinta 2 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD115", denominacion:"Persiana gatera Norte Cinta 2 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD116", denominacion:"Persiana gatera Sur Cinta 3 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD117", denominacion:"Persiana gatera Norte Cinta 3 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD118", denominacion:"Persiana gatera Sur Cinta 4 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD119", denominacion:"Persiana gatera Norte Cinta 4 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD120", denominacion:"Persiana gatera Sur Cinta 5 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD121", denominacion:"Persiana gatera Norte Cinta 5 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD122", denominacion:"Persiana gatera Sur Cinta 6 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD123", denominacion:"Persiana gatera Norte Cinta 6 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD124", denominacion:"Persiana gatera Sur Cinta 7 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD125", denominacion:"Persiana gatera Norte Cinta 7 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD126", denominacion:"Persiana gatera Sur Cinta 8 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD127", denominacion:"Persiana gatera Norte Cinta 8 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD128", denominacion:"Persiana gatera Sur Cinta 9 Nac",   ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD129", denominacion:"Persiana gatera Norte Cinta 9 Nac", ubicacion:"AEP-ED4-NIVEL0-UBITEC137", ubi_desc:"Arribos Nacionales"    },
  { equipo:"MCD130", denominacion:"Persiana gatera Sur Cinta 1 Inter",  ubicacion:"AEP-ED6-NIVEL0-UBITEC505", ubi_desc:"Cinta Arribos Int 1"  },
  { equipo:"MCD131", denominacion:"Persiana gatera Norte Cinta 1 Inter",ubicacion:"AEP-ED6-NIVEL0-UBITEC505", ubi_desc:"Cinta Arribos Int 1"  },
  { equipo:"MCD132", denominacion:"Persiana gatera Sur Cinta 2 Inter",  ubicacion:"AEP-ED6-NIVEL0-UBITEC513", ubi_desc:"Cinta Arribos Int 2"  },
  { equipo:"MCD133", denominacion:"Persiana gatera Norte Cinta 2 Inter",ubicacion:"AEP-ED6-NIVEL0-UBITEC513", ubi_desc:"Cinta Arribos Int 2"  },
  { equipo:"MCD134", denominacion:"Persiana gatera Sur Cinta 3 Inter",  ubicacion:"AEP-ED6-NIVEL0-UBITEC521", ubi_desc:"Cinta Arribos Int 3"  },
  { equipo:"MCD135", denominacion:"Persiana gatera Norte Cinta 3 Inter",ubicacion:"AEP-ED6-NIVEL0-UBITEC521", ubi_desc:"Cinta Arribos Int 3"  },
];

const PERSIANAS_PLANES = [
  {
    id: "gateras",
    denominacion: "Persianas de Gateras",
    equipos: [
      "MCD100","MCD101","MCD102","MCD103","MCD110","MCD111",
      "MCD112","MCD113","MCD114","MCD115","MCD116","MCD117",
      "MCD118","MCD119","MCD120","MCD121","MCD122","MCD123",
      "MCD124","MCD125","MCD126","MCD127","MCD128","MCD129",
      "MCD130","MCD131","MCD132","MCD133","MCD134","MCD135"
    ],
    frecuencias: [
      {
        id: "trimestral", label: "TRIMESTRAL", sublabel: "MOEX", color: "#f59e0b",
        grupos: [
          { nombre: "Tareas", tareas: [
            "Verificar estado de láminas de cortina",
            "Verificar alineación y ajuste de fotocélula y reflectivo",
            "Verificar correcto accionamiento de switch de tope superior e inferior, en caso necesario ajustar",
            "Subir y bajar cortina en forma manual",
            "Limpieza y lubricación de guías",
            "Ajuste y limpieza de cobertor superior"
          ]}
        ]
      }
    ]
  }
];

const PERSIANA_A_PLAN = Object.fromEntries(
  PERSIANAS_PLANES.flatMap(p => p.equipos.map(eq => [eq, p.id]))
);

/* Sector a partir de ubi_desc */
function persSector(ubi_desc) {
  if (ubi_desc.includes("Check In"))  return "checkin";
  if (ubi_desc.includes("Nacional"))  return "nacional";
  return "internacional";
}

/* Posición (Norte/Sur) desde la denominación */
function persPos(denominacion) {
  if (/\bSur\b/i.test(denominacion))   return "sur";
  if (/\bNorte\b/i.test(denominacion)) return "norte";
  return null;
}

const SECTOR_COLORS_PERS = {
  checkin:       "#1a56a4",
  nacional:      "#7c3aed",
  internacional: "#0891b2",
};

const SECTOR_LABELS_PERS = {
  checkin:       "Check In Ed. VI",
  nacional:      "Arribos Nacionales",
  internacional: "Arribos Int.",
};
