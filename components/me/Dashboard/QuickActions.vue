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
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconPlus, IconShieldCheck, IconAlertTriangle, IconMessages } from '@tabler/icons-vue'

defineEmits(['upload', 'verify', 'create'])
</script>
