/* Puertas Automáticas - Planes de Mantenimiento */

const PUERTAS_PLANS = {
  manusa_optima: {
    id: 'manusa-optima',
    nombre: 'Puertas Manusa — Selector Optima+',
    tipo: 'Puertas Automáticas',
    icon: '🚪',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección visual de hojas',
          'Verificación de apertura y cierre',
          'Limpieza de óptica de sensores',
          'Control de funcionamiento de radares',
          'Verificación de luces de falla',
          'Limpieza de pisos de guía'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de hojas y marcos',
          'Verificación de sellos perimetrales',
          'Chequeo de botones de apertura',
          'Revisión de fotocélulas',
          'Inspección de guías inferior y superior',
          'Medición de consumo eléctrico',
          'Test de modo de emergencia',
          'Revisión de programación del selector'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Limpieza exhaustiva de sensor de movimiento',
          'Verificación de seguridad de hojas fijas',
          'Inspección de contactos eléctricos',
          'Revisión de cilindro de amortiguamiento',
          'Control de fugas hidráulicas',
          'Prueba de tiempos de apertura/cierre',
          'Medición de aislación eléctrica',
          'Revisión de cable de alimentación'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Inspección exhaustiva de mecanismo de cierre',
          'Verificación de aceite en cilindros',
          'Revisión de todas las señales de alarma',
          'Test de modos especiales (noche, emergencia)',
          'Verificación de baterías de respaldo',
          'Inspección de marcos y soldaduras',
          'Limpieza de disipador de calor',
          'Análisis de vibraciones anormales'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del sistema mecánico',
          'Reemplazo de filtros si es necesario',
          'Revisión de software del controlador',
          'Pruebas exhaustivas de seguridad',
          'Inspección de cableado interno',
          'Reemplazo de juntas desgastadas',
          'Verificación de conformidad normativa',
          'Certificación de funcionamiento seguro'
        ]
      }
    ]
  },

  audoor_corredera: {
    id: 'audoor-corredera',
    nombre: 'Puertas Audoor — Corredizas',
    tipo: 'Puertas Automáticas',
    icon: '🚪',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección de funcionamiento de hojas',
          'Limpieza de sensores de presencia',
          'Verificación de luz indicadora',
          'Control de deslizamiento suave',
          'Limpieza de rodillos guía'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de cristales y marcos',
          'Verificación de sellos de estanqueidad',
          'Chequeo de sensores de seguridad',
          'Revisión de pulsadores de apertura',
          'Inspección de guías de piso',
          'Control de alineación de hojas',
          'Medición de consumo eléctrico',
          'Revisión de programación'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección de rodamientos y rodillos',
          'Verificación de cilindros neumáticos',
          'Revisión de válvulas de control',
          'Control de presión de aire comprimido',
          'Prueba de tiempos de respuesta',
          'Inspección de conectores eléctricos',
          'Medición de aislación',
          'Revisión de cable de alimentación'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Desmontaje y limpieza de rodillos guía',
          'Verificación de cilindros y válvulas',
          'Revisión exhaustiva de sensores',
          'Test de todos los modos de funcionamiento',
          'Inspección de estructura portante',
          'Limpieza de filtros de aire',
          'Análisis de ruido y vibración'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del sistema neumático',
          'Reemplazo de juntas desgastadas',
          'Verificación de alineación general',
          'Pruebas integrales de seguridad',
          'Reemplazo de rodillos si es necesario',
          'Inspección de soldaduras',
          'Recalibración de sensores',
          'Certificación de seguridad y conformidad'
        ]
      }
    ]
  },

  puerta_abatible: {
    id: 'puerta-abatible',
    nombre: 'Puertas Abatibles Automáticas',
    tipo: 'Puertas Automáticas',
    icon: '🚪',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Inspección de movimiento de hojas',
          'Limpieza de sensores',
          'Verificación de bisagras',
          'Control de cierre hermético'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza de marcos y sellos',
          'Verificación de alineación de hojas',
          'Chequeo de motor de accionamiento',
          'Revisión de tiradores',
          'Inspección de botones de apertura',
          'Control de mecanismo de cierre',
          'Medición de consumo eléctrico',
          'Revisión de dispositivos de seguridad'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Inspección exhaustiva de bisagras',
          'Verificación de rodamientos',
          'Revisión de cilindro de amortiguamiento',
          'Control de fugas hidráulicas/neumáticas',
          'Prueba de tiempos de movimiento',
          'Inspección de contactos de seguridad',
          'Medición de aislación eléctrica'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Desmontaje y limpieza de bisagras',
          'Verificación del sistema de amortiguamiento',
          'Revisión de todos los sensores',
          'Test de modos especiales',
          'Inspección de soldaduras en marcos',
          'Limpieza profunda de mecanismos',
          'Análisis de ruido anormal'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del accionamiento',
          'Reemplazo de juntas desgastadas',
          'Verificación de alineación global',
          'Pruebas integrales de seguridad',
          'Inspección de estructura de marcos',
          'Recalibración de sensores',
          'Certificación de seguridad y funcionamiento'
        ]
      }
    ]
  },

  sensor_seguridad: {
    id: 'sensor-seguridad',
    nombre: 'Sistemas de Sensores y Seguridad',
    tipo: 'Puertas Automáticas',
    icon: '🚪',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'Verificación de luz indicadora de sensor',
          'Test de activación manual',
          'Limpieza de lentes ópticos',
          'Verificación de conexiones'
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de óptica',
          'Test de rango de detección',
          'Verificación de tiempo de respuesta',
          'Revisión de cables y conectores',
          'Calibración de sensores si necesario',
          'Medición de consumo eléctrico'
        ]
      },
      {
        label: 'Trimestral',
        color: '#f59e0b',
        tareas: [
          'Análisis detallado de rango de sensores',
          'Prueba con objetos a diferentes velocidades',
          'Verificación de área de seguridad',
          'Revisión de electrónica de sensor',
          'Test de alarmas',
          'Medición de aislación'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Calibración fina de sensores',
          'Análisis de falsos positivos/negativos',
          'Inspección de cableado interno',
          'Revisión de relés y contactores',
          'Test de sincronización entre sensores',
          'Medición de voltaje en línea'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Reemplazo de sensores dañados o defectuosos',
          'Revisión completa del sistema de control',
          'Análisis estadístico de eventos',
          'Pruebas de conformidad normativa',
          'Recalibración integral',
          'Actualización de firmware si aplica',
          'Certificación de funcionamiento'
        ]
      }
    ]
  }
};
