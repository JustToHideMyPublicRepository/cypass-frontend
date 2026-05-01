<template>
  <UiBaseCard title="Statistiques">
    <template #header>
      <button @click="isCollapsed = !isCollapsed" class="p-1 hover:bg-ash rounded-lg transition-colors text-hsa"
        :title="isCollapsed ? 'Déplier' : 'Replier'">
        <IconChevronDown class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': !isCollapsed }" />
      </button>
    </template>

    <div v-show="!isCollapsed" class="space-y-4 animate-fade-in">
      <div class="flex items-center justify-between p-3 rounded-xl bg-ash/50 border border-ash/50">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <IconFileTextFilled class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-hsa uppercase tracking-wider">Total Docs</span>
        </div>
        <span class="text-lg font-black text-BtW">{{ total }}</span>
      </div>

      <div class="flex items-center justify-between p-3 rounded-xl bg-ash/50 border border-ash/50">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-success/10 text-success">
            <IconShieldCheckFilled class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-hsa uppercase tracking-wider">Certifiés</span>
        </div>
        <span class="text-lg font-black text-BtW">{{ verified }}</span>
      </div>

      <div class="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Stockage</span>
          <span class="text-[10px] font-bold text-hsa">{{ usage }}%</span>
        </div>
        <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full transition-all duration-1000" :style="{ width: `${usage}%` }"></div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { IconFileTextFilled, IconShieldCheckFilled, IconChevronDown } from '@tabler/icons-vue'

defineProps<{
  total: number
  verified: number
  usage: number
}>()

const isCollapsed = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('cps_docsentry_stats')
  if (saved !== null) {
    isCollapsed.value = JSON.parse(saved)
  }
})

watch(isCollapsed, (newVal) => {
  localStorage.setItem('cps_docsentry_stats', JSON.stringify(newVal))
})
</script>
