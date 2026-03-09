<template>
  <UiBaseCard class="!rounded-[2rem]">
    <!-- Custom Header for Collapse/Expand -->
    <template #header>
      <div class="flex-1 flex items-center justify-between cursor-pointer group"
        @click="settingsPref.toggleSection('region')">
        <h3 class="text-xl font-black text-BtW tracking-tight uppercase">Langue et Région</h3>
        <button class="p-2 rounded-full hover:bg-ash transition-colors text-hsa group-hover:text-primary">
          <IconChevronDown class="w-5 h-5 transition-transform duration-300"
            :class="{ '-rotate-180': settingsPref.display.region }" />
        </button>
      </div>
    </template>

    <div v-show="settingsPref.display.region" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase">Langue</label>
        <div class="relative">
          <IconLanguage class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <select
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW appearance-none">
            <option>Français (France)</option>
            <option>English (US)</option>
          </select>
        </div>
      </div>
      <!-- Sélection du fuseau horaire pour les horodatages -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase">Fuseau Horaire</label>
        <div class="relative">
          <IconClock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <select
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW appearance-none">
            <option>Africa/Porto-Novo (GMT+1)</option>
            <option>Europe/Paris (GMT+1)</option>
            <option>UTC (GMT+0)</option>
          </select>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconLanguage, IconClock, IconChevronDown } from '@tabler/icons-vue'
import { useSettingsPrefStore } from '~/stores/front/settingsPref'

const settingsPref = useSettingsPrefStore()
</script>
