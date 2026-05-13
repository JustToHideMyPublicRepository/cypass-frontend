<template>
  <div class="p-4 rounded-xl bg-ash/5 border border-ash/30 space-y-1.5 hover:border-ash/50 transition-colors">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <div class="shrink-0 w-6 h-6 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
          <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
        </div>
        <NuxtLink :to="`/user/${comment.user_id}`"
          class="text-[11px] font-black text-BtW hover:text-primary hover:underline transition-colors truncate">
          {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[9px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
        <button v-if="canEdit" @click="$emit('edit')"
          class="p-1 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors" title="Modifier">
          <IconEdit class="w-3 h-3" />
        </button>
        <button v-if="isOwner" @click="$emit('delete')"
          class="p-1 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors" title="Supprimer">
          <IconTrash class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Inline Edit -->
    <div v-if="isEditing" class="pl-8 space-y-2">
      <div class="relative">
        <textarea :value="editContent"
          @input="$emit('update:editContent', ($event.target as HTMLTextAreaElement).value)" rows="2" maxlength="1000"
          class="w-full p-3 pb-8 rounded-xl bg-WtB border border-ash/50 text-xs font-medium outline-none focus:ring-2 focus:ring-primary transition-all resize-none" />
        <div class="absolute bottom-2 right-3 text-[8px] font-black tracking-widest"
          :class="editContent.length > 900 ? (editContent.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
          {{ editContent.length }} / 1000
        </div>
      </div>
      <div class="flex gap-2 justify-end">
        <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel-edit')" class="!rounded-lg !text-[9px]">
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="primary" size="sm" @click="$emit('save-edit')" :disabled="!editContent.trim() || saving"
          class="!rounded-lg !text-[9px]">
          {{ saving ? 'Envoi...' : 'Enregistrer' }}
        </UiBaseButton>
      </div>
    </div>
    <div v-else class="pl-8 space-y-2">
      <p class="text-xs text-BtW leading-relaxed break-words">
        {{ (comment.content.length > 200 && !expanded) ?
          comment.content.slice(0, 200) + '...' : comment.content }}
      </p>
      <button v-if="comment.content.length > 200" @click="$emit('toggle-expand')"
        class="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
        <component :is="expanded ? IconChevronUp : IconChevronDown" class="w-3 h-3" />
        {{ expanded ? 'Réduire' : 'Lire plus' }}
      </button>

      <!-- Reactions & Replies Action Row -->
      <div class="flex items-center gap-4 pt-1">
        <!-- Reactions -->
        <div class="flex items-center gap-1 bg-ash/5 rounded-lg px-1 py-0.5">
          <button @click="$emit('react', 'like', comment.id)" :disabled="reactingToId === comment.id"
            class="p-1 rounded-md flex items-center gap-1.5 transition-all min-w-[30px] justify-center"
            :class="[hasMyReaction('like') ? 'text-success bg-success/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === comment.id && reactingType !== 'like' }]">
            <UiLogoLoader v-if="reactingToId === comment.id && reactingType === 'like'" size="xs"
              color="currentColor" />
            <IconThumbUp v-else class="w-3 h-3" :class="{ 'fill-current': hasMyReaction('like') }" />
            <span v-show="getReactionCount('like') > 0" class="text-[8px] font-black">{{
              getReactionCount('like') }}</span>
          </button>
          <div class="w-px h-2 bg-ash/20"></div>
          <button @click="$emit('react', 'dislike', comment.id)" :disabled="reactingToId === comment.id"
            class="p-1 rounded-md flex items-center gap-1.5 transition-all min-w-[30px] justify-center"
            :class="[hasMyReaction('dislike') ? 'text-danger bg-danger/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === comment.id && reactingType !== 'dislike' }]">
            <UiLogoLoader v-if="reactingToId === comment.id && reactingType === 'dislike'" size="xs"
              color="currentColor" />
            <IconThumbDown v-else class="w-3 h-3" :class="{ 'fill-current': hasMyReaction('dislike') }" />
            <span v-show="getReactionCount('dislike') > 0" class="text-[8px] font-black">{{
              getReactionCount('dislike') }}</span>
          </button>
        </div>

        <button v-if="comment.reactions_count && comment.reactions_count > 0" @click="$emit('show-reactions', comment)"
          class="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors" title="Voir les réactions">
          <IconMoodHeart class="w-4 h-4" />
        </button>

        <div class="w-px h-3 bg-ash/30"></div>

        <!-- Replies Action -->
        <div v-if="comment.replies_count && comment.replies_count > 0">
          <button @click="$emit('toggle-replies')"
            class="text-[10px] font-black text-primary hover:text-primary/80 transition-all flex items-center gap-1.5">
            <IconMessageCircle class="w-3.5 h-3.5" />
            {{ showReplies ? 'Masquer' : 'Voir' }}
            {{ comment.replies_count === 1 ? 'la réponse' : `${comment.replies_count} réponses` }}
            <UiLogoLoader v-if="loadingReplies" size="xs" color="currentColor" class="ml-1" />
          </button>
        </div>
      </div>

      <!-- Replies List -->
      <div v-if="showReplies && comment.replies?.length" class="mt-3 space-y-3 border-l-2 border-ash pl-4">
        <meVigitechDetailCommentsReplyItem v-for="reply in comment.replies" :key="reply.id" :reply="reply"
          :reacting-to-id="reactingToId" :reacting-type="reactingType" @react="$emit('react', $event, reply.id, comment.id)"
          @show-reactions="$emit('show-reactions', reply)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconTrash, IconChevronUp, IconChevronDown, IconThumbUp, IconThumbDown, IconMoodHeart, IconMessageCircle } from '@tabler/icons-vue'
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
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'cancel-edit'): void
  (e: 'save-edit'): void
  (e: 'update:editContent', value: string): void
  (e: 'toggle-expand'): void
  (e: 'react', type: 'like' | 'dislike', targetId: string, parentId?: string): void
  (e: 'show-reactions', target: Comment): void
  (e: 'toggle-replies'): void
}>()

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}

const hasMyReaction = (type: string) => {
  if (!authStore.user || !props.comment.reactions_details) return false
  return props.comment.reactions_details.some(r => r.user_id === authStore.user?.id && r.type === type)
}

const getReactionCount = (type: string) => {
  if (!props.comment.reactions_summary) return 0
  return (props.comment.reactions_summary as any)[type] || 0
}
</script>
