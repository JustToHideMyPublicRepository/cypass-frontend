<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <UiBaseCard v-for="stat in statsConfig" :key="stat.label"
      :class="[stat.bgClass, 'border-none text-WtB relative group !overflow-visible']">
      <div class="relative z-10 !text-WtB">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-1.5 mb-1">
              <p :class="[stat.labelClass || '', 'font-medium opacity-90']">{{ stat.label }}</p>
              <UiAppTooltip v-if="stat.tooltip" :content="stat.tooltip" icon-class="text-WtB/40 hover:text-WtB" />
            </div>
            <h3 class="text-3xl font-bold tracking-tight">{{ stat.value }}</h3>
          </div>
          <div
            :class="[stat.iconBgClass || 'bg-white/20', 'p-2 rounded-xl backdrop-blur-md transition-transform group-hover:scale-110']">
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconClass" />
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between gap-2">
          <!-- Trend Icon + Difference Badge -->
          <div v-if="stat.trend" class="flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md" :class="[
            stat.trend.difference > 0 ? 'bg-success/60 text-WtB' :
              stat.trend.difference < 0 ? 'bg-danger/60 text-WtB' :
                'bg-BtW/60 text-WtB'
          ]">
            <component
              :is="stat.trend.difference > 0 ? IconTrendingUp : (stat.trend.difference < 0 ? IconTrendingDown : IconBrandStackshare)"
              class="w-3.5 h-3.5" />
            <span class="text-[10px] font-bold">
              {{ stat.trend.difference > 0 ? '+' : '' }}{{ stat.trend.difference }}
            </span>
          </div>

          <!-- Advice Text Badge -->
          <div v-else-if="stat.advice"
            class="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-center text-WtB">
            {{ stat.advice }}
          </div>

          <div
            :class="[stat.subLabelClass || '', 'text-[10px] font-semibold opacity-90 leading-tight text-right flex-1']">
            {{ stat.displaySubLabel }}
          </div>
        </div>
      </div>

      <!-- Clipped background effects -->
      <div class="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        <div
          class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500">
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconFileCertificate, IconAlertTriangle, IconDevices, IconShieldLock, IconTrendingUp, IconTrendingDown, IconBrandStackshare, type Icon } from '@tabler/icons-vue'
import type { SecurityScoreResult } from '~/utils/security'

interface Trend {
  percentage: number
  difference: number
}

interface StatCard {
  label: string
  value: string | number
  icon: Icon
  bgClass: string
  displaySubLabel: string
  tooltip?: string
  trend?: Trend
  advice?: string
  iconBgClass?: string
  iconClass?: string
  labelClass?: string
  subLabelClass?: string
}

const props = defineProps<{
  documentsCount: number
  documentsTrend?: Trend
  vigitechCount: number
  vigitechTrend?: Trend
  activeSessions: number
  securityScore?: SecurityScoreResult
}>()

const statsConfig = computed<StatCard[]>(() => [
  {
    label: 'Documents certifiés',
    value: props.documentsCount,
    icon: IconFileCertificate,
    bgClass: 'bg-gradient-to-br from-primary to-secondary',
    trend: props.documentsTrend,
    tooltip: '<b>Intégrité garantie</b><br>Preuve d\'authenticité immuable enregistrée pour chaque document certifié.',
    displaySubLabel: props.documentsTrend
      ? `${props.documentsTrend.percentage > 0 ? '+' : ''}${props.documentsTrend.percentage}% par rapport à la semaine dernière`
      : 'Documents sécurisés'
  },
  {
    label: 'Signalements',
    value: props.vigitechCount,
    icon: IconAlertTriangle,
    bgClass: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    trend: props.vigitechTrend,
    tooltip: '<b>Veille collaborative</b><br>Incidents que vous avez identifiés et signalés à la communauté.',
    displaySubLabel: props.vigitechTrend
      ? `${props.vigitechTrend.percentage > 0 ? '+' : ''}${props.vigitechTrend.percentage}% par rapport à la semaine dernière`
      : props.vigitechCount > 0 ? `${props.vigitechCount} incidents répertoriés` : 'Aucun incident actif'
  },
  {
    label: 'Score sécurité',
    value: props.securityScore?.grade || '...',
    icon: IconShieldLock,
    bgClass: 'bg-gradient-to-br from-successAct to-success',
    advice: props.securityScore?.label || 'Analyse...',
    tooltip: '<b>Calcul du score</b><br>• Documents certifiés (+ bonus)<br>• Incident critique (-10 pts)<br>• Échec connexion (-15 pts)<br>• Sessions multiples (>3)',
    displaySubLabel: props.securityScore?.score !== undefined ? `Protection évaluée à ${props.securityScore.score}%` : 'Évaluation en cours'
  },
  {
    label: 'Appareils actifs',
    value: props.activeSessions,
    icon: IconDevices,
    bgClass: 'bg-gradient-to-br from-ashAct to-hsa',
    iconBgClass: 'bg-white/10',
    advice: props.activeSessions > 1 ? 'Vérifier' : 'Sécurisé',
    tooltip: '<b>Hygiène numérique</b><br>Nombre de points d\'accès simultanés ouverts sur votre compte.',
    displaySubLabel: props.activeSessions > 1
      ? `${props.activeSessions} sessions actives détectées`
      : 'Connecté sur un seul appareil'
  },
])
</script>
