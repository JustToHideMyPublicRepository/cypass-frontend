<template>
  <UiBaseCard title="Actions rapides">
    <div class="grid grid-cols-2 gap-3">
      <UiBaseButton @click="$emit('upload')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-primary/10 !text-primary hover:!bg-primary hover:!text-WtB transition-all group !h-auto shadow-sm">
        <div
          class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconPlus class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-center">Certifier</span>
      </UiBaseButton>

      <UiBaseButton @click="$emit('verify')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-secondary/10 !text-secondary hover:!bg-secondary hover:!text-white transition-all group !h-auto shadow-sm">
        <div
          class="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconShieldCheck class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-center">Vérifier</span>
      </UiBaseButton>

      <UiBaseButton @click="$emit('create')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-danger/10 !text-danger hover:!bg-danger hover:!text-white transition-all group !h-auto shadow-sm">
        <div
          class="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconAlertTriangle class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-center">Signaler</span>
      </UiBaseButton>

      <UiBaseButton @click="navigateTo('/dashboard/vigitech/comments')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-indigo-500/10 !text-indigo-600 hover:!bg-indigo-600 hover:!text-white transition-all group !h-auto shadow-sm">
        <div
          class="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconMessages class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-center">Commentaires</span>
      </UiBaseButton>
    </div>

    <div class="mt-6 space-y-2">
      <h4 class="text-[10px] font-bold text-hsa uppercase tracking-widest px-1 flex justify-between items-center">
        Accès rapide
        <IconRefresh @click="refreshLinks" class="w-3 h-3 cursor-pointer hover:text-primary transition-colors" />
      </h4>
      <div class="grid grid-cols-1 gap-1">
        <UiBaseButton v-for="link in displayedLinks" :key="link.path" @click="handleActionClick(link)" variant="ghost"
          class="!flex !items-center !gap-3 !p-2 !rounded-xl hover:!bg-ash/50 transition-all !text-sm group text-BtW !w-full !justify-start !h-auto">
          <div class="w-8 h-8 rounded-lg bg-ash flex items-center justify-center group-hover:bg-BtW transition-colors">
            <component :is="link.icon" class="w-4 h-4 text-hsa group-hover:text-WtB" />
          </div>
          <span class="font-medium">{{ link.label }}</span>
          <IconChevronRight class="w-4 h-4 ml-auto text-ash group-hover:text-hsa transition-colors" />
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  IconPlus, IconShieldCheck, IconFiles, IconSettings, IconDevices,
  IconChevronRight, IconAlertTriangle, IconMessages, IconRefresh,
  IconHistory, IconShieldPlus, IconBell
} from '@tabler/icons-vue'

defineEmits(['upload', 'verify', 'create'])

const ALL_LINKS = [
  { label: 'Mes documents', path: '/dashboard/docsentry', icon: IconFiles },
  { label: 'Sessions actives', path: '/dashboard/sessions', icon: IconDevices },
  { label: 'Profil', path: '/dashboard/profile', icon: IconSettings },
  { label: 'Incidents VigiTech', path: '/dashboard/vigitech', icon: IconAlertTriangle },
  { label: 'Logs système', path: '/dashboard/logs', icon: IconHistory },
  { label: 'Notifications', path: '/dashboard/notifications', icon: IconBell },
  { label: 'Sécurité Expert', path: '/dashboard/profile#security', icon: IconShieldPlus }
]

const displayedLinks = ref<any[]>([])

const refreshLinks = () => {
  const stats = JSON.parse(localStorage.getItem('cypass_action_stats') || '{}')

  // 1. Get stats and sort by count desc
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
