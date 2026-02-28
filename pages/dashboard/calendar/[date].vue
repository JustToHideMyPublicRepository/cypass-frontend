<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4 border-b border-ash pb-4">
      <NuxtLink to="/dashboard/calendar"
        class="p-2 rounded-xl bg-ash/30 hover:bg-ash/50 text-hsa hover:text-primary transition-colors">
        <IconArrowLeft class="w-5 h-5" />
      </NuxtLink>

      <div>
        <h1 class="text-2xl font-bold text-BtW capitalize">
          {{ formattedDate }}
        </h1>
        <p class="text-hsa font-medium">{{ dailyInsightText }}</p>
      </div>
    </div>

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
        <UiBaseCard class="h-full">
          <div class="space-y-6">
            <div>
              <h3 class="text-sm font-bold text-hsa uppercase tracking-wider mb-4">Mois correspondant</h3>
              <div class="p-3 bg-ash/10 rounded-xl text-center font-medium capitalize text-BtW border border-ash">
                {{ format(currentDate, 'MMMM yyyy', { locale: fr }) }}
              </div>
              <div class="mt-3 text-center">
                <NuxtLink to="/dashboard/calendar" class="text-sm text-primary hover:underline font-medium">
                  Retour au calendrier complet
                </NuxtLink>
              </div>
            </div>

            <hr class="border-ash/50" />

            <!-- Filters -->
            <div>
              <h3 class="text-sm font-bold text-hsa uppercase tracking-wider mb-4">Filtrer les résultats</h3>
              <div class="space-y-3">
                <label v-for="filter in visibleFilters" :key="filter.id"
                  class="flex items-center justify-between cursor-pointer group">
                  <div class="flex items-center gap-3">
                    <div class="relative flex items-center justify-center">
                      <input type="checkbox" :checked="filterTypes.includes(filter.id as any)"
                        @change="toggleFilter(filter.id as any)" class="peer sr-only">
                      <div class="w-5 h-5 border-2 border-ash rounded transition-colors"
                        :class="[filter.classes.peerCheckedBg, filter.classes.peerCheckedBorder, filter.classes.groupHoverBorder]">
                      </div>
                      <IconCheck
                        class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="p-1.5 rounded" :class="[filter.classes.bgLight, filter.classes.text]">
                        <component :is="filter.icon" class="w-4 h-4" />
                      </div>
                      <span class="text-sm font-medium text-BtW">{{ filter.label }}</span>
                    </div>
                  </div>

                  <!-- Count Badge -->
                  <div class="px-2 py-0.5 rounded-full text-xs font-bold"
                    :class="[filter.classes.bgLight, filter.classes.text]">
                    {{ currentDayCounts[filter.id] }}
                  </div>
                </label>

                <div v-if="visibleFilters.length === 0"
                  class="text-sm text-hsa text-center italic p-3 bg-ash/10 rounded-xl border border-ash/50">
                  Aucun événement disponible pour alimenter les filtres.
                </div>
              </div>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Events List -->
      <div class="lg:col-span-3">
        <MeCalendarDayList :events="currentDayEvents" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconArrowLeft, IconCheck } from '@tabler/icons-vue'
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
  title: `Calendrier - ${formattedDate.value}`
})

onMounted(() => {
  fetchAllEvents()
})
</script>
