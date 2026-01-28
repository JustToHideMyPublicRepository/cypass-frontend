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
    async fetchNotifications(limit: number = 20, offset: number = 0, append: boolean = false) {
      this.loading = true
      try {
        const response = await $fetch<{ success: boolean; data: NotificationResponse }>('/api/notifications/list', {
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

    async fetchNotificationById(id: string) {
      this.loading = true
      try {
        const response = await $fetch<{ success: boolean; data: { notification: Notification } }>('/api/notifications/get', {
          query: { id }
        })
        if (response.success) {
          this.currentNotification = response.data.notification
          // If fetched specifically, mark as read if not already
          if (!this.currentNotification.is_read) {
            this.markAsRead(id)
          }
        }
      } catch (err: any) {
        this.error = 'Erreur lors de la récupération de la notification'
      } finally {
        this.loading = false
      }
    },

    async markAsRead(id: string | 'all') {
      try {
        const response = await $fetch<{ success: boolean; data: { unread_count: number } }>('/api/notifications/mark-read', {
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

    async deleteNotification(id: string) {
      try {
        const response = await $fetch<{ success: boolean }>('/api/notifications/delete', {
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
    }
  }
})
