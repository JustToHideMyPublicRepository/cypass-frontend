<template>
  <div
    class="flex flex-wrap items-center gap-2 p-1.5 bg-ash/30 backdrop-blur-md rounded-[1.5rem] border border-ash/40 w-fit">
    <!-- "Tout" Button -->
    <button @click="updateValue('')"
      class="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative overflow-hidden group"
      :class="!modelValue ? 'bg-primary text-WtB shadow-lg shadow-primary/30' : 'text-hsa hover:text-BtW hover:bg-ash/50'">
      <IconGridDots class="w-3.5 h-3.5" />
      <span class="hidden sm:inline">Tout</span>
    </button>

    <!-- Reaction Buttons -->
    <button v-for="type in availableTypes" :key="type" @click="updateValue(type)"
      class="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative overflow-hidden group"
      :class="modelValue === type ? 'bg-WtB text-BtW shadow-md border border-ash/10' : 'text-hsa hover:text-BtW hover:bg-ash/50'">
      <span class="text-base sm:text-lg leading-none">{{ getReactionEmoji(type) }}</span>
      <span class="hidden sm:inline">{{ getReactionLabel(type) }}</span>
      <div v-if="modelValue === type" class="absolute bottom-0 left-0 w-full h-[3px] bg-primary/40"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconGridDots } from '@tabler/icons-vue'
import { getReactionEmoji, getReactionLabel } from '~/utils/vigitech'
import type { ReactionType } from '~/types/vigitech'
import { onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
  availableTypes: ReactionType[]
}>()

const emit = defineEmits(['update:modelValue'])

const STORAGE_KEY = 'vigitech_reaction_tab'
const EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

const updateValue = (value: string) => {
  emit('update:modelValue', value)
  
  // Persist to session/localStorage with 5-min expiry
  const sessionData = {
    value,
    expiry: Date.now() + EXPIRY_MS
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
}

onMounted(() => {
  // Check for persisted tab on mount
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (data.expiry > Date.now()) {
        emit('update:modelValue', data.value)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
</script>
