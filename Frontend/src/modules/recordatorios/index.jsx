import { useEffect, useState } from 'react'
import { BellRing, RefreshCw, Send } from 'lucide-react'
import { Button } from '../../components/ui/button'
import FeedbackAlert from '../../components/feedback-alert'
import PushPermisoCard from '../notificaciones/components/PushPermisoCard'
import SuscripcionMensajeDialog from '../suscripciones/components/SuscripcionMensajeDialog'
import useSuscripcionMensaje from '../suscripciones/hooks/useSuscripcionMensaje'
import RecordatorioGrupo from './components/RecordatorioGrupo'
import useRecordatorios from './hooks/useRecordatorios'

export default function RecordatoriosPage() {
  const reminders = useRecordatorios()
  const message = useSuscripcionMensaje()
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!reminders.target.hito) return
    document.getElementById(`recordatorios-${reminders.target.hito}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [reminders.target.hito, reminders.loading])

  const openMessage = (item) => {
    setSelected(item)
    message.abrir(item)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-[env(safe-area-inset-bottom)]">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><BellRing className="size-6" /><h1 className="text-2xl font-semibold">Recordatorios</h1></div>
          <p className="mt-1 text-sm text-muted-foreground">Abre cada WhatsApp y lleva el control de lo que ya enviaste.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Button variant="outline" size="sm" onClick={reminders.refresh} disabled={reminders.loading}><RefreshCw className="mr-1 size-4" />Actualizar</Button>
          <Button variant="outline" size="sm" onClick={reminders.ejecutarPush} disabled={reminders.running}><Send className="mr-1 size-4" />{reminders.running ? 'Procesando...' : 'Enviar resumen'}</Button>
        </div>
      </header>

      <PushPermisoCard compact />
      <FeedbackAlert message={reminders.error} variant="error" />
      <FeedbackAlert message={reminders.success} variant="success" />

      {reminders.loading ? <p className="text-sm text-muted-foreground">Cargando recordatorios...</p> : (
        <div className="space-y-7">
          {reminders.groups.map((group) => (
            <RecordatorioGrupo
              key={group.milestone}
              group={group}
              highlighted={reminders.target.hito === group.milestone}
              savingId={reminders.savingId}
              onEnviar={openMessage}
              onDesmarcar={reminders.desmarcar}
            />
          ))}
        </div>
      )}

      <SuscripcionMensajeDialog
        open={message.dialogOpen}
        onOpenChange={message.setDialogOpen}
        datos={message.datos}
        mensaje={message.mensaje}
        setMensaje={message.setMensaje}
        cargando={message.cargando}
        error={message.error}
        onEnviado={(envio) => selected ? reminders.marcar(selected, envio) : null}
        marcandoEnviado={Boolean(selected && reminders.savingId === selected.Id_Sus)}
      />
    </div>
  )
}
