<template>
  <div class="space-y-6">
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

            <h2 class="text-2xl md:text-3xl font-black text-BtW leading-tight">{{ incident.title }}</h2>

            <div class="flex flex-wrap items-center gap-6 text-sm font-bold text-hsa">
              <div class="flex items-center gap-2">
                <IconMapPin class="w-4 h-4 text-primary" /> {{ incident.location }}
              </div>
              <div class="flex items-center gap-2">
                <IconCalendar class="w-4 h-4 text-primary" /> {{ formatDate(incident.created_at) }}
              </div>
            </div>

            <div class="h-px bg-ash/50"></div>

            <div class="space-y-4">
              <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em]">Description détaillée</h3>
              <p class="text-BtW leading-relaxed whitespace-pre-wrap">{{ incident.description }}</p>
            </div>
          </div>
        </UiBaseCard>

        <!-- Evidence -->
        <UiBaseCard v-if="incident.evidence_file" title="Pièce Jointe / Preuve" class="!rounded-[2.5rem]">
          <div class="p-4 md:p-6">
            <div class="relative group rounded-2xl overflow-hidden border border-ash aspect-video bg-ash/5">
              <img :src="getFullUrl(incident.evidence_file)" class="w-full h-full object-contain" alt="Evidence" />
              <div
                class="absolute inset-0 bg-BtW/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a :href="getFullUrl(incident.evidence_file)" target="_blank"
                  class="p-4 bg-white rounded-full text-primary shadow-xl scale-90 group-hover:scale-100 transition-transform">
                  <IconExternalLink class="w-6 h-6" />
                </a>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowLeft, IconMapPin, IconCalendar, IconExternalLink,
  IconCheck, IconX, IconLock, IconAlertCircle, IconAlertTriangle, IconUsers
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  // Handle path starting with uploads/
  return `https://cypass-backend.alwaysdata.net/${path}`
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
