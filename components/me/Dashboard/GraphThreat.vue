<template>
  <BaseCard title="Répartition des menaces">
    <h3>Répartition des menaces</h3>

    <div class="h-[300px] w-full">
      <ClientOnly>
        <apexchart v-if="!loading" type="donut" height="100%" :options="chartOptions" :series="series" />
        <div v-else class="h-full w-full flex items-center justify-center">
          <UiLogoLoader size="sm" />
        </div>
      </ClientOnly>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  incidents: any[]
  loading?: boolean
}>()

const distribution = computed(() => {
  const counts = {
    critical: 0,
    medium: 0,
    low: 0
  }

  props.incidents.forEach(incident => {
    if (counts.hasOwnProperty(incident.threat_level)) {
      counts[incident.threat_level as keyof typeof counts]++
    }
  })

  return counts
})

const series = computed(() => [
  distribution.value.critical,
  distribution.value.medium,
  distribution.value.low
])

const chartOptions = computed(() => ({
  labels: ['Critique', 'Moyen', 'Faible'],
  colors: ['#ef4444', '#f59e0b', '#10b981'], // Red, Orange, Green
  chart: {
    fontFamily: 'inherit'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '16px',
            fontWeight: 600,
            color: '#334155'
          }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  legend: {
    position: 'bottom',
    fontSize: '14px',
    markers: { radius: 12 }
  },
  tooltip: {
    theme: 'light'
  }
}))
</script>
