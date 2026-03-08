<template>
  <div class="space-y-8">
    <MeReportsHeader :loading="currentStore.loading" @refresh="fetchData" />
    <MeReportsTabs v-model="activeTab" :tabs="tabs" />

    <!-- Contenu -->
    <div class="animate-fade-in-up">
      <!-- Chargement -->
      <div v-if="currentStore.loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiAppSkeleton v-for="i in 4" :key="i" height="180px" radius="2rem" />
      </div>

      <!-- Erreur -->
      <MeReportsError v-else-if="currentStore.error" :error="currentStore.error" @retry="fetchData" />

      <!-- Vide -->
      <MeReportsEmpty v-else-if="!currentReports.length" :active-tab="activeTab" />

      <!-- Liste -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MeReportsCard v-for="report in currentReports" :key="report.id" :report="report" :mode="activeTab"
          @view-details="handleViewDetails" @edit="handleEditReport" @delete="handleDeleteReport" />
      </div>
    </div>

    <!-- Modale de Détails -->
    <ModalReportDetail :show="showDetail" :report="selectedReport" @close="showDetail = false" />

    <!-- Modale de Modification (Incident) -->
    <ModalVigitechReportIncident :show="showEditModal" :incident-id="selectedEditReport?.incident_id || ''"
      :report="selectedEditReport" @close="showEditModal = false" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { useReportStore } from '~/stores/report'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

const reportStore = useReportStore()
const profilStore = useProfilStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

// Active store based on report type
const currentStore = computed(() => {
  return reportStore.reportType === 'user' ? profilStore : reportStore
})

const activeTab = ref<'sent' | 'received'>('sent')
const showDetail = ref(false)
const selectedReport = ref<any>(null)

const showEditModal = ref(false)
const selectedEditReport = ref<any>(null)

const tabs: { id: 'sent' | 'received'; label: string }[] = [
  { id: 'sent', label: 'Envoyés' },
  { id: 'received', label: 'Reçus' }
]

const currentReports = computed(() => {
  return activeTab.value === 'sent' ? currentStore.value.sentReportsList : currentStore.value.receivedReportsList
})

const handleViewDetails = async (report: any) => {
  selectedReport.value = null
  showDetail.value = true

  let details = null
  if (reportStore.reportType === 'user') {
    details = await profilStore.getReport(report.id)
  } else {
    details = await reportStore.fetchReportDetails(report.id)
  }

  if (details) {
    selectedReport.value = { ...report, ...details }
  }
}

const handleEditReport = (report: any) => {
  selectedEditReport.value = report
  showEditModal.value = true
}

const handleDeleteReport = async (report: any) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.')) return

  // Only incident reports are currently removable via UI in the old store, 
  // keeping the logic if it's incident type.
  if (reportStore.reportType === 'incident') {
    const result = await reportStore.deleteIncidentReport(report.id)
    if (result.success) {
      toast.showToast('success', 'Supprimé', 'Le signalement a été supprimé.')
    } else {
      toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer le signalement.')
    }
  }
}

const fetchData = async () => {
  if (activeTab.value === 'sent') {
    await currentStore.value.sentReports()
  } else {
    await currentStore.value.receivedReports()
  }
}

// Watch active tab or report type to fetch data
watch([activeTab, () => reportStore.reportType], fetchData)

// Check for initial tab from query
onMounted(() => {
  if (route.query.tab === 'received') {
    activeTab.value = 'received'
  }
  fetchData()
})

useHead({
  title: 'Centre de signalement',
  meta: [
    { name: 'description', content: 'Gérez et consultez l’historique de vos signalements envoyés et reçus sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
