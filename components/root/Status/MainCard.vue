<template>
  <div
    class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl animate-fade-up border-l-4 flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-lg transition-all"
    :class="[globalInfo?.borderColor || 'border-ash', globalInfo?.shadowColor || 'shadow-sm']">
    <div class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shrink-0"
      :class="[globalInfo?.bgColor || 'bg-ash/20', globalInfo?.textColor || 'text-hsa', { 'animate-pulse': !globalInfo }]">
      <component :is="globalInfo?.icon || IconInfoCircle" class="w-6 h-6 md:w-8 md:h-8" />
    </div>
    <div class="flex-grow w-full">
      <h2 class="text-xl md:text-2xl font-bold leading-tight">
        {{ globalInfo?.message || 'Vérification de l\'état du système...' }}
      </h2>
      <p class="text-sm md:text-base text-hsa mt-1">
        Dernière mise à jour : {{ statusStore.lastUpdate || '...' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconInfoCircle } from '@tabler/icons-vue'
import { useStatusStore } from '~/stores/back/public/status'
import { getGlobalStatus } from '~/utils/status'

const statusStore = useStatusStore()

const globalInfo = computed(() => {
  const global = getGlobalStatus(statusStore.components)
  if (!global) return null
  return {
    borderColor: global.borderColor,
    shadowColor: global.shadowColor,
    bgColor: global.bgColor,
    textColor: global.textColor,
    icon: global.icon,
    message: global.message
  }
})
</script>
