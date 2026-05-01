<template>
  <div class="space-y-6">
    <MeDashboardHeader :current-time="currentTime" />

    <!-- Stats Grid -->
    <MeDashboardStats :documents-count="userDocsentryStore.pagination.total" :documents-trend="userDocsentryStore.trend"
      :vigitech-count="vigitechStore.userIncidents.length" :vigitech-trend="vigiTrend"
      :active-sessions="activeSessionsCount" :security-score="securityScore" />

    <!-- Blocs des graphiques -->
    <div v-if="hasCertificationData || hasThreatData" class="grid grid-cols-1 gap-6"
      :class="{ 'lg:grid-cols-2': hasCertificationData && hasThreatData }">
      <MeDashboardGraphCertification v-if="hasCertificationData" :documents="userDocsentryStore.documents"
        :loading="userDocsentryStore.loading" />
      <MeDashboardGraphThreat v-if="hasThreatData" :incidents="vigitechStore.userIncidents"
        :loading="vigitechStore.loading" />
    </div>

    <!-- Blocs des récents -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MeDashboardRecentActivity :notifications="notificationsStore.notifications.slice(0, 4)"
        :loading="notificationsStore.loading" :format-time="formatTime" />
      <MeDashboardRecentLogs :logs="activitiesStore.logs.slice(0, 4)" :loading="loading" :format-time="formatTime" />
      <MeDashboardRecentSessions :sessions="activeSessions.slice(0, 4)" :loading="loading" />
      <MeDashboardRecentDocs :documents="userDocsentryStore.documents.slice(0, 4)" :loading="userDocsentryStore.loading"
        :format-time="formatTime" :get-doc-status="getDocStatus" />
      <MeDashboardRecentIncidents :incidents="vigitechStore.userIncidents.slice(0, 4)" :loading="vigitechStore.loading"
        :format-time="formatTime" />
      <MeDashboardRecentComments :comments="recentComments.slice(0, 4)" :loading="vigitechStore.loadingComments" />
    </div>

    <!-- Quick Actions, Access Links & Trust Center Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <MeDashboardQuickActions @upload="modals.choice = true" @verify="modals.verify = true"
        @create="modals.createIncident = true" />
      <MeDashboardAccessLinks />

      <MeDashboardTrustCenter class="md:col-span-2 lg:col-span-2" />
    </div>

    <!-- Modals -->
    <ModalDocsentrySimpleAuth :show="modals.upload" :loading="userDocsentryStore.loading"
      :error="userDocsentryStore.error" :upload-result="userDocsentryStore.uploadResult" @upload="handleUpload"
      @update:error="(val) => userDocsentryStore.error = val" @error-clear="userDocsentryStore.error = null"
      @close="closeModals" />

    <ModalDocsentryVerify :show="modals.verify" :loading="publicDocsentryStore.loading"
      :error="publicDocsentryStore.error" :result="publicDocsentryStore.verificationResult" @verify="handleVerify"
      @reset="publicDocsentryStore.verificationResult = null" @close="closeModals" />

    <ModalVigitechCreateIncident :show="modals.createIncident" @close="closeModals"
      @success="vigitechStore.fetchUserIncidents()" />

    <ModalDocsentryEnrichedAuth :show="modals.enriched" @close="closeModals" @success="handleUploadSuccess" />

    <ModalDocsentryAuthChoice :show="modals.choice" @close="closeModals" @select="handleChoice" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { format, startOfWeek, endOfWeek, subWeeks, isWithinInterval } from 'date-fns'
import { useUserDocsentryStore } from '~/stores/back/user/docsentry'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useNotificationsStore } from '~/stores/back/user/notifications'
import { useActivitiesStore } from '~/stores/back/user/activities'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { calculateSecurityScore, type SecurityScoreResult } from '~/utils/security'

const activitiesStore = useActivitiesStore()
const userDocsentryStore = useUserDocsentryStore()
const publicDocsentryStore = usePublicDocsentryStore()
const notificationsStore = useNotificationsStore()
const vigitechStore = useUserVigitechStore()
const toast = useToastStore()

const currentTime = ref('')
const activeSessionsCount = ref(0)
const activeSessions = ref<any[]>([])
const loading = ref(true)
const vigiTrend = ref({ percentage: 0, difference: 0 })
const securityScore = ref<SecurityScoreResult>({ score: 100, grade: 'A+', label: 'Excellent', color: 'text-success' })

const recentComments = computed(() => {
  return vigitechStore.userComments
})

const hasCertificationData = computed(() => {
  // On affiche si en chargement (pour voir le loader du composant) ou s'il y a des docs
  return userDocsentryStore.loading || userDocsentryStore.pagination.total > 0
})

const hasThreatData = computed(() => {
  return vigitechStore.loading || vigitechStore.userIncidents.length > 0
})

const modals = reactive({
  choice: false,
  upload: false,
  enriched: false,
  verify: false,
  createIncident: false
})

// Helper to determine doc status string for badge
const getDocStatus = (doc: any) => {
  return doc.has_certificate ? 'Verified' : 'Pending'
}

const handleChoice = (type: 'simple' | 'enriched') => {
  modals.choice = false
  if (type === 'simple') {
    modals.upload = true
  } else {
    modals.enriched = true
  }
}

const handleUpload = async (file: File) => {
  const success = await userDocsentryStore.uploadDocument(file)
  if (success) {
    toast.showToast('success', 'Document certifié', 'Votre document a été signé et enregistré avec succès.')
    await userDocsentryStore.fetchDocuments(5, 0)
    await userDocsentryStore.fetchTrend()
  } else {
    toast.showToast('error', 'Échec', userDocsentryStore.error || 'Une erreur est survenue.')
  }
}

const handleUploadSuccess = async () => {
  toast.showToast('success', 'Certification Enrichie', 'Le document a été certifié avec toutes ses métadonnées.')
  await userDocsentryStore.fetchDocuments(5, 0)
  await userDocsentryStore.fetchTrend()
  closeModals()
}

const handleVerify = async (file: File) => {
  const success = await publicDocsentryStore.verifyDocumentFull(file, null)
  if (success) {
    if (publicDocsentryStore.verificationResult?.verified) {
      toast.showToast('success', 'Authentique', 'Le document est certifié valide par CYPASS.')
    } else {
      toast.showToast('warning', 'Attention', 'La signature de ce document est invalide ou corrompue.')
    }
  } else {
    toast.showToast('error', 'Erreur', publicDocsentryStore.error || 'Erreur lors de la vérification.')
  }
}

const closeModals = () => {
  modals.choice = false
  modals.upload = false
  modals.enriched = false
  modals.verify = false
  modals.createIncident = false
  userDocsentryStore.error = null
  userDocsentryStore.uploadResult = null
  publicDocsentryStore.verificationResult = null
  publicDocsentryStore.error = null
}

const calculateVigiTrend = async () => {
  try {
    const now = new Date()
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const previousWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
    const previousWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })

    const response = await $fetch<any>('/api/user/vigitech/incident-list', {
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

const updateSecurityScore = () => {
  const logs = activitiesStore.logs || []
  const failedLogins = logs.filter(l => l.action_type.toLowerCase().includes('login') && l.status !== 'success').length
  const otherFailures = logs.filter(l => !l.action_type.toLowerCase().includes('login') && l.status !== 'success').length

  securityScore.value = calculateSecurityScore({
    documentsCount: userDocsentryStore.pagination.total,
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
    userDocsentryStore.fetchDocuments(5, 0),
    notificationsStore.notificationsList(5, 0),
    activitiesStore.getUserLogs({ limit: 5 }),
    vigitechStore.fetchUserIncidents(),
    vigitechStore.fetchUserComments(),
    activitiesStore.sessionsGet().then((sessions: any[]) => {
      activeSessions.value = sessions || []
      activeSessionsCount.value = sessions?.length || 0
    }),
    userDocsentryStore.fetchTrend(),
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
