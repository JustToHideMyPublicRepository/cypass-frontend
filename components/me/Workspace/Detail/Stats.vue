<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div v-for="item in state" :key="item.label" class="p-6 rounded-[2rem] bg-WtB border border-ash shadow-sm">
      <div class="flex items-start gap-4">
        <div :class="[
          'w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0',
          item.iconBg, item.iconColor, item.iconBorder
        ]">
          <component :is="item.icon" class="w-6 h-6" />
        </div>
        <div class="min-w-0">
          <p>{{ item.label }}</p>
          <h5 class="truncate">{{ item.value }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconUsers, IconMapPin, IconCalendar } from '@tabler/icons-vue'
import type { Workspace } from '~/types/workspace'

const props = defineProps<{
  workspace: Workspace
  membersCount?: number
}>()

const state = computed(() => {
  const items = [
    {
      icon: IconUsers,
      label: 'Membres',
      value: String(props.membersCount ?? props.workspace.members_count ?? 1),
      iconBg: 'bg-primary/5',
      iconColor: 'text-primary',
      iconBorder: 'border-primary/10'
    }
  ]

  if (props.workspace.country) {
    items.push({
      icon: IconMapPin,
      label: 'Pays',
      value: props.workspace.country,
      iconBg: 'bg-secondary/5',
      iconColor: 'text-secondary',
      iconBorder: 'border-secondary/10'
    })
  }

  const dateStr = props.workspace.created_at
  const date = dateStr ? new Date(dateStr) : null
  const formattedDate = date && !isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : '—'

  items.push({
    icon: IconCalendar,
    label: 'Création',
    value: formattedDate,
    iconBg: 'bg-warning/5',
    iconColor: 'text-warning',
    iconBorder: 'border-warning/10'
  })

  return items
})
</script>