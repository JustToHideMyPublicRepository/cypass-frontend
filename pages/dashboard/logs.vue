<template>
  <div class="space-y-6">
    <MeActivitiesHeader :user-email="logUser?.email" :loading="loading" @refresh="refreshLogs" @reset="resetFilters" />

    <MeActivitiesStats :stats="logStatistics" />

    <MeActivitiesFilters v-model="filters" :active-filters="logFilters" />

    <MeActivitiesList :logs="paginatedLogs" :grouped-logs="groupedLogs" :loading="loading" :current-page="currentPage"
      :total-pages="totalPages" @next-page="nextPage" @prev-page="prevPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfilStore } from '~/stores/profil'
import { format } from 'date-fns'

const profilStore = useProfilStore()

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Historique d\'activité'
})

const { logs, logStatistics, logUser, logFilters } = storeToRefs(profilStore)
const loading = ref(false)

const filters = ref({
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'all',
  limit: 50,
  search: ''
})

const currentPage = ref(1)
const itemsPerPage = computed(() => filters.value.limit)

const fetchLogs = async () => {
  loading.value = true
  await profilStore.fetchLogs({
    limit: 500,
    type: filters.value.type,
    date: filters.value.date || undefined
  })
  currentPage.value = 1
  loading.value = false
}

const filteredLogs = computed(() => {
  if (!logs.value) return []
  if (!filters.value.search) return logs.value

  const q = filters.value.search.toLowerCase()
  return logs.value.filter(log => {
    const action = (log.action || '').toLowerCase()
    const label = (log.action_label || '').toLowerCase()
    let details = ''
    try {
      details = typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})
    } catch (e) {
      details = ''
    }
    details = details.toLowerCase()

    return action.includes(q) || label.includes(q) || details.includes(q)
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
      if (!log.timestamp) return
      const normalizedTs = log.timestamp.includes('T') ? log.timestamp : log.timestamp.replace(' ', 'T')
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
watch([() => filters.value.date, () => filters.value.type], () => {
  fetchLogs()
})

watch(() => filters.value.search, () => {
  currentPage.value = 1
})

const refreshLogs = () => {
  fetchLogs()
}

const resetFilters = () => {
  filters.value.date = format(new Date(), 'yyyy-MM-dd')
  filters.value.type = 'all'
  filters.value.limit = 50
  filters.value.search = ''
  fetchLogs()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

import { useSearchStore } from '~/stores/search'
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
</script>
