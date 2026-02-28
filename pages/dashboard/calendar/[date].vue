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
        <p class="text-hsa">Détails des événements pour cette journée.</p>
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
                <!-- Docsentry -->
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" :checked="filterTypes.includes('docsentry')"
                      @change="toggleFilter('docsentry')" class="peer sr-only">
                    <div
                      class="w-5 h-5 border-2 border-ash rounded transition-colors peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary/50">
                    </div>
                    <IconCheck
                      class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-primary/10 text-primary">
                      <IconFileText class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium text-BtW">Docsentry</span>
                  </div>
                </label>

                <!-- Vigitech -->
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" :checked="filterTypes.includes('vigitech')"
                      @change="toggleFilter('vigitech')" class="peer sr-only">
                    <div
                      class="w-5 h-5 border-2 border-ash rounded transition-colors peer-checked:bg-rose-500 peer-checked:border-rose-500 group-hover:border-rose-500/50">
                    </div>
                    <IconCheck
                      class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-rose-500/10 text-rose-500">
                      <IconAlertTriangle class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium text-BtW">Vigitech</span>
                  </div>
                </label>

                <!-- Comments -->
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" :checked="filterTypes.includes('comment')" @change="toggleFilter('comment')"
                      class="peer sr-only">
                    <div
                      class="w-5 h-5 border-2 border-ash rounded transition-colors peer-checked:bg-amber-500 peer-checked:border-amber-500 group-hover:border-amber-500/50">
                    </div>
                    <IconCheck
                      class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-amber-500/10 text-amber-500">
                      <IconMessage class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium text-BtW">Commentaires</span>
                  </div>
                </label>

                <!-- Logs -->
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" :checked="filterTypes.includes('log')" @change="toggleFilter('log')"
                      class="peer sr-only">
                    <div
                      class="w-5 h-5 border-2 border-ash rounded transition-colors peer-checked:bg-slate-500 peer-checked:border-slate-500 group-hover:border-slate-500/50">
                    </div>
                    <IconCheck
                      class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-slate-500/10 text-slate-500">
                      <IconActivity class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium text-BtW">Traces d'activité</span>
                  </div>
                </label>

                <!-- Sessions -->
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center">
                    <input type="checkbox" :checked="filterTypes.includes('session')" @change="toggleFilter('session')"
                      class="peer sr-only">
                    <div
                      class="w-5 h-5 border-2 border-ash rounded transition-colors peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-500/50">
                    </div>
                    <IconCheck
                      class="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
                      <IconDeviceDesktop class="w-4 h-4" />
                    </div>
                    <span class="text-sm font-medium text-BtW">Sessions Auth</span>
                  </div>
                </label>
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
import { IconArrowLeft, IconCheck, IconFileText, IconAlertTriangle, IconMessage, IconActivity, IconDeviceDesktop } from '@tabler/icons-vue'
import { useCalendarEvents } from '~/composables/useCalendarEvents'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const dateParam = route.params.date as string

const {
  loading,
  filteredEventsByDate,
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
