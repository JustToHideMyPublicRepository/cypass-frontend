<template>
  <div class="space-y-6">
    <MeCalendarHeader />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <UiAppSkeleton height="400px" class="lg:col-span-1" />
      <UiAppSkeleton height="600px" class="lg:col-span-3" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <MeCalendarSidebar :current-date="currentDate" :filter-types="filterTypes" :events-by-date="eventsByDate"
          @prev-month="prevMonth" @next-month="nextMonth" @update-date="updateDate" @toggle-filter="toggleFilter" />
      </div>

      <!-- Calendar Grid -->
      <div class="lg:col-span-3">
        <MeCalendarGrid :current-date="currentDate" :events-by-date="filteredEventsByDate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addMonths, subMonths } from 'date-fns'
import { useCalendarEvents } from '~/composables/useCalendarEvents'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Calendrier'
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

onMounted(() => {
  fetchAllEvents()
})
</script>
