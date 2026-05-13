<template>
  <div class="group/reply relative flex gap-3">
    <div class="shrink-0">
      <div class="w-8 h-8 rounded-xl overflow-hidden border border-WtB shadow-sm bg-ash/20">
        <img :src="getAvatar(reply)" class="w-full h-full object-cover" />
      </div>
    </div>
    <div class="flex-1 min-w-0 space-y-1">
      <div class="flex items-center justify-between gap-2">
        <NuxtLink :to="`/user/${reply.user_id}`"
          class="text-xs font-black text-BtW hover:text-primary transition-colors flex items-center gap-1 truncate">
          {{ [reply.first_name, reply.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
        </NuxtLink>

        <!-- Reply Actions -->
        <div
          class="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover/reply:opacity-100 transition-opacity">
          <button v-if="canEdit" @click="$emit('edit')"
            class="p-1 rounded bg-WtB border border-ash/30 hover:bg-primary/10 hover:text-primary text-hsa"
            title="Modifier">
            <IconEdit class="w-3 h-3" />
          </button>
          <button v-if="isOwner" @click="$emit('delete')"
            class="p-1 rounded bg-WtB border border-ash/30 hover:bg-danger/10 hover:text-danger text-hsa"
            title="Supprimer">
            <IconTrash class="w-3 h-3" />
          </button>
        </div>
      </div>

      <p class="text-[9px] text-hsa font-bold uppercase tracking-tighter opacity-70">
        {{ formatDate(reply.created_at) }}
      </p>

      <!-- Reply Inline Edit -->
      <div v-if="isEditing" class="mt-2 space-y-2">
        <textarea :value="editContent" @input="$emit('update:editContent', ($event.target as HTMLTextAreaElement).value)" 
          rows="2" maxlength="500"
          class="w-full p-2.5 rounded-xl bg-WtB border border-ash/50 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all resize-none shadow-inner" />
        <div class="flex gap-2 justify-end">
          <UiBaseButton variant="ghost" size="sm" @click="$emit('cancel-edit')"
            class="!px-2 !py-1 !rounded-lg !text-[9px]">Annuler</UiBaseButton>
          <UiBaseButton variant="primary" size="sm" @click="$emit('save-edit')"
            :disabled="!editContent.trim() || saving"
            class="!px-2 !py-1 !rounded-lg !text-[9px]">
            Enregistrer</UiBaseButton>
        </div>
      </div>
      <div v-else class="space-y-2">
        <p class="text-xs text-BtW/80 leading-relaxed whitespace-pre-wrap break-words">{{ reply.content }}
        </p>
        <!-- Reply Reactions -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 bg-ash/5 rounded-xl w-fit px-1 py-0.5">
            <button @click="$emit('react', 'like')"
              :disabled="reactingToId === reply.id"
              class="p-1 rounded-lg flex items-center gap-1.5 transition-all min-w-[28px] justify-center"
              :class="[hasMyReaction('like') ? 'text-success bg-success/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === reply.id && reactingType !== 'like' }]">
              <UiLogoLoader v-if="reactingToId === reply.id && reactingType === 'like'" size="xs"
                color="currentColor" />
              <IconThumbUp v-else class="w-3 h-3"
                :class="{ 'fill-current': hasMyReaction('like') }" />
              <span v-show="getReactionCount('like') > 0" class="text-[9px] font-black">{{
                getReactionCount('like') }}</span>
            </button>
            <div class="w-px h-2 bg-ash/20"></div>
            <button @click="$emit('react', 'dislike')"
              :disabled="reactingToId === reply.id"
              class="p-1 rounded-lg flex items-center gap-1.5 transition-all min-w-[28px] justify-center"
              :class="[hasMyReaction('dislike') ? 'text-danger bg-danger/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === reply.id && reactingType !== 'dislike' }]">
              <UiLogoLoader v-if="reactingToId === reply.id && reactingType === 'dislike'" size="xs"
                color="currentColor" />
              <IconThumbDown v-else class="w-3 h-3"
                :class="{ 'fill-current': hasMyReaction('dislike') }" />
              <span v-show="getReactionCount('dislike') > 0" class="text-[9px] font-black">{{
                getReactionCount('dislike') }}</span>
            </button>
          </div>
          <button v-if="reply.reactions_count && reply.reactions_count > 0"
            @click="$emit('show-reactions')"
            class="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
            title="Voir qui...">
            <IconMoodHeart class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconTrash, IconThumbUp, IconThumbDown, IconMoodHeart } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'

const props = defineProps<{
  reply: Comment
  isOwner: boolean
  canEdit: boolean
  isEditing: boolean
  editContent: string
  saving: boolean
  reactingToId: string | null
  reactingType: string | null
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'update:editContent', value: string): void
  (e: 'cancel-edit'): void
  (e: 'save-edit'): void
  (e: 'react', type: 'like' | 'dislike'): void
  (e: 'show-reactions'): void
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
  if (!authStore.user || !props.reply.reactions_details) return false
  return props.reply.reactions_details.some(r => r.user_id === authStore.user?.id && r.type === type)
}

const getReactionCount = (type: string) => {
  if (!props.reply.reactions_summary) return 0
  return (props.reply.reactions_summary as any)[type] || 0
}
</script>
