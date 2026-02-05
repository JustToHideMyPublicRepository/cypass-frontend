<template>
  <div class="pt-6 md:pt-8 border-t border-ash">
    <h3 class="text-xl font-bold mb-4 md:mb-6">Spécifications Techniques</h3>
    <div class="space-y-2 md:space-y-4">
      <div v-for="spec in specs" :key="spec.label"
        class="flex items-center justify-between py-2 md:py-3 border-b border-ash/50">
        <span class="text-hsa text-sm md:text-base font-medium">{{ spec.label }}</span>
        <span class="text-BtW font-code text-[10px] md:text-sm bg-ash px-2 py-1 rounded">
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
