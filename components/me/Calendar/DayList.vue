<template>
  <div class="space-y-4">
    <UiBaseCard v-for="event in events" :key="event.id"
      class="hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
      <!-- Color Bar on the left -->
      <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-opacity" :class="event.bgColor.replace('/10', '')">
      </div>

      <div class="flex items-start gap-4 p-2">
        <!-- Icon -->
        <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
          :class="[event.color, event.bgColor]">
          <IconFileText v-if="event.type === 'docsentry'" class="w-6 h-6" />
          <IconAlertTriangle v-else-if="event.type === 'vigitech'" class="w-6 h-6" />
          <IconMessage v-else-if="event.type === 'comment'" class="w-6 h-6" />
          <IconDeviceDesktop v-else-if="event.type === 'session'" class="w-6 h-6" />
          <IconActivity v-else class="w-6 h-6" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-4 mb-1">
            <h3 class="text-base font-bold text-BtW truncate group-hover:text-primary transition-colors">
              {{ event.title }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs font-medium text-hsa shrink-0">
              <IconClock class="w-3.5 h-3.5" />
              <span>{{ formatTime(event.date) }}</span>
            </div>
          </div>

          <p class="text-sm text-hsa line-clamp-2">
            {{ event.description }}
          </p>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs font-semibold px-2 py-1 rounded-md uppercase tracking-wide"
              :class="[event.color, event.bgColor]">
              {{ event.type }}
            </span>

            <NuxtLink v-if="event.url" :to="event.url"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Afficher les détails
              <IconArrowRight class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </UiBaseCard>

    <!-- Empty State -->
    <div v-if="events.length === 0" class="text-center py-12">
      <div class="w-16 h-16 rounded-full bg-ash/20 flex items-center justify-center mx-auto mb-4">
        <IconCalendarOff class="w-8 h-8 text-hsa" />
      </div>
      <h3 class="text-lg font-bold text-BtW mb-2">Aucun événement</h3>
      <p class="text-hsa">Il n'y a aucun événement enregistré pour cette date selon vos filtres actuels.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { IconClock, IconArrowRight, IconCalendarOff, IconFileText, IconAlertTriangle, IconMessage, IconActivity, IconDeviceDesktop } from '@tabler/icons-vue'
import type { CalendarEvent } from '~/composables/useCalendarEvents'

defineProps<{
  events: CalendarEvent[]
}>()

const formatTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '--:--'
    return format(d, 'HH:mm')
  } catch {
    return '--:--'
  }
}
</script>
