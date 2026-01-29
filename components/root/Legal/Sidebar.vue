<template>
  <div class="hidden lg:block lg:col-span-1">
    <div class="sticky top-32 space-y-4">
      <h3 class="font-bold mb-4 px-4">Sommaire</h3>
      <nav class="flex flex-col space-y-1">
        <a v-for="item in toc" :key="item.id" :href="`#${item.id}`"
          class="px-4 py-2 text-sm rounded-lg transition-colors text-hsa hover:text-primary hover:bg-ash"
          :class="{ 'text-primary bg-ash/50 font-medium': activeSection === item.id }">
          {{ item.label }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TocItem {
  id: string
  label: string
}

defineProps<{
  toc: TocItem[]
  activeSection?: string
}>()
</script>
