<template>
  <div class="text-center space-y-2">
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
      <IconWifiOff class="w-4 h-4" />
      Connexion perdue
    </div>
    <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-hsaAct lg:text-5xl">
      CYPASS <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Quiz</span>
    </h1>
    <p class="text-textClr/70 max-w-md mx-auto">
      La connexion est interrompue. Profitez-en pour tester vos connaissances en cybersécurité !
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconWifiOff } from '@tabler/icons-vue'
</script>
