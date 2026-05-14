<template>
  <UiBaseCard
    class="p-16 text-center space-y-6 rounded-[3rem] border-ash/30 shadow-2xl shadow-ash/5 max-w-lg mx-auto mt-20">
    <div
      class="w-24 h-24 rounded-full bg-danger/5 flex items-center justify-center mx-auto text-danger border border-danger/10">
      <IconAlertTriangle class="w-12 h-12" />
    </div>
    <div class="space-y-2 mb-4">
      <h4>Accès restreint</h4>
      <p>Ce workspace n'existe pas ou vous n'avez pas les permissions pour y accéder.</p>
    </div>
    <UiBaseButton to="/dashboard/manage/workspace" variant="secondary" size="sm">
      Retour à la liste
    </UiBaseButton>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'
</script>