import { useSyncExternalStore } from 'react'
import { getInstallPromptSnapshot, promptInstall, subscribeInstallPrompt } from '../pwa/installPrompt'

export default function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPromptSnapshot, () => null)
  return { canInstall: Boolean(prompt), install: promptInstall }
}
