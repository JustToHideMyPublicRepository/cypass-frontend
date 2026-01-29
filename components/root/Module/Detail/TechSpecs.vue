<template>
  <div class="pt-8 border-t border-ash">
    <h3 class="text-xl font-bold mb-6">Spécifications Techniques</h3>
    <div class="space-y-4">
      <div v-for="spec in specs" :key="spec.label"
        class="flex items-center justify-between py-3 border-b border-ash/50">
        <span class="text-hsa font-medium">{{ spec.label }}</span>
        <span class="text-BtW font-code text-sm bg-ash px-2 py-1 rounded">
          {{ spec.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceTechSpec } from '@/data/modules'

defineProps<{
  specs: ServiceTechSpec[]
}>()
</script>
