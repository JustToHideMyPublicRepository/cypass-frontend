<template>
  <div class="grid md:grid-cols-3 gap-8 py-8 animate-fade-up" style="animation-delay: 200ms">
    <div v-for="info in benefits" :key="info.title" class="space-y-2 text-center">
      <div class="w-12 h-12 bg-ash rounded-2xl flex items-center justify-center mx-auto text-primary mb-4">
        <component :is="info.icon" class="w-6 h-6" />
      </div>
      <h4 class="font-bold text-BtW">{{ info.title }}</h4>
      <p class="text-xs text-hsa leading-relaxed px-4">{{ info.desc }}</p>
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
