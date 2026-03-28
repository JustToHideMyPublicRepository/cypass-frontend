import { defineStore } from 'pinia'
import type { Notification, NotificationResponse } from '~/types/notifications'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    currentNotification: null as Notification | null,
    unreadCount: 0,
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
  }
})
