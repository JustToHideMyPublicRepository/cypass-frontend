<template>
  <UiBaseModal :show="show" maxWidth="sm" @close="$emit('close')">
    <div class="p-2 text-center space-y-6">
      <!-- Icon Header -->
      <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 bg-danger/10 text-danger">
        <IconFileOff class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-black text-BtW tracking-tight">{{ title }}</h3>
        <p class="text-sm text-hsa leading-relaxed px-4">{{ message }}</p>
      </div>

      <!-- File Info -->
      <div v-if="fileName" class="p-3 bg-ash/20 rounded-xl border border-ash text-left">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-danger/10 rounded-lg flex items-center justify-center text-danger shrink-0">
            <IconFile class="w-5 h-5" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-BtW text-sm truncate">{{ fileName }}</p>
            <p class="text-xs text-hsa">{{ fileType }} {{ fileSize ? `• ${fileSize}` : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Accepted formats -->
      <div class="p-3 bg-primary/5 rounded-xl border border-primary/10 text-left">
        <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Formats acceptés</p>
        <p class="text-sm text-hsa">{{ acceptedFormats }}</p>
      </div>

      <div class="pt-2">
        <UiBaseButton variant="primary" block @click="$emit('close')">
          Compris
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconFileOff, IconFile } from '@tabler/icons-vue'

withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  fileName?: string
  fileType?: string
  fileSize?: string
  acceptedFormats?: string
}>(), {
  title: 'Format non supporté',
  message: 'Le fichier que vous avez sélectionné n\'est pas dans un format accepté.',
  acceptedFormats: 'PDF uniquement'
})

defineEmits(['close'])
</script>
