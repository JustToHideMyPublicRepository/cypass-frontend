<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between pt-6 mt-6 border-t border-ashAct">
    <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">
      Page {{ currentPage }} sur {{ totalPages }}
    </p>
    <div class="flex items-center gap-2">
      <UiBaseButton @click="$emit('change-page', -1)" :disabled="currentPage === 1" variant="secondary"
        class="flex items-center gap-1 !px-3 !py-1.5 !text-xs !font-medium">
        <IconChevronLeft class="w-3 h-3" /> Précédent
      </UiBaseButton>
      <UiBaseButton @click="$emit('change-page', 1)" :disabled="currentPage === totalPages" variant="secondary"
        class="flex items-center gap-1 !px-3 !py-1.5 !text-xs !font-medium">
        Suivant
        <IconChevronRight class="w-3 h-3" />
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

defineEmits(['change-page'])
</script>
