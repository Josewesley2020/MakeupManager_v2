// Offline Database Schema - IndexedDB with Dexie
import Dexie, { Table } from 'dexie'

// Types matching Supabase schema
export interface Client {
  id: string
  user_id: string
  name: string
  phone?: string
  email?: string
  address?: string
  instagram?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Appointment {
  id: string
  user_id: string
  client_id: string
  service_area_id?: string
  scheduled_date?: string
  scheduled_time?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  appointment_address?: string
  notes?: string
  is_custom_price: boolean
  travel_fee: number
  payment_total_appointment: number
  payment_total_service: number
  total_amount_paid: number
  payment_down_payment_expected?: number
  payment_down_payment_paid?: number
  payment_status: 'paid' | 'pending'
  total_duration_minutes?: number
  whatsapp_sent?: boolean
  whatsapp_sent_at?: string
  whatsapp_message?: string
  last_edited_at?: string
  edited_by?: string
  created_at?: string
  updated_at?: string
}

export interface Service {
  id: string
  user_id: string
  category_id?: string
  name: string
  description?: string
  price: number
  duration_minutes?: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface ServiceCategory {
  id: string
  user_id: string
  name: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface ServiceArea {
  id: string
  user_id: string
  name: string
  description?: string
  travel_fee: number
  created_at?: string
  updated_at?: string
}

// Offline queue for pending operations
export interface OfflineOperation {
  id?: number
  type: 'insert' | 'update' | 'delete'
  table: 'clients' | 'appointments' | 'services' | 'service_categories' | 'service_areas'
  data: any
  recordId?: string
  timestamp: number
  synced: boolean
  error?: string
}

// Database class
export class MakeupManagerDB extends Dexie {
  clients!: Table<Client, string>
  appointments!: Table<Appointment, string>
  services!: Table<Service, string>
  serviceCategories!: Table<ServiceCategory, string>
  serviceAreas!: Table<ServiceArea, string>
  offlineQueue!: Table<OfflineOperation, number>

  constructor() {
    super('MakeupManagerDB')
    
    this.version(1).stores({
      // User data tables (indexed by id and user_id for fast queries)
      clients: 'id, user_id, name, phone, [user_id+name]',
      appointments: 'id, user_id, client_id, scheduled_date, status, [user_id+scheduled_date], [user_id+status]',
      services: 'id, user_id, category_id, name, [user_id+is_active]',
      serviceCategories: 'id, user_id, name',
      serviceAreas: 'id, user_id, name',
      
      // Offline operations queue
      offlineQueue: '++id, type, table, timestamp, synced, [synced+timestamp]'
    })
  }

  // Clear all user data (on logout)
  async clearUserData(userId: string) {
    await this.transaction('rw', [
      this.clients,
      this.appointments,
      this.services,
      this.serviceCategories,
      this.serviceAreas
    ], async () => {
      await this.clients.where('user_id').equals(userId).delete()
      await this.appointments.where('user_id').equals(userId).delete()
      await this.services.where('user_id').equals(userId).delete()
      await this.serviceCategories.where('user_id').equals(userId).delete()
      await this.serviceAreas.where('user_id').equals(userId).delete()
    })
  }

  // Get database size estimate
  async getStorageEstimate(): Promise<{ usage: number; quota: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0
      }
    }
    return { usage: 0, quota: 0, percentage: 0 }
  }
}

// Export singleton instance
export const db = new MakeupManagerDB()

// Helper: Check if online
export const isOnline = () => navigator.onLine

// Helper: Wait for online
export const waitForOnline = (): Promise<void> => {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve()
    } else {
      const handleOnline = () => {
        window.removeEventListener('online', handleOnline)
        resolve()
      }
      window.addEventListener('online', handleOnline)
    }
  })
}
