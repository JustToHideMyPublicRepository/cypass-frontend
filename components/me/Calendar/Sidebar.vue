<template>
  <UiBaseCard class="h-full">
    <div class="space-y-6">

      <!-- Date Picker or Month Navigation -->
      <div>
        <h3 class="text-lg font-bold text-BtW mb-4">Mois</h3>
        <div class="flex items-center justify-between bg-ash/30 p-2 rounded-xl">
          <button @click="$emit('prev-month')"
            class="p-2 rounded-lg hover:bg-WtB text-hsa hover:text-primary transition-colors">
            <IconChevronLeft class="w-5 h-5" />
          </button>

          <span class="font-medium text-BtW capitalize">
            {{ formattedMonth }}
          </span>

          <button @click="$emit('next-month')"
            class="p-2 rounded-lg hover:bg-WtB text-hsa hover:text-primary transition-colors">
            <IconChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>

      <hr class="border-ash/50" />

      <!-- Filters -->
      <div>
        <h3 class="text-sm font-bold text-hsa uppercase tracking-wider mb-4">Filtres d'événements</h3>

        <div class="space-y-3">
          <!-- Docsentry -->
          <label class="flex items-center gap-3 cursor-pointer group">
            <div class="relative flex items-center justify-center">
              <input type="checkbox" :checked="filterTypes.includes('docsentry')" @change="toggleFilter('docsentry')"
                class="peer sr-only">
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
              <input type="checkbox" :checked="filterTypes.includes('vigitech')" @change="toggleFilter('vigitech')"
                class="peer sr-only">
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
              <span class="text-sm font-medium text-BtW">Sessions auth</span>
            </div>
          </label>
        </div>
      </div>

    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { IconChevronLeft, IconChevronRight, IconCheck, IconFileText, IconAlertTriangle, IconMessage, IconActivity, IconDeviceDesktop } from '@tabler/icons-vue'
import type { EventType } from '~/composables/useCalendarEvents'

const props = defineProps<{
  currentDate: Date
  filterTypes: EventType[]
}>()

const emit = defineEmits<{
  (e: 'prev-month'): void
  (e: 'next-month'): void
  (e: 'toggle-filter', type: EventType): void
}>()

const formattedMonth = computed(() => {
  return format(props.currentDate, 'MMMM yyyy', { locale: fr })
})

const toggleFilter = (type: EventType) => {
  emit('toggle-filter', type)
}
</script>
