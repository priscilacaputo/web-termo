/* Sistemas de Extinción de Incendio - Planes de Mantenimiento */

const SISTEMAS_EXTINCION_PLANS = {
  motobombas_incendio: {
    id: 'motobombas-incendio',
    nombre: 'Motobombas Red Contra Incendio',
    tipo: 'Sistemas de Extinción',
    icon: '🚒',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'INSPECCIÓN SALA DE BOMBAS: Verificar temperatura de la sala (debe ser > 4°C)',
          'Verificar que las rejillas de ventilación funcionan correctamente',
          'Verificar que el piso no presenta excesiva cantidad de agua',
          'SISTEMA DE BOMBEO: Verificar válvulas de succión y descarga totalmente abiertas',
          'Verificar estado de integridad de cañerías de drenaje, presurizadas y de comando',
          'Verificar estado de integridad del manovacuometro y manómetro',
          'Registrar la presión del manómetro de descarga (referencia: 0 a 6 PSI)',
          'Registrar la presión del manovacuometro de succión (referencia: 0 a 6 PSI)',
          'Verificar que nivel del tanque de agua se encuentre lleno',
          'Verificar que la temperatura del agua no sea inferior a 4°C',
          'Verificar que las válvulas de prueba de flujo están en posición cerrada',
          'MOTOR DIÉSEL: Verificar estado general del equipo',
          'Anotar tiempo de funcionamiento del motor',
          'Verificar que el tanque de combustible está lleno al menos 70%',
          'Comprobar ausencia de agua en el tanque de combustible',
          'Verificar que el interruptor del selector está en posición automática',
          'Verificar lecturas de voltaje de las baterías',
          'Verificar lecturas de corriente de carga de las baterías',
          'Verificar que los terminales de las baterías no presentan corrosión',
          'Verificar nivel de electrolito en las baterías',
          'Inspección general del sistema eléctrico del motor diésel',
          'Verificar que las luces piloto de las baterías están encendidas',
          'Verificar que todas las luces piloto de alarma están apagadas',
          'Verificar que el nivel de aceite del cárter está dentro del rango aceptable',
          'Verificar que el precalentador de cárter funciona correctamente',
          'Verificar que el nivel de agua de refrigeración está dentro del rango aceptable',
          'Verificar que las mangueras flexibles y conexiones están en buenas condiciones',
          'PRUEBA A CAUDAL 0 POR 30 MINUTOS: Verificar el automatismo',
          'Registrar la presión de arranque de la bomba',
          'Registrar la presión de succión del manovacuometro',
          'Registrar la presión de descarga del manómetro',
          'Registrar la lectura del transductor/interruptor de presión',
          'Verificar ajuste del prensaestopas (una gota por segundo)',
          'Verificar ausencia de ruidos o vibraciones inusuales',
          'Inspeccionar las cajas de empaquetaduras, cojinetes o carcasas',
          'MOTOR DIÉSEL EN PRUEBA: Registrar el tiempo para que el motor arranque',
          'Registrar el tiempo que el motor tarda en alcanzar la velocidad de régimen',
          'Registrar lectura de tacómetro, temperatura de agua y presión de aceite',
          'Registrar la presión en la tubería de refrigeración',
          'Verificar el flujo de agua de refrigeración del intercambiador de calor',
          'Verificar ausencias de fugas en el escape',
          'Verificar los dispositivos de control de alarmas',
          'Verificar monitoreo de bomba funcionando desde el sistema ONYXWORKS',
          'Notificar OT con novedades halladas'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Limpiar los FILTROS DE AGUA del sistema de refrigeración',
          'Comprobar los dispositivos de seguridad y las alarmas',
          'Verificar la ausencia de combustible en el escape',
          'Verificar sección flexible del escape',
          'Verificar el estado de la aislación del sistema de gases de escapes',
          'Prueba de arranque de bombas de achique de la sala',
          'Prueba de peras',
          'Limpiar soportes sucios en el motor diésel',
          'Limpieza general (pisos, etc)',
          'PRUEBA DE FUNCIONAMIENTO MANUAL: Verificar funcionamiento de todos los medios de arranque manual',
          'Simular sobrevelocidad desde tablero comando de motor'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'INSPECCION: Verificar la alineación paralela y angular de la bomba y del impulsor',
          'Verificar aislación de cables y/o conductores',
          'Verificar respiradero del cárter del motor',
          'Verificar el sistema de escape, estado de soportes',
          'Verificar grietas en conexiones y mangueras flexibles',
          'Verificar en tanque de combustible, las ventilaciones, tuberías de rebose',
          'Verificar corrosión en placas de circuitos impresos de controlador',
          'Verificar el movimiento u holgura longitudinal de los ejes',
          'Verificar conexiones de cableado de la energía y controles',
          'Verificar que los medios de arranque estén intactos y bien sujetos',
          'MANTENIMIENTO: Reemplazar aceite lubricante del motor anualmente o después de 50 horas',
          'Reemplazar filtros de combustible, aire y aceite',
          'Reemplazar de corresponder el líquido refrigerante cada 2 años',
          'Limpiar/Reemplazar los Filtros del agua circulante',
          'Verificar ánodo de sacrificio del sistema de refrigeración por agua',
          'Lubricar acoplamiento de la bomba, manchón, trasmisión cardánica',
          'Lubricar cojinetes de la bomba',
          'Verificar tensión y estados de correas',
          'Verificar purgadores automáticos',
          'Verificar el correcto funcionamiento del intercambiador de calor',
          'Verificar funcionamiento de la válvula de alivio',
          'Verificar gravedad específica, estado de la carga de las baterías',
          'Eliminar cualquier corrosión de los terminales de baterías',
          'Verificar que el voltaje de arranque sea el correcto',
          'Garantizar que se use solamente agua destilada en las baterías',
          'Verificar los sistemas activos de mantenimiento de combustible diésel',
          'Verificar presencia de agua y materiales extraños en tanque de combustible',
          'Medir contrapresión en turbo de motor',
          'Verificar que la precisión de los manómetros y sensores esté dentro del 5%',
          'Eliminar y pintar partes oxidadas del motor',
          'Revisión general de elementos mecánicos',
          'Coordinar y verificar su correcto funcionamiento con alimentación de emergencia',
          'PRUEBA ANUAL DE COMPONENTES: Probar el módulo de control electrónico (MCE)',
          'Simular/Probar condiciones de alarma de bomba contra incendios',
          'Probar el Tanque de combustible, interruptor de flotador',
          'Probar los equipos relacionados con las condiciones ambientales del cuarto',
          'Verificar señal de supervisión para temperatura del agua alta',
          'PRUEBA ANUAL CON FLUJO: Entregar formulario de prueba anual conforme a NFPA 25',
          'Adjuntar remito de servicio del mantenedor'
        ]
      },
      {
        label: 'Bienal',
        color: '#8b5cf6',
        tareas: [
          'Verificar datos de nueva batería',
          'Verificar nivel electrolito; medir tensión',
          'Retirar batería antigua (desconectar primero el borne negativo)',
          'Instalar nueva batería (conectar primero el borne positivo)',
          'Verificar ajuste de bornes',
          'Medir tensión de salida de cargador de flote de baterías (entre 25/26V)',
          'Recorrida funcional del sistema de arranque',
          'Colocar etiqueta con la fecha de la instalación',
          'Puesta en marcha 15 minutos',
          'Limpieza general del equipo y áreas circundantes',
          'Verificar y asegurar posición en AUTOMATICO o REMOTO de llave selectora'
        ]
      }
    ]
  },

  bomba_jockey: {
    id: 'bomba-jockey',
    nombre: 'Bomba Jockey Red Contra Incendio',
    tipo: 'Sistemas de Extinción',
    icon: '💧',
    frecuencias: [
      {
        label: 'Bimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar la presión en el manómetro (registrar actual, arranque y parada)',
          'Verificar estado de los manómetros y presostatos',
          'Verificar estado y limpieza del pulmón hidráulico',
          'Verificar estado y operación del tablero de comando',
          'Realizar el control de funcionamiento mecánico en el conjunto motor-bomba',
          'Detectar ruidos y vibraciones anormales',
          'Control del sistema de arranque',
          'Medir valores de consumo por fase',
          'Contrastar con valores de chapa',
          'Verificar que no haya pérdidas en la empaquetadura/sello mecánico',
          'Coordinar prueba de funcionamiento con alimentación de emergencia'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'INTERVENCIONES PREVENTIVAS CON MOTOR DETENIDO:',
          'Hacer ensayo de aislación eléctrica de bobinado de motor',
          'Verificar estado del tablero de comandos',
          'Desenergizarlo y realizar ajuste de bornes',
          'Controlar que no exista presencia de sulfato/óxido',
          'Realizar limpieza y ajuste de ser necesario',
          'Girar la bomba en forma manual y verificar su giro sin freno',
          'Verificar alineación de todo el conjunto',
          'Realizar cambio de aceite si aplica',
          'Realizar limpieza completa del equipo',
          'INTERVENCIONES PREVENTIVAS EN LA BOMBA CON MOTOR EN MARCHA:',
          'Realizar el control de funcionamiento mecánico',
          'Detectar ruidos y vibraciones anormales',
          'Control del Sistema de arranque',
          'Medir valores de consumo por fase',
          'Verificar que no haya pérdidas en la empaquetadura/sello mecánico',
          'Adjuntar remito de servicio del mantenedor a OT'
        ]
      }
    ]
  },

  valvulas_principales: {
    id: 'valvulas-principales',
    nombre: 'Válvulas Principales del Sistema',
    tipo: 'Sistemas de Extinción',
    icon: '🔧',
    frecuencias: [
      {
        label: 'Semanal',
        color: '#06b6d4',
        tareas: [
          'VÁLVULAS ESCLUSAS DE VÁSTAGO ASCENDENTE:',
          'Verificar que la válvula se encuentre en posición normal (abierta o cerrada)',
          'Verificar que se encuentre sellada y cuente con indicación normal',
          'Verificar que la válvula se encuentre accesible para su operación',
          'Verificar fugas externas (vástago y bridas)',
          'Verificar que cuente con la identificación apropiada',
          'Verificar presencia de corrosión, estado de pintura y daños físicos'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'VÁLVULAS MARIPOSA SUPERVISADA:',
          'Verificar que la válvula se encuentre en posición normal (abierta o cerrada)',
          'Verificar que se encuentre sellada y cuente con indicación normal',
          'Verificar que la válvula se encuentre accesible para su operación',
          'Verificar fugas externas (vástago y bridas)',
          'Verificar que cuente con la identificación apropiada',
          'Verificar presencia de corrosión, estado de pintura y daños físicos',
          'VÁLVULA DE ALIVIO PRINCIPAL:',
          'Verificar que la válvula se encuentre en posición abierta',
          'Verificar que la misma no presente fugas',
          'Verificar que la presión tanto en la entrada como en la salida se mantenga',
          'Verificar que disponga de cartel indicador del sistema',
          'Verificar que la válvula se encuentre accesible para su operación'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'VÁLVULAS ESCLUSAS:',
          'Probar el funcionamiento de la válvula en todo su rango',
          'Volver a retornarla a su posición normal',
          'Verificar fugas y atascamientos durante la operación',
          'Lubricar vástago',
          'Cerrar completamente la válvula y reabrirla para distribuir completamente el lubricante',
          'Retornar 1/4 giro desde posición totalmente abierta para evitar atascamientos',
          'VÁLVULAS MARIPOSA:',
          'Probar el funcionamiento de la válvula en todo su rango',
          'Volver a retornarla a su posición normal',
          'Verificar fugas y atascamientos durante la operación'
        ]
      }
    ]
  },

  estacion_control_alarma: {
    id: 'estacion-control-alarma',
    nombre: 'Estación de Control y Alarma (ECA)',
    tipo: 'Sistemas de Extinción',
    icon: '⚠️',
    frecuencias: [
      {
        label: 'Mensual',
        color: '#06b6d4',
        tareas: [
          'Verificar si las válvulas de control están abiertas (Normal abierta, para tubería mojada)',
          'Inspeccionar las válvulas de control (si están enclavadas o supervisadas eléctricamente)',
          'Verificar que los manómetros están en buenas condiciones',
          'Asegurarse de que la presión esté en el intervalo correcto',
          'Verificar que no tienen fugas en el sistema de drenaje',
          'Verificar el indicador de estado de la válvula',
          'Asegurarse que la etiqueta con datos del cálculo hidráulico está legible',
          'Verificar que cada válvula de control tiene sujeta una tarjeta con precinto frangible'
        ]
      },
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'PRUEBA DE DRENAJE:',
          'Anotar la presión estática del abastecimiento de agua',
          'Abrir la válvula de drenaje principal completamente',
          'Anotar la presión residual del abastecimiento de agua mientras el agua fluye',
          'Cerrar lentamente el drenaje',
          'Verificar el funcionamiento del flow switch',
          'Verificar el reporte a la central de incendio',
          'Si la pérdida de presión es mayor al 10% investigar las causas',
          'PRUEBA EN VÁLVULA DE CORTE:',
          'Cerrar válvula y abrir hasta el tope',
          'Cerrar la válvula ¼ de vuelta para prevenir obturaciones',
          'PRUEBA DE FLUJO DE AGUA DE ALARMAS:',
          'Probar la alarma abriendo la conexión de prueba de inspección',
          'Verificar en la central de incendio la señal emitida por los flow switch'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Se ejercitará el funcionamiento y lubricará las partes móviles de las válvulas',
          'INSPECCIONAR EN LOS ROCIADORES:',
          'Verificar que estén libres de corrosión',
          'Verificar que no posea obstrucción del deflector',
          'Verificar que no estén bloqueados por materiales almacenados',
          'Verificar materiales extraños (pintura)',
          'Verificar que no posean daños físicos'
        ]
      },
      {
        label: 'Quinquenal',
        color: '#8b5cf6',
        tareas: [
          'Se probarán los manómetros por comparación con uno calibrado',
          'Los manómetros que se desvíen en más de un 3% serán recalibrados o sustituidos',
          'INSPECCIONAR EN LAS CAÑERÍAS DE LOS ROCIADORES:',
          'Verificar que estén en buenas condiciones, libres de daños físicos',
          'Verificar que no gotean',
          'Verificar que no presenten corrosión',
          'Verificar que no estén desalineadas',
          'Verificar que no estén sujetas a cargas extremas',
          'Verificar que sus soportes y abrazaderas antisísmicas no presenten daños'
        ]
      }
    ]
  },

  sensores_flujo: {
    id: 'sensores-flujo',
    nombre: 'Sensores de Flujo',
    tipo: 'Sistemas de Extinción',
    icon: '📊',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Verificar que el dispositivo se encuentre libre de daños físicos',
          'Verificar integridad física de conexión eléctrica'
        ]
      },
      {
        label: 'Semestral',
        color: '#f59e0b',
        tareas: [
          'Probar el dispositivo abriendo la válvula de prueba de inspector',
          'Si es un dispositivo en tubería seca, de acción previa o de diluvio, realizar la prueba con conexión de derivación',
          'Si el dispositivo se encuentra en condiciones climáticas de helada, utilizar la conexión por derivación'
        ]
      }
    ]
  },

  bocas_incendio_equipadas: {
    id: 'bocas-incendio-equipadas',
    nombre: 'Bocas de Incendio Equipadas',
    tipo: 'Sistemas de Extinción',
    icon: '🚨',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Inspeccionar si las válvulas interceptoras están precintadas',
          'Inspeccionar manómetros si están operativos y no están dañados',
          'Verificar que el volante exista y esté sano',
          'Verificar que la salida roscada para mangas esté sana y operable',
          'Verificar que no existen fugas en la conexión a la cañería y en la válvula',
          'Verificar que los elementos complementarios (manga, lanza, boquilla) estén armados',
          'Verificar presencia de llave de ajuste o llave de unión',
          'Verificar presencia de martillo para rotura de vidrio o llave de apertura',
          'Inspeccionar los dispositivos reguladores de presión',
          'Verificar que las válvulas habilitantes o de servicio estén abiertas',
          'Verificar que los manómetros están en condiciones de lectura',
          'Si poseen válvula piloto, verificar que se halle en condiciones de uso',
          'Revisar visualmente que las mangas no presenten daños',
          'Verificar cartelería de señalización en altura',
          'Inspeccionar que las conexiones para el servicio de los bomberos estén accesibles'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'INSPECCIÓN:',
          'Verificar estado del gabinete, sus bisagras, vidrio, pintura, sellado',
          'Verificar el drenaje (libre de obstrucción)',
          'Verificar estado del soporte para almacenamiento de la manguera',
          'Verificar estado de manga y su conexión',
          'Verificar estado de lanza y boquilla',
          'Verificar estado de válvula de manguera',
          'Verificar estado de empaquetadura y asiento',
          'Verificar estado de tubería',
          'Verificar dispositivo regulador de presión',
          'Verificar existencia del plano del diseño hidráulico',
          'MANTENIMIENTO:',
          'Retirar las mangueras de sus soportes y estibar de nuevo según IRAM 3594',
          'Verificar las juntas de las uniones de todos los elementos',
          'Lubricar con grafito o grafito con aceite ligero',
          'Comprobar giro de las boquillas chorro pleno/niebla',
          'Lubricar puntos giratorios de las devanaderas',
          'Verificar estado de cartelería de señalización'
        ]
      },
      {
        label: 'Bienal',
        color: '#8b5cf6',
        tareas: [
          'Cambio de obturador de válvula (si es de goma)'
        ]
      }
    ]
  },

  postes_hidrantes: {
    id: 'postes-hidrantes',
    nombre: 'Postes Hidrantes',
    tipo: 'Sistemas de Extinción',
    icon: '🔴',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Operar el poste hidráulico para constatar su funcionamiento',
          'Verificar que esté libre de obstrucciones',
          'Verificar que las tapas ciegas o tapones estén en su lugar y giren libremente',
          'Verificar el estado de cadenas de sujeción'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Lubricar partes móviles',
          'Lubricar tuercas de apertura',
          'Verificar estado de cadenas de tapas (reparar o cambiar si corresponde)',
          'Verificar la presencia de tapas ciegas',
          'Verificar estanqueidad de la expulsión',
          'Verificar estado de conexión de manguera',
          'Inspeccionar que las roscas de las salidas no estén dañadas',
          'Verificar que la tuerca de apertura no esté gastada',
          'Verificar presencia de corrosión',
          'Verificar estado de la pintura',
          'Verificar ausencia de fugas, grietas en el cuerpo',
          'Verificar accesibilidad',
          'Verificar presencia de señalización en altura y su estado',
          'Verificar estado del cartel de señalización',
          'Verificar señalización horizontal en piso',
          'Verificar existencias de llaves de aperturas en SSEI',
          'Verificar existencia de llaves de apertura en reserva de mantenimiento'
        ]
      }
    ]
  },

  matafuegos_extintores: {
    id: 'matafuegos-extintores',
    nombre: 'Matafuegos/Extintores',
    tipo: 'Sistemas de Extinción',
    icon: '🧯',
    frecuencias: [
      {
        label: 'Trimestral',
        color: '#3b82f6',
        tareas: [
          'Realizar el mantenimiento según IRAM 3517 parte 2',
          'Verificar la presión por observación del manómetro',
          'Verificación externa de partes mecánicas',
          'Verificar la válvula',
          'Verificar el precinto',
          'Verificar la manga',
          'Verificar señalización'
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        tareas: [
          'Anualmente verificar estado de carga cumpliendo con IRAM 3517 parte 2',
          'Recambiar el marbete con el servicio de mantenimiento y recarga',
          'Verificar que sea el marbete adecuado'
        ]
      },
      {
        label: 'Quinquenal',
        color: '#8b5cf6',
        tareas: [
          'Realizar ensayo hidrostático de deformación',
          'Realizar verificación interna cumpliendo con IRAM 3517 parte 2 punto 4.3'
        ]
      }
    ]
  }
};
