<template>
  <div class="space-y-6">
    <MeActivitiesHeader :user-email="profilStore.logUser?.email" :loading="loading" @refresh="refreshLogs"
      @reset="resetFilters" />

    <MeActivitiesStats :stats="profilStore.logStatistics" />

    <MeActivitiesFilters v-model="filters" :active-filters="profilStore.logFilters" @change="applyFilters" />

    <MeActivitiesList :logs="paginatedLogs" :grouped-logs="groupedLogs" :loading="loading" :current-page="currentPage"
      :total-pages="totalPages" @next-page="nextPage" @prev-page="prevPage" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useProfilStore } from '~/stores/profil'
import { format } from 'date-fns'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Historique d\'activité'
})

const profilStore = useProfilStore()
const loading = ref(false)

const filters = ref({
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'all',
  limit: 50
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

const paginatedLogs = computed(() => {
  if (!profilStore.logs) return []
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return profilStore.logs.slice(start, end)
})

const totalPages = computed(() => {
  if (!profilStore.logs) return 1
  return Math.ceil(profilStore.logs.length / itemsPerPage.value)
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

const applyFilters = () => {
  fetchLogs()
}

const refreshLogs = () => {
  fetchLogs()
}

const resetFilters = () => {
  filters.value.date = format(new Date(), 'yyyy-MM-dd')
  filters.value.type = 'all'
  filters.value.limit = 50
  fetchLogs()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(() => {
  fetchLogs()
})
</script>
