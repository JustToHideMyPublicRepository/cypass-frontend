<template>
  <div class="p-12 text-center bg-danger/5 border border-danger/10 rounded-[3rem]">
    <IconBug class="w-12 h-12 text-danger mx-auto mb-4" />
    <h3 class="text-xl font-black text-BtW">Une erreur est survenue</h3>
    <p class="text-sm font-bold text-hsa mt-2">{{ error }}</p>
    <UiBaseButton @click="$emit('retry')" class="mt-6 !rounded-2xl">Réessayer</UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconBug } from '@tabler/icons-vue'

defineProps<{
  error: string
}>()

defineEmits(['retry'])
</script>
