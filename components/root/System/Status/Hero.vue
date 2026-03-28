<template>
  <div class="text-center space-y-3 md:space-y-4 animate-fade-up relative group">
    <h1 class="text-3xl md:text-5xl font-black tracking-tight">
      Système <span :class="status.colorClass">{{ status.label }}</span>
    </h1>
    <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto">
      Statut en temps réel de nos services et infrastructures.
    </p>

    <button @click="refreshData"
      class="absolute top-0 right-0 p-2 rounded-full hover:bg-ashAct/50 transition-all text-hsa hover:text-BtW group-hover:opacity-100 opacity-0 md:opacity-100 flex items-center gap-2"
      title="Rafraîchir" :disabled="systemStore.loadingComponents || systemStore.loadingHystory">
      <IconRefresh class="w-5 h-5"
        :class="{ 'animate-spin': systemStore.loadingComponents || systemStore.loadingHystory }" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconRefresh } from '@tabler/icons-vue'
import { useSystemStore } from '~/stores/back/public/system'
import { getGlobalStatus } from '~/utils/system'

const systemStore = useSystemStore()

const status = computed(() => {
  const global = getGlobalStatus(systemStore.components)
  if (!global) {
    return {
      label: 'en chargement...',
      colorClass: 'text-hsa'
    }
  }
  return {
    label: global.globalLabel,
    colorClass: global.color
  }
})

const refreshData = async () => {
  await Promise.all([
    systemStore.fetchSystemStatus(),
    systemStore.fetchSystemHystory()
  ])
}
</script>
