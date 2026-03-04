<template>
  <div class="space-y-6">
    <MeDashboardHeader :current-time="currentTime" />

    <!-- Stats Grid -->
    <MeDashboardStats :documents-count="documentsStore.pagination.total" :documents-trend="docTrend"
      :vigitech-count="vigitechStore.userIncidents.length" :vigitech-trend="vigiTrend"
      :active-sessions="activeSessionsCount" :security-score="securityScore" />

    <!-- Data Insights Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MeDashboardRecentActivity :notifications="notificationsStore.notifications.slice(0, 4)"
        :loading="notificationsStore.loading" :format-time="formatTime" />
      <MeDashboardRecentDocs :documents="documentsStore.documents.slice(0, 4)" :loading="documentsStore.loading"
        :format-time="formatTime" :get-doc-status="getDocStatus" />
      <MeDashboardRecentIncidents :incidents="vigitechStore.userIncidents.slice(0, 4)" :loading="vigitechStore.loading"
        :format-time="formatTime" />
      <MeDashboardRecentComments :comments="recentComments.slice(0, 4)" :loading="vigitechStore.loadingComments" />
      <MeDashboardRecentSessions :sessions="activeSessions.slice(0, 4)" :loading="loading" />
      <MeDashboardActivityFeed :logs="profilStore.logs.slice(0, 4)" :loading="loading" :format-time="formatTime" />
    </div>

    <!-- Quick Actions, Access Links & Trust Center Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MeDashboardQuickActions @upload="modals.upload = true" @verify="modals.verify = true"
        @create="modals.createIncident = true" />
      <MeDashboardAccessLinks />

      <MeDashboardTrustCenter class="md:col-span-2 lg:col-span-2" />
    </div>

    <!-- Modals -->
    <ModalDocSentryAuth :show="modals.upload" :loading="documentsStore.loading" :error="documentsStore.error"
      :upload-result="documentsStore.uploadResult" @upload="handleUpload"
      @update:error="(val) => documentsStore.error = val" @error-clear="documentsStore.error = null"
      @close="closeModals" />

    <ModalDocSentryVerify :show="modals.verify" :loading="documentsStore.loading" :error="documentsStore.error"
      :result="documentsStore.verificationResult" @verify="handleVerify"
      @reset="documentsStore.verificationResult = null" @close="closeModals" />

    <ModalVigitechCreateIncident :show="modals.createIncident" @close="closeModals"
      @success="vigitechStore.fetchUserIncidents()" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns'
import { useDocsentryStore } from '~/stores/docsentry'
import { useNotificationsStore } from '~/stores/notifications'
import { useProfilStore } from '~/stores/profil'
import { useAuthStore } from '~/stores/auth'
import { useVigitechStore } from '~/stores/vigitech'
import { useToastStore } from '~/stores/toast'
import { calculateSecurityScore, type SecurityScoreResult } from '~/utils/security'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const profilStore = useProfilStore()
const documentsStore = useDocsentryStore()
const notificationsStore = useNotificationsStore()
const vigitechStore = useVigitechStore()
const toast = useToastStore()

const currentTime = ref('')
const activeSessionsCount = ref(0)
const activeSessions = ref<any[]>([])
const loading = ref(true)
const docTrend = ref({ percentage: 0, difference: 0 })
const vigiTrend = ref({ percentage: 0, difference: 0 })
const securityScore = ref<SecurityScoreResult>({ score: 100, grade: 'A+', label: 'Excellent', color: 'text-success' })

const recentComments = computed(() => {
  return vigitechStore.userComments
})

const modals = reactive({
  upload: false,
  verify: false,
  createIncident: false
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
  modals.createIncident = false
  documentsStore.error = null
  documentsStore.uploadResult = null
  documentsStore.verificationResult = null
}

const calculateVigiTrend = async () => {
  try {
    const now = new Date()
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const previousWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
    const previousWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

    const response = await $fetch<any>('/api/vigitech/all', {
      query: { limit: 100, offset: 0 }
    })

    const incidents = response?.data || []

    const currentWeekCount = incidents.filter((i: any) => {
      const date = new Date(i.created_at)
      return isWithinInterval(date, { start: currentWeekStart, end: now })
    }).length

    const previousWeekCount = incidents.filter((i: any) => {
      const date = new Date(i.created_at)
      return isWithinInterval(date, { start: previousWeekStart, end: previousWeekEnd })
    }).length

    const diff = currentWeekCount - previousWeekCount
    vigiTrend.value = {
      percentage: previousWeekCount === 0 ? (currentWeekCount > 0 ? 100 : 0) : Math.round((diff / previousWeekCount) * 100),
      difference: diff
    }
  } catch (err) {
    console.error('Failed to calculate vigitech trend', err)
  }
}

const calculateDocTrend = async () => {
  try {
    const now = new Date()
    // Current Week: Monday 00:00 to Now
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })

    // Previous Week: Previous Monday 00:00 to Previous Sunday 23:59
    const previousWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
    const previousWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

    const response = await $fetch<any>('/api/docsentry/list', {
      query: { limit: 100, offset: 0 }
    })

    const docs = response?.data?.documents || []

    const currentWeekCount = docs.filter((d: any) => {
      const date = new Date(d.created_at)
      return isWithinInterval(date, { start: currentWeekStart, end: now })
    }).length

    const previousWeekCount = docs.filter((d: any) => {
      const date = new Date(d.created_at)
      return isWithinInterval(date, { start: previousWeekStart, end: previousWeekEnd })
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

const updateSecurityScore = () => {
  const logs = profilStore.logs || []
  const failedLogins = logs.filter(l => l.action.toLowerCase().includes('login') && l.status !== 'success').length
  const otherFailures = logs.filter(l => !l.action.toLowerCase().includes('login') && l.status !== 'success').length

  securityScore.value = calculateSecurityScore({
    documentsCount: documentsStore.pagination.total,
    criticalIncidents: vigitechStore.userIncidents.filter(i => i.threat_level === 'critical').length,
    mediumIncidents: vigitechStore.userIncidents.filter(i => i.threat_level === 'medium').length,
    failedLogins,
    otherFailures,
    activeSessions: activeSessionsCount.value
  })
}

onMounted(async () => {
  const now = new Date()
  currentTime.value = `${format(now, 'dd/MM/yyyy')} à ${format(now, 'HH:mm')}`

  // Parallel fetch
  await Promise.all([
    documentsStore.fetchDocuments(5, 0),
    notificationsStore.fetchNotifications(5, 0),
    profilStore.fetchLogs({ limit: 5 }),
    vigitechStore.fetchUserIncidents(),
    vigitechStore.fetchUserComments(),
    authStore.fetchSessions().then(sessions => {
      activeSessions.value = sessions || []
      activeSessionsCount.value = sessions?.length || 0
    }),
    calculateDocTrend(),
    calculateVigiTrend()
  ])
  updateSecurityScore()
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
  title: 'Tableau de bord',
  meta: [
    { name: 'description', content: 'Vue d\'ensemble de votre activité et alertes de sécurité sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
