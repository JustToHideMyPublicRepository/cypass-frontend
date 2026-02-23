<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink to="/dashboard/vigitech" class="p-2 rounded-xl hover:bg-ash/20 transition-colors text-hsa">
          <IconArrowLeft class="w-6 h-6" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight">Mes commentaires</h1>
          <p class="text-hsa font-bold">Historique de vos commentaires sur les incidents VigiTech</p>
        </div>
      </div>

      <div v-if="userComments.length"
        class="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
        {{ userComments.length }} commentaire{{ userComments.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiAppSkeleton v-for="i in 6" :key="i" height="160px" radius="2rem" />
    </div>

    <!-- Comments List -->
    <div v-else-if="userComments.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UiBaseCard v-for="comment in userComments" :key="comment.id" class="!rounded-[2rem] overflow-hidden">
        <div class="p-6 space-y-4">
          <!-- Comment content (prominent) -->
          <div v-if="editingId === comment.id" class="space-y-3">
            <textarea v-model="editContent" rows="3"
              class="w-full p-4 rounded-xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
            <button v-if="canEdit(comment)" @click="startEdit(comment)"
              class="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
              <IconEdit class="w-3 h-3" /> Modifier
            </button>
            <div class="flex gap-2 justify-end">
              <UiBaseButton variant="ghost" size="sm" @click="cancelEdit" class="!rounded-lg !text-[10px]">
                Annuler
              </UiBaseButton>
              <UiBaseButton variant="primary" size="sm" @click="saveEdit(comment)"
                :disabled="!editContent.trim() || saving" class="!rounded-lg !text-[10px]">
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </UiBaseButton>
            </div>
          </div>
          <p v-else class="text-BtW text-sm leading-relaxed font-medium">{{ comment.content }}</p>

          <!-- Footer: incident link + date + modifier -->
          <div class="flex items-center justify-between pt-3 border-t border-ash/30">
            <NuxtLink :to="`/vigitech/${comment.incident_id}`"
              class="flex items-center gap-1.5 text-[10px] text-primary hover:underline font-black truncate transition-colors max-w-[60%]">
              <IconExternalLink class="w-3 h-3 shrink-0" />
              {{ getIncidentTitle(comment.incident_id) }}
            </NuxtLink>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-[10px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
              <button v-if="canEdit(comment)" @click="startEdit(comment)"
                class="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
                <IconEdit class="w-3 h-3" /> Modifier
              </button>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20 px-6 glass-panel rounded-[2rem] border-2 border-dashed border-ash">
      <div class="w-16 h-16 bg-ash/10 rounded-2xl flex items-center justify-center text-hsa mx-auto mb-4">
        <IconMessage class="w-8 h-8 opacity-20" />
      </div>
      <h3 class="text-lg font-black text-BtW">Aucun commentaire</h3>
      <p class="text-hsa text-sm mt-2 max-w-sm mx-auto">
        Vous n'avez pas encore commenté d'incident. Rendez-vous sur la veille communautaire pour participer.
      </p>
      <NuxtLink to="/vigitech" class="inline-block mt-4">
        <UiBaseButton variant="primary" size="sm">Voir les incidents</UiBaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconExternalLink, IconEdit, IconArrowLeft } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'

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

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const getIncidentTitle = (incidentId: string) => {
  return incidentTitles.value[incidentId] || `Incident #${incidentId.substring(0, 8)}...`
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

const saveEdit = async (comment: Comment) => {
  if (!editContent.value.trim()) return
  saving.value = true
  const result = await store.updateComment(comment.id, editContent.value.trim(), comment.incident_id)
  if (result.success) {
    toast.showToast('success', 'Commentaire modifié', result.message || 'Votre commentaire a été mis à jour.')
    // Update local state
    const idx = userComments.value.findIndex(c => c.id === comment.id)
    if (idx !== -1) {
      userComments.value[idx] = { ...userComments.value[idx], content: editContent.value.trim() }
    }
    editingId.value = null
    editContent.value = ''
  } else {
    toast.showToast('error', 'Erreur', result.message || 'Impossible de modifier le commentaire.')
  }
  saving.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    // Fetch all public incidents to get comment data
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
        // Skip failed comment fetches
      }
    }

    // Also fetch user's own incidents
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
        // Skip failed comment fetches
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
  title: 'Mes commentaires - VigiTech'
})
</script>
