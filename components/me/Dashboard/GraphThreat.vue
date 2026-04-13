<template>
  <BaseCard title="Répartition des menaces">
    <h3>Répartition des menaces</h3>

    <div class="h-[300px] w-full">
      <ClientOnly>
        <apexchart v-if="!loading" type="bar" height="100%" :options="chartOptions" :series="series" />
        <div v-else class="h-full w-full flex items-center justify-center">
          <UiLogoLoader size="sm" />
        </div>
      </ClientOnly>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'

const props = defineProps<{
  incidents: any[]
  loading?: boolean
}>()

const levels = ['low', 'medium', 'critical']
const types = ['phishing', 'ransomware', 'fake_profile', 'harassment', 'other']

const series = computed(() => {
  return types.map(type => {
    return {
      name: mapIncidentType(type),
      data: levels.map(level => {
        return props.incidents.filter(i => i.threat_level === level && i.type === type).length
      })
    }
  })
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    fontFamily: 'inherit',
    animations: { enabled: true }
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '50%',
      borderRadius: 8,
      dataLabels: { total: { enabled: true, style: { fontWeight: 600, color: isDark.value ? '#cbd5e1' : '#334155' } } }
    }
  },
  colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#94a3b8'], // Diverse colors for types
  xaxis: {
    categories: levels.map(l => mapThreatLevel(l)),
    labels: { style: { colors: isDark.value ? '#64748b' : '#94a3b8', fontWeight: 600 } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: { style: { colors: isDark.value ? '#64748b' : '#94a3b8' } }
  },
  grid: {
    borderColor: isDark.value ? '#1e293b' : '#f1f5f9',
    strokeDashArray: 4
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    markers: { radius: 12 },
    labels: { colors: isDark.value ? '#cbd5e1' : '#334155' }
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: isDark.value ? 'dark' : 'light',
    y: { formatter: (val: number) => `${val} incident(s)` }
  }
}))
</script>
