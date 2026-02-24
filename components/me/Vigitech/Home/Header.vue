<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl md:text-3xl font-black text-BtW tracking-tight">{{ title }}</h1>
      <p class="text-hsa font-bold">{{ subtitle }}</p>
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

defineProps<{
  title: string
  subtitle: string
}>()

defineEmits(['create'])
</script>
