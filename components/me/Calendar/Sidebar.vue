<template>
  <UiBaseCard class="h-full">
    <div class="space-y-6">
      <!-- Date Picker or Month Navigation -->
      <div>
        <h3 class="text-sm font-bold text-hsa uppercase tracking-wider mb-4">Période</h3>

        <!-- Quick Nav Selects -->
        <div class="flex items-center justify-between bg-ash/30 p-2 rounded-xl mb-3">
          <button @click="$emit('prev-month')"
            class="p-2 rounded-lg hover:bg-WtB text-hsa hover:text-primary transition-colors">
            <IconChevronLeft class="w-5 h-5" />
          </button>

          <div class="flex items-center gap-1">
            <select v-model="selectedMonth"
              class="bg-transparent text-BtW font-bold text-center appearance-none cursor-pointer focus:outline-none">
              <option v-for="(m, i) in months" :key="i" :value="i" class="bg-WtB text-BtW">{{ m }}</option>
            </select>
            <span class="text-hsa font-medium">/</span>
            <input type="number" v-model="selectedYear" list="year-options"
              class="bg-transparent text-BtW font-bold text-center appearance-none cursor-pointer focus:outline-none w-16" />
            <datalist id="year-options">
              <option v-for="y in years" :key="y" :value="y"></option>
            </datalist>
          </div>

          <button @click="$emit('next-month')"
            class="p-2 rounded-lg hover:bg-WtB text-hsa hover:text-primary transition-colors">
            <IconChevronRight class="w-5 h-5" />
          </button>
        </div>

        <!-- Direct Date Search -->
        <div class="mt-6">
          <div class="flex items-center gap-1.5 mb-3">
            <h3 class="text-sm font-bold text-hsa uppercase tracking-wider">Recherche Rapide</h3>
            <div class="relative group/tooltip">
              <IconInfoCircle
                class="w-3.5 h-3.5 text-hsa cursor-help opacity-60 hover:opacity-100 transition-opacity" />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 z-[100] text-[10px] leading-relaxed scale-95 group-hover/tooltip:scale-100 origin-bottom">
                <div class="font-bold border-b border-white/10 pb-1.5 mb-1.5 text-white/90 uppercase tracking-tighter">
                  Information</div>
                <div class="text-white/70">Sélectionnez ou saisissez directement une date pour y accéder instantanément.
                </div>
                <div
                  class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/90">
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <IconCalendarSearch class="w-4 h-4 text-hsa" />
            </div>
            <input type="date" v-model="specificDateString" @change="goToSpecificDate"
              class="w-full bg-ash/20 border border-ash/50 text-BtW text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              title="Rechercher une date précise" />
          </div>
        </div>
      </div>

      <hr class="border-ash/50" />

      <!-- Filters -->
      <div>
        <h3 class="text-sm font-bold text-hsa uppercase tracking-wider mb-4">Filtres d'événements</h3>

        <div class="space-y-3">
          <!-- Dynamic Filters -->
          <label v-for="filter in AVAILABLE_FILTERS" :key="filter.id"
            class="flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-3">
              <div class="relative flex items-center justify-center">
                <input type="checkbox" :checked="filterTypes.includes(filter.id as any)"
                  @change="toggleFilter(filter.id as any)" class="peer sr-only">
                <div class="w-5 h-5 border-2 border-ash rounded transition-colors" :class="[
                  filter.classes.peerCheckedBg, filter.classes.peerCheckedBorder, filter.classes.groupHoverBorder
                ]">
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
            <div v-if="eventsByDate && currentMonthCounts[filter.id] !== undefined"
              class="px-2 py-0.5 rounded-full text-xs font-bold"
              :class="currentMonthCounts[filter.id] > 0 ? `${filter.classes.bgLight} ${filter.classes.text}` : 'bg-ash/30 text-hsa'">
              {{ currentMonthCounts[filter.id] }}
            </div>
          </label>
        </div>
      </div>

    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IconChevronLeft, IconChevronRight, IconCheck, IconCalendarSearch, IconInfoCircle } from '@tabler/icons-vue'
import type { EventType, CalendarEvent } from '~/composables/useCalendarEvents'
import { CALENDAR_FILTERS as AVAILABLE_FILTERS } from '~/utils/calendar'

const props = defineProps<{
  currentDate: Date
  filterTypes: EventType[]
  eventsByDate?: Record<string, CalendarEvent[]>
}>()

const emit = defineEmits<{
  (e: 'prev-month'): void
  (e: 'next-month'): void
  (e: 'update-date', date: Date): void
  (e: 'toggle-filter', type: EventType): void
}>()

const router = useRouter()

// Month / Year logic
const months = [
  'Janv', 'Févr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const arr = []
  for (let y = currentYear - 30; y <= currentYear + 10; y++) {
    arr.push(y)
  }
  return arr
})

const selectedMonth = computed({
  get: () => props.currentDate.getMonth(),
  set: (val) => {
    const d = new Date(props.currentDate)
    d.setMonth(val)
    emit('update-date', d)
  }
})

const selectedYear = computed({
  get: () => props.currentDate.getFullYear(),
  set: (val) => {
    const d = new Date(props.currentDate)
    d.setFullYear(val)
    emit('update-date', d)
  }
})

// Quick direct date
const specificDateString = ref('')

const goToSpecificDate = () => {
  if (specificDateString.value) {
    router.push(`/dashboard/calendar/${specificDateString.value}`)
  }
}

// Counts computed
const currentMonthCounts = computed(() => {
  const counts: Record<string, number> = {
    docsentry: 0,
    vigitech: 0,
    comment: 0,
    log: 0,
    session: 0
  }

  const eventsMap = props.eventsByDate
  if (!eventsMap) return counts

  Object.keys(eventsMap).forEach(dateKey => {
    const d = new Date(dateKey)
    if (d.getMonth() === props.currentDate.getMonth() && d.getFullYear() === props.currentDate.getFullYear()) {
      eventsMap[dateKey].forEach(event => {
        if (counts[event.type] !== undefined) {
          counts[event.type]++
        }
      })
    }
  })

  return counts
})

const toggleFilter = (type: EventType) => {
  emit('toggle-filter', type)
}
</script>
