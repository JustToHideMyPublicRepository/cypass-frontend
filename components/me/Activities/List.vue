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

        <div class="grid grid-cols-1 gap-4">
          <UiBaseCard v-for="log in logGroup" :key="log.id"
            class="group hover:border-primary/30 transition-all duration-300 relative border border-ashAct"
            :class="{ 'border-l-4 border-l-danger': log.status !== 'success' }">
            <div class="flex items-center gap-4">
              <div class="p-3 rounded-xl transition-colors shrink-0" :class="getActionClass(log.action)">
                <component :is="getActionIcon(log.action)" class="w-5 h-5" />
              </div>

              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-BtW truncate">
                    {{ (log.action_label && log.action_label !== log.action) ? log.action_label :
                      getLogActionInfo(log.action).label }}
                  </h3>
                  <span v-if="log.status !== 'success'"
                    class="px-2 py-0.5 text-[8px] bg-danger text-white rounded-full font-black uppercase">
                    Échec
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <p class="text-[11px] text-hsa flex items-center gap-1.5">
                    <IconClock class="w-3.5 h-3.5 opacity-40" /> {{ formatTime(log.timestamp) }}
                  </p>
                  <p class="text-[11px] font-code text-hsa flex items-center gap-1.5 opacity-60">
                    <IconPlus class="w-3.5 h-3.5 opacity-40" /> {{ log.ip_address }}
                  </p>
                  <p class="text-[11px] text-hsa flex items-center gap-1.5 truncate max-w-[200px]"
                    :title="log.user_agent">
                    <IconDeviceDesktop class="w-3.5 h-3.5 opacity-40" /> {{ formatUA(log.user_agent) }}
                  </p>
                </div>
              </div>

              <div v-if="log.details && Object.keys(log.details).length > 0" class="hidden md:block">
                <span class="text-[9px] font-black uppercase tracking-widest text-hsa/40 bg-ash px-2 py-1 rounded-lg">
                  {{ formatQuickDetails(log.details) }}
                </span>
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
import {
  IconHistory, IconClock, IconPlus, IconDeviceDesktop
} from '@tabler/icons-vue'
import { format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getLogActionInfo } from '~/utils/logs'

defineProps<{
  logs: any[]
  groupedLogs: Record<string, any[]>
  loading: boolean
  currentPage: number
  totalPages: number
}>()

defineEmits(['next-page', 'prev-page'])

// Helpers
const getActionIcon = (action: string) => {
  return getLogActionInfo(action).icon
}

const getActionClass = (action: string) => {
  const info = getLogActionInfo(action)
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

const formatUA = (ua: string) => {
  if (!ua) return 'Navigateur'
  if (ua.includes('Windows')) return 'Windows PC'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('Android')) return 'Android'
  if (ua === 'node') return 'Système'
  return 'Navigateur'
}

const formatQuickDetails = (details: any) => {
  if (!details) return ''
  const entries = Object.entries(details)
  if (entries.length === 0) return ''
  const [key, value] = entries[0]
  return `${key}: ${value}`
}
</script>
