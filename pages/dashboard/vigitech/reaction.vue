<template>
  <div class="space-y-8">
    <MeVigitechReactionsHeader v-model:targetType="targetType" :loading="loading" @refresh="fetchData" />

    <div v-show="targetType !== 'my_comments'"
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
      <MeVigitechReactionsTabs v-model="reactionType" :availableTypes="availableReactionTypes" />

      <div v-if="displayItems.length"
        class="px-4 py-2 rounded-xl bg-ash/20 border border-ash/30 text-[10px] font-black uppercase tracking-widest text-hsa h-fit">
        {{ displayItems.length }} résultat{{ displayItems.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Content Area -->
    <div class="relative min-h-[400px]">
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UiAppSkeleton v-for="i in 6" :key="i" height="120px" radius="1.5rem" />
      </div>

      <!-- Interactions Grid -->
      <template v-else-if="displayItems.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <MeVigitechReactionsInteractionItem v-for="item in displayItems" :key="item.id" :item="item"
            :type="targetType === 'my_comments' ? 'comment' : 'reaction'" :loading="removalLoadingId === item.id"
            @remove-reaction="handleRemoveReaction" @edit="handleStartEdit" @delete="handleConfirmDelete" />
        </div>
      </template>

      <!-- Empty State -->
      <MeVigitechReactionsEmpty v-else class="animate-fade-in" />
    </div>

    <!-- Edit Comment Modal -->
    <UiConfirmModal :show="showEditModal" title="Modifier le commentaire" message="" confirm-text="Sauvegarder"
      :loading="savingComment" @cancel="showEditModal = false" @confirm="handleSaveEdit">
      <div class="mt-4">
        <textarea v-model="editCommentContent" rows="4"
          class="w-full p-4 rounded-2xl bg-ash/5 border border-ashAct text-sm font-bold text-BtW outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
          placeholder="Votre commentaire..." />
      </div>
    </UiConfirmModal>

    <!-- Delete Confirm Modal -->
    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le commentaire"
      message="Cette action est irréversible. Voulez-vous vraiment continuer ?" confirm-text="Supprimer"
      :loading="deletingComment" variant="danger" @cancel="showDeleteConfirm = false" @confirm="handleDeleteComment" />
  </div>
</template>

<script setup lang="ts">
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'
import type { ReactionType } from '~/types/vigitech'

const store = useUserVigitechStore()
const toast = useToastStore()

const loading = ref(true)
const targetType = ref('')
const reactionType = ref('')
const removalLoadingId = ref<string | null>(null)

// Actions state
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const editingComment = ref<any>(null)
const editCommentContent = ref('')
const savingComment = ref(false)
const deletingComment = ref(false)
const idToDelete = ref<string | null>(null)

const displayItems = computed(() => {
  if (targetType.value === 'my_comments') {
    return store.userComments
  }
  return store.userReactions
})

const availableReactionTypes = computed<ReactionType[]>(() => {
  if (targetType.value === 'comment') {
    return ['like', 'dislike']
  }
  return ['love', 'like', 'wow', 'dislike', 'sad']
})

const fetchData = async () => {
  loading.value = true
  try {
    if (targetType.value === 'my_comments') {
      await store.fetchUserComments()
    } else {
      const params: any = {}
      if (targetType.value) params.target_type = targetType.value
      if (reactionType.value) params.type = reactionType.value
      await store.fetchUserReactions(params)
    }
  } finally {
    loading.value = false
  }
}

const handleRemoveReaction = async (item: any) => {
  if (removalLoadingId.value) return

  removalLoadingId.value = item.id
  const isCommentTarget = item.target_type === 'comment'
  let success = false
  let message = ''

  try {
    if (isCommentTarget) {
      const res = await store.reactToComment(item.target_id, item.type, item.incident_id || '')
      success = res.success
      message = res.message || ''
    } else {
      const res = await store.reactToIncident(item.target_id, item.type)
      success = res.success
      message = res.message || ''
    }

    if (success) {
      toast.showToast('success', 'Réaction retirée', 'Votre réaction a été supprimée avec succès.')
      await fetchData()
    } else {
      toast.showToast('error', 'Erreur', message || 'Impossible de retirer la réaction.')
    }
  } catch (err: any) {
    toast.showToast('error', 'Erreur', 'Une erreur est survenue.')
  } finally {
    removalLoadingId.value = null
  }
}

// Edit/Delete handlers for My Comments
const handleStartEdit = (item: any) => {
  editingComment.value = item
  editCommentContent.value = item.content
  showEditModal.value = true
}

const handleSaveEdit = async () => {
  if (!editCommentContent.value.trim() || !editingComment.value) return
  savingComment.value = true
  try {
    const res = await store.updateComment(editingComment.value.id, editCommentContent.value.trim(), editingComment.value.incident_id)
    if (res.success) {
      toast.showToast('success', 'Commentaire modifié', 'Votre commentaire a été mis à jour.')
      showEditModal.value = false
      await fetchData()
    } else {
      toast.showToast('error', 'Erreur', res.message || 'Impossible de modifier le commentaire.')
    }
  } finally {
    savingComment.value = false
  }
}

const handleConfirmDelete = (id: string) => {
  idToDelete.value = id
  showDeleteConfirm.value = true
}

const handleDeleteComment = async () => {
  if (!idToDelete.value) return
  deletingComment.value = true
  try {
    const res = await store.deleteComment(idToDelete.value)
    if (res.success) {
      toast.showToast('success', 'Commentaire supprimé', 'Le commentaire a été supprimé avec succès.')
      showDeleteConfirm.value = false
      await fetchData()
    } else {
      toast.showToast('error', 'Erreur', res.message || 'Impossible de supprimer le commentaire.')
    }
  } finally {
    deletingComment.value = false
    idToDelete.value = null
  }
}

// Reset reaction type if it's no longer available for the current target type or if target is comments
watch(targetType, (newTarget) => {
  if (newTarget === 'my_comments') {
    reactionType.value = ''
  } else if (newTarget === 'comment' && !['like', 'dislike'].includes(reactionType.value)) {
    reactionType.value = ''
  }
  fetchData()
})

watch(reactionType, fetchData)

onMounted(fetchData)

useHead({
  title: 'Mes réactions',
  meta: [
    { name: 'description', content: 'Historique de vos réactions sur la veille VigiTech.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
