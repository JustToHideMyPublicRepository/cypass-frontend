<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div
        class="p-8 md:p-12 lg:p-16 bg-WtBAct/30 backdrop-blur-2xl border border-ashAct rounded-[2.5rem] shadow-2xl overflow-hidden group">
        <!-- Background accents -->
        <div
          class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000">
        </div>
        <div
          class="absolute -bottom-24 -left-24 w-96 h-96 bg-success/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-success/10 transition-colors duration-1000">
        </div>

        <div class="relative z-10">
          <div class="max-w-3xl">
            <span class="font-mono text-[10px] md:text-11px text-primary uppercase tracking-[0.2em] mb-4 block">
              // Principes fondateurs
            </span>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-BtW leading-[1.1] mb-6">
              Conçu pour protéger.<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
                Par architecture.
              </span>
            </h2>
            <p class="text-hsa text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mb-12">
              La sécurité et la confidentialité ne sont pas des options dans CYPASS ; elles sont intégrées dès la
              conception et à chaque couche du système.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Security by Design Card -->
            <div
              class="bg-WtB/80 backdrop-blur-md border border-ash/50 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card">
              <div class="flex items-center gap-4 mb-8">
                <div
                  class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover/card:scale-110 transition-transform">
                  <IconShield class="w-6 h-6" />
                </div>
                <div>
                  <span class="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">
                    // Security by design
                  </span>
                  <span class="text-lg font-bold text-BtW">Sécurité structurelle</span>
                </div>
              </div>

              <ul class="space-y-4">
                <li v-for="(item, i) in securityItems" :key="i" class="flex items-start gap-3 group/item">
                  <div
                    class="w-5 h-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success flex-shrink-0 mt-0.5 group-hover/item:bg-success group-hover/item:text-white transition-all duration-300">
                    <IconCheck class="w-3 h-3 stroke-[3]" />
                  </div>
                  <span class="text-sm md:text-base text-hsa leading-snug group-hover/item:text-BtW transition-colors">
                    {{ item }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- Privacy by Design Card -->
            <div
              class="bg-WtB/80 backdrop-blur-md border border-ash/50 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group/card">
              <div class="flex items-center gap-4 mb-8">
                <div
                  class="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center text-warning border border-warning/20 shadow-sm group-hover/card:scale-110 transition-transform">
                  <IconEye class="w-6 h-6" />
                </div>
                <div>
                  <span class="font-mono text-[10px] text-warning uppercase tracking-widest block mb-1">
                    // Privacy by design
                  </span>
                  <span class="text-lg font-bold text-BtW">Confidentialité native</span>
                </div>
              </div>

              <ul class="space-y-4">
                <li v-for="(item, i) in privacyItems" :key="i" class="flex items-start gap-3 group/item">
                  <div
                    class="w-5 h-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success flex-shrink-0 mt-0.5 group-hover/item:bg-success group-hover/item:text-white transition-all duration-300">
                    <IconCheck class="w-3 h-3 stroke-[3]" />
                  </div>
                  <span class="text-sm md:text-base text-hsa leading-snug group-hover/item:text-BtW transition-colors">
                    {{ item }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShield, IconEye, IconCheck } from '@tabler/icons-vue'

const securityItems = [
  'Signature numérique infalsifiable',
  'Rotation cryptographique automatique',
  'Audit de code continu, zéro dette critique',
  'Authentification multi-facteurs (MFA)'
]

const privacyItems = [
  'Anonymisation des signalements VigiTech',
  'Données chiffrées au repos',
  'Conformité loi n°2017-20 & RGPD',
  'Découplage identité / contenu avant persistance'
]
</script>

<style scoped>
.animate-shimmer {
  background-size: 200% auto;
  animation: shimmer 5s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}
</style>
