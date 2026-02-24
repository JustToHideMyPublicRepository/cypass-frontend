<template>
  <div class="space-y-6">
    <MeVigitechCommentsHeader :count="userComments.length" />

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiAppSkeleton v-for="i in 6" :key="i" height="160px" radius="2rem" />
    </div>

    <template v-else-if="userComments.length">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MeVigitechCommentsItem v-for="comment in userComments" :key="comment.id" :comment="comment"
          :incidentTitle="getIncidentTitle(comment.incident_id)" :avatarUrl="getCommentAvatar(comment)"
          :formattedDate="formatDate(comment.created_at)" :canEdit="canEdit(comment)"
          :isEditing="editingId === comment.id" :saving="savingId === comment.id" :editContent="editContent"
          @edit="startEdit(comment)" @cancel="cancelEdit" @save="saveEdit" />
      </div>
    </template>

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
const userComments = ref<Comment[]>([])
const incidentTitles = ref<Record<string, string>>({})
const editingId = ref<string | null>(null)
const editContent = ref('')
const saving = ref(false)
const savingId = ref<string | null>(null)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const getCommentAvatar = (cm: Comment) => {
  return getUserAvatarUrl(cm.avatar_url, cm.first_name, cm.last_name)
}

const getIncidentTitle = (incidentId: string) => {
  const title = incidentTitles.value[incidentId]
  if (!title) return `Incident #${incidentId.substring(0, 8)}...`
  return title.length > 30 ? title.substring(0, 30) + '...' : title
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

  saving.value = true
  savingId.value = editingId.value

  // Find the incident_id for the current editing comment
  const comment = userComments.value.find(c => c.id === editingId.value)
  if (!comment) return

  const result = await store.updateComment(editingId.value, contentToSave.trim(), comment.incident_id)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    const idx = userComments.value.findIndex(c => c.id === editingId.value)
    if (idx !== -1) {
      userComments.value[idx] = { ...userComments.value[idx], content: contentToSave.trim() }
    }
    editingId.value = null
    editContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  saving.value = false
  savingId.value = null
}

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchPublicIncidents({ limit: 100, offset: 0 })

    // Collect all comments from user's incidents
    const allComments: Comment[] = []
    const userId = authStore.user?.id

    // Fetch comments for each incident the user might have commented on
    for (const incident of store.publicIncidents) {
      incidentTitles.value[incident.id] = incident.title
      try {
        const response: any = await $fetch('/api/vigitech/comments', {
          params: { incident_id: incident.id }
        })
        if (response.success && response.data) {
          const myComments = response.data.filter((c: Comment) => c.user_id === userId)
          allComments.push(...myComments)
        }
      } catch {
      }
    }

    if (store.userIncidents.length === 0) {
      await store.fetchUserIncidents()
    }
    for (const incident of store.userIncidents) {
      if (!incidentTitles.value[incident.id]) {
        incidentTitles.value[incident.id] = incident.title
      }
      try {
        const response: any = await $fetch('/api/vigitech/comments', {
          params: { incident_id: incident.id }
        })
        if (response.success && response.data) {
          const myComments = response.data.filter(
            (c: Comment) => c.user_id === userId && !allComments.some(existing => existing.id === c.id)
          )
          allComments.push(...myComments)
        }
      } catch {
      }
    }

    // Sort by most recent first
    allComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    userComments.value = allComments
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Mes commentaires'
})
</script>
