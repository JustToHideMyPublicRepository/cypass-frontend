<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Calendrier d'activités</h1>
        <p class="text-hsa">Vue unifiée de toutes vos actions et événements.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <UiAppSkeleton height="400px" class="lg:col-span-1" />
      <UiAppSkeleton height="600px" class="lg:col-span-3" />
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <MeCalendarSidebar :current-date="currentDate" :filter-types="filterTypes" @prev-month="prevMonth"
          @next-month="nextMonth" @toggle-filter="toggleFilter" />
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

onMounted(() => {
  fetchAllEvents()
})
</script>
