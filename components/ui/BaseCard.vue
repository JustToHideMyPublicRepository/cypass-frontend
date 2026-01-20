<template>
  <div class="bg-WtB rounded-xl shadow-sm border border-ash p-6 transition-all hover:shadow-md">
    <div v-if="$slots.header || title" class="mb-4 flex items-center justify-between">
      <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div class="text-hsa">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-ash/50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
