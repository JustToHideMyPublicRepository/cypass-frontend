<template>
  <BaseCard title="Tendance des certifications">
    <h3>Tendance des certifications</h3>

    <div class="h-[300px] w-full">
      <ClientOnly>
        <apexchart v-if="!loading" type="area" height="100%" :options="chartOptions" :series="series" />
        <div v-else class="h-full w-full flex items-center justify-center">
          <UiLogoLoader size="sm" />
        </div>
      </ClientOnly>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { format, subDays, isSameDay, startOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  documents: any[]
  loading?: boolean
}>()

const chartData = computed(() => {
  const days = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(new Date(), 6 - i)))

  const simpleDocs = props.documents.filter(doc => doc.certification_mode === 'simple')
  const enrichieDocs = props.documents.filter(doc => doc.certification_mode === 'enrichie')

  const uniqueCounts = days.map(day => {
    return simpleDocs.filter(doc => !doc.has_versions && isSameDay(new Date(doc.created_at), day)).length
  })

  const versionCounts = days.map(day => {
    return simpleDocs.filter(doc => doc.has_versions && isSameDay(new Date(doc.created_at), day)).length
  })

  const enrichieCounts = days.map(day => {
    return enrichieDocs.filter(doc => isSameDay(new Date(doc.created_at), day)).length
  })

  return {
    labels: days.map(day => format(day, 'dd MMM', { locale: fr })),
    uniques: uniqueCounts,
    versions: versionCounts,
    enrichies: enrichieCounts
  }
})

const series = computed(() => [
  {
    name: 'Simple (Unique)',
    data: chartData.value.uniques
  },
  {
    name: 'Simple (Multi)',
    data: chartData.value.versions
  },
  {
    name: 'Enrichie',
    data: chartData.value.enrichies
  }
])

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: true }
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  },
  colors: ['#00C853', '#00B8D4', '#6200EA'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.05,
      stops: [0, 90, 100]
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    fontSize: '12px',
    fontWeight: 600,
    markers: { radius: 12 },
    labels: { colors: isDark.value ? '#cbd5e1' : '#334155' }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: chartData.value.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: isDark.value ? '#64748b' : '#94a3b8', fontSize: '12px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: isDark.value ? '#64748b' : '#94a3b8', fontSize: '12px' }
    }
  },
  grid: {
    borderColor: isDark.value ? '#1e293b' : '#f1f5f9',
    strokeDashArray: 4,
    padding: { left: 0, right: 0, bottom: 0 }
  },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    x: { show: true }
  }
}))
</script>
