<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="max-w-5xl mx-auto px-6">
      <UiBreadcrumbs :items="[
        { label: 'Accueil', path: '/' },
        { label: 'VigiTech', path: '/vigitech' },
        { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
      ]" class="mb-8" />

      <div v-if="store.loading" class="py-32 flex justify-center">
        <UiBaseLoader />
      </div>

      <div v-else-if="store.error" class="py-32 text-center space-y-4">
        <IconAlertCircle class="w-12 h-12 text-danger mx-auto" />
        <p class="text-BtW font-bold">{{ store.error }}</p>
        <UiBaseButton variant="ghost" @click="fetchData">Réessayer</UiBaseButton>
      </div>

      <div v-else-if="incident" class="space-y-8 animate-fade-in text-left">
        <!-- Main Panel -->
        <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-10 shadow-2xl">
          <div class="space-y-6">
            <div class="flex flex-wrap items-center gap-3">
              <UiStatusBadge
                :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'" />
              <div class="px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
                {{ incident.type }}
              </div>
              <div v-if="incident.is_anonymous"
                class="px-3 py-1 rounded-full bg-BtW text-WtB text-[10px] uppercase font-black tracking-widest">
                Anonyme
              </div>
            </div>

            <h1 class="text-3xl md:text-5xl font-black text-BtW leading-tight tracking-tighter">
              {{ decodeHtmlEntities(incident.title) }}
            </h1>

            <div class="flex flex-wrap items-center gap-8 text-sm md:text-base font-bold text-hsa">
              <div v-if="incident.location" class="flex items-center gap-2.5">
                <IconMapPin class="w-5 h-5 text-primary" /> {{ decodeHtmlEntities(incident.location) }}
              </div>
              <div class="flex items-center gap-2.5">
                <IconCalendar class="w-5 h-5 text-primary" /> {{ formatDate(incident.created_at) }}
              </div>
              <div class="flex items-center gap-2.5">
                <IconUsers class="w-5 h-5 text-primary" /> {{ (incident.is_anonymous || incident.is_anonymous === 1) ?
                  'Utilisateur anonyme' : (incident.reporter_organization || 'Pas d\'organisation') }}
              </div>
            </div>
          </div>

          <div class="h-px bg-ashAct/50"></div>

          <div class="space-y-6">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Analyse de l'incident</h3>
            <p class="text-lg md:text-xl text-BtW leading-relaxed font-bold whitespace-pre-wrap">
              {{ decodeHtmlEntities(incident.description) }}
            </p>
          </div>

          <!-- Evidence Preview if public and unblocked -->
          <div v-if="incident.evidence_file" class="pt-6 space-y-6">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Preuve de l'incident</h3>

            <div v-if="isImage(incident.evidence_file)" @click="openViewer(getFullUrl(incident.evidence_file))"
              class="group relative rounded-3xl overflow-hidden border border-ash bg-ash/5 cursor-zoom-in aspect-video md:aspect-auto max-h-[600px] transition-transform hover:scale-[1.01] active:scale-[0.99]">
              <img :src="getFullUrl(incident.evidence_file)" class="w-full h-full object-contain mx-auto"
                alt="Evidence" />
              <div
                class="absolute inset-0 bg-BtW/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div
                  class="p-3 bg-white/90 backdrop-blur rounded-2xl shadow-xl text-primary transform translate-y-4 group-hover:translate-y-0 transition-transform">
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
        </div>

        <!-- Protection Advice -->
        <UiBaseCard class="bg-primary/5 border-primary/20 !rounded-[3rem] p-10 space-y-6">
          <h3 class="text-xl font-black text-primary flex items-center gap-3">
            <IconShieldCheck class="w-7 h-7" /> Comment se protéger ?
          </h3>
          <p class="text-BtW font-bold leading-relaxed">
            Pour ce type de menace ({{ incident.type }}), nous recommandons une vigilance accrue sur vos communications
            numériques et l'activation systématique de l'authentification à deux facteurs.
          </p>
          <div class="pt-4">
            <NuxtLink to="/verify">
              <UiBaseButton variant="primary">Authentifier un document suspect</UiBaseButton>
            </NuxtLink>
          </div>
        </UiBaseCard>
      </div>

      <div v-else class="text-center py-32">
        <IconAlertCircle class="w-16 h-16 text-danger mx-auto mb-6 opacity-20" />
        <h3 class="text-2xl font-black text-BtW">Incident introuvable</h3>
        <p class="text-hsa font-bold mt-2">Ce signalement n'existe pas ou a été retiré pour des raisons de sécurité.</p>
        <NuxtLink to="/vigitech" class="mt-8 inline-block">
          <UiBaseButton variant="ghost">Retourner à la liste</UiBaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <ModalImageViewer :show="viewer.show" :imageUrl="viewer.url" @close="viewer.show = false" />
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowLeft, IconMapPin, IconCalendar, IconUsers,
  IconShieldCheck, IconAlertCircle, IconZoomIn, IconFileTypePdf, IconExternalLink
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const store = useVigitechStore()
const incident = computed(() => store.currentIncident)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const getFullUrl = (path: string) => {
  if (!path) return ''
  // Use the proxy route
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
  store.fetchPublicIncidentById(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value ? `Incident: ${incident.value.title}` : 'Détail de l\'incident')
})
</script>
