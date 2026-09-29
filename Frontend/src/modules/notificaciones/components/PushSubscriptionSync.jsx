import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { syncExistingPushSubscription } from '../hooks/usePushSubscription'

export default function PushSubscriptionSync() {
  const user = useSelector((state) => state.auth.user)
  useEffect(() => {
    if (!user) return
    syncExistingPushSubscription().catch(() => {})
  }, [user])
  return null
}
