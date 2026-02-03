<template>
  <UiBaseCard class="!p-0 border-none overflow-hidden relative">
    <div class="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
      <div class="flex-1 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
          <IconLockShare class="w-3.5 h-3.5 text-primary" />
          <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Technologie DocSentry™</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
          Protégez l'intégrité de vos <br />
          <span class="text-primary italic">documents sensibles</span>
        </h2>
        <p class="text-white text-sm max-w-xl leading-relaxed">
          DocSentry utilise des algorithmes de hachage avancés pour garantir que vos fichiers n'ont jamais été altérés.
          Chaque certification crée une empreinte numérique unique et infalsifiable.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <div v-for="feature in features" :key="feature.title" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-primary"></div>
            <span class="text-xs font-bold text-white/80">{{ feature.title }}</span>
          </div>
        </div>
      </div>

      <div class="relative group">
        <div
          class="absolute -inset-4 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700">
        </div>
        <div
          class="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
          <IconShieldLock class="w-16 h-16 text-primary relative z-10 animate-pulse" />
          <div class="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconLockShare, IconShieldLock } from '@tabler/icons-vue'

const features = [
  { title: 'Hashage SHA-256' },
  { title: 'Signature Asymétrique' },
  { title: 'Preuve d\'Existance' }
]
</script>
