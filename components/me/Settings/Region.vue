<template>
  <UiBaseCard title="Langue et Région">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
import { IconLanguage, IconClock } from '@tabler/icons-vue'
</script>
