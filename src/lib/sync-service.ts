// Sync Service - Synchronize data between Supabase and IndexedDB
import { supabase } from './supabase'
import { db, isOnline, waitForOnline, type OfflineOperation } from './offline-db'

// Track sync status
let isSyncing = false
let lastSyncTime: number | null = null

// Get last sync time
export const getLastSyncTime = () => lastSyncTime

// Sync data FROM server TO local IndexedDB
export async function syncFromServer(userId: string): Promise<void> {
  if (!isOnline()) {
    console.log('📴 Offline - pulando sincronização do servidor')
    return
  }

  if (isSyncing) {
    console.log('⏳ Sincronização já em andamento')
    return
  }

  isSyncing = true
  console.log('⬇️ Iniciando sincronização do servidor...')

  try {
    // Sync clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (clientsError) throw clientsError
    if (clients && clients.length > 0) {
      await db.clients.bulkPut(clients)
      console.log(`✅ ${clients.length} clientes sincronizados`)
    }

    // Sync appointments (last 6 months only to save space)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0]

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_date', sixMonthsAgoStr)
      .order('scheduled_date', { ascending: false })

    if (appointmentsError) throw appointmentsError
    if (appointments && appointments.length > 0) {
      await db.appointments.bulkPut(appointments)
      console.log(`✅ ${appointments.length} agendamentos sincronizados`)
    }

    // Sync services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (servicesError) throw servicesError
    if (services && services.length > 0) {
      await db.services.bulkPut(services)
      console.log(`✅ ${services.length} serviços sincronizados`)
    }

    // Sync service categories
    const { data: categories, error: categoriesError } = await supabase
      .from('service_categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (categoriesError) throw categoriesError
    if (categories && categories.length > 0) {
      await db.serviceCategories.bulkPut(categories)
      console.log(`✅ ${categories.length} categorias sincronizadas`)
    }

    // Sync service areas
    const { data: areas, error: areasError } = await supabase
      .from('service_areas')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (areasError) throw areasError
    if (areas && areas.length > 0) {
      await db.serviceAreas.bulkPut(areas)
      console.log(`✅ ${areas.length} áreas sincronizadas`)
    }

    lastSyncTime = Date.now()
    console.log('✅ Sincronização do servidor concluída!')
  } catch (error) {
    console.error('❌ Erro na sincronização do servidor:', error)
    throw error
  } finally {
    isSyncing = false
  }
}

// Sync pending operations FROM local TO server
export async function syncToServer(): Promise<void> {
  if (!isOnline()) {
    console.log('📴 Offline - aguardando conexão para sincronizar')
    return
  }

  if (isSyncing) {
    console.log('⏳ Sincronização já em andamento')
    return
  }

  // Get pending operations
  const pendingOps = await db.offlineQueue
    .where('synced')
    .equals(false)
    .sortBy('timestamp')

  if (pendingOps.length === 0) {
    console.log('✅ Nenhuma operação pendente para sincronizar')
    return
  }

  isSyncing = true
  console.log(`⬆️ Sincronizando ${pendingOps.length} operações pendentes...`)

  let successCount = 0
  let errorCount = 0

  for (const op of pendingOps) {
    try {
      switch (op.type) {
        case 'insert':
          await executeInsert(op)
          break
        case 'update':
          await executeUpdate(op)
          break
        case 'delete':
          await executeDelete(op)
          break
      }

      // Mark as synced
      await db.offlineQueue.update(op.id!, { synced: true })
      successCount++
    } catch (error: any) {
      console.error(`❌ Erro ao sincronizar operação ${op.id}:`, error)
      
      // Update error message
      await db.offlineQueue.update(op.id!, {
        error: error.message || 'Erro desconhecido'
      })
      errorCount++
    }
  }

  isSyncing = false
  console.log(`✅ Sincronização concluída: ${successCount} sucesso, ${errorCount} erros`)

  // Clean up old synced operations (keep last 7 days only)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  await db.offlineQueue
    .where('timestamp')
    .below(sevenDaysAgo)
    .and(op => op.synced)
    .delete()
}

// Execute INSERT operation
async function executeInsert(op: OfflineOperation): Promise<void> {
  const { data, error } = await supabase
    .from(op.table)
    .insert(op.data)
    .select()
    .single()

  if (error) throw error

  // Update local record with server-generated fields
  if (data && op.recordId) {
    switch (op.table) {
      case 'clients':
        await db.clients.put(data)
        break
      case 'appointments':
        await db.appointments.put(data)
        break
      case 'services':
        await db.services.put(data)
        break
      case 'service_categories':
        await db.serviceCategories.put(data)
        break
      case 'service_areas':
        await db.serviceAreas.put(data)
        break
    }
  }
}

// Execute UPDATE operation
async function executeUpdate(op: OfflineOperation): Promise<void> {
  if (!op.recordId) throw new Error('recordId obrigatório para UPDATE')

  const { error } = await supabase
    .from(op.table)
    .update(op.data)
    .eq('id', op.recordId)

  if (error) throw error
}

// Execute DELETE operation
async function executeDelete(op: OfflineOperation): Promise<void> {
  if (!op.recordId) throw new Error('recordId obrigatório para DELETE')

  const { error } = await supabase
    .from(op.table)
    .delete()
    .eq('id', op.recordId)

  if (error) throw error
}

// Queue offline operation
export async function queueOfflineOperation(
  type: 'insert' | 'update' | 'delete',
  table: OfflineOperation['table'],
  data: any,
  recordId?: string
): Promise<void> {
  await db.offlineQueue.add({
    type,
    table,
    data,
    recordId,
    timestamp: Date.now(),
    synced: false
  })

  console.log(`📝 Operação ${type} em ${table} enfileirada para sincronização`)

  // Try to sync immediately if online
  if (isOnline()) {
    setTimeout(() => syncToServer(), 1000)
  }
}

// Auto-sync when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Conexão restaurada! Iniciando sincronização...')
    syncToServer().catch(console.error)
  })
}

// Get pending operations count
export async function getPendingOperationsCount(): Promise<number> {
  return await db.offlineQueue.where('synced').equals(false).count()
}

// Clear all offline data (on logout)
export async function clearOfflineData(userId: string): Promise<void> {
  await db.clearUserData(userId)
  await db.offlineQueue.clear()
  lastSyncTime = null
  console.log('🗑️ Dados offline limpos')
}
