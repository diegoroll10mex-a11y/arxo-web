---
name: DIVRO Labs
description: Presentación de producto estilo Apple; negro, blanco y un solo azul tecnológico, con movimiento guiado por el scroll.
colors:
  black: "#000000"
  ink: "#1D1D1F"
  mist: "#F5F5F7"
  white: "#FFFFFF"
  gray-on-dark: "#A1A1A6"
  gray-on-light: "#6E6E73"
  body-on-light: "#424245"
  blue: "#0071E3"
  blue-hover: "#0062C4"
  blue-press: "#0058B0"
  blue-bright: "#2997FF"
  device: "#1C1C1E"
  whatsapp: "#25D366"
typography:
  display:
    fontFamily: "Geist, -apple-system, SF Pro Display, sans-serif"
    fontSize: "clamp(3rem, 9vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, -apple-system, SF Pro Display, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Geist, -apple-system, SF Pro Text, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "999px"
  card: "16px"
  device: "46px"
spacing:
  section: "clamp(6rem, 14vw, 11rem)"
  gutter: "16px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.blue-bright}"
    rounded: "{rounded.control}"
---

## Overview

North star: **una keynote de producto**. DIVRO se presenta como Apple presenta un iPhone: una idea por pantalla, titulares enormes, mucho aire y el producto (IAs y automatizaciones que trabajan solas) mostrado dentro de un teléfono que se mueve con el scroll. Superficie de persuasión: cada sección termina en WhatsApp.

## Colors

Tres campos: negro puro (héroe, manifiesto, precios, cierre), blanco (funciones, pasos, preguntas) y gris niebla `mist` (giros). Un solo acento: azul. `blue` (#0071E3) rellena botones y burbujas con texto blanco (4.7:1). `blue-bright` (#2997FF) es el azul para texto y enlaces sobre negro. El verde de WhatsApp solo vive en el botón flotante.

## Typography

Geist variable, servida desde `/fonts` (OFL). Titulares en 700 con tracking negativo fuerte; la segunda línea del héroe va en azul. Texto en 400. Números con `tabular-nums`.

## Layout

Contenedor de 1024px con 16px de margen. Secciones muy altas (`spacing.section`) y centradas. Funciones es un scrollytelling: texto a la izquierda y teléfono fijo a la derecha; en celular (<860px) el teléfono queda fijo arriba y el texto activo se lee debajo.

## Motion

Easing `cubic-bezier(.23,1,.32,1)`. Todo lo que depende del scroll corre en un solo `requestAnimationFrame`.
- Héroe: el texto se aleja con blur y el teléfono se acerca al bajar.
- Manifiesto: las palabras se encienden conforme se hace scroll; la última frase se enciende en azul.
- Funciones: cada paso cambia la pantalla del teléfono.
- Giros: control segmentado con pulgar que se desliza.
- Entradas: `.fade` con blur y desplazamiento, una sola vez.
- Chat del héroe: se escribe solo mientras está a la vista.
Con `prefers-reduced-motion` todo queda estático y visible.

## Do's and Don'ts

- Do: cada llamado a la acción usa `data-wa` para armar el enlace de WhatsApp.
- Do: marcar como ejemplo cualquier negocio, chat o pantalla simulada.
- Do: una idea por sección; si hay que explicar más, va en Preguntas.
- Don't: inventar clientes, testimonios, métricas ni logos.
- Don't: kickers sobre los títulos, texto con degradado, tarjetas de ícono más texto.
- Don't: un segundo color de acento.
