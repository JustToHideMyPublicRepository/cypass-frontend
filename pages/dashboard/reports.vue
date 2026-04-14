<template>
  <div class="space-y-8">
    <MeReportsHeader v-model="reportType" :loading="currentStore.loading" @refresh="fetchData" />
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
      <div v-else class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MeReportsCard v-for="report in currentReports" :key="report.id" :report="report" :mode="activeTab"
            :report-type="reportType" @view-details="handleViewDetails" @edit="handleEditReport"
            @delete="handleDeleteReport" />
        </div>

        <!-- Pagination -->
        <div v-if="hasMore" class="flex justify-center pt-4">
          <UiBaseButton variant="ghost" size="sm" @click="handleLoadMore" :loading="loadingMore"
            class="!rounded-2xl !px-8 !py-3 text-[10px] font-black uppercase tracking-widest bg-ash/5 hover:bg-ash/10 text-hsa hover:text-primary transition-all">
            <IconChevronDown class="w-4 h-4 mr-2" />
            Voir plus de signalements
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Modale de Détails -->
    <ModalReportDetail :show="showDetail" :mode="activeTab" :report-type="reportType" :report="selectedReport"
      @close="showDetail = false" />

    <!-- Modale de Modification (Incident) -->
    <ModalReportAddIncident :show="showEditModal" :incident-id="selectedEditReport?.incident_id || ''"
      :report="selectedEditReport" @close="showEditModal = false" @success="fetchData" />

    <!-- Modale de Confirmation de Suppression -->
    <UiConfirmModal :show="showConfirmDelete" title="Supprimer le signalement"
      message="Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible."
      confirm-text="Supprimer" cancel-text="Annuler" variant="danger" :loading="isDeleting"
      @close="showConfirmDelete = false" @confirm="handleConfirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { useReportUserStore } from '~/stores/back/user/reportUser'
import { useReportIncidentStore } from '~/stores/back/user/reportIncident'
import { useToastStore } from '~/stores/front/toast'
import { IconChevronDown } from '@tabler/icons-vue'

const reportUserStore = useReportUserStore()
const reportIncidentStore = useReportIncidentStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const reportType = ref<'user' | 'incident'>('user')

// Active store based on report type
const currentStore = computed(() => {
  return reportType.value === 'user' ? reportUserStore : reportIncidentStore
})

const activeTab = ref<'sent' | 'received'>('sent')
const showDetail = ref(false)
const selectedReport = ref<any>(null)

const showEditModal = ref(false)
const selectedEditReport = ref<any>(null)
const loadingMore = ref(false)

const showConfirmDelete = ref(false)
const reportToDelete = ref<any>(null)
const isDeleting = ref(false)

const hasMore = computed(() => {
  if (activeTab.value === 'sent') {
    return currentStore.value.sentPagination.hasMore
  }
  return currentStore.value.receivedPagination.hasMore
})

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
  if (reportType.value === 'user') {
    details = activeTab.value === 'sent'
      ? await reportUserStore.getSentReport(report.id)
      : await reportUserStore.getReceivedReport(report.id)
  } else {
    details = activeTab.value === 'sent'
      ? await reportIncidentStore.getSentReport(report.id)
      : await reportIncidentStore.getReceivedReport(report.id)
  }

  if (details) {
    selectedReport.value = { ...report, ...details }
  }
}

const handleEditReport = (report: any) => {
  selectedEditReport.value = report
  showEditModal.value = true
}

const handleDeleteReport = (report: any) => {
  reportToDelete.value = report
  showConfirmDelete.value = true
}

const handleConfirmDelete = async () => {
  if (!reportToDelete.value) return
  isDeleting.value = true

  try {
    const success = await reportIncidentStore.deleteReport(reportToDelete.value.id)
    if (success) {
      toast.showToast('success', 'Succès', 'Signalement supprimé avec succès.')
      showConfirmDelete.value = false
    } else {
      toast.showToast('error', 'Erreur', reportIncidentStore.error || 'Impossible de supprimer le signalement.')
    }
  } catch (err: any) {
    toast.showToast('error', 'Erreur', 'Une erreur est survenue lors de la suppression.')
  } finally {
    isDeleting.value = false
    reportToDelete.value = null
  }
}

const fetchData = async () => {
  if (activeTab.value === 'sent') {
    await currentStore.value.sentReports()
  } else {
    await currentStore.value.receivedReports()
  }
}

const handleLoadMore = async () => {
  loadingMore.value = true
  if (activeTab.value === 'sent') {
    await currentStore.value.sentReports(true)
  } else {
    await currentStore.value.receivedReports(true)
  }
  loadingMore.value = false
}

// Watch active tab or report type to fetch data
watch([activeTab, reportType], fetchData)

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
