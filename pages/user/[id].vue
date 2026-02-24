<template>
  <div class="relative min-h-[80vh] max-w-5xl flex flex-col items-center px-4 pb-8 pt-12 mx-auto">
    <!-- Back Button -->
    <div class="w-full max-w-7xl mb-8">
      <button @click="router.back()"
        class="group flex items-center gap-2 text-hsa hover:text-primary transition-all font-black uppercase tracking-widest text-[10px]">
        <IconArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="w-full max-w-7xl space-y-8 animate-fade-in">
      <UiAppSkeleton height="300px" radius="3rem" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiAppSkeleton height="400px" radius="2.5rem" />
        <UiAppSkeleton height="400px" radius="2.5rem" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="glass-panel p-12 rounded-[3rem] text-center max-w-2xl mx-auto">
      <div class="w-20 h-20 bg-danger/10 rounded-[2rem] flex items-center justify-center text-danger mx-auto mb-6">
        <IconAlertCircle class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-black text-BtW mb-2">Oups !</h2>
      <p class="text-hsa font-bold mb-8">{{ error }}</p>
      <NuxtLink to="/vigitech">
        <UiBaseButton variant="primary" class="!rounded-2xl px-8">Retour à VigiTech</UiBaseButton>
      </NuxtLink>
    </div>

    <!-- Profile Content -->
    <div v-else-if="user" class="w-full max-w-7xl space-y-8 animate-fade-in">
      <!-- Profile Header Card -->
      <UiBaseCard class="!rounded-[3rem] overflow-hidden !border-none shadow-2xl relative group">
        <!-- Premium Ambient Background -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-WtB to-secondary/5 opacity-50"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>

        <div class="relative p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <!-- Avatar Section with Interaction -->
          <div class="relative shrink-0">
            <div @click="showImageViewer = true"
              class="relative z-10 w-36 h-36 md:w-48 md:h-48 rounded-[3rem] p-1.5 bg-gradient-to-tr from-primary to-secondary shadow-2xl cursor-pointer hover:scale-105 transition-all duration-500 overflow-hidden group/avatar">
              <div
                class="w-full h-full rounded-[2.8rem] overflow-hidden bg-ash border-4 border-WtB shadow-inner relative">
                <img :src="userAvatarUrl"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                  :alt="user.first_name" />
                <!-- Hover Overlay -->
                <div
                  class="absolute inset-0 bg-black/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <IconZoomIn class="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <!-- Decorative ring -->
            <div
              class="absolute inset-0 -m-4 border border-primary/10 rounded-[4rem] animate-[spin_20s_linear_infinite]">
            </div>
          </div>

          <div class="flex-1 text-center md:text-left space-y-6">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 class="text-4xl md:text-5xl font-black text-BtW tracking-tighter leading-tight">
                  {{ user.first_name }} <span class="text-primary">{{ user.last_name }}</span>
                </h1>
                <div class="flex items-center">
                  <UiStatusBadge v-if="user.status == true || user.status === 'active'" status="active">
                    Actif
                  </UiStatusBadge>
                  <UiStatusBadge v-else status="Error">
                    Inactif
                  </UiStatusBadge>
                </div>
              </div>
              <p v-if="user.organization_name"
                class="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
                <IconBuilding class="w-4 h-4" />
                {{ user.organization_name }}
              </p>
            </div>

            <div class="flex flex-wrap items-center justify-center md:justify-start gap-8">
              <div class="group/stat">
                <p
                  class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1 group-hover/stat:text-primary transition-colors">
                  Membre depuis</p>
                <div class="flex items-center gap-2 text-BtW font-bold text-lg">
                  <IconCalendar class="w-5 h-5 text-primary/40" />
                  {{ formatDate(user.created_at) }}
                </div>
              </div>
              <div class="w-px h-10 bg-ash/20 hidden md:block"></div>
              <div class="group/stat">
                <p
                  class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1 group-hover/stat:text-primary transition-colors">
                  Activité publique</p>
                <div class="flex items-center gap-2 text-BtW font-bold text-lg">
                  <IconShield class="w-5 h-5 text-primary/40" />
                  {{ publicIncidents.length }} Incident{{ publicIncidents.length > 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UiBaseCard>

      <!-- Activity Section -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Tabs & List -->
        <UiBaseCard class="lg:col-span-12 !rounded-[3rem] overflow-hidden !border-none shadow-xl">
          <!-- Tab Navigation Custom -->
          <div class="flex bg-ash/5 p-2 rounded-t-[3rem] border-b border-ash/10">
            <button @click="activeTab = 'incidents'"
              class="flex-1 py-4 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
              :class="activeTab === 'incidents' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
              <IconAlertTriangle class="w-4 h-4" />
              Signalements
              <span class="ml-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[9px]">
                {{ publicIncidents.length }}
              </span>
            </button>
            <button @click="activeTab = 'comments'"
              class="flex-1 py-4 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500 font-black uppercase tracking-widest text-[11px]"
              :class="activeTab === 'comments' ? 'bg-ash shadow-lg text-primary translate-y-0' : 'text-hsa hover:text-BtW'">
              <IconMessage class="w-4 h-4" />
              Commentaires
              <span class="ml-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-[9px]">
                {{ comments.length }}
              </span>
            </button>
          </div>

          <div class="p-8 md:p-10 min-h-[500px] animate-fade-in">
            <!-- Incidents Tab -->
            <div v-if="activeTab === 'incidents'" class="space-y-6">
              <div v-if="publicIncidents.length" class="overflow-x-auto">
                <table class="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr class="text-[10px] font-black uppercase tracking-[0.25em] text-hsa/60 px-4">
                      <th class="pb-2 px-6">Détails de l'incident</th>
                      <th class="pb-2 px-6">Type & Niveau</th>
                      <th class="pb-2 px-6">Date</th>
                      <th class="pb-2 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="incident in paginatedIncidents" :key="incident.id"
                      class="group bg-ash/5 hover:bg-ash/10 hover:scale-[1.01] transition-all duration-300">
                      <td class="py-5 px-6 rounded-l-2xl">
                        <div class="space-y-1">
                          <div
                            class="text-sm font-black text-BtW group-hover:text-primary transition-colors line-clamp-1">
                            {{ decodeHtmlEntities(incident.title) }}
                          </div>
                        </div>
                      </td>
                      <td class="py-5 px-6">
                        <div class="flex flex-col gap-1.5">
                          <span class="text-[10px] font-black text-BtW uppercase tracking-tighter">{{
                            mapIncidentType(incident.type) }}</span>
                          <UiStatusBadge
                            :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'"
                            class="!text-[8px] !px-2 !py-0.5 uppercase !w-fit">
                            {{ mapThreatLevel(incident.threat_level) }}
                          </UiStatusBadge>
                        </div>
                      </td>
                      <td class="py-5 px-6">
                        <div class="text-[10px] font-black text-hsa uppercase tracking-widest whitespace-nowrap">
                          {{ formatDateShort(incident.created_at) }}
                        </div>
                      </td>
                      <td class="py-5 px-6 text-right rounded-r-2xl">
                        <NuxtLink :to="`/vigitech/${incident.id}`">
                          <UiBaseButton variant="primary" size="sm"
                            class="!px-4 !py-2 !rounded-xl !text-[10px] shadow-lg shadow-primary/10">
                            Consulter
                          </UiBaseButton>
                        </NuxtLink>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-32 text-center">
                <div
                  class="w-24 h-24 bg-ash/5 rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
                  <IconShield class="w-10 h-10 text-ash/30" />
                </div>
                <h3 class="text-xl font-black text-BtW">Aucun signalement public</h3>
                <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore partagé d'incidents avec la
                  communauté.</p>
              </div>

              <!-- Pagination Incidents -->
              <div v-if="totalIncidentPages > 1"
                class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
                <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === 1" @click="incidentPage--"
                  class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
                  <IconChevronLeft class="w-5 h-5" />
                </UiBaseButton>
                <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
                  <span class="text-primary">{{ incidentPage }}</span> / {{ totalIncidentPages }}
                </div>
                <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === totalIncidentPages"
                  @click="incidentPage++"
                  class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
                  <IconChevronRight class="w-5 h-5" />
                </UiBaseButton>
              </div>
            </div>

            <!-- Comments Tab -->
            <div v-if="activeTab === 'comments'" class="space-y-6">
              <div v-if="comments.length" class="overflow-x-auto px-1">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="comment in paginatedComments" :key="comment.id"
                    class="group bg-ash p-6 rounded-[2.5rem] border border-primary/20 hover:border-primary/50 hover:bg-WtB hover:shadow-2xl transition-all duration-500">
                    <div class="flex items-start justify-between mb-4">
                      <div
                        class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] bg-ash/10 px-3 py-1 rounded-full">
                        {{ formatDateShort(comment.created_at) }}
                      </div>
                      <NuxtLink :to="`/vigitech/${comment.incident_id}`"
                        class="text-primary hover:scale-110 transition-transform">
                        <IconExternalLink class="w-4 h-4" />
                      </NuxtLink>
                    </div>
                    <p class="text-sm text-BtW leading-relaxed font-medium mb-6 line-clamp-3">
                      "{{ comment.content }}"
                    </p>
                    <div class="pt-4 border-t border-ash/10 flex items-center justify-between">
                      <div class="min-w-0 flex-1">
                        <p class="text-[8px] font-black text-hsa uppercase tracking-widest mb-1">Sur l'Incident</p>
                        <p class="text-[11px] font-black text-BtW truncate pr-4">
                          {{ decodeHtmlEntities(comment.incident_title) }}
                        </p>
                      </div>
                      <NuxtLink :to="`/vigitech/${comment.incident_id}`">
                        <UiBaseButton variant="ghost" size="sm"
                          class="!px-3 !py-1.5 !rounded-xl !text-[9px] !bg-primary/5 hover:!bg-primary !text-primary hover:!text-WtB transition-all">
                          Voir
                        </UiBaseButton>
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="flex flex-col items-center justify-center py-32 text-center">
                <div
                  class="w-24 h-24 bg-ash/5 rounded-[3rem] flex items-center justify-center mb-8 border border-ash/10">
                  <IconMessage class="w-10 h-10 text-ash/30" />
                </div>
                <h3 class="text-xl font-black text-BtW">Aucun commentaire</h3>
                <p class="text-sm font-bold text-hsa mt-2">Cet utilisateur n'a pas encore participé aux discussions.</p>
              </div>

              <!-- Pagination Comments -->
              <div v-if="totalCommentPages > 1"
                class="flex items-center justify-center gap-4 pt-8 border-t border-ash/10">
                <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === 1" @click="commentPage--"
                  class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
                  <IconChevronLeft class="w-5 h-5" />
                </UiBaseButton>
                <div class="px-6 py-2 rounded-2xl bg-ash/5 text-[10px] font-black text-BtW tracking-[0.2em]">
                  <span class="text-primary">{{ commentPage }}</span> / {{ totalCommentPages }}
                </div>
                <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === totalCommentPages"
                  @click="commentPage++"
                  class="!p-3 !rounded-2xl hover:!bg-primary/10 hover:!text-primary transition-all">
                  <IconChevronRight class="w-5 h-5" />
                </UiBaseButton>
              </div>
            </div>
          </div>
        </UiBaseCard>
      </div>
    </div>

    <ModalImageViewer v-if="userAvatarUrl" :show="showImageViewer" :image-url="userAvatarUrl"
      @close="showImageViewer = false" />
  </div>
</template>

<script setup lang="ts">
import {
  IconAlertCircle, IconBuilding, IconCalendar, IconShield, IconAlertTriangle,
  IconMessage, IconChevronRight, IconArrowLeft, IconChevronLeft, IconZoomIn, IconExternalLink
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'
import { getUserAvatarUrl } from '~/utils/user'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const store = useVigitechStore()

const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<any>(null)
const publicIncidents = ref<any[]>([])
const comments = ref<any[]>([])
const showImageViewer = ref(false)

// Tabs and Pagination
const activeTab = ref<'incidents' | 'comments'>('incidents')
const pageSize = 5
const incidentPage = ref(1)
const commentPage = ref(1)

const paginatedIncidents = computed(() => {
  const start = (incidentPage.value - 1) * pageSize
  return publicIncidents.value.slice(start, start + pageSize)
})

const totalIncidentPages = computed(() => Math.ceil(publicIncidents.value.length / pageSize))

const paginatedComments = computed(() => {
  const start = (commentPage.value - 1) * pageSize
  return comments.value.slice(start, start + pageSize)
})

const totalCommentPages = computed(() => Math.ceil(comments.value.length / pageSize))

const userAvatarUrl = computed(() => {
  return getUserAvatarUrl(
    user.value?.avatar_url,
    user.value?.first_name,
    user.value?.last_name
  )
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'MMMM yyyy', { locale: fr })
  } catch {
    return ''
  }
}

const formatDateShort = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })
  } catch {
    return ''
  }
}

const fetchPublicProfile = async () => {
  loading.value = true
  error.value = null
  try {
    const response: any = await $fetch('/api/profile/public', {
      params: { id: route.params.id }
    })

    if (response.success && response.data) {
      user.value = response.data.user
      publicIncidents.value = response.data.activity?.public_incidents || []
      comments.value = response.data.activity?.comments || []
    } else {
      error.value = response.message || 'Impossible de charger le profil'
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Une erreur est survenue lors du chargement du profil'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPublicProfile)

useHead({
  title: computed(() => user.value
    ? `Profil de ${user.value.first_name} ${user.value.last_name}`
    : 'Profil public')
})
</script>
