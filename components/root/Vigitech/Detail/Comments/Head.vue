<template>
  <div class="relative flex items-center justify-between mb-4">
    <div class="flex items-center gap-4">
      <div class="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
        <IconMessage class="w-6 h-6" />
      </div>
      <div>
        <h5> Espace Discussion
          <span v-if="count > 0" class="text-primary font-bold ml-1">{{ count }}</span>
        </h5>
      </div>
    </div>
    <button @click="$emit('toggle')"
      class="p-2.5 rounded-2xl bg-ash/10 hover:bg-primary/10 text-hsa hover:text-primary transition-all duration-300 active:scale-90">
      <component :is="show ? IconChevronUp : IconChevronDown" class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconMessage, IconChevronUp, IconChevronDown } from '@tabler/icons-vue'

defineProps<{
  count: number
  show: boolean
}>()

defineEmits<{
  (e: 'toggle'): void
}>()
</script>
