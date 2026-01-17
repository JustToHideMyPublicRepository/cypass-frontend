<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
    <div v-if="$slots.header || title" class="mb-4 flex items-center justify-between">
      <h3 v-if="title" class="text-lg font-semibold text-BtW">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div class="text-slate-600 dark:text-slate-300">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
