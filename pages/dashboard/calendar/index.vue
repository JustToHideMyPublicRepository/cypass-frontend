<template>
  <div class="space-y-6">
    <MeCalendarHomeHeader />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <UiAppSkeleton height="400px" class="lg:col-span-1" />
      <UiAppSkeleton height="600px" class="lg:col-span-3" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <MeCalendarHomeSidebar :current-date="currentDate" :filter-types="filterTypes" :events-by-date="eventsByDate"
          @prev-month="prevMonth" @next-month="nextMonth" @update-date="updateDate" @toggle-filter="toggleFilter" />
      </div>

      <!-- Calendar Grid -->
      <div class="lg:col-span-3">
        <MeCalendarHomeGrid :current-date="currentDate" :events-by-date="filteredEventsByDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { addMonths, subMonths, format } from 'date-fns'
import { useCalendarEvents } from '~/composables/useCalendarEvents'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Calendrier',
  meta: [
    { name: 'description', content: 'Consultez vos activités et événements de sécurité sur votre calendrier CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const {
  loading,
  eventsByDate,
  filteredEventsByDate,
  filterTypes,
  fetchAllEvents,
  toggleFilter
} = useCalendarEvents()

const currentDate = ref(new Date())

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

const updateDate = (newDate: Date) => {
  currentDate.value = newDate
}

watch(currentDate, () => {
  // Try to fetch for the whole month if backend allows, otherwise it will use the default day
  const monthStr = format(currentDate.value, 'yyyy-MM')
  fetchAllEvents(monthStr)
}, { immediate: false })

onMounted(() => {
  fetchAllEvents(format(new Date(), 'yyyy-MM'))
})
</script>
