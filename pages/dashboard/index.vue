<template>
  <div class="space-y-6">
    <MeDashboardHeader :current-time="currentTime" />

    <!-- Stats Grid -->
    <MeDashboardStats :documents-count="documentsStore.pagination?.total || 0"
      :unread-count="notificationsStore.unreadCount" :active-sessions="activeSessionsCount" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Alerts -->
      <MeDashboardRecentAlerts :notifications="notificationsStore.notifications.slice(0, 4)"
        :loading="notificationsStore.loading" :format-time="formatTime" />

      <!-- Recent Docs -->
      <MeDashboardRecentDocs :documents="documentsStore.documents.slice(0, 4)" :loading="documentsStore.loading"
        :format-time="formatTime" :get-doc-status="getDocStatus" />

      <!-- Activity Feed -->
      <MeDashboardActivityFeed :logs="profilStore.logs.slice(0, 4)" :loading="loading" :format-time="formatTime" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { useDocumentsStore } from '~/stores/documents'
import { useNotificationsStore } from '~/stores/notifications'
import { useProfilStore } from '~/stores/profil'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const documentsStore = useDocumentsStore()
const notificationsStore = useNotificationsStore()
const profilStore = useProfilStore()
const authStore = useAuthStore()

const currentTime = ref('')
const activeSessionsCount = ref(0)
const loading = ref(true)

// Helper to determine doc status string for badge
const getDocStatus = (doc: any) => {
  return doc.has_certificate ? 'Verified' : 'Pending'
}

onMounted(async () => {
  const now = new Date()
  currentTime.value = `${format(now, 'dd/MM/yyyy')} à ${format(now, 'HH:mm')}`

  // Parallel fetch
  await Promise.all([
    documentsStore.fetchDocuments(5, 0),
    notificationsStore.fetchNotifications(5, 0),
    profilStore.fetchLogs({ limit: 5 }),
    authStore.fetchSessions().then(sessions => {
      activeSessionsCount.value = sessions?.length || 0
    })
  ])
  loading.value = false
})

// Basic date formatter
const formatTime = (ts: string) => {
  try {
    return format(new Date(ts), 'dd/MM HH:mm')
  } catch (e) {
    return ts
  }
}

useHead({
  title: 'Tableau de bord'
})
</script>
