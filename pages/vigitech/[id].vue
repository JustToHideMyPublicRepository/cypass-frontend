<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="max-w-5xl mx-auto px-6">
      <NuxtLink to="/vigitech"
        class="inline-flex items-center gap-2 text-hsa font-bold hover:text-primary transition-colors mb-12">
        <IconArrowLeft class="w-5 h-5" /> Retour à la liste
      </NuxtLink>

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

            <h1 class="text-3xl md:text-5xl font-black text-BtW leading-tight tracking-tighter">{{ incident.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-8 text-sm md:text-base font-bold text-hsa">
              <div class="flex items-center gap-2.5">
                <IconMapPin class="w-5 h-5 text-primary" /> {{ incident.location }}
              </div>
              <div class="flex items-center gap-2.5">
                <IconCalendar class="w-5 h-5 text-primary" /> {{ formatDate(incident.created_at) }}
              </div>
              <div class="flex items-center gap-2.5">
                <IconUsers class="w-5 h-5 text-primary" /> {{ incident.reporter_organization || 'Individu' }}
              </div>
            </div>
          </div>

          <div class="h-px bg-ashAct/50"></div>

          <div class="space-y-6">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Analyse de l'incident</h3>
            <p class="text-lg md:text-xl text-BtW leading-relaxed font-bold whitespace-pre-wrap">{{ incident.description
            }}</p>
          </div>

          <!-- Evidence Preview if public and unblocked -->
          <div v-if="incident.evidence_file" class="pt-6 space-y-6">
            <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Preuve Visuelle</h3>
            <div
              class="rounded-3xl overflow-hidden border border-ash bg-ash/5 aspect-video md:aspect-auto max-h-[600px]">
              <img :src="getFullUrl(incident.evidence_file)" class="w-full h-full object-contain mx-auto"
                alt="Evidence" />
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
  </div>
</template>

<script setup lang="ts">
import {
  IconArrowLeft, IconMapPin, IconCalendar, IconUsers,
  IconShieldCheck, IconAlertCircle
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

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
  return `https://cypass-backend.alwaysdata.net/${path}`
}

const fetchData = () => {
  const id = route.params.id as string
  store.fetchPublicIncidentById(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value ? `Incident: ${incident.value.title}` : 'VigiTech')
})
</script>
