<template>
  <div class="relative min-h-[85vh] py-12 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <UiBreadcrumbs :items="[
        { label: 'Accueil', path: '/' },
        { label: 'VigiTech', path: '/vigitech' },
        { label: decodeHtmlEntities(incident?.title || 'Détail de l\'incident') }
      ]" />

      <!-- Skeleton Loading -->
      <div v-if="store.loading" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-8 space-y-8">
          <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-8 shadow-xl bg-ash/5">
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <UiAppSkeleton width="80px" height="24px" radius="99px" />
                <UiAppSkeleton width="120px" height="24px" radius="99px" />
              </div>
              <UiAppSkeleton width="80%" height="48px" radius="1rem" />
              <div class="flex gap-6">
                <UiAppSkeleton width="150px" height="20px" />
                <UiAppSkeleton width="150px" height="20px" />
              </div>
            </div>
            <div class="h-px bg-ashAct/50"></div>
            <div class="space-y-4">
              <UiAppSkeleton width="100px" height="12px" />
              <UiAppSkeleton :count="4" height="16px" />
            </div>
          </div>
        </div>
        <div class="lg:col-span-4 space-y-6">
          <UiAppSkeleton height="200px" radius="2.5rem" />
          <UiAppSkeleton height="150px" radius="2.5rem" />
        </div>
      </div>

      <div v-else-if="store.error" class="py-24 text-center space-y-8 animate-fade-in max-w-lg mx-auto">
        <div class="relative inline-block">
          <div class="absolute inset-0 bg-danger/20 blur-3xl rounded-full"></div>
          <IconAlertCircle class="w-20 h-20 text-danger relative z-10 mx-auto" />
        </div>
        <div class="space-y-4">
          <h2 class="text-3xl font-black text-BtW tracking-tighter">Oups ! Une erreur est survenue</h2>
          <p class="text-hsa font-medium leading-relaxed">
            {{ store.error.includes('404') ? 'Cet incident n\'existe plus ou n\'est pas accessible publiquement.' :
              'Nous rencontrons des difficultés techniques pour récupérer les détails de cet incident.' }}
          </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <UiBaseButton variant="primary" @click="fetchData" class="w-full sm:w-auto">
            Réessayer
          </UiBaseButton>
          <NuxtLink to="/vigitech" class="w-full sm:w-auto">
            <UiBaseButton variant="ghost" class="w-full">
              Retourner à la liste
            </UiBaseButton>
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="incident" class="animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Column: Main Content -->
          <div class="lg:col-span-8 space-y-8">
            <div class="glass-panel p-8 md:p-12 rounded-[3.5rem] border border-ashAct space-y-8 shadow-xl">
              <div class="space-y-6">
                <div class="flex flex-wrap items-center gap-3">
                  <UiStatusBadge
                    :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'">
                    {{ mapThreatLevel(incident.threat_level) }}
                  </UiStatusBadge>
                  <div
                    class="px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
                    {{ mapIncidentType(incident.type) }}
                  </div>
                  <div v-if="incident.is_anonymous"
                    class="px-3 py-1 rounded-full bg-BtW text-WtB text-[10px] uppercase font-black tracking-widest">
                    Anonyme
                  </div>
                  <div v-if="incident.views_count != null"
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
                    <IconEye class="w-3.5 h-3.5" /> {{ incident.views_count }}
                  </div>
                </div>

                <h1 class="text-3xl md:text-5xl font-black text-BtW leading-tight tracking-tighter">
                  {{ decodeHtmlEntities(incident.title) }}
                </h1>

                <div class="flex flex-wrap items-center gap-8 text-sm md:text-base text-hsa">
                  <div v-if="incident.location" class="flex items-center gap-2.5">
                    <IconMapPin class="w-5 h-5 text-primary" /> {{ decodeHtmlEntities(incident.location) }}
                  </div>
                  <div class="flex items-center gap-2.5">
                    <IconCalendar class="w-5 h-5 text-primary" /> {{ formatDate(incident.created_at) }}
                  </div>
                  <!-- Author info -->
                  <div class="flex items-center gap-2.5">
                    <IconUser class="w-5 h-5 text-primary" />
                    <template v-if="incident.is_anonymous || incident.is_anonymous === 1">
                      Utilisateur anonyme
                    </template>
                    <template v-else>
                      {{ [incident.author_first_name, incident.author_last_name].filter(Boolean).join(' ') ||
                        'Utilisateur' }}
                      <span v-if="incident.reporter_organization" class="text-hsa/60">
                        · {{ incident.reporter_organization }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>

              <div class="h-px bg-ashAct/50"></div>

              <div class="space-y-6">
                <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em]">Analyse de l'incident</h3>
                <p class="text-lg md:text-xl text-BtW leading-relaxed whitespace-pre-wrap">
                  {{ decodeHtmlEntities(incident.description) }}
                </p>
              </div>

              <!-- Evidence Section with Toggle -->
              <div v-if="incident.evidence_file" class="pt-8 space-y-6">
                <button @click="showEvidence = !showEvidence"
                  class="flex items-center gap-2 text-xs font-black text-hsa uppercase tracking-[0.3em] hover:text-primary transition-colors">
                  <component :is="showEvidence ? IconChevronUp : IconChevronDown" class="w-4 h-4" />
                  Preuve de l'incident
                </button>

                <div v-if="showEvidence" class="animate-fade-in space-y-6">
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

                  <!-- PDF Viewer Frame -->
                  <div v-else-if="isPdf(incident.evidence_file)" class="space-y-4">
                    <div
                      class="w-full h-[600px] rounded-[2rem] overflow-hidden border border-ash shadow-inner bg-ash/5">
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

            <!-- Comments Section -->
            <div class="glass-panel p-8 md:p-10 rounded-[3rem] border border-ashAct space-y-6 shadow-lg">
              <button @click="showComments = !showComments"
                class="w-full flex items-center justify-between hover:text-primary transition-colors">
                <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em] flex items-center gap-2">
                  <IconMessage class="w-4 h-4 text-primary" /> Commentaires
                  <span v-if="store.comments.length"
                    class="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
                    {{ store.comments.length }}
                  </span>
                </h3>
                <component :is="showComments ? IconChevronUp : IconChevronDown" class="w-4 h-4 text-hsa" />
              </button>

              <template v-if="showComments">
                <!-- Add Comment Form (authenticated only) -->
                <div v-if="authStore.user" class="space-y-3">
                  <textarea v-model="newComment" rows="3" placeholder="Ajouter un commentaire..."
                    class="w-full p-4 rounded-2xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder-hsa/50 resize-none" />
                  <div class="flex justify-end">
                    <UiBaseButton variant="primary" size="sm" @click="handleAddComment"
                      :disabled="!newComment.trim() || submittingComment"
                      class="!rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <IconSend class="w-3.5 h-3.5 mr-1.5" />
                      {{ submittingComment ? 'Envoi...' : 'Commenter' }}
                    </UiBaseButton>
                  </div>
                </div>
                <div v-else class="p-4 rounded-2xl bg-ash/5 border border-ash/30 text-center">
                  <p class="text-xs text-hsa font-bold">
                    <NuxtLink to="/auth/login" class="text-primary hover:underline">Connectez-vous</NuxtLink>
                    pour laisser un commentaire.
                  </p>
                </div>

                <div class="h-px bg-ashAct/40"></div>

                <!-- Comments List -->
                <div v-if="store.loadingComments" class="space-y-4">
                  <UiAppSkeleton v-for="i in 3" :key="i" height="80px" radius="1.5rem" />
                </div>

                <div v-else-if="store.comments.length" class="space-y-4">
                  <div v-for="comment in store.comments" :key="comment.id"
                    class="p-5 rounded-2xl bg-ash/5 border border-ash/30 space-y-2 hover:border-ash/50 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black uppercase">
                          {{ (comment.first_name || 'U').charAt(0) }}
                        </div>
                        <span class="text-xs font-black text-BtW">
                          {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                        </span>
                        <span v-if="comment.organization_name" class="text-[10px] text-hsa font-bold">
                          · {{ comment.organization_name }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
                        <!-- Edit button: own comment + within 24h -->
                        <button v-if="canEditComment(comment)" @click="startEditComment(comment)"
                          class="p-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors"
                          title="Modifier le commentaire">
                          <IconEdit class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <!-- Inline edit mode -->
                    <div v-if="editingCommentId === comment.id" class="pl-9 space-y-2">
                      <textarea v-model="editCommentContent" rows="2"
                        class="w-full p-3 rounded-xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
                      <div class="flex gap-2 justify-end">
                        <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment"
                          class="!rounded-lg !text-[10px]">
                          Annuler
                        </UiBaseButton>
                        <UiBaseButton variant="primary" size="sm" @click="saveEditComment(comment)"
                          :disabled="!editCommentContent.trim() || savingComment" class="!rounded-lg !text-[10px]">
                          {{ savingComment ? 'Enregistrement...' : 'Enregistrer' }}
                        </UiBaseButton>
                      </div>
                    </div>
                    <p v-else class="text-sm text-BtW leading-relaxed pl-9">{{ comment.content }}</p>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <IconMessage class="w-8 h-8 text-hsa/20 mx-auto mb-2" />
                  <p class="text-xs text-hsa font-bold">Aucun commentaire pour le moment.</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Right Column: Actions & Advice -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Action Card -->
            <UiBaseCard class="!rounded-[2.5rem] p-8 space-y-6">
              <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em] pb-4">Actions</h3>
              <div class="grid grid-cols-1 gap-4">
                <button @click="shareIncident"
                  class="w-full flex items-center justify-between p-4 rounded-2xl bg-ash/5 hover:bg-ash/10 border border-ashAct transition-all group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <IconShare class="w-5 h-5" />
                    </div>
                    <span class="text-sm font-black text-BtW">Partager l'alerte</span>
                  </div>
                  <IconArrowUpRight class="w-4 h-4 text-hsa group-hover:text-primary transition-colors" />
                </button>
                <button @click="downloadEvidence"
                  class="w-full flex items-center justify-between p-4 rounded-2xl bg-ash/5 hover:bg-ash/10 border border-ashAct transition-all group">
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
                  <IconArrowUpRight v-if="!isOwnIncident"
                    class="w-4 h-4 text-hsa group-hover:text-danger transition-colors" />
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
          </div>
        </div>
      </div>

      <div v-else-if="!store.loading && !incident" class="text-center py-32 space-y-6 animate-fade-in max-w-lg mx-auto">
        <IconAlertCircle class="w-16 h-16 text-danger mx-auto opacity-20" />
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-BtW">Incident introuvable</h3>
          <p class="text-hsa font-bold">Ce signalement n'existe pas ou a été retiré pour des raisons de sécurité.</p>
        </div>
        <NuxtLink to="/vigitech" class="block">
          <UiBaseButton variant="ghost">Retourner à la liste</UiBaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <ModalImageViewer :show="viewer.show" :imageUrl="viewer.url" @close="viewer.show = false" />

    <!-- Report Modal -->
    <ModalVigitechReportIncident v-if="incident" :show="showReportModal" :incidentId="incident.id"
      @close="showReportModal = false" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import {
  IconMapPin, IconCalendar, IconUser, IconArrowUpRight, IconDownload, IconShare, IconShieldCheck, IconAlertCircle, IconZoomIn, IconFileTypePdf, IconExternalLink, IconChevronDown, IconChevronUp, IconEye, IconMessage, IconSend, IconFlag, IconEdit
} from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { useVigitechAdvice } from '~/composables/useVigitechAdvice'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'

definePageMeta({
  layout: 'guest'
})

const route = useRoute()
const store = useVigitechStore()
const authStore = useAuthStore()
const toast = useToastStore()
const { getAdvice } = useVigitechAdvice()
const incident = computed(() => store.currentIncident)
const showEvidence = ref(false)
const showComments = ref(true)
const newComment = ref('')
const submittingComment = ref(false)
const showReportModal = ref(false)
const editingCommentId = ref<string | null>(null)
const editCommentContent = ref('')
const savingComment = ref(false)

const isOwnIncident = computed(() => {
  return !!(authStore.user && incident.value?.user_id === authStore.user.id)
})

const canEditComment = (comment: any) => {
  if (!authStore.user || comment.user_id !== authStore.user.id) return false
  const createdAt = new Date(comment.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
}

const startEditComment = (comment: any) => {
  editingCommentId.value = comment.id
  editCommentContent.value = comment.content
}

const cancelEditComment = () => {
  editingCommentId.value = null
  editCommentContent.value = ''
}

const saveEditComment = async (comment: any) => {
  if (!editCommentContent.value.trim() || !incident.value) return
  savingComment.value = true
  const result = await store.updateComment(comment.id, editCommentContent.value.trim(), incident.value.id)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    editingCommentId.value = null
    editCommentContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  savingComment.value = false
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
  const fullUrl = window.location.href
  const shareData = {
    title: `Cyber-Alerte CYPASS: ${incident.value.title}`,
    text: `${incident.value.description.substring(0, 100)}...`,
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

const viewer = ref({
  show: false,
  url: ''
})

const openViewer = (url: string) => {
  viewer.value.url = url
  viewer.value.show = true
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

const handleAddComment = async () => {
  if (!newComment.value.trim() || !incident.value) return
  submittingComment.value = true
  const result = await store.addComment(incident.value.id, newComment.value.trim())
  if (result.success) {
    newComment.value = ''
    toast.showToast('success', 'Commentaire ajouté', result.message || 'Votre commentaire a été publié.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de publier le commentaire.')
  }
  submittingComment.value = false
}

const fetchData = () => {
  const id = route.params.id as string
  store.fetchPublicIncidentById(id)
  store.fetchComments(id)
}

onMounted(fetchData)

useHead({
  title: computed(() => incident.value ? `${incident.value.title} - Incident` : 'Détail de l\'incident')
})
</script>
