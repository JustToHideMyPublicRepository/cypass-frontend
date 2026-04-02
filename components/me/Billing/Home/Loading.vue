<template>
  <div class="space-y-3">
    <UiBaseCard v-for="i in count" :key="i" class="p-4 border-ash/50 overflow-hidden">
      <div class="flex items-center gap-4">
        <UiAppSkeleton type="rect" width="48px" height="48px" radius="16px" />
        <div class="flex-1 space-y-2">
          <UiAppSkeleton type="text" width="40%" />
          <UiAppSkeleton type="text" width="20%" />
        </div>
        <div class="hidden md:flex gap-6 mr-6">
          <UiAppSkeleton type="text" width="60px" />
          <UiAppSkeleton type="text" width="60px" />
        </div>
        <UiAppSkeleton type="rect" width="80px" height="32px" radius="20px" />
        <div class="flex gap-2 last:mr-0">
          <UiAppSkeleton type="rect" width="40px" height="40px" radius="12px" />
          <UiAppSkeleton type="rect" width="40px" height="40px" radius="12px" />
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 3
})
</script>
