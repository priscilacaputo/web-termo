/* Cintas Balanzas - Planes de Mantenimiento */

const CINTAS_BALANZAS_PLANS = {
  cintas_balanzas: {
    id: 'cintas-balanzas',
    nombre: 'Cintas Balanzas',
    tipo: 'Cintas Transportadoras',
    icon: '⚖️',
    frecuencias: [
      {
        label: 'Semestral',
        color: '#3b82f6',
        tareas: [
          'Verificar y registrar Horas de Funcionamiento',
          'Verificar y registrar Cantidad de Maniobras',
          'Medir y registrar el consumo de corriente del Mototambor',
          'Verificar ausencia de ruidos y vibraciones',
          'Verificar estado de mototambor, bastidores, carenados, elementos fijos y móviles',
          'Verificar centrado, tensado y vulcanizado de la banda',
          'Verificar la correcta puesta a tierra del equipo',
          'Verificar estado y ajuste de los elementos de detección (si posee)',
          'Limpieza total del equipo y sector',
          'Controlar funcionamiento y estado de displays y pulsadores',
          'Control de alojamiento bajo-mostrador, evitar acumulación de papeles/etiquetas o similares en zona de CPU balanza',
          'Verificar existencia y estado de oblea INTI',
          'Chequear existencia y estado de etiqueta de codificado'
        ]
      },
      {
        label: 'Anual (MOEX)',
        color: '#ef4444',
        tareas: [
          'Realizar la verificación periódica (VPE) a través de una empresa auditada por INTI de acuerdo con la Resolución SCI 611/19',
          'Los ensayos en las balanzas serán realizados de acuerdo con la Resolución ex SC y NEI 2307/80, lo cual comprende lo siguiente:',
          '  • Errores de Indicación',
          '  • Desvíos entre resultados',
          '  • Excentricidad',
          '  • Fidelidad',
          '  • Movilidad',
          '  • Efecto máximo del dispositivo de puesta a cero',
          'Dichos ensayos deben ser supervisados por el INTI',
          'El contratista entregará a la Jefatura del aeropuerto el acta de verificación periódica elaborada por INTI finalizados los ensayos en campo',
          'Finalmente el contratista entregará a la Jefatura del Aeropuerto dentro del plazo establecido según Resolución SCI 611/19, la documentación final correspondiente "Certificado de Verificación Periódica (VPE)" emitido por INTI'
        ]
      }
    ]
  }
};
