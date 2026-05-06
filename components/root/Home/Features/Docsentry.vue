<template>
  <!-- DocSentry: Certification Dashboard — clean, trust-focused design -->
  <div class="relative rounded-3xl overflow-hidden border border-ash/40 shadow-2xl bg-bgClr group select-none">
    <!-- Top accent bar -->
    <div class="h-1 bg-gradient-to-r from-primary via-success to-secondary" />

    <!-- Header bar -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-ash/30 bg-WtB/40 backdrop-blur-sm">
      <div class="flex items-center gap-2">
        <IconShieldCheck class="w-4 h-4 text-success" />
        <span class="text-xs font-bold text-BtW uppercase tracking-widest">DocSentry</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span class="text-[10px] text-success font-bold uppercase">Live</span>
      </div>
    </div>

    <div class="p-5 space-y-4">
      <!-- Document card -->
      <div class="rounded-2xl border border-ash/40 bg-WtB/60 p-4 backdrop-blur-sm">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <IconFileCheck class="w-5 h-5 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-BtW truncate">Contrat-Partnership-2026.pdf</p>
            <p class="text-[10px] text-hsa mt-0.5">Émis par CYPASS · 2.4 MB</p>
          </div>
          <div class="px-2 py-1 rounded-lg bg-success/10 border border-success/20 text-[10px] font-bold text-success shrink-0">
            VALIDE
          </div>
        </div>
      </div>

      <!-- Validation timeline -->
      <div class="space-y-2.5">
        <p class="text-[10px] font-bold uppercase tracking-widest text-hsa px-1">Parcours de Certification</p>
        <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-3">
          <div class="relative flex flex-col items-center">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 shrink-0 transition-all duration-500"
              :class="step.done ? 'bg-success border-success shadow-[0_0_8px_rgba(var(--color-success),0.5)]' : 'bg-ash/40 border-ash/40'"
            >
              <IconCheck v-if="step.done" class="w-3.5 h-3.5" />
              <span v-else class="w-1.5 h-1.5 rounded-full bg-hsa/40" />
            </div>
            <div v-if="i < steps.length - 1" class="w-px h-3 mt-0.5" :class="step.done ? 'bg-success/40' : 'bg-ash/30'" />
          </div>
          <div class="flex-1 pb-3">
            <p class="text-xs font-semibold" :class="step.done ? 'text-BtW' : 'text-hsa/60'">{{ step.label }}</p>
            <p class="text-[10px] text-hsa/70 mt-0.5">{{ step.time }}</p>
          </div>
        </div>
      </div>

      <!-- SHA fingerprint -->
      <div class="rounded-xl border border-ash/30 bg-ash/10 p-3 flex items-center gap-2">
        <IconFingerprint class="w-4 h-4 text-primary shrink-0" />
        <span class="text-[10px] font-code text-hsa truncate">SHA-256: 8f3a2c...e29b14</span>
        <IconCopy class="w-3.5 h-3.5 text-hsa/50 shrink-0 ml-auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconFileCheck, IconCheck, IconFingerprint, IconCopy } from '@tabler/icons-vue'

const steps = [
  { label: 'Document reçu & hashé', time: 'Aujourd\'hui, 09:41', done: true },
  { label: 'Signature numérique appliquée', time: 'Aujourd\'hui, 09:41', done: true },
  { label: 'Enregistrement blockchain', time: 'Aujourd\'hui, 09:42', done: true },
  { label: 'QR Code de vérification généré', time: 'Aujourd\'hui, 09:42', done: false },
]
</script>
