import { defineStore } from 'pinia'
import { useProfilStore } from './profil'
import type { Notification, NotificationResponse } from '~/types/notifications'
import type { NotificationSettings } from '~/types/profil'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    currentNotification: null as Notification | null,
    unreadCount: 0,
    notificationSettings: null as NotificationSettings | null,
    settingsLoading: false,
    loading: false,
    error: null as string | null,
    pagination: {
      limit: 20,
      offset: 0,
      has_more: false
    }
  }),

  actions: {
    // Supression de notifications    
    async notificationDelete(id: string) {
      try {
        const response = await $fetch<{ success: boolean }>('/api/user/notification/delete', {
          method: 'DELETE',
          query: { id }
        })
        if (response.success) {
          this.notifications = this.notifications.filter(n => n.id !== id)
          return true
        }
        return false
      } catch (err) {
        console.error('Failed to delete notification')
        return false
      }
    },

    // Détail d'une notification
    async notificationGet(id: string) {
      this.loading = true
      try {
        const response = await $fetch<{ success: boolean; data: { notification: Notification } }>('/api/user/notification/get', {
          query: { id }
        })
        if (response.success) {
          this.currentNotification = response.data.notification
          // If fetched specifically, mark as read if not already
          if (!this.currentNotification.is_read) {
            this.notificationAsRead(id)
          }
        }
      } catch (err: any) {
        this.error = 'Erreur lors de la récupération de la notification'
      } finally {
        this.loading = false
      }
    },

    // Liste des notifications
    async notificationsList(limit: number = 20, offset: number = 0, append: boolean = false) {
      this.loading = true
      try {
        const response = await $fetch<{ success: boolean; data: NotificationResponse }>('/api/user/notification/list', {
          query: { limit, offset }
        })
        if (response.success) {
          if (append) {
            this.notifications = [...this.notifications, ...response.data.notifications]
          } else {
            this.notifications = response.data.notifications
          }
          this.pagination = response.data.pagination
          this.unreadCount = response.data.meta.unread_count
          return true
        }
        return false
      } catch (err: any) {
        this.error = 'Erreur lors de la récupération des notifications'
        return false
      } finally {
        this.loading = false
      }
    },

    // Marquer comme lu
    async notificationAsRead(id: string | 'all') {
      try {
        const response = await $fetch<{ success: boolean; data: { unread_count: number } }>('/api/user/notification/mark-read', {
          method: 'PATCH',
          body: { id, all: id === 'all' ? '1' : '' }
        })
        if (response.success) {
          this.unreadCount = response.data.unread_count
          if (id === 'all') {
            this.notifications.forEach(n => n.is_read = 1)
          } else {
            const notif = this.notifications.find(n => n.id === id)
            if (notif) notif.is_read = 1
          }
          return true
        }
        return false
      } catch (err) {
        console.error('Failed to mark notification as read')
        return false
      }
    },

    // Récupérer les préférences de notification
    async fetchNotificationSettings() {
      this.settingsLoading = true
      try {
        const response = await $fetch<{ success: boolean; data: NotificationSettings }>('/api/user/notification/settings-get')
        if (response.success) {
          this.notificationSettings = response.data
          return true
        }
        return false
      } catch (err: any) {
        console.error('Erreur récupération préférences notifications')
        return false
      } finally {
        this.settingsLoading = false
      }
    },

    // Mettre à jour les préférences de notification
    async updateNotificationSettings(settings: Partial<NotificationSettings>) {
      this.settingsLoading = true
      try {
        const response = await $fetch<{ success: boolean; message: string; data: NotificationSettings }>('/api/user/notification/settings-set', {
          method: 'PATCH',
          body: settings
        })
        if (response.success) {
          this.notificationSettings = response.data

          // Sync with ProfilStore
          const profilStore = useProfilStore()
          if (profilStore.profile) {
            profilStore.profile.notification_settings = response.data
          }

          return { success: true, message: response.message }
        }
        return { success: false, message: 'Erreur lors de la mise à jour' }
      } catch (err: any) {
        console.error('Erreur mise à jour préférences notifications')
        return { success: false, message: err.data?.message || 'Erreur serveur' }
      } finally {
        this.settingsLoading = false
      }
    },

    // Réinitialiser les préférences de notification
    async resetNotificationSettings() {
      this.settingsLoading = true
      try {
        const response = await $fetch<{ success: boolean; message: string; data: NotificationSettings }>('/api/user/notification/settings-reset', {
          method: 'PATCH'
        })
        if (response.success) {
          this.notificationSettings = response.data

          // Sync with ProfilStore
          const profilStore = useProfilStore()
          if (profilStore.profile) {
            profilStore.profile.notification_settings = response.data
          }

          return { success: true, message: response.message }
        }
        return { success: false, message: 'Erreur lors de la réinitialisation' }
      } catch (err: any) {
        console.error('Erreur réinitialisation préférences notifications')
        return { success: false, message: err.data?.message || 'Erreur serveur' }
      } finally {
        this.settingsLoading = false
      }
    },
  }
})
