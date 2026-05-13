<template>
  <UiBaseCard class="!rounded-[2.5rem] overflow-hidden">
    <div class="p-6 md:p-8 space-y-5">
      <meVigitechDetailCommentsHead :incident-id="incidentId" :count="commentsCount ?? comments.length"
        :show="showComments" @toggle="showComments = !showComments" />

      <template v-if="showComments">
        <div v-if="loading" class="space-y-3">
          <UiAppSkeleton v-for="i in 3" :key="i" height="70px" radius="1rem" />
        </div>

        <meVigitechDetailCommentsList v-else :comments="comments" :has-more="commentsPagination.hasMore"
          :loading-more="loadingMore" :editing-comment-id="editingCommentId"
          v-model:edit-comment-content="editCommentContent" :saving-comment="savingComment"
          :expanded-comments="expandedComments" :reacting-to-id="reactingToId" :reacting-type="reactingType"
          :show-replies="showReplies" :loading-replies="loadingReplies" @edit="startEditComment"
          @delete="confirmDeleteComment" @cancel-edit="cancelEditComment" @save-edit="saveEditComment"
          @toggle-expand="toggleExpand" @react="handleCommentReact" @show-reactions="openReactionList"
          @toggle-replies="toggleReplies" @load-more="handleLoadMore" />

        <ModalVigitechReactionsList :show="showReactionModal" :reactions="selectedReactionsForModal"
          @close="showReactionModal = false" />
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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUserAvatarUrl } from '~/utils/user'
import { useVigiPrefStore } from '~/stores/front/vigiPref'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { usePublicVigitechStore } from '~/stores/back/public/vigitech'
import { useToastStore } from '~/stores/front/toast'
import type { Comment } from '~/types/vigitech'

const props = defineProps<{
  incidentId: string
  comments: Comment[]
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

// Replies state for dashboard
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

const handleCommentReact = async (type: string, targetId: string, parentId?: string) => {
  if (!authStore.user) {
    toast.showToast('warning', 'Authentification requise', 'Veuillez vous connecter pour réagir.')
    return
  }

  if (reactingToId.value) return
  reactingToId.value = targetId
  reactingType.value = type

  const res = await store.reactToComment(targetId, type, props.incidentId, parentId)
  if (!res.success) {
    toast.showToast('error', 'Erreur', res.message || 'Impossible de réagir au commentaire.')
  }

  reactingToId.value = null
  reactingType.value = null
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
    if (!comment.replies || comment.replies.length === 0) {
      await handleFetchReplies(comment.id)
    }
    showReplies.value[comment.id] = true
  }
}

const commentsPagination = computed(() => publicVigitechStore.commentsPagination)

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
</script>
