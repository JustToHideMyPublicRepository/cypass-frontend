<template>
  <div class="grid md:grid-cols-3 gap-6 md:gap-8 py-6 md:py-8 animate-fade-up" style="animation-delay: 200ms">
    <div v-for="info in benefits" :key="info.title" class="space-y-2 text-center">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-ash rounded-xl md:rounded-2xl flex items-center justify-center mx-auto text-primary mb-3 md:mb-4">
        <component :is="info.icon" class="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h4 class="font-bold text-BtW text-sm md:text-base">{{ info.title }}</h4>
      <p class="text-[11px] md:text-xs text-hsa leading-relaxed px-2 md:px-4">{{ info.desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLock, IconServer, IconCertificate } from '@tabler/icons-vue'

const benefits = [
  {
    icon: IconLock,
    title: 'Confidentialité',
    desc: 'Le document est analysé puis immédiatement supprimé de nos serveurs.'
  },
  {
    icon: IconServer,
    title: 'Infrastructures d\'État',
    desc: 'Vérification effectuée sur les serveurs souverains du Bénin.'
  },
  {
    icon: IconCertificate,
    title: 'Preuve Légale',
    desc: 'Validité juridique conforme aux normes de signature électronique.'
  }
]
</script>
