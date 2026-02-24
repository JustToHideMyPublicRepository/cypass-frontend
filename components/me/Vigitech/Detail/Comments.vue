<template>
  <UiBaseCard class="!rounded-[2.5rem] overflow-hidden">
    <div class="p-6 md:p-8 space-y-5">
      <button @click="showComments = !showComments"
        class="w-full flex items-center justify-between hover:text-primary transition-all duration-300">
        <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em] flex items-center gap-2">
          <IconMessage class="w-4 h-4 text-primary" /> Commentaires
          <span v-if="comments.length"
            class="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
            {{ comments.length }}
          </span>
        </h3>
        <component :is="showComments ? IconChevronUp : IconChevronDown" class="w-4 h-4 text-hsa transition-transform" />
      </button>

      <template v-if="showComments">
        <div v-if="loading" class="space-y-3">
          <UiAppSkeleton v-for="i in 3" :key="i" height="70px" radius="1rem" />
        </div>

        <div v-else-if="comments.length" class="space-y-3">
          <div v-for="comment in comments" :key="comment.id"
            class="p-4 rounded-xl bg-ash/5 border border-ash/30 space-y-1.5 hover:border-ash/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full overflow-hidden border border-ash/20 bg-ash/10">
                  <img :src="getAvatar(comment)" class="w-full h-full object-cover" />
                </div>
                <NuxtLink :to="`/user/${comment.user_id}`"
                  class="text-[11px] font-black text-BtW hover:text-primary hover:underline transition-colors">
                  {{ [comment.first_name, comment.last_name].filter(Boolean).join(' ') || 'Utilisateur' }}
                </NuxtLink>
              </div>
              <span class="text-[10px] text-hsa font-bold">{{ formatDate(comment.created_at) }}</span>
            </div>
            <p class="text-xs text-BtW leading-relaxed pl-8">{{ comment.content }}</p>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <IconMessage class="w-6 h-6 text-hsa/20 mx-auto mb-2" />
          <p class="text-[11px] text-hsa font-bold">Aucun commentaire.</p>
        </div>
      </template>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconMessage, IconChevronUp, IconChevronDown } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUserAvatarUrl } from '~/utils/user'

const props = defineProps<{
  comments: any[]
  loading: boolean
}>()

const showComments = ref(true)

const getAvatar = (comment: any) => {
  return getUserAvatarUrl((comment as any).avatar_url || null, comment.first_name || null, comment.last_name || null)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'PPP p', { locale: fr })
}
</script>
