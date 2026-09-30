---
name: ARXO Automatizaciones
description: Sala de espera donde nadie espera; señalética institucional, pantalla LED de turnos y boletos de papel.
colors:
  wall: "#F3F5F7"
  wall-2: "#E6EAEE"
  ink: "#111418"
  ink-2: "#3B434C"
  signal-red: "#D42016"
  signal-red-deep: "#B81A12"
  panel: "#0D0F12"
  panel-2: "#1A1E23"
  led-amber: "#FFB020"
  served-green: "#1FA35C"
  paper: "#FFFFFF"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 8.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.95
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    letterSpacing: "0.04em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  panel: "14px"
spacing:
  section: "clamp(4rem, 9vw, 7.5rem)"
  gutter: "16px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
  button-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
  turn-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.led-amber}"
    rounded: "{rounded.panel}"
  ticket-stub:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper}"
---

## Overview

North star: **la sala de espera vacía**. ARXO se presenta como el sistema de turnos de una clínica o un banco, pero uno donde nadie espera porque el bot atiende en segundos. Todo sale de ese mundo: señalética institucional en mayúsculas condensadas, una pantalla LED con dígitos de siete segmentos, boletos de papel con perforación y un dispensador de turnos como cierre. Superficie de persuasión: cada sección termina en WhatsApp.

## Colors

Pared blanca fría (`wall`) con tinta casi negra para la señalética. El rojo de dispensador (`signal-red`) es el color comprometido: titular principal, bandas completas (el problema y el cierre), talones de boleto y el plan destacado. La pantalla (`panel`) es el único campo oscuro grande junto con la tabla de tarifas; ahí vive el ámbar LED (`led-amber`) para números. El verde (`served-green`) significa "atendido" y solo marca estados y palomitas. Texto sobre rojo va en blanco puro.

## Typography

Barlow Condensed (800) para toda la señalética: titulares, nombres de servicios, números de turno y botones, siempre en mayúsculas. Barlow regular para leer, en caja normal. Números con `tabular-nums`. Las preguntas frecuentes van en Barlow 600 en caja normal para que se lean de corrido. Fuentes servidas desde `/fonts` (OFL).

## Layout

Contenedor de 1200px con 16px de margen lateral. Secciones con ritmo `spacing.section`. Héroe en dos columnas (texto y pantalla) que pasan a una sola columna bajo 960px, con la pantalla después del botón. Los boletos van en dos columnas en escritorio y una en celular. La ruta de tres pasos es un solo letrero dividido en tres, que se apila en celular con las flechas giradas.

## Elevation & Depth

Sombras suaves con desplazamiento vertical, nunca bloques duros. La pantalla lleva un marco de 8px y sombra profunda como objeto colgado en la pared. El brillo ámbar de los dígitos y el LED verde son luz del objeto, no decoración.

## Shapes

Esquinas chicas (4 a 6px) en botones y placas; 10px en paneles de contenido; 14px en la pantalla. Los boletos usan muescas circulares a los lados y línea punteada entre talón y cuerpo. Los títulos de sección llevan una barra roja inferior de 6px como placa de señalética (ámbar sobre fondo oscuro).

## Components

- **Pantalla de turnos**: número de tres dígitos de siete segmentos (SVG generado en `script.js`), estado "Atendiendo", velocidad de atención y tablero de los tres últimos turnos. Avanza cada 3.6 s solo cuando está a la vista y se detiene con movimiento reducido. Siempre lleva la leyenda de simulación.
- **Boleto de servicio**: talón rojo con "Turno A0n" y cuerpo blanco con título y descripción.
- **Ventanillas**: pestañas accesibles (flechas del teclado) con conversación de ejemplo marcada como "ejemplo".
- **Tarifas**: tablero oscuro; el plan destacado es el campo rojo con bandera ámbar.
- **Dispensador**: caja negra con boleto blanco que es el enlace a WhatsApp; se jala al hacer clic.
- **Botones**: rojo sólido para la acción principal; en fondos oscuros, contorno blanco o blanco sólido.

## Do's and Don'ts

- Do: cada llamado a la acción usa `data-wa` para armar el enlace de WhatsApp.
- Do: marcar como ejemplo cualquier negocio, turno o chat simulado.
- Do: reservar el ámbar para números en campos oscuros.
- Don't: inventar clientes, testimonios, métricas ni logos.
- Don't: etiquetas pequeñas sobre los títulos (kickers) ni tarjetas genéricas de ícono más texto.
- Don't: animaciones sueltas; el único movimiento propio es el avance de la pantalla y el boleto del dispensador.
