<template>
  <section
    class="py-12 border-y border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Partenaires de
        Confiance & Institutionnels</p>
      <div
        class="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <span class="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200">GOUV.BJ</span>
        <span class="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tighter">ASIN</span>
        <span
          class="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 border-2 border-current px-2 py-1">ASIN</span>
        <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <IconShield class="w-8 h-8" />
          <span class="text-xl font-bold">BJ-CSIRT</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShield } from '@tabler/icons-vue'
</script>
