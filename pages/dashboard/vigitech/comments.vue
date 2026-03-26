<template>
  <div class="space-y-6">
    <MeVigitechCommentsHeader :userCommentsTotal="userComments.length" />

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiAppSkeleton v-for="i in 6" :key="i" height="160px" radius="2rem" />
    </div>

    <!-- Comments Grid -->
    <template v-else-if="userComments.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MeVigitechCommentsItem v-for="comment in userComments" :key="comment.id" :comment="comment"
          :incidentTitle="comment.incident_title || getIncidentTitle(comment.incident_id)"
          :avatarUrl="getCommentAvatar(comment)" :formattedDate="formatDate(comment.created_at)"
          :canEdit="canEdit(comment)" :isEditing="editingId === comment.id" :saving="savingId === comment.id"
          :editContent="editContent" @edit="startEdit(comment)" @cancel="cancelEdit" @save="saveEdit"
          @delete="confirmDelete" @show-detail="openDetail" />
      </div>

      <!-- Load More Button -->
      <div v-if="commentsPagination.hasMore" class="pt-8 flex justify-center">
        <UiBaseButton variant="ghost" size="lg" @click="handleLoadMore" :loading="loadingMore"
          class="!rounded-[2rem] !px-10 !py-4 text-xs font-black uppercase tracking-[0.2em] bg-ash/5 hover:bg-ash/10 text-hsa hover:text-primary border border-ash/30 transition-all shadow-lg hover:shadow-primary/5">
          <IconChevronDown class="w-4 h-4 mr-2" />
          {{ loadingMore ? 'Chargement...' : 'Voir plus de commentaires' }}
        </UiBaseButton>
      </div>
    </template>

    <!-- Empty State -->
    <MeVigitechCommentsEmpty v-else />

    <UiConfirmModal :show="showDeleteConfirm" title="Supprimer le commentaire"
      message="Êtes-vous sûr de vouloir supprimer ce commentaire ?" confirm-text="Supprimer" :loading="deleting"
      variant="danger" @cancel="showDeleteConfirm = false" @confirm="handleDelete" />

    <!-- Detailed Comment Modal -->
    <ModalVigitechCommentDetail :show="showDetailModal" :comment="selectedComment" @close="closeDetail" />
  </div>
</template>

<script setup lang="ts">
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { usePublicVigitechStore } from '~/stores/back/public/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'
import { getUserAvatarUrl } from '~/utils/user'
import { IconChevronDown } from '@tabler/icons-vue'

const store = useUserVigitechStore()
const publicStore = usePublicVigitechStore()
const authStore = useAuthStore()
const toast = useToastStore()

const loading = ref(true)
const loadingMore = ref(false)
const userComments = computed(() => store.userComments)
const userCommentsTotal = computed(() => store.userCommentsTotal)
const commentsPagination = computed(() => store.userCommentsPagination)

const editingId = ref<string | null>(null)
const editContent = ref('')
const savingId = ref<string | null>(null)

// Detail Modal State
const showDetailModal = ref(false)
const selectedComment = ref<Comment | null>(null)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const getCommentAvatar = (_cm: Comment) => {
  // The user comments API doesn't return avatar_url, use the connected user's profile
  return getUserAvatarUrl(authStore.user?.avatar_url, authStore.user?.first_name, authStore.user?.last_name)
}

const getIncidentTitle = (incidentId: string) => {
  return `Incident #${incidentId.substring(0, 8)}…`
}

const canEdit = (comment: Comment) => {
  const createdAt = new Date(comment.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
}

const startEdit = (comment: Comment) => {
  editingId.value = comment.id
  editContent.value = comment.content
}

const cancelEdit = () => {
  editingId.value = null
  editContent.value = ''
}

const saveEdit = async (val?: any) => {
  const contentToSave = typeof val === 'string' ? val : editContent.value
  if (!contentToSave.trim() || !editingId.value) return

  savingId.value = editingId.value

  const comment = userComments.value.find(c => c.id === editingId.value)
  if (!comment) return

  const result = await store.updateComment(editingId.value, contentToSave.trim(), comment.incident_id)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    // Update local content without full refresh to preserve pagination
    comment.content = contentToSave.trim()
    editingId.value = null
    editContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  savingId.value = null
}

const handleLoadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  await store.fetchUserComments(true)
  loadingMore.value = false
}

const openDetail = async (id: string) => {
  showDetailModal.value = true
  selectedComment.value = null // Show skeleton
  const res = await store.fetchCommentById(id)
  if (res.success) {
    selectedComment.value = res.data
  } else {
    toast.showToast('error', 'Erreur', 'Impossible de charger les détails du commentaire.')
    showDetailModal.value = false
  }
}

const closeDetail = () => {
  showDetailModal.value = false
  setTimeout(() => {
    selectedComment.value = null
  }, 300)
}

const showDeleteConfirm = ref(false)
const deleting = ref(false)
const idToDelete = ref<string | null>(null)

const confirmDelete = (id: string) => {
  idToDelete.value = id
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (!idToDelete.value) return
  deleting.value = true
  const result = await store.deleteComment(idToDelete.value)
  if (result.success) {
    toast.showToast('success', 'Commentaire supprimé', result.message || 'Le commentaire a été supprimé.')
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de supprimer le commentaire.')
  }
  deleting.value = false
  showDeleteConfirm.value = false
  idToDelete.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchUserComments()
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Mes commentaires',
  meta: [
    { name: 'description', content: 'Historique de vos participations et commentaires sur la veille VigiTech.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
