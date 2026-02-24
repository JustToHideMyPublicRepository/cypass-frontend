<template>
  <div class="space-y-6">
    <!-- Action Card -->
    <UiBaseCard class="!rounded-[2.5rem] p-8 space-y-6">
      <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em] pb-4">Actions</h3>
      <div class="grid grid-cols-1 gap-4">
        <!-- Partager -->
        <button @click="shareIncident"
          class="w-full flex items-center justify-between p-4 rounded-2xl bg-ash/10 hover:bg-ash/60 border border-ash transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <IconShare class="w-5 h-5" />
            </div>
            <span class="text-sm font-black text-BtW">Partager l'alerte</span>
          </div>
          <IconArrowUpRight class="w-4 h-4 text-hsa group-hover:text-primary transition-colors" />
        </button>

        <!-- Télécharger la preuve -->
        <button @click="downloadEvidence"
          class="w-full flex items-center justify-between p-4 rounded-2xl bg-ash/10 hover:bg-ash/60 border border-ash transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <IconDownload class="w-5 h-5" />
            </div>
            <span class="text-sm font-black text-BtW">Télécharger la preuve</span>
          </div>
          <IconArrowUpRight class="w-4 h-4 text-hsa group-hover:text-success transition-colors" />
        </button>

        <!-- Signaler -->
        <button @click="showReportModal = true" :disabled="isOwnIncident"
          class="w-full flex items-center justify-between p-4 rounded-2xl border transition-all group" :class="isOwnIncident
            ? 'bg-ash/5 border-ash/20 opacity-50 cursor-not-allowed'
            : 'bg-danger/5 hover:bg-danger/10 border-danger/20'"
          :title="isOwnIncident ? 'Vous ne pouvez pas signaler vos propres incidents' : 'Signaler cet incident'">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="isOwnIncident ? 'bg-ash/10 text-hsa' : 'bg-danger/10 text-danger'">
              <IconFlag class="w-5 h-5" />
            </div>
            <span class="text-sm font-black" :class="isOwnIncident ? 'text-hsa' : 'text-BtW'">Signaler</span>
          </div>
          <IconArrowUpRight v-if="!isOwnIncident" class="w-4 h-4 text-hsa group-hover:text-danger transition-colors" />
        </button>

        <!-- Préférences d'affichage -->
        <button @click="showSettingsModal = true"
          class="w-full flex items-center justify-between p-4 rounded-2xl bg-ash/10 hover:bg-ash/60 border border-ash transition-all group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <IconSettings class="w-5 h-5" />
            </div>
            <span class="text-sm font-black text-BtW">Préférences d'affichage</span>
          </div>
          <IconArrowUpRight class="w-4 h-4 text-hsa group-hover:text-secondary transition-colors" />
        </button>
      </div>
    </UiBaseCard>

    <!-- Personalized Advice Card -->
    <UiBaseCard class="bg-primary/5 border-primary/20 !rounded-[2.5rem] p-8 space-y-6">
      <h3 class="text-lg font-black text-primary flex items-center gap-3">
        <IconShieldCheck class="w-6 h-6" /> Conseils de sécurité
      </h3>
      <p class="text-sm text-BtW leading-relaxed">
        {{ getAdvice(incident.type, incident.threat_level) }}
      </p>
    </UiBaseCard>

    <!-- Modals -->
    <ModalVigitechReportIncident v-if="incident" :show="showReportModal" :incidentId="incident.id"
      @close="showReportModal = false" @success="$emit('fetch')" />

    <ModalVigitechPreference :show="showSettingsModal" @close="showSettingsModal = false" />
  </div>
</template>

<script setup lang="ts">
import { IconShare, IconArrowUpRight, IconDownload, IconFlag, IconShieldCheck, IconSettings } from '@tabler/icons-vue'
import { useVigitechAdvice } from '~/composables/useVigitechAdvice'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

const props = defineProps<{
  incident: any
}>()

const emit = defineEmits(['fetch'])

const authStore = useAuthStore()
const toast = useToastStore()
const { getAdvice } = useVigitechAdvice()
const showReportModal = ref(false)
const showSettingsModal = ref(false)

const isOwnIncident = computed(() => {
  return !!(authStore.user && props.incident?.user_id === authStore.user.id)
})

const shareIncident = async () => {
  if (!props.incident) return
  const fullUrl = window.location.href
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

const getFullUrl = (path: string) => {
  if (!path) return ''
  return `/evidence/${path}`
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
