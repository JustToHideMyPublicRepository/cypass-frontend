<template>
  <template v-for="i in count" :key="i">
    <tr>
      <td colspan="5" class="px-6 py-4">
        <div class="flex items-center gap-4">
          <UiAppSkeleton type="avatar" />
          <div class="space-y-2 flex-1">
            <UiAppSkeleton width="40%" height="12px" />
            <UiAppSkeleton width="20%" height="8px" />
          </div>
          <div class="hidden md:block w-32">
            <UiAppSkeleton height="10px" />
          </div>
          <div class="hidden md:block w-24">
            <UiAppSkeleton height="10px" />
          </div>
        </div>
      </td>
    </tr>
  </template>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 5
})
</script>
