<template>
  <UiBaseCard title="Activités Vigitech" subtitle="Derniers incidents signalés">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/vigitech')">Veille</UiBaseButton>
    </template>
    <div class="space-y-1">
      <div v-if="loading && !incidents.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!incidents.length" class="py-10 text-center text-hsa">
        Aucun incident récent
      </div>
      <div v-for="incident in incidents" :key="incident.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="navigateTo(`/dashboard/vigitech/${incident.id}`)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors">
            <IconAlertTriangle class="w-4 h-4 text-hsa group-hover:text-primary" />
          </div>
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-BtW truncate">{{ incident.title }}</h4>
            <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(incident.created_at) }}</p>
          </div>
        </div>
        <UiStatusBadge :status="incident.threat_level" size="sm" />
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'

defineProps<{
  incidents: any[]
  loading: boolean
  formatTime: (ts: string) => string
}>()
</script>
