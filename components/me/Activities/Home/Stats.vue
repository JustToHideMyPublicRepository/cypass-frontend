<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <UiBaseCard class="bg-primary/5 border-l-4 border-l-primary">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconActivity class="w-6 h-6 text-primary" />
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">{{ getDynamicTitle() }}</p>
          <p class="text-xl font-bold text-BtW leading-tight">{{ stats?.total_logs ?? 0 }}</p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-success/5 border-l-4 border-l-success">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconCircleCheck class="w-6 h-6 text-success" />
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Connexions</p>
          <p class="text-xl font-bold text-BtW leading-tight">
            {{ stats?.by_type?.['USER_LOGIN'] || stats?.by_type?.['Connexion réussie'] || 0 }}
          </p>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-danger/5 border-l-4 border-l-danger">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
          <IconAlertCircle class="w-6 h-6 text-danger" />
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Échecs</p>
          <p class="text-xl font-bold text-BtW leading-tight">
            {{ stats?.by_type?.['LOGIN_FAILED'] || stats?.by_type?.['Tentative de connexion échouée'] || 0 }}
          </p>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconActivity, IconCircleCheck, IconAlertCircle } from '@tabler/icons-vue'
import { format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  stats: any
  filters?: any
}>()

const getDynamicTitle = () => {
  if (!props.filters) return "Total aujourd'hui"
  
  if (props.filters.usePeriod) {
    return 'Total sur la période'
  }
  
  if (props.filters.date) {
    if (isSameDay(new Date(props.filters.date), new Date())) {
      return "Total aujourd'hui"
    }
    return "Total du " + format(new Date(props.filters.date), 'd MMM yyyy', { locale: fr })
  }
  
  return "Total"
}
</script>
