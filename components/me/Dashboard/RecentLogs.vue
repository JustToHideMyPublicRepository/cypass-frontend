<template>
  <UiBaseCard title="Journal d'aujourd'hui">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/activities')">Logs</UiBaseButton>
    </template>
    <div class="space-y-4">
      <div v-if="loading && !logs.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!logs.length" class="py-10 text-center text-hsa">
        Aucune activité enregistrée aujourd'hui
      </div>
      <div v-for="log in logs" :key="log.id"
        class="flex items-center gap-3 p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="navigateTo(`/dashboard/activities/${log.id}`)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors"
            :class="`${getLogActionInfo(log.action_type).color.replace('text-', 'bg-')}/5`">
            <component :is="getLogActionInfo(log.action_type).icon" class="w-4 h-4 text-hsa group-hover:text-primary"
              :class="getLogActionInfo(log.action_type).color" />
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-bold text-BtW truncate">
            {{ (log.action_label && log.action_label !== log.action_type) ? log.action_label :
              getLogActionInfo(log.action_type).label
            }}
          </h4>
          <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(log.created_at) }}</p>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { getLogActionInfo } from '~/utils/logs'

defineProps<{
  logs: any[]
  loading: boolean
  formatTime: (ts: string) => string
}>()
</script>
