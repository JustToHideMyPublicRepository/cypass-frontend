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
        <MeCalendarDetailDayList :events="currentDayEvents" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useCalendarEvents } from '~/composables/useCalendarEvents'
import { CALENDAR_FILTERS as AVAILABLE_FILTERS } from '~/utils/calendar'

definePageMeta({
  layout: 'default'
})

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

// Counts and Insights
const currentDayCounts = computed(() => {
  const counts: Record<string, number> = {
    docsentry: 0,
    vigitech: 0,
    comment: 0,
    log: 0,
    session: 0
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

useHead({
  title: `${formattedDate.value} - Calendrier`
})

onMounted(() => {
  fetchAllEvents(dateParam)
})
</script>
