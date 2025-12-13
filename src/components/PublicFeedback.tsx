import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PublicFeedback() {
  // Extrair appointmentId da URL
  const appointmentId = window.location.hash.split('/')[2]
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [submittedDate, setSubmittedDate] = useState<string | null>(null)

  useEffect(() => {
    loadAppointment()
  }, [appointmentId])

  const loadAppointment = async () => {
    setLoading(true)
    setError(null)

    if (!appointmentId) {
      setError('Link inválido. Verifique o link enviado por WhatsApp.')
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_date,
          rating,
          feedback_comment,
          feedback_submitted_at,
          client:clients(name)
        `)
        .eq('id', appointmentId)
        .single()

      if (fetchError) throw fetchError

      if (!data) {
        setError('Agendamento não encontrado.')
        setLoading(false)
        return
      }

      // Validação 1: Já tem feedback?
      if (data.feedback_submitted_at) {
        setAlreadySubmitted(true)
        setSubmittedDate(data.feedback_submitted_at)
        setRating(data.rating || 0)
        setComment(data.feedback_comment || '')
        setLoading(false)
        return
      }

      // Validação 2: Status é "completed"?
      if (data.status !== 'completed') {
        setError('Este agendamento ainda não foi concluído. A avaliação só pode ser feita após a realização do serviço.')
        setLoading(false)
        return
      }

      setAppointment(data)
      setLoading(false)
    } catch (err: any) {
      console.error('Erro ao carregar agendamento:', err)
      setError('Erro ao carregar informações do agendamento. Tente novamente mais tarde.')
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (rating === 0) {
      alert('⚠️ Por favor, selecione uma avaliação de 1 a 5 estrelas.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          rating: rating,
          feedback_comment: comment.trim() || null,
          feedback_submitted_at: new Date().toISOString()
        })
        .eq('id', appointmentId)
        .eq('status', 'completed') // Segurança adicional
        .is('feedback_submitted_at', null) // Só atualiza se ainda não tem feedback

      if (updateError) throw updateError

      setSuccess(true)
      
      // Scroll suave para o topo após sucesso
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      console.error('Erro ao enviar feedback:', err)
      setError('Erro ao enviar avaliação. Verifique se você já não avaliou este agendamento.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingEmoji = (stars: number) => {
    if (stars === 5) return '🎉 Excelente!'
    if (stars === 4) return '😊 Muito bom!'
    if (stars === 3) return '👍 Bom'
    if (stars === 2) return '😐 Poderia melhorar'
    if (stars === 1) return '😞 Não gostei'
    return ''
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4 animate-pulse">💄</div>
          <p className="text-lg sm:text-xl text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ops!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            Se você recebeu este link por WhatsApp, entre em contato com a profissional.
          </p>
        </div>
      </div>
    )
  }

  // Already submitted state
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-4">✅</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
            Avaliação Já Enviada!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Você já enviou sua avaliação em {submittedDate ? formatDate(submittedDate) : 'data anterior'}.
          </p>
          
          {/* Mostrar avaliação enviada */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex justify-center gap-1 sm:gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-3xl sm:text-4xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            {comment && (
              <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Seu comentário:</p>
                <p className="text-sm sm:text-base text-gray-800 italic">"{comment}"</p>
              </div>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500">
            Obrigada pelo feedback! 💕
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Avaliação Enviada!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Muito obrigada pelo seu feedback! Sua opinião é muito importante para melhorarmos nossos serviços.
          </p>
          
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex justify-center gap-1 sm:gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={`text-3xl sm:text-4xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-base sm:text-lg font-semibold text-purple-600 mb-4">
              {getRatingEmoji(rating)}
            </p>
            {comment && (
              <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Seu comentário:</p>
                <p className="text-sm sm:text-base text-gray-800 italic">"{comment}"</p>
              </div>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-500 mt-6">
            Esperamos atendê-la novamente em breve! 💄✨
          </p>
        </div>
      </div>
    )
  }

  // Main feedback form
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">💄</div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            MakeUp Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Avaliação de Atendimento</p>
        </div>

        {/* Cliente Info */}
        {appointment?.client && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6">
            <p className="text-xs sm:text-sm text-gray-600">Atendimento de:</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{appointment.client.name}</p>
            {appointment.scheduled_date && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {new Date(appointment.scheduled_date).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        )}

        {/* Rating Stars */}
        <div className="mb-6">
          <p className="text-center text-gray-700 font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
            Como foi seu atendimento?
          </p>
          <div className="flex justify-center gap-2 sm:gap-3 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125 active:scale-110 focus:outline-none touch-manipulation p-1"
                aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
              >
                <span className={`text-3xl sm:text-5xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center mt-2 sm:mt-3 text-sm sm:text-base font-medium text-purple-600 animate-fade-in">
              {getRatingEmoji(rating)}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Deixe um comentário (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            placeholder="Conte-nos mais sobre sua experiência..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={submitFeedback}
          disabled={rating === 0 || submitting}
          className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-white text-base sm:text-lg transition-all touch-manipulation ${
            rating === 0 || submitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Enviando...
            </span>
          ) : (
            <span>✨ Enviar Avaliação</span>
          )}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-4 sm:mt-6">
          Suas informações são seguras e confidenciais
        </p>
      </div>
    </div>
  )
}
