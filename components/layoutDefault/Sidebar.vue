<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 w-64 bg-WtB border-r border-ash transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="h-16 flex items-center px-6 border-b border-ash">
      <div
        class="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-2">
        C</div>
      <span class="text-xl font-bold text-BtW">CYPASS</span>
    </div>

    <nav class="p-4 space-y-2">
      <NuxtLink to="/dashboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <IconDashboard class="w-5 h-5" />
        <span>Vue d'ensemble</span>
      </NuxtLink>

      <div class="px-4 py-2 text-xs font-semibold text-hsa uppercase tracking-wider mt-6">Modules</div>

      <NuxtLink to="/dashboard/docsentry"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <IconFileCertificate class="w-5 h-5" />
        <span>DocSentry</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/secuscan"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <IconScanEye class="w-5 h-5" />
        <span>SecuScan</span>
      </NuxtLink>
      <NuxtLink to="/dashboard/vigitech"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
        active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
        <IconRadar2 class="w-5 h-5" />
        <span>VigiTech</span>
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

defineProps<{
  isOpen: boolean
}>()

defineEmits(['logout'])
</script>
