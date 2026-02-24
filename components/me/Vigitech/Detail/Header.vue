<template>
  <div class="p-6 md:p-8 space-y-6">
    <!-- Détails -->
    <div class="flex flex-wrap items-center gap-3">
      <UiStatusBadge
        :status="incident.threat_level === 'critical' ? 'High' : incident.threat_level === 'medium' ? 'Medium' : 'Low'">
        {{ mapThreatLevel(incident.threat_level) }}
      </UiStatusBadge>
      <div
        class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
        {{ mapIncidentType(incident.type) }}
      </div>
      <div v-if="incident.is_anonymous"
        class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-BtW text-WtB text-[10px] uppercase font-black tracking-widest">
        Anonyme
      </div>
      <div v-if="incident.views_count != null"
        class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ash/10 text-[10px] uppercase font-black tracking-widest text-hsa">
        <IconEye class="w-3.5 h-3.5" /> {{ incident.views_count }} vue{{ incident.views_count !== 1 ? 's' : '' }}
      </div>
    </div>

    <h2 class="text-2xl md:text-3xl font-black text-BtW leading-tight">
      {{ decodeHtmlEntities(incident.title) }}
    </h2>

    <div class="flex flex-wrap items-center gap-6 text-sm text-hsa">
      <div v-if="incident.location" class="flex items-center gap-2">
        <IconMapPin class="w-4 h-4 text-primary" /> {{ decodeHtmlEntities(incident.location) }}
      </div>
      <div class="flex items-center gap-2">
        <IconCalendar class="w-4 h-4 text-primary" /> {{ formattedDate }}
      </div>
      <!-- Author info -->
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-full overflow-hidden border border-ash/20 bg-ash/10 shrink-0 flex items-center justify-center">
          <template v-if="incident.is_anonymous || incident.is_anonymous === 1">
            <IconUserOff class="w-5 h-5 text-hsa/50" />
          </template>
          <img v-else :src="userAvatarUrl" class="w-full h-full object-cover" />
        </div>
        <div class="min-w-0">
          <template v-if="incident.is_anonymous || incident.is_anonymous === 1">
            Utilisateur anonyme
          </template>
          <template v-else>
            <NuxtLink to="/dashboard/profile" class="hover:text-primary hover:underline transition-colors">
              {{ authorName }}
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEye, IconMapPin, IconCalendar, IconUserOff } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { decodeHtmlEntities } from '~/utils/format'
import { mapIncidentType, mapThreatLevel } from '~/utils/vigitech'
import { getUserAvatarUrl } from '~/utils/user'

const props = defineProps<{
  incident: any
}>()

const formattedDate = computed(() => {
  if (!props.incident?.created_at) return '-'
  return format(new Date(props.incident.created_at), 'PPP p', { locale: fr })
})

const userAvatarUrl = computed(() => {
  return getUserAvatarUrl(
    (props.incident as any).user_avatar || null,
    props.incident.author_first_name || null,
    props.incident.author_last_name || null
  )
})

const authorName = computed(() => {
  return [props.incident.author_first_name, props.incident.author_last_name].filter(Boolean).join(' ') || 'Utilisateur'
})
</script>
