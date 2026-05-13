<template>
  <div class="flex items-center gap-4 relative">
    <!-- Main Action Button -->
    <div v-if="authStore.user" class="relative group" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <button @click="handleMainClick" :disabled="isLoading"
        class="flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 border border-transparent"
        :class="[
          isLoading
            ? 'opacity-50 cursor-not-allowed grayscale'
            : myReaction
              ? getReactionColor(myReaction.type)
              : 'text-hsa hover:bg-ash/10 hover:text-BtW'
        ]">
        <UiLogoLoader v-if="isLoading" class="w-5 h-5 !text-current" />
        <template v-else>
          <span v-if="myReaction" class="text-xl leading-none scale-110">{{ getReactionEmoji(myReaction.type) }}</span>
          <IconThumbUp v-else class="w-5 h-5" />
        </template>
        <span class="text-sm font-black tracking-wide"
          :class="[myReaction ? getReactionTextColorOnly(myReaction.type) : '']">
          {{ myReaction ? getReactionLabel(myReaction.type) : 'Réagir' }}
        </span>
      </button>

      <!-- Hover Tooltip -->
      <div
        class="absolute -top-14 left-0 flex items-center gap-1.5 p-1 bg-BtW border border-ashAct rounded-[2rem] shadow-xl transition-all duration-300 z-20 origin-bottom-left"
        :class="[
          isHovered || popupKeepOpen
            ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-2 invisible pointer-events-none'
        ]" @mouseenter="popupKeepOpen = true" @mouseleave="popupKeepOpen = false">
        <button v-for="rtype in reactionTypes" :key="rtype" @click.stop="handleReact(rtype)" :disabled="isLoading"
          class="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-ash/10 transition-transform duration-200 hover:scale-125 focus:outline-none focus:scale-125 group/emoji">
          <span class="text-2xl leading-none" :class="{ 'grayscale opacity-50': isLoading }">{{ getReactionEmoji(rtype)
          }}</span>

          <!-- Emoji specific tooltip -->
          <div
            class="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/80 text-white rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/emoji:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {{ getReactionLabel(rtype) }}
          </div>
        </button>
      </div>
    </div>

    <!-- Reactions Summary -->
    <div v-if="totalCount > 0" @click="showListModal = true"
      class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-ash/10 cursor-pointer transition-colors">

      <!-- Top 3 Emojis Stacked -->
      <div class="flex items-center -space-x-1.5">
        <div v-for="(rtype, index) in topReactions" :key="rtype"
          class="w-6 h-6 rounded-full bg-WtB border border-ashAct flex items-center justify-center shadow-sm z-10"
          :style="{ zIndex: 10 - index }">
          <span class="text-[12px] leading-none">{{ getReactionEmoji(rtype) }}</span>
        </div>
      </div>

      <!-- Total Count -->
      <span class="text-sm font-bold text-hsa hover:text-BtW transition-colors">
        {{ totalCount }}
      </span>
    </div>

    <!-- Modal List -->
    <ModalVigitechReactionsList :show="showListModal" :reactions="incident.reactions_details"
      @close="showListModal = false" />
  </div>
</template>

<script setup lang="ts">
import { IconThumbUp } from '@tabler/icons-vue'
import { reactionTypes, getReactionEmoji, getReactionLabel } from '~/utils/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import type { ReactionType, ReactionDetail } from '~/types/vigitech'

const props = defineProps<{
  incident: any
}>()

const emit = defineEmits(['login-required'])

const authStore = useAuthStore()
const userVigitechStore = useUserVigitechStore()
const isLoading = ref(false)

const isHovered = ref(false)
const popupKeepOpen = ref(false)
const showListModal = ref(false)

const getReactionColor = (type: string) => {
  switch (type) {
    case 'love': return 'text-danger bg-danger/5 hover:bg-danger/10'
    case 'like': return 'text-success bg-success/5 hover:bg-success/10'
    case 'wow': return 'text-primary bg-primary/5 hover:bg-primary/10'
    case 'sad': return 'text-warning bg-warning/5 hover:bg-warning/10'
    case 'dislike': return 'text-hsa bg-hsa/5 hover:bg-hsa/10'
    default: return 'text-primary bg-primary/5 hover:bg-primary/10'
  }
}

const getReactionTextColorOnly = (type: string) => {
  switch (type) {
    case 'love': return 'text-danger'
    case 'like': return 'text-success'
    case 'wow': return 'text-primary'
    case 'sad': return 'text-warning'
    case 'dislike': return 'text-hsa'
    default: return 'text-primary'
  }
}

const myReaction = computed<ReactionDetail | undefined>(() => {
  if (!authStore.user || !props.incident?.reactions_details) return undefined
  return props.incident.reactions_details.find((r: ReactionDetail) => r.user_id === authStore.user?.id)
})

const topReactions = computed<ReactionType[]>(() => {
  if (!props.incident?.reactions_summary) return []
  const summary = props.incident.reactions_summary as Partial<Record<ReactionType, number>>
  return Object.entries(summary)
    .filter(([_, count]) => (count as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(entry => entry[0] as ReactionType)
})

const totalCount = computed(() => {
  return props.incident?.reactions_count || 0
})

const handleMainClick = async () => {
  if (myReaction.value) {
    await handleReact(myReaction.value.type)
  } else {
    await handleReact('like')
  }
}

const handleReact = async (type: string) => {
  if (!authStore.user) {
    emit('login-required')
    return
  }

  if (isLoading.value) return

  isLoading.value = true
  popupKeepOpen.value = false

  await userVigitechStore.reactToIncident(props.incident.id, type)

  isLoading.value = false
}
</script>
