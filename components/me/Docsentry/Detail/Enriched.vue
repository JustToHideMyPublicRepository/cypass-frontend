<template>
  <UiBaseCard title="Métadonnées Enrichies">
    <template #header>
      <div v-if="category"
        class="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
        {{ translateDocCategory(category) }}
      </div>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(value, key) in metadata" :key="key"
        class="space-y-1 p-3 rounded-xl bg-ash/30 border border-ash/50 hover:border-primary/30 transition-colors group">
        <label
          class="text-[10px] font-bold text-hsa uppercase tracking-[0.15em] opacity-70 group-hover:text-primary transition-colors">{{
            translateEnrichedField(key as string) }}</label>
        <p class="text-sm font-bold text-BtW break-all">{{ value || '—' }}</p>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { translateDocCategory, translateEnrichedField } from '~/utils/docsentry'

defineProps<{
  metadata?: Record<string, any>
  category?: string | null
}>()
</script>
