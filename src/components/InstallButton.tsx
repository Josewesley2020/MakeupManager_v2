// Install Button Component - Permanent button for PWA installation
import { useState, useEffect } from 'react'
import InstallInstructionsModal from './InstallInstructionsModal'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show styled modal with instructions
      setShowModal(true)
      return
    }

    // Show native install prompt
    deferredPrompt.prompt()

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('✅ PWA instalado com sucesso!')
    }

    // Clear prompt
    setDeferredPrompt(null)
  }

  // Don't show button if already installed
  if (isInstalled) {
    return (
      <div className="text-xs text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
        <span>✓</span>
        <span className="font-medium">App instalado</span>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-xs font-medium backdrop-blur-sm border border-white/20"
        title="Instale o app no seu celular para acesso mais rápido, modo offline e notificações"
      >
        <span className="text-base">📲</span>
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>

      {showModal && <InstallInstructionsModal onClose={() => setShowModal(false)} />}
    </>
  )
}
