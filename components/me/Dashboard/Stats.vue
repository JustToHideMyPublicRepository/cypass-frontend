<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <UiBaseCard v-for="stat in statsConfig" :key="stat.label" :class="[stat.bgClass, 'border-none text-WtB']">
      <div class="flex justify-between items-start">
        <div>
          <p :class="[stat.labelClass || '', 'font-medium mb-1']">{{ stat.label }}</p>
          <h3 class="text-3xl font-bold">{{ stat.value }}</h3>
        </div>
        <div :class="[stat.iconBgClass || 'bg-white/20', 'p-2 rounded-lg']">
          <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
        </div>
      </div>
      <div :class="[stat.subLabelClass || '', 'mt-4 flex items-center text-sm opacity-80']">
        {{ stat.subLabel }}
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconFileCertificate, IconAlertTriangle, IconDevices, IconShieldLock } from '@tabler/icons-vue'

const props = defineProps<{
  documentsCount: number
  unreadCount: number
  activeSessions: number
}>()

const statsConfig = computed(() => [
  {
    label: 'Documents certifiés',
    value: props.documentsCount,
    icon: IconFileCertificate,
    bgClass: 'bg-gradient-to-br from-primary to-secondary',
    subLabel: 'Total documents sécurisés'
  },
  {
    label: 'Alertes non lues',
    value: props.unreadCount,
    icon: IconAlertTriangle,
    bgClass: 'bg-gradient-to-br from-danger to-dangerAct',
    subLabel: props.unreadCount > 0 ? 'Action requise immédiate' : 'Aucune alerte en attente'
  },
  {
    label: 'Score sécurité',
    value: 'A+',
    icon: IconShieldLock,
    bgClass: 'bg-gradient-to-br from-success to-successAct !text-BtW',
    subLabel: 'Base infrastructure saine'
  },
  {
    label: 'Appareils actifs',
    value: props.activeSessions,
    icon: IconDevices,
    bgClass: 'bg-gradient-to-br from-ash to-hsa/20 !border-ash !text-BtW',
    labelClass: 'text-hsa',
    iconBgClass: 'bg-primary/10',
    iconClass: 'text-primary',
    subLabel: 'Sessions en cours',
    subLabelClass: 'text-hsa'
  },
])
</script>
