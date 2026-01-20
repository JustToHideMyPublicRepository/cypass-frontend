<template>
  <span :class="[
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    status === 'active' || status === 'Verified' ? 'bg-success/10 text-success' : '',
    status === 'pending' || status === 'Pending' || status === 'Medium' ? 'bg-warning/10 text-warning' : '',
    status === 'rejected' || status === 'Rejected' || status === 'High' ? 'bg-danger/10 text-danger' : '',
    status === 'Low' ? 'bg-primary/10 text-primary' : '',
  ]">
    <slot>{{ status }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string
}>()
</script>
