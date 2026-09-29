import { registerSW } from 'virtual:pwa-register'
import { toast } from 'sonner'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    toast('Hay una actualización disponible.', {
      action: { label: 'Actualizar', onClick: () => updateSW(true) },
      duration: Infinity,
    })
  },
  onOfflineReady() {
    toast.success('La aplicación está lista para usarse sin conexión.')
  },
  onRegisterError(error) {
    console.error('No se pudo registrar el service worker.', error)
  },
})

navigator.serviceWorker?.addEventListener('message', (event) => {
  if (event.data?.type !== 'NAVIGATE' || !event.data?.url) return
  window.history.pushState({}, '', event.data.url)
  window.dispatchEvent(new PopStateEvent('popstate'))
})

export { updateSW }
