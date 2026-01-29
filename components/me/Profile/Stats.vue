<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <UiBaseCard v-for="stat in statsItems" :key="stat.label">
      <div class="flex items-center gap-2 ">
        <div :class="['p-2 rounded-xl', stat.bgClass]">
          <component :is="stat.icon" :class="['w-5 h-5', stat.textClass]" />
        </div>
        <div>
          <p class="text-xs font-bold text-hsa uppercase">{{ stat.label }}</p>
          <h4 class="text-xl font-bold">{{ statistics?.[stat.key] || 0 }}</h4>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconFileCertificate, IconAlertTriangle } from '@tabler/icons-vue'

const props = defineProps<{
  statistics: any
}>()

const statsItems = [
  {
    label: 'Documents',
    key: 'total_documents',
    icon: IconFileCertificate,
    bgClass: 'bg-primary/10',
    textClass: 'text-primary'
  },
  {
    label: 'Incidents',
    key: 'total_incidents',
    icon: IconAlertTriangle,
    bgClass: 'bg-danger/10',
    textClass: 'text-danger'
  }
]
</script>
