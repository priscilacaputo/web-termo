/* Bombas de Agua Potable - Planes de Mantenimiento */

const BOMBAS_AGUA_PLANS = {
  bombas_centrifugas_acoplamiento: {
    id: 'bombas-centrifugas-acoplamiento',
    nombre: 'Bombas Centrífugas con Acoplamiento',
    tipo: 'Bombas de Agua',
    icon: '💧',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Controlar presiones (no deben ser inferior al 20% del nominal)',
          'Medir y registrar la corriente del motor - Fase L1 (no superior al 10% mayor a nominal)',
          'Medir y registrar la corriente del motor - Fase L2 (no superior al 10% mayor a nominal)',
          'Medir y registrar la corriente del motor - Fase L3 (no superior al 10% mayor a nominal)',
          'Controlar el comportamiento de la bomba en funcionamiento',
          'Nivel de ruido, vibraciones, temperatura de los cojinetes',
          'Controlar el comportamiento del motor en funcionamiento',
          'Nivel de ruido, vibraciones, temperatura de los rodamientos',
          'Controlar estado caja de rodamientos (pérdidas de aceite o grasa)',
          'Chequear nivel de aceite',
          'Controlar que no exista excesiva pérdida por los sellos mecánicos',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Desacoplar conjunto conductor - conducido',
          'Poner en funcionamiento el equipo impulsor (motor) en vació',
          'Controlar funcionamiento mecánico, ruido, vibraciones, etc',
          'Realizar un megado del motor',
          'Girar en forma manual la bomba, y verificar su giro sin freno',
          'De producirse la apertura para cambio de rodamiento',
          'Abrir todo el conjunto impulso y verificar estado y desgastes',
          'Alinear todo el conjunto',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      }
    ]
  },

  bombas_centrifugas_monobloque: {
    id: 'bombas-centrifugas-monobloque',
    nombre: 'Bombas Centrífugas Monobloque',
    tipo: 'Bombas de Agua',
    icon: '💧',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Controlar presiones (no deben ser inferior al 20% del nominal)',
          'Medir y registrar la corriente del motor - Fase L1 (no superior al 10% mayor)',
          'Medir y registrar la corriente del motor - Fase L2 (no superior al 10% mayor)',
          'Medir y registrar la corriente del motor - Fase L3 (no superior al 10% mayor)',
          'Controlar el comportamiento de la bomba en funcionamiento',
          'Nivel de ruido, vibraciones, temperatura de los cojinetes',
          'Controlar el comportamiento del motor en funcionamiento',
          'Nivel de ruido, vibraciones, temperatura de los rodamientos',
          'Controlar que no exista excesiva pérdida por los sellos mecánicos',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar un megado del motor',
          'De producirse la apertura para cambio de rodamiento',
          'Abrir todo el conjunto impulso y verificar estado y desgastes',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      }
    ]
  },

  bombas_sumergibles: {
    id: 'bombas-sumergibles',
    nombre: 'Bombas Sumergibles',
    tipo: 'Bombas de Agua',
    icon: '🌊',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Realizar pruebas de operación con todas las válvulas abiertas',
          'Controlar el comportamiento de la bomba en funcionamiento',
          'Nivel de ruido, vibraciones',
          'Medir y registrar la corriente del motor - Fase L1 (no superior al 5% mayor)',
          'Medir y registrar la corriente del motor - Fase L2 (no superior al 5% mayor)',
          'Medir y registrar la corriente del motor - Fase L3 (no superior al 5% mayor)',
          'SI EL LÍQUIDO CONTIENE MUCHOS SEDIMENTOS:',
          'Desacoplar la bomba de la cañería de impulsión',
          'Revisar el impulsor de la bomba (desgaste)',
          'Verificar posible desgaste del cuerpo de bomba',
          'Verificar el nivel y existencia de pérdidas de aceite',
          'Verificar que no existan pérdidas de agua en la cañería u otros accesorios',
          'Verificar integridad del cableado eléctrico',
          'Operación de maniobra de válvulas para controlar su funcionamiento',
          'Realizar limpieza de equipo y sector',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Controlar ajuste de bornes en el conexionado/bornera del equipo',
          'Controlar que no exista presencia de sulfato/óxido',
          'Realizar limpieza y ajuste de ser necesario',
          'Previamente desenergizar el tablero',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      }
    ]
  },

  bombas_multietapa_verticales: {
    id: 'bombas-multietapa-verticales',
    nombre: 'Bombas Multietapa Verticales',
    tipo: 'Bombas de Agua',
    icon: '🔼',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Controlar las presiones (no deben ser inferior al 20% del nominal)',
          'Medir y registrar al momento del arranque y luego de 10 min',
          'Corriente del motor - Fase L1 (no superior al 10% mayor)',
          'Medir y registrar al momento del arranque y luego de 10 min',
          'Corriente del motor - Fase L2 (no superior al 10% mayor)',
          'Medir y registrar al momento del arranque y luego de 10 min',
          'Corriente del motor - Fase L3 (no superior al 10% mayor)',
          'Controlar el comportamiento de la bomba en funcionamiento',
          'Nivel de ruido, vibraciones, temperatura de los rodamientos',
          'Verificar estado de acoplamiento',
          'Controlar que no exista pérdida por el sello mecánico',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Realizar limpieza completa del equipo',
          'Verificar estado y realizar control general de la bulonería del equipo',
          'De producirse la apertura para cambio de rodamientos',
          'Abrir todo el conjunto y verificar estado y desgastes',
          'En caso de encontrar alguna anomalía, informar al Supervisor'
        ]
      }
    ]
  }
};
