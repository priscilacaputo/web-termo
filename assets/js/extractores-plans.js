/* Extractores y Ventiladores - Planes de Mantenimiento */

const EXTRACTORES_PLANS = {
  extractor_basico: {
    id: 'extractor-basico',
    nombre: 'Extractores Básicos',
    tipo: 'Extractores',
    icon: '💨',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Inspección visual del extractor',
          'Verificación de funcionamiento',
          'Limpieza de rejillas de entrada',
          'Control de ruidos anormales'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de ductos',
          'Verificación del caudal de aire',
          'Chequeo de motor y capacitor',
          'Revisión de aislamiento acústico',
          'Medición de consumo eléctrico',
          'Lubricación de rodamientos',
          'Control de vibraciones'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Limpieza exhaustiva de turbina',
          'Verificación de balance de rodete',
          'Inspección de bridas y juntas',
          'Control de fugas de aire',
          'Revisión de sistema de montaje',
          'Prueba de control de velocidad',
          'Medición de aislación eléctrica'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del motor',
          'Análisis de vibración y ruido',
          'Reemplazo de rodamientos si es necesario',
          'Reparación/reemplazo de aspa si aplica',
          'Calibración de termostatos',
          'Inspección de estructura y soportes',
          'Certificación de seguridad'
        ]
      }
    ]
  },

  ventilador_axial: {
    id: 'ventilador-axial',
    nombre: 'Ventiladores Axiales',
    tipo: 'Extractores',
    icon: '💨',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Inspección de aspas y cono',
          'Verificación de simetría de rotación',
          'Limpieza de entrada de aire',
          'Control de ruido y vibración'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza de aspas',
          'Verificación de rodamientos',
          'Chequeo de motor trifásico',
          'Medición de corriente (3 fases)',
          'Revisión de carcasa y estructura',
          'Lubricación de puntos críticos',
          'Control de estanqueidad'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Desmontaje y limpieza de rodete',
          'Inspección de rodamientos',
          'Verificación de balanceo',
          'Revisión de conexiones eléctricas',
          'Control de fugas de aire',
          'Medición de aislación',
          'Revisión de chumaceras'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Reemplazo de rodamientos si es necesario',
          'Revisión completa del motor',
          'Análisis de vibraciones y ruido',
          'Reparación/reemplazo de aspas dañadas',
          'Inspección de soldaduras',
          'Repintura de carcasa',
          'Pruebas de rendimiento y caudal'
        ]
      }
    ]
  },

  ventilador_centrífugo: {
    id: 'ventilador-centrifugo',
    nombre: 'Ventiladores Centrífugos',
    tipo: 'Extractores',
    icon: '💨',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Inspección visual del rodete',
          'Verificación de funcionamiento suave',
          'Limpieza de carcasa exterior',
          'Control de ruido y vibraciones'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza profunda de paletas',
          'Verificación de rodamientos',
          'Chequeo de motor y capacitor',
          'Medición de consumo (3 fases)',
          'Revisión de bridas y conexiones',
          'Lubricación de ejes',
          'Control de velocidad'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Desmontaje y limpieza de rodete',
          'Inspección exhaustiva de paletas',
          'Verificación de balanceo dinámico',
          'Revisión de rodamientos',
          'Control de fugas en bridas',
          'Prueba de presión',
          'Medición de aislación eléctrica'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del rotor',
          'Reemplazo de rodamientos si aplica',
          'Análisis de vibración y ruido',
          'Reparación de paletas dañadas',
          'Verificación de alineación motor-ventilador',
          'Inspección de soldaduras',
          'Certificación de seguridad y rendimiento'
        ]
      }
    ]
  },

  presurizador: {
    id: 'presurizador',
    nombre: 'Presurizadores',
    tipo: 'Extractores',
    icon: '💨',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Verificación de presión del sistema',
          'Inspección de motores',
          'Limpieza de filtros de entrada',
          'Control de funcionamiento general'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Limpieza de ductos de salida',
          'Verificación de válvulas de presión',
          'Chequeo de motores y capacitores',
          'Medición de consumo eléctrico',
          'Revisión de alineación',
          'Lubricación de rodamientos',
          'Control de fugas'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Limpieza exhaustiva de turbinas',
          'Inspección de rodamientos',
          'Verificación de balanceo',
          'Control de presión en diferentes puntos',
          'Revisión de conexiones eléctricas',
          'Prueba de válvulas',
          'Medición de aislación'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Revisión completa del sistema',
          'Reemplazo de rodamientos si es necesario',
          'Análisis de rendimiento y presión',
          'Pruebas de seguridad',
          'Inspección de soportes y anclajes',
          'Recalibraciones si aplica',
          'Certificación de funcionamiento'
        ]
      }
    ]
  }
};
