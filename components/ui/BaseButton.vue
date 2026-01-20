<template>
  <button :class="[
    'btn',
    variant === 'primary' ? 'btn-primary' : '',
    variant === 'secondary' ? 'btn-secondary' : '',
    variant === 'danger' ? 'btn-danger' : '',
    block ? 'w-full' : ''
  ]" :disabled="disabled || loading">
    <IconLoader2 v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" />
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { IconLoader2 } from '@tabler/icons-vue'

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  block?: boolean
  disabled?: boolean
  loading?: boolean
}>(), {
  variant: 'primary',
  block: false,
  disabled: false,
  loading: false
})
</script>
