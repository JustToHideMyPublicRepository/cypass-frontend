<template>
  <div class="space-y-4">
    <UiBaseCard v-for="event in paginatedEvents" :key="event.id"
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
          <IconAlertOctagon v-else-if="event.type === 'report'" class="w-6 h-6" />
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

            <NuxtLink v-if="event.url && event.type !== 'comment' && event.type !== 'report'" :to="event.url"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Afficher les détails
              <IconArrowRight class="w-3 h-3" />
            </NuxtLink>

            <button v-else-if="event.type === 'comment' || event.type === 'report'" @click="$emit('open-modal', event)"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Afficher un aperçu
              <IconSquareAsterisk class="w-3 h-3" />
            </button>
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

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
      <button @click="currentPage--" :disabled="currentPage === 1"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-WtB border border-ash text-BtW hover:bg-ash/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="sr-only">Précédent</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </button>

      <span class="text-sm font-medium text-BtW px-4">
        Page {{ currentPage }} sur {{ totalPages }}
      </span>

      <button @click="currentPage++" :disabled="currentPage === totalPages"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-WtB border border-ash text-BtW hover:bg-ash/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="sr-only">Suivant</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import { IconClock, IconArrowRight, IconCalendarOff, IconFileText, IconAlertTriangle, IconMessage, IconActivity, IconDeviceDesktop, IconAlertOctagon, IconSquareAsterisk } from '@tabler/icons-vue'
import type { CalendarEvent } from '~/composables/useCalendarEvents'

const props = defineProps<{
  events: CalendarEvent[]
}>()

defineEmits(['open-modal'])

const currentPage = ref(1)
const itemsPerPage = 5

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return props.events.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.events.length / itemsPerPage))
})

// Reset page when events change
watch(() => props.events, () => {
  currentPage.value = 1
}, { deep: true })

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
