<template>
  <NuxtLink v-if="to" :to="to" :class="buttonClasses" :aria-disabled="disabled || loading">
    <IconLoader2 v-if="loading" class="logoClasses" />
    <slot />
  </NuxtLink>

  <a v-else-if="href" :href="href" :class="buttonClasses" :aria-disabled="disabled || loading">
    <IconLoader2 v-if="loading" class="logoClasses" />
    <slot />
  </a>

  <button v-else :type="type" :class="buttonClasses" :disabled="disabled || loading">
    <IconLoader2 v-if="loading" class="logoClasses" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { IconLoader2 as IconLoader2Raw } from '@tabler/icons-vue'

const IconLoader2 = markRaw(IconLoader2Raw)

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  block: false,
  disabled: false,
  loading: false,
  type: 'button'
})

const buttonClasses = computed(() => [
  'btn',
  props.variant === 'primary' ? 'btn-primary' : '',
  props.variant === 'secondary' ? 'btn-secondary' : '',
  props.variant === 'danger' ? 'btn-danger' : '',
  props.variant === 'ghost' ? 'btn-ghost' : '',
  props.block ? 'w-full' : '',
  (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
])
</script>

<style scoped>
.logoClasses {
  @apply animate-spin -ml-1 mr-2 h-4 w-4 text-current;
}
</style>
