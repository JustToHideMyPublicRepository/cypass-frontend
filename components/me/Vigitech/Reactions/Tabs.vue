<template>
  <div class="flex flex-wrap items-center gap-2 p-1.5 bg-ash/30 backdrop-blur-md rounded-[1.5rem] border border-ash/40 w-fit">
    <button
      @click="$emit('update:modelValue', '')"
      class="flex items-center gap-2 px-5 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative overflow-hidden group"
      :class="!modelValue ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-hsa hover:text-BtW hover:bg-ash/50'"
    >
      <IconGridDots class="w-3.5 h-3.5" />
      Tout
    </button>

    <button
      v-for="type in availableTypes"
      :key="type"
      @click="$emit('update:modelValue', type)"
      class="flex items-center gap-2 px-5 py-2.5 rounded-[1.1rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 relative overflow-hidden group"
      :class="modelValue === type ? 'bg-WtB text-BtW shadow-md border border-ash/10' : 'text-hsa hover:text-BtW hover:bg-ash/50'"
    >
      <span class="text-base leading-none">{{ getReactionEmoji(type) }}</span>
      <span>{{ getReactionLabel(type) }}</span>
      <div v-if="modelValue === type" class="absolute bottom-0 left-0 w-full h-[3px] bg-primary/40"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconGridDots } from '@tabler/icons-vue'
import { getReactionEmoji, getReactionLabel } from '~/utils/vigitech'
import type { ReactionType } from '~/types/vigitech'

const props = defineProps<{
  modelValue: string
  availableTypes: ReactionType[]
}>()

defineEmits(['update:modelValue'])
</script>
