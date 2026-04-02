<template>
  <div class="relative min-h-[400px]">
    <div v-if="loading" class="space-y-6">
      <div v-for="i in 5" :key="i" class="flex items-center gap-4">
        <UiAppSkeleton type="avatar" />
        <div class="space-y-2 flex-1">
          <UiAppSkeleton width="60%" height="16px" />
          <UiAppSkeleton width="40%" height="10px" />
        </div>
      </div>
    </div>

    <div v-else-if="!logs || logs.length === 0"
      class="text-center py-20 bg-ash/10 rounded-2xl border-2 border-dashed border-ashAct">
      <IconHistory class="w-16 h-16 mx-auto mb-4 opacity-10 text-hsa" />
      <p class="text-hsa font-bold">Aucune activité enregistrée pour cette sélection.</p>
      <p class="text-xs text-hsa mt-2 opacity-60">Essayez de modifier vos filtres ou de changer la date.</p>
    </div>

    <div v-else class="space-y-8">
      <div v-for="(logGroup, date) in groupedLogs" :key="date" class="space-y-4">
        <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-hsa opacity-40 flex items-center gap-4">
          {{ formatFullDate(date) }}
          <div class="h-px bg-ashAct flex-grow"></div>
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UiBaseCard v-for="log in logGroup" :key="log.id" @click="navigateTo(`/dashboard/activities/${log.id}`)"
            class="group hover:border-primary/30 transition-all duration-300 relative border border-ashAct cursor-pointer"
            :class="{ 'border-l-4 border-l-danger': log.status !== 'success' }">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-xl transition-colors shrink-0" :class="getActionClass(log.action_type)">
                <component :is="getActionIcon(log.action_type)" class="w-5 h-5" />
              </div>

              <div class="flex-grow min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <h3 class="font-bold text-BtW truncate">
                    {{ (log.action_label && log.action_label !== log.action_type) ? log.action_label :
                      getLogActionInfo(log.action_type).label }}
                  </h3>

                  <span v-if="log.status !== 'success'"
                    class="px-2 py-0.5 text-[8px] bg-danger text-white rounded-full font-black uppercase w-fit">
                    {{ getLogActionInfo(log.action_type).label }}
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <p class="text-[11px] text-hsa flex items-center gap-1.5">
                    <IconClock class="w-3.5 h-3.5 opacity-40" /> {{ formatTime(log.created_at) }}
                  </p>
                  <p class="text-[11px] font-code text-hsa flex items-center gap-1.5 opacity-60">
                    <IconPlus class="w-3.5 h-3.5 opacity-40" /> {{ log.ip_address }}
                  </p>
                  <p class="text-[11px] text-hsa flex items-center gap-1.5 truncate max-w-[200px]"
                    :title="log.user_agent">
                    <component :is="getSessionIcon(log)" class="w-3.5 h-3.5 opacity-40" /> {{ formatSessionLabel(log) }}
                  </p>
                </div>

                <div class="mt-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                  <span
                    class="px-2 py-0.5 text-[9px] bg-ash text-hsa rounded-full font-bold uppercase flex items-center gap-1.5 w-fit">
                    <component :is="getLogTypeInfo(log.log_type)?.icon" class="w-3 h-3 opacity-60" />
                    {{ getLogTypeInfo(log.log_type)?.label || 'Activités utilisateur' }}
                  </span>

                  <span v-if="log.details && Object.keys(log.details).length > 0" class="text-[9px] font-black uppercase tracking-widest text-hsa/40 bg-ash px-2 py-1 rounded-lg w-fit">
                    {{ formatQuickDetails(log.details) }}
                  </span>
                </div>
              </div>
            </div>
          </UiBaseCard>
        </div>
      </div>

      <!-- Pagination Controls -->
      <UiAppPagination :current-page="currentPage" :total-pages="totalPages"
        @change-page="(delta) => delta > 0 ? $emit('next-page') : $emit('prev-page')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { IconHistory, IconClock, IconPlus } from '@tabler/icons-vue'
import { format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getLogActionInfo, getLogTypeInfo } from '~/utils/logs'
import { formatSessionLabel, getSessionIcon as getSessionIconRaw } from '~/utils/sessions'

const getSessionIcon = (log: any) => markRaw(getSessionIconRaw(log))

defineProps<{
  logs: any[]
  groupedLogs: Record<string, any[]>
  loading: boolean
  currentPage: number
  totalPages: number
}>()

defineEmits(['next-page', 'prev-page'])

// Helpers
const getActionIcon = (action_type: string) => {
  return getLogActionInfo(action_type).icon
}

const getActionClass = (action_type: string) => {
  const info = getLogActionInfo(action_type)
  return `${info.color.replace('text-', 'bg-')}/10 ${info.color}`
}

const formatTime = (ts: string) => {
  if (!ts) return '--:--'
  try {
    const normalizedTs = ts.includes('T') ? ts : ts.replace(' ', 'T')
    const date = new Date(normalizedTs)
    if (isNaN(date.getTime())) return '--:--'
    return format(date, 'HH:mm')
  } catch (e) {
    return '--:--'
  }
}

const formatFullDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    if (isSameDay(date, new Date())) return "Aujourd'hui"
    return format(date, 'EEEE d MMMM yyyy', { locale: fr })
  } catch (e) {
    return dateString
  }
}

const formatQuickDetails = (details: any) => {
  if (!details) return ''
  const entries = Object.entries(details)
  if (entries.length === 0) return ''
  const [key, value] = entries[0]
  return `${key}: ${value}`
}
</script>
