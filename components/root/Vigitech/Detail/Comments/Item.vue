<template>
  <div
    class="group/item relative flex gap-4 md:gap-6 bg-transparent p-4 rounded-[2.5rem] transition-all duration-500 hover:bg-ash/5">
    <!-- Avatar Column -->
    <div class="shrink-0 pt-1">
      <div
        class="w-10 h-10 md:w-12 md:h-12 rounded-2xl overflow-hidden border-2 border-WtB shadow-lg bg-ash/20 group-hover/item:rotate-3 transition-transform duration-500">
        <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Content Column -->
    <div class="flex-1 min-w-0 space-y-3">
      <div class="flex items-center justify-between gap-4">
        <div class="min-w-0">
          <NuxtLink :to="`/user/${comment.user_id}`"
            class="text-sm font-black text-BtW hover:text-primary transition-colors flex items-center gap-1.5 truncate">
            {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
          </NuxtLink>
          <p class="text-[10px] text-hsa font-bold uppercase tracking-tighter opacity-70 flex items-center gap-2">
            {{ formatDate(comment.created_at) }}
            <span v-if="comment.organization_name"
              class="hidden sm:inline bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              {{ comment.organization_name }}</span>
          </p>
        </div>

        <!-- Actions (Hover only) -->
        <div
          class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 sm:translate-x-2 sm:group-hover/item:translate-x-0 transition-all duration-300">
          <button v-if="canEdit" @click="$emit('edit', comment)"
            class="p-2 rounded-xl bg-WtB border border-ash/30 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
            title="Modifier">
            <IconEdit class="w-4 h-4" />
          </button>
          <button v-if="isOwner" @click="$emit('delete', comment.id)"
            class="p-2 rounded-xl bg-WtB border border-ash/30 hover:bg-danger/10 hover:text-danger transition-all active:scale-90"
            title="Supprimer">
            <IconTrash class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Inline edit mode -->
      <div v-if="isEditing" class="space-y-3">
        <div class="relative">
          <textarea :value="editContent"
            @input="$emit('update:editContent', ($event.target as HTMLTextAreaElement).value)" rows="3" maxlength="1000"
            class="w-full p-4 pb-8 rounded-2xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner" />
          <div class="absolute bottom-2 right-4 text-[9px] font-black tracking-widest"
            :class="editContent.length > 900 ? (editContent.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
            {{ editContent.length }} / 1000
          </div>
        </div>
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel-edit')" class="!rounded-xl !text-[10px]">
            Annuler</UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save-edit', comment)"
            :disabled="!editContent.trim() || saving" class="!rounded-xl !text-[10px]">
            {{ saving ? 'Envoi...' : 'Enregistrer' }}
          </UiBaseButton>
        </div>
      </div>
      <!-- Normal content display -->
      <div v-else class="relative space-y-2">
        <p class="text-sm text-BtW/90 leading-relaxed break-words whitespace-pre-wrap">{{
          (comment.content.length > 200 && !expanded) ?
            comment.content.slice(0, 200) + '...' : comment.content }}</p>
        <button v-if="comment.content.length > 200" @click="$emit('toggle-expand')"
          class="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 mt-1 flex items-center gap-1 transition-colors">
          <component :is="expanded ? IconChevronUp : IconChevronDown" class="w-3 h-3" />
          {{ expanded ? 'Réduire' : 'Lire plus' }}
        </button>
      </div> <!-- Reply Action Row -->
      <div class="flex items-center gap-4 pt-1">
        <!-- Reactions -->
        <div class="flex items-center gap-1 bg-ash/5 rounded-xl px-1 py-0.5">
          <button @click="$emit('react', 'like', comment.id)" :disabled="reactingToId === comment.id"
            class="p-1.5 rounded-lg flex items-center gap-1.5 transition-all min-w-[32px] justify-center"
            :class="[hasMyReaction('like') ? 'text-success bg-success/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === comment.id && reactingType !== 'like' }]">
            <UiLogoLoader v-if="reactingToId === comment.id && reactingType === 'like'" size="xs"
              color="currentColor" />
            <IconThumbUp v-else class="w-3.5 h-3.5" :class="{ 'fill-current': hasMyReaction('like') }" />
            <span v-show="getReactionCount('like') > 0" class="text-[10px] font-black">{{
              getReactionCount('like') }}</span>
          </button>
          <div class="w-px h-3 bg-ash/20"></div>
          <button @click="$emit('react', 'dislike', comment.id)" :disabled="reactingToId === comment.id"
            class="p-1.5 rounded-lg flex items-center gap-1.5 transition-all min-w-[32px] justify-center"
            :class="[hasMyReaction('dislike') ? 'text-danger bg-danger/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === comment.id && reactingType !== 'dislike' }]">
            <UiLogoLoader v-if="reactingToId === comment.id && reactingType === 'dislike'" size="xs"
              color="currentColor" />
            <IconThumbDown v-else class="w-3.5 h-3.5" :class="{ 'fill-current': hasMyReaction('dislike') }" />
            <span v-show="getReactionCount('dislike') > 0" class="text-[10px] font-black">{{
              getReactionCount('dislike') }}</span>
          </button>
        </div>

        <button v-if="comment.reactions_count && comment.reactions_count > 0" @click="$emit('show-reactions', comment)"
          class="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors" title="Voir qui...">
          <IconMoodHeart class="w-4 h-4" />
        </button>

        <div class="w-px h-3 bg-ash/30"></div>

        <button v-if="user" @click="$emit('start-reply')"
          class="text-[11px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors flex items-center gap-1">
          <IconCornerUpLeft class="w-3.5 h-3.5" />
          Répondre
        </button>
        <button v-if="comment.replies_count && comment.replies_count > 0" @click="$emit('toggle-replies')"
          class="text-[11px] font-black tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <IconMessageCircle class="w-3.5 h-3.5" />
          {{ showReplies ? 'Masquer' : 'Voir' }}
          {{ comment.replies_count === 1 ? 'la réponse' : `les ${comment.replies_count} réponses` }}
          <IconLoader2 v-if="loadingReplies" class="w-3 h-3 animate-spin ml-1" />
        </button>
      </div>

      <!-- Reply Input Box -->
      <div v-if="isReplying" class="mt-4 flex gap-3">
        <textarea :value="replyContent"
          @input="$emit('update:replyContent', ($event.target as HTMLTextAreaElement).value)" rows="2" maxlength="500"
          placeholder="Écrire une réponse..."
          class="flex-1 p-3 rounded-xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-sm"></textarea>
        <div class="flex flex-col gap-2 justify-end">
          <UiBaseButton variant="primary" size="sm" @click="$emit('send-reply')"
            :disabled="!replyContent.trim() || sendingReply" class="!px-3 !py-2 !rounded-xl">
            <UiLogoLoader v-if="sendingReply" size="xs" color="currentColor" />
            <IconSend v-else class="w-4 h-4" />
          </UiBaseButton>
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel-reply')"
            class="!px-3 !py-2 !rounded-xl text-hsa">
            <IconX class="w-4 h-4" />
          </UiBaseButton>
        </div>
      </div>

      <!-- Replies List -->
      <div v-if="showReplies && comment.replies?.length" class="mt-4 space-y-4 border-l-2 border-hsa pl-4">
        <RootVigitechDetailCommentsReplyItem v-for="reply in comment.replies" :key="reply.id" :reply="reply"
          :is-owner="isOwner(reply)" :can-edit="canEditComment(reply)" :is-editing="editingCommentId === reply.id"
          :edit-content="editCommentContent" @update:edit-content="$emit('update:editContent', $event)"
          :saving="savingComment" :reacting-to-id="reactingToId" :reacting-type="reactingType"
          @edit="$emit('edit', reply)" @delete="$emit('delete', reply.id, comment.id)"
          @cancel-edit="$emit('cancel-edit')" @save-edit="$emit('save-edit', reply, comment.id)"
          @react="(type) => $emit('react', type, reply.id, comment.id)"
          @show-reactions="$emit('show-reactions', reply)" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconTrash, IconChevronUp, IconChevronDown, IconThumbUp, IconThumbDown, IconMoodHeart, IconCornerUpLeft, IconMessageCircle, IconLoader2, IconSend, IconX } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'

const props = defineProps<{
  comment: Comment
  isOwner: boolean
  canEdit: boolean
  isEditing: boolean
  editContent: string
  saving: boolean
  expanded: boolean
  reactingToId: string | null
  reactingType: string | null
  showReplies: boolean
  loadingReplies: boolean
  user: any
  isReplying: boolean
  replyContent: string
  sendingReply: boolean
  editingCommentId: string | null
  editCommentContent: string
  savingComment: boolean
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'update:editContent', value: string): void
  (e: 'update:replyContent', value: string): void
  (e: 'edit', comment: Comment): void
  (e: 'delete', id: string, parentId?: string): void
  (e: 'cancel-edit'): void
  (e: 'save-edit', comment: Comment, parentId?: string): void
  (e: 'toggle-expand'): void
  (e: 'react', type: 'like' | 'dislike', targetId: string, parentId?: string): void
  (e: 'show-reactions', target: Comment): void
  (e: 'start-reply'): void
  (e: 'send-reply'): void
  (e: 'cancel-reply'): void
  (e: 'toggle-replies'): void
}>()

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch {
    return ''
  }
}

const hasMyReaction = (type: string) => {
  if (!authStore.user || !props.comment.reactions_details) return false
  return props.comment.reactions_details.some(r => r.user_id === authStore.user?.id && r.type === type)
}

const getReactionCount = (type: string) => {
  if (!props.comment.reactions_summary) return 0
  return (props.comment.reactions_summary as any)[type] || 0
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
</script>
