<template>
  <div class="space-y-6">
    <MeDashboardHeader :current-time="currentTime" />

    <!-- Stats Grid -->
    <MeDashboardStats :documents-count="documentsStore.pagination?.total || 0" :documents-trend="docTrend"
      :unread-count="notificationsStore.unreadCount" :unread-trend="-21" :active-sessions="activeSessionsCount" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity -->
      <MeDashboardRecentActivity :notifications="notificationsStore.notifications.slice(0, 4)"
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
import { format, subDays, isAfter } from 'date-fns'
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
const docTrend = ref(0)

// Helper to determine doc status string for badge
const getDocStatus = (doc: any) => {
  return doc.has_certificate ? 'Verified' : 'Pending'
}

const calculateDocTrend = async () => {
  try {
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const fourteenDaysAgo = subDays(now, 14)

    // Fetch a larger batch to do client-side calculation (backend date filter might be unreliable)
    const response = await $fetch<any>('/api/documents/list', {
      query: { limit: 100, offset: 0 }
    })

    const docs = response?.data?.documents || []

    const currentWeekCount = docs.filter((d: any) => {
      const date = new Date(d.created_at)
      return isAfter(date, sevenDaysAgo)
    }).length

    const previousWeekDocs = docs.filter((d: any) => {
      const date = new Date(d.created_at)
      return isAfter(date, fourteenDaysAgo) && !isAfter(date, sevenDaysAgo)
    }).length

    if (previousWeekDocs === 0) {
      docTrend.value = currentWeekCount > 0 ? 100 : 0
    } else {
      docTrend.value = Math.round(((currentWeekCount - previousWeekDocs) / previousWeekDocs) * 100)
    }
  } catch (err) {
    console.error('Failed to calculate document trend', err)
    docTrend.value = 0
  }
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
    }),
    calculateDocTrend()
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
