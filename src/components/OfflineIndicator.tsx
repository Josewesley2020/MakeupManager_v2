// Offline Indicator Component
import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      // Hide "back online" message after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-sm">
        {isOnline ? (
          <>
            <span className="text-lg">🟢</span>
            <span className="font-medium">Conectado - Dados sincronizados</span>
          </>
        ) : (
          <>
            <span className="text-lg">🔴</span>
            <span className="font-medium">
              Modo Offline - Alterações serão sincronizadas quando reconectar
            </span>
          </>
        )}
      </div>
    </div>
  )
}
