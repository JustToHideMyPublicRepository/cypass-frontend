<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <div class="shrink-0 w-4 h-4 rounded-full overflow-hidden bg-ash/10 border border-ash/20">
          <img :src="getAvatar(reply)" class="w-full h-full object-cover text-[4px]" />
        </div>
        <NuxtLink :to="`/user/${reply.user_id}`"
          class="text-[9px] font-black text-BtW truncate hover:text-primary transition-colors">
          {{ [reply.first_name, reply.last_name].filter(Boolean).join(' ') }}
        </NuxtLink>
      </div>
      <span class="text-[8px] text-hsa font-bold shrink-0">{{ formatDate(reply.created_at) }}</span>
    </div>
    <p class="text-[11px] text-BtW/80 leading-relaxed break-words">{{ reply.content }}</p>

    <!-- Reply Reactions -->
    <div class="flex items-center gap-2 mt-1">
      <div class="flex items-center gap-1 bg-ash/5 rounded-lg w-fit px-1 py-0.5">
        <button @click="$emit('react', 'like')" :disabled="reactingToId === reply.id"
          class="p-1 rounded-md flex items-center gap-1.5 transition-all min-w-[28px] justify-center"
          :class="[hasMyReaction('like') ? 'text-success bg-success/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === reply.id && reactingType !== 'like' }]">
          <UiLogoLoader v-if="reactingToId === reply.id && reactingType === 'like'" size="xs" color="currentColor" />
          <IconThumbUp v-else class="w-2.5 h-2.5" :class="{ 'fill-current': hasMyReaction('like') }" />
          <span v-show="getReactionCount('like') > 0" class="text-[8px] font-black">
            {{ getReactionCount('like') }}
          </span>
        </button>
        <div class="w-px h-2 bg-ash/20"></div>
        <button @click="$emit('react', 'dislike')" :disabled="reactingToId === reply.id"
          class="p-1 rounded-md flex items-center gap-1.5 transition-all min-w-[28px] justify-center"
          :class="[hasMyReaction('dislike') ? 'text-danger bg-danger/10' : 'text-hsa hover:bg-ash/10 hover:text-BtW', { 'opacity-40 grayscale': reactingToId === reply.id && reactingType !== 'dislike' }]">
          <UiLogoLoader v-if="reactingToId === reply.id && reactingType === 'dislike'" size="xs" color="currentColor" />
          <IconThumbDown v-else class="w-2.5 h-2.5" :class="{ 'fill-current': hasMyReaction('dislike') }" />
          <span v-show="getReactionCount('dislike') > 0" class="text-[8px] font-black">
            {{ getReactionCount('dislike') }}
          </span>
        </button>
      </div>
      <button v-if="reply.reactions_count && reply.reactions_count > 0" @click="$emit('show-reactions')"
        class="p-1 rounded-lg text-primary hover:bg-primary/10 transition-colors" title="Voir les réactions">
        <IconMoodHeart class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconThumbUp, IconThumbDown, IconMoodHeart } from '@tabler/icons-vue'
import { getUserAvatarUrl } from '~/utils/user'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Comment } from '~/types/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'

const props = defineProps<{
  reply: Comment
  reactingToId: string | null
  reactingType: string | null
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'react', type: 'like' | 'dislike'): void
  (e: 'show-reactions'): void
}>()

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
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
