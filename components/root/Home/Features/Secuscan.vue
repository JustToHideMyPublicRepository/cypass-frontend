<template>
  <!-- SecuScan: Vulnerability Heatmap — structured, clinical, data-driven -->
  <div class="relative rounded-3xl overflow-hidden border border-ash/40 shadow-2xl bg-bgClr group select-none">
    <!-- Subtle grid -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[length:24px_24px] pointer-events-none" />

    <!-- Header -->
    <div
      class="flex items-center justify-between px-5 py-3 border-b border-ash/30 bg-WtB/40 backdrop-blur-sm relative z-10">
      <div class="flex items-center gap-2">
        <IconScan class="w-4 h-4 text-warning" />
        <span class="text-xs font-bold text-BtW uppercase tracking-widest">SecuScan</span>
      </div>
      <span class="text-[10px] font-code text-hsa/60">Rapport #SC-2026-047</span>
    </div>

    <div class="p-5 space-y-4 relative z-10">
      <!-- Global score -->
      <div class="flex items-center gap-4 p-4 rounded-2xl border border-ash/30 bg-WtB/40">
        <div class="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 40 40" class="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="4" class="text-ash/20" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="100.5"
              stroke-dashoffset="21" stroke-linecap="round" class="text-success transition-all duration-700" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-black text-success">79</span>
          </div>
        </div>
        <div>
          <div class="text-base font-black text-BtW">Score de Sécurité</div>
          <div class="text-xs text-hsa mt-0.5">Bon · Améliorations possibles</div>
          <div class="flex items-center gap-1 mt-1.5">
            <IconTrendingUp class="w-3.5 h-3.5 text-success" />
            <span class="text-[10px] text-success font-bold">+12 pts ce mois</span>
          </div>
        </div>
      </div>

      <!-- Vulnerability breakdown -->
      <div class="space-y-2.5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-hsa">Vulnérabilités par sévérité</p>
        <div v-for="vuln in vulns" :key="vuln.label" class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full shrink-0" :class="vuln.dot" />
          <span class="text-xs text-hsa w-16 shrink-0">{{ vuln.label }}</span>
          <div class="flex-1 h-2 rounded-full bg-ash/20 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :class="vuln.bar"
              :style="{ width: vuln.pct }" />
          </div>
          <span class="text-xs font-bold text-BtW w-6 text-right shrink-0">{{ vuln.count }}</span>
        </div>
      </div>

      <!-- Top finding -->
      <div class="rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-start gap-2.5">
        <IconAlertTriangle class="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <div>
          <p class="text-xs font-bold text-warning">CVE-2024-3094 · Protocole obsolète</p>
          <p class="text-[10px] text-hsa/80 mt-0.5">TLS 1.0 toujours actif sur le port 443 — mise à jour recommandée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconTrendingUp, IconScan } from '@tabler/icons-vue'

const vulns = [
  { label: 'Critique', dot: 'bg-danger', bar: 'bg-danger', pct: '5%', count: '1' },
  { label: 'Élevée', dot: 'bg-warning', bar: 'bg-warning', pct: '15%', count: '3' },
  { label: 'Moyenne', dot: 'bg-primary', bar: 'bg-primary', pct: '30%', count: '6' },
  { label: 'Faible', dot: 'bg-success', bar: 'bg-success', pct: '50%', count: '11' },
]
</script>
