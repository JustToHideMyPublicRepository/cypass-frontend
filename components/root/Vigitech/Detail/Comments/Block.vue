<template>
  <div
    class="relative bg-ash/20 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-ash/40 shadow-2xl overflow-hidden group">
    <!-- Ambient backgrounds for premium feel -->
    <div
      class="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700">
    </div>

    <!-- Header Section -->
    <RootVigitechDetailCommentsHead :count="commentsCount ?? comments.length" :show="showComments"
      @toggle="showComments = !showComments" />

    <Transition name="fade-slide">
      <div v-if="showComments" class="relative space-y-8">
        <!-- Add Comment Form -->
        <RootVigitechDetailCommentsForm v-model="newComment" :loading="submittingComment" :user="authStore.user"
          @submit="handleAddComment" />

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

        <RootVigitechDetailCommentsList v-else :comments="comments" :has-more="commentsPagination.hasMore"
          :loading-more="loadingMore" :editing-comment-id="editingCommentId"
          v-model:edit-comment-content="editCommentContent" :saving-comment="savingComment"
          :expanded-comments="expandedComments" :reacting-to-id="reactingToId" :reacting-type="reactingType"
          :show-replies="showReplies" :loading-replies="loadingReplies" :user="authStore.user"
          :replying-to-id="replyingToId" v-model:reply-content="replyContent" :sending-reply="sendingReply"
          @edit="startEditComment" @delete="confirmDeleteComment" @cancel-edit="cancelEditComment"
          @save-edit="saveEditComment" @toggle-expand="toggleExpand" @react="handleCommentReact"
          @show-reactions="openReactionList" @start-reply="startReply" @send-reply="handleSendReply"
          @cancel-reply="replyingToId = null" @toggle-replies="toggleReplies" @load-more="handleLoadMore" />

        <!-- Add Modal at the end of comments list -->
        <ModalVigitechReactionsList :show="showReactionModal" :reactions="selectedReactionsForModal"
          @close="showReactionModal = false" />
      </div>
    </Transition>

    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le commentaire"
      message="Cette action est irréversible. Voulez-vous vraiment continuer ?" confirm-text="Supprimer"
      :loading="deletingComment" variant="danger" @cancel="showDeleteConfirm = false" @confirm="handleDeleteComment" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { usePublicVigitechStore } from '~/stores/back/public/vigitech'
import { useToastStore } from '~/stores/front/toast'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
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

// Reactions state
const reactingToId = ref<string | null>(null)
const reactingType = ref<string | null>(null)
const showReactionModal = ref(false)
const selectedReactionsForModal = ref<any[]>([])

const openReactionList = (comment: Comment) => {
  selectedReactionsForModal.value = comment.reactions_details || []
  showReactionModal.value = true
}

const toggleExpand = (id: string) => {
  expandedComments.value[id] = !expandedComments.value[id]
}

const commentsPagination = computed(() => publicVigitechStore.commentsPagination)

const showDeleteConfirm = ref(false)
const commentIdToDelete = ref<string | null>(null)
const parentIdOfDeletion = ref<string | null>(null)
const deletingComment = ref(false)

const handleCommentReact = async (type: string, targetId: string, parentId?: string) => {
  if (!authStore.user) {
    toast.showToast('warning', 'Authentification requise', 'Veuillez vous connecter pour réagir.')
    return
  }

  if (reactingToId.value) return
  reactingToId.value = targetId
  reactingType.value = type

  const res = await userVigitechStore.reactToComment(targetId, type, props.incidentId, parentId)
  if (!res.success) {
    toast.showToast('error', 'Erreur', res.message || 'Impossible de réagir au commentaire.')
  }

  reactingToId.value = null
  reactingType.value = null
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

const isOwner = (comment: any) => {
  if (!authStore.user) return false
  const userId = comment.user_id || comment.author_id
  return String(userId) === String(authStore.user.id)
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
