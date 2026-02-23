<template>
  <div class="space-y-6">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'VigiTech', path: '/dashboard/vigitech' },
      { label: decodeHtmlEntities(incident?.title || 'Détail') }
    ]" />

    <!-- Header -->
    <div class="flex items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-BtW">Détails du Signalement</h1>
        <p class="text-xs font-bold text-hsa uppercase tracking-widest">Référence: {{ route.params.id }}</p>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div class="lg:col-span-2 space-y-6">
        <UiAppSkeleton height="400px" radius="2.5rem" />
        <UiAppSkeleton height="200px" radius="2.5rem" />
      </div>
      <div class="space-y-6">
        <UiAppSkeleton height="150px" radius="2rem" />
        <UiAppSkeleton height="300px" radius="2rem" />
      </div>
    </div>

    <div v-else-if="store.error" class="glass-panel p-12 rounded-[2rem] text-center">
      <IconAlertCircle class="w-12 h-12 text-danger mx-auto mb-4" />
      <p class="text-BtW font-bold">{{ store.error }}</p>
      <UiBaseButton variant="ghost" class="mt-4" @click="fetchData">Réessayer</UiBaseButton>
    </div>

    <div v-else-if="incident" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <UiBaseCard class="!rounded-[2.5rem] overflow-hidden">
          <div class="p-6 md:p-8 space-y-6">
            <div class="flex flex-wrap items-center gap-3">
              <UiStatusBadge
                :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'">
                {{ mapThreatLevel(incident.threat_level) }}
              </UiStatusBadge>
              <div
                class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
                {{ mapIncidentType(incident.type) }}
              </div>
              <div v-if="incident.is_anonymous"
                class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-BtW text-WtB text-[10px] uppercase font-black tracking-widest">
                Anonyme
              </div>
            </div>

            <h2 class="text-2xl md:text-3xl font-black text-BtW leading-tight">
              {{ decodeHtmlEntities(incident.title) }}
            </h2>

            <div class="flex flex-wrap items-center gap-6 text-sm text-hsa">
              <div v-if="incident.location" class="flex items-center gap-2">
                <IconMapPin class="w-4 h-4 text-primary" /> {{ decodeHtmlEntities(incident.location) }}
              </div>
              <div class="flex items-center gap-2">
                <IconCalendar class="w-4 h-4 text-primary" /> {{ formatDate(incident.created_at) }}
              </div>
            </div>

            <div class="h-px bg-ash/50"></div>

            <div class="space-y-4">
              <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em]">Description détaillée</h3>
              <p class="text-BtW leading-relaxed whitespace-pre-wrap">{{ decodeHtmlEntities(incident.description) }}</p>
            </div>
          </div>
        </UiBaseCard>

        <!-- Evidence Section with Toggle -->
        <div v-if="incident.evidence_file" class="p-6 space-y-4">
          <button @click="showEvidence = !showEvidence"
            class="flex items-center gap-2 text-xs font-black text-hsa uppercase tracking-[0.3em] hover:text-primary transition-colors px-2">
            <component :is="showEvidence ? IconChevronUp : IconChevronDown" class="w-4 h-4" />
            Pièce Jointe / Preuve
          </button>

          <div v-if="showEvidence" class="animate-fade-in space-y-4">
            <div v-if="isImage(incident.evidence_file)" @click="openViewer(getFullUrl(incident.evidence_file))"
              class="group relative rounded-3xl overflow-hidden border border-ash bg-ash/5 cursor-zoom-in aspect-video transition-transform hover:scale-[1.01] active:scale-[0.99]">
              <img :src="getFullUrl(incident.evidence_file)" class="w-full h-full object-contain" alt="Evidence" />
              <div
                class="absolute inset-0 bg-BtW/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div
                  class="p-4 bg-white/90 backdrop-blur rounded-2xl shadow-xl text-primary transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <IconZoomIn class="w-6 h-6" />
                </div>
              </div>
            </div>

            <!-- PDF Viewer Frame -->
            <div v-else-if="isPdf(incident.evidence_file)" class="space-y-4">
              <div class="w-full h-[600px] rounded-[2rem] overflow-hidden border border-ash shadow-inner bg-ash/5">
                <iframe :src="getFullUrl(incident.evidence_file)" class="w-full h-full border-none"></iframe>
              </div>
              <div class="flex items-center justify-between p-6 rounded-2xl bg-ash/5 border border-ashAct">
                <div class="flex items-center gap-4">
                  <IconFileTypePdf class="w-8 h-8 text-danger" />
                  <p class="text-sm font-black text-BtW tracking-tight">Vue PDF intégrée</p>
                </div>
                <a :href="getFullUrl(incident.evidence_file)" target="_blank">
                  <UiBaseButton variant="secondary" size="sm"
                    class="!rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <IconExternalLink class="w-4 h-4 mr-2" /> Plein écran
                  </UiBaseButton>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <!-- Actions -->
        <UiBaseCard class="!rounded-[2rem]">
          <div class="p-6 space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Actions</h3>
            <div class="grid grid-cols-1 gap-3">
              <UiBaseButton @click="shareIncident" variant="primary" class="w-full justify-start !px-4">
                <IconShare class="w-4 h-4 mr-2" /> Partager l'alerte
              </UiBaseButton>
              <UiBaseButton v-if="incident.evidence_file" @click="downloadEvidence" variant="secondary"
                class="w-full justify-start !px-4">
                <IconDownload class="w-4 h-4 mr-2" /> Télécharger preuve
              </UiBaseButton>
            </div>
          </div>
        </UiBaseCard>

        <UiBaseCard class="!rounded-[2rem] overflow-hidden bg-WtB border border-ashAct">
          <!-- Status Card -->
          <div class="p-6 space-y-4">
            <!-- Status Block -->
            <div class="p-4 rounded-2xl border border-transparent transition-colors"
              :class="getSidebarItemStyle('status').bg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
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
                class="mt-4 p-4 bg-white/50 backdrop-blur-sm border border-danger/20 rounded-xl space-y-2">
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
            <div class="p-4 rounded-2xl border border-transparent transition-colors"
              :class="getSidebarItemStyle('reports').bg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
                  <IconAlertTriangle class="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p class="font-black text-BtW uppercase tracking-wider text-xs md:text-sm">{{
                    incident.pending_reports_count || 0 }}</p>
                  <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mt-0.5">Signalements</p>
                </div>
              </div>
            </div>

            <div class="h-px bg-ash/50 mx-2"></div>

            <!-- Organisation -->
            <div class="p-4 rounded-2xl border border-transparent transition-colors"
              :class="getSidebarItemStyle('org').bg">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
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
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <ModalImageViewer :show="viewer.show" :imageUrl="viewer.url" @close="viewer.show = false" />
  </div>
</template>

<script setup lang="ts">
import {
  IconMapPin, IconCalendar, IconExternalLink, IconCheck, IconX, IconLock, IconAlertCircle, IconAlertTriangle, IconZoomIn, IconFileTypePdf, IconShare, IconDownload, IconBuilding, IconChevronDown, IconChevronUp
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { useToastStore } from '~/stores/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapIncidentStatus, mapThreatLevel } from '~/utils/vigitech'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useVigitechStore()
const toast = useToastStore()
const config = useRuntimeConfig()

const incident = computed(() => store.currentIncident)
const showEvidence = ref(false)

const statusBg = computed(() => {
  if (!incident.value) return 'bg-ash/5'
  switch (incident.value.status) {
    case 'validated': return 'bg-success/5 border-success/20'
    case 'rejected': return 'bg-danger/5 border-danger/20'
    default: return 'bg-orange-500/5 border-orange-500/20'
  }
})

const getSidebarItemStyle = (type: 'status' | 'reports' | 'org') => {
  if (type === 'status') return { bg: statusBg.value }
  if (type === 'reports') return { bg: 'bg-warning/10' }
  return { bg: 'bg-primary/10' }
}

const downloadEvidence = () => {
  if (!incident.value?.evidence_file) return
  const link = document.createElement('a')
  link.href = getFullUrl(incident.value.evidence_file)
  link.download = incident.value.evidence_file
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const getFullUrl = (path: string) => {
  if (!path) return ''
  return `/evidence/${path}`
}

const isImage = (path: string) => {
  if (!path) return false
  const ext = path.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')
}

const isPdf = (path: string) => {
  if (!path) return false
  return path.toLowerCase().endsWith('.pdf')
}

const shareIncident = async () => {
  if (!incident.value) return
  const baseUrl = config.publicUrl || window.location.origin
  const shareUrl = `${baseUrl}/vigitech/${incident.value.id}`
  const shareData = {
    title: `Cyber-Alerte CYPASS: ${incident.value.title}`,
    text: `${incident.value.description.substring(0, 100)}...`,
    url: shareUrl
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast.showToast('success', 'Lien copié', 'Le lien de l\'incident a été copié.')
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.warn('Share failed', err)
    }
  }
}

const viewer = ref({
  show: false,
  url: ''
})

const openViewer = (url: string) => {
  viewer.value.url = url
  viewer.value.show = true
}

const fetchData = () => {
  const id = route.params.id as string
  store.fetchUserIncidentById(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value
    ? `${incident.value.title} - DocSentry`
    : 'Detail de l\'incident - DocSentry')
})
</script>
