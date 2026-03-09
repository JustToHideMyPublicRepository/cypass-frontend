<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
    <div>
      <h1 class="text-2xl font-bold text-BtW">Centre de signalement</h1>
      <p class="text-hsa text-sm font-medium">
        Gérez vos signalements envoyés et reçus en toute confidentialité.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <div class="relative group">
        <select :value="reportStore.reportType" @change="handleTypeChange"
          class="appearance-none bg-ash/10 hover:bg-ash/20 border border-ashAct text-BtW text-xs font-black uppercase tracking-widest py-2 px-8 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
          <option value="user">Utilisateurs</option>
          <option value="incident">Incidents</option>
        </select>
        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-hsa">
          <IconChevronDown class="w-4 h-4" />
        </div>
      </div>

      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading" class="!px-3 !rounded-xl"
        title="Actualiser">
        <IconRefresh class="w-4 h-4" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRefresh, IconChevronDown } from '@tabler/icons-vue'
import { useReportStore } from '~/stores/back/user/report'

const reportStore = useReportStore()

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits(['refresh', 'change'])

const handleTypeChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as 'user' | 'incident'
  reportStore.setReportType(value)
  emit('change', value)
  emit('refresh')
}
</script>
