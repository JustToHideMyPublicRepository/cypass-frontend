<template>
  <UiBaseCard class="h-full !p-0 overflow-hidden">
    <!-- Days of week Header -->
    <div class="grid grid-cols-7 border-b border-ash bg-primary">
      <div v-for="day in daysOfWeek" :key="day" class="py-3 px-2 text-center text-xs font-bold text-WtB uppercase">
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 grid-rows-5 bg-ash/5 gap-px">
      <div v-for="(dayObj, index) in calendarDays" :key="index" @click="goToDay(dayObj)"
        class="min-h-[120px] bg-WtB p-2 transition-colors duration-200 cursor-pointer group" :class="{
          'opacity-50 bg-hsa/10 hover:bg-hsa/20': !dayObj.isCurrentMonth,
          'hover:bg-primary/10': dayObj.isCurrentMonth,
          'ring-2 ring-primary ring-inset z-10': isToday(dayObj.date)
        }">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium"
            :class="isToday(dayObj.date) ? 'bg-primary text-WtB font-bold p-0.5 rounded-full' : 'text-BtW'">
            {{ format(dayObj.date, 'd') }}
          </span>
        </div>

        <!-- Events List (Max 2) -->
        <div class="space-y-1">
          <template v-for="(event, idx) in Math.min(dayObj.events.length, 2)" :key="dayObj.events[idx].id">
            <div class="text-xs px-1.5 py-1 rounded-md flex items-center gap-1.5 truncate"
              :class="[dayObj.events[idx].color, dayObj.events[idx].bgColor]" :title="dayObj.events[idx].title">
              <div class="w-1.5 h-1.5 rounded-full bg-current shrink-0"></div>
              <span class="truncate">{{ dayObj.events[idx].title }}</span>
            </div>
          </template>

          <!-- Overflow indicator -->
          <div v-if="dayObj.events.length > 2"
            class="text-xs text-hsa hover:text-primary font-medium px-1 mt-1 truncate">
            +{{ dayObj.events.length - 2 }} autres
          </div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay
} from 'date-fns'
import { useRouter } from 'vue-router'
import type { CalendarEvent } from '~/composables/useCalendarEvents'

const props = defineProps<{
  currentDate: Date
  eventsByDate: Record<string, CalendarEvent[]>
}>()

const router = useRouter()

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(props.currentDate), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(props.currentDate), { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start, end })

  return days.map(date => {
    const dateKey = format(date, 'yyyy-MM-dd')
    const events = props.eventsByDate[dateKey] || []

    return {
      date,
      dateKey,
      isCurrentMonth: isSameMonth(date, props.currentDate),
      events
    }
  })
})

const isToday = (date: Date) => {
  return isSameDay(date, new Date())
}

const goToDay = (dayObj: any) => {
  if (dayObj.events.length > 0) {
    router.push(`/dashboard/calendar/${dayObj.dateKey}`)
  }
}

const goToEvent = (event: CalendarEvent) => {
  if (event.url) {
    router.push(event.url)
  }
}
</script>
