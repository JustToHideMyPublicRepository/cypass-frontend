<template>
  <UiBaseModal :show="show" @close="$emit('close')" title="Détails du Signalement" maxWidth="2xl">
    <div v-if="report" class="space-y-6">
      <!-- Status & Date Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-ash/5 rounded-[2rem] border border-ash/30">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl transition-colors" :class="statusClasses.bg">
            <IconFlag class="w-5 h-5" :class="statusClasses.text" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa">Statut actuel</p>
            <p class="text-xs font-bold text-BtW">{{ mapStatus(report.status) }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa">Date du signalement</p>
          <p class="text-xs font-bold text-BtW">{{ formatFullDate(report.created_at) }}</p>
        </div>
      </div>

      <!-- Entities involved -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Signalé / Incident -->
        <div class="p-5 rounded-[2.5rem] bg-ash/5 border border-ash/20 space-y-4">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <IconFlagCancel class="w-4 h-4" />
            {{ reportStore.reportType === 'user' ? 'Utilisateur Signalé' : 'Incident Signalé' }}
          </h3>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-ash/20 flex items-center justify-center border border-ashAct overflow-hidden">
              <component :is="reportStore.reportType === 'user' ? IconUserExclamation : IconAlertTriangle"
                class="w-6 h-6 text-hsa" />
            </div>
            <div class="min-w-0">
              <template v-if="reportStore.reportType === 'user'">
                <NuxtLink :to="`/user/${report.reported_user_id}`"
                  class="text-sm font-black text-BtW hover:text-primary transition-colors hover:underline block truncate">
                  {{ report.reported_name || 'Inconnu' }}
                </NuxtLink>
                <p v-if="report.reported_organization" class="text-[10px] font-bold text-hsa truncate">
                  {{ report.reported_organization }}
                </p>
              </template>
              <template v-else>
                <NuxtLink :to="`/vigitech/${report.incident_id}`"
                  class="text-sm font-black text-BtW hover:text-primary transition-colors hover:underline block truncate">
                  {{ report.incident_title || 'Incident inconnu' }}
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>

        <!-- Signaleur -->
        <div class="p-5 rounded-[2.5rem] bg-ash/5 border border-ash/20 space-y-4">
          <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
            <IconFlagCheck class="w-4 h-4" /> Auteur du Signalement
          </h3>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-ash/20 flex items-center justify-center border border-ashAct overflow-hidden">
              <component :is="IconUserCheck" class="w-6 h-6 text-hsa" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black text-BtW">
                {{ report.reporter_name || 'Anonyme' }}
              </p>
              <p v-if="report.reporter_organization" class="text-[10px] font-bold text-hsa truncate">
                {{ report.reporter_organization }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Box -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 px-1">
          <span
            class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            Motif : {{ mapReason(report.reason) }}
          </span>
        </div>

        <div class="p-6 rounded-[2.5rem] bg-WtB border border-ash shadow-inner space-y-3">
          <h4 class="text-[10px] font-black uppercase tracking-widest text-hsa">Description détaillée</h4>
          <p class="text-sm text-BtW whitespace-pre-wrap leading-relaxed italic">
            "{{ decodeHtmlEntities(report.details) }}"
          </p>
        </div>
      </div>

      <!-- Note/Warning -->
      <div class="p-4 rounded-2xl bg-warning/5 border border-warning/20 flex items-start gap-3">
        <IconAlertCircle class="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <p class="text-[10px] font-bold text-warning/80 leading-normal uppercase tracking-wide">
          Ce signalement est en cours de révision par l'équipe de modération de CYPASS.
          Toute information fausse peut entraîner une suspension de compte.
        </p>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end pt-4 border-t border-ash">
        <UiBaseButton variant="ghost" @click="$emit('close')" class="!rounded-2xl">
          Fermer
        </UiBaseButton>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-else class="space-y-6">
      <UiAppSkeleton height="60px" radius="2rem" />
      <div class="grid grid-cols-2 gap-6">
        <UiAppSkeleton height="100px" radius="2.5rem" />
        <UiAppSkeleton height="100px" radius="2.5rem" />
      </div>
      <UiAppSkeleton height="150px" radius="2.5rem" />
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconFlag, IconFlagCancel, IconUserExclamation, IconFlagCheck, IconUserCheck, IconAlertCircle, IconAlertTriangle } from '@tabler/icons-vue'
import type { ReportEntry } from '~/types/profil'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { userReportReasons } from '~/utils/vigitech'
import { useReportStore } from '~/stores/report'

const reportStore = useReportStore()

const props = defineProps<{
  show: boolean
  report: ReportEntry | null
}>()

defineEmits(['close'])

const statusClasses = computed(() => {
  if (!props.report) return { bg: 'bg-ash/10', text: 'text-hsa' }
  switch (props.report.status) {
    case 'pending': return { bg: 'bg-warning/10', text: 'text-warning' }
    case 'resolved': return { bg: 'bg-success/10', text: 'text-success' }
    case 'dismissed': return { bg: 'bg-ash/20', text: 'text-hsa' }
    default: return { bg: 'bg-ash/10', text: 'text-hsa' }
  }
})

const mapStatus = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente de traitement'
    case 'resolved': return 'Signalement résolu'
    case 'dismissed': return 'Signalement classé sans suite'
    default: return status
  }
}

const mapReason = (reason: string) => {
  const found = userReportReasons.find(r => r.value === reason)
  return found ? found.label : reason
}

const formatFullDate = (dateStr: string) => {
  try {
    return format(new Date(dateStr), "d MMMM yyyy 'à' HH:mm", { locale: fr })
  } catch {
    return dateStr
  }
}
</script>
