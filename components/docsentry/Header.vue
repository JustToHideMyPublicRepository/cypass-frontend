<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
    <div class="space-y-1">
      <h1 class="text-BtW text-2xl md:text-3xl font-black">DocSentry</h1>
      <p class="text-hsa text-xs md:text-sm">Gestion et certification des documents officiels</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <UiBaseButton variant="secondary" @click="$emit('verify')" class="flex-1">
        <IconShieldCheck class="w-4 h-4 mr-2" /> Vérifier un doc
      </UiBaseButton>
      <UiBaseButton @click="$emit('upload')" class="flex-1">
        <IconPlus class="w-4 h-4 mr-2" /> Nouveau Document
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconShieldCheck } from '@tabler/icons-vue'
defineEmits(['upload', 'verify'])
</script>
