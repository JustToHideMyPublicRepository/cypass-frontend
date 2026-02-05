<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <!-- Éléments d'arrière-plan -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]">
    </div>
    <div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-ash to-transparent">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- En-tête -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-20 animate-fade-up">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Pipeline de Sécurité
        </span>
        <h2 class="text-2xl md:text-5xl font-bold text-BtW mb-4 md:mb-6">
          Protection en <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            temps réel</span>
        </h2>
        <p class="text-base md:text-lg text-hsa">
          Une approche systémique pour sécuriser, certifier et surveiller votre infrastructure critique.
        </p>
      </div>

      <!-- Conteneur du Pipeline -->
      <div class="relative grid md:grid-cols-3 gap-12 md:gap-8">
        <!-- Ligne de connexion (Desktop) -->
        <div
          class="hidden md:block absolute top-[25%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent">
        </div>
        <div
          class="hidden md:block absolute top-[25%] left-0 h-0.5 w-[30%] bg-gradient-to-r from-transparent to-primary blur-[2px] animate-beam">
        </div>

        <!-- Éléments métriques flottants -->
        <div class="absolute -top-10 left-10 hidden lg:block animate-float-slow">
          <div class="font-code text-[10px] text-primary/40">RX: 104.2 Mb/s</div>
        </div>
        <div class="absolute -bottom-10 right-10 hidden lg:block animate-float-delayed">
          <div class="font-code text-[10px] text-success/40">SYS: STABLE</div>
        </div>

        <!-- Étape 1 : Audit (Terminal) -->
        <div class="group relative">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- Fenêtre Terminal -->
            <RootHomeHowItWorksAuditTerminal />

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span class="font-bold">01</span>
              </div>
              <h3 class="text-base md:text-lg font-bold text-BtW mb-2">Audit SecuScan</h3>
              <p class="text-sm text-hsa">Analyse automatique de votre surface d'attaque et
                identification des vulnérabilités.</p>
            </div>
          </div>
        </div>

        <!-- Étape 2 : Certification (ID Numérique) -->
        <div class="group relative">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- Carte d'identité -->
            <RootHomeHowItWorksCertificationCard />

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10 text-secondary mb-3 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <span class="font-bold">02</span>
              </div>
              <h3 class="text-base md:text-lg font-bold text-BtW mb-2">Certification</h3>
              <p class="text-sm text-hsa">Émission de certificats numériques qualifiés et
                identité organisationnelle.</p>
            </div>
          </div>
        </div>

        <!-- Étape 3 : Monitoring (Radar) -->
        <div class="group relative">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- Interface Radar -->
            <RootHomeHowItWorksMonitoringRadar />

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success mb-3 group-hover:bg-success group-hover:text-white transition-colors duration-300">
                <span class="font-bold">03</span>
              </div>
              <h3 class="text-base md:text-lg font-bold text-BtW mb-2">Protection Continue</h3>
              <p class="text-sm text-hsa">Surveillance 24/7 par VigiTech et alerting en temps
                réel.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
@keyframes beam {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateX(200%);
    opacity: 0;
  }
}

.animate-beam {
  animation: beam 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
</style>
