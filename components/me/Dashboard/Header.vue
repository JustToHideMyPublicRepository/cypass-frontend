<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        <span class="text-[10px] font-bold text-success uppercase tracking-widest">Connecté en tant que {{ role
          }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-BtW tracking-tight">
        Bienvenue, <span class="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">{{ userName
          }}</span>
      </h1>
      <p class="text-hsa text-sm font-medium">CYPASS veille sur l'intégrité de vos actifs numériques.</p>
    </div>

    <div class="flex items-center gap-3 px-4 py-2 bg-ash/50 rounded-2xl border border-ash backdrop-blur-md">
      <div class="p-2 bg-success/20 rounded-xl">
        <IconShieldCheck class="w-5 h-5 text-success" />
      </div>
      <div>
        <div class="text-[10px] font-bold text-hsa uppercase tracking-tighter line-clamp-1">Dernière mise à jour</div>
        <div class="text-xs font-bold text-BtW">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconShieldCheck } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  currentTime: string
}>()

const authStore = useAuthStore()
const userName = computed(() => authStore.user?.first_name || 'Utilisateur')
const role = computed(() => authStore.user?.role?.toUpperCase() || 'MEMBRE')
</script>
