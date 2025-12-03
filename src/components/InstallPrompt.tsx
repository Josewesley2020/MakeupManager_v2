// Install Prompt Component - PWA Installation Banner
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true)
      return
    }

    // Check if user already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      
      // Show again after 7 days
      if (Date.now() - dismissedTime < sevenDaysInMs) {
        return
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after 30 seconds (give user time to explore)
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show native install prompt
    deferredPrompt.prompt()

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('✅ PWA instalado com sucesso!')
    } else {
      console.log('❌ Instalação cancelada pelo usuário')
    }

    // Clear prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or prompt not available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  // Detect iOS for special instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <span className="text-4xl">📲</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-2">
            Instalar MakeupManager
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Acesse mais rápido e receba notificações de agendamentos! Funciona offline.
          </p>

          {/* Benefits */}
          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-300 mt-0.5">✓</span>
              <span className="text-white/90">Ícone na tela inicial</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 mt-0.5">✓</span>
              <span className="text-white/90">Funciona sem internet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 mt-0.5">✓</span>
              <span className="text-white/90">Notificações de lembretes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 mt-0.5">✓</span>
              <span className="text-white/90">Carrega mais rápido</span>
            </li>
          </ul>

          {/* Install button */}
          {!isIOS ? (
            <button
              onClick={handleInstall}
              className="w-full bg-white text-pink-600 font-semibold py-3 px-6 rounded-xl hover:bg-pink-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Instalar Agora
            </button>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-sm">
              <p className="font-semibold mb-2">Para instalar no iOS:</p>
              <ol className="space-y-1 text-white/90">
                <li>1. Toque no ícone <span className="font-bold">⎙</span> (compartilhar)</li>
                <li>2. Role e toque em "Adicionar à Tela Inicial"</li>
                <li>3. Toque em "Adicionar"</li>
              </ol>
            </div>
          )}

          {/* Maybe later button */}
          <button
            onClick={handleDismiss}
            className="w-full mt-3 text-white/70 text-sm hover:text-white transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
