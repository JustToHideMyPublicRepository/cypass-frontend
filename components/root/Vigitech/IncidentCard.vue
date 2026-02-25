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
              {{ mapIncidentType(incident.type) }}
            </span>
            <UiStatusBadge
              :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'">
              {{ mapThreatLevel(incident.threat_level) }}
            </UiStatusBadge>
            <span v-if="incident.is_anonymous"
              class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-BtW text-WtB">
              Anonyme
            </span>
            <NuxtLink v-else :to="`/user/${incident.user_id}`"
              class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {{ [incident.author_first_name, incident.author_last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
            </NuxtLink>
          </div>

          <NuxtLink :to="detailUrl">
            <h3 class="text-base font-black text-BtW truncate leading-tight hover:text-primary transition-colors">
              {{ decodeHtmlEntities(incident.title) }}
            </h3>
          </NuxtLink>
          <p class="text-xs text-hsa line-clamp-2 leading-relaxed">
            {{ decodeHtmlEntities(incident.description) }}
          </p>

          <div class="flex items-center gap-3 pt-2 text-[10px] font-bold text-hsa">
            <span v-if="incident.location" class="flex items-center gap-1">
              <IconMapPin class="w-3 h-3" /> {{ decodeHtmlEntities(incident.location) }}
            </span>
            <span class="flex items-center gap-1">
              <IconClock class="w-3 h-3" /> {{ formatRelativeTime(incident.created_at) }}
            </span>
            <span v-if="incident.views_count != null" class="flex items-center gap-1">
              <IconEye class="w-3 h-3" /> {{ incident.views_count }}
            </span>
            <span v-if="incident.comments_count != null" class="flex items-center gap-1">
              <IconMessage class="w-3 h-3" /> {{ incident.comments_count }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 shrink-0">
        <!-- Signaler -->
        <button v-if="!showFooter && authStore.user" @click.stop="handleReport" :disabled="isOwnIncident"
          class="p-2 rounded-xl transition-colors" :class="isOwnIncident
            ? 'text-hsa/30 cursor-not-allowed'
            : 'hover:bg-danger/10 text-hsa hover:text-danger'"
          :title="isOwnIncident ? 'Vous ne pouvez pas signaler votre incident' : 'Signaler'">
          <IconFlag class="w-5 h-5" />
        </button>
        <!-- Modifier (dashboard only, own incidents, within 24h) -->
        <button v-if="showFooter && canEditIncident" @click.stop="$emit('edit', incident)"
          class="p-2 rounded-xl hover:bg-primary/10 transition-colors text-hsa hover:text-primary"
          title="Modifier mon signalement">
          <IconEdit class="w-5 h-5" />
        </button>
        <!-- Supprimer (dashboard only, own incidents) -->
        <button v-if="showFooter && isOwnIncident" @click.stop="$emit('delete', incident)"
          class="p-2 rounded-xl hover:bg-danger/10 transition-colors text-hsa hover:text-danger"
          title="Supprimer mon signalement">
          <IconTrash class="w-5 h-5" />
        </button>
        <button @click.stop="shareIncident"
          class="p-2 rounded-xl hover:bg-ash/20 transition-colors text-hsa hover:text-primary" title="Partager">
          <IconShare class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Actions / Status Footer -->
    <div v-if="showFooter" class="mt-4 pt-4 border-t border-ash/50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
          Statut: <span :class="statusClass">{{ mapIncidentStatus(incident.status) }}</span>
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
import { IconMapPin, IconClock, IconAlertCircle, IconLock, IconShare, IconChevronRight, IconEye, IconFlag, IconEdit, IconMessage, IconTrash } from '@tabler/icons-vue'
import type { Incident } from '~/types/vigitech'
import { decodeHtmlEntities } from '~/utils/format'
import { formatRelativeTime } from '~/utils/date'
import { mapIncidentType, mapThreatLevel, mapIncidentStatus } from '~/utils/vigitech'
import { useToastStore } from '~/stores/toast'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  incident: Incident
  showFooter?: boolean
  detailUrl: string
}>()

const emit = defineEmits(['report', 'edit', 'delete'])
const toast = useToastStore()
const authStore = useAuthStore()

const isOwnIncident = computed(() => {
  return !!(authStore.user && props.incident.user_id === authStore.user.id)
})

const canEditIncident = computed(() => {
  if (!props.incident?.created_at) return false
  const createdAt = new Date(props.incident.created_at).getTime()
  const hoursDiff = (Date.now() - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
})

const handleReport = () => {
  if (isOwnIncident.value) return
  emit('report', props.incident.id)
  toast.showToast('info', 'Signalement', 'Ouverture du formulaire de signalement...')
}

const shareIncident = async () => {
  const fullUrl = `${window.location.origin}/vigitech/${props.incident.id}`
  const shareData = {
    title: `Cyber-Alerte CYPASS: ${props.incident.title}`,
    text: `${props.incident.description.substring(0, 100)}...`,
    url: fullUrl
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(fullUrl)
      toast.showToast('success', 'Lien copié', 'Le lien de l\'incident a été copié.')
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.warn('Share failed', err)
    }
  }
}

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
