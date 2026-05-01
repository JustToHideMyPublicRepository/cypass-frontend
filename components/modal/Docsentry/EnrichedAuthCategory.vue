<template>
  <div class="space-y-6 animate-fade-in">
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="i in 4" :key="i" class="p-4 rounded-xl border-2 border-ash/20 bg-ash/5 flex items-start gap-3">
        <UiAppSkeleton type="rect" width="40px" height="40px" class="rounded-lg" />
        <div class="flex-1 space-y-2">
          <UiAppSkeleton type="text" width="60%" />
          <UiAppSkeleton type="text" width="40%" height="10px" />
        </div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button v-for="cat in categories" :key="cat.key" @click="$emit('select', cat)"
        class="p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 group"
        :class="selectedCategory?.key === cat.key ? 'border-primary bg-primary/5' : 'border-ash bg-ash/20 hover:border-primary/30'">
        <div class="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <component :is="getDocCategoryIcon(cat.key)" class="w-5 h-5" />
        </div>
        <div>
          <h4 class="font-bold text-BtW text-sm">{{ cat.label }}</h4>
          <p class="text-[10px] text-hsa uppercase mt-1">{{ cat.fields.length }} champs requis</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDocCategoryIcon } from '~/utils/docsentry'

defineProps<{
  categories: any[]
  selectedCategory: any
  loading: boolean
}>()

defineEmits(['select'])
</script>
