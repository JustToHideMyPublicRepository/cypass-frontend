<template>
  <div v-if="hasResult" class="w-full">
    <UiBaseButton variant="primary" class="w-full !rounded-2xl font-black py-4 h-auto shadow-xl" 
      @click="$emit('close')" :disabled="multiVersionLoading">
      D'accord
    </UiBaseButton>
  </div>
  <div v-else class="flex flex-col sm:flex-row gap-4 w-full">
    <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold py-4 h-auto border-none" 
      @click="$emit('close')" :disabled="loading">
      Annuler
    </UiBaseButton>
    <UiBaseButton variant="primary" class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" 
      :loading="loading" :disabled="!hasFile || loading" @click="$emit('upload')">
      Signer le document
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hasResult: boolean
  loading: boolean
  hasFile: boolean
  multiVersionLoading: boolean
}>()

defineEmits(['close', 'upload'])
</script>
