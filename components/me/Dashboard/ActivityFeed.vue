<template>
  <UiBaseCard title="Journal d'activité">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/logs')">Logs</UiBaseButton>
    </template>
    <div class="space-y-4">
      <div v-if="loading && !logs.length" class="py-10 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      <div v-else-if="!logs.length" class="py-10 text-center text-hsa">
        Aucune activité enregistrée
      </div>
      <div v-for="log in logs" :key="log.id"
        class="flex gap-3 text-sm p-2 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group">
        <div
          class="h-8 w-8 rounded-lg bg-ash flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
          <IconHistory class="w-4 h-4 text-hsa" />
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-xs font-bold text-BtW truncate">{{ log.action }}</h4>
          <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(log.timestamp) }}</p>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconHistory } from '@tabler/icons-vue'

defineProps<{
  logs: any[]
  loading: boolean
  formatTime: (ts: string) => string
}>()
</script>
