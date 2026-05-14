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
      <div class="relative">
        <span class="text-base sm:text-lg leading-none">{{ getReactionEmoji(type) }}</span>
        <!-- Badge -->
        <span v-if="summary && summary[type]"
          class="absolute -top-2.5 -right-2.5 flex items-center justify-center min-w-[14px] h-[14px] px-1 rounded-full bg-primary text-WtB text-[8px] font-black shadow-sm ring-2 ring-WtB transition-all">
          {{ summary[type] }}
        </span>
      </div>
      <span class="hidden sm:inline ml-1">{{ getReactionLabel(type) }}</span>
      <div v-if="modelValue === type" class="absolute bottom-0 left-0 w-full h-[3px] bg-primary/40"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconGridDots } from '@tabler/icons-vue'
import { getReactionEmoji, getReactionLabel } from '~/utils/vigitech'
import type { ReactionType } from '~/types/vigitech'
import { onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  availableTypes: ReactionType[]
  summary?: Record<string, number>
}>()

const emit = defineEmits(['update:modelValue'])

const STORAGE_KEY = 'cps_vigitech_reaction_filters'
const EXPIRY_MS = 300000 // 5 minutes

const updateValue = (value: string) => {
  emit('update:modelValue', value)
}

// Persist to sessionStorage following activities/index.vue logic
watch(() => props.modelValue, (newVal) => {
  if (import.meta.client) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data: newVal, timestamp: Date.now() }))
  }
})

onMounted(() => {
  if (import.meta.client) {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved)
        if (Date.now() - timestamp < EXPIRY_MS) {
          // Only emit if value is still valid and different from default
          if (data && data !== props.modelValue) {
            emit('update:modelValue', data)
          }
        } else {
          sessionStorage.removeItem(STORAGE_KEY)
        }
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }
})
</script>
