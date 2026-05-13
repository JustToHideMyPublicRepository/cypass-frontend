<template>
  <div
    class="relative bg-ash/20 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-ash/40 shadow-2xl overflow-hidden group">
    <!-- Ambient backgrounds for premium feel -->
    <div
      class="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700">
    </div>

    <!-- Header Section -->
    <div class="relative flex items-center justify-between mb-10">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
          <IconMessage class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em] leading-none mb-1">
            Espace Discussion
          </h3>
          <p class="text-xl font-black text-BtW tracking-tight">
            Commentaires
            <span v-if="commentsCount || comments.length" class="text-primary opacity-50 ml-1">
              {{ commentsCount ?? comments.length }}
            </span>
          </p>
        </div>
      </div>
      <button @click="showComments = !showComments"
        class="p-2.5 rounded-2xl bg-ash/10 hover:bg-primary/10 text-hsa hover:text-primary transition-all duration-300 active:scale-90">
        <component :is="showComments ? IconChevronUp : IconChevronDown" class="w-5 h-5" />
      </button>
    </div>

    <Transition name="fade-slide">
      <div v-if="showComments" class="relative space-y-8">
        <!-- Add Comment Form -->
        <div class="relative group/input">
          <div v-if="authStore.user" class="space-y-4">
            <div class="relative">
              <textarea v-model="newComment" rows="3" maxlength="1000"
                placeholder="Partagez votre analyse ou posez une question..."
                class="w-full p-6 pb-10 rounded-[2rem] bg-WtB/50 border border-ash/50 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-WtB transition-all placeholder-hsa/40 resize-none shadow-inner" />
              <div class="absolute bottom-4 right-6 text-[10px] font-black tracking-widest"
                :class="newComment.length > 900 ? (newComment.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
                {{ newComment.length }} / 1000
              </div>
            </div>
            <div class="flex justify-end items-center gap-4">
              <p class="text-[10px] text-hsa font-bold italic opacity-60">Soyez respectueux et constructif.</p>
              <UiBaseButton variant="primary" size="md" @click="handleAddComment"
                :disabled="!newComment.trim() || submittingComment"
                class="!rounded-2xl !px-8 !py-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                <IconSend class="w-4 h-4 mr-2" />
                {{ submittingComment ? 'Publication...' : 'Publier' }}
              </UiBaseButton>
            </div>
          </div>
          <div v-else class="p-8 rounded-[2rem] bg-ash/5 border border-ash/20 text-center backdrop-blur-sm">
            <div class="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconLock class="w-6 h-6" />
            </div>
            <p class="text-sm text-hsa font-bold">
              <NuxtLink to="/auth/login" class="text-primary hover:underline underline-offset-4">Connectez-vous
              </NuxtLink>
              pour participer à la discussion.
            </p>
          </div>
        </div>

        <div class="h-px bg-gradient-to-r from-transparent via-ash/30 to-transparent"></div>

        <!-- Comments List -->
        <div v-if="loading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex gap-4">
            <UiAppSkeleton width="40px" height="40px" radius="1rem" />
            <div class="flex-1 space-y-2">
              <UiAppSkeleton width="30%" height="15px" radius="0.5rem" />
              <UiAppSkeleton width="100%" height="60px" radius="1.5rem" />
            </div>
          </div>
        </div>

        <div v-else-if="commentsCount || comments.length" class="space-y-6">
          <div v-for="comment in comments" :key="comment.id"
            class="group/item relative flex gap-4 md:gap-6 bg-transparent p-4 rounded-[2.5rem] transition-all duration-500 hover:bg-ash/5">

            <!-- Avatar Column -->
            <div class="shrink-0 pt-1">
              <div
                class="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-WtB shadow-lg bg-ash/20 group-hover/item:rotate-3 transition-transform duration-500">
                <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Content Column -->
            <div class="flex-1 min-w-0 space-y-3">
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <NuxtLink :to="`/user/${comment.user_id}`"
                    class="text-sm font-black text-BtW hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                    {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                    <IconRosetteDiscountCheck v-if="comment.is_verified || comment.reporter_organization"
                      class="w-3.5 h-3.5 text-primary shrink-0" />
                  </NuxtLink>
                  <p
                    class="text-[10px] text-hsa font-bold uppercase tracking-tighter opacity-70 flex items-center gap-2">
                    {{ formatDate(comment.created_at) }}
                    <span v-if="comment.organization_name"
                      class="hidden sm:inline bg-primary/10 text-primary px-1.5 py-0.5 rounded-full lowercase">{{
                        comment.organization_name }}</span>
                  </p>
                </div>

                <!-- Actions (Hover only) -->
                <div
                  class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 sm:translate-x-2 sm:group-hover/item:translate-x-0 transition-all duration-300">
                  <button v-if="canEditComment(comment)" @click="startEditComment(comment)"
                    class="p-2 rounded-xl bg-WtB border border-ash/30 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                    title="Modifier">
                    <IconEdit class="w-4 h-4" />
                  </button>
                  <button v-if="isOwner(comment)" @click="confirmDeleteComment(comment.id)"
                    class="p-2 rounded-xl bg-WtB border border-ash/30 hover:bg-danger/10 hover:text-danger transition-all active:scale-90"
                    title="Supprimer">
                    <IconTrash class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Inline edit mode -->
              <div v-if="editingCommentId === comment.id" class="space-y-3">
                <div class="relative">
                  <textarea v-model="editCommentContent" rows="3" maxlength="1000"
                    class="w-full p-4 pb-8 rounded-2xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner" />
                  <div class="absolute bottom-2 right-4 text-[9px] font-black tracking-widest"
                    :class="editCommentContent.length > 900 ? (editCommentContent.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
                    {{ editCommentContent.length }} / 1000
                  </div>
                </div>
                <div class="flex gap-2 justify-end">
                  <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment" class="!rounded-xl !text-[10px]">
                    Annuler</UiBaseButton>
                  <UiBaseButton variant="primary" size="sm" @click="saveEditComment(comment)"
                    :disabled="!editCommentContent.trim() || savingComment" class="!rounded-xl !text-[10px]">
                    {{ savingComment ? 'Envoi...' : 'Enregistrer' }}
                  </UiBaseButton>
                </div>
              </div>
              <!-- Normal content display -->
              <div v-else class="relative space-y-2">
                <p class="text-sm text-BtW/90 leading-relaxed break-words whitespace-pre-wrap">{{
                  (comment.content.length > 200 && !expandedComments[comment.id]) ?
                    comment.content.slice(0, 200) + '...' : comment.content }}</p>
                <button v-if="comment.content.length > 200" @click="toggleExpand(comment.id)"
                  class="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 mt-1 flex items-center gap-1 transition-colors">
                  <component :is="expandedComments[comment.id] ? IconChevronUp : IconChevronDown" class="w-3 h-3" />
                  {{ expandedComments[comment.id] ? 'Réduire' : 'Lire plus' }}
                </button>
              </div>

              <!-- Reply Action Row -->
              <div class="flex items-center gap-4 pt-1">
                <button v-if="authStore.user" @click="startReply(comment)"
                  class="text-[11px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors flex items-center gap-1">
                  <IconCornerUpLeft class="w-3.5 h-3.5" />
                  Répondre
                </button>
                <button v-if="comment.replies_count && comment.replies_count > 0" @click="toggleReplies(comment)"
                  class="text-[11px] font-black tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  <IconMessageCircle class="w-3.5 h-3.5" />
                  {{ showReplies[comment.id] ? 'Masquer' : 'Voir' }}
                  {{ comment.replies_count === 1 ? 'la réponse' : `les ${comment.replies_count} réponses` }}
                  <IconLoader2 v-if="loadingReplies[comment.id]" class="w-3 h-3 animate-spin ml-1" />
                </button>
              </div>

              <!-- Reply Input Box -->
              <div v-if="replyingToId === comment.id" class="mt-4 flex gap-3">
                <textarea v-model="replyContent" rows="2" maxlength="500" placeholder="Écrire une réponse..."
                  class="flex-1 p-3 rounded-xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-sm"></textarea>
                <div class="flex flex-col gap-2 justify-end">
                  <UiBaseButton variant="primary" size="sm" @click="handleSendReply(comment)"
                    :disabled="!replyContent.trim() || sendingReply" class="!px-3 !py-2 !rounded-xl">
                    <UiLogoLoader v-if="sendingReply" size="xs" color="currentColor" />
                    <IconSend v-else class="w-4 h-4" />
                  </UiBaseButton>
                  <UiBaseButton variant="ghost" size="sm" @click="replyingToId = null"
                    class="!px-3 !py-2 !rounded-xl text-hsa">
                    <IconX class="w-4 h-4" />
                  </UiBaseButton>
                </div>
              </div>

              <!-- Replies List -->
              <div v-if="showReplies[comment.id] && comment.replies?.length"
                class="mt-4 space-y-4 border-l-2 border-hsa pl-4">
                <div v-for="reply in comment.replies" :key="reply.id" class="group/reply relative flex gap-3">
                  <div class="shrink-0">
                    <div class="w-8 h-8 rounded-xl overflow-hidden border border-WtB shadow-sm bg-ash/20">
                      <img :src="getAvatar(reply)" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <NuxtLink :to="`/user/${reply.user_id}`"
                        class="text-xs font-black text-BtW hover:text-primary transition-colors flex items-center gap-1 truncate">
                        {{ [reply.first_name, reply.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                        <IconRosetteDiscountCheck v-if="reply.is_verified || reply.organization_name"
                          class="w-3 h-3 text-primary shrink-0" />
                      </NuxtLink>

                      <!-- Reply Actions -->
                      <div
                        class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/reply:opacity-100 transition-opacity">
                        <button v-if="canEditComment(reply)" @click="startEditComment(reply)"
                          class="p-1 rounded bg-WtB border border-ash/30 hover:bg-primary/10 hover:text-primary text-hsa"
                          title="Modifier">
                          <IconEdit class="w-3 h-3" />
                        </button>
                        <button v-if="isOwner(reply)" @click="confirmDeleteComment(reply.id, comment.id)"
                          class="p-1 rounded bg-WtB border border-ash/30 hover:bg-danger/10 hover:text-danger text-hsa"
                          title="Supprimer">
                          <IconTrash class="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p class="text-[9px] text-hsa font-bold uppercase tracking-tighter opacity-70">
                      {{ formatDate(reply.created_at) }}
                    </p>

                    <!-- Reply Inline Edit -->
                    <div v-if="editingCommentId === reply.id" class="mt-2 space-y-2">
                      <textarea v-model="editCommentContent" rows="2" maxlength="500"
                        class="w-full p-2.5 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all resize-none shadow-inner" />
                      <div class="flex gap-2 justify-end">
                        <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment"
                          class="!px-2 !py-1 !rounded-lg !text-[9px]">Annuler</UiBaseButton>
                        <UiBaseButton variant="primary" size="sm" @click="saveEditComment(reply, comment.id)"
                          :disabled="!editCommentContent.trim() || savingComment"
                          class="!px-2 !py-1 !rounded-lg !text-[9px]">Enregistrer</UiBaseButton>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-xs text-BtW/80 leading-relaxed whitespace-pre-wrap break-words">{{ reply.content }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="commentsPagination.hasMore" class="pt-6 flex justify-center">
            <UiBaseButton variant="ghost" size="sm" @click="handleLoadMore" :loading="loadingMore"
              class="!rounded-2xl !px-6 !py-2.5 text-[10px] font-black uppercase tracking-widest bg-ash/5 hover:bg-ash/10 text-hsa hover:text-primary transition-all">
              <IconChevronDown class="w-4 h-4 mr-2" />
              Voir plus de commentaires
            </UiBaseButton>
          </div>
        </div>

        <div v-else class="py-12 text-center space-y-4">
          <div class="w-20 h-20 bg-hsa rounded-[2.5rem] flex items-center justify-center mx-auto border border-ash">
            <IconMessage class="w-10 h-10 text-ash" />
          </div>
          <div>
            <h4 class="text-lg font-black text-BtW">Silence radio...</h4>
            <p class="text-sm text-hsa font-bold">Soyez le premier à lancer la conversation !</p>
          </div>
        </div>
      </div>
    </Transition>

    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le commentaire"
      message="Cette action est irréversible. Voulez-vous vraiment continuer ?" confirm-text="Supprimer"
      :loading="deletingComment" variant="danger" @cancel="showDeleteConfirm = false" @confirm="handleDeleteComment" />
  </div>
</template>

<script setup lang="ts">
import {
  IconMessage, IconChevronUp, IconChevronDown, IconSend, IconEdit, IconTrash,
  IconLock, IconRosetteDiscountCheck, IconCornerUpLeft, IconMessageCircle, IconLoader2, IconX
} from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { usePublicVigitechStore } from '~/stores/back/public/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
import { getUserAvatarUrl } from '~/utils/user'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'

const props = defineProps<{
  incidentId: string
  comments: Comment[]
  loading: boolean
  commentsCount?: number
}>()

const authStore = useAuthStore()
const userVigitechStore = useUserVigitechStore()
const publicVigitechStore = usePublicVigitechStore()
const toast = useToastStore()
const prefStore = useVigiPrefStore()

const showComments = ref(prefStore.display.showComments)

// React to preference changes
watch(() => prefStore.display.showComments, (val) => {
  showComments.value = val
})

const newComment = ref('')
const submittingComment = ref(false)
const editingCommentId = ref<string | null>(null)
const editCommentContent = ref('')
const savingComment = ref(false)
const loadingMore = ref(false)
const expandedComments = ref<Record<string, boolean>>({})

// Replies state
const replyingToId = ref<string | null>(null)
const replyContent = ref('')
const sendingReply = ref(false)
const loadingReplies = ref<Record<string, boolean>>({})
const showReplies = ref<Record<string, boolean>>({})

const toggleExpand = (id: string) => {
  expandedComments.value[id] = !expandedComments.value[id]
}

const commentsPagination = computed(() => publicVigitechStore.commentsPagination)

const showDeleteConfirm = ref(false)
const commentIdToDelete = ref<string | null>(null)
const parentIdOfDeletion = ref<string | null>(null)
const deletingComment = ref(false)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch {
    return ''
  }
}

const startReply = (comment: Comment) => {
  if (replyingToId.value === comment.id) {
    replyingToId.value = null
  } else {
    replyingToId.value = comment.id
    replyContent.value = ''
  }
}

const handleFetchReplies = async (parentId: string) => {
  loadingReplies.value[parentId] = true
  const res = await publicVigitechStore.fetchReplies(props.incidentId, parentId)
  if (res.success) {
    const parent = props.comments.find(c => c.id === parentId)
    if (parent) {
      parent.replies = res.data
      parent.replies_count = res.total
    }
  }
  loadingReplies.value[parentId] = false
}

const toggleReplies = async (comment: Comment) => {
  if (showReplies.value[comment.id]) {
    showReplies.value[comment.id] = false
  } else {
    // Si pas encore de réponses ou si on veut forcer le rechargement
    if (!comment.replies || comment.replies.length === 0) {
      await handleFetchReplies(comment.id)
    }
    showReplies.value[comment.id] = true
  }
}

const handleSendReply = async (parentComment: Comment) => {
  if (!replyContent.value.trim() || sendingReply.value) return
  sendingReply.value = true

  const result = await userVigitechStore.addComment(props.incidentId, replyContent.value.trim(), parentComment.id)

  if (result.success) {
    replyContent.value = ''
    replyingToId.value = null
    toast.showToast('success', 'Réponse publiée', result.message || 'Votre réponse a été publiée avec succès.')
    // On recharge les réponses automatiquement
    await handleFetchReplies(parentComment.id)
    showReplies.value[parentComment.id] = true
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de publier la réponse.')
  }
  sendingReply.value = false
}

const confirmDeleteComment = (id: string, parentId?: string) => {
  commentIdToDelete.value = id
  parentIdOfDeletion.value = parentId || null
  showDeleteConfirm.value = true
}

const handleDeleteComment = async () => {
  if (!commentIdToDelete.value) return
  deletingComment.value = true

  // si parentIdOfDeletion n'est pas def, c'est un top level comment, qui rafraichira tout via le store
  const result = await userVigitechStore.deleteComment(commentIdToDelete.value, parentIdOfDeletion.value ? undefined : props.incidentId)

  if (result.success) {
    toast.showToast('success', 'Commentaire supprimé', result.message || 'Le commentaire a été supprimé.')

    // Refresh reply list if it was a nested comment
    if (parentIdOfDeletion.value) {
      await handleFetchReplies(parentIdOfDeletion.value)
    }
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer le commentaire.')
  }

  deletingComment.value = false
  showDeleteConfirm.value = false
  commentIdToDelete.value = null
  parentIdOfDeletion.value = null
}

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const isOwner = (comment: any) => {
  if (!authStore.user) return false
  const userId = comment.user_id || comment.author_id
  return String(userId) === String(authStore.user.id)
}

const canEditComment = (comment: any) => {
  if (!isOwner(comment)) return false
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

const saveEditComment = async (comment: any, parentId?: string) => {
  if (!editCommentContent.value.trim()) return
  savingComment.value = true

  // Pour refetch: si parentId -> fetchReplies, sinon si top level -> fetchComments (fait par le store)
  const isTopLevel = !parentId && !comment.parent_id

  const result = await userVigitechStore.updateComment(comment.id, editCommentContent.value.trim(), isTopLevel ? props.incidentId : undefined)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    editingCommentId.value = null
    editCommentContent.value = ''

    // refetch manually if it is a reply
    if (!isTopLevel) {
      await handleFetchReplies(parentId || comment.parent_id)
    }
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  savingComment.value = false
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return
  submittingComment.value = true
  const result = await userVigitechStore.addComment(props.incidentId, newComment.value.trim())
  if (result.success) {
    newComment.value = ''
    toast.showToast('success', 'Commentaire ajouté', result.message || 'Votre commentaire a été publié.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de publier le commentaire.')
  }
  submittingComment.value = false
}

const handleLoadMore = async () => {
  loadingMore.value = true
  await publicVigitechStore.fetchComments(props.incidentId, true)
  loadingMore.value = false
}
</script>

<style scoped>
.glass-panel {
  background: rgba(var(--ash-rgb), 0.1);
  backdrop-filter: blur(20px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
