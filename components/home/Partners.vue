<template>
  <section class="py-12 border-y border-ash/50 bg-WtB/30 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-bold text-hsa uppercase tracking-[0.2em] mb-8">Partenaires de
        Confiance & Institutionnels</p>
      <div
        class="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <span class="text-2xl font-bold font-serif ">
          GOUV.BJ
        </span>
        <span class="text-xl font-bold  border-2 border-current px-2 py-1">ASIN</span>
        <div class="flex items-center gap-2 ">
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
