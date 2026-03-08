<template>
  <UiBaseCard class="p-5 hover:shadow-md transition-all border border-ash/50 group">
    <div class="flex items-start gap-4">
      <div class="p-3 rounded-2xl shrink-0 transition-colors" :class="statusClasses.bg">
        <IconFlag class="w-6 h-6" :class="statusClasses.text" />
      </div>

      <div class="flex-1 min-w-0 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-ash/10 text-hsa">
              {{ mapReason(report.reason) }}
            </span>
            <UiStatusBadge :status="report.status === 'pending' ? 'Medium' : 'success'">
              {{ mapStatus(report.status) }}
            </UiStatusBadge>
          </div>
          <span class="text-[10px] font-bold text-hsa shrink-0">
            {{ formatRelativeTime(report.created_at) }}
          </span>
        </div>

        <div class="space-y-1">
          <p class="text-xs font-black text-BtW flex items-center gap-2">
            <template v-if="mode === 'sent'">
              <span class="text-hsa font-medium">{{ store.reportType === 'user' ? 'Signalé :' : 'Incident :' }}</span>
              <NuxtLink v-if="store.reportType === 'user'" :to="`/user/${report.reported_user_id}`"
                class="hover:text-primary transition-colors hover:underline">
                {{ report.reported_name || 'Utilisateur inconnu' }}
              </NuxtLink>
              <span v-else class="text-primary">{{ report.incident_title || 'Incident inconnu' }}</span>
            </template>
            <template v-else>
              <span class="text-hsa font-medium">Signaleur :</span>
              <span>{{ report.reporter_name || 'Anonyme' }}</span>
            </template>
          </p>
          <p v-if="mode === 'sent' && report.reported_organization"
            class="text-[10px] text-primary font-bold flex items-center gap-1">
            <IconBuilding class="w-3 h-3" /> {{ report.reported_organization }}
          </p>
          <p v-else-if="mode === 'received' && report.reporter_organization"
            class="text-[10px] text-primary font-bold flex items-center gap-1">
            <IconBuilding class="w-3 h-3" /> {{ report.reporter_organization }}
          </p>
        </div>

        <div class="p-3 rounded-xl bg-ash/5 border border-ash/30">
          <p class="text-xs text-hsa italic leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
            "{{ decodeHtmlEntities(report.details) }}"
          </p>
        </div>

        <div v-if="canViewDetails" class="flex justify-end pt-1">
          <button @click="$emit('view-details', report)"
            class="text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-all flex items-center gap-1.5 group/btn">
            Détails du signalement
            <IconArrowRight class="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFlag, IconBuilding, IconArrowRight } from '@tabler/icons-vue'
import type { ReportEntry } from '~/types/profil'
import { formatRelativeTime } from '~/utils/date'
import { decodeHtmlEntities } from '~/utils/format'
import { userReportReasons } from '~/utils/vigitech'
import { useReportStore } from '~/stores/report'

const store = useReportStore()

const props = defineProps<{
  report: ReportEntry
  mode: 'sent' | 'received'
}>()

const emit = defineEmits(['view-details'])

const canViewDetails = computed(() => {
  if (store.reportType === 'user') return props.mode === 'sent'
  if (store.reportType === 'incident') return props.mode === 'received'
  return false
})

const statusClasses = computed(() => {
  switch (props.report.status) {
    case 'pending': return { bg: 'bg-warning/10', text: 'text-warning' }
    case 'resolved': return { bg: 'bg-success/10', text: 'text-success' }
    case 'dismissed': return { bg: 'bg-ash/20', text: 'text-hsa' }
    default: return { bg: 'bg-ash/10', text: 'text-hsa' }
  }
})

const mapStatus = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente'
    case 'resolved': return 'Traité'
    case 'dismissed': return 'Classé'
    default: return status
  }
}

const mapReason = (reason: string) => {
  const found = userReportReasons.find(r => r.value === reason)
  return found ? found.label : reason
}
</script>
