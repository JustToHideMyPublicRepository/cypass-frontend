<template>
  <section class="relative py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Text -->
        <div class="text-center lg:text-left space-y-8 animate-fade-right">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-BtW shadow-lg backdrop-blur-md">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span class="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
              Plateforme Nationale Unifiée</span>
          </div>

          <h1 class="heading-hero leading-tight">
            Souveraineté <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 relative">
              Numérique
              <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 200 9" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.00025 6.99997C25.7509 9.37523 78.9113 9.81705 112.225 4.88566C145.539 -0.0457375 186.257 0.999738 198.001 2.99996"
                  stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
            </span>
            & Sécurité
          </h1>

          <p
            class="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            L'infrastructure de confiance protégeant l'écosystème numérique du Bénin.
            <span class="font-semibold text-primary dark:text-blue-400">Certification, Veille &
              Audit</span> en temps réel.
          </p>

          <div class="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
            <NuxtLink to="/auth/login" class="w-full sm:w-auto">
              <button class="btn btn-primary w-full sm:w-auto text-lg px-8 py-4 shadow-BtW/40">
                Accéder au Portail
                <IconArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </NuxtLink>
            <NuxtLink to="#features" class="w-full sm:w-auto">
              <button class="btn btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                Découvrir les services
              </button>
            </NuxtLink>
          </div>

          <div
            class="pt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <div
              class="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <IconShieldCheck class="w-5 h-5 text-cypass-green" />
              <span>Données Chiffrées</span>
            </div>
            <div
              class="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <IconServer class="w-5 h-5 text-primary" />
              <span>Hébergé au Bénin</span>
            </div>
          </div>
        </div>

        <!-- 3D Glass Card Composition -->
        <div class="relative hidden lg:block perspective-1000 animate-fade-left">

          <!-- Floating Background Elements -->
          <div
            class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse-slow">
          </div>

          <!-- Main Dashboard Card -->
          <UiAppFrame type="browser" url="https://secure.cypass.bj/dashboard" :glass="true" rounded="rounded-3xl"
            padding="p-0"
            class="transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out z-20 group">
            <!-- Dashboard Content -->
            <div class="bg-slate-50 dark:bg-slate-900 p-6 rounded-b-2xl h-[450px] relative overflow-hidden">

              <!-- Decorative Grid -->
              <div
                class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-5">
              </div>

              <div class="grid grid-cols-2 gap-4 relative z-10">
                <!-- Stats Card -->
                <div
                  class="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group/card">
                  <div class="absolute top-0 right-0 p-3 opacity-20">
                    <IconShieldLock class="w-24 h-24 rotate-12" />
                  </div>
                  <h3 class="text-blue-100 text-sm font-medium mb-1">Niveau de Menace</h3>
                  <div class="text-4xl font-bold mb-4 flex items-center gap-3">
                    Faible
                    <span
                      class="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">Stable</span>
                  </div>
                  <div class="w-full bg-black/20 rounded-full h-2 mb-2">
                    <div class="bg-green-400 h-2 rounded-full w-[15%] shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                    </div>
                  </div>
                  <p class="text-xs text-blue-200">Dernière mise à jour: à l'instant</p>
                </div>

                <!-- Mini Cards -->
                <div
                  class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                  <div
                    class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                    <IconAlertTriangle class="w-6 h-6" />
                  </div>
                  <span class="text-2xl font-bold text-slate-800 dark:text-white">0</span>
                  <span class="text-xs text-slate-500">Alertes Critiques</span>
                </div>

                <div
                  class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                  <div
                    class="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <IconCheck class="w-6 h-6" />
                  </div>
                  <span class="text-2xl font-bold text-slate-800 dark:text-white">100%</span>
                  <span class="text-xs text-slate-500">Conformité</span>
                </div>

                <!-- List Item -->
                <div
                  class="col-span-2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <IconFileAnalytics class="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-900 dark:text-white">Rapport Audit
                        #882</div>
                      <div class="text-xs text-slate-500">Généré le 14 Janv.</div>
                    </div>
                  </div>
                  <button
                    class="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">Voir</button>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- Floating Badge -->
          <div
            class="absolute bottom-10 -left-10 glass-card p-4 rounded-xl flex items-center gap-3 z-30 animate-float-delayed">
            <div class="relative">
              <span
                class="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full z-10"></span>
              <div
                class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" alt="User" />
              </div>
            </div>
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">Session Sécurisée</div>
              <div class="text-xs text-slate-500">Chiffrement AES-256</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  IconShieldCheck,
  IconServer,
  IconArrowRight,
  IconShieldLock,
  IconAlertTriangle,
  IconCheck,
  IconFileAnalytics
} from '@tabler/icons-vue'
</script>
