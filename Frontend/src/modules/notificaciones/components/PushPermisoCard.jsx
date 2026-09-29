import { BellRing, BellOff, MonitorSmartphone, Send, Trash2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import useInstallPrompt from '../../../hooks/useInstallPrompt'
import usePushSubscription from '../hooks/usePushSubscription'

const STATUS_TEXT = {
  'no-soportado': 'Este navegador no soporta Web Push.',
  denegado: 'Las notificaciones están bloqueadas. Actívalas en Ajustes del sitio → Notificaciones.',
  'sin-permiso': 'Activa las notificaciones para recibir el resumen diario de vencimientos.',
  activo: 'Este dispositivo recibe recordatorios push.',
  error: 'No se pudo comprobar el estado de las notificaciones.',
}

export default function PushPermisoCard({ compact = false }) {
  const push = usePushSubscription()
  const install = useInstallPrompt()
  const active = push.estado === 'activo'
  const blocked = push.estado === 'denegado' || push.estado === 'no-soportado'

  if (compact && active) return null

  const content = (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        {active ? <BellRing className="mt-0.5 size-5 text-emerald-600" /> : <BellOff className="mt-0.5 size-5 text-amber-600" />}
        <div className="min-w-0 flex-1">
          <p className="font-medium">Notificaciones de vencimiento</p>
          <p className="text-sm text-muted-foreground">{STATUS_TEXT[push.estado]}</p>
          {push.error ? <p className="mt-1 text-sm text-red-600">{push.error}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {!active && !blocked ? <Button onClick={push.activar} disabled={push.loading}>Activar notificaciones</Button> : null}
        {active ? (
          <>
            <Button variant="outline" onClick={push.probar} disabled={push.loading}><Send className="mr-1 size-4" />Enviar prueba</Button>
            <Button variant="ghost" onClick={push.desactivar} disabled={push.loading}>Desactivar este dispositivo</Button>
          </>
        ) : null}
        {install.canInstall ? <Button variant="outline" onClick={install.install}><MonitorSmartphone className="mr-1 size-4" />Instalar aplicación</Button> : null}
      </div>
      {!compact && push.devices.length > 0 ? (
        <div className="space-y-2 border-t pt-3">
          <p className="text-sm font-medium">Dispositivos registrados</p>
          {push.devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{device.label || 'Dispositivo sin nombre'}</p>
                <p className="truncate text-xs text-muted-foreground">{device.userAgent || 'Navegador desconocido'}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => push.removeDevice(device.id)} disabled={push.loading} aria-label="Eliminar dispositivo">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )

  if (compact) return <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">{content}</div>
  return <Card><CardHeader><CardTitle>Aplicación y notificaciones</CardTitle></CardHeader><CardContent>{content}</CardContent></Card>
}
