<template>
  <UiBaseCard title="Actions rapides">
    <div class="grid grid-cols-2 gap-3">
      <UiBaseButton @click="$emit('upload')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-primary/10 !text-primary hover:!bg-primary hover:!text-WtB transition-all group !h-auto">
        <div
          class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconPlus class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider">Certifier</span>
      </UiBaseButton>

      <UiBaseButton @click="$emit('verify')" variant="ghost"
        class="!flex !flex-col !items-center !justify-center !p-4 !rounded-2xl !bg-secondary/10 !text-secondary hover:!bg-secondary hover:!text-white transition-all group !h-auto">
        <div
          class="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
          <IconShieldCheck class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider">Vérifier</span>
      </UiBaseButton>
    </div>

    <div class="mt-6 space-y-2">
      <h4 class="text-[10px] font-bold text-hsa uppercase tracking-widest px-1">Accès rapide</h4>
      <div class="grid grid-cols-1 gap-1">
        <UiBaseButton v-for="link in quickLinks" :key="link.path" @click="navigateTo(link.path)" variant="ghost"
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
import { IconPlus, IconShieldCheck, IconFiles, IconSettings, IconDevices, IconChevronRight } from '@tabler/icons-vue'

defineEmits(['upload', 'verify'])

const quickLinks = [
  { label: 'Mes documents', path: '/dashboard/docsentry', icon: IconFiles },
  { label: 'Sessions actives', path: '/dashboard/sessions', icon: IconDevices },
  { label: 'Profil', path: '/dashboard/profile', icon: IconSettings }
]
</script>
