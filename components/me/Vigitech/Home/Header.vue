<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
    <div class="space-y-1">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-1.5 h-1.5 rounded-full bg-danger animate-pulse"></div>
        <span class="text-[10px] font-bold text-danger uppercase tracking-widest">Veille Active</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-BtW tracking-tight">
        VigiTech <span class="text-hsa font-medium">/</span>
        <span class="bg-gradient-to-r from-danger to-indigo-500 bg-clip-text text-transparent">Incidents</span>
      </h1>
      <p class="text-hsa text-sm font-medium">Surveillez et signalez les incidents de sécurité en temps réel.</p>
    </div>

    <div class="flex items-center gap-3">
      <UiBaseButton @click="$emit('create')" class="!px-4 !py-2.5 !text-xs !uppercase !tracking-wider gap-2">
        <IconAlertCircle class="w-4 h-4" />
        Signaler un Incident
      </UiBaseButton>
      <UiBaseButton variant="secondary" to="/dashboard/vigitech/comments"
        class="!px-4 !py-2.5 !text-xs !uppercase !tracking-wider gap-2">
        <IconMessage class="w-4 h-4" />
        Mes commentaires
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle, IconMessage } from '@tabler/icons-vue'

defineEmits(['create'])
</script>
