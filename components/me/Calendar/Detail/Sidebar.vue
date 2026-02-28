<template>
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
                  @change="$emit('toggle-filter', filter.id as any)" class="peer sr-only">
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
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconCheck } from '@tabler/icons-vue'
import type { EventType } from '~/composables/useCalendarEvents'

type FilterConfig = {
  id: string
  label: string
  icon: any
  classes: {
    text: string
    bgLight: string
    peerCheckedBg: string
    peerCheckedBorder: string
    groupHoverBorder: string
  }
}

defineProps<{
  currentDate: Date
  visibleFilters: FilterConfig[]
  filterTypes: EventType[]
  currentDayCounts: Record<string, number>
}>()

defineEmits<{
  (e: 'toggle-filter', type: EventType): void
}>()
</script>
