<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <UiBaseCard v-for="stat in statsConfig" :key="stat.label"
      :class="[stat.bgClass, 'border-none text-WtB overflow-hidden relative group']">
      <div class="relative z-10 !text-WtB">
        <div class="flex justify-between items-start">
          <div>
            <p :class="[stat.labelClass || '', 'font-medium mb-1 opacity-90']">{{ stat.label }}</p>
            <h3 class="text-3xl font-bold tracking-tight">{{ stat.value }}</h3>
          </div>
          <div
            :class="[stat.iconBgClass || 'bg-white/20', 'p-2 rounded-xl backdrop-blur-md transition-transform group-hover:scale-110']">
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between gap-2">
          <div :class="[stat.subLabelClass || '', 'text-[10px] font-semibold opacity-90 leading-tight']">
            {{ stat.displaySubLabel }}
          </div>

          <div v-if="stat.trend !== undefined"
            class="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-white/20 backdrop-blur-md">
            <component :is="stat.trend >= 0 ? IconTrendingUp : IconTrendingDown" class="w-3.5 h-3.5 text-WtB" />
          </div>

          <div v-else-if="stat.advice"
            class="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-center text-WtB">
            {{ stat.advice }}
          </div>
        </div>
      </div>

      <!-- Decorative background element -->
      <div
        class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500">
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconFileCertificate, IconAlertTriangle, IconDevices, IconShieldLock, IconTrendingUp, IconTrendingDown, type Icon } from '@tabler/icons-vue'

interface StatCard {
  label: string
  value: string | number
  icon: Icon
  bgClass: string
  displaySubLabel: string
  trend?: number
  advice?: string
  iconBgClass?: string
  iconClass?: string
  labelClass?: string
  subLabelClass?: string
}

const props = defineProps<{
  documentsCount: number
  documentsTrend?: number
  unreadCount: number
  unreadTrend?: number
  activeSessions: number
}>()

const statsConfig = computed<StatCard[]>(() => [
  {
    label: 'Documents certifiés',
    value: props.documentsCount,
    icon: IconFileCertificate,
    bgClass: 'bg-gradient-to-br from-primary to-secondary',
    trend: props.documentsTrend,
    displaySubLabel: props.documentsTrend !== undefined
      ? `${props.documentsTrend >= 0 ? '+' : ''}${props.documentsTrend}% cette semaine`
      : 'Documents sécurisés'
  },
  {
    label: 'Alertes non lues',
    value: props.unreadCount,
    icon: IconAlertTriangle,
    bgClass: 'bg-gradient-to-br from-dangerAct to-danger',
    trend: props.unreadTrend ?? -21,
    displaySubLabel: `${(props.unreadTrend ?? -21) >= 0 ? '+' : ''}${props.unreadTrend ?? -21}% cette semaine`
  },
  {
    label: 'Score sécurité',
    value: 'A+',
    icon: IconShieldLock,
    bgClass: 'bg-gradient-to-br from-successAct to-success',
    advice: 'Excellent',
    displaySubLabel: 'Score optimal atteint'
  },
  {
    label: 'Appareils actifs',
    value: props.activeSessions,
    icon: IconDevices,
    bgClass: 'bg-gradient-to-br from-indigo-500 to-primary',
    iconBgClass: 'bg-white/10',
    advice: props.activeSessions > 1 ? 'Vérifier' : 'Sécurisé',
    displaySubLabel: props.activeSessions > 1
      ? `${props.activeSessions} appareils connectés`
      : 'Connecté sur un seul appareil'
  },
])
</script>
