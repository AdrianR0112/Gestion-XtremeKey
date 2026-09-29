import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { queryKeys } from '../../../app/query-keys'
import { getErrorMessage } from '../../../app/query-utils'
import recordatoriosService from '../services/recordatorios.service'

const GROUP_ORDER = ['ayer', 'dia', 'pre_1', 'pre_5']

export default function useRecordatorios() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [savingId, setSavingId] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const query = useQuery({
    queryKey: queryKeys.recordatorios.list(),
    queryFn: async () => {
      const [upcoming, yesterday] = await Promise.all([
        recordatoriosService.vencimientos(),
        recordatoriosService.vencidasAyer(),
      ])
      return { today: upcoming.today, items: [...(yesterday.items || []), ...(upcoming.items || [])] }
    },
  })

  const groups = useMemo(() => GROUP_ORDER.map((milestone) => ({
    milestone,
    items: (query.data?.items || []).filter((item) => item.milestone === milestone),
  })), [query.data])

  const target = {
    fecha: searchParams.get('fecha') || '',
    hito: searchParams.get('hito') || '',
  }

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.recordatorios.list() })

  const marcar = async (item, envio = {}) => {
    setSavingId(item.Id_Sus)
    setError('')
    try {
      await recordatoriosService.marcarEnviado(item.Id_Sus, {
        milestone: item.milestone,
        fechaObjetivo: item.fechaObjetivo,
        canal: 'whatsapp',
        destino: envio.telefono || item.Tel_Cli || null,
      })
      setSuccess('Recordatorio marcado como enviado.')
      await refresh()
      return true
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo marcar el recordatorio.'))
      return false
    } finally {
      setSavingId(null)
    }
  }

  const desmarcar = async (item) => {
    setSavingId(item.Id_Sus)
    setError('')
    try {
      await recordatoriosService.desmarcarEnviado(item.Id_Sus, {
        milestone: item.milestone,
        fechaObjetivo: item.fechaObjetivo,
        canal: 'whatsapp',
      })
      setSuccess('Marca de envío eliminada.')
      await refresh()
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo deshacer la marca.'))
    } finally {
      setSavingId(null)
    }
  }

  const ejecutarPush = async () => {
    setRunning(true)
    setError('')
    setSuccess('')
    try {
      const summary = await recordatoriosService.ejecutarPush()
      setSuccess(`Resumen procesado: ${summary.sentCount} enviado(s), ${summary.skippedCount} omitido(s).`)
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo ejecutar el resumen push.'))
    } finally {
      setRunning(false)
    }
  }

  return {
    today: query.data?.today,
    groups,
    target,
    loading: query.isLoading || query.isFetching,
    savingId,
    running,
    error,
    success,
    marcar,
    desmarcar,
    ejecutarPush,
    refresh,
  }
}
