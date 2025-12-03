import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('✅ App pronto para uso offline!')
    },
    onRegisteredSW(swUrl, registration) {
      console.log('🔄 Service Worker registrado:', swUrl)
      
      // Verificar atualizações a cada 1 hora
      if (registration) {
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('❌ Erro ao registrar Service Worker:', error)
    }
  })
}