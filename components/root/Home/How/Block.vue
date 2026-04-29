<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <!-- Éléments d'arrière-plan -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:32px_32px]">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- En-tête -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-20 animate-fade-up">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Pipeline de Confiance
        </span>
        <h2 class="font-extrabold text-BtW tracking-tight">
          Comment ça <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            marche ?</span>
        </h2>
        <p class="text-hsa leading-relaxed">
          Un processus fluide, étape par étape, pour garantir votre sécurité numérique.
        </p>
      </div>

      <!-- Flux DocSentry -->
      <RootHomeHowDocsentry />

      <!-- Flux VigiTech -->
      <RootHomeHowVigitech />
    </div>
  </section>
</template>
