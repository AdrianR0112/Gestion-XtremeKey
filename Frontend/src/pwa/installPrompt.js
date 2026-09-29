let deferredPrompt = null
const listeners = new Set()

function notify() {
  listeners.forEach((listener) => listener())
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  notify()
})

export function subscribeInstallPrompt(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getInstallPromptSnapshot() {
  return deferredPrompt
}

export async function promptInstall() {
  if (!deferredPrompt) return { outcome: 'unavailable' }
  const prompt = deferredPrompt
  deferredPrompt = null
  notify()
  await prompt.prompt()
  return prompt.userChoice
}
