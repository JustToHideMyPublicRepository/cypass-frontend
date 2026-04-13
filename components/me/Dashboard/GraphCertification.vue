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

  const counts = days.map(day => {
    return props.documents.filter(doc => isSameDay(new Date(doc.created_at), day)).length
  })

  return {
    labels: days.map(day => format(day, 'dd MMM', { locale: fr })),
    data: counts
  }
})

const series = computed(() => [{
  name: 'Certifications',
  data: chartData.value.data
}])

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#00C853'], // Success color
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    categories: chartData.value.labels,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#94a3b8', fontSize: '12px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#94a3b8', fontSize: '12px' }
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
    padding: { left: 0, right: 0, bottom: 0 }
  },
  tooltip: {
    theme: 'light',
    x: { show: true }
  }
}))
</script>
