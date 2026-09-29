import { api } from '../../../services/api'
import endpoints from '../../../services/endpoints'

const basePath = endpoints.recordatorios

function extractPayload(response) {
  return response && typeof response === 'object' && 'data' in response ? response.data : response
}

export const recordatoriosService = {
  vencimientos: async (milestones = '5,1,0') => extractPayload(
    await api.get(`${basePath}/vencimientos?milestones=${encodeURIComponent(milestones)}`)
  ),
  vencidasAyer: async () => extractPayload(await api.get(`${basePath}/vencidas-ayer`)),
  marcarEnviado: async (idSus, payload) => extractPayload(
    await api.post(`${basePath}/${idSus}/marcar-enviado`, payload)
  ),
  desmarcarEnviado: async (idSus, payload) => {
    const params = new URLSearchParams(payload).toString()
    return extractPayload(await api.del(`${basePath}/${idSus}/marcar-enviado?${params}`))
  },
  ejecutarPush: async () => extractPayload(await api.post(`${basePath}/push/run`, { force: true, dryRun: false })),
}

export default recordatoriosService
