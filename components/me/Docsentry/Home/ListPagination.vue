<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-5 border-t border-ash/50 bg-ash/10">
    <div class="flex items-center gap-2">
      <div class="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-hsa">
        Page {{ currentPage }} / {{ totalPages }}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <UiBaseButton @click="$emit('prev-page')" :disabled="currentPage === 1" variant="ghost"
        class="!flex !items-center !justify-center !p-2 !rounded-xl border border-ash !bg-WtB text-hsa hover:!bg-ash hover:!text-BtW transition-all disabled:opacity-30 disabled:cursor-not-allowed !h-auto !w-auto">
        <IconChevronLeft class="w-4 h-4" />
      </UiBaseButton>
      <UiBaseButton @click="$emit('next-page')" :disabled="currentPage === totalPages" variant="ghost"
        class="!flex !items-center !justify-center !p-2 !rounded-xl border border-ash !bg-WtB text-hsa hover:!bg-ash hover:!text-BtW transition-all disabled:opacity-30 disabled:cursor-not-allowed !h-auto !w-auto">
        <IconChevronRight class="w-4 h-4" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits(['next-page', 'prev-page'])
</script>
