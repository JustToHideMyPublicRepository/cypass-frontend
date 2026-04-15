<template>
  <div class="space-y-6">
    <!-- Actions -->
    <UiBaseCard class="!rounded-[2rem]">
      <div class="p-6 space-y-4">
        <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Actions</h3>
        <div class="grid grid-cols-1 gap-3">
          <UiBaseButton v-if="!incident.is_blocked && canEdit" @click="showEditModal = true" variant="primary"
            class="w-full justify-start !px-4">
            <IconEdit class="w-4 h-4 mr-2" /> Modifier
          </UiBaseButton>
          <UiBaseButton @click="showDeleteConfirm = true" variant="ghost"
            class="w-full justify-start !px-4 !text-danger hover:!bg-danger/10">
            <IconTrash class="w-4 h-4 mr-2" /> Supprimer
          </UiBaseButton>
          <UiBaseButton @click="shareIncident" variant="secondary" class="w-full justify-start !px-4">
            <IconShare class="w-4 h-4 mr-2" /> Partager l'alerte
          </UiBaseButton>
          <UiBaseButton v-if="incident.evidence_file" @click="downloadEvidence" variant="ghost"
            class="w-full justify-start !px-4">
            <IconDownload class="w-4 h-4 mr-2" /> Télécharger preuve
          </UiBaseButton>
          <UiBaseButton @click="showSettingsModal = true" variant="accent" class="w-full justify-start !px-4">
            <IconSettings class="w-4 h-4 mr-2" /> Préférences d'affichage
          </UiBaseButton>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="!rounded-[2rem] overflow-hidden bg-WtB border border-ashAct">
      <!-- Status Card -->
      <div class="p-6 space-y-4">
        <!-- Status Block -->
        <div class="p-4 rounded-2xl border border-transparent transition-colors" :class="statusStyle.bg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-WtB shadow-sm shrink-0">
              <IconCheck v-if="incident.status === 'validated'" class="w-6 h-6 text-success" />
              <IconX v-else-if="incident.status === 'rejected'" class="w-6 h-6 text-danger" />
              <IconLock v-else class="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p class="font-black text-BtW uppercase tracking-wider text-xs md:text-sm">{{
                mapIncidentStatus(incident.status) }}</p>
              <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mt-0.5">Statut</p>
            </div>
          </div>

          <div v-if="incident.is_blocked"
            class="mt-4 p-4 bg-WtB/50 backdrop-blur-sm border border-danger/20 rounded-xl space-y-2">
            <p class="text-[10px] font-black text-danger uppercase tracking-widest">Admin Info</p>
            <p class="text-[11px] font-bold text-BtW leading-relaxed">
              <IconLock class="w-3.5 h-3.5 inline mr-1" /> Masqué au public
            </p>
            <p v-if="incident.blocking_reason" class="text-[11px] text-hsa italic line-clamp-2">"{{
              incident.blocking_reason }}"</p>
          </div>
        </div>

        <div class="h-px bg-ash/50 mx-2"></div>

        <!-- Signalement externe -->
        <div class="p-4 rounded-2xl border border-transparent transition-colors bg-warning/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-WtB shadow-sm shrink-0">
              <IconAlertTriangle class="w-6 h-6 text-warning" />
            </div>
            <div>
              <p class="font-black text-BtW uppercase tracking-wider text-xs md:text-sm">{{
                incident.pending_reports_count || 0 }}</p>
              <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mt-0.5">
                Signalement{{ (incident.pending_reports_count || 0) > 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>

        <div class="h-px bg-ash/50 mx-2"></div>

        <!-- Organisation -->
        <div class="p-4 rounded-2xl border border-transparent transition-colors bg-primary/10">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-WtB shadow-sm shrink-0">
              <IconBuilding class="w-6 h-6 text-primary" />
            </div>
            <div>
              <p class="font-black text-BtW uppercase tracking-wider text-xs md:text-sm truncate max-w-[120px]">
                {{ incident.reporter_organization || 'Utilisateur' }}
              </p>
              <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mt-0.5">Organisation</p>
            </div>
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Modals -->
    <ModalVigitechCreateIncident v-if="incident" :show="showEditModal" :incident="incident"
      @close="showEditModal = false" @success="$emit('success')" />

    <ModalVigitechPreference :show="showSettingsModal" @close="showSettingsModal = false" />

    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer l'incident"
      message="Êtes-vous sûr de vouloir supprimer cet incident ? Cette action est irréversible."
      confirm-text="Supprimer" :loading="deleting" variant="danger" @cancel="showDeleteConfirm = false"
      @confirm="handleDelete" />

    <ModalGlobalShare :show="showShareModal" :title="`Cyber-Alerte CYPASS: ${incident?.title}`"
      :text="`${incident?.description?.substring(0, 100)}...`" :url="shareUrl" @close="showShareModal = false" />
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconShare, IconDownload, IconCheck, IconX, IconLock, IconAlertTriangle, IconBuilding, IconSettings, IconTrash } from '@tabler/icons-vue'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { mapIncidentStatus } from '~/utils/vigitech'

const props = defineProps<{
  incident: any
}>()

const emit = defineEmits(['success'])

const toast = useToastStore()
const config = useRuntimeConfig()
const showEditModal = ref(false)
const showSettingsModal = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const showShareModal = ref(false)
const shareUrl = ref('')

const handleDelete = async () => {
  if (!props.incident?.id) return
  deleting.value = true
  const result = await useUserVigitechStore().deleteIncident(props.incident.id)
  if (result.success) {
    toast.showToast('success', 'Incident supprimé', result.message || 'L\'incident a été supprimé avec succès.')
    navigateTo('/dashboard/vigitech')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer l\'incident.')
  }
  deleting.value = false
  showDeleteConfirm.value = false
}

const statusStyle = computed(() => {
  if (!props.incident) return { bg: 'bg-ash/5' }
  switch (props.incident.status) {
    case 'validated': return { bg: 'bg-success/5 border-success/20' }
    case 'rejected': return { bg: 'bg-danger/5 border-danger/20' }
    default: return { bg: 'bg-orange-500/5 border-orange-500/20' }
  }
})

const canEdit = computed(() => {
  if (!props.incident?.created_at) return false
  const createdAt = new Date(props.incident.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
})

const getFullUrl = (path: string) => {
  if (!path) return ''
  return `/evidence/${path}`
}

const shareIncident = () => {
  if (!props.incident) return
  const baseUrl = config.publicUrl || window.location.origin
  shareUrl.value = `${baseUrl}/vigitech/${props.incident.id}`
  showShareModal.value = true
}

const downloadEvidence = () => {
  if (!props.incident?.evidence_file) return
  const link = document.createElement('a')
  link.href = getFullUrl(props.incident.evidence_file)
  link.download = props.incident.evidence_file
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
