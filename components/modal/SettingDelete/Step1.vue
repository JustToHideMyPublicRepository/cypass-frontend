<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Avertissement et impact de la suppression -->
    <div class="p-6 bg-danger/5 border-2 border-danger/10 rounded-[2rem] flex gap-5 shadow-inner backdrop-blur-sm">
      <div class="shrink-0 p-3 bg-danger/10 rounded-2xl h-fit text-danger shadow-xl shadow-danger/5">
        <IconAlertTriangle class="w-8 h-8" />
      </div>
      <div class="text-sm space-y-4">
        <p class="font-black text-danger uppercase tracking-widest text-base">Action de Haute Sécurité</p>
        <ul class="space-y-3 text-hsa font-medium">
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
            <span>Suppression définitive effective après un délai de <strong>48 heures</strong>.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
            <span>Possibilité d'annuler la procédure en vous reconnectant avant l'échéance.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
            <span>Les documents authentifiés resteront valides sur le réseau pour préserver l'intégrité de la
              chaîne.</span>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0"></span>
            <span>Toutes vos autres données de profil et préférences seront définitivement effacées.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Actions de l'étape 1 -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
      <UiBaseButton variant="ghost" @click="$emit('cancel')" v-tooltip="getLinkTooltip('modal_cancel')"
        class="!rounded-2xl border-none font-bold">
        Conserver mon compte
      </UiBaseButton>
      <UiBaseButton variant="primary" @click="$emit('next')" v-tooltip="getLinkTooltip('modal_next')"
        class="!rounded-2xl font-black tracking-widest shadow-xl">
        J'ai compris les risques
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'
import { getLinkTooltip } from '~/data/shortcuts'

defineEmits(['cancel', 'next'])
</script>
