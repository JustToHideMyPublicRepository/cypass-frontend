<template>
  <div class="space-y-3 md:space-y-4 animate-fade-up" style="animation-delay: 100ms">
    <h3 class="text-base md:text-lg font-bold pl-2">Composants</h3>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 6" :key="i"
        class="glass-panel p-4 md:px-6 rounded-xl md:rounded-2xl border border-ash/50 flex items-center justify-between gap-4">
        <UiAppSkeleton type="text" width="160px" />
        <div class="flex items-center gap-3">
          <UiAppSkeleton type="text" width="80px" height="12px" />
          <UiAppSkeleton type="circle" width="10px" height="10px" />
        </div>
      </div>
    </div>

    <template v-else>
      <div v-for="component in mappedComponents" :key="component.name"
        class="glass-panel p-4 md:px-6 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border border-ash/50">
        <div class="flex items-center gap-2">
          <UiAppTooltip v-if="component.description" :content="component.description" :title="component.name"
            width-class="w-72" />
          <span class="font-medium text-sm md:text-base">{{ component.name }}</span>
        </div>
        <div class="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span class="text-xs font-bold" :class="component.statusColor">{{ component.statusLabel }}</span>
          <div class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" :class="component.dotColor"
            :style="{ boxShadow: component.shadow }"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSystemStore } from '~/stores/back/public/system'
import { getStatusInfo } from '~/utils/system'

const systemStore = useSystemStore()
const loading = computed(() => systemStore.loadingComponents && systemStore.components.length === 0)

const mappedComponents = computed(() => {
  return systemStore.components.map(c => {
    const info = getStatusInfo(c.status)
    return {
      name: c.name,
      description: c.description,
      statusLabel: info.label,
      statusColor: info.color,
      dotColor: info.dot,
      shadow: info.shadow
    }
  })
})
</script>
