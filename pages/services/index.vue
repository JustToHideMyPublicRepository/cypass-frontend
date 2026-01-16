<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <!-- Living Gradients -->
      <div
        class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-float opacity-60">
      </div>
      <div
        class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float-delayed opacity-60">
      </div>

      <!-- Grid Lines -->
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px] mask-gradient">
      </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-24 relative z-10">

      <!-- Hero Section -->
      <div class="text-center space-y-6 animate-fade-up relative">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-slate-100/10 border border-slate-200 dark:border-slate-800 backdrop-blur-sm mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Catalogue de
            Services v2.0</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
          Solutions de <br class="md:hidden" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600 relative">
            Confiance Numérique
            <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30 hidden md:block"
              viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.00025 6.99997C25.7509 9.37523 78.9113 9.81705 112.225 4.88566C145.539 -0.0457375 186.257 0.999738 198.001 2.99996"
                stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
          </span>
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Une suite complète d'outils souverains pour sécuriser, certifier et surveiller votre écosystème numérique.
        </p>
      </div>

      <!-- Trust Stats -->
      <div
        class="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm animate-fade-up"
        style="animation-delay: 100ms;">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <div class="text-3xl font-bold text-slate-900 dark:text-white mb-1">{{ stat.value }}</div>
          <div class="text-[10px] font-bold uppercase tracking-widest text-slate-500">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="grid lg:grid-cols-2 gap-10">
        <div v-for="(service, index) in services" :key="service.id" class="group perspective-1000 animate-fade-up"
          :style="{ animationDelay: `${index * 150}ms` }">

          <UiAppFrame
            :type="service.status === 'available' ? (service.id === 'secuscan' ? 'terminal' : 'card') : 'card'"
            :title="service.title" :glass="true" :class="[
              'h-full transform transition-all duration-500 hover:rotate-x-2 hover:translate-y-[-5px] hover:shadow-2xl',
              service.theme === 'blue' ? 'hover:shadow-blue-500/20' : 'hover:shadow-green-500/20'
            ]" :header-class="service.status !== 'available' ? 'opacity-50' : ''">
            <template #headerActions>
              <div v-if="service.status === 'available'" class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full animate-pulse"
                  :class="service.theme === 'blue' ? 'bg-blue-500' : 'bg-green-500'"></span>
                <span class="text-[10px] font-bold uppercase tracking-wider"
                  :class="service.theme === 'blue' ? 'text-blue-400' : 'text-green-400'">Online</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-slate-500"></span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offline</span>
              </div>
            </template>

            <div
              class="p-8 h-full flex flex-col relative overflow-hidden group-hover:bg-slate-50/50 dark:group-hover:bg-slate-800/50 transition-colors">
              <!-- Background Gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                :class="service.theme === 'blue' ? 'from-blue-500 to-transparent' : 'from-green-500 to-transparent'">
              </div>

              <!-- Icon & Content -->
              <div class="flex items-start justify-between mb-8 relative z-10">
                <div
                  class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                  :class="service.theme === 'blue'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'">
                  <component :is="service.icon" class="w-8 h-8" />
                </div>

                <NuxtLink v-if="service.status === 'available'" :to="`/services/${service.id}`"
                  class="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all">
                  <IconArrowRight class="w-5 h-5" />
                </NuxtLink>
              </div>

              <div class="relative z-10 flex-grow">
                <h3
                  class="text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  {{ service.title }}
                </h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-base mb-6">
                  {{ service.description }}
                </p>

                <!-- Mini Specs / Features -->
                <div class="grid grid-cols-2 gap-3 mb-6">
                  <div v-for="spec in service.specs" :key="spec"
                    class="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg px-2 py-1.5">
                    <IconCheck class="w-3 h-3" :class="service.theme === 'blue' ? 'text-blue-500' : 'text-green-500'" />
                    {{ spec }}
                  </div>
                </div>
              </div>

              <!-- Action / Coming Soon -->
              <div class="relative z-10 mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                <NuxtLink v-if="service.status === 'available'" :to="`/services/${service.id}`">
                  <button
                    class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2"
                    :class="service.theme === 'blue'
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'">
                    <span>Explorer le module</span>
                    <IconArrowRight class="w-4 h-4" />
                  </button>
                </NuxtLink>
                <div v-else
                  class="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-sm text-center cursor-not-allowed border border-slate-200 dark:border-slate-700">
                  Bientôt Disponible
                </div>
              </div>

            </div>
          </UiAppFrame>
        </div>
      </div>

      <!-- Bottom CTA (Optional) -->
      <div class="text-center pt-10 pb-10">
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          Vous avez des besoins spécifiques ? <NuxtLink to="/contact" class="text-primary hover:underline">Contactez
            notre
            équipe commerciale</NuxtLink>.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IconScanEye,
  IconCertificate,
  IconRadar2,
  IconArrowRight,
  IconEye,
  IconCheck
} from '@tabler/icons-vue'

const stats = [
  { value: '100%', label: 'Conformité' },
  { value: '24/7', label: 'Surveillance' },
  { value: 'AES-256', label: 'Chiffrement' },
  { value: 'ISO', label: 'Certifié' },
]

const services = [
  {
    id: 'docsentry',
    title: 'DocSentry',
    description: 'Infrastructure PKI souveraine pour la signature électronique qualifiée et l\'archivage à valeur probante.',
    icon: IconCertificate,
    status: 'available',
    theme: 'green',
    specs: ['Signature eIDAS', 'Archivage Légal', 'Preuve Numérique', 'API Rest']
  },
  {
    id: 'vigitech',
    title: 'VigiTech',
    description: 'Centre Opérationnel de Sécurité (SOC) communautaire pour la détection et la réponse aux incidents.',
    icon: IconRadar2,
    status: 'available',
    theme: 'green',
    specs: ['Menaces TR', 'SIEM Cloud', 'Threat Intel', 'Support 24/7']
  },
  {
    id: 'secuscan',
    title: 'SecuScan',
    description: 'Scanner de vulnérabilités automatisé identifiant proactivement les failles de votre périmètre.',
    icon: IconScanEye,
    status: 'coming_soon',
    theme: 'blue',
    specs: ['Audit OWASP', 'Rapports PDF', 'Scan Continu', 'Score CVSS']
  },
  {
    id: 'leakmonitor',
    title: 'LeakMonitor',
    description: 'Surveillance du darkweb et des fuites de données pour protéger votre marque et vos documents.',
    icon: IconEye,
    status: 'coming_soon',
    theme: 'blue',
    specs: ['Veille Darkweb', 'Alerte Fuite', 'Protection Marque', 'OSINT']
  }
]

definePageMeta({
  layout: 'guest'
})
</script>

<style scoped>
.mask-gradient {
  mask-image: radial-gradient(circle at center, black, transparent 80%);
}
</style>
