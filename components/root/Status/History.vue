<template>
  <div class="space-y-4 animate-fade-up" style="animation-delay: 200ms">
    <div class="space-y-4">
      <div class="flex items-center justify-between pl-2">
        <h3 class="text-base md:text-lg font-bold">{{ dynamicTitle }}</h3>
        <div class="flex items-center gap-1 bg-ashAct/50 p-1 rounded-lg">
          <button v-for="option in periodOptions" :key="option.value"
            @click="systemStore.fetchSystemHystory(option.value)"
            class="p-2 rounded-md transition-all flex items-center justify-center transform active:scale-95"
            :class="systemStore.currentPeriod === option.value ? 'bg-primary text-WtB shadow-md border border-ash' : 'text-hsa hover:text-BtW hover:bg-ashAct/60'"
            :title="option.label">
            <component :is="option.icon" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="py-12 flex justify-center items-center">
      <UiLogoLoader size="md" />
    </div>

    <template v-else>
      <div v-if="hystory.length > 0" class="space-y-4">
        <div v-for="history in paginatedHystories" :key="history.id"
          class="glass-panel p-5 rounded-xl border border-ash/50 space-y-3 transition-all hover:border-ash group">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black uppercase tracking-widest opacity-60">{{ history.date }}</span>
            <span class="badge text-[9px]"
              :class="getStatusInfo(history.type).bgColor + ' ' + getStatusInfo(history.type).textColor">
              <component :is="getStatusInfo(history.type).icon" class="w-3 h-3 inline-block mr-1" />
              {{ getStatusInfo(history.type).label }}
            </span>
          </div>
          <h4 class="font-bold text-sm md:text-base group-hover:text-primary transition-colors">{{ history.title }}
          </h4>
          <p class="text-xs md:text-sm text-hsa leading-relaxed">{{ history.description }}</p>
          <div class="flex items-center gap-2 text-[10px] font-bold"
            :class="getHistoryStatusInfo(history.status).colorClass">
            <component :is="getHistoryStatusInfo(history.status).icon" class="w-3 h-3" />
            {{ getHistoryStatusInfo(history.status).label }}
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-between px-2 pt-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="p-2 rounded-lg hover:bg-ashAct/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronLeft class="w-4 h-4" />
          </button>
          <span class="text-xs font-medium text-hsa">Page {{ currentPage }} sur {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="p-2 rounded-lg hover:bg-ashAct/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <IconChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-else
        class="glass-panel p-6 md:p-8 rounded-xl md:rounded-2xl text-center py-8 md:py-12 border border-ash/50">
        <p class="text-sm md:text-base text-hsa">{{ emptyStateMessage }}</p>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSystemStore } from '~/stores/back/public/system'
import { getHistoryStatusInfo, getStatusInfo } from '~/utils/system'
import { IconChevronLeft, IconChevronRight, IconCalendar, IconCalendarWeek, IconCalendarMonth, IconCalendarTime, IconHistory } from '@tabler/icons-vue'

const systemStore = useSystemStore()

const hystory = computed(() => systemStore.hystory)
const loading = computed(() => systemStore.loadingHystory)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(hystory.value.length / itemsPerPage))

const paginatedHystories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return hystory.value.slice(start, end)
})

watch(() => systemStore.currentPeriod, () => {
  currentPage.value = 1
})

const dynamicTitle = computed(() => {
  switch (systemStore.currentPeriod) {
    case 'today': return "Incidents aujourd'hui"
    case 'week': return "Incidents cette semaine"
    case 'month': return "Incidents ce mois"
    case 'quarter': return "Incidents ce trimestre"
    case 'all': return "Tous les incidents"
    default: return "Historique"
  }
})

const periodOptions = [
  { label: 'Aujourd\'hui', value: 'today', icon: IconCalendar },
  { label: 'Cette semaine', value: 'week', icon: IconCalendarWeek },
  { label: 'Ce mois', value: 'month', icon: IconCalendarMonth },
  { label: 'Ce trimestre', value: 'quarter', icon: IconCalendarTime },
  { label: 'Tout l\'historique', value: 'all', icon: IconHistory }
]

const emptyStateMessage = computed(() => {
  switch (systemStore.currentPeriod) {
    case 'today': return "Aucun incident signalé aujourd'hui."
    case 'week': return "Aucun incident signalé cette semaine."
    case 'month': return "Aucun incident signalé ce mois-ci."
    case 'quarter': return "Aucun incident signalé ce trimestre."
    case 'all': return "Aucun incident signalé dans l'historique."
    default: return "Aucun incident signalé."
  }
})

onMounted(() => {
  if (systemStore.hystory.length === 0) {
    systemStore.fetchSystemHystory()
  }
})
</script>
