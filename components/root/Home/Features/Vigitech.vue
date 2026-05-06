<template>
  <!-- VigiTech: Live Threat Feed — dark, urgent, data-rich -->
  <div class="relative rounded-3xl overflow-hidden border border-ash/40 shadow-2xl bg-[#0d0d0f] group select-none">
    <!-- Scanline overlay -->
    <div
      class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,100,0.015)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-60" />

    <!-- Header -->
    <div
      class="flex items-center justify-between px-5 py-3 border-b border-success/10 bg-success/5 backdrop-blur-sm relative z-20">
      <div class="flex items-center gap-2">
        <IconRadar2 class="w-4 h-4 text-success animate-spin-slow" />
        <span class="text-xs font-bold text-success uppercase tracking-widest font-code">VigiTech · Radar</span>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="px-2 py-0.5 bg-danger/20 border border-danger/40 text-danger text-[10px] font-bold rounded uppercase">3
          alertes</span>
      </div>
    </div>

    <!-- Threat items -->
    <div class="p-4 space-y-2.5 relative z-20">
      <div v-for="threat in threats" :key="threat.id"
        class="flex items-start gap-3 p-3 rounded-xl border transition-all duration-300"
        :class="threat.level === 'critique' ? 'border-danger/30 bg-danger/5' : threat.level === 'moyen' ? 'border-warning/20 bg-warning/5' : 'border-success/10 bg-success/5'">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          :class="threat.level === 'critique' ? 'bg-danger/15 text-danger' : threat.level === 'moyen' ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'">
          <component :is="threat.icon" class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-xs font-bold text-white truncate">{{ threat.title }}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0"
              :class="threat.level === 'critique' ? 'bg-danger/20 text-danger' : threat.level === 'moyen' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'">
              {{ threat.level }}
            </span>
          </div>
          <p class="text-[10px] text-hsa font-code">{{ threat.detail }}</p>
        </div>
        <span class="text-[9px] text-hsa/50 shrink-0 font-code">{{ threat.time }}</span>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-2 pt-1">
        <div v-for="stat in stats" :key="stat.label"
          class="rounded-xl border border-ash/20 bg-white/3 p-2.5 text-center">
          <div class="text-lg font-black" :class="stat.color">{{ stat.value }}</div>
          <div class="text-[9px] text-hsa/60 uppercase tracking-wide font-code">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconBug, IconShieldCheck, IconRadar2 } from '@tabler/icons-vue'

const threats = [
  { id: 1, icon: IconAlertTriangle, title: 'Tentative d\'intrusion détectée', detail: 'IP: 185.220.X.X · Port 22 · SSH Brute-force', level: 'critique', time: '2 min' },
  { id: 2, icon: IconBug, title: 'Injection SQL potentielle', detail: '/api/v1/users?id=1 OR 1=1--', level: 'moyen', time: '7 min' },
  { id: 3, icon: IconShieldCheck, title: 'Trafic HTTPS normal', detail: '1,204 requêtes · 0 anomalie', level: 'bas', time: '12 min' },
]

const stats = [
  { label: 'Incidents', value: '3', color: 'text-danger' },
  { label: 'Analysés', value: '1.2k', color: 'text-BtW' },
  { label: 'Bloqués', value: '98%', color: 'text-success' },
]
</script>
