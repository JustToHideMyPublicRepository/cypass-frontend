import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    type: 'info' as ToastType,
    title: '',
    message: '',
    duration: 5000
  }),

  actions: {
    showToast(type: ToastType, title: string, message: string, duration: number = 5000) {
      this.type = type
      this.title = title
      this.message = message
      this.duration = duration
      this.show = true
    },

    hideToast() {
      this.show = false
    }
  }
})
