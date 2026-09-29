import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

self.skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html'), {
  denylist: [/^\/api\//, /^\/uploads\//, /^\/health$/],
}))

function normalizePayload(event) {
  if (!event.data) return { title: 'Nuevo recordatorio', body: 'Tienes recordatorios pendientes.', data: { url: '/recordatorios' } }
  try {
    return event.data.json()
  } catch {
    return { title: 'Nuevo recordatorio', body: event.data.text(), data: { url: '/recordatorios' } }
  }
}

self.addEventListener('push', (event) => {
  const payload = normalizePayload(event)
  const { title = 'Nuevo recordatorio', ...options } = payload
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'omitir') return
  const targetUrl = new URL(event.notification.data?.url || '/recordatorios', self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    if (windows.length > 0) {
      const client = windows[0]
      await client.focus()
      client.postMessage({ type: 'NAVIGATE', url: new URL(targetUrl).pathname + new URL(targetUrl).search })
      return
    }
    await self.clients.openWindow(targetUrl)
  })())
})

async function getPublicKey() {
  const response = await fetch('/api/v1/push/vapid-public-key', { credentials: 'include' })
  if (!response.ok) throw new Error('No se pudo renovar la clave push.')
  const json = await response.json()
  return json?.data?.publicKey
}

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)))
}

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil((async () => {
    const publicKey = await getPublicKey()
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
    await fetch('/api/v1/push/subscribe', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    })
  })())
})
