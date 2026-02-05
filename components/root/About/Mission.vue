<template>
  <section class="py-12 md:py-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Contenu Texte -->
        <div class="space-y-6 md:space-y-8 animate-fade-right">
          <div>
            <h2 class="text-2xl md:text-4xl font-bold mb-4">
              Notre Mission
            </h2>
            <div class="h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <p class="text-base md:text-lg leading-relaxed">
            Dans un monde hyper-connecté, la donnée est devenue l'actif le plus précieux des nations et des
            entreprises. Notre mission est de construire une infrastructure souveraine, robuste et
            résiliente capable de protéger ces actifs contre les menaces émergentes.
          </p>
          <p class="text-base md:text-lg leading-relaxed">
            Nous démocratisons l'accès aux technologies de cybersécurité avancées (PKI, SOC, SIEM) pour
            permettre à chaque PME, administration et citoyen béninois d'interagir numériquement en toute
            confiance.
          </p>

          <div class="grid grid-cols-2 gap-6 pt-4">
            <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-2">
              <span class="text-3xl md:text-4xl font-black text-primary">{{ stat.value }}</span>
              <span class="text-[10px] md:text-sm font-medium uppercase tracking-wide">
                {{ stat.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Abstraction Visuelle -->
        <div class="relative animate-fade-left">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl blur-2xl opacity-20">
          </div>

          <UiAppFrame type="card" :glass="true"
            class="transform hover:scale-[1.02] transition-transform duration-500 group">
            <div
              class="aspect-square flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden bg-slate-900/40">
              <!-- Visuel Cyber Abstrait -->
              <div class="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-20">
                <div v-for="i in 400" :key="i" class="border-[0.5px] border-slate-700/30"></div>
              </div>

              <div class="relative z-10 w-32 md:w-48 h-32 md:h-48 mb-6">
                <!-- Animation de Cercles Concentriques -->
                <div class="absolute inset-0 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]">
                </div>
                <div
                  class="absolute inset-4 rounded-full border border-primary/50 border-t-transparent animate-[spin_3s_linear_infinite_reverse]">
                </div>
                <div
                  class="absolute inset-8 rounded-full border-2 border-primary/80 border-b-transparent animate-[spin_5s_linear_infinite]">
                </div>

                <!-- Bouclier Central -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="relative">
                    <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <IconShieldLock
                      class="w-12 h-12 md:w-16 md:h-16 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      stroke-width="1.5" />
                  </div>
                </div>
              </div>

              <div
                class="relative z-10 bg-slate-900/80 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-slate-700/50 text-center shadow-2xl max-w-xs group-hover:border-primary/50 transition-colors">
                <h3 class="text-lg md:text-xl font-bold text-white mb-2">Gardien du Numérique</h3>
                <p class="text-slate-400 text-sm">Protection proactive des infrastructures critiques.</p>
              </div>
            </div>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShieldLock } from '@tabler/icons-vue'

const stats = [
  { value: '100%', label: 'Souverain' },
  { value: '24/7', label: 'Protection' }
]
</script>
