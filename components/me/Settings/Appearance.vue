<template>
  <UiBaseCard title="Apparence">
    <div class="space-y-4">
      <div class="flex items-center justify-between p-4 rounded-xl bg-ash/30 border border-ash">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-WtB rounded-lg shadow-sm">
            <IconDeviceDesktop v-if="$colorMode.preference === 'system'" class="w-6 h-6 text-primary" />
            <IconMoon v-else-if="$colorMode.preference === 'dark'" class="w-6 h-6 text-primary" />
            <IconSun v-else class="w-6 h-6 text-warning" />
          </div>
          <div>
            <h3 class="font-bold text-BtW">Thème du système</h3>
            <p class="text-sm text-hsa">Basculer entre le mode clair et sombre.</p>
          </div>
        </div>
        <ClientOnly>
          <select v-model="$colorMode.preference"
            class="px-4 py-2 rounded-lg bg-WtB border border-ash focus:ring-2 focus:ring-primary outline-none text-BtW text-sm cursor-pointer">
            <option value="system">Système</option>
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
          </select>
        </ClientOnly>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-vue'
</script>
