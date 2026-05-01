<template>
  <div class="grid md:grid-cols-3 gap-6 md:gap-8 py-6 md:py-8 animate-fade-up" style="animation-delay: 200ms">
    <div v-for="info in benefits" :key="info.title" 
      class="space-y-2 text-center group"
      :class="{ 'cursor-pointer': info.action }"
      @click="info.action ? $emit(info.action) : null">
      <div
        class="w-10 h-10 md:w-12 md:h-12 bg-ash rounded-xl md:rounded-2xl flex items-center justify-center mx-auto text-primary mb-3 md:mb-4 transition-all"
        :class="{ 'group-hover:bg-primary group-hover:text-WtB group-hover:shadow-lg group-hover:shadow-primary/20 ring-2 ring-transparent': info.action, 'ring-primary/20 bg-primary/5': info.action }">
        <component :is="info.icon" class="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h4 class="font-bold text-BtW text-xs md:text-sm lg:text-base leading-tight">{{ info.title }}</h4>
      <p class="text-[10px] md:text-xs text-hsa leading-relaxed px-1 md:px-4">{{ info.desc }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLock, IconCertificate, IconDatabaseEdit } from '@tabler/icons-vue'

defineEmits(['open-enrich'])

const benefits: { icon: any, title: string, desc: string, action?: 'open-enrich' }[] = [
  {
    icon: IconLock,
    title: 'Confidentialité',
    desc: 'Le document est analysé puis immédiatement supprimé de nos serveurs.'
  },
  {
    icon: IconCertificate,
    title: 'Preuve légale',
    desc: 'Validité juridique conforme aux normes de signature électronique.'
  },
  {
    icon: IconDatabaseEdit,
    title: 'Certification enrichie',
    desc: 'Associez des métadonnées pour une comparaison visuelle simplifiée.',
    action: 'open-enrich'
  }
]
</script>
