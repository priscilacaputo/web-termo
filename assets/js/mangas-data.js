const MANGAS_DATA = [
  {
    equipo: "MAN005", pos: 3,
    denominacion: "Manga de Embarque POS N°3",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TC 24.5/16.25-2",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN234", pos: 4,
    denominacion: "Manga de Embarque POS N°4",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TB-AD3G#26.0-14.5",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN235", pos: 5,
    denominacion: "Manga de Embarque POS N°5",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TB-AD3G#23.0-13.5",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN008", pos: 6,
    denominacion: "Manga de Embarque POS N°6",
    dimension: "66 KVA / 95 A 400V",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "ADELTE",
    tipo: "PBB-145/240-3CG",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN009", pos: 7,
    denominacion: "Manga de Embarque POS N°7",
    dimension: "70KW / 85A 400V 50HZ",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "TEAM",
    tipo: "PT-145-230 2C",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN010", pos: 8,
    denominacion: "Manga de Embarque POS N°8",
    dimension: "70KW / 85A 400V 50HZ",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "TEAM",
    tipo: "PT-145-230 2C",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN029", pos: 9,
    denominacion: "Manga de Embarque POS N°9",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TC 23.0/13.10-3",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN030", pos: 10,
    denominacion: "Manga de Embarque POS N°10",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TC 23.0/13.10-3",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN011", pos: 11,
    denominacion: "Manga de Embarque POS N°11",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TC 23.0/13.10-3",
    ubi_desc: "Plataforma Comercial"
  },
  {
    equipo: "MAN012", pos: 12,
    denominacion: "Manga de Embarque POS N°12",
    dimension: "",
    ubicacion: "AEP-LAA-UBI017-UBITEC001",
    fabricante: "THYSSEN",
    tipo: "TC 23.0/13.10-3",
    ubi_desc: "Plataforma Comercial"
  }
];

const FAB_COLORS_MANGAS = {
  THYSSEN: "#1a56a4",
  ADELTE:  "#10b981",
  TEAM:    "#f59e0b"
};

const MANGAS_PLANES = [
  {
    id: "adelte-pbb",
    fabricante: "ADELTE",
    tipo: "PBB-145/240-3CG",
    denominacion: "Manga de Embarque hidráulica ADELTE",
    mangas: ["MAN008"],
    frecuencias: [
      {
        id: "diaria",
        label: "DIARIA",
        color: "#1a56a4",
        grupos: [
          {
            nombre: "General",
            tareas: [
              "Inspección visual exterior de reflectores y balizas.",
              "Inspección visual exterior del tren de ruedas.",
              "Inspección visual exterior de pasarela, rotonda y cabina.",
              "Inspección visual exterior de vidrios.",
              "Inspección visual exterior de persianas.",
              "Inspección visual exterior de bandeja portacables.",
              "Inspección visual exterior de pórtico y columnas de elevación.",
              "Inspección visual exterior de fuelle.",
              "Inspección visual exterior de ruedas de escalera de servicio.",
              "Inspección visual exterior de escalera de servicio.",
              "Inspección visual exterior de puerta de servicio.",
              "Inspección visual exterior de central hidráulica.",
              "Inspección visual interior de carpintería.",
              "Inspección visual interior de pisos.",
              "Inspección visual interior de limpieza."
            ]
          },
          {
            nombre: "Tablero Principal",
            tareas: [
              "Inspección visual general.",
              "Verificar estado de señales visuales y mensajes informativos.",
              "Verificar ausencia de alarmas en PLC.",
              "Verificar condición normal de UPS."
            ]
          },
          {
            nombre: "Panel de Control",
            tareas: [
              "Inspección general visual.",
              "Verificar estado de señales visuales y sonoras en pantalla.",
              "Comprobar funcionamiento de HMI, llaves, botones, selectores, luces piloto y timbres.",
              "Comprobar estado de balizas del fuelle.",
              "Comprobar funcionamiento de luces de movimiento.",
              "Comprobar funcionamiento de señales acústicas exteriores.",
              "Comprobar sincronización del reloj digital NTP.",
              "Comprobar funcionamiento de luces de emergencia (resetear línea de emergencia)."
            ]
          },
          {
            nombre: "Servicios Generales",
            tareas: [
              "Comprobar funcionamiento de luz interna.",
              "Comprobar funcionamiento de luz de emergencia.",
              "Comprobar funcionamiento de luz externa.",
              "Comprobar funcionamiento de luz de escalera de servicio."
            ]
          },
          {
            nombre: "Grupo de Traslación",
            tareas: [
              "Prueba de funcionamiento verificando ausencia de fricción, ruidos anormales y alarmas.",
              "Verificar funcionamiento de avisos visuales y sonoros."
            ]
          },
          {
            nombre: "Rotación de Rotonda",
            tareas: [
              "Comprobar funcionamiento verificando ausencia de fricción o ruidos anormales.",
              "Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites."
            ]
          },
          {
            nombre: "Extensión de Túneles",
            tareas: [
              "Comprobar funcionamiento verificando ausencia de fricción, ruidos anormales y alarmas.",
              "Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites."
            ]
          },
          {
            nombre: "Bandeja de Cables",
            tareas: [
              "Verificar ausencia de fricción o ruidos anormales durante desplazamiento."
            ]
          },
          {
            nombre: "Elevación Hidráulica",
            tareas: [
              "Prueba de funcionamiento verificando ausencia de roces, ruidos anormales y alarmas."
            ]
          },
          {
            nombre: "Rotación de Cabina",
            tareas: [
              "Prueba de funcionamiento verificando ausencia de fricción y ruidos anormales.",
              "Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites."
            ]
          },
          {
            nombre: "Plataforma de Nivelación",
            tareas: [
              "Prueba de funcionamiento verificando ausencia de fricción y ruidos anormales."
            ]
          },
          {
            nombre: "Brazo Autonivelador",
            tareas: [
              "Colocar en modo autonivel y verificar extensión del brazo."
            ]
          },
          {
            nombre: "Fuelle",
            tareas: [
              "Desplegar fuelle verificando ausencia de ruidos y vibraciones extrañas.",
              "Comprobar que al alcanzar los límites de carrera (+) y (−) el movimiento se detiene."
            ]
          },
          {
            nombre: "Puerta Frontal",
            tareas: [
              "Verificar funcionamiento e imposibilidad de operar la manga con la puerta abierta."
            ]
          },
          {
            nombre: "Cierre",
            tareas: [
              "Notificar OT indicando novedades halladas; de lo contrario informar \"Sin Novedades\"."
            ]
          }
        ]
      },
      {
        id: "mensual",
        label: "MENSUAL",
        color: "#10b981",
        grupos: [
          {
            nombre: "General",
            tareas: [
              "Verificar y registrar horas de funcionamiento."
            ]
          },
          {
            nombre: "Tableros Eléctricos",
            tareas: [
              "Verificar limpieza interna.",
              "Verificar estado de dibujos técnicos dentro del armario.",
              "Verificar estado de cerraduras de puertas."
            ]
          },
          {
            nombre: "Panel de Control",
            tareas: [
              "Inspección visual general.",
              "Comprobar historial de mensajes y alarmas."
            ]
          },
          {
            nombre: "Grupo de Traslación",
            tareas: [
              "Verificar estado de carteles informativos y señales visuales."
            ]
          },
          {
            nombre: "Elevación Hidráulica",
            tareas: [
              "Inspección visual del tablero de central hidráulica.",
              "Verificar limpieza interior.",
              "Verificar estado de carteles informativos y señalizaciones.",
              "Verificar estado de esquemas dentro del tablero.",
              "Verificar estado de cierre de puertas."
            ]
          },
          {
            nombre: "Rotación de Cabina",
            tareas: [
              "Comprobar sensores y funcionamiento de finales de carrera."
            ]
          },
          {
            nombre: "Plataforma de Nivelación",
            tareas: [
              "Inspección visual general.",
              "Prueba de funcionamiento.",
              "Comprobar sensores y finales de carrera.",
              "Comprobar sensor de inclinación.",
              "Comprobar límites internos de carrera."
            ]
          },
          {
            nombre: "Brazo Autonivelador",
            tareas: [
              "Inspección visual general.",
              "Comprobar sensores y finales de carrera."
            ]
          },
          {
            nombre: "Fuelle",
            tareas: [
              "Verificar ausencia de filtraciones y estado de apoyo sobre fuselaje."
            ]
          },
          {
            nombre: "Escaleras de Servicio",
            tareas: [
              "Verificar estado de señalización."
            ]
          },
          {
            nombre: "Lamas de Persianas",
            tareas: [
              "Inspección visual general.",
              "Prueba de funcionamiento verificando ausencia de fricción y ruidos anormales."
            ]
          },
          {
            nombre: "Cierre",
            tareas: [
              "Notificar OT indicando novedades halladas; de lo contrario informar \"Sin Novedades\"."
            ]
          }
        ]
      }
    ]
  }
];

const MANGA_A_PLAN = {
  "MAN008": "adelte-pbb"
};
