<template>
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
    <div class="space-y-1">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
        <span class="text-[10px] font-bold text-primary uppercase tracking-widest">Section Sécurisée</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-black text-BtW tracking-tight">
        DocSentry <span class="text-hsa font-medium">/</span>
        <span class="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Certificats</span>
      </h1>
      <p class="text-hsa text-sm font-medium">Gérez et certifiez vos documents officiels en toute sécurité.</p>
    </div>

    <div class="flex items-center gap-3">
      <button @click="$emit('verify')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ash border border-ashAct text-BtW hover:bg-ashAct transition-all font-bold text-xs uppercase tracking-wider">
        <IconShieldCheck class="w-4 h-4 text-primary" />
        Vérifier
      </button>

      <button @click="$emit('upload')"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-WtB hover:bg-primary/90 transition-all font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:-translate-y-0.5">
        <IconPlus class="w-4 h-4" />
        Nouveau
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconPlus, IconShieldCheck } from '@tabler/icons-vue'
defineEmits(['upload', 'verify'])
</script>
