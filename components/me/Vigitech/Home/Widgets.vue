<template>
  <div class="space-y-6">
    <UiBaseCard title="Sources Surveillées" class="!rounded-[2rem]">
      <ul class="space-y-3 text-[11px] font-bold uppercase tracking-wider">
        <li class="flex justify-between items-center text-hsa">
          <span>Traffic Réseau</span>
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        </li>
        <li class="flex justify-between items-center text-hsa">
          <span>Logs Système</span>
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        </li>
        <li class="flex justify-between items-center text-hsa">
          <span>Feeds CERT-BJ</span>
          <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
        </li>
        <li class="flex justify-between items-center text-hsa">
          <span>Dark Web Monitor</span>
          <span class="w-2 h-2 rounded-full bg-warning"></span>
        </li>
      </ul>
    </UiBaseCard>

    <UiBaseCard
      class="bg-primary text-white border-none !rounded-[2rem] shadow-xl shadow-primary/20 overflow-hidden relative group">
      <div
        class="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700">
      </div>
      <h3 class="font-black mb-2 flex items-center gap-2 relative z-10">
        <IconBroadcast class="w-5 h-5 text-white/90" /> Mode Veille
      </h3>
      <p class="text-xs text-white/80 mb-6 leading-relaxed relative z-10">
        Analyse continue des menaces ciblant l'infrastructure nationale.
      </p>
      <div class="w-full bg-white/20 rounded-full h-1.5 mb-2 overflow-hidden relative z-10">
        <div class="bg-white h-1.5 rounded-full w-2/3 animate-[pulse_2s_infinite]"></div>
      </div>
      <div class="text-[10px] font-black uppercase tracking-widest text-white/70 text-right relative z-10">
        Analyse Active...
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconBroadcast } from '@tabler/icons-vue'
</script>
