<template>
  <UiBaseCard title="Commentaires récents" subtitle="Réponses sur les incidents">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/vigitech/comments')">Tout</UiBaseButton>
    </template>
    <div class="space-y-4">
      <div v-if="loading && !comments.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!comments.length" class="py-10 text-center text-hsa text-xs">
        Aucun commentaire récent
      </div>
      <div v-for="comment in comments" :key="comment.id"
        class="flex gap-3 text-sm p-2 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="navigateTo(`/dashboard/vigitech/${comment.incident_id}`)">
        <div class="shrink-0">
          <img v-if="comment.avatar_url"
            :src="getUserAvatarUrl(comment.avatar_url, comment.first_name, comment.last_name)"
            class="w-8 h-8 rounded-full border border-ash group-hover:border-primary transition-colors" />
          <div v-else
            class="w-8 h-8 rounded-full bg-ash flex items-center justify-center text-[10px] font-bold text-hsa">
            {{ comment.first_name?.[0] }}{{ comment.last_name?.[0] }}
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-BtW truncate">{{ comment.first_name }} {{ comment.last_name }}</h4>
          <p class="text-[10px] text-hsa line-clamp-1 italic">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { getUserAvatarUrl } from '~/utils/user'

defineProps<{
  comments: any[]
  loading: boolean
}>()
</script>
