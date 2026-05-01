<template>
  <UiBaseCard title="Métadonnées Enrichies">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(value, key) in metadata" :key="key" class="space-y-1 p-3 rounded-xl bg-ash/30 border border-ash/50 hover:border-primary/30 transition-colors group">
        <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.15em] opacity-70 group-hover:text-primary transition-colors">{{ formatKey(key) }}</label>
        <p class="text-sm font-bold text-BtW break-all">{{ value || '—' }}</p>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
defineProps<{
  metadata?: Record<string, any>
}>()

const formatKey = (key: string) => {
  return key.replace(/_/g, ' ')
}
</script>
