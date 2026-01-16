<template>
  <button :class="[
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variant === 'primary' ? 'bg-primary hover:bg-blue-900 text-white focus:ring-primary' : '',
    variant === 'secondary' ? 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700' : '',
    variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' : '',
    block ? 'w-full' : ''
  ]" :disabled="disabled || loading">
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
      </path>
    </svg>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
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
