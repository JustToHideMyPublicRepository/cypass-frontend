<template>
  <section class="relative py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Text -->
        <div class="text-center lg:text-left space-y-8 animate-fade-right">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-BtW shadow-lg backdrop-blur-md">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span class="text-xs font-bold uppercase tracking-widest">
              Plateforme nationale unifiée</span>
          </div>

          <h1
            class="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-textClr via-hsa to-BtW leading-tight">
            Souveraineté <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success relative">
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

          <p class="text-xl md:text-2xl text-hsa max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            L'infrastructure de confiance protégeant l'écosystème numérique du Bénin.
            <span class="font-semibold text-primary">Certification, Veille & Audit</span>
            en temps réel.
          </p>

          <div class="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
            <UiBaseButton :to="authStore.user ? '/dashboard' : '/auth/login'"
              class="w-full sm:w-auto text-lg px-8 py-4 shadow-BtW/40">
              {{ authStore.user ? 'Tableau de bord' : 'Accéder au Portail' }}
              <IconArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </UiBaseButton>
            <UiBaseButton to="/verify" variant="secondary" class="w-full sm:w-auto text-lg px-8 py-4">
              Vérifier un document
            </UiBaseButton>
          </div>

          <div
            class="pt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-hsa">
            <div class="flex items-center gap-2 bg-WtB/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-ash/50">
              <IconShieldCheck class="w-5 h-5 text-primary" />
              <span>Données Chiffrées</span>
            </div>
            <div class="flex items-center gap-2 bg-WtB/50 px-4 py-2 rounded-lg backdrop-blur-sm border border-ash/50">
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
            <div class="bg-bgClr p-6 rounded-b-2xl h-[450px] relative overflow-hidden">

              <!-- Decorative Grid -->
              <div
                class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-5">
              </div>

              <div class="grid grid-cols-2 gap-4 relative z-10">
                <!-- Stats Card -->
                <div
                  class="col-span-2 bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-ash shadow-lg relative overflow-hidden group/card">
                  <div class="absolute top-0 right-0 p-3 opacity-20">
                    <IconShieldLock class="w-24 h-24 rotate-12" />
                  </div>
                  <h3 class="text-sm font-medium mb-1">Niveau de menace</h3>
                  <div class="text-WtB text-4xl font-bold mb-4 flex items-center gap-3">
                    Faible
                    <span
                      class="px-2 py-1 bg-success/20 text-success border border-success/30 text-xs rounded-full">Stable</span>
                  </div>
                  <div class="w-full bg-black/20 rounded-full h-2 mb-2">
                    <div class="bg-success h-2 rounded-full w-[15%] shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                    </div>
                  </div>
                  <p class="text-xs">Dernière mise à jour: à l'instant</p>
                </div>

                <!-- Mini Cards -->
                <div
                  class="bg-WtB p-4 rounded-2xl shadow-sm border border-ash flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                  <div class="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                    <IconAlertTriangle class="w-6 h-6 text-warning" />
                  </div>
                  <span class="text-2xl font-bold text-BtW">0</span>
                  <span class="text-xs text-hsa">Alertes Critiques</span>
                </div>

                <div
                  class="bg-WtB p-4 rounded-2xl shadow-sm border border-ash flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                  <div class="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                    <IconCheck class="w-6 h-6 text-success" />
                  </div>
                  <span class="text-2xl font-bold text-BtW">100%</span>
                  <span class="text-xs text-hsa">Conformité</span>
                </div>

                <!-- List Item -->
                <div
                  class="col-span-2 bg-WtB p-4 rounded-2xl shadow-sm border border-ash flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-ash flex items-center justify-center">
                      <IconFileAnalytics class="w-5 h-5 text-hsa" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-BtW">Rapport Audit
                        #882</div>
                      <div class="text-xs text-hsa">Généré le 14 Janv.</div>
                    </div>
                  </div>
                  <button class="px-3 py-1 text-xs font-bold text-primary bg-ash rounded-lg">Voir</button>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- Floating Badge -->
          <div
            class="absolute bottom-10 -left-10 glass-panel p-4 rounded-xl flex items-center gap-3 z-30 animate-float-delayed">
            <div class="relative">
              <span class="absolute top-0 right-0 w-3 h-3 bg-success border-2 border-WtB rounded-full z-10"></span>
              <div class="w-12 h-12 bg-ashAct rounded-full flex items-center justify-center overflow-hidden">
                <IconUser class="w-7 h-7 text-primary" />
              </div>
            </div>
            <div>
              <div class="text-sm font-bold text-BtW">Session Sécurisée</div>
              <div class="text-xs text-hsa">Chiffrement SHA-256</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconServer, IconArrowRight, IconShieldLock, IconAlertTriangle, IconCheck, IconFileAnalytics, IconUser } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>
