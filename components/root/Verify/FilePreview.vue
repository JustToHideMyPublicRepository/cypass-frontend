<template>
  <div v-if="file"
    class="flex items-center gap-4 p-4 md:p-6 bg-ash/20 rounded-2xl md:rounded-[2rem] border border-ashAct/20 animate-fade-in text-left w-full">
    <div
      class="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary shrink-0">
      <IconFileText v-if="mode === 'file'" class="w-6 h-6 md:w-10 md:h-10" />
      <IconQrcode v-else class="w-6 h-6 md:w-10 md:h-10" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="font-bold md:font-black text-BtW truncate">{{ file.name }}</p>
      <p
        class="text-[10px] md:text-xs text-hsa uppercase tracking-[0.1em] md:tracking-widest opacity-60 mt-0.5 md:mt-1">
        {{ (file.size / 1024 / 1024).toFixed(2) }} MO
      </p>
    </div>
    <UiBaseButton @click="$emit('reset')" variant="ghost"
      class="!p-2 md:!p-3 !h-auto !w-auto text-hsa hover:!text-danger transition-colors opacity-40 hover:opacity-100">
      <IconX class="w-5 h-5 md:w-6 md:h-6" />
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconFileText, IconQrcode, IconX } from '@tabler/icons-vue'

defineProps<{
  file: File | null
  mode: 'file' | 'qr' | 'hash'
}>()

defineEmits(['reset'])
</script>
