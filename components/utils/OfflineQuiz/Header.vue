<template>
  <div class="text-center space-y-4">
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
      <IconWifiOff class="w-4 h-4" />
      Connexion perdue
    </div>

    <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
      <div
        class="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transition-transform">
        <IconDeviceGamepad2 class="w-8 h-8 sm:w-10 sm:h-10 text-WtB" />
      </div>

      <div class="text-center sm:text-left max-w-md">
        <h1 class="text-2xl sm:text-3xl lg:text-5xl font-heading font-extrabold text-hsaAct">
          CYPASS
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Quiz
          </span>
        </h1>

        <p class="text-sm sm:text-base text-textClr/70">
          La connexion est perdue ? Profitez-en pour tester vos connaissances en cybersécurité et battre votre record !
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconWifiOff, IconDeviceGamepad2 } from '@tabler/icons-vue'
</script>