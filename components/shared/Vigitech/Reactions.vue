<template>
  <div class="flex flex-wrap items-center gap-3">
    <button v-for="rtype in reactionTypes" :key="rtype" @click="handleReact(rtype)" :disabled="loadingType === rtype"
      class="group relative flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all duration-300" :class="[
        hasReacted(rtype)
          ? 'bg-primary/10 border-primary/20 text-primary scale-105'
          : 'bg-ash/5 border-ash/20 text-hsa hover:bg-ash/10 hover:border-ash/30'
      ]">
      <span class="text-lg group-hover:scale-125 transition-transform duration-300 transform origin-center"
        :class="{ 'opacity-50': loadingType === rtype }">
        {{ getReactionEmoji(rtype) }}
      </span>

      <!-- Loading Spinner -->
      <IconLoader2 v-if="loadingType === rtype" class="w-3.5 h-3.5 animate-spin absolute top-2 left-3" />

      <span class="text-xs font-black tracking-widest">{{ getCount(rtype) }}</span>

      <!-- Tooltip -->
      <div
        class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-WtB border border-ashAct rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <span class="text-[10px] font-black uppercase tracking-widest text-BtW">{{ getReactionLabel(rtype) }}</span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconLoader2 } from '@tabler/icons-vue'
import { reactionTypes, getReactionEmoji, getReactionLabel } from '~/utils/vigitech'
import { useAuthStore } from '~/stores/back/user/auth'
import { useUserVigitechStore } from '~/stores/back/user/vigitech'
import type { ReactionType } from '~/types/vigitech'

const props = defineProps<{
  incident: any
}>()

const emit = defineEmits(['login-required'])

const authStore = useAuthStore()
const userVigitechStore = useUserVigitechStore()
const loadingType = ref<string | null>(null)

// We don't have the user's specific current active reaction from the API in the incident object directly
// usually, backend returns if current user reacted. Since we just have reactions_summary, we'll track locally if they toggle
// In a full impl, backend should return `user_reaction_type` in the incident details.
// For now, we rely on the toggle behavior: if they click, we toggle the state and assume they added/removed it.
// To make it robust without modifying backend immediately, we just show counts and let them toggle.
const activeLocalReaction = ref<string | null>(null)

const getCount = (type: string) => {
  if (!props.incident?.reactions_summary) return 0
  return props.incident.reactions_summary[type as ReactionType] || 0
}

const hasReacted = (type: string) => {
  return activeLocalReaction.value === type
}

const handleReact = async (type: string) => {
  if (!authStore.user) {
    // Show login modal or alert
    emit('login-required')
    return
  }

  if (loadingType.value) return

  loadingType.value = type

  const result = await userVigitechStore.reactToIncident(props.incident.id, type)

  if (result.success) {
    if (result.data?.type) {
      // They added it
      activeLocalReaction.value = result.data.type
    } else {
      // They toggled it off or replaced it (if result data has different structure)
      // Usually toggle off is inferred if data is different or success message says "removed"
      // Assuming result.data contains the new reaction record if added, or null if removed
      activeLocalReaction.value = result.data?.type || null
    }
  }

  loadingType.value = null
}
</script>
