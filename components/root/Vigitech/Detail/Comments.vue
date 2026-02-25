<template>
  <div class="glass-panel p-8 md:p-10 rounded-[3rem] border border-ashAct space-y-6 shadow-lg">
    <button @click="showComments = !showComments"
      class="w-full flex items-center justify-between hover:text-primary transition-colors">
      <h3 class="text-xs font-black text-hsa uppercase tracking-[0.3em] flex items-center gap-2">
        <IconMessage class="w-4 h-4 text-primary" /> Commentaires
        <span v-if="commentsCount || comments.length"
          class="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
          {{ commentsCount ?? comments.length }}
        </span>
      </h3>
      <component :is="showComments ? IconChevronUp : IconChevronDown" class="w-4 h-4 text-hsa" />
    </button>

    <template v-if="showComments">
      <!-- Add Comment Form (authenticated only) -->
      <div v-if="authStore.user" class="space-y-3">
        <textarea v-model="newComment" rows="3" placeholder="Ajouter un commentaire..."
          class="w-full p-4 rounded-2xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all placeholder-hsa/50 resize-none" />
        <div class="flex justify-end">
          <UiBaseButton variant="primary" size="sm" @click="handleAddComment"
            :disabled="!newComment.trim() || submittingComment"
            class="!rounded-xl text-[10px] font-black uppercase tracking-widest">
            <IconSend class="w-3.5 h-3.5 mr-1.5" />
            {{ submittingComment ? 'Envoi...' : 'Commenter' }}
          </UiBaseButton>
        </div>
      </div>
      <div v-else class="p-4 rounded-2xl bg-ash/5 border border-ash/30 text-center">
        <p class="text-xs text-hsa font-bold">
          <NuxtLink to="/auth/login" class="text-primary hover:underline">Connectez-vous</NuxtLink>
          pour laisser un commentaire.
        </p>
      </div>

      <div class="h-px bg-ashAct/40"></div>

      <!-- Comments List -->
      <div v-if="loading" class="space-y-4">
        <UiAppSkeleton v-for="i in 3" :key="i" height="80px" radius="1.5rem" />
      </div>

      <div v-else-if="commentsCount || comments.length" class="space-y-4">
        <div v-for="comment in comments" :key="comment.id"
          class="p-5 rounded-2xl bg-ash/5 border border-ash/30 space-y-2 hover:border-ash/50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
                <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
              </div>
              <NuxtLink :to="`/user/${comment.user_id}`"
                class="text-xs font-black text-BtW hover:text-primary hover:underline transition-colors">
                {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
              </NuxtLink>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
              <!-- Edit button: own comment + within 24h -->
              <button v-if="canEditComment(comment)" @click="startEditComment(comment)"
                class="p-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors"
                title="Modifier le commentaire">
                <IconEdit class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <!-- Inline edit mode -->
          <div v-if="editingCommentId === comment.id" class="pl-9 space-y-2">
            <textarea v-model="editCommentContent" rows="2"
              class="w-full p-3 rounded-xl bg-WtB border border-ash/50 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
            <div class="flex gap-2 justify-end">
              <UiBaseButton variant="ghost" size="sm" @click="cancelEditComment" class="!rounded-lg !text-[10px]">
                Annuler
              </UiBaseButton>
              <UiBaseButton variant="primary" size="sm" @click="saveEditComment(comment)"
                :disabled="!editCommentContent.trim() || savingComment" class="!rounded-lg !text-[10px]">
                {{ savingComment ? 'Enregistrement...' : 'Enregistrer' }}
              </UiBaseButton>
            </div>
          </div>
          <p v-else class="text-sm text-BtW leading-relaxed pl-9">{{ comment.content }}</p>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <IconMessage class="w-8 h-8 text-hsa/20 mx-auto mb-2" />
        <p class="text-xs text-hsa font-bold">Aucun commentaire pour le moment.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconChevronUp, IconChevronDown, IconSend, IconEdit } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuthStore } from '~/stores/auth'
import { useVigitechStore } from '~/stores/vigitech'
import { useToastStore } from '~/stores/toast'
import { useVigiPrefStore } from '~/stores/vigiPref'
import { getUserAvatarUrl } from '~/utils/user'

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

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const canEditComment = (comment: any) => {
  if (!authStore.user || comment.user_id !== authStore.user.id) return false
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
