<template>
  <div v-if="comments.length" class="space-y-6">
    <div v-for="comment in comments" :key="comment.id">
      <RootVigitechDetailCommentsItem :comment="comment" :is-owner="checkIsOwner(comment)"
        :can-edit="checkCanEdit(comment)" :is-editing="editingCommentId === comment.id"
        :edit-content="editContent" @update:edit-content="$emit('update:editContent', $event)"
        :saving="savingComment" :expanded="!!expandedComments[comment.id]" :reacting-to-id="reactingToId"
        :reacting-type="reactingType" :show-replies="!!showReplies[comment.id]"
        :loading-replies="!!loadingReplies[comment.id]" :user="user" :is-replying="replyingToId === comment.id"
        :reply-content="replyContent" @update:reply-content="$emit('update:replyContent', $event)"
        :sending-reply="sendingReply" :editing-comment-id="editingCommentId" :edit-comment-content="editContent"
        :saving-comment="savingComment" @edit="$emit('edit', $event)" @delete="(id: string, pId?: string) => $emit('delete', id, pId)"
        @cancel-edit="$emit('cancel-edit')" @save-edit="(c: Comment, pId?: string) => $emit('save-edit', c, pId)"
        @toggle-expand="$emit('toggle-expand', comment.id)"
        @react="(type: 'like' | 'dislike', targetId: string, parentId?: string) => $emit('react', type, targetId, parentId)"
        @show-reactions="$emit('show-reactions', $event)" @start-reply="$emit('start-reply', comment)"
        @send-reply="$emit('send-reply', comment)" @cancel-reply="$emit('cancel-reply')"
        @toggle-replies="$emit('toggle-replies', comment)" />
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" class="pt-6 flex justify-center">
      <UiBaseButton variant="ghost" size="sm" @click="$emit('load-more')" :loading="loadingMore"
        class="!rounded-2xl !px-6 !py-2.5 text-[10px] font-black uppercase tracking-widest bg-ash/5 hover:bg-ash/10 text-hsa hover:text-primary transition-all">
        <IconChevronDown class="w-4 h-4 mr-2" />
        Voir plus de commentaires
      </UiBaseButton>
    </div>
  </div>

  <div v-else class="py-12 text-center space-y-4">
    <div class="w-20 h-20 bg-hsa rounded-[2.5rem] flex items-center justify-center mx-auto border border-ash">
      <IconMessage class="w-10 h-10 text-ash" />
    </div>
    <div>
      <h5>Silence radio...</h5>
      <p>Soyez le premier à lancer la conversation !</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronDown, IconMessage } from '@tabler/icons-vue'
import type { Comment } from '~/types/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'

const props = defineProps<{
  comments: Comment[]
  hasMore: boolean
  loadingMore: boolean
  editingCommentId: string | null
  editContent: string
  savingComment: boolean
  expandedComments: Record<string, boolean>
  reactingToId: string | null
  reactingType: string | null
  showReplies: Record<string, boolean>
  loadingReplies: Record<string, boolean>
  user: any
  replyingToId: string | null
  replyContent: string
  sendingReply: boolean
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'update:editContent', value: string): void
  (e: 'update:replyContent', value: string): void
  (e: 'edit', comment: Comment): void
  (e: 'delete', id: string, parentId?: string): void
  (e: 'cancel-edit'): void
  (e: 'save-edit', comment: Comment, parentId?: string): void
  (e: 'toggle-expand', id: string): void
  (e: 'react', type: 'like' | 'dislike', targetId: string, parentId?: string): void
  (e: 'show-reactions', target: Comment): void
  (e: 'start-reply', comment: Comment): void
  (e: 'send-reply', comment: Comment): void
  (e: 'cancel-reply'): void
  (e: 'toggle-replies', comment: Comment): void
  (e: 'load-more'): void
}>()

const checkIsOwner = (comment: any) => {
  if (!authStore.user) return false
  const userId = comment.user_id || comment.author_id
  return !!(userId && String(userId) === String(authStore.user.id))
}

const checkCanEdit = (comment: any) => {
  if (!checkIsOwner(comment)) return false
  const createdAt = new Date(comment.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
}
</script>
