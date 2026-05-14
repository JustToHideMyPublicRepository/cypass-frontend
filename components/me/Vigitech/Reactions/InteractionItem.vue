<template>
  <div
    class="group relative bg-ash/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-ash/30 hover:border-primary/40 hover:bg-ash/60 hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.1)] transition-all duration-700 overflow-hidden flex flex-col h-full">

    <!-- Premium Animated Glow Gradient -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb),0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
    </div>

    <div class="relative flex-1 flex flex-col justify-between">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-3">
            <div :class="['w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-500 transform group-hover:rotate-12', config.bgClass, config.textClass]">
              <component :is="config.icon" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-hsa leading-none mb-1">
                {{ config.headerPrefix }} <span v-if="config.typeLabel" :class="config.textClass">{{ config.typeLabel }}</span>
              </p>
              <p class="text-[11px] font-bold text-BtW opacity-60">
                {{ relativeTime }}
              </p>
            </div>
          </div>

          <h3 class="text-sm font-black text-BtW tracking-tight leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
            "{{ displayTitle || 'Sans titre' }}"
          </h3>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-ash/10 flex items-center justify-between">
        <div class="flex items-center gap-2">
           <div class="px-3 py-1 rounded-full bg-ash/20 border border-ash/20 text-[9px] font-black uppercase tracking-widest text-hsa">
            {{ categoryLabel }}
          </div>
        </div>

        <NuxtLink :to="targetUrl" class="flex items-center gap-2 group/btn">
          <span class="text-[10px] font-black uppercase tracking-widest text-hsa group-hover/btn:text-primary transition-colors">Voir</span>
          <div class="w-8 h-8 flex items-center justify-center rounded-xl bg-primary/5 text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1">
             <IconArrowRight class="w-4 h-4" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  IconThumbUp, 
  IconHeart, 
  IconMoodSurprised, 
  IconThumbDown, 
  IconMoodSad,
  IconArrowRight,
  IconMessage
} from '@tabler/icons-vue'
import { formatRelativeTime } from '~/utils/date'

const props = defineProps<{
  item: any
  type: 'reaction' | 'comment'
}>()

const isComment = computed(() => props.type === 'comment')

const categoryLabel = computed(() => {
  if (isComment.value) return 'Commentaire'
  return props.item.target_type === 'comment' ? 'Réaction sur commentaire' : 'Réaction sur incident'
})

const displayTitle = computed(() => {
  if (isComment.value) return props.item.content
  return props.item.target_title
})

const targetUrl = computed(() => {
  if (isComment.value) return `/vigitech/${props.item.incident_id}`
  return `/vigitech/${props.item.target_id}`
})

const relativeTime = computed(() => {
  return formatRelativeTime(props.item.created_at)
})

const reactionConfigs: any = {
  like: {
    icon: IconThumbUp,
    label: 'J\'aime',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500'
  },
  love: {
    icon: IconHeart,
    label: 'J\'adore',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-500'
  },
  wow: {
    icon: IconMoodSurprised,
    label: 'Génial',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-500'
  },
  dislike: {
    icon: IconThumbDown,
    label: 'Je n\'aime pas',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500'
  },
  sad: {
    icon: IconMoodSad,
    label: 'Triste',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-500'
  }
}

const config = computed(() => {
  if (isComment.value) {
    return {
      icon: IconMessage,
      headerPrefix: 'A publié un',
      typeLabel: 'Commentaire',
      bgClass: 'bg-primary/10',
      textClass: 'text-primary'
    }
  }
  const rConfig = reactionConfigs[props.item.type] || reactionConfigs.like
  return {
    ...rConfig,
    headerPrefix: 'A réagi avec',
    typeLabel: rConfig.label
  }
})
</script>
