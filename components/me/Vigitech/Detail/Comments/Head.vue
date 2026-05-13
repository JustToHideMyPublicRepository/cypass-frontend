<template>
  <div class="flex items-center justify-between gap-4">
    <button @click="$emit('toggle')"
      class="flex-1 flex items-center justify-between hover:text-primary transition-all duration-300">
      <h3 class="text-xs font-black text-hsa uppercase tracking-[0.2em] flex items-center gap-2">
        <IconMessage class="w-4 h-4 text-primary" /> Commentaires
        <span v-if="count > 0" class="ml-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black">
          {{ count }}
        </span>
      </h3>
      <component :is="show ? IconChevronUp : IconChevronDown" class="w-4 h-4 text-hsa transition-transform" />
    </button>
    <NuxtLink :to="`/vigitech/${incidentId}#comments`"
      class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-WtB transition-all text-[10px] font-black uppercase tracking-wider">
      <IconPlus class="w-3.5 h-3.5" />
      Commenter
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconChevronUp, IconChevronDown, IconPlus } from '@tabler/icons-vue'

defineProps<{
  incidentId: string
  count: number
  show: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>
