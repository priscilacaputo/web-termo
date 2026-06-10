/* Mangas Preventive Maintenance Plans — Extended Data */

// Additional maintenance plan details organized by manga type
// This extends the basic MANGAS_PLANES data with comprehensive task lists

const MANGAS_PLANS_EXTENDED = {
  // ADELTE Mangos
  "adelte-pbb": {
    id: "adelte-pbb",
    frecuenciasDetalladas: [
      {
        id: "diaria",
        label: "DIARIA",
        color: "#1a56a4",
        grupos: [
          {
            nombre: "Inspecciones Visuales Exteriores",
            tareas: [
              "Reflectores y balizas — estado limpieza y funcionamiento",
              "Tren de ruedas — desgaste, lubricación y alineación",
              "Pasarela, rotonda y cabina — grietas, abolladuras",
              "Vidrios — roturas, estanqueidad",
              "Persianas — operatividad y sellado",
              "Bandeja portacables — limpieza, daños",
              "Pórtico y columnas — alineación, corrosión",
              "Fuelle — flexibilidad, desgarros, estanqueidad",
              "Escalera de servicio — peldaños, barandillas",
              "Puerta de servicio — cierre hermético",
              "Central hidráulica — fugas, nivel de fluido"
            ]
          },
          {
            nombre: "Inspecciones Interiores",
            tareas: [
              "Carpintería — pintura, adhesivos, ajuste puertas",
              "Pisos — integridad, limpieza, seguridad",
              "Limpieza general — desechos, polvo, humedad"
            ]
          }
        ]
      },
      {
        id: "mensual",
        label: "MENSUAL",
        color: "#3b82f6",
        grupos: [
          {
            nombre: "Tablero Principal",
            tareas: [
              "Inspección visual estado general",
              "Señales visuales y mensajes informativos",
              "Alarmas en PLC",
              "Condición UPS (voltaje, batería)"
            ]
          },
          {
            nombre: "Sistema Hidráulico",
            tareas: [
              "Nivel de fluido hidráulico",
              "Presión en circuitos",
              "Fugas en conexiones y cilindros",
              "Temperatura del aceite"
            ]
          },
          {
            nombre: "Componentes Eléctricos",
            tareas: [
              "Voltaje en línea de alimentación",
              "Funcionamiento contactores",
              "Estado de breakers y fusibles",
              "Continuidad de tierras"
            ]
          }
        ]
      },
      {
        id: "trimestral",
        label: "TRIMESTRAL",
        color: "#10b981",
        grupos: [
          {
            nombre: "Inspección Completa",
            tareas: [
              "Verificación exterior completa de toda estructura",
              "Inspección interior de compartimientos",
              "Test funcional de sistemas de seguridad",
              "Prueba de botón de emergencia",
              "Lubricación de puntos críticos"
            ]
          }
        ]
      },
      {
        id: "semestral",
        label: "SEMESTRAL",
        color: "#f59e0b",
        grupos: [
          {
            nombre: "Sistemas Principales",
            tareas: [
              "Inspección completa sistema hidráulico",
              "Test de finales de carrera",
              "Medición de consumo de energía",
              "Análisis de aceite hidráulico",
              "Revisión de válvulas de seguridad"
            ]
          }
        ]
      },
      {
        id: "anual",
        label: "ANUAL",
        color: "#ef4444",
        grupos: [
          {
            nombre: "Revisión Completa",
            tareas: [
              "Inspección estructural completa",
              "Prueba de sistemas de emergencia",
              "Cambio de aceite hidráulico si requerido",
              "Calibración de sensores",
              "Reemplazo de sellos desgastados",
              "Pintura de zonas oxidadas"
            ]
          }
        ]
      }
    ]
  },

  // THYSSEN 2011-2013
  "thyssen-2011": {
    id: "thyssen-2011",
    frecuenciasDetalladas: [
      {
        id: "diaria",
        label: "DIARIA",
        color: "#1a56a4",
        grupos: [
          {
            nombre: "Inspección y Funcionamiento",
            tareas: [
              "Inspección visual exterior completa",
              "Verificación de funcionamiento en subida y bajada",
              "Prueba de emergencia (parada)",
              "Limpieza de superficies"
            ]
          }
        ]
      },
      {
        id: "mensual",
        label: "MENSUAL",
        color: "#3b82f6",
        grupos: [
          {
            nombre: "Lubricación y Mecánica",
            tareas: [
              "Lubricación de articulaciones móviles",
              "Inspección de tornillos de amarre",
              "Verificación de holguras"
            ]
          },
          {
            nombre: "Sistema Hidráulico",
            tareas: [
              "Nivel de fluido",
              "Presión en circuitos",
              "Búsqueda de fugas"
            ]
          },
          {
            nombre: "Componentes Eléctricos",
            tareas: [
              "Test de botones de control",
              "Funcionamiento de motores",
              "Estado de cables"
            ]
          }
        ]
      },
      {
        id: "semestral",
        label: "SEMESTRAL",
        color: "#f59e0b",
        grupos: [
          {
            nombre: "Inspección Profunda",
            tareas: [
              "Medición de consumos eléctricos",
              "Revisión completa hidráulica",
              "Test de seguridad (parada de emergencia)",
              "Inspección de cilindros hidráulicos",
              "Análisis de aceite"
            ]
          }
        ]
      },
      {
        id: "anual",
        label: "ANUAL",
        color: "#ef4444",
        grupos: [
          {
            nombre: "Mantenimiento Mayor",
            tareas: [
              "Cambio de filtros de aire y aceite",
              "Revisión estructural soldada",
              "Prueba de funcionamiento motor",
              "Reemplazo de sellos deteriorados",
              "Calibración de sensores de posición"
            ]
          }
        ]
      }
    ]
  },

  // THYSSEN 2018+
  "thyssen-2018": {
    id: "thyssen-2018",
    frecuenciasDetalladas: [
      {
        id: "diaria",
        label: "DIARIA",
        color: "#1a56a4",
        grupos: [
          {
            nombre: "Inspección y Seguridad",
            tareas: [
              "Inspección visual (estructura y pintura)",
              "Verificación de funcionamiento",
              "Revisión de sistemas de seguridad",
              "Limpieza de nieve/hielo (invierno)"
            ]
          }
        ]
      },
      {
        id: "bimestral",
        label: "BIMESTRAL",
        color: "#06b6d4",
        grupos: [
          {
            nombre: "Sistema de Control",
            tareas: [
              "Test de sistemas de seguridad PLC",
              "Verificación de alarmas de control",
              "Funcionamiento de sensores"
            ]
          }
        ]
      },
      {
        id: "cuatrimestral",
        label: "CUATRIMESTRAL",
        color: "#8b5cf6",
        grupos: [
          {
            nombre: "Eléctrica y Automatismo",
            tareas: [
              "Inspecciones eléctricas de alimentación",
              "Test de sensores de posición",
              "Medición de consumos",
              "Funcionamiento de variadores"
            ]
          }
        ]
      },
      {
        id: "anual",
        label: "ANUAL",
        color: "#ef4444",
        grupos: [
          {
            nombre: "Revisión Integral",
            tareas: [
              "Lubricación completa de articulaciones",
              "Revisión estructural soldada",
              "Análisis de fluido hidráulico",
              "Cambio de sellos y juntas",
              "Calibración total de sensores"
            ]
          }
        ]
      }
    ]
  },

  // TEAM
  "team": {
    id: "team",
    frecuenciasDetalladas: [
      {
        id: "diaria",
        label: "DIARIA",
        color: "#1a56a4",
        grupos: [
          {
            nombre: "Inspección General",
            tareas: [
              "Inspección visual de estructura",
              "Prueba de funcionamiento subida-bajada",
              "Prueba de emergencia",
              "Limpieza"
            ]
          }
        ]
      },
      {
        id: "mensual",
        label: "MENSUAL",
        color: "#3b82f6",
        grupos: [
          {
            nombre: "Mantenimiento Rutinario",
            tareas: [
              "Lubricación de puntos móviles",
              "Revisión mecánica de pernos",
              "Revisión de bridas y conexiones"
            ]
          },
          {
            nombre: "Componentes Eléctricos",
            tareas: [
              "Test de funcionamiento motor",
              "Verificación de contactores",
              "Estado de breakers"
            ]
          }
        ]
      },
      {
        id: "semestral",
        label: "SEMESTRAL",
        color: "#f59e0b",
        grupos: [
          {
            nombre: "Inspección Profunda",
            tareas: [
              "Medición de consumos",
              "Inspección de componentes hidráulicos",
              "Análisis de vibraciones",
              "Revisión de sistemas de control"
            ]
          }
        ]
      },
      {
        id: "quinquenal",
        label: "QUINQUENAL",
        color: "#7c3aed",
        grupos: [
          {
            nombre: "Mantenimiento Mayor",
            tareas: [
              "Cambio de aceites reductores",
              "Reconstrucción de cilindros si necesario",
              "Revisión total de soldaduras",
              "Cambio de componentes críticos envejecidos"
            ]
          }
        ]
      }
    ]
  }
};
