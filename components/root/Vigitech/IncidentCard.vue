<template>
  <UiBaseCard class="border-l-4 transition-all hover:shadow-lg" :class="[
    incident.threat_level === 'critical' ? 'border-l-danger bg-danger/5' :
      incident.threat_level === 'medium' ? 'border-l-warning bg-warning/5' : 'border-l-success bg-success/5'
  ]">
    <div class="flex items-start justify-between gap-4">
      <div class="flex gap-4">
        <!-- Date Block -->
        <div class="text-hsa shrink-0">
          <div class="text-center w-12 pt-1">
            <div class="text-[10px] font-black uppercase tracking-tighter">{{ formatMonth(incident.created_at) }}</div>
            <div class="text-2xl font-black leading-none text-BtW">{{ getDay(incident.created_at) }}</div>
          </div>
        </div>

        <div class="space-y-2 flex-1 min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-ash/50 bg-ash/10 text-hsa">
              {{ incident.type }}
            </span>
            <UiStatusBadge
              :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'" />
            <span v-if="incident.is_anonymous"
              class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-BtW text-WtB">
              Anonyme
            </span>
          </div>

          <h3 class="text-base font-black text-BtW truncate leading-tight">{{ incident.title }}</h3>
          <p class="text-xs text-hsa line-clamp-2 leading-relaxed">{{ incident.description }}</p>

          <div class="flex items-center gap-3 pt-2 text-[10px] font-bold text-hsa">
            <span class="flex items-center gap-1">
              <IconMapPin class="w-3 h-3" /> {{ incident.location }}
            </span>
            <span class="flex items-center gap-1">
              <IconClock class="w-3 h-3" /> {{ formatTime(incident.created_at) }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 shrink-0">
        <NuxtLink :to="detailUrl" class="p-2 rounded-xl hover:bg-ash/20 transition-colors text-hsa hover:text-primary">
          <IconEye class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>

    <!-- Actions / Status Footer -->
    <div v-if="showFooter" class="mt-4 pt-4 border-t border-ash/50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
          Statut: <span :class="statusClass">{{ incident.status }}</span>
        </div>
        <div v-if="incident.pending_reports_count"
          class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-danger/10 text-[10px] uppercase font-black tracking-widest text-danger">
          <IconAlertCircle class="w-3 h-3" /> {{ incident.pending_reports_count }} Signalements
        </div>
      </div>

      <div v-if="incident.is_blocked" class="flex items-center gap-1.5 text-[10px] font-bold text-danger italic">
        <IconLock class="w-3.5 h-3.5" /> Masqué au public : {{ incident.blocking_reason || 'Motif non spécifié' }}
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconMapPin, IconClock, IconEye, IconAlertCircle, IconLock } from '@tabler/icons-vue'
import type { Incident } from '~/types/vigitech'

const props = defineProps<{
  incident: Incident
  showFooter?: boolean
  detailUrl: string
}>()

const statusClass = computed(() => {
  switch (props.incident.status) {
    case 'validated': return 'text-success'
    case 'rejected': return 'text-danger'
    case 'blocked': return 'text-orange-500'
    default: return 'text-hsa'
  }
})

const formatMonth = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('default', { month: 'short' })
}

const getDay = (dateStr: string) => {
  return new Date(dateStr).getDate()
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
