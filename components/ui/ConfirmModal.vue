<template>
  <UiBaseModal :show="show" :title="title" @close="$emit('cancel')">
    <div class="space-y-4">
      <div v-if="message" class="text-hsa">
        {{ message }}
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <UiBaseButton variant="ghost" @click="$emit('cancel')" type="button">
          {{ cancelText }}
        </UiBaseButton>
        <UiBaseButton :variant="variant" :loading="loading" @click="$emit('confirm')">
          {{ confirmText }}
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}>(), {
  title: 'Confirmation',
  message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  loading: false,
  variant: 'primary'
})

defineEmits(['confirm', 'cancel'])
</script>
