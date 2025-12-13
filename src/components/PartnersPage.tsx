import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Container } from './Container'

interface Partner {
  id: string
  name: string
  phone: string
  email: string | null
  specialty: string
  address: string | null
  instagram: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PartnersPageProps {
  user: any
  onBack: () => void
}

export default function PartnersPage({ user, onBack }: PartnersPageProps) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialty: '',
    address: '',
    instagram: '',
    notes: '',
    is_active: true
  })

  const SPECIALTY_OPTIONS = [
    'Maquiagem',
    'Sobrancelha',
    'Limpeza de Pele',
    'Massagem',
    'Cabelo',
    'Manicure',
    'Pedicure',
    'Unhas',
    'Depilação',
    'Design de Sobrancelha',
    'Outro'
  ]

  useEffect(() => {
    loadPartners()
  }, [user])

  const loadPartners = async () => {
    if (!user || !user.id) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPartners(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar parceiros:', err)
      setError(err.message || 'Erro ao carregar parceiros')
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = partners.filter(partner => {
    // Filter by active status
    if (filterActive === 'active' && !partner.is_active) return false
    if (filterActive === 'inactive' && partner.is_active) return false

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        partner.name.toLowerCase().includes(searchLower) ||
        partner.specialty.toLowerCase().includes(searchLower) ||
        partner.phone.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      specialty: '',
      address: '',
      instagram: '',
      notes: '',
      is_active: true
    })
    setEditingPartner(null)
  }

  const startEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      phone: partner.phone,
      email: partner.email || '',
      specialty: partner.specialty,
      address: partner.address || '',
      instagram: partner.instagram || '',
      notes: partner.notes || '',
      is_active: partner.is_active
    })
    setShowForm(true)
  }

  const savePartner = async () => {
    if (!formData.name || !formData.phone || !formData.specialty) {
      alert('⚠️ Preencha os campos obrigatórios: Nome, Telefone e Especialidade')
      return
    }

    if (!user?.id) return

    try {
      if (editingPartner) {
        // Update
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', editingPartner.id)
          .eq('user_id', user.id)

        if (error) throw error
        alert('✅ Parceiro atualizado com sucesso!')
      } else {
        // Insert
        const { error } = await supabase
          .from('partners')
          .insert([
            {
              user_id: user.id,
              ...formData
            }
          ])

        if (error) throw error
        alert('✅ Parceiro criado com sucesso!')
      }

      await loadPartners()
      setShowForm(false)
      resetForm()
    } catch (err: any) {
      console.error('Erro ao salvar parceiro:', err)
      alert(`❌ Erro: ${err.message}`)
    }
  }

  const deletePartner = async (id: string) => {
    if (!window.confirm('⚠️ Tem certeza que deseja deletar este parceiro?')) return

    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      await loadPartners()
      alert('✅ Parceiro deletado com sucesso!')
    } catch (err: any) {
      console.error('Erro ao deletar parceiro:', err)
      alert(`❌ Erro: ${err.message}`)
    }
  }

  const toggleCardExpansion = (partnerId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(partnerId)) {
      newExpanded.delete(partnerId)
    } else {
      newExpanded.add(partnerId)
    }
    setExpandedCards(newExpanded)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-2 sm:py-4">
        <Container className="space-y-3 sm:space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="text-blue-100 hover:text-white transition-colors p-1"
              >
                ← Voltar
              </button>
              <h1 className="text-base sm:text-lg font-bold truncate mx-2">
                👥 Carregando...
              </h1>
              <div></div>
            </div>
          </div>
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-3 sm:py-4">
      <Container className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-purple-100 hover:text-white transition-colors p-1"
            >
              ← Voltar
            </button>
            <h1 className="text-base sm:text-lg font-bold truncate mx-2">
              👥 Parceiros
            </h1>
            <div className="text-sm opacity-90 bg-purple-400 px-2 py-1 rounded-full">
              {filteredPartners.length}
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="text-red-800 text-sm sm:text-base">
              <strong>Erro:</strong> {error}
            </div>
            <button
              onClick={loadPartners}
              className="mt-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Filtros e Ações */}
        <div className="bg-white p-3 rounded-lg shadow-md space-y-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {showForm ? '❌ Cancelar' : '➕ Novo Parceiro'}
            </button>
          </div>

          {/* Busca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, especialidade ou telefone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filtro de Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Status
            </label>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white p-4 rounded-lg shadow-md space-y-3 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPartner ? '✏️ Editar Parceiro' : '➕ Novo Parceiro'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do parceiro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Especialidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade *
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">Selecione uma especialidade</option>
                  {SPECIALTY_OPTIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Endereço */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, número, complemento..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@usuario"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.is_active ? 'ativo' : 'inativo'}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'ativo' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione informações adicionais..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                ❌ Cancelar
              </button>
              <button
                onClick={savePartner}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-colors text-sm"
              >
                💾 Salvar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Parceiros */}
        <div className="space-y-3">
          {filteredPartners.length === 0 ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center">
              <div className="text-3xl sm:text-4xl mb-4">👥</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Nenhum parceiro encontrado
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {searchTerm || filterActive !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Crie seu primeiro parceiro para gerenciar colaborações!'}
              </p>
            </div>
          ) : (
            filteredPartners.map((partner) => {
              const isExpanded = expandedCards.has(partner.id)

              return (
                <div key={partner.id} className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${partner.is_active ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                  {/* Card Header */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-base truncate">
                            {partner.name}
                          </h3>
                          {!partner.is_active && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-purple-600 font-medium mb-1">
                          🎯 {partner.specialty}
                        </p>
                        <p className="text-sm text-gray-600">
                          📱 <span className="font-mono">{partner.phone}</span>
                        </p>
                        {partner.email && (
                          <p className="text-sm text-gray-600">
                            📧 {partner.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        onClick={() => toggleCardExpansion(partner.id)}
                        className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors py-1 text-xs font-medium"
                      >
                        <span>{isExpanded ? 'Ocultar' : 'Ver detalhes'}</span>
                        <svg
                          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(partner)}
                          className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs font-medium transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => deletePartner(partner.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes Expandidos */}
                  {isExpanded && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 bg-gray-50 space-y-3">
                      {partner.address && (
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">📍 Endereço:</div>
                          <div className="bg-white px-3 py-2 rounded border border-gray-200 text-sm text-gray-900">
                            {partner.address}
                          </div>
                        </div>
                      )}

                      {partner.instagram && (
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">📷 Instagram:</div>
                          <div className="bg-white px-3 py-2 rounded border border-gray-200 text-sm text-gray-900">
                            <a 
                              href={`https://instagram.com/${partner.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 underline"
                            >
                              {partner.instagram}
                            </a>
                          </div>
                        </div>
                      )}

                      {partner.notes && (
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">📝 Observações:</div>
                          <div className="bg-yellow-50 px-3 py-2 rounded border border-yellow-200 text-sm text-gray-900">
                            {partner.notes}
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded border border-gray-200">
                        Cadastrado em {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Container>
    </div>
  )
}
