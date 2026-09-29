import { api } from '../../../services/api'
import endpoints from '../../../services/endpoints'

const basePath = endpoints.push

function extractPayload(response) {
  return response && typeof response === 'object' && 'data' in response ? response.data : response
}

export const pushService = {
  getVapidPublicKey: async () => extractPayload(await api.get(`${basePath}/vapid-public-key`)),
  subscribe: async (subscription, label) => extractPayload(await api.post(`${basePath}/subscribe`, {
    ...subscription.toJSON(),
    label,
  })),
  unsubscribe: async (payload) => extractPayload(await api.post(`${basePath}/unsubscribe`, payload)),
  list: async () => extractPayload(await api.get(`${basePath}/subscriptions`)),
  enviarPrueba: async () => extractPayload(await api.post(`${basePath}/test`, {})),
}

export default pushService
