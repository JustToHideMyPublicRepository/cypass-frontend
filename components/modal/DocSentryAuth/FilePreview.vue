<template>
  <div class="bg-ash/30 rounded-[2rem] p-5 border border-ashAct/30 backdrop-blur-sm">
    <div class="flex items-center gap-5">
      <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
        <IconFileText class="w-7 h-7" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-black text-BtW truncate text-sm tracking-tight">{{ file.name }}</p>
        <p class="text-[10px] text-hsa font-bold tracking-widest opacity-70">{{ (file.size / 1024 /
          1024).toFixed(2) }} MB</p>
      </div>
      <UiBaseButton @click="$emit('remove')" variant="ghost"
        class="!text-hsa hover:!text-danger !p-3 !h-auto !w-auto !rounded-xl transition-colors">
        <IconX class="w-6 h-6" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFileText, IconX } from '@tabler/icons-vue'

defineProps<{
  file: File
}>()

defineEmits(['remove'])
</script>
