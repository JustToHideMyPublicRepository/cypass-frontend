<template>
  <div class="space-y-6">
    <MeActivitiesHomeHeader :user-email="logUser?.email" :loading="loading" @refresh="refreshLogs"
      @reset="resetFilters" />

    <MeActivitiesHomeStats :stats="logStatistics" :filters="filters" />

    <MeActivitiesHomeFilters v-model="filters" :active-filters="logFilters" />

    <MeActivitiesHomeList :logs="paginatedLogs" :grouped-logs="groupedLogs" :loading="loading"
      :current-page="currentPage" :total-pages="totalPages" @next-page="nextPage" @prev-page="prevPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useActivitiesStore } from '~/stores/back/user/activities'
import { format, isValid, parseISO, startOfMonth } from 'date-fns'
import { getLogActionInfo } from '~/utils/logs'

const activitiesStore = useActivitiesStore()
const route = useRoute()

const { logs, logStatistics, logUser, logFilters } = storeToRefs(activitiesStore)
const loading = ref(false)

const getInitialFilters = () => {
  const defaultFilters = {
    date: (route.query.date as string) || format(new Date(), 'yyyy-MM-dd'),
    type: 'all',
    limit: 50,
    search: '',
    usePeriod: false,
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  }

  if (import.meta.client) {
    const saved = sessionStorage.getItem('cps_logs_filters')
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved)
        if (Date.now() - timestamp < 300000) { // 5 minutes
          return { ...defaultFilters, ...data }
        } else {
          sessionStorage.removeItem('cps_logs_filters')
        }
      } catch (e) { }
    }
  }
  return defaultFilters
}

const filters = ref(getInitialFilters())

const currentPage = ref(1)
const itemsPerPage = computed(() => filters.value.limit)

const fetchLogs = async () => {
  loading.value = true
  if (filters.value.usePeriod) {
    await activitiesStore.getUserLogsPeriod({
      limit: 500,
      type: filters.value.type,
      start_date: filters.value.start_date,
      end_date: filters.value.end_date
    })
  } else {
    await activitiesStore.getUserLogs({
      limit: 500,
      type: filters.value.type,
      date: filters.value.date || undefined
    })
  }
  currentPage.value = 1
  loading.value = false
}

const filteredLogs = computed(() => {
  if (!logs.value) return []
  if (!filters.value.search) return logs.value

  const q = filters.value.search.toLowerCase()
  return logs.value.filter(log => {
    const action = (log.action_type || '').toLowerCase()
    const label = (log.action_label || '').toLowerCase()
    const mappedLabel = getLogActionInfo(log.action_type).label.toLowerCase()

    let details = ''
    try {
      details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})
    } catch (e) {
      details = ''
    }
    details = details.toLowerCase()

    return action.includes(q) || label.includes(q) || mappedLabel.includes(q) || details.includes(q)
  })
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => {
  if (filteredLogs.value.length === 0) return 1
  return Math.ceil(filteredLogs.value.length / itemsPerPage.value)
})

const groupedLogs = computed(() => {
  if (!paginatedLogs.value || !Array.isArray(paginatedLogs.value)) return {}
  const groups: Record<string, any[]> = {}

  paginatedLogs.value.forEach(log => {
    try {
      if (!log.created_at) return
      const normalizedTs = log.created_at.includes('T') ? log.created_at : log.created_at.replace(' ', 'T')
      const dateObj = new Date(normalizedTs)
      if (isNaN(dateObj.getTime())) return

      const dateKey = format(dateObj, 'yyyy-MM-dd')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(log)
    } catch (e) {
      console.warn('Error grouping log:', e)
    }
  })

  // Sort dates descending
  const sortedGroups: Record<string, any[]> = {}
  Object.keys(groups).sort((a, b) => b.localeCompare(a)).forEach(key => {
    sortedGroups[key] = groups[key]
  })

  return sortedGroups
})

// Watchers for automatic filtering
watch([
  () => filters.value.date,
  () => filters.value.type,
  () => filters.value.usePeriod,
  () => filters.value.start_date,
  () => filters.value.end_date
], () => {
  fetchLogs()
})

watch(() => filters.value, (newVal) => {
  if (import.meta.client) {
    sessionStorage.setItem('cps_logs_filters', JSON.stringify({ data: newVal, timestamp: Date.now() }))
  }
}, { deep: true })

const refreshLogs = () => {
  fetchLogs()
}

const resetFilters = () => {
  filters.value.date = format(new Date(), 'yyyy-MM-dd')
  filters.value.type = 'all'
  filters.value.limit = 50
  filters.value.search = ''
  filters.value.usePeriod = false
  filters.value.start_date = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  filters.value.end_date = format(new Date(), 'yyyy-MM-dd')
  fetchLogs()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

import { useSearchStore } from '~/stores/front/search'
import { useShortcuts } from '~/composables/useShortcuts'

const searchStore = useSearchStore()
const filterRef = ref<any>(null)

useShortcuts({
  searchCallback: () => searchStore.openSearch(),
  localSearchCallback: () => {
    // Focus logic for local search
    const input = document.querySelector('input[placeholder="Filtrer..."]') as HTMLInputElement
    if (input) input.focus()
  }
})

onMounted(() => {
  fetchLogs()
})

useHead({
  title: 'Historique d\'activité',
  meta: [
    { name: 'description', content: 'Consultez l\'historique détaillé des actions effectuées sur votre compte.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
