/* Chillers y Sistemas de Enfriamiento - Planes de Mantenimiento */

const COOLING_PLANS = {
  chiller_trane: {
    id: 'chiller-trane',
    nombre: 'Chiller TRANE RTAC (Condensado por Aire)',
    tipo: 'Enfriamiento',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Puesta en marcha del equipo, verificación de rendimiento',
          'Verificación funcionamiento dispositivos de protección',
          'Verificación de funcionamiento de interruptores de flujo de agua',
          'Verificación del correcto funcionamiento de seguridades',
          'Verificar posibles fugas de refrigerante',
          'Verificación de estado de serpentinas del condensador',
          'Verificación de rodamientos de motores ventiladores',
          'Reapriete de conexiones eléctricas',
          'Mantener software del controlador actualizado',
          'Revisar eventos de operación del controlador',
          'Revisar y registrar parámetros: horas funcionamiento compresores, capacidad, temperaturas agua, presiones, corrientes'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar la limpieza química externa de serpentinas de condensadores',
          'Hidrolavar serpentinas'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar Análisis de Aceite (humedad, acidez, metal de desgaste)',
          'Comprobar nivel de aceite del cárter',
          'Medición y registro aislación eléctrica motores',
          'Verificar fugas de la unidad y completar refrigerante si necesario',
          'Compruebe y apriete conexiones eléctricas',
          'Desarme y revisión de contactores eléctricos principales',
          'Limpieza del filtro de aire',
          'Verificar zonas con signos de corrosión'
        ]
      }
    ]
  },

  chiller_mcquay_mcs: {
    id: 'chiller-mcquay-mcs',
    nombre: 'Chiller McQuay MCS310 (Condensado por Aire)',
    tipo: 'Enfriamiento',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Puesta en marcha del equipo, verificación de rendimiento',
          'Verificación funcionamiento dispositivos de protección',
          'Verificación de funcionamiento de interruptores de flujo de agua',
          'Verificación del correcto funcionamiento de seguridades',
          'Verificar posibles fugas de refrigerante',
          'Verificación de estado de serpentinas del condensador',
          'Verificación de rodamientos de motores ventiladores',
          'Reapriete de conexiones eléctricas',
          'Mantener software del controlador actualizado',
          'Revisar eventos de operación',
          'Revisar y registrar parámetros operacionales completos'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar la limpieza química externa de serpentinas',
          'Hidrolavar serpentinas'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar Análisis de Aceite',
          'Comprobar nivel de aceite del cárter',
          'Medición aislación eléctrica motores',
          'Verificar fugas y completar refrigerante',
          'Apriete de conexiones eléctricas',
          'Revisión de contactores principales',
          'Limpieza del filtro de aire',
          'Verificación de corrosión'
        ]
      }
    ]
  },

  chiller_mcquay_mhs: {
    id: 'chiller-mcquay-mhs',
    nombre: 'Chiller McQuay MHS150 (Condensado por Aire)',
    tipo: 'Enfriamiento',
    icon: '❄️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Puesta en marcha del equipo, verificación de rendimiento',
          'Verificación funcionamiento dispositivos de protección',
          'Verificación de funcionamiento de interruptores de flujo',
          'Verificación del correcto funcionamiento de seguridades',
          'Verificar posibles fugas de refrigerante',
          'Verificación de estado de serpentinas del condensador',
          'Verificación de rodamientos de motores ventiladores',
          'Reapriete de conexiones eléctricas',
          'Mantener software del controlador actualizado',
          'Revisar eventos de operación',
          'Revisar parámetros del compresor'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Realizar limpieza química externa de serpentinas',
          'Hidrolavar serpentinas'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar Análisis de Aceite',
          'Comprobar nivel de aceite del cárter',
          'Medición aislación eléctrica',
          'Verificar fugas y completar refrigerante',
          'Apriete de conexiones eléctricas',
          'Revisión de contactores',
          'Limpieza del filtro de aire',
          'Verificación de corrosión'
        ]
      }
    ]
  }
};
