<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pb-8">
    <div class="max-w-7xl mx-auto px-6">
      <RootVigitechHomeHeader :greeting="getDynamicGreeting()" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Column 1: Filters & Info -->
        <div class="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <RootVigitechHomeFilters v-model="filters" :hasActiveFilters="hasActiveFilters" @reset="resetFilters" />
          <RootVigitechHomeInfoBlock :user="authStore.user" :greeting="getDynamicGreeting()" />
        </div>

        <!-- Column 2: Feed & Pagination -->
        <div class="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <div v-if="store.loading && !store.publicIncidents.length" class="space-y-4">
            <UiAppSkeleton v-for="i in 5" :key="i" height="120px" radius="1.5rem" />
          </div>

          <template v-else-if="filteredIncidents.length">
            <RootVigitechHomeFeed :incidents="filteredIncidents" :pagination="store.publicPagination"
              @report="openReportModal" @change-page="changePage" />
          </template>

          <RootVigitechHomeEmpty v-else :hasActiveFilters="hasActiveFilters" @reset="resetFilters" />
        </div>

        <!-- Column 3: Weekly Stats -->
        <div class="lg:col-span-3 space-y-6 order-3">
          <RootVigitechHomeStats :stats="stats" :topThreatType="topThreatType" :topTarget="topTarget" />
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <ModalVigitechReportIncident :show="showReportModal" :incidentId="reportTargetId" @close="showReportModal = false"
      @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import { IconActivity, IconLock, IconAlertCircle } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/back/user/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'
import { decodeHtmlEntities } from '~/utils/format'
import { getDynamicGreeting } from '~/utils/greeting'

definePageMeta({
  layout: 'guest'
})

const store = useVigitechStore()
const authStore = useAuthStore()

const filters = ref({
  search: '',
  type: '',
  level: '',
  date_start: '',
  date_end: ''
})

const stats = computed(() => {
  const gStats = store.globalStats
  const phishing = gStats.phishing
  const critical = gStats.critical
  const total = gStats.total

  // Calculate trends (relative to total)
  const phishingTrend = total > 0 ? Math.round((phishing / total) * 100) : 0
  const criticalTrend = total > 0 ? Math.round((critical / total) * 100) : 0

  return [
    {
      label: 'Menaces Actives',
      value: total,
      icon: IconActivity,
      iconColor: 'text-primary',
      bg: 'bg-primary/5',
      sub: 'Total signalements validés'
    },
    {
      label: 'Phishing',
      value: phishing,
      icon: IconAlertCircle,
      iconColor: 'text-warning',
      bg: 'bg-warning/5',
      trend: phishingTrend,
      sub: 'Type le plus fréquent'
    },
    {
      label: 'Critiques',
      value: critical,
      icon: IconLock,
      iconColor: 'text-danger',
      bg: 'bg-danger/5',
      trend: criticalTrend,
      sub: 'Urgence immédiate'
    }
  ]
})

const topThreatType = computed(() => {
  if (!store.publicIncidents.length) return 'menaces diverses'
  const typeCounts: Record<string, number> = {}
  store.publicIncidents.forEach(i => {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1
  })
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])
  const top = sorted[0]?.[0]
  switch (top) {
    case 'phishing': return 'hameçonnage (phishing)'
    case 'ransomware': return 'logiciels malveillants (ransomware)'
    case 'fake_profile': return 'faux profils sociaux'
    case 'harassment': return 'cyber-harcèlement'
    default: return 'menaces numériques'
  }
})

const topTarget = computed(() => {
  if (!store.publicIncidents.length) return 'réseaux sociaux au Bénin'
  const locations = store.publicIncidents.map(i => i.location).filter(l => !!l)
  if (!locations.length) return 'réseaux sociaux au Bénin'
  const locationCounts: Record<string, number> = {}
  locations.forEach(l => {
    locationCounts[l] = (locationCounts[l] || 0) + 1
  })
  const sorted = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])
  const topVal = sorted[0]?.[0]
  return topVal ? `secteur de ${decodeHtmlEntities(topVal)}` : 'réseaux sociaux au Bénin'
})

const filteredIncidents = computed(() => {
  let list = store.publicIncidents
  const q = filters.value.search.toLowerCase()
  if (q) {
    list = list.filter(i => {
      const title = (i.title || '').toLowerCase()
      const desc = (i.description || '').toLowerCase()
      const loc = (i.location || '').toLowerCase()
      return title.includes(q) || desc.includes(q) || loc.includes(q)
    })
  }
  if (filters.value.type) {
    list = list.filter(i => i.type === filters.value.type)
  }
  if (filters.value.level) {
    list = list.filter(i => i.threat_level === filters.value.level)
  }
  if (filters.value.date_start) {
    const start = new Date(filters.value.date_start).getTime()
    list = list.filter(i => new Date(i.created_at).getTime() >= start)
  }
  if (filters.value.date_end) {
    const end = new Date(filters.value.date_end).getTime()
    list = list.filter(i => new Date(i.created_at).getTime() <= end)
  }
  return list
})

const fetchData = () => {
  const params: any = {
    limit: store.publicPagination.limit,
    offset: store.publicPagination.offset
  }
  if (filters.value.type) params.type = filters.value.type
  if (filters.value.level) params.level = filters.value.level
  store.fetchPublicIncidents(params)
}

const fetchAllData = () => {
  fetchData()
  store.fetchGlobalStats()
}

const changePage = (delta: number) => {
  const newOffset = store.publicPagination.offset + (delta * store.publicPagination.limit)
  if (newOffset >= 0) {
    store.publicPagination.offset = newOffset
    fetchData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const hasActiveFilters = computed(() => {
  return filters.value.search !== '' || filters.value.type !== '' ||
    filters.value.level !== '' || filters.value.date_start !== '' || filters.value.date_end !== ''
})

const resetFilters = () => {
  filters.value = { search: '', type: '', level: '', date_start: '', date_end: '' }
  store.publicPagination.offset = 0
  fetchData()
}

const showReportModal = ref(false)
const reportTargetId = ref('')
const openReportModal = (incidentId: string) => {
  reportTargetId.value = incidentId
  showReportModal.value = true
}

onMounted(fetchAllData)

useHead({
  title: 'Veille cyber communautaire',
  meta: [
    { name: 'description', content: 'Participez à la veille cyber communautaire et restez informé des dernières menaces au Bénin.' },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
