<template>
  <div class="text-center space-y-2">
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
      <IconWifiOff class="w-4 h-4" />
      Connexion perdue
    </div>

    <div class="flex items-center gap-6 space-y-2">
      <div
        class="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto shadow-lg transform group-hover:rotate-6 transition-transform">
        <IconDeviceGamepad2 class="w-10 h-10 text-WtB" />
      </div>

      <div>
        <h1 class="text-3xl sm:text-4xl font-heading font-extrabold text-hsaAct lg:text-5xl">
          CYPASS <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Quiz</span>
        </h1>
        <p class="text-textClr/70 max-w-md mx-auto">
          La connexion est perdue ? Profitez-en pour tester vos connaissances en cybersécurité et battre votre record !
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconWifiOff, IconDeviceGamepad2 } from '@tabler/icons-vue'
</script>
