<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      status === 'active' || status === 'Verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : '',
      status === 'pending' || status === 'Pending' || status === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : '',
      status === 'rejected' || status === 'Rejected' || status === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : '',
      status === 'Low' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : '',
    ]"
  >
    <slot>{{ status }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()
</script>
