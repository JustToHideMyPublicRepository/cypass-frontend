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
              <textarea v-model="newComment" rows="3" placeholder="Partagez votre analyse ou posez une question..."
                class="w-full p-6 rounded-[2rem] bg-WtB/50 border border-ash/50 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 focus:bg-WtB transition-all placeholder-hsa/40 resize-none shadow-inner" />
              <!-- Status indicators or secondary actions could go here -->
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
            class="group/item relative flex gap-4 md:gap-6 bg-transparent hover:bg-ash/5 p-4 rounded-[2.5rem] transition-all duration-500">

            <!-- Avatar Column -->
            <div class="shrink-0 pt-1">
              <div
                class="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-WtB shadow-lg bg-ash/20 group-hover/item:rotate-3 transition-transform duration-500">
                <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Content Column -->
            <div class="flex-1 min-w-0 space-y-2">
              <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <NuxtLink :to="`/user/${comment.user_id}`"
                    class="text-sm font-black text-BtW hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                    {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                    <IconRosetteDiscountCheck v-if="comment.is_verified" class="w-3.5 h-3.5 text-primary shrink-0" />
                  </NuxtLink>
                  <p class="text-[10px] text-hsa font-bold uppercase tracking-tighter opacity-70">
                    {{ formatDate(comment.created_at) }}
                  </p>
                </div>

                <!-- Actions (Hover only) -->
                <div
                  class="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 translate-x-2 group-hover/item:translate-x-0 transition-all duration-300">
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
              <div v-if="editingCommentId === comment.id" class="mt-4 space-y-3">
                <textarea v-model="editCommentContent" rows="3"
                  class="w-full p-4 rounded-2xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner" />
                <div class="flex gap-2 justify-end">
                  <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment" class="!rounded-xl !text-[10px]">
                    Annuler
                  </UiBaseButton>
                  <UiBaseButton variant="primary" size="sm" @click="saveEditComment(comment)"
                    :disabled="!editCommentContent.trim() || savingComment" class="!rounded-xl !text-[10px]">
                    {{ savingComment ? 'Envoi...' : 'Enregistrer' }}
                  </UiBaseButton>
                </div>
              </div>
              <div v-else class="relative">
                <p class="text-sm text-BtW/90 leading-relaxed font-bold break-words">
                  {{ comment.content }}
                </p>
              </div>
            </div>
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
  IconLock, IconRosetteDiscountCheck
} from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
import { getUserAvatarUrl } from '~/utils/user'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  incidentId: string
  comments: any[]
  loading: boolean
  commentsCount?: number
}>()

const authStore = useAuthStore()
const store = useVigitechStore()
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

const showDeleteConfirm = ref(false)
const commentIdToDelete = ref<string | null>(null)
const deletingComment = ref(false)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch {
    return ''
  }
}

const confirmDeleteComment = (id: string) => {
  commentIdToDelete.value = id
  showDeleteConfirm.value = true
}

const handleDeleteComment = async () => {
  if (!commentIdToDelete.value) return
  deletingComment.value = true
  const result = await store.deleteComment(commentIdToDelete.value, props.incidentId)
  if (result.success) {
    toast.showToast('success', 'Commentaire supprimé', result.message || 'Le commentaire a été supprimé.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer le commentaire.')
  }
  deletingComment.value = false
  showDeleteConfirm.value = false
  commentIdToDelete.value = null
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

const saveEditComment = async (comment: any) => {
  if (!editCommentContent.value.trim()) return
  savingComment.value = true
  const result = await store.updateComment(comment.id, editCommentContent.value.trim(), props.incidentId)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    editingCommentId.value = null
    editCommentContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  savingComment.value = false
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) return
  submittingComment.value = true
  const result = await store.addComment(props.incidentId, newComment.value.trim())
  if (result.success) {
    newComment.value = ''
    toast.showToast('success', 'Commentaire ajouté', result.message || 'Votre commentaire a été publié.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de publier le commentaire.')
  }
  submittingComment.value = false
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
