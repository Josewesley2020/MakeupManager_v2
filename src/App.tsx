import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import OfflineIndicator from './components/OfflineIndicator'
import PublicFeedback from './components/PublicFeedback'
import { syncFromServer, clearOfflineData } from './lib/sync-service'
import type { User } from '@supabase/supabase-js'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'login' | 'dashboard' | 'feedback'>('login')

  useEffect(() => {
    // Detectar rota de feedback (rota pública, não precisa autenticação)
    const hash = window.location.hash
    if (hash.startsWith('#/feedback/')) {
      setView('feedback')
      setLoading(false)
      return
    }

    // Verificar se há um usuário logado (rotas normais)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setView(session?.user ? 'dashboard' : 'login')
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setView(session?.user ? 'dashboard' : 'login')
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sync data when user logs in
  useEffect(() => {
    if (user) {
      console.log('🔄 Usuário logado, iniciando sincronização inicial...')
      syncFromServer(user.id).catch((error) => {
        console.error('❌ Erro na sincronização inicial:', error)
      })
    } else {
      // Clear offline data on logout
      const clearData = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          // Only clear if really logged out
          console.log('🗑️ Limpando dados offline após logout')
        }
      }
      clearData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Rota pública de feedback (sem autenticação)
  if (view === 'feedback') {
    return <PublicFeedback />
  }

  if (!user) {
    return <LoginForm onSuccess={() => {}} />
  }

  return (
    <ErrorBoundary>
      {/* Offline indicator at top */}
      <OfflineIndicator />
      
      {/* Main app */}
      <Dashboard user={user} onLogout={() => setUser(null)} />
    </ErrorBoundary>
  )
}

export default App