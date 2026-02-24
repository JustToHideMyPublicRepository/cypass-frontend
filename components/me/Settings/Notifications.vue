<template>
  <UiBaseCard title="Notifications" class="!rounded-[2rem]">
    <div class="space-y-6">
      <div v-for="(setting, index) in settingsList" :key="index"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Toggle Switch Premium -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="setting.enabled" class="sr-only peer">
          <div class="input-toggle-slider">
          </div>
        </label>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const settingsList = reactive([
  {
    title: 'Alertes de sécurité critiques',
    desc: 'Recevoir une alerte immédiate en cas de faille détectée.',
    enabled: true
  },
  {
    title: 'Mises à jour de DocSentry',
    desc: 'Notifications lors de la validation d\'un document.',
    enabled: true
  },
  {
    title: 'Newsletter VigiTech',
    desc: 'Résumé hebdomadaire des menaces cybernétiques.',
    enabled: false
  },
])
</script>
