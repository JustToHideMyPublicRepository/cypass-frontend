<template>
  <UiBaseCard class="!rounded-[2.5rem] overflow-hidden">
    <div class="p-6 md:p-8 space-y-5">
      <button @click="showComments = !showComments"
        class="w-full flex items-center justify-between hover:text-primary transition-all duration-300">
        <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em] flex items-center gap-2">
          <IconMessage class="w-4 h-4 text-primary" /> Commentaires
          <span v-if="commentsCount || comments.length"
            class="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
            {{ commentsCount ?? comments.length }}
          </span>
        </h3>
        <component :is="showComments ? IconChevronUp : IconChevronDown" class="w-4 h-4 text-hsa transition-transform" />
      </button>

      <template v-if="showComments">
        <div v-if="loading" class="space-y-3">
          <UiAppSkeleton v-for="i in 3" :key="i" height="70px" radius="1rem" />
        </div>

        <div v-else-if="commentsCount || comments.length" class="space-y-3">
          <div v-for="comment in comments" :key="comment.id"
            class="p-4 rounded-xl bg-ash/5 border border-ash/30 space-y-1.5 hover:border-ash/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
                  <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
                </div>
                <NuxtLink :to="`/user/${comment.user_id}`"
                  class="text-[11px] font-black text-BtW hover:text-primary hover:underline transition-colors">
                  {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                </NuxtLink>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
                <button v-if="canEditComment(comment)" @click="startEditComment(comment)"
                  class="p-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors"
                  title="Modifier">
                  <IconEdit class="w-3.5 h-3.5" />
                </button>
                <button v-if="isOwner(comment)" @click="confirmDeleteComment(comment.id)"
                  class="p-1 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors"
                  title="Supprimer">
                  <IconTrash class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Inline Edit -->
            <div v-if="editingCommentId === comment.id" class="pl-8 space-y-2">
              <div class="relative">
                <textarea v-model="editCommentContent" rows="2" maxlength="1000"
                  class="w-full p-3 pb-8 rounded-xl bg-WtB border border-ash/50 text-xs font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
                <div class="absolute bottom-2 right-3 text-[8px] font-black tracking-widest"
                  :class="editCommentContent.length > 900 ? (editCommentContent.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
                  {{ editCommentContent.length }} / 1000
                </div>
              </div>
              <div class="flex gap-2 justify-end">
                <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment" class="!rounded-lg !text-[9px]">
                  Annuler
                </UiBaseButton>
                <UiBaseButton variant="primary" size="sm" @click="saveEditComment(comment)"
                  :disabled="!editCommentContent.trim() || savingComment" class="!rounded-lg !text-[9px]">
                  {{ savingComment ? 'Enregistrement...' : 'Enregistrer' }}
                </UiBaseButton>
              </div>
            </div>
            <div v-else class="pl-8 space-y-1">
              <p class="text-xs text-BtW leading-relaxed break-words">
                {{ (comment.content.length > 200 && !expandedComments[comment.id]) ?
                  comment.content.slice(0, 200) + '...' : comment.content }}
              </p>
              <button v-if="comment.content.length > 200" @click="toggleExpand(comment.id)"
                class="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                <component :is="expandedComments[comment.id] ? IconChevronUp : IconChevronDown" class="w-3 h-3" />
                {{ expandedComments[comment.id] ? 'Réduire' : 'Lire plus' }}
              </button>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="commentsPagination.hasMore" class="pt-4 flex justify-center">
            <button @click="handleLoadMore" :disabled="loadingMore"
              class="text-[10px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors flex items-center gap-2">
              <IconChevronDown v-if="!loadingMore" class="w-3.5 h-3.5" />
              <div v-else class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              {{ loadingMore ? 'Chargement...' : 'Voir plus' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <IconMessage class="w-6 h-6 text-hsa/20 mx-auto mb-2" />
          <p class="text-[11px] text-hsa font-bold">Aucun commentaire.</p>
        </div>
      </template>

      <!-- Delete Confirmation -->
      <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le commentaire"
        message="Êtes-vous sûr de vouloir supprimer ce commentaire ?" confirm-text="Supprimer"
        :loading="deletingComment" variant="danger" @cancel="showDeleteConfirm = false"
        @confirm="handleDeleteComment" />
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconMessage, IconChevronUp, IconChevronDown, IconEdit, IconTrash } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUserAvatarUrl } from '~/utils/user'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { usePublicVigitechStore } from '~/stores/back/public/vigitech'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  incidentId: string
  comments: any[]
  loading: boolean
  commentsCount?: number
}>()

const prefStore = useVigiPrefStore()
const authStore = useAuthStore()
const store = useUserVigitechStore()
const publicVigitechStore = usePublicVigitechStore()
const toast = useToastStore()

const showComments = ref(prefStore.display.showComments)

// React to preference changes
watch(() => prefStore.display.showComments, (val) => {
  showComments.value = val
})

const editingCommentId = ref<string | null>(null)
const editCommentContent = ref('')
const savingComment = ref(false)
const showDeleteConfirm = ref(false)
const commentIdToDelete = ref<string | null>(null)
const deletingComment = ref(false)
const loadingMore = ref(false)
const expandedComments = ref<Record<string, boolean>>({})

const toggleExpand = (id: string) => {
  expandedComments.value[id] = !expandedComments.value[id]
}

const commentsPagination = computed(() => publicVigitechStore.commentsPagination)

const isOwner = (comment: any) => {
  return authStore.user && comment.user_id === authStore.user.id
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

const handleLoadMore = async () => {
  loadingMore.value = true
  await publicVigitechStore.fetchComments(props.incidentId, true)
  loadingMore.value = false
}

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}
</script>
