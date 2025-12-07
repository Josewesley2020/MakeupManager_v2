// Install Instructions Modal - Styled modal with step-by-step installation guide
import { X } from 'lucide-react'

interface InstallInstructionsModalProps {
  onClose: () => void
}

export default function InstallInstructionsModal({ onClose }: InstallInstructionsModalProps) {
  const userAgent = navigator.userAgent
  
  // Detecção de dispositivos e navegadores
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isSamsungBrowser = /SamsungBrowser/i.test(userAgent)
  const isFirefox = /Firefox/i.test(userAgent)
  const isOpera = /OPR|Opera/i.test(userAgent)
  const isEdge = /Edg/i.test(userAgent) && !/Edge/i.test(userAgent)
  
  // Chromium-based browsers (Chrome, Edge, Opera) seguem mesmo padrão
  const isChromiumBased = !isIOS && !isSamsungBrowser && !isFirefox

  // Handle backdrop click - only close if clicking the backdrop itself
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center text-white">
            <div className="text-5xl mb-3">📲</div>
            <h2 className="text-2xl font-bold mb-2">Como Instalar o App</h2>
            <p className="text-pink-100 text-sm">
              Siga os passos abaixo para ter o MakeupManager na tela inicial do seu celular
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* iOS Instructions */}
          {isIOS && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl"></span>
                iPhone/iPad (Safari)
              </h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque no ícone de <strong>compartilhar</strong> <span className="inline-block">⎙</span> na parte inferior da tela
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Role para baixo e toque em <strong>"Adicionar à Tela Inicial"</strong>
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque em <strong>"Adicionar"</strong> no canto superior direito
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Samsung Browser Instructions */}
          {!isIOS && isSamsungBrowser && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Samsung Internet
              </h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque no ícone de <strong>menu</strong> <span className="inline-block">⋮</span> (3 pontos)
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque em <strong>"Adicionar página a"</strong>
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Selecione <strong>"Tela inicial"</strong>
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Chrome/Edge/Opera Instructions (Chromium-based) */}
          {isChromiumBased && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                {isEdge ? 'Microsoft Edge' : isOpera ? 'Opera' : 'Chrome'}
              </h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque no ícone de <strong>menu</strong> <span className="inline-block">⋮</span> (3 pontos)
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">
                      Confirme tocando em <strong>"Instalar"</strong>
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Firefox Instructions (não suporta PWA nativamente) */}
          {isFirefox && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🦊</span>
                Firefox
              </h3>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>ℹ️ Atenção:</strong> O Firefox ainda não suporta instalação de PWA no celular.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Recomendação:</strong> Use o Chrome, Edge ou Samsung Internet para instalar o app e ter acesso offline.
                </p>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold text-gray-800 text-sm mb-3">✨ Benefícios do App:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-pink-500 flex-shrink-0">✓</span>
                <span>Ícone direto na tela inicial do celular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 flex-shrink-0">✓</span>
                <span>Funciona mesmo sem internet (offline)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 flex-shrink-0">✓</span>
                <span>Receba notificações de lembretes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-500 flex-shrink-0">✓</span>
                <span>Carrega 3x mais rápido que o site</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            type="button"
          >
            Entendi!
          </button>
        </div>
      </div>
    </div>
  )
}
