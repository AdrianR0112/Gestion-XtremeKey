import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../../../app/query-utils'
import pushService from '../services/push.service'
import { urlBase64ToUint8Array } from '../utils/vapid'

function isSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

function deviceLabel() {
  const platform = navigator.userAgentData?.platform || navigator.platform || 'Dispositivo'
  return `${platform} · ${new Date().toLocaleDateString('es-EC')}`
}

async function hashEndpoint(endpoint) {
  const bytes = new TextEncoder().encode(endpoint)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function syncExistingPushSubscription() {
  if (!isSupported() || Notification.permission !== 'granted') return null
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return null
  await pushService.subscribe(subscription, deviceLabel())
  return subscription
}

export default function usePushSubscription() {
  const [estado, setEstado] = useState(() => {
    if (!isSupported()) return 'no-soportado'
    if (Notification.permission === 'denied') return 'denegado'
    return 'sin-permiso'
  })
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!isSupported()) {
      setEstado('no-soportado')
      return
    }
    if (Notification.permission === 'denied') {
      setEstado('denegado')
      return
    }
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setEstado(Notification.permission === 'granted' && subscription ? 'activo' : 'sin-permiso')
      setDevices(await pushService.list())
    } catch (err) {
      setEstado('error')
      setError(getErrorMessage(err, 'No se pudo comprobar el estado de las notificaciones.'))
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const activar = async () => {
    if (!isSupported()) return
    setLoading(true)
    setError('')
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'denied') {
        setEstado('denegado')
        return
      }
      if (permission !== 'granted') {
        setEstado('sin-permiso')
        return
      }
      const registration = await navigator.serviceWorker.ready
      const key = await pushService.getVapidPublicKey()
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key.publicKey),
        })
      }
      await pushService.subscribe(subscription, deviceLabel())
      await refresh()
    } catch (err) {
      setEstado('error')
      setError(getErrorMessage(err, 'No se pudieron activar las notificaciones.'))
    } finally {
      setLoading(false)
    }
  }

  const desactivar = async () => {
    setLoading(true)
    setError('')
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await pushService.unsubscribe({ endpoint: subscription.endpoint })
        await subscription.unsubscribe()
      }
      await refresh()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron desactivar las notificaciones.'))
    } finally {
      setLoading(false)
    }
  }

  const removeDevice = async (id) => {
    setLoading(true)
    setError('')
    try {
      const target = devices.find((device) => device.id === id)
      await pushService.unsubscribe({ id })
      const registration = await navigator.serviceWorker.ready
      const current = await registration.pushManager.getSubscription()
      if (current && target?.endpointHash === await hashEndpoint(current.endpoint)) {
        await current.unsubscribe()
      }
      await refresh()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo eliminar el dispositivo.'))
    } finally {
      setLoading(false)
    }
  }

  const probar = async () => {
    setLoading(true)
    setError('')
    try {
      await pushService.enviarPrueba()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo enviar la notificación de prueba.'))
    } finally {
      setLoading(false)
    }
  }

  return { estado, devices, loading, error, activar, desactivar, removeDevice, probar, refresh }
}
