# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

El usuario principal es el vendedor o administrador que atiende conversaciones en WhatsApp Web y necesita consultar el historial comercial, gestionar vencimientos y registrar ventas sin abandonar el chat activo.

## Product Purpose

La extensión de Chrome coloca el contexto comercial del contacto junto a WhatsApp Web: identifica el teléfono del chat, resuelve el cliente o revendedor en el backend existente, muestra su última compra y suscripciones, permite preparar recordatorios y renovaciones, y completa el alta de un cliente con su venta. El éxito es cerrar estas tareas desde el side panel con los mismos datos y reglas de negocio del panel web.

## Positioning

No replica el sistema de gestión dentro de la extensión: agrega y reutiliza los servicios, validaciones, plantillas y transacciones del backend actual a partir del teléfono detectado en el chat.

## Operating Context

- Chrome 116 o superior con WhatsApp Web abierto.
- Side panel nativo de Chrome de 360 a 420 px de ancho.
- Backend Express/MySQL y panel web existentes.
- El teléfono se obtiene mediante una cadena de señales del DOM de WhatsApp y siempre existe un ingreso manual como salida segura.
- Todas las peticiones autenticadas de la extensión pasan por el service worker MV3.

## Capabilities and Constraints

- Extensión MV3 construida con Vite, React 19, Tailwind CSS 4 y componentes con el lenguaje shadcn del frontend existente.
- Autenticación mediante el bearer emitido por better-auth, persistido en `chrome.storage.local` hasta el cierre de sesión o expiración.
- Contexto agregado por teléfono, incluyendo ambigüedad explícita, última compra, suscripciones y estado derivado por el backend.
- Alta de cliente seguida de venta completa mediante `POST /ventas/con-detalles`; las suscripciones derivadas de una venta se crean en el backend.
- Los mensajes de vencimiento se generan exclusivamente con la lógica existente de `getMensajeWhatsapp`.
- El scraping del DOM de WhatsApp es una dependencia frágil y debe quedar aislado en `detector.js`, con degradación visible e ingreso manual.
- El alta desde la extensión cubre clientes, no revendedores.
- La extensión carga el recordatorio directamente en el compositor del chat activo, reemplaza el borrador y nunca pulsa Enviar; copiar se conserva como recuperación.
- La URL productiva del backend y, por tanto, su `host_permission` definitivo permanecen abiertos hasta que se suministre el dominio.

## Brand Commitments

La extensión hereda la voz en español, Public Sans, tokens de color, componentes y comportamiento visual del frontend existente. Es una superficie operativa compacta, no una identidad visual independiente.

## Evidence on Hand

- Backend modular y frontend existentes en `Backend/` y `Frontend/`.
- Plan funcional y técnico completo aportado por el usuario.
- No hay credenciales, URL productiva ni acceso confirmado a una sesión real de WhatsApp Web; las validaciones dependientes de esos datos deben quedar preparadas para ejecución manual.

## Product Principles

- Mantener una sola fuente de verdad para reglas comerciales y mensajes: el backend.
- Hacer visible la incertidumbre antes que mezclar historiales o asumir un teléfono.
- Mantener siempre una salida operativa: ingreso manual, reintento, copia o acceso al panel web.
- Minimizar permisos y concentrar credenciales y red en el service worker.
- Diseñar para lectura y acción rápida en un panel angosto junto a una conversación activa.

## Accessibility & Inclusion

Los flujos deben ser utilizables con teclado, conservar foco visible, exponer estados de carga/error/éxito con texto además de color y respetar contraste de lectura en tema claro y oscuro.
