<template>
  <UiBaseCard title="Accès rapide">
    <template #header>
      <IconRefresh @click="refreshLinks" class="w-4 h-4 cursor-pointer hover:text-primary transition-colors text-hsa" />
    </template>

    <div class="grid grid-cols-1 gap-2">
      <UiBaseButton v-for="link in displayedLinks" :key="link.path" @click="handleActionClick(link)" variant="ghost"
        class="!flex !items-center !gap-3 !p-2.5 !rounded-xl hover:!bg-ash/50 transition-all !text-sm group text-BtW !w-full !justify-start !h-auto">
        <div class="w-9 h-9 rounded-lg bg-ash flex items-center justify-center group-hover:bg-BtW transition-colors">
          <component :is="link.icon" class="w-4 h-4 text-hsa group-hover:text-WtB" />
        </div>
        <span class="font-medium">{{ link.label }}</span>
        <IconChevronRight class="w-4 h-4 ml-auto text-ash group-hover:text-hsa transition-colors" />
      </UiBaseButton>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IconFiles, IconSettings, IconDevices, IconChevronRight, IconAlertTriangle, IconRefresh, IconHistory, IconShieldPlus, IconBell, IconCalendar, IconUserCircle
} from '@tabler/icons-vue'

const ALL_LINKS = [
  { label: 'Evenements', path: '/dashboard/calendar', icon: IconCalendar },
  { label: 'Mes documents', path: '/dashboard/docsentry', icon: IconFiles },
  { label: 'Notifications', path: '/dashboard/notifications', icon: IconBell },
  { label: 'Mes alertes', path: '/dashboard/vigitech', icon: IconAlertTriangle },
  { label: 'Logs système', path: '/dashboard/activities', icon: IconHistory },
  { label: 'Profil', path: '/dashboard/profile', icon: IconUserCircle },
  { label: 'Paramètres', path: '/dashboard/settings', icon: IconSettings },
  { label: 'Sessions actives', path: '/dashboard/sessions', icon: IconDevices },
  { label: 'Sécurité', path: '/dashboard/profile#security', icon: IconShieldPlus }
]

const displayedLinks = ref<any[]>([])

const refreshLinks = () => {
  const stats = JSON.parse(localStorage.getItem('cypass_action_stats') || '{}')

  // 1. Sort by count descending
  const sorted = [...ALL_LINKS].sort((a, b) => {
    const countA = stats[a.path] || 0
    const countB = stats[b.path] || 0
    return countB - countA
  })

  // 2. Take top 2
  const top2 = sorted.slice(0, 2)

  // 3. Take 1 random from the rest
  const remaining = sorted.slice(2)
  const random = remaining.length > 0
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : null

  const result = [...top2]
  if (random) result.push(random)

  displayedLinks.value = result
}

const handleActionClick = (link: any) => {
  // Track click in localStorage
  const stats = JSON.parse(localStorage.getItem('cypass_action_stats') || '{}')
  stats[link.path] = (stats[link.path] || 0) + 1
  localStorage.setItem('cypass_action_stats', JSON.stringify(stats))

  navigateTo(link.path)
}

onMounted(() => {
  refreshLinks()
})
</script>
