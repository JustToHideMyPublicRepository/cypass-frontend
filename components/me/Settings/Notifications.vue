<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsStore.toggleSection('notifications')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Notifications</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsStore.display.notifications }" />
        </button>
      </div>
    </template>

    <!-- Collapsible Content -->
    <div v-show="settingsStore.display.notifications" class="space-y-6 animate-fade-in">
      <!-- Liste des différents types de notifications paramétrables -->
      <div v-for="(setting, index) in settingsList" :key="index"
        class="flex items-center justify-between gap-4 p-5 rounded-[2rem] bg-ash/20 border border-ashAct/30 transition-all hover:bg-ash/40 group/setting shadow-inner">
        <div class="flex-1">
          <!-- Nom de la notification -->
          <h4 class="font-black text-BtW text-sm uppercase tracking-tight">{{ setting.title }}</h4>
          <!-- Description de l'utilité de la notification -->
          <p class="text-[11px] text-hsa leading-tight mt-1 font-medium opacity-70">{{ setting.desc }}</p>
        </div>

        <!-- Interrupteur -->
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
import { IconChevronDown } from '@tabler/icons-vue'
import { useSettingsPrefStore } from '~/stores/settingsPref'

const settingsStore = useSettingsPrefStore()

// Liste réactive des réglages de notification disponibles
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
