/* ────────────────────────────────────────────────────────
   PLAN PREVENTIVO — MANTENIMIENTO MENSUAL (CALENDARIO)
   Aplica a todos los vehículos operativos
──────────────────────────────────────────────────────── */
const MANT_CALENDARIO = [
  "Visualizar el kilometraje y registrar",
  "Visualizar nivel de combustible y registrar [Referencia: 0%; 25%; 50%; 75%; 100%]",
  "Verificar estado de neumáticos (banda de rodadura, flanco, hombro, talón, etc.) y si presenta desgaste desparejo (lado interno, centro y lado externo de la banda de rodadura)",
  "Medir espesor del neumático en banda de rodadura central, rueda delantera izquierda [Ref. > 1,6 mm]",
  "Medir espesor del neumático en banda de rodadura central, rueda delantera derecha [Ref. > 1,6 mm]",
  "Medir espesor del neumático en banda de rodadura central, rueda trasera izquierda [Ref. > 1,6 mm]",
  "Medir espesor del neumático en banda de rodadura central, rueda trasera derecha [Ref. > 1,6 mm]",
  "Verificar encendido luces e inspeccionar su estado",
  "Verificar encendido balizas e inspeccionar su estado",
  "Verificar estado de la bocina",
  "Verificar estado de los matafuegos con su correspondiente soporte",
  "Verificar funcionamiento radiofrecuencia (Vehículo Operaciones)",
  "Verificar nivel de líquido freno. Completar de ser necesario.",
  "Verificar nivel de líquido refrigerante. Completar de ser necesario.",
  "Verificar nivel de aceite de dirección hidráulica. Completar de ser necesario.",
  "Verificar nivel de aceite del motor. Completar de ser necesario.",
  "Verificar estado general (carrocería, interior) y relevar novedades.",
  "Realizar el lavado exterior del vehículo con agua y jabón",
  "Retirar residuos, envoltorios, polvos y demás elementos ajenos al automóvil.",
  "Si se posee aspiradora, realizar aspirado del interior, baúl o caja del vehículo"
];

/* ────────────────────────────────────────────────────────
   PLANES POR KM  (cada modelo tiene sus intervalos)
──────────────────────────────────────────────────────── */
const MANT_KM = [
  {
    id: "hilux24",
    modelo: "TOYOTA HILUX 2.4L TDI 150 CV 4X4 D/C DX 6M/T",
    condicion: "A1 – Conducción por rutas abruptas, con barro o nieve derretida",
    vehiculos: ["AVO024","AVO356","AVO472","AVO473","AVO474","AVO475","AVO479"],
    intervalos: [
      {
        km: 5000,
        tareas: [
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Filtro del depurador de Aire",
          "Chasis y Carrocería: Inspeccionar pastillas y discos de freno",
          "Chasis y Carrocería: Inspeccionar volante, varillaje de dirección y caja de engranajes de dirección",
          "Chasis y Carrocería: Lubricar con grasa los árboles de transmisión (incluido el apriete de los pernos)"
        ]
      },
      {
        km: 10000,
        tareas: [
          "Componentes básicos del motor: Reemplazar aceite de motor",
          "Componentes básicos del motor: Reemplazar filtro de aceite del motor",
          "Sistema de Encendido: Inspeccionar batería",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Sedimentador de Agua",
          "Chasis y Carrocería: Inspeccionar pedal de freno y freno de estacionamiento",
          "Chasis y Carrocería: Inspeccionar campanas y zapatas de frenos (incluidas las de freno de estacionamiento)",
          "Chasis y Carrocería: Inspeccionar líquido de frenos",
          "Chasis y Carrocería: Inspeccionar líquido del embrague",
          "Chasis y Carrocería: Inspeccionar tuberías y mangueras de frenos",
          "Chasis y Carrocería: Inspeccionar líquido de la servodirección",
          "Chasis y Carrocería: Inspeccionar fundas del árbol de transmisión (modelos 4WD)",
          "Chasis y Carrocería: Inspeccionar juntas esféricas de la suspensión y cubierta antipolvo",
          "Chasis y Carrocería: Inspeccionar suspensiones delantera y trasera",
          "Chasis y Carrocería: Inspeccionar neumáticos y presión de inflado",
          "Chasis y Carrocería: Inspeccionar todas las luces, bocina, limpiaparabrisas y lavaparabrisas",
          "Chasis y Carrocería: Apriete de los pernos y las tuercas del chasis y la carrocería"
        ]
      },
      {
        km: 20000,
        tareas: [
          "Componentes básicos del motor: Inspeccionar la correa de transmisión (auxiliar) [1ª inspección a los 100.000 km, luego cada 20.000 km]",
          "Componentes básicos del motor: Inspeccionar tubos de escape y soportes de montaje",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Manguera de aceite de la bomba de vacío",
          "Chasis y Carrocería: Inspeccionar aceite de engranaje diferencial delantero (4WD) y trasero",
          "Chasis y Carrocería: Reemplazar filtro de aire acondicionado",
          "Chasis y Carrocería: Inspeccionar cantidad de refrigerante del aire acondicionado"
        ]
      },
      {
        km: 30000,
        tareas: [
          "Sistema de Combustible y Control de Emisiones: Reemplazar Filtro de Aire"
        ]
      },
      {
        km: 40000,
        tareas: [
          "Componentes básicos del motor: Inspeccionar sistema de refrigeración y calefacción [después de los 80.000 km realizarlo cada 20.000 km]",
          "Componentes básicos del motor: Inspeccionar el refrigerante del motor e intercooler",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Humo Diésel",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar tapón del depósito de combustible, tuberías, conexiones y válvula de control del vapor de combustible [después de los 80.000 km realizarlo cada 20.000 km]",
          "Chasis y Carrocería: Reemplazar líquido de frenos",
          "Chasis y Carrocería: Inspeccionar líquido de la transmisión automática",
          "Chasis y Carrocería: Inspeccionar Mangueras y conexiones de enfriador del líquido de transmisión automática (Transm. Autom. 6 vel.)",
          "Chasis y Carrocería: Inspeccionar aceite de la transmisión manual",
          "Chasis y Carrocería: Reemplazar aceite de transferencia (modelos 4WD)",
          "Chasis y Carrocería: Reemplazar aceite de engranaje diferencial delantero (4WD) y trasero"
        ]
      },
      {
        km: 160000,
        tareas: [
          "Componentes básicos del motor: Reemplazar el refrigerante del motor e intercooler [después de los 160.000 km realizarlo cada 80.000 km]"
        ]
      },
      {
        km: 200000,
        tareas: [
          "Chasis y Carrocería: Inspeccionar bomba de vacío para el servofreno (sustituir las paletas, nunca reutilizar las antiguas)"
        ]
      }
    ]
  },
  {
    id: "hilux25",
    modelo: "TOYOTA HILUX 2.5L TDI 140 CV 4X4 D/C DX",
    condicion: "Normal",
    vehiculos: ["AVO017","AVO019","AVO020","AVO021","AVO022","AVO304"],
    intervalos: [
      {
        km: 5000,
        tareas: [
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Filtro de Aire"
        ]
      },
      {
        km: 10000,
        tareas: [
          "Componentes básicos del motor: Reemplazar aceite de motor",
          "Componentes básicos del motor: Reemplazar filtro de aceite del motor",
          "Sistema de Encendido: Inspeccionar batería",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Sedimentador de Agua",
          "Chasis y Carrocería: Inspeccionar pedal de freno y freno de estacionamiento",
          "Chasis y Carrocería: Inspeccionar pastillas y discos de freno",
          "Chasis y Carrocería: Inspeccionar líquido de frenos",
          "Chasis y Carrocería: Inspeccionar líquido del embrague",
          "Chasis y Carrocería: Inspeccionar líquido de la servodirección",
          "Chasis y Carrocería: Lubricar con grasa los árboles de transmisión (incluido el apriete de los pernos)",
          "Chasis y Carrocería: Inspeccionar juntas esféricas de la suspensión y cubierta antipolvo",
          "Chasis y Carrocería: Inspeccionar neumáticos y presión de inflado",
          "Chasis y Carrocería: Inspeccionar todas las luces, bocina, limpiaparabrisas y lavaparabrisas"
        ]
      },
      {
        km: 20000,
        tareas: [
          "Componentes básicos del motor: Inspeccionar la correa de transmisión (auxiliar) [1ª inspección a los 100.000 km, luego cada 20.000 km]",
          "Componentes básicos del motor: Inspeccionar tubos de escape y soportes de montaje",
          "Chasis y Carrocería: Inspeccionar campanas y zapatas de frenos (incluidas las de freno de estacionamiento)",
          "Chasis y Carrocería: Inspeccionar tuberías y mangueras de frenos",
          "Chasis y Carrocería: Inspeccionar volante, varillaje de dirección y caja de dirección",
          "Chasis y Carrocería: Inspeccionar fundas del eje propulsor (modelos 4WD)",
          "Chasis y Carrocería: Inspeccionar aceite de engranaje diferencial delantero (4WD) y trasero",
          "Chasis y Carrocería: Inspeccionar suspensiones delantera y trasera",
          "Chasis y Carrocería: Reemplazar filtro de aire acondicionado",
          "Chasis y Carrocería: Inspeccionar cantidad de refrigerante del aire acondicionado"
        ]
      },
      {
        km: 30000,
        tareas: [
          "Sistema de Combustible y Control de Emisiones: Reemplazar Filtro de Aire"
        ]
      },
      {
        km: 40000,
        tareas: [
          "Componentes básicos del motor: Inspeccionar la holgura de válvulas",
          "Componentes básicos del motor: Inspeccionar sistema de refrigeración y calefacción [después de los 80.000 km realizarlo cada 20.000 km]",
          "Componentes básicos del motor: Inspeccionar el refrigerante del motor e intercooler",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar Humo Diesel",
          "Sistema de Combustible y Control de Emisiones: Inspeccionar tapón del depósito de combustible, tuberías, conexiones y válvula de control del vapor de combustible",
          "Chasis y Carrocería: Reemplazar líquido de frenos",
          "Chasis y Carrocería: Inspeccionar líquido de la transmisión automática",
          "Chasis y Carrocería: Inspeccionar aceite de la transmisión manual",
          "Chasis y Carrocería: Inspeccionar aceite de transferencia (modelos 4WD)",
          "Chasis y Carrocería: Reemplazar aceite de engranaje diferencial delantero (4WD) y trasero"
        ]
      },
      {
        km: 60000,
        tareas: [
          "Sistema de Combustible y Control de Emisiones: Soplar aire intermitentemente al sensor 'medidor de flujo de aire' cerca de 30 segundos"
        ]
      },
      {
        km: 150000,
        tareas: [
          "Componentes básicos del motor: Reemplazar correa de distribución"
        ]
      },
      {
        km: 160000,
        tareas: [
          "Componentes básicos del motor: Reemplazar el refrigerante del motor e intercooler [después de los 160.000 km realizarlo cada 80.000 km]"
        ]
      },
      {
        km: 200000,
        tareas: [
          "Chasis y Carrocería: Inspeccionar bomba de vacío para el servofreno (sustituir las paletas, nunca reutilizar las antiguas)"
        ]
      }
    ]
  },
  {
    id: "iveco",
    modelo: "IVECO DAILY 55C16 PASO 3950 3.0 TDI 155 CV",
    condicion: "Normal",
    vehiculos: ["AVO323"],
    intervalos: [
      {
        km: 10000,
        tareas: [
          "MOTOR: Sustituir el elemento filtrante del filtro de aire (cada 1 año)",
          "SISTEMA DE FRENOS: Sustituir el líquido de los frenos (cada 1 año)",
          "CABINA: Sustituir el filtro antipolen de aire",
          "SISTEMA DE COMBUSTIBLE: Drenar depósito de agua del prefiltro (semanalmente)",
          "SISTEMA DE COMBUSTIBLE: Drenar y lavar el depósito de combustible (cada 1 año)"
        ]
      },
      {
        km: 20000,
        tareas: [
          "MOTOR: Controlar fijaciones y posibles fugas de tuberías de escape, admisión y mangueras del sistema de refrigeración",
          "MOTOR: Controlar el sistema de admisión de aire: vida útil de filtro, estanqueidad de la junta de tapa y válvula eyectora",
          "MOTOR: Controlar el indicador óptico de obstrucción del filtro de aire en el tablero y en caso de obstrucción, sustituirlo",
          "MOTOR: Controlar el funcionamiento del freno motor",
          "MOTOR: Controlar el estado de la correa",
          "MOTOR: Controlar el nivel de líquido del sistema de refrigeración",
          "MOTOR: Controlar obstrucciones en los paneles de los radiadores de agua y aire",
          "MOTOR: Sustituir el filtro de combustible",
          "MOTOR: Sustituir el aceite y los filtros de aceite del motor",
          "MOTOR: Sustituir el líquido del sistema de refrigeración del motor (cada 2 años)",
          "TRANSMISIÓN Y EMBRAGUE: Verificar posibles fugas de aceite del sistema de transmisión y embrague",
          "TRANSMISIÓN Y EMBRAGUE: Controlar el aceite de embrague y estado de los retenes",
          "EJE TRASERO Y ÁRBOL DE TRANSMISIÓN: Controlar posibles fugas de aceite del sistema diferencial",
          "EJE TRASERO Y ÁRBOL DE TRANSMISIÓN: Controlar nivel de aceite, limpieza de los respiraderos, nivel de ruido y posibles fugas en el eje trasero",
          "SISTEMA DE SUSPENSIÓN: Controlar el estado de los amortiguadores (pérdidas, desgastes) y reajustar sus fijaciones",
          "SISTEMA DE SUSPENSIÓN: Reajustar las tuercas de las grampas de fijación de los soportes de la suspensión, de las ballestas y de las barras estabilizadoras",
          "SISTEMA DE SUSPENSIÓN: Controlar el estado general de los bujes de suspensión",
          "SISTEMA DE SUSPENSIÓN: Efectuar la lubricación general del sistema de suspensión primaria",
          "SISTEMA DE DIRECCIÓN: Controlar desajustes y posibles ruidos en el sistema de dirección, barras de dirección, terminales y limitadores de recorrido",
          "SISTEMA DE DIRECCIÓN: Controlar el nivel de aceite del sistema hidráulico de dirección y posibles pérdidas en tuberías, mangueras y conexiones",
          "SISTEMA DE DIRECCIÓN: Verificar el límite de recorrido del sistema de dirección",
          "SISTEMA DE FRENOS: Controlar la fijación y posibles pérdidas en las tuberías del sistema de frenos",
          "SISTEMA DE FRENOS: Verificar el correcto funcionamiento y estabilidad de los frenos de servicio y de estacionamiento",
          "SISTEMA DE FRENOS: Controlar las condiciones de los discos de freno y desgaste de las pastillas",
          "SISTEMA DE FRENOS: Controlar el nivel del líquido de los frenos",
          "SISTEMA ELÉCTRICO: Verificar el funcionamiento de las luces internas, externas y de emergencia",
          "SISTEMA ELÉCTRICO: Verificar el funcionamiento de las palancas e interruptores de comandos",
          "SISTEMA ELÉCTRICO: Verificar el funcionamiento de todas las luces del tablero",
          "CABINA: Controlar el aspecto exterior de la cabina: pintura, ralladas y herrumbre",
          "CABINA: Controlar el funcionamiento de la ventilación/calefacción interna de la cabina",
          "CABINA: Verificar el funcionamiento del limpiaparabrisas y lavaparabrisas y el nivel de agua del depósito",
          "CABINA: Controlar alineación de los pedales del embrague y del freno",
          "SISTEMA DE COMBUSTIBLE: Controlar posibles pérdidas en tuberías, mangueras, conexiones, filtros y bomba inyectora de combustible",
          "SISTEMA DE COMBUSTIBLE: Reajustar fijación de los soportes y cintas del tanque de combustible",
          "CHASIS: Repaso del apriete de las tuercas de ruedas, calibración de neumáticos y reparación de posibles pérdidas en las válvulas de inflado",
          "CHASIS: Controlar rotación y balanceo de neumáticos",
          "CHASIS: Controlar alineado del sistema dirección"
        ]
      },
      {
        km: 40000,
        tareas: [
          "EJE TRASERO Y ÁRBOL DE TRANSMISIÓN: Controlar el ajuste y estado de los árboles de transmisión, de las crucetas y la fijación de las bridas",
          "SISTEMA DE DIRECCIÓN: Controlar la fijación de la caja de dirección y de su soporte",
          "CABINA: Controlar y eventualmente eliminar los insectos que estén en el filtro antipolen de aire",
          "SISTEMA DE COMBUSTIBLE: Sustituir el prefiltro de combustible",
          "CHASIS: Controlar apriete de los tornillos del cuadro de chasis"
        ]
      },
      {
        km: 60000,
        tareas: [
          "MOTOR: Sustituir la correa de los comandos auxiliares del motor (ventilador, bomba de agua y alternador) y la del opcional aire acondicionado",
          "MOTOR: Controlar los soportes y cojinetes del motor y su fijación; caso sea necesario, substituirlos",
          "MOTOR: Controlar el porcentaje de aditivo del sistema de refrigeración del motor (debe estar cerca del 40%). Caso sea necesario, completar con agua y Coolant UP al 50%",
          "EJE TRASERO Y ÁRBOL DE TRANSMISIÓN: Sustituir el aceite del diferencial y efectuar la limpieza del respiradero de vapores de aceite",
          "EJE TRASERO Y ÁRBOL DE TRANSMISIÓN: Sustituir el aceite de los cubos de ruedas traseras. Volumen: 4 litros por eje y 0,5 litro en cada rueda",
          "SISTEMA DE DIRECCIÓN: Controlar el torque de las barras de dirección, de los brazos, columna y pivots",
          "SISTEMA DE DIRECCIÓN: Controlar el aceite de la dirección hidráulica y completar, si es necesario",
          "SISTEMA DE FRENOS: Controlar la regulación del corrector de frenada",
          "SISTEMA ELÉCTRICO: Controlar la regulación de los faros",
          "SISTEMA ELÉCTRICO: Controlar el sistema EDC a través de 'Easy'",
          "CHASIS: Controlar las posibles interferencias de las partes móviles"
        ]
      },
      {
        km: 120000,
        tareas: [
          "MOTOR: Sustituir los tensores automáticos de la correa 'poly-V'",
          "MOTOR: Sustituir la cadena de distribución con sus tensores y engranajes"
        ]
      },
      {
        km: 200000,
        tareas: [
          "TRANSMISIÓN Y EMBRAGUE: Sustitución del aceite del sistema de transmisión y limpieza de los respiraderos. Caja 6S420"
        ]
      }
    ]
  },
  {
    id: "hyundai",
    modelo: "HYUNDAI H1 2.5 TDI 136 CV",
    condicion: "Normal",
    vehiculos: ["AVO023"],
    intervalos: [
      {
        km: 10000,
        tareas: [
          "Reemplazar aceite y filtro del motor [o cada 1 año]"
        ]
      },
      {
        km: 15000,
        tareas: [
          "Inspeccionar filtro de aire",
          "Inspeccionar Manguito de vacío (para EGR y cuerpo de la mariposa)",
          "Inspeccionar Bomba de vacío del alternador",
          "Inspeccionar Manguito de aceite y manguito de vacío del alternador",
          "Reemplazar Cartucho del filtro de combustible",
          "Inspeccionar estado de la batería",
          "Inspeccionar Conducciones, manguitos y conexiones del freno",
          "Inspeccionar líquido de frenos",
          "Inspeccionar freno de disco y pastillas",
          "Inspeccionar Líquido y manguitos de la dirección asistida",
          "Inspeccionar Caja de la cremallera, varillaje y guardapolvos de la dirección",
          "Inspeccionar Neumático (presión y desgaste de la banda de rodadura)",
          "Inspeccionar Trócolas de la suspensión delantera",
          "Inspeccionar Pernos y tuercas del chasis y la carrocería",
          "Inspeccionar Refrigerante del aire acondicionado",
          "Inspeccionar Compresor del aire acondicionado",
          "Reemplazar Filtro de aire del climatizador"
        ]
      },
      {
        km: 30000,
        tareas: [
          "Inspeccionar Conducciones, manguitos y conexiones del combustible",
          "Inspeccionar Todos los sistemas eléctricos",
          "Inspeccionar pedal del freno",
          "Inspeccionar freno de estacionamiento",
          "Inspeccionar Eje de transmisión",
          "Inspeccionar Aceite para el eje trasero"
        ]
      },
      {
        km: 45000,
        tareas: [
          "Reemplazar filtro de aire"
        ]
      },
      {
        km: 60000,
        tareas: [
          "Inspeccionar Manguito de vapor y tapón de llenado de combustible",
          "Inspeccionar Líquido de cambio manual",
          "Inspeccionar Líquido del cambio automático"
        ]
      },
      {
        km: 80000,
        tareas: [
          "Revisar Correas de transmisión: alternador, dirección asistida, bomba de agua y acondicionador de aire. Revisar y/o arreglar o sustituir si es preciso [o cada 2 años, luego de los 80.000 km realizar cada 20.000 km]",
          "Inspeccionar bomba de agua del sistema de refrigeración"
        ]
      },
      {
        km: 100000,
        tareas: [
          "Reemplazar Refrigerante del motor [o cada 5 años, luego de los 100.000 km realizar cada 40.000 km o cada 2 años]"
        ]
      }
    ]
  },
  {
    id: "kangoo",
    modelo: "RENAULT KANGOO II CONFORT 5A 1.5 DCI 65 CV",
    condicion: "Normal",
    vehiculos: ["AVO404","AVO978","AVO979"],
    intervalos: [
      {
        km: 10000,
        tareas: [
          "Reemplazo del aceite de motor",
          "Sustituir el filtro de aceite",
          "Sustituir el filtro de aire",
          "Sustituir el filtro de combustible",
          "Sustituir el filtro del habitáculo",
          "Comprobar el estado del sistema de combustible",
          "Control anticorrosión",
          "Limpieza y lubricación de la cerradura del capot",
          "Control del tubo de escape",
          "Vaciar el agua del filtro de combustible",
          "Control de los niveles, estado y estanqueidad del circuito hidráulico de dirección asistida",
          "Control de los niveles, estado y estanqueidad del circuito de refrigeración",
          "Control de los niveles, estado y estanqueidad del circuito de freno/embrague",
          "Control del estado y de la estanqueidad de los fuelles/silentblocs/rótulas/amortiguadores",
          "Control del estado y de la presión de los neumáticos",
          "Control de la presencia de los tapones de las válvulas de las ruedas",
          "Control del desgaste de las pastillas y discos de freno",
          "Control de la señalización e iluminación exterior/interior",
          "Control de estado del parabrisas y de los retrovisores",
          "Control de las escobillas del limpiaparabrisas y nivel del líquido lavacristales",
          "Control de la batería de 12V",
          "Control de los calculadores con el útil de diagnóstico",
          "Control del funcionamiento de los testigos del cuadro de instrumentos",
          "Reinicialización de la pantalla de cambio de aceite/mantenimiento",
          "Documentación y colocación de la etiqueta de mantenimiento"
        ]
      },
      {
        km: 20000,
        tareas: [
          "Limpieza y control del sistema de climatización (o cada 2 años)"
        ]
      },
      {
        km: 40000,
        tareas: [
          "Control y Limpieza del polvo de las zapatas del freno de tambor",
          "Control y puesta a nivel del fluido refrigerante (o cada 4 años)"
        ]
      },
      {
        km: 60000,
        tareas: [
          "Sustituir la correa de accesorios y los rodillos",
          "Sustituir la correa de distribución y los rodillos"
        ]
      },
      {
        km: 80000,
        tareas: [
          "Sustituir el líquido de frenos",
          "Sustituir el líquido de refrigeración"
        ]
      }
    ]
  },
  {
    id: "fiat",
    modelo: "FIAT UNO / FIORINO FIRE 1242 MPI 8V",
    condicion: "Normal",
    vehiculos: ["AVO247"],
    intervalos: [
      {
        km: 10000,
        tareas: [
          "Control de alienado, rotación y estado/desgaste de los neumáticos",
          "Control del funcionamiento de las pastillas de los frenos de disco delanteros (sustituir si espesor < 5 mm)",
          "Control visual del estado e integridad: exterior de la carrocería, protecciones de los bajos, caño de escape, tubo de alimentación combustible, frenos, dirección asistida, refrigeración, aire acondicionado y elementos de goma (capuchón, manguitos, fuelles, retenes, bujes, etc.)",
          "Reintegración del nivel de líquidos (refrigeración del motor, lavaparabrisas) y fluidos (frenos, servodirección, embrague hidráulico, etc.)",
          "Sustitución del aceite del motor [o cada 1 año]",
          "Sustitución del filtro de aceite del motor",
          "Sustitución del cartucho del filtro de aire",
          "Control del estado, tensado y regulación de las correas trapezoidales y/o poly-V",
          "Control del extintor de fuego, escobillas limpiaparabrisas, cinturones de seguridad, sistema de iluminación y señalización externa, comando eléctrico de los levantacristales, sistema de apertura y cierre de puertas, baúl y tapa de combustible"
        ]
      },
      {
        km: 20000,
        tareas: [
          "Control/regulación del recorrido o altura del pedal de embrague",
          "Control/regulación del juego de los botadores",
          "Control del sistema de encendido/inyección (mediante EXAMINER)",
          "Control de las emisiones de los gases de escape",
          "Sustitución de las bujías, control de los cables – Solo Fiorino",
          "Control del recorrido de la palanca del freno de mano",
          "Sustitución del líquido refrigerante [cada 2 años]"
        ]
      },
      {
        km: 30000,
        tareas: [
          "Control visual de la correa dentada de mando de la distribución",
          "Control de las condiciones de desgaste de las zapatas de los frenos traseros (frenos de tambor)"
        ]
      },
      {
        km: 40000,
        tareas: [
          "Sustitución del filtro de combustible",
          "Sustitución de las bujías, control de los cables – Solo Uno",
          "Control del nivel del aceite de la caja de cambio/diferencial"
        ]
      },
      {
        km: 60000,
        tareas: [
          "Control visual del sistema antievaporación (conexiones, tuberías, contenedores, retenes y tapón del depósito de combustible)",
          "Sustitución de la correa dentada de mando de la distribución [máximo cada 5 años]",
          "Sustitución de las correas de órganos auxiliares (dirección asistida / aire acondicionado / bomba de agua / alternador)",
          "Sustitución del líquido de los frenos [o bien cada 2 años]",
          "Control/limpieza del sistema de ventilación del block motor (blow-by)"
        ]
      },
      {
        km: 100000,
        tareas: [
          "Sustitución del aceite de la caja de cambio/diferencial"
        ]
      }
    ]
  }
];

/* Mapa rápido equipo → plan KM */
const EQUIPO_A_PLAN = {};
MANT_KM.forEach(plan => {
  plan.vehiculos.forEach(eq => { EQUIPO_A_PLAN[eq] = plan.id; });
});
