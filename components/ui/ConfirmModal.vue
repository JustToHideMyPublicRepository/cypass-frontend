<template>
  <UiBaseModal :show="show" :max-width="maxWidth" @close="$emit('cancel')">
    <div class="p-2 text-center space-y-6">
      <!-- Icon Header -->
      <div v-if="icon"
        :class="['w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2 transition-all', iconBgClass]">
        <component :is="icon" class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <h3 class="text-xl font-black text-BtW tracking-tight">{{ title }}</h3>
        <p v-if="message" class="text-sm text-hsa leading-relaxed px-4">
          {{ message }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <UiBaseButton variant="ghost" class="flex-1 order-2 sm:order-1" @click="$emit('cancel')" type="button">
          {{ cancelText }}
        </UiBaseButton>
        <UiBaseButton :variant="variant" class="flex-1 order-1 sm:order-2 px-8" :loading="loading"
          @click="$emit('confirm')">
          {{ confirmText }}
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconAlertTriangle } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: any
  maxWidth?: string
}>(), {
  title: 'Confirmation',
  message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  loading: false,
  variant: 'primary',
  icon: IconAlertTriangle,
  maxWidth: 'sm'
})

defineEmits(['confirm', 'cancel'])

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'bg-danger/10 text-danger'
    case 'secondary': return 'bg-hsa/10 text-hsa'
    default: return 'bg-primary/10 text-primary'
  }
})
</script>
