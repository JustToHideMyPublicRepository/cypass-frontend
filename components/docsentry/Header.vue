<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-BtW text-2xl font-black">DocSentry</h1>
      <p class="text-hsa text-sm">Gestion et certification des documents officiels</p>
    </div>
    <div class="flex gap-2">
      <UiBaseButton variant="secondary" @click="$emit('verify')">
        <IconShieldCheck class="w-4 h-4 mr-2" /> Vérifier un doc
      </UiBaseButton>
      <UiBaseButton @click="$emit('upload')">
        <IconPlus class="w-4 h-4 mr-2" /> Nouveau Document
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconShieldCheck } from '@tabler/icons-vue'
defineEmits(['upload', 'verify'])
</script>
