<template>
  <div class="space-y-6">
    <MeDashboardHeader :current-time="currentTime" />

    <!-- Stats Grid -->
    <MeDashboardStats :documents-count="documentsStore.pagination?.total || 0" :documents-trend="docTrend"
      :unread-count="notificationsStore.unreadCount" :unread-trend="unreadTrend"
      :active-sessions="activeSessionsCount" />

    <!-- Data Insights Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MeDashboardRecentActivity :notifications="notificationsStore.notifications.slice(0, 4)"
        :loading="notificationsStore.loading" :format-time="formatTime" />
      <MeDashboardRecentDocs :documents="documentsStore.documents.slice(0, 4)" :loading="documentsStore.loading"
        :format-time="formatTime" :get-doc-status="getDocStatus" />
      <MeDashboardActivityFeed :logs="profilStore.logs.slice(0, 4)" :loading="loading" :format-time="formatTime" />
    </div>

    <!-- Quick Actions & Trust Center Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MeDashboardQuickActions @upload="modals.upload = true" @verify="modals.verify = true" />
      <div class="lg:col-span-2">
        <MeDashboardTrustCenter />
      </div>
    </div>

    <!-- Modals -->
    <ModalDocSentryAuth :show="modals.upload" :loading="documentsStore.loading" :error="documentsStore.error"
      :upload-result="documentsStore.uploadResult" @upload="handleUpload"
      @update:error="(val) => documentsStore.error = val" @error-clear="documentsStore.error = null"
      @close="closeModals" />

    <ModalDocSentryVerify :show="modals.verify" :loading="documentsStore.loading" :error="documentsStore.error"
      :result="documentsStore.verificationResult" @verify="handleVerify"
      @reset="documentsStore.verificationResult = null" @close="closeModals" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { format, subDays, isAfter } from 'date-fns'
import { useDocumentsStore } from '~/stores/documents'
import { useNotificationsStore } from '~/stores/notifications'
import { useProfilStore } from '~/stores/profil'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default'
})

const documentsStore = useDocumentsStore()
const notificationsStore = useNotificationsStore()
const profilStore = useProfilStore()
const authStore = useAuthStore()
const toast = useToastStore()

const currentTime = ref('')
const activeSessionsCount = ref(0)
const loading = ref(true)
const docTrend = ref({ percentage: 0, difference: 0 })
const unreadTrend = ref({ percentage: 0, difference: 0 })

const modals = reactive({
  upload: false,
  verify: false
})

// Helper to determine doc status string for badge
const getDocStatus = (doc: any) => {
  return doc.has_certificate ? 'Verified' : 'Pending'
}

const handleUpload = async (file: File) => {
  const success = await documentsStore.uploadDocument(file)
  if (success) {
    toast.showToast('success', 'Document certifié', 'Votre document a été signé et enregistré avec succès.')
    await documentsStore.fetchDocuments(5, 0)
    await calculateDocTrend()
  } else {
    toast.showToast('error', 'Échec', documentsStore.error || 'Une erreur est survenue.')
  }
}

const handleVerify = async (file: File) => {
  const success = await documentsStore.verifyDocument(file)
  if (success) {
    if (documentsStore.verificationResult?.verified) {
      toast.showToast('success', 'Authentique', 'Le document est certifié valide par CYPASS.')
    } else {
      toast.showToast('warning', 'Attention', 'La signature de ce document est invalide ou corrompue.')
    }
  } else {
    toast.showToast('error', 'Erreur', documentsStore.error || 'Erreur lors de la vérification.')
  }
}

const closeModals = () => {
  modals.upload = false
  modals.verify = false
  documentsStore.error = null
  documentsStore.uploadResult = null
  documentsStore.verificationResult = null
}

const calculateDocTrend = async () => {
  try {
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const fourteenDaysAgo = subDays(now, 14)

    const response = await $fetch<any>('/api/documents/list', {
      query: { limit: 100, offset: 0 }
    })

    const docs = response?.data?.documents || []

    const currentWeekCount = docs.filter((d: any) => isAfter(new Date(d.created_at), sevenDaysAgo)).length
    const previousWeekCount = docs.filter((d: any) => {
      const date = new Date(d.created_at)
      return isAfter(date, fourteenDaysAgo) && !isAfter(date, sevenDaysAgo)
    }).length

    const diff = currentWeekCount - previousWeekCount
    docTrend.value = {
      percentage: previousWeekCount === 0 ? (currentWeekCount > 0 ? 100 : 0) : Math.round((diff / previousWeekCount) * 100),
      difference: diff
    }
  } catch (err) {
    console.error('Failed to calculate document trend', err)
  }
}

const calculateUnreadTrend = async () => {
  try {
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const fourteenDaysAgo = subDays(now, 14)

    // Using notifications from store or fetch 
    const response = await $fetch<any>('/api/notifications/list', {
      query: { limit: 100, offset: 0 }
    })

    const notifications = response?.data?.notifications || []

    const currentUnread = notifications.filter((n: any) => !n.is_read && isAfter(new Date(n.created_at), sevenDaysAgo)).length
    const previousUnread = notifications.filter((n: any) => !n.is_read && isAfter(new Date(n.created_at), fourteenDaysAgo) && !isAfter(new Date(n.created_at), sevenDaysAgo)).length

    const diff = currentUnread - previousUnread
    unreadTrend.value = {
      percentage: previousUnread === 0 ? (currentUnread > 0 ? 100 : 0) : Math.round((diff / previousUnread) * 100),
      difference: diff
    }
  } catch (err) {
    console.error('Failed to calculate unread trend', err)
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
    calculateDocTrend(),
    calculateUnreadTrend()
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
