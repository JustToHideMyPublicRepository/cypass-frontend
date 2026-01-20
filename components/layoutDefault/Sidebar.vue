<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 w-64 bg-WtB border-r border-ash transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="h-16 flex items-center px-6 border-b border-ash">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-lg bg-WtB flex items-center justify-center shadow-sm border border-ash p-0.5">
          <img src="/img/logo.png" alt="Logo CYPASS" class="w-full h-full object-contain" />
        </div>
        <span class="text-xl font-bold text-BtW group-hover:text-primary transition-colors">CYPASS</span>
      </NuxtLink>
    </div>

    <nav class="p-4 space-y-2">
      <NuxtLink v-for="link in mainLinks" :key="link.path" :to="link.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <component :is="link.icon" class="w-5 h-5" />
        <span>{{ link.label }}</span>
      </NuxtLink>

      <div class="px-4 py-2 text-xs font-semibold text-hsa uppercase tracking-wider mt-6">Modules</div>

      <NuxtLink v-for="link in moduleLinks" :key="link.path" :to="link.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <component :is="link.icon" class="w-5 h-5" />
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-ash">
      <button @click="$emit('logout')"
        class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-danger hover:bg-danger/10 hover:text-dangerAct transition-colors">
        <IconLogout class="w-5 h-5" />
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { IconLayoutDashboard as IconDashboard, IconFileCertificate, IconScanEye, IconRadar2, IconLogout } from '@tabler/icons-vue'

const mainLinks = [
  { label: 'Vue d\'ensemble', path: '/dashboard', icon: IconDashboard }
]

const moduleLinks = [
  { label: 'DocSentry', path: '/dashboard/docsentry', icon: IconFileCertificate },
  { label: 'SecuScan', path: '/dashboard/secuscan', icon: IconScanEye },
  { label: 'VigiTech', path: '/dashboard/vigitech', icon: IconRadar2 }
]

defineProps<{
  isOpen: boolean
}>()

defineEmits(['logout'])
</script>
