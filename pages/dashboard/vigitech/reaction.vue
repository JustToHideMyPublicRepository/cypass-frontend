<template>
  <div class="space-y-8">
    <MeVigitechReactionsHeader 
      v-model:targetType="targetType" 
      :loading="loading" 
      @refresh="fetchData" 
    />

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
      <MeVigitechReactionsTabs 
        v-model="reactionType" 
        :availableTypes="availableReactionTypes" 
      />
      
      <div v-if="displayItems.length" class="px-4 py-2 rounded-xl bg-ash/20 border border-ash/30 text-[10px] font-black uppercase tracking-widest text-hsa h-fit">
        {{ displayItems.length }} résultat{{ displayItems.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Content Area -->
    <div class="relative min-h-[400px]">
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <UiAppSkeleton v-for="i in 6" :key="i" height="200px" radius="2.5rem" />
      </div>

      <!-- Interactions Grid -->
      <template v-else-if="displayItems.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          <MeVigitechReactionsInteractionItem 
            v-for="item in displayItems" 
            :key="item.id" 
            :item="item" 
            :type="targetType === 'my_comments' ? 'comment' : 'reaction'" 
          />
        </div>
      </template>

      <!-- Empty State -->
      <MeVigitechReactionsEmpty v-else class="animate-fade-in" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import type { ReactionType } from '~/types/vigitech'

const store = useUserVigitechStore()

const loading = ref(true)
const targetType = ref('')
const reactionType = ref('')

const displayItems = computed(() => {
  if (targetType.value === 'my_comments') {
    return store.userComments
  }
  return store.userReactions
})

const availableReactionTypes = computed<ReactionType[]>(() => {
  if (targetType.value === 'comment') {
    return ['like', 'dislike']
  }
  return ['love', 'like', 'wow', 'dislike', 'sad']
})

const fetchData = async () => {
  loading.value = true
  try {
    if (targetType.value === 'my_comments') {
      await store.fetchUserComments()
    } else {
      const params: any = {}
      if (targetType.value) params.target_type = targetType.value
      if (reactionType.value) params.type = reactionType.value
      await store.fetchUserReactions(params)
    }
  } finally {
    loading.value = false
  }
}

// Reset reaction type if it's no longer available for the current target type or if target is comments
watch(targetType, (newTarget) => {
  if (newTarget === 'my_comments') {
    reactionType.value = ''
  } else if (newTarget === 'comment' && !['like', 'dislike'].includes(reactionType.value)) {
    reactionType.value = ''
  }
  fetchData()
})

watch(reactionType, fetchData)

onMounted(fetchData)

useHead({
  title: 'Mes réactions',
  meta: [
    { name: 'description', content: 'Historique de vos réactions sur la veille VigiTech.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
