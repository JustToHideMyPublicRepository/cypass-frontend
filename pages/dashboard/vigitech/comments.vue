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
          :editContent="editContent" @edit="startEdit(comment)" @cancel="cancelEdit" @save="saveEdit" />
      </div>
    </template>

    <!-- Empty State -->
    <MeVigitechCommentsEmpty v-else />
  </div>
</template>

<script setup lang="ts">
import { useVigitechStore } from '~/stores/vigitech'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'
import { getUserAvatarUrl } from '~/utils/user'

definePageMeta({
  layout: 'default'
})

const store = useVigitechStore()
const authStore = useAuthStore()
const toast = useToastStore()

const loading = ref(true)
const userComments = computed(() => store.userComments)
const userCommentsTotal = computed(() => store.userCommentsTotal)
const editingId = ref<string | null>(null)
const editContent = ref('')
const savingId = ref<string | null>(null)

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
    // Refresh to get updated data
    await store.fetchUserComments()
    editingId.value = null
    editContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  savingId.value = null
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
  title: 'Mes commentaires'
})
</script>
