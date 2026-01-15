<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <div
        class="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow">
      </div>
      <div
        class="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cypass-blue/10 rounded-full blur-[100px] animate-pulse-slower">
      </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-20 relative z-10">

      <div class="text-center space-y-4 animate-fade-up">
        <span class="badge badge-blue">Catalogue de Services</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Solutions de <span class="text-cypass-blue">Confiance</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Découvrez nos modules spécialisés pour sécuriser chaque aspect de votre activité numérique.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div v-for="(service, index) in services" :key="service.id" class="relative group animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">

          <NuxtLink :to="service.status === 'available' ? `/services/${service.id}` : '#'" class="block h-full"
            :class="{ 'cursor-not-allowed': service.status !== 'available' }">
            <div
              class="absolute inset-0 bg-gradient-to-br from-cypass-blue/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 transition-opacity duration-500"
              :class="{ 'group-hover:opacity-100': service.status === 'available' }"></div>

            <div
              class="relative glass-panel p-8 rounded-3xl h-full flex flex-col transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50 hover:border-cypass-blue/30 dark:hover:border-cypass-blue/30"
              :class="{ 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-cypass-blue/10': service.status === 'available', 'grayscale opacity-70': service.status !== 'available' }">
              <div class="flex justify-between items-start mb-6">
                <div
                  class="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-cypass-blue transition-colors"
                  :class="{ 'group-hover:bg-cypass-blue group-hover:text-white': service.status === 'available' }">
                  <component :is="service.icon" class="w-7 h-7" />
                </div>
                <span v-if="service.status !== 'available'"
                  class="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wide">
                  Bientôt
                </span>
                <span v-else
                  class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">
                  Disponible
                </span>
              </div>

              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">{{ service.title }}</h3>
              <p class="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{{ service.description }}</p>

              <div v-if="service.status === 'available'"
                class="flex items-center text-cypass-blue font-bold text-sm group-hover:translate-x-2 transition-transform">
                Accéder au service
                <IconArrowRight class="w-4 h-4 ml-2" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { IconScanEye, IconCertificate, IconRadar2, IconArrowRight, IconEye } from '@tabler/icons-vue'

const services = [
  {
    id: 'docsentry',
    title: 'DocSentry',
    description: 'Solution de signature électronique qualifiée et archivage probatoire de documents.',
    icon: IconCertificate,
    status: 'available'
  },
  {
    id: 'vigitech',
    title: 'VigiTech',
    description: 'Réseau d\'alerte communautaire et centre opérationnel de sécurité (SOC).',
    icon: IconRadar2,
    status: 'available'
  },
  {
    id: 'secuscan',
    title: 'SecuScan',
    description: 'Audit de vulnérabilité automatisé et continu pour vos applications web.',
    icon: IconScanEye,
    status: 'coming_soon'
  },
  {
    id: 'leakmonitor',
    title: 'LeakMonitor',
    description: 'Surveillance des fuites de données et traçabilité des documents.',
    icon: IconEye,
    status: 'coming_soon'
  }
]

definePageMeta({
  layout: 'guest'
})
</script>
