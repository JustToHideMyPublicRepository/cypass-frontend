<template>
  <UiBaseCard class="border border-ashAct shadow-sm">
    <div class="flex items-start gap-4 mb-6">
      <div class="p-3 rounded-xl transition-colors shrink-0" :class="actionClass">
        <component :is="actionIcon" class="w-6 h-6" />
      </div>
      <div>
        <h3 class="font-bold text-BtW text-lg leading-tight mb-1">{{ log.action_label || logInfo.label }}</h3>
        <span v-if="log.status !== 'success'"
          class="px-2 py-0.5 text-[10px] bg-danger text-white rounded-full font-black uppercase inline-block mt-1">
          {{ getLogActionInfo(log.action_type).label }}
        </span>
        <span v-else
          class="px-2 py-0.5 text-[10px] bg-success/20 text-success rounded-full font-black uppercase inline-block mt-1">
          Succès
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Date et Heure</p>
        <p class="text-sm font-medium text-BtW flex items-center gap-2">
          <IconClock class="w-4 h-4 text-primary" />
          {{ formatFullDate(log.created_at) }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Adresse IP</p>
        <p class="text-sm font-medium font-code text-BtW flex items-center gap-2">
          <IconNetwork class="w-4 h-4 text-hsa" />
          {{ log.ip_address }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Navigateur / Appareil</p>
        <p class="text-sm font-medium text-BtW flex items-center gap-2" :title="log.user_agent">
          <component :is="getSessionIcon(log)" class="w-4 h-4 text-hsa" />
          {{ formatSessionLabel(log) || 'Inconnu' }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Catégorie</p>
        <p class="text-xs font-medium font-code text-hsa truncate uppercase flex items-center gap-2">
          <component :is="getLogTypeInfo(log.log_type)?.icon" class="w-4 h-4" />
          {{ getLogTypeInfo(log.log_type)?.label || 'Activités utilisateur' }}
        </p>
      </div>

      <div class="space-y-1">
        <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">ID d'Événement</p>
        <p class="text-xs font-medium font-code text-hsa truncate">
          {{ log.id }}
        </p>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconNetwork, IconClock } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getLogActionInfo, getLogTypeInfo } from '~/utils/logs'
import { getSessionIcon as getSessionIconRaw, formatSessionLabel } from '~/utils/sessions'
import type { LogEntry } from '~/types/profil'

const props = defineProps<{
  log: any
}>()

const getSessionIcon = (log: any) => getSessionIconRaw(log)

const logInfo = computed(() => props.log ? getLogActionInfo(props.log.action_type) : getLogActionInfo(''))
const actionIcon = computed(() => logInfo.value.icon)
const actionClass = computed(() => `${logInfo.value.color.replace('text-', 'bg-')}/10 ${logInfo.value.color}`)

const formatFullDate = (ts: string) => {
  if (!ts) return ''
  try {
    const normalizedTs = ts.includes('T') ? ts : ts.replace(' ', 'T')
    return format(new Date(normalizedTs), "EEEE d MMMM yyyy 'à' HH:mm:ss", { locale: fr })
  } catch (e) {
    return ts
  }
}
</script>
