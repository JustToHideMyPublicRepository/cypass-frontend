<template>
  <div class="space-y-6">
    <MeCalendarDetailHeader :formatted-date="formattedDate" :daily-insight-text="dailyInsightText" />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <UiAppSkeleton height="400px" class="lg:col-span-1" />
      <div class="lg:col-span-3 space-y-4">
        <UiAppSkeleton v-for="i in 3" :key="i" height="100px" />
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <MeCalendarDetailSidebar :current-date="currentDate" :filter-types="filterTypes"
          :visible-filters="visibleFilters" :current-day-counts="currentDayCounts" @toggle-filter="toggleFilter" />
      </div>

      <!-- Events List -->
      <div class="lg:col-span-3">
        <MeCalendarDetailDayList :events="currentDayEvents" @open-modal="handleOpenModal" />
      </div>
    </div>

    <!-- Modals -->
    <ModalVigitechCommentDetail :show="showCommentModal" :comment="selectedComment" @close="showCommentModal = false" />

    <ModalReportDetail :show="showReportModal" :report="selectedReport" :report-type="reportType" :mode="reportMode"
      @close="showReportModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCalendarEvents } from '~/composables/useCalendarEvents'
import { CALENDAR_FILTERS as AVAILABLE_FILTERS } from '~/utils/calendar'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()
const dateParam = route.params.date as string

const {
  loading,
  filteredEventsByDate,
  eventsByDate,
  filterTypes,
  fetchAllEvents,
  toggleFilter
} = useCalendarEvents()

// Parse the date from URL
const currentDate = computed(() => {
  try {
    const d = parseISO(dateParam)
    if (isValid(d)) return d
    return new Date() // Fallback
  } catch {
    return new Date()
  }
})

const formattedDate = computed(() => {
  return format(currentDate.value, 'EEEE d MMMM yyyy', { locale: fr })
})

// Modal States
const showCommentModal = ref(false)
const selectedComment = ref<any>(null)
const showReportModal = ref(false)
const selectedReport = ref<any>(null)
const reportType = ref<'user' | 'incident'>('user')
const reportMode = ref<'sent' | 'received'>('sent')

// Counts and Insights
const currentDayCounts = computed(() => {
  const counts: Record<string, number> = {
    docsentry: 0,
    vigitech: 0,
    comment: 0,
    log: 0,
    session: 0,
    report: 0
  }

  const allDayEvents = eventsByDate.value[dateParam] || []
  allDayEvents.forEach(event => {
    if (counts[event.type] !== undefined) {
      counts[event.type]++
    }
  })

  return counts
})

const visibleFilters = computed(() => {
  return AVAILABLE_FILTERS.filter(f => currentDayCounts.value[f.id] > 0)
})

const dailyInsightText = computed(() => {
  const allEvents = eventsByDate.value[dateParam] || []
  const count = allEvents.length

  if (count === 0) return "Tout est calme aujourd'hui. Profitez de ce moment de répit!"

  const counts = currentDayCounts.value

  if (counts.docsentry > counts.vigitech && counts.docsentry > counts.log) {
    return "Vous êtes à fond dans l'intégrité aujourd'hui ! Beaucoup de documents certifiés."
  }
  if (counts.vigitech > 0) {
    return "Merci pour la veille active ! Des incidents ont été signalés."
  }
  if (count > 20) {
    return "Vous avez beaucoup d'activités aujourd'hui. Une journée bien remplie !"
  }

  return "Une journée standard avec plusieurs événements enregistrés."
})

const currentDayEvents = computed(() => {
  return filteredEventsByDate.value[dateParam] || []
})

const vigitechStore = useUserVigitechStore()
const toast = useToastStore()

const handleOpenModal = async (event: any) => {
  if (event.type === 'comment') {
    selectedComment.value = null
    showCommentModal.value = true
    const res = await vigitechStore.fetchCommentById(event.rawItem.id)
    if (res.success) {
      selectedComment.value = res.data
    } else {
      toast.showToast('error', 'Erreur', 'Impossible de charger le commentaire.')
      showCommentModal.value = false
    }
  } else if (event.type === 'report') {
    selectedReport.value = event.rawItem
    // Determine type and mode from rawItem if possible, or fallback
    reportType.value = event.rawItem.reported_user_id ? 'user' : 'incident'
    reportMode.value = event.rawItem.sender_id === useAuthStore().user?.id ? 'sent' : 'received'
    showReportModal.value = true
  }
}

useHead({
  title: `${formattedDate.value} - Calendrier`,
  meta: [
    { name: 'description', content: `Détails des activités du ${formattedDate.value} sur CYPASS.` },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

onMounted(() => {
  fetchAllEvents(dateParam)
})
</script>
