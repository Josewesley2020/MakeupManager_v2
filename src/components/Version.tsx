// Version Display Component - Shows app version to users
import { useState } from 'react'

export default function Version() {
  const [showDetails, setShowDetails] = useState(false)
  
  // Version info - Update these when releasing new versions
  const version = '1.0.1'
  const releaseDate = '06/12/2025'
  
  // Detectar ambiente automaticamente
  const getEnvironment = () => {
    const hostname = window.location.hostname
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development'
    } else if (hostname.includes('github.io')) {
      return 'production'
    } else {
      return 'staging'
    }
  }
  
  const environment = getEnvironment()
  
  // Cores do badge de ambiente
  const environmentColors = {
    development: 'bg-yellow-100 text-yellow-700',
    production: 'bg-green-100 text-green-700',
    staging: 'bg-blue-100 text-blue-700'
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-xs text-white/80 hover:text-white transition-colors flex items-center gap-1 bg-white/10 px-2 py-1 rounded"
        title="Clique para ver detalhes da versão"
      >
        <span>v{version}</span>
        <span className="text-[10px]">ⓘ</span>
      </button>
      
      {showDetails && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDetails(false)}
          />
          
          {/* Popup */}
          <div className="absolute right-0 sm:left-0 top-10 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 sm:w-80 animate-fade-in">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💄</span>
                  <h3 className="font-bold text-gray-800">MakeupManager</h3>
                </div>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded font-semibold">
                  v{version}
                </span>
              </div>
              
              {/* Version Info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Versão:</span>
                  <span className="text-gray-800 font-semibold">{version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Lançamento:</span>
                  <span className="text-gray-800">{releaseDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Ambiente:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${environmentColors[environment as keyof typeof environmentColors]}`}>
                    {environment}
                  </span>
                </div>
              </div>
              
              {/* Changelog */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong className="text-gray-800 block mb-2">✨ Novidades v1.0.1:</strong>
                  <span className="space-y-1 block">
                    <span className="flex items-start gap-2">
                      <span className="text-pink-500 flex-shrink-0">•</span>
                      <span>Layout otimizado para mobile</span>
                    </span>
                    <span className="flex items-start gap-2">
                      <span className="text-pink-500 flex-shrink-0">•</span>
                      <span>Detecção de navegadores melhorada</span>
                    </span>
                    <span className="flex items-start gap-2">
                      <span className="text-pink-500 flex-shrink-0">•</span>
                      <span>Nome do usuário no header</span>
                    </span>
                    <span className="flex items-start gap-2">
                      <span className="text-pink-500 flex-shrink-0">•</span>
                      <span>Correções de UX no modal</span>
                    </span>
                  </span>
                </p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
