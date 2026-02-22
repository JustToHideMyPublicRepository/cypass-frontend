<template>
  <div class="space-y-6">
    <UiBreadcrumbs :items="[
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'VigiTech', path: '/dashboard/vigitech' },
      { label: decodeHtmlEntities(incident?.title || 'Détail') }
    ]" />

    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/vigitech" class="p-2 rounded-xl hover:bg-ash/20 transition-colors text-hsa">
        <IconArrowLeft class="w-6 h-6" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-black text-BtW">Détails du Signalement</h1>
        <p class="text-xs font-bold text-hsa uppercase tracking-widest">Référence: {{ route.params.id }}</p>
      </div>
    </div>

    <div v-if="store.loading" class="py-20 flex justify-center">
      <UiBaseLoader />
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
                :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'" />
              <div
                class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
                {{ incident.type }}
              </div>
              <div v-if="incident.is_anonymous"
                class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-BtW text-WtB text-[10px] uppercase font-black tracking-widest">
                Anonyme
              </div>
            </div>

            <h2 class="text-2xl md:text-3xl font-black text-BtW leading-tight">
              {{ decodeHtmlEntities(incident.title) }}
            </h2>

            <div class="flex flex-wrap items-center gap-6 text-sm font-bold text-hsa">
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

        <!-- Evidence -->
        <UiBaseCard v-if="incident.evidence_file" class="!rounded-[2.5rem] overflow-hidden">
          <div class="p-6 space-y-4">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em] px-2">Pièce Jointe / Preuve</h3>

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

            <div v-else-if="isPdf(incident.evidence_file)"
              class="flex items-center justify-between p-6 rounded-[2rem] bg-ash/5 border border-ashAct">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-danger/10 flex items-center justify-center text-danger">
                  <IconFileTypePdf class="w-8 h-8" />
                </div>
                <div>
                  <p class="text-sm font-black text-BtW tracking-tight">Document PDF</p>
                  <p class="text-[10px] font-bold text-hsa uppercase tracking-widest">Preuve de l'incident</p>
                </div>
              </div>
              <a :href="getFullUrl(incident.evidence_file)" target="_blank">
                <UiBaseButton variant="secondary" size="sm"
                  class="!rounded-xl text-[10px] font-black uppercase tracking-widest">
                  <IconExternalLink class="w-4 h-4 mr-2" /> Ouvrir
                </UiBaseButton>
              </a>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <!-- Status Card -->
        <UiBaseCard class="!rounded-[2rem] overflow-hidden" :class="statusBg">
          <div class="p-6 space-y-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Statut du Signalement</h3>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm">
                <IconCheck v-if="incident.status === 'validated'" class="w-6 h-6 text-success" />
                <IconX v-else-if="incident.status === 'rejected'" class="w-6 h-6 text-danger" />
                <IconLock v-else class="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p class="font-black text-BtW uppercase tracking-wider">{{ incident.status }}</p>
                <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mt-0.5">Mis à jour récemment</p>
              </div>
            </div>

            <div v-if="incident.is_blocked" class="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-xl space-y-2">
              <p class="text-[10px] font-black text-danger uppercase tracking-widest">Informations Administrateur</p>
              <p class="text-[11px] font-bold text-BtW leading-relaxed">
                <IconLock class="w-3.5 h-3.5 inline mr-1" /> Cet incident a été masqué au public.
              </p>
              <p v-if="incident.blocking_reason" class="text-[11px] text-hsa italic">"{{ incident.blocking_reason }}"
              </p>
            </div>
          </div>
        </UiBaseCard>

        <!-- Stats -->
        <UiBaseCard class="!rounded-[2rem]">
          <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <p class="text-[10px] font-black text-hsa uppercase tracking-widest">Signalements externes</p>
                <p class="text-xl font-black text-BtW">{{ incident.pending_reports_count || 0 }}</p>
              </div>
              <div class="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center text-danger">
                <IconAlertTriangle class="w-5 h-5" />
              </div>
            </div>

            <div class="h-px bg-ash/50"></div>

            <div class="space-y-2">
              <p class="text-[10px] font-black text-hsa uppercase tracking-widest">Organisation rapporteuse</p>
              <p class="text-sm font-bold text-BtW flex items-center gap-2">
                <IconUsers class="w-4 h-4 text-primary" /> {{ incident.reporter_organization || 'Utilisateur Individuel'
                }}
              </p>
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
  IconArrowLeft, IconMapPin, IconCalendar, IconExternalLink,
  IconCheck, IconX, IconLock, IconAlertCircle, IconAlertTriangle, IconUsers,
  IconZoomIn, IconFileTypePdf
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const store = useVigitechStore()
const config = useRuntimeConfig()

const incident = computed(() => store.currentIncident)

const statusBg = computed(() => {
  if (!incident.value) return 'bg-ash/5'
  switch (incident.value.status) {
    case 'validated': return 'bg-success/5 border-success/20'
    case 'rejected': return 'bg-danger/5 border-danger/20'
    default: return 'bg-orange-500/5 border-orange-500/20'
  }
})

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
  title: computed(() => incident.value ? `Détail: ${incident.value.title}` : 'Chargement...')
})
</script>
