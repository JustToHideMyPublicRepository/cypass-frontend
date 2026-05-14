<template>
  <UiBaseCard
    class="group transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden h-full flex flex-col justify-center">

    <div class="flex items-center gap-3">
      <!-- Icon with themed background -->
      <div
        :class="['w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-500 transform group-hover:rotate-6 shadow-sm', config.bgClass, config.textClass]">
        <component :is="config.icon" class="w-5 h-5" />
      </div>

      <!-- Info -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5 overflow-hidden">
          <p class="text-[10px] font-black truncate">
            {{ config.headerPrefix }}
            <span v-if="config.typeLabel" :class="config.textClass">
              {{ config.typeLabel }}
            </span>
          </p>
        </div>

        <h5 class="text-xs block tracking-tight mt-1">
          {{ displayTitle || 'Sans titre' }}
        </h5>

        <!-- Meta -->
        <div class="flex items-center gap-2 mt-1.5">
          <span class="inline-flex items-center gap-1 text-[9px] font-bold text-hsa/60 uppercase tracking-tighter">
            <IconClock class="w-2.5 h-2.5" />
            {{ relativeTime }}
          </span>
          <span class="inline-flex items-center gap-1 text-[9px] font-black text-primary/80 uppercase tracking-tighter">
            <component :is="isComment ? IconMessage : IconCircleCheck" class="w-2.5 h-2.5" />
            {{ categoryLabel }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Remove Reaction Button -->
        <button v-if="!isComment" @click="$emit('removeReaction', item)"
          class="p-2 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors group/remove"
          title="Retirer la réaction">
          <div class="relative w-4 h-4 flex items-center justify-center">
            <IconMoodOff class="w-3.5 h-3.5 group-hover/remove:scale-110 transition-transform" />
          </div>
        </button>

        <NuxtLink :to="targetUrl"
          class="p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-WtB transition-all" title="Voir">
          <IconExternalLink class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconThumbUp, IconHeart, IconMoodSurprised, IconThumbDown, IconMoodSad, IconExternalLink, IconMessage, IconClock, IconCircleCheck, IconMoodOff } from '@tabler/icons-vue'
import { formatRelativeTime } from '~/utils/date'
import { computed } from 'vue'

const props = defineProps<{
  item: any
  type: 'reaction' | 'comment'
}>()

defineEmits(['removeReaction'])

const isComment = computed(() => props.type === 'comment')

const categoryLabel = computed(() => {
  if (isComment.value) return 'Commentaire'
  return props.item.target_type === 'comment' ? 'Commentaire' : 'Incident'
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
    bgClass: 'bg-primary/10',
    textClass: 'text-primary'
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
    label: 'Bof',
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
      headerPrefix: 'A ajouté un',
      typeLabel: 'commentaire',
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
