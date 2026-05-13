<template>
  <div v-if="comments.length" class="space-y-3">
    <div v-for="comment in comments" :key="comment.id">
      <meVigitechDetailCommentsItem :comment="comment" :is-owner="checkIsOwner(comment)" :can-edit="checkCanEdit(comment)"
        :is-editing="editingCommentId === comment.id" :edit-content="editContent"
        @update:edit-content="$emit('update:editContent', $event)" :saving="savingComment"
        :expanded="!!expandedComments[comment.id]" :reacting-to-id="reactingToId" :reacting-type="reactingType"
        :show-replies="!!showReplies[comment.id]" :loading-replies="!!loadingReplies[comment.id]"
        @edit="$emit('edit', comment)" @delete="$emit('delete', comment.id)" @cancel-edit="$emit('cancel-edit')"
        @save-edit="$emit('save-edit', comment)" @toggle-expand="$emit('toggle-expand', comment.id)"
        @react="(type, targetId, parentId) => $emit('react', type, targetId, parentId)"
        @show-reactions="$emit('show-reactions', $event)" @toggle-replies="$emit('toggle-replies', comment)" />
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="pt-4 flex justify-center">
      <button @click="$emit('load-more')" :disabled="loadingMore"
        class="text-[10px] font-black uppercase tracking-widest text-hsa hover:text-primary transition-colors flex items-center gap-2">
        <IconChevronDown v-if="!loadingMore" class="w-3.5 h-3.5" />
        <UiLogoLoader v-else size="xs" color="currentColor" />
        {{ loadingMore ? 'Chargement...' : 'Voir plus' }}
      </button>
    </div>
  </div>

  <div v-else class="text-center py-6">
    <IconMessage class="w-6 h-6 text-hsa/20 mx-auto mb-2" />
    <p class="text-[11px] text-hsa font-bold">Aucun commentaire.</p>
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
}>()

const authStore = useAuthStore()

defineEmits<{
  (e: 'update:editContent', value: string): void
  (e: 'edit', comment: Comment): void
  (e: 'delete', id: string): void
  (e: 'cancel-edit'): void
  (e: 'save-edit', comment: Comment): void
  (e: 'toggle-expand', id: string): void
  (e: 'react', type: 'like' | 'dislike', targetId: string, parentId?: string): void
  (e: 'show-reactions', target: Comment): void
  (e: 'toggle-replies', comment: Comment): void
  (e: 'load-more'): void
}>()

const checkIsOwner = (comment: any) => {
  return !!(authStore.user && comment.user_id === authStore.user.id)
}

const checkCanEdit = (comment: any) => {
  if (!checkIsOwner(comment)) return false
  const createdAt = new Date(comment.created_at).getTime()
  const now = Date.now()
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
  return hoursDiff <= 24
}
</script>
