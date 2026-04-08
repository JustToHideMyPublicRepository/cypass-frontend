<template>
  <UiBaseCard title="Commentaires récents" subtitle="Réponses sur les incidents">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="router.push('/dashboard/vigitech/comments')">Tout</UiBaseButton>
    </template>
    <div class="space-y-4">
      <div v-if="loading && !comments.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!comments.length" class="py-10 text-center text-hsa">
        Aucun commentaire récent
      </div>
      <div v-for="comment in comments" :key="comment.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="openDetail(comment)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors">
            <IconMessage class="w-4 h-4 text-hsa group-hover:text-primary" />
          </div>
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-BtW truncate"> {{ comment.incident_title }} </h4>
            <p class="text-[10px] text-hsa mt-0.5 truncate"> "{{ comment.content }}" </p>
          </div>
        </div>
        <span class="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black"
          :class="getBadgeLabelColor(comment.created_at)">
          {{ formatRelativeTime(comment.created_at) }}
        </span>
      </div>
    </div>
    
    <!-- Détail du commentaire -->
    <ModalVigitechCommentDetail :show="showDetail" :comment="selectedComment" @close="showDetail = false" />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import { useToastStore } from '~/stores/front/toast'

const router = useRouter()
const store = useUserVigitechStore()
const toast = useToastStore()

defineProps<{
  comments: any[]
  loading: boolean
}>()

const showDetail = ref(false)
const selectedComment = ref<any>(null)

const openDetail = async (comment: any) => {
  showDetail.value = true
  selectedComment.value = null // Show skeleton
  const res = await store.fetchCommentById(comment.id)
  if (res.success) {
    selectedComment.value = res.data
  } else {
    toast.showToast('error', 'Erreur', 'Impossible de charger les détails du commentaire.')
    showDetail.value = false
  }
}

const getBadgeLabelColor = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = diff / (1000 * 60 * 60)

  if (hours < 1) return 'bg-success/10 text-success'
  if (hours < 24) return 'bg-primary/10 text-primary'
  if (hours < 72) return 'bg-warning/10 text-warning'
  return 'bg-ash/20 text-hsa'
}
</script>
