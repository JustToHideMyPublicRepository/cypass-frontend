<template>
  <!-- LeakMonitor: Dark Web Monitor — terminal aesthetic, drip-feed data -->
  <div class="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl bg-[#080b14] group select-none">
    <!-- Animated grid background -->
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary),0.04)_1px,transparent_1px)] bg-[length:22px_22px] pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080b14] pointer-events-none" />

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-primary/15 bg-primary/5 relative z-10">
      <div class="flex items-center gap-2">
        <IconEye class="w-4 h-4 text-primary" />
        <span class="text-xs font-bold text-primary uppercase tracking-widest font-code">LeakMonitor</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
        <span class="text-[10px] text-primary/80 font-code">Veille active</span>
      </div>
    </div>

    <!-- Terminal content -->
    <div class="p-4 space-y-4 relative z-10">
      <!-- Sources scanned -->
      <div class="space-y-1.5">
        <p class="text-[10px] text-primary/60 font-code uppercase tracking-widest mb-2">» Sources surveillées</p>
        <div v-for="source in sources" :key="source.name" class="flex items-center gap-3">
          <span class="text-[10px] text-hsa/50 font-code w-14 text-right shrink-0">{{ source.type }}</span>
          <div class="flex-1 h-px bg-ash/20" />
          <span class="text-[10px] font-code" :class="source.clean ? 'text-success' : 'text-danger'">
            {{ source.clean ? '✓ RAS' : '⚠ FUITE' }}
          </span>
          <span class="text-[10px] text-hsa/40 font-code shrink-0">{{ source.name }}</span>
        </div>
      </div>

      <!-- Alert box -->
      <div class="rounded-2xl border border-danger/30 bg-danger/5 p-3.5">
        <div class="flex items-center gap-2 mb-2">
          <IconAlertOctagon class="w-4 h-4 text-danger shrink-0" />
          <span class="text-xs font-bold text-danger">Fuite de données détectée</span>
        </div>
        <p class="text-[10px] font-code text-hsa/80">Fichier <span class="text-warning">credentials_bj_gov.zip</span>
          trouvé sur <span class="text-danger">darkweb.onion</span></p>
        <div class="mt-2 flex items-center gap-2">
          <span
            class="px-2 py-0.5 bg-danger/20 text-danger text-[9px] font-bold rounded uppercase border border-danger/20">Critique</span>
          <span class="text-[9px] text-hsa/50 font-code">Il y a 3 min</span>
        </div>
      </div>

      <!-- Score line -->
      <div class="flex items-center gap-3">
        <span class="text-[10px] text-hsa/60 font-code shrink-0">Score exposition</span>
        <div class="flex-1 h-1.5 rounded-full bg-ash/20 overflow-hidden">
          <div class="h-full w-[18%] bg-gradient-to-r from-success to-primary rounded-full" />
        </div>
        <span class="text-[10px] font-bold text-success font-code shrink-0">18 / 100</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEye, IconAlertOctagon } from '@tabler/icons-vue'

const sources = [
  { type: 'Pastebin', name: 'paste.io', clean: true },
  { type: 'Forum', name: 'breachforum', clean: false },
  { type: 'Telegram', name: '@dataleak_bj', clean: true },
  { type: 'GitHub', name: 'public repos', clean: true },
]
</script>
