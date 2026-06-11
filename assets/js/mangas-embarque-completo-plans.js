/* Mangas de Embarque - Planes de Mantenimiento Completos */

const MANGAS_EMBARQUE_COMPLETO_PLANS = {
  adelte_hidraulica: {
    id: 'Manga Hidráulica ADELTE',
    nombre: 'Manga de Embarque Hidráulica ADELTE',
    tipo: 'Manga Hidráulica',
    icon: '🛬',
    frecuenciasDetalladas: [
      {
        label: 'Diaria',
        color: '#06b6d4',
        grupos: [
          {
            nombre: 'Inspección General Exterior',
            tareas: [
              'Inspección visual exterior de reflectores y balizas',
              'Inspección visual exterior de tren de ruedas',
              'Inspección visual exterior de pasarela/rotonda/cabina',
              'Inspección visual exterior de vidrios',
              'Inspección visual exterior de persianas',
              'Inspección visual exterior de bandeja porta cables',
              'Inspección visual exterior de pórtico/columnas elevación',
              'Inspección visual exterior de fuelle'
            ]
          },
          {
            nombre: 'Escaleras y Puertas',
            tareas: [
              'Inspección visual exterior de ruedas de escalera servicio',
              'Inspección visual exterior de escalera de servicio',
              'Inspección visual exterior de puerta de servicio'
            ]
          },
          {
            nombre: 'Zona Interior',
            tareas: [
              'Inspección visual interior de carpintería',
              'Inspección visual interior de pisos',
              'Inspección visual interior de limpieza'
            ]
          },
          {
            nombre: 'Tablero Principal',
            tareas: [
              'Inspección visual general',
              'Estado de señales visuales y mensajes informativos',
              'Verificar ausencia de alarmas en PLC',
              'Verificar condición normal de UPS'
            ]
          },
          {
            nombre: 'Panel de Control',
            tareas: [
              'Inspección general visual',
              'Estado de señales visuales y sonoras en pantalla',
              'Comprobar el funcionamiento del HMI, llaves, botones, selectores, luces piloto y timbres',
              'Comprobar el estado de las balizas del fuelle',
              'Comprobar el funcionamiento de las luces de movimiento',
              'Comprobar el funcionamiento de las señales acústicas exteriores',
              'Comprobar la sincronización del reloj digital NTP',
              'Comprobar el funcionamiento de las luces de emergencia (Resetear la línea de emergencia)'
            ]
          },
          {
            nombre: 'Servicios Generales',
            tareas: [
              'Comprobar el funcionamiento de la luz interna',
              'Comprobar el funcionamiento de la luz de emergencia',
              'Comprobar el funcionamiento de la luz externa',
              'Comprobar el funcionamiento de la luz de la escalera de servicio'
            ]
          },
          {
            nombre: 'Sistemas de Movimiento',
            tareas: [
              'Grupo traslación: Prueba de funcionamiento verificando ausencia de fricción, ruidos anormales y alarmas',
              'Grupo traslación: Verificar funcionamiento de avisos visuales y sonoros',
              'Rotación rotonda: Comprobación del sistema verificando ausencia de fricción o ruidos anormales',
              'Rotación rotonda: Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites',
              'Extensión de túneles: Comprobación del sistema verificando ausencia de fricción o ruidos anormales y alarmas',
              'Extensión de túneles: Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites'
            ]
          },
          {
            nombre: 'Bandeja y Elevación',
            tareas: [
              'Bandeja de cables: Verificar ausencia de fricción o ruidos anormales durante desplazamiento',
              'Elevación Hidráulica: Prueba funcionamiento del sistema verificando ausencia de roces, ruidos anormales y alarmas'
            ]
          },
          {
            nombre: 'Cabina y Plataforma',
            tareas: [
              'Rotación de cabina: Prueba de funcionamiento del sistema verificando ausencia de fricción y ruidos anormales',
              'Rotación de cabina: Verificar funcionamiento de avisos visuales y sonoros por proximidad de límites',
              'Plataforma de nivelación: Prueba de funcionamiento del sistema verificando ausencia de fricción y ruidos anormales',
              'Brazo autonivelador: Colocar en modo autonivel y verificar extensión de brazo autonivelador'
            ]
          },
          {
            nombre: 'Fuelle y Puerta',
            tareas: [
              'Fuelle: Desplegar fuelle verificando ausencia de ruidos y vibraciones extrañas',
              'Fuelle: Comprobar que al alcanzar los límites del final de carrera (+) y (-) el movimiento se detiene',
              'Puerta frontal: Verificar funcionamiento e imposibilidad de operar manga con la puerta abierta'
            ]
          },
          {
            nombre: 'Reporte Diario',
            tareas: [
              'Notificar OT indicando novedades halladas de existir, de lo contrario notificar indicando "Sin Novedades"'
            ]
          }
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        grupos: [
          {
            nombre: 'Registro y Tableros',
            tareas: [
              'Verificar y registrar horas de funcionamiento',
              'Tableros Eléctricos: Verificar limpieza interna',
              'Tableros Eléctricos: Estado de los dibujos técnicos dentro del armario',
              'Tableros Eléctricos: Estado de las cerraduras de la puerta'
            ]
          },
          {
            nombre: 'Panel de Control e Inspecciones',
            tareas: [
              'Panel de Control: Inspección general visual',
              'Panel de Control: Comprobar historial de mensajes y alarmas',
              'Grupo traslación: Verificar estado de carteles informativos y señales visuales'
            ]
          },
          {
            nombre: 'Elevación Hidráulica',
            tareas: [
              'Elevación Hidráulica: Inspección visual del tablero de la central hidráulica',
              'Elevación Hidráulica: Verificar limpieza interior',
              'Elevación Hidráulica: Estado de carteles informativos y señalizaciones visuales',
              'Elevación Hidráulica: Estado esquemas en interior de tablero',
              'Elevación Hidráulica: Estado cierre puertas'
            ]
          },
          {
            nombre: 'Rotación y Plataforma',
            tareas: [
              'Rotación de cabina: Comprobación de los sensores y el funcionamiento de los finales de carrera',
              'Plataforma de nivelación: Inspección visual general',
              'Plataforma de nivelación: Prueba de funcionamiento del sistema (ausencia de fricción y ruidos anormales)',
              'Plataforma de nivelación: Comprobación de los sensores y el funcionamiento de los finales de carrera',
              'Plataforma de nivelación: Comprobación del sensor de inclinación',
              'Plataforma de nivelación: Comprobar los límites de carrera internos'
            ]
          },
          {
            nombre: 'Brazo y Fuelle',
            tareas: [
              'Brazo autonivelador: Inspección visual general',
              'Brazo autonivelador: Comprobación de los sensores y funcionamiento de los finales de carrera',
              'Fuelle: Verificar ausencia de filtraciones y zona de apoyo con fuselaje'
            ]
          },
          {
            nombre: 'Escaleras y Persianas',
            tareas: [
              'Escaleras de servicio: Comprobar el estado de la señalización',
              'Lamas de persianas: Inspección visual general',
              'Lamas de persianas: Prueba de funcionamiento del sistema (ausencia de fricción y ruidos anormales)'
            ]
          },
          {
            nombre: 'Reporte Mensual',
            tareas: [
              'Notificar OT indicando novedades halladas de existir, de lo contrario notificar indicando "Sin Novedades"'
            ]
          }
        ]
      },
      {
        label: 'Trimestral',
        color: '#8b5cf6',
        grupos: [
          {
            nombre: 'Inspección Estructural',
            tareas: [
              'General: Zona Exterior: Verificar el estado del techo, filtraciones y estancamiento de agua',
              'General: Zona Interior: Verificar el estado de las juntas (estructura, guías de nylon)',
              'General: Zona Interior: Verificar el estado de los cristales (fijaciones, sellados y juntas)',
              'General: Zona Interior: Verificar el estado del suelo (áreas desprendidas, desgastadas)',
              'General: Zona Interior: Verificar el estado del techo (daños, zonas desprendidas, signos de humedad)'
            ]
          },
          {
            nombre: 'Componentes Interiores',
            tareas: [
              'General: Zona Interior: Verificar el estado de los pasamanos (pérdida de partes, óxido y manchas)',
              'General: Zona Interior: Verificar el estado de las bisagras y sujeción de tornillos de las rampas intermedias',
              'General: Zona Interior: Verificar entradas de agua (señales de fuga)'
            ]
          },
          {
            nombre: 'Tableros Eléctricos',
            tareas: [
              'Tableros Eléctricos: Comprobar la funcionalidad de la luz interna',
              'Tableros Eléctricos: Comprobar la funcionalidad del enchufe',
              'Tableros Eléctricos: Comprobar el funcionamiento del termostato del ventilador ajustado a 25ºC',
              'Tableros Eléctricos: Comprobar el funcionamiento del termostato de la calefacción ajustado a 5ºC',
              'Tableros Eléctricos: Comprobar el ajuste y la función de los protectores de los diferenciales',
              'Tableros Eléctricos: Comprobar los filtros',
              'Tableros Eléctricos: Comprobar estanqueidad',
              'Tableros Eléctricos: Comprobar todas las conexiones eléctricas (terminal, sellado y etiquetado de cables)',
              'Tableros Eléctricos: Limpiar el interior del armario (aspiradora)',
              'Tableros Eléctricos: Limpiar los filtros o cambiarlos si fuera necesario'
            ]
          },
          {
            nombre: 'Panel de Control',
            tareas: [
              'Panel de Control: Prueba de uso con movimientos guiados de HMI',
              'Panel de Control: Comprobar el funcionamiento de la llave bypass para los finales de carrera de seguridad',
              'Panel de Control: Comprobar el historial de mensajes y alarmas',
              'Panel de Control: Comprobar el contador de las horas de último mantenimiento (resetear)',
              'Panel de Control: Comprobar los cristales exteriores (comprobación visual)'
            ]
          },
          {
            nombre: 'Sistema Autonivel',
            tareas: [
              'Autonivel: Desplegar brazo de autonivel',
              'Autonivel: Simular contacto de aeronave a través del brazo autonivelador (detenerlo manualmente)',
              'Autonivel: Simular movimiento de subida de la aeronave (comprobar respuesta ascendente de pasarela)',
              'Autonivel: Simular movimiento descendente de la aeronave (comprobar respuesta descendente de pasarela)',
              'Autonivel: Simular movimiento ascendente durante 5 segundos (comprobar activación de alarma)',
              'Autonivel: Poner la llave en la posición ON, resetear la alarma y volver a la posición AUTO',
              'Autonivel: Activar primer nivel de seguridad de safety shoe (comprobar retracción de brazo autonivelador y descenso de pasarela)'
            ]
          },
          {
            nombre: 'Servicios Generales',
            tareas: [
              'Servicios Generales: Comprobar el funcionamiento de los sensores de movimiento',
              'Servicios Generales: Comprobar el funcionamiento de los sensores de oscuridad',
              'Servicios Generales: Comprobar tensión del enchufe interior',
              'Servicios Generales: Comprobar tensión del enchufe exterior',
              'Servicios Generales: Comprobar el estado de la CCTV (soporte, caja, cables, limpieza de cristales, calefactor)',
              'Servicios Generales: Comprobar el funcionamiento de la CCTV (imagen nítida en el monitor)',
              'Servicios Generales: Comprobar el funcionamiento del sistema PA (botón verde de emergencia)',
              'Servicios Generales: Comprobar el funcionamiento del teléfono de cabina',
              'Servicios Generales: Comprobar el funcionamiento del carrete de cable de puesta a tierra'
            ]
          },
          {
            nombre: 'Sistema de Traslación',
            tareas: [
              'Grupo traslación: Prueba de funcionamiento de los sensores y límites de finales de carrera',
              'Grupo traslación: Prueba de funcionamiento de los sensores (fotocélulas, US y decodificadores)',
              'Grupo traslación: Prueba de funcionamiento de la UPS (cortar la potencia principal 400V)',
              'Grupo traslación: Comprobar conjunto motor (señales de fuga, depósito de aceite)',
              'Grupo traslación: Comprobar el funcionamiento del motor de frenado',
              'Grupo traslación: Comprobar el estado de las llantas y parachoques'
            ]
          },
          {
            nombre: 'Lubrificación y Mantenimiento',
            tareas: [
              'Grupo traslación: Eliminar previamente el exceso de lubricante y limpiar la suciedad en caso que fuese necesario',
              'Grupo traslación: Lubricar corona de rotación',
              'Rotación rotonda: Comprobación de los sensores y el funcionamiento de los finales de carrera',
              'Rotación rotonda: Comprobación de los sensores de mediciones (fotocélulas, US y decodificadores)',
              'Rotación rotonda: Revisar las chapas de la unión al edificio',
              'Rotación rotonda: Comprobar los neumáticos y placas dónde se vierte el agua (sellado)',
              'Rotación rotonda: Eliminar previamente el exceso de lubricante y limpiar la suciedad (si es necesario)',
              'Rotación rotonda: Lubricar los cojinetes de la corona de rotación'
            ]
          },
          {
            nombre: 'Túneles y Cables',
            tareas: [
              'Extensión de túneles: Comprobación de los sensores y el funcionamiento de los finales de carrera',
              'Extensión de túneles: Comprobación de los sensores de mediciones (fotocélulas, US y decodificadores)',
              'Extensión de túneles: Comprobar el estado de los cepillos y juntas de goma',
              'Extensión de túneles: Comprobar los canales de drenaje (limpiar y comprobar daños)',
              'Extensión de túneles: Comprobar el apriete de los tornillos y de las chapas y fijación de los tornillos a la estructura del túnel (es muy importante esta verificación)',
              'Extensión de túneles: Eliminar previamente el exceso de lubricante y limpiar la suciedad (si es necesario)',
              'Extensión de túneles: Lubricar rodillos de túnel (ver puntos de lubricación en manual)',
              'Bandeja de cables: Revisar soporte y fijaciones',
              'Bandeja de cables: Revisar el estado de los cables'
            ]
          },
          {
            nombre: 'Elevación Hidráulica - Sensores',
            tareas: [
              'Elevación Hidráulica: Prueba funcionamiento de los sensores y finales de carrera operacionales',
              'Elevación Hidráulica: Prueba funcionamiento de los sensores de medida (fotocélulas, US y encoders)',
              'Elevación Hidráulica: Revisar los elementos de guiado (alineación y desgaste de los patines de nylon)',
              'Elevación Hidráulica: Verificar funcionamiento sistema emergencia (bomba manual)',
              'Elevación Hidráulica: Revisar estado capuchones, válvulas y tornillos de ajuste'
            ]
          },
          {
            nombre: 'Elevación Hidráulica - Tuberías',
            tareas: [
              'Elevación Hidráulica: Revisar estado tuberías, latiguillos, racores (óxido, fugas y grietas)',
              'Elevación Hidráulica: Revisar estado recubrimiento vástago cilindros (picadas)',
              'Elevación Hidráulica: Comprobar funcionamiento luz interior',
              'Elevación Hidráulica: Retirar previamente excesos de lubricante y limpiar suciedad (en caso necesario)',
              'Elevación Hidráulica: Engrasar guiado nylon por las caras del pórtico (mover en todo el recorrido)'
            ]
          },
          {
            nombre: 'Cabina - Giro',
            tareas: [
              'Rotación de cabina: Comprobación de los sensores de mediciones (fotocélulas, US y decodificadores)',
              'Rotación de cabina: Comprobar los elementos guía',
              'Rotación de cabina: Comprobar motorreductor (señales de fuga, depósito de aceite)',
              'Rotación de cabina: Comprobar el funcionamiento del motor de frenado',
              'Rotación de cabina: Comprobar el nivel entre el suelo y el cuerpo de la cabina (fija y móvil)'
            ]
          },
          {
            nombre: 'Cabina - Lubricación',
            tareas: [
              'Rotación de cabina: Eliminar previamente el exceso de lubricante y limpiar la suciedad (si es necesario)',
              'Rotación de cabina: Lubricar el cojinete superior e inferior del husillo',
              'Rotación de cabina: Lubricar el mecanismo de tracción (cadena y piñones)'
            ]
          },
          {
            nombre: 'Plataforma y Brazo',
            tareas: [
              'Plataforma de nivelación: Comprobar soportes y fijaciones',
              'Plataforma de nivelación: Comprobar el actuador',
              'Plataforma de nivelación: Eliminar previamente el exceso de lubricante y limpiar la suciedad (si es necesario)',
              'Plataforma de nivelación: Lubricar el actuador y juntas de rotación',
              'Brazo autonivelador: Comprobar el actuador (debe estar bien apretado)',
              'Brazo autonivelador: Comprobar el motor',
              'Brazo autonivelador: Comprobar el estado de la rueda de contacto'
            ]
          },
          {
            nombre: 'Fuelle',
            tareas: [
              'Fuelle: Comprobar el soporte y las fijaciones',
              'Fuelle: Comprobar el estado del actuador lineal',
              'Fuelle: Comprobar el sistema de rodadura del motor',
              'Fuelle: Comprobar el estado de la correa (guía, fijaciones y fisuras)',
              'Fuelle: Comprobar el estado del fuelle (apoyo con fuselaje, lona, guías nylon)',
              'Fuelle: Eliminar previamente el exceso de lubricante y limpiar la suciedad (si es necesario)',
              'Fuelle: Lubricar los actuadores lineales',
              'Fuelle: Lubricar las bisagras y las articulaciones del fuelle'
            ]
          },
          {
            nombre: 'Escaleras y Puertas',
            tareas: [
              'Escaleras de servicio: Comprobación general',
              'Escaleras de servicio: Comprobar la puerta de servicio (cerrado, pomo, bisagras y cristales)',
              'Escaleras de servicio: Comprobar los bulones de la escalera (óxido y fijación)',
              'Puerta de la cabina: Comprobar el mecanismo de cerrado, el pomo de la puerta, cristales y bisagras',
              'Puerta de la cabina: Eliminar el exceso de lubricante y limpiar (sólo si fuese necesario)',
              'Puerta de la cabina: Lubricar articulaciones y bisagras'
            ]
          },
          {
            nombre: 'Lamas',
            tareas: [
              'Lamas: Comprobar las lamas de aluminio',
              'Lamas: Comprobar la tensión mecánica',
              'Lamas: Comprobar la guía de las lamas',
              'Lamas: Eliminar el exceso de lubricante y limpiar (sólo si fuese necesario)',
              'Lamas: Engrasar el soporte de las lamas y el eje',
              'Lamas: Lubricar el sistema de tensionamiento de las lamas',
              'Lamas: Lubricar los puntos interiores de fricción de las lamas',
              'Lamas: Lubricar las articulaciones de las lamas'
            ]
          },
          {
            nombre: 'Reporte Trimestral',
            tareas: [
              'Notificar OT indicando novedades halladas de existir, de lo contrario notificar indicando "Sin Novedades"'
            ]
          }
        ]
      },
      {
        label: 'Semestral',
        color: '#ec4899',
        grupos: [
          {
            nombre: 'Tableros y Finales de Carrera',
            tareas: [
              'Tableros Eléctricos: Lubricar articulaciones (bisagras)',
              'Tableros Eléctricos: Comprobar las fijaciones',
              'Panel de Control: Comprobar la versión software instalada, registrar en OT'
            ]
          },
          {
            nombre: 'Sistema de Traslación - Inspección',
            tareas: [
              'Grupo traslación: Inspección visual del funcionamiento de los límites de carrera y su seguridad; observando que están alineados con sus levas de accionamiento',
              'Grupo traslación: Prueba de funcionamiento de los límites de carrera (+) y (-) comprobando si se corta la potencia cuando no están trabajando correctamente',
              'Grupo traslación: Lubricar partes mecánicas de los finales de carrera',
              'Grupo traslación: Comprobar la caja de conexiones del motor (sellado, óxido, cables y terminales)'
            ]
          },
          {
            nombre: 'Sistema de Traslación - Mediciones',
            tareas: [
              'Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L1',
              'Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L2',
              'Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L3',
              'Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L1',
              'Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L2',
              'Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L3',
              'Verificar desgaste, medir y registrar el diámetro exterior en mm de la rueda izquierda (visto desde cabina)',
              'Verificar desgaste, medir y registrar el diámetro exterior en mm de la rueda derecha (visto desde cabina)'
            ]
          },
          {
            nombre: 'Rotonda - Inspección',
            tareas: [
              'Rotación rotonda: Inspección visual del funcionamiento de los límites de carrera y su seguridad; observando que están alineadas con sus respectivas levas',
              'Rotación rotonda: Alcanzar los límites de finales de carrera (+) y (-) y comprobar que la línea de emergencia trabaja correctamente (resetear)',
              'Rotación rotonda: Lubricar las partes mecánicas de los finales de carrera'
            ]
          },
          {
            nombre: 'Túneles - Inspección',
            tareas: [
              'Extensión de túneles: Inspección visual del funcionamiento de los límites de carrera y su seguridad; observando que están alineadas con sus respectivas levas',
              'Extensión de túneles: Alcanzar los límites de finales de carrera (+) y (-) y comprobar que la línea de emergencia trabaja correctamente (resetear)',
              'Extensión de túneles: Lubricar las partes mecánicas de los finales de carrera',
              'Extensión de túneles: Lubricar las guías de los cuerpos de extensión (mover a lo largo de su recorrido)'
            ]
          },
          {
            nombre: 'Elevación Hidráulica',
            tareas: [
              'Elevación Hidráulica: Inspección visual de que los finales de carrera tanto operacionales como de seguridad están alineados con sus respectivas levas accionadoras',
              'Elevación Hidráulica: Comprobar que los finales de carrera seguridad (+) y (-) cortan la serie (rearmar)',
              'Elevación Hidráulica: Revisar estado sujeciones (silent blocks)',
              'Elevación Hidráulica: Comprobar nivel aceite',
              'Elevación Hidráulica: Comprobar que los movimientos se producen con suavidad, sin amortiguaciones',
              'Elevación Hidráulica: Comprobar fugas internas en cilindros (no hay desplazamiento vástago en parado)',
              'Elevación Hidráulica: Comprobar presión de precarga en los acumuladores de gas'
            ]
          },
          {
            nombre: 'Elevación Hidráulica - Mantenimiento',
            tareas: [
              'Elevación Hidráulica: Revisar estado de la cadena portacables',
              'Elevación Hidráulica: Lubricar articulaciones (bisagras)',
              'Elevación Hidráulica: Lubricar accionamientos mecánicos finales de carrera',
              'Elevación Hidráulica: Comprobar aire en cilindros y purgar si es necesario'
            ]
          },
          {
            nombre: 'Cabina - Giro',
            tareas: [
              'Rotación de cabina: Lubricar las partes mecánicas de los finales de carrera',
              'Rotación de cabina: Lubricar las guías (moverlas a lo largo de su recorrido)',
              'Rotación de cabina: Comprobar la conexión a la caja del motor (sellado, óxido, cables y terminales)',
              'Cabina: Inspección visual y comprobar el correcto funcionamiento del Motor de giro de cabina',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L1',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L2',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L3'
            ]
          },
          {
            nombre: 'Cabina - Capota',
            tareas: [
              'Cabina: Inspección visual y comprobar el correcto funcionamiento del Motor de capota izquierdo (visto desde cabina). Medir y registrar consumo de corriente.',
              'Cabina: Inspección visual y comprobar el correcto funcionamiento del Motor de capota derecho (visto desde cabina). Medir y registrar consumo de corriente.'
            ]
          },
          {
            nombre: 'Brazo Autonivelador',
            tareas: [
              'Inspección visual y comprobar el correcto funcionamiento del Brazo Autonivelador',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L1',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L2',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L3'
            ]
          },
          {
            nombre: 'Plataforma y Escaleras',
            tareas: [
              'Cabina: Inspección visual y comprobar el correcto funcionamiento del Suelo basculante y su motor (Medir y registrar consumo de corriente).',
              'Escaleras de servicio: Engrasar las ruedas de la escalera de servicio',
              'Escaleras de servicio: Lubricar articulaciones y bisagras'
            ]
          },
          {
            nombre: 'Reporte Semestral',
            tareas: [
              'Notificar OT indicando novedades halladas de existir, de lo contrario notificar indicando "Sin Novedades"'
            ]
          }
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        grupos: [
          {
            nombre: 'Exterior - Estructura',
            tareas: [
              'General: Zona Exterior: Comprobar estado de la pintura y posible óxido. Pintar de ser necesario',
              'General: Zona Exterior: Verificar el estado general de la estructura (ajuste de placas)',
              'General: Zona Exterior: Verificar el estado del soldado de la estructura (juntas)'
            ]
          },
          {
            nombre: 'Tableros Eléctricos',
            tareas: [
              'Tableros Eléctricos: Comprobar cableado y etiquetas de equipos (sin modificación)',
              'Tableros Eléctricos: Comprobar la conexión a tierra',
              'Tableros Eléctricos: Comprobar protecciones eléctricas y relés',
              'Tableros Eléctricos: Comprobar la correcta conexión',
              'Tableros Eléctricos: Tomar medidas termográficas (sin puntos calientes de trabajo Tª)'
            ]
          },
          {
            nombre: 'Panel y Sistema de Traslación',
            tareas: [
              'Panel de Control: Limpiar el panel',
              'Grupo traslación: Comprobar (visualmente) el nivel y calidad del aceite de motorreductores',
              'Grupo traslación: Comprobar los discos de los frenos',
              'Grupo traslación: Comprobar parámetros inversores',
              'Grupo traslación: Tomar medidas eléctricas (consumos)'
            ]
          },
          {
            nombre: 'Bandeja de Cables y Elevación',
            tareas: [
              'Bandeja de cables: Limpiar centro de la bandeja (suciedad acumulada)',
              'Elevación Hidráulica: Revisar estado filtros (aspiración y retorno)',
              'Elevación Hidráulica: Revisar etiquetado de latiguillos y válvulas (sin ninguna modificación)',
              'Elevación Hidráulica: Revisar etiquetas del cableado y equipamiento (sin ninguna modificación)'
            ]
          },
          {
            nombre: 'Elevación Hidráulica - Mantenimiento',
            tareas: [
              'Elevación Hidráulica: Realizar un desatraque de emergencia completo mediante la bomba manual',
              'Elevación Hidráulica: Limpiar filtros o reemplazar si es necesario (aspiración y retorno)',
              'Elevación Hidráulica: Comprobar apriete sujeciones de la tubería'
            ]
          },
          {
            nombre: 'Rotación de Cabina',
            tareas: [
              'Rotación de cabina: Comprobar el nivel del aceite del motor',
              'Rotación de cabina: Comprobar el desgaste de los frenos',
              'Rotación de cabina: Comprobar motorreductor',
              'Rotación de cabina: Comprobar consumos eléctricos'
            ]
          },
          {
            nombre: 'Reporte Anual',
            tareas: [
              'Notificar OT indicando novedades halladas de existir, de lo contrario notificar indicando "Sin Novedades"'
            ]
          }
        ]
      },
      {
        label: 'Anual (Análisis MOEX)',
        color: '#f59e0b',
        grupos: [
          {
            nombre: 'Toma de Muestra y Análisis',
            tareas: [
              'Tomar una muestra de fluido hidráulico para su análisis. Drenar, limpiar y completar nivel si es necesario.',
              'Producto: BIOVESTA HM-46'
            ]
          },
          {
            nombre: 'Parámetros de Análisis',
            tareas: [
              'Agua Crackle Test: [..............] % [Referencia: < 0,2]',
              'Viscosidad a 40°C: [..............] CST [Referencia: > 12]',
              'Número Total de Acidez (TAN) ASTM D974: [..............] mgKOH/g [Referencia: < 2]',
              'ISO 4406 part./ml ≥ 4 μm: [..............] adim. [Referencia: ≤ 20]',
              'ISO 4406 part./ml ≥ 10 μm: [..............] adim. [Referencia: ≤ 16]',
              'ISO 4406 part./ml ≥ 14 μm: [..............] adim. [Referencia: ≤ 13]',
              'Índice PQ: [..............] grsFe/L [Referencia: > 25]'
            ]
          },
          {
            nombre: 'Aditivos',
            tareas: [
              'Aditivo Bario (Ba): [..............] ppm [Referencia: = 0]',
              'Aditivo Boro (B): [..............] ppm [Referencia: = 0]',
              'Aditivo Calcio (Ca): [..............] ppm',
              'Aditivo Magnesio (Mg): [..............] ppm',
              'Aditivo Fosforo (P): [..............] ppm',
              'Aditivo Zinc (Zn): [..............] ppm'
            ]
          },
          {
            nombre: 'Desgastes',
            tareas: [
              'Desgastes Plata (Ag): [..............] ppm [Referencia: = 0]',
              'Desgastes Aluminio (Al): [..............] ppm [Referencia: < 5]',
              'Desgastes Cromo (Cr): [..............] ppm [Referencia: < 3]',
              'Desgastes Cobre (Cu): [..............] ppm [Referencia: < 15]',
              'Desgastes Hierro (Fe): [..............] ppm [Referencia: < 20]',
              'Desgastes Molibdeno (Mo): [..............] ppm [Referencia: = 0]',
              'Desgastes Níquel (Ni): [..............] ppm [Referencia: = 0]',
              'Desgastes Plomo (Pb): [..............] ppm [Referencia: < 5]',
              'Desgastes Estaño (Sn): [..............] ppm [Referencia: = 0]',
              'Desgastes Titanio (Ti): [..............] ppm'
            ]
          },
          {
            nombre: 'Contaminantes',
            tareas: [
              'Contaminante Potasio (Ka): [..............] ppm [Referencia: = 0]',
              'Contaminante Sodio (Na): [..............] ppm [Referencia: < 10]',
              'Contaminante Silicio (Si): [..............] ppm [Referencia: < 15]',
              'Contaminante Vanadio (V): [..............] ppm [Referencia: = 0]'
            ]
          }
        ]
      },
      {
        label: 'Bienal',
        color: '#a78bfa',
        grupos: [
          {
            nombre: 'Cambios de Aceite',
            tareas: [
              'Grupo traslación: Comprobar el apriete de los tornillos de las ruedas (Verificar torque, tornillos M16x2x12 (calidad 10.9): 33 Kgm y marcar su posición)',
              'Grupo traslación: Aceite de caja de engranajes planetario - Verificar último cambio de aceite / Reemplazar cada 4 años. Producto: ISO-220',
              'Rotación de cabina: Aceite de caja de engranajes - Verificar último cambio de aceite / Reemplazar cada 4 años. Producto: ISO-220'
            ]
          },
          {
            nombre: 'Reporte Bienal',
            tareas: [
              'Notificar OT indicando si se realizó el recambio del aceite de la caja de engranajes (rueda) y/o caja de engranajes (cabina)'
            ]
          }
        ]
      }
    ]
  },

  thyssen_2011_2013: {
    id: 'Manga Hidráulica Thyssen (2011-2013)',
    nombre: 'Mangas de Embarque Hidráulicas Thyssen (años 2011 a 2013)',
    tipo: 'Manga Hidráulica Thyssen',
    icon: '🛬',
    frecuenciasDetalladas: [
      {
        label: 'Diaria',
        color: '#06b6d4',
        grupos: [
          {
            nombre: 'Inspecciones Interiores',
            tareas: [
              'Interior: Inspección visual de la rampa entre túneles, comprobar posible zona de peligro de tropiezos',
              'Interior: Inspección visual de puerta de servicio, comprobar que no haya peligro de tropiezo',
              'Interior: Inspección visual y comprobación de que la puerta del armario principal se encuentre cerrada',
              'Interior: Verificación correcto funcionamiento de todas las luminarias'
            ]
          },
          {
            nombre: 'Inspecciones de Cabina',
            tareas: [
              'Cabina: Inspección visual de los espejos exteriores, comprobar que se encuentren limpios y correctamente orientados',
              'Cabina: Inspección visual de la capota, comprobar que la tela del fuelle y los bordes protectores estén en perfectas condiciones',
              'Cabina: Verificar correcto funcionamiento de los motores de la capota, comprobar que la misma se pueda recoger/extender',
              'Cabina: Verificar correcto funcionamiento y estado de todos los componentes del panel de control',
              'Cabina: Verificar correcto funcionamiento y estado del dispositivo de cierre de cabina',
              'Cabina: Verificar correcto funcionamiento y estado del brazo autonivelador'
            ]
          },
          {
            nombre: 'Inspecciones Exteriores',
            tareas: [
              'Exterior: Inspección visual y verificar correcto funcionamiento de la bandeja portacables, deben trabajar sin problemas ni presentar ruidos',
              'Exterior: Inspección visual completa de todo el exterior',
              'Exterior: Verificar correcto funcionamiento y que enciendan correctamente las luces de gálibo, luces de destello y focos'
            ]
          }
        ]
      },
      {
        label: 'Mensual',
        color: '#3b82f6',
        grupos: [
          {
            nombre: 'Registro y Verificación',
            tareas: [
              'Verificar y registrar horas de funcionamiento'
            ]
          },
          {
            nombre: 'Tareas Mecánicas',
            tareas: [
              'Inspeccionar todos los puntos de lubricación y rodamientos asociados por signos de daños, desgaste o contaminación',
              'Inspeccionar el exterior de la manga por daños u óxido',
              'Verificar todos los motores y reductores por montaje y nivel de fluidos, verificar operación apropiada',
              'Inspeccionar el transportador de cables, bandejas, rodaduras por daños. No lubricar',
              'Inspeccionar neumáticos por daños o uso excesivo (desgaste)',
              'Inspeccionar bulones de ruedas, bogie, pórtico y columnas de elevación por daños, pérdida de bulones o conexiones',
              'Inspeccionar mangueras de unidad de alta presión (HPU), manifold y cilindros de elevación por daños, fugas y pérdidas por guarniciones y conexiones. No volver la manga al servicio hasta que los problemas con la HPU hayan sido resueltos',
              'Chequear nivel de fluido hidráulico. Agregar si es necesario',
              'Inspeccionar cortina de rotonda, cadena, rodillos y componentes, por tensión, desgaste y correcta operación',
              'Inspeccionar cable ecualizador, guías y poleas por rajaduras, deshilachado u desgaste excesivo. Adjuntar tensión si es necesario',
              'Inspeccionar cortina de cabina, cadena, rodillos y componentes, por tensión, desgaste y correcta operación',
              'Inspeccionar motor de rotación de cabina, piñón y cadena por daños u desgaste'
            ]
          },
          {
            nombre: 'Tareas Electrónicas',
            tareas: [
              'Verificar la correcta operación del switch limite del paragolpes',
              'Testear receptáculo GCFI por correcta operación',
              'Inspeccionar drenajes del túnel y remover residuos',
              'Inspeccionar consola de control por daños, pérdidas de indicación, correcta operación e iluminación',
              'Inspeccionar las puertas de CC1 y PP1 por contaminación y pérdida de conexión. Verificar operación de enclavamiento de seguridad',
              'Chequear correas de dosel por desgaste y deshilachado',
              'Extender dosel y Verificar correcta operación del enclavamiento',
              'Verificar operación de la iluminación interior',
              'Verificar operación de iluminación de emergencia',
              'Verificar operación de la iluminación exterior de la plataforma de servicio, proyectores y luces exterior de cabina',
              'Verificar correcta operación del HMI, incluyendo posición del bogie, mensajes y peso de cabina. No retornar al servicio hasta que los problemas hayan sido corregidos',
              'Mover el bogie del límite izquierdo al derecho. Verificar correcta operación del reductor de velocidad y parada',
              'Elevar y bajar la manga hasta los límites. Verifica la correcta operación de los límites de pendiente. No retornar al servicio hasta que los problemas hayan sido corregidos',
              'Rotar la manga de derecha a izquierda hasta los límites. Verificar correcta operación del reductor de velocidad y parada',
              'Manualmente operar todas las articulaciones del piso de cabina hasta los límites. Asegurar el libre movimiento del piso sin atascos. Colocar el switch manual/automático en "automático". Verificar si el piso vuelve a su nivel',
              'Limpieza de conexiones en base de pilares de pórtico y manifold',
              'Colocar la llave en modo auto nivelación. Verificar extensión de brazo. Rotar la rueda en cada dirección',
              'Verificar correcta dirección de desplazamiento y falla de auto nivelación'
            ]
          }
        ]
      },
      {
        label: 'Semestral',
        color: '#ec4899',
        grupos: [
          {
            nombre: 'Mediciones Eléctricas - Cabina',
            tareas: [
              'Inspección visual y comprobar el correcto funcionamiento del Motor de giro de cabina',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L1',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L2',
              'Medir y registrar consumo de corriente del motor de giro de cabina - Fase L3',
              'Inspección visual y comprobar el correcto funcionamiento del Motor de capota izquierdo (visto desde cabina). Medir y registrar consumo de corriente',
              'Inspección visual y comprobar el correcto funcionamiento del Motor de capota derecho (visto desde cabina). Medir y registrar consumo de corriente',
              'Medir y registrar consumo del motor de la persiana'
            ]
          },
          {
            nombre: 'Mediciones Eléctricas - Otros',
            tareas: [
              'Inspección visual y comprobar el correcto funcionamiento del Brazo Autonivelador',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L1',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L2',
              'Medir y registrar consumo de corriente del motor del Brazo Autonivelador - Fase L3',
              'Inspección visual y comprobar el correcto funcionamiento del Suelo basculante y su motor (Medir y registrar consumo de corriente)'
            ]
          },
          {
            nombre: 'Sistema de Traslación',
            tareas: [
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L1',
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L2',
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda izquierda (visto desde cabina) - Fase L3',
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L1',
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L2',
              'Sistema de Traslación: Medir y registrar consumo de corriente del motor de tracción de la rueda derecha (visto desde cabina) - Fase L3',
              'Traslación: Verificar desgaste, medir y registrar el diámetro exterior en mm de la rueda izquierda (visto desde cabina)',
              'Traslación: Verificar desgaste, medir y registrar el diámetro exterior en mm de la rueda derecha (visto desde cabina)'
            ]
          },
          {
            nombre: 'Lubricación Semestral',
            tareas: [
              'Verificar mensual cumplido',
              'Completar la lista semestral de lubricación:',
              '  • Cadena de giro de cabina',
              '  • Cadenas de giro de cortinas de rotonda y cabina',
              '  • Rodamiento superior e inferior de cabina',
              '  • Rodamiento de rueda de bogie',
              '  • Bisagra y grampas del tablero exterior',
              '  • Punto de unión entre escalera y plataforma',
              '  • Bisagras de puerta de servicio',
              '  • Rodillos del túnel',
              '  • Rodillos de soporte de cabina',
              '  • Eje del sistema de auto nivelación'
            ]
          },
          {
            nombre: 'Inspecciones Mecánicas',
            tareas: [
              'Verificar el funcionamiento de los interruptores mecánicos de finales de carreras electrónicos y el límite final de bypass',
              'Inspeccionar pernos de cojinete de rotonda',
              'Chequear operación apropiada de la palanca de freno',
              'Inspeccionar rodillos y rails de cabina por daño y desgaste',
              'Inspeccionar sellos durante rotación de cabina. Chequear todos los sellos exteriores por fugas, resequedad, oxido, etc'
            ]
          },
          {
            nombre: 'Inspecciones Estructurales',
            tareas: [
              'Inspeccionar la parte inferior de la articulación del piso de cabina. Lubricar rodamiento. Inspeccionar estructura soporte, viga principal y soldaduras por danos o deflexión',
              'Inspeccionar interior del tunel, senda de paso, rotonda y cabina por daños, fugas y desgaste excesivo',
              'Inspeccionar montaje de la autonivelación por desgaste, partes perdidas/sueltas y montaje. Verificar operación apropiada',
              'Inspeccionar brazos del dosel, resortes, rodillos y switch límite por daños o desgaste'
            ]
          }
        ]
      },
      {
        label: 'Anual',
        color: '#ef4444',
        grupos: [
          {
            nombre: 'Verificación Semestral',
            tareas: [
              'Verificar semestral cumplido'
            ]
          },
          {
            nombre: 'Lubricación Anual',
            tareas: [
              'Completar la lista anual de lubricación:',
              '  • Interruptores mecánicos de finales de carreras (izquierdo y derecho)',
              '  • Rodamiento de rotonda',
              '  • Cubo de la caja reductora de rueda'
            ]
          },
          {
            nombre: 'Mantenimiento Hidráulico',
            tareas: [
              'Reemplazar filtro hidráulico'
            ]
          },
          {
            nombre: 'Inspecciones de Cojinetes',
            tareas: [
              'Inspeccionar cojinetes de desgaste de columnas',
              'Inspeccionar rodamientos superior e inferior de cabina'
            ]
          },
          {
            nombre: 'Tareas Electrónicas',
            tareas: [
              'Verificar el conexionado de todo cableado expuesto, ajuste de j-box y plugs por daño o pérdida de conexión',
              'Limpiar y apretar conexiones si es necesario. Corregir inmediatamente discrepancias antes de retornar la manga al servicio'
            ]
          }
        ]
      },
      {
        label: 'Anual (Análisis MOEX)',
        color: '#f59e0b',
        grupos: [
          {
            nombre: 'Análisis de Fluido Hidráulico',
            tareas: [
              'Tomar una muestra de fluido hidráulico para su análisis. Drenar, limpiar y completar nivel si es necesario',
              'Productos con características equivalentes de viscosidad 15 CST a 40°C'
            ]
          },
          {
            nombre: 'Parámetros a Registrar',
            tareas: [
              'Agua Crackle Test: [..............] % [Referencia: < 0,2]',
              'Viscosidad a 40°C: [..............] CST [Referencia: > 12]',
              'Número Total de Acidez (TAN) ASTM D974: [..............] mgKOH/g [Referencia: < 2]',
              'ISO 4406 part./ml ≥ 4 μm: [..............] adim. [Referencia: ≤ 20]',
              'ISO 4406 part./ml ≥ 10 μm: [..............] adim. [Referencia: ≤ 16]',
              'ISO 4406 part./ml ≥ 14 μm: [..............] adim. [Referencia: ≤ 13]',
              'Índice PQ: [..............] grsFe/L [Referencia: > 25]',
              'Aditivo Bario (Ba): [..............] ppm [Referencia: = 0]',
              'Aditivo Boro (B): [..............] ppm [Referencia: = 0]',
              'Aditivo Calcio (Ca): [..............] ppm',
              'Aditivo Magnesio (Mg): [..............] ppm',
              'Aditivo Fosforo (P): [..............] ppm',
              'Aditivo Zinc (Zn): [..............] ppm',
              'Desgastes Plata (Ag): [..............] ppm [Referencia: = 0]',
              'Desgastes Aluminio (Al): [..............] ppm [Referencia: < 5]',
              'Desgastes Cromo (Cr): [..............] ppm [Referencia: < 3]',
              'Desgastes Cobre (Cu): [..............] ppm [Referencia: < 15]',
              'Desgastes Hierro (Fe): [..............] ppm [Referencia: < 20]',
              'Desgastes Molibdeno (Mo): [..............] ppm [Referencia: = 0]',
              'Desgastes Níquel (Ni): [..............] ppm [Referencia: = 0]',
              'Desgastes Plomo (Pb): [..............] ppm [Referencia: < 5]',
              'Desgastes Estaño (Sn): [..............] ppm [Referencia: = 0]',
              'Desgastes Titanio (Ti): [..............] ppm',
              'Contaminante Potasio (Ka): [..............] ppm [Referencia: = 0]',
              'Contaminante Sodio (Na): [..............] ppm [Referencia: < 10]',
              'Contaminante Silicio (Si): [..............] ppm [Referencia: < 15]',
              'Contaminante Vanadio (V): = 0 [..............] ppm [Referencia: = 0]'
            ]
          }
        ]
      }
    ]
  }
};
