<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div class="relative">
      <IconLoader class="animate-spin h-16 w-16 text-primary" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-2 h-2 bg-primary rounded-full animate-ping"></div>
      </div>
    </div>
    <p class="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Veuillez patienter...
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconLoader } from '@tabler/icons-vue'
</script>
