<template>
  <div class="relative min-h-[80vh] flex flex-col items-center px-4 pb-8 pt-12">
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
      <UiBaseCard class="!rounded-[3rem] overflow-hidden !border-none shadow-2xl">
        <div class="relative p-8 md:p-12 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
          <!-- Background Decoration -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2">
          </div>

          <div class="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <!-- Avatar -->
            <div class="relative group">
              <div
                class="absolute -inset-1 bg-gradient-to-tr from-primary to-primary-dark rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200">
              </div>
              <div
                class="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-WtB border-4 border-white shadow-xl overflow-hidden">
                <img :src="userAvatarUrl" class="w-full h-full object-cover" :alt="user.first_name" />
              </div>
            </div>

            <div class="flex-1 text-center md:text-left space-y-4">
              <div>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 class="text-3xl md:text-4xl font-black text-BtW tracking-tight">
                    {{ user.first_name }} {{ user.last_name }}
                  </h1>
                  <UiStatusBadge v-if="user.status == true || user.status === 'active'" status="High"
                    class="!text-[10px]">
                    Compte Actif
                  </UiStatusBadge>
                  <UiStatusBadge v-else status="Error" class="!text-[10px]">Compte Inactif</UiStatusBadge>
                </div>
                <p v-if="user.organization_name"
                  class="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase tracking-widest text-xs">
                  <IconBuilding class="w-4 h-4" />
                  {{ user.organization_name }}
                </p>
              </div>

              <div class="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-hsa font-bold">
                <div class="flex items-center gap-2">
                  <IconCalendar class="w-4 h-4 text-primary" />
                  Membre depuis {{ formatDate(user.created_at) }}
                </div>
                <div class="flex items-center gap-2">
                  <IconShield class="w-4 h-4 text-primary" />
                  {{ publicIncidents.length }} Incident{{ publicIncidents.length > 1 ? 's' : '' }} signalés
                </div>
              </div>
            </div>
          </div>
        </div>
      </UiBaseCard>

      <!-- Activity Tabs / Sections -->
      <UiBaseCard class="!rounded-[3rem] p-8 md:p-12 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="flex items-center gap-8 border-b border-ash/10 mb-8 overflow-x-auto scrollbar-hide">
          <button @click="activeTab = 'incidents'"
            class="pb-4 relative transition-all duration-300 whitespace-nowrap group"
            :class="activeTab === 'incidents' ? 'text-primary' : 'text-hsa hover:text-BtW'">
            <span class="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
              <IconAlertTriangle class="w-4 h-4" />
              Signalements
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-ash/10 group-hover:bg-primary/10 transition-colors">
                {{ publicIncidents.length }}
              </span>
            </span>
            <div v-if="activeTab === 'incidents'"
              class="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fade-in"></div>
          </button>

          <button @click="activeTab = 'comments'"
            class="pb-4 relative transition-all duration-300 whitespace-nowrap group"
            :class="activeTab === 'comments' ? 'text-primary' : 'text-hsa hover:text-BtW'">
            <span class="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em]">
              <IconMessage class="w-4 h-4" />
              Commentaires
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-ash/10 group-hover:bg-primary/10 transition-colors">
                {{ comments.length }}
              </span>
            </span>
            <div v-if="activeTab === 'comments'"
              class="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full animate-fade-in"></div>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="animate-fade-in min-h-[400px]">
          <!-- Incidents Tab -->
          <div v-if="activeTab === 'incidents'" class="space-y-6">
            <div v-if="publicIncidents.length" class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa border-b border-ash/10">
                    <th class="pb-4 px-4">Date</th>
                    <th class="pb-4 px-4">Incident</th>
                    <th class="pb-4 px-4">Type</th>
                    <th class="pb-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-ash/5">
                  <tr v-for="incident in paginatedIncidents" :key="incident.id"
                    class="group hover:bg-ash/5 transition-colors">
                    <td class="py-5 px-4">
                      <div class="text-[10px] font-black text-hsa uppercase tracking-widest whitespace-nowrap">
                        {{ formatDateShort(incident.created_at) }}
                      </div>
                    </td>
                    <td class="py-5 px-4 min-w-[250px]">
                      <div class="space-y-1">
                        <div
                          class="text-sm font-black text-BtW group-hover:text-primary transition-colors line-clamp-1">
                          {{ decodeHtmlEntities(incident.title) }}
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-hsa font-bold">
                          <IconBuilding class="w-3 h-3" />
                          {{ incident.organization_name || 'Particulier' }}
                        </div>
                      </div>
                    </td>
                    <td class="py-5 px-4">
                      <UiStatusBadge
                        :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'"
                        class="!text-[8px] !px-2 !py-0.5 uppercase">
                        {{ mapThreatLevel(incident.threat_level) }}
                      </UiStatusBadge>
                    </td>
                    <td class="py-5 px-4 text-right">
                      <NuxtLink :to="`/vigitech/${incident.id}`">
                        <UiBaseButton variant="ghost" size="sm" class="!px-3 !py-1.5 !rounded-lg !text-[10px]">
                          Voir
                        </UiBaseButton>
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-24 text-center opacity-50">
              <div class="w-20 h-20 bg-ash/5 rounded-[2rem] flex items-center justify-center mb-6">
                <IconShield class="w-10 h-10 text-ash" />
              </div>
              <h3 class="text-lg font-black text-BtW">Aucun signalement</h3>
              <p class="text-xs font-bold text-hsa">Cet utilisateur n'a pas encore fait de signalement public.</p>
            </div>

            <!-- Pagination Incidents -->
            <div v-if="totalIncidentPages > 1" class="flex items-center justify-center gap-2 pt-8">
              <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === 1" @click="incidentPage--"
                class="!p-2 !rounded-xl">
                <IconChevronLeft class="w-4 h-4" />
              </UiBaseButton>
              <span class="text-[10px] font-black text-hsa">PAGE {{ incidentPage }} SUR {{ totalIncidentPages }}</span>
              <UiBaseButton variant="ghost" size="sm" :disabled="incidentPage === totalIncidentPages"
                @click="incidentPage++" class="!p-2 !rounded-xl">
                <IconChevronRight class="w-4 h-4" />
              </UiBaseButton>
            </div>
          </div>

          <!-- Comments Tab -->
          <div v-if="activeTab === 'comments'" class="space-y-6">
            <div v-if="comments.length" class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa border-b border-ash/10">
                    <th class="pb-4 px-4">Date</th>
                    <th class="pb-4 px-4">Contenu</th>
                    <th class="pb-4 px-4">Sur l'Incident</th>
                    <th class="pb-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-ash/5">
                  <tr v-for="comment in paginatedComments" :key="comment.id"
                    class="group hover:bg-ash/5 transition-colors">
                    <td class="py-5 px-4">
                      <div class="text-[10px] font-black text-hsa uppercase tracking-widest whitespace-nowrap">
                        {{ formatDateShort(comment.created_at) }}
                      </div>
                    </td>
                    <td class="py-5 px-4 min-w-[300px]">
                      <p class="text-sm text-BtW leading-relaxed font-medium line-clamp-2">
                        {{ comment.content }}
                      </p>
                    </td>
                    <td class="py-5 px-4">
                      <NuxtLink :to="`/vigitech/${comment.incident_id}`"
                        class="text-[10px] hover:text-primary transition-colors font-bold">
                        <span class="block max-w-[150px] truncate">{{ decodeHtmlEntities(comment.incident_title)
                        }}</span>
                      </NuxtLink>
                    </td>
                    <td class="py-5 px-4 text-right">
                      <NuxtLink :to="`/vigitech/${comment.incident_id}`">
                        <UiBaseButton variant="ghost" size="sm" class="!px-3 !py-1.5 !rounded-lg !text-[10px]">
                          Voir
                        </UiBaseButton>
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-24 text-center opacity-50">
              <div class="w-20 h-20 bg-ash/5 rounded-[2rem] flex items-center justify-center mb-6">
                <IconMessage class="w-10 h-10 text-ash" />
              </div>
              <h3 class="text-lg font-black text-BtW">Aucun commentaire</h3>
              <p class="text-xs font-bold text-hsa">Cet utilisateur n'a pas encore commenté d'incident.</p>
            </div>

            <!-- Pagination Comments -->
            <div v-if="totalCommentPages > 1" class="flex items-center justify-center gap-2 pt-8">
              <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === 1" @click="commentPage--"
                class="!p-2 !rounded-xl">
                <IconChevronLeft class="w-4 h-4" />
              </UiBaseButton>
              <span class="text-[10px] font-black text-hsa">PAGE {{ commentPage }} SUR {{ totalCommentPages }}</span>
              <UiBaseButton variant="ghost" size="sm" :disabled="commentPage === totalCommentPages"
                @click="commentPage++" class="!p-2 !rounded-xl">
                <IconChevronRight class="w-4 h-4" />
              </UiBaseButton>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconAlertCircle, IconBuilding, IconCalendar, IconShield, IconAlertTriangle,
  IconMessage, IconChevronRight, IconArrowLeft, IconChevronLeft
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
