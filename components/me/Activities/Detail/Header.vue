<template>
  <div class="flex items-center gap-4 mb-8">
    <UiBaseButton variant="ghost" size="sm" class="!p-2 -ml-2" @click="navigateTo('/dashboard/activities')">
      <IconArrowLeft class="w-5 h-5 text-hsa" />
    </UiBaseButton>
    <div>
      <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-BtW">Détails de l'activité</h1>
      <p class="text-sm text-hsa mt-1 font-medium">Vue approfondie de l'événement système</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
</script>
