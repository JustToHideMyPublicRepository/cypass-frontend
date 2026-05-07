<template>
  <section class="py-20 md:py-32 relative overflow-hidden">
    <!-- Fond de base -->
    <div class="absolute inset-0 bg-bgClr z-0"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl z-0"></div>

    <!-- Iframe dynamique en arrière-plan -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] md:opacity-[0.1] z-0" style="perspective: 1200px;">
      <UiAppFrame type="browser" url="https://dashboard.cypass.bj/omniscient" :glass="true" padding="p-0"
        class="w-[1000px] md:w-[1200px] animate-float border-ash/20 shadow-[0_0_100px_rgba(var(--color-primary),0.1)]">
        <div class="bg-bgClr/90 p-6 h-[800px] overflow-hidden grid grid-cols-2 gap-6 relative">
          <!-- Vignette intérieure pour fondre proprement le défilement -->
          <div class="absolute inset-0 bg-[linear-gradient(to_bottom,currentColor_0%,transparent_10%,transparent_90%,currentColor_100%)] text-bgClr z-10 pointer-events-none"></div>
          
          <!-- Colonne 1: Scrolle vers le haut -->
          <div class="animate-pan-up space-y-6">
            <RootHomeFeaturesDocsentry class="transform-gpu" />
            <RootHomeFeaturesLeakmonitor class="transform-gpu" />
            <RootHomeFeaturesDocsentry class="transform-gpu" />
          </div>
          
          <!-- Colonne 2: Scrolle vers le bas -->
          <div class="animate-pan-down space-y-6 -mt-[350px]">
            <RootHomeFeaturesVigitech class="transform-gpu" />
            <RootHomeFeaturesSecuscan class="transform-gpu" />
            <RootHomeFeaturesVigitech class="transform-gpu" />
          </div>
        </div>
      </UiAppFrame>
    </div>

    <!-- Gradient radial pour garantir la lisibilité du texte au centre -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-bgClr)_100%)] z-0 pointer-events-none"></div>

    <!-- Contenu texte (Foreground) -->
    <div class="max-w-4xl mx-auto px-4 text-center space-y-6 md:space-y-10 relative z-10">
      <h2>
        Prêt à élever votre niveau de <span class="text-primary font-handwritting">sécurité</span> ?
      </h2>
      <p class="max-w-2xl mx-auto">
        Rejoignez les institutions gouvernementales et entreprises stratégiques qui font confiance à
        l'infrastructure CYPASS.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-2">
        <UiBaseButton to="/auth/login" variant="primary"
          class="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 flex items-center justify-center gap-2">
          Commencer maintenant
        </UiBaseButton>
        <UiBaseButton to="/contact" variant="secondary"
          class="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 flex items-center justify-center gap-2">
          Parler à un expert
        </UiBaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0% { transform: rotateX(15deg) rotateZ(-3deg) translateY(0) scale(1.1); }
  50% { transform: rotateX(10deg) rotateZ(-1deg) translateY(-25px) scale(1.1); }
  100% { transform: rotateX(15deg) rotateZ(-3deg) translateY(0) scale(1.1); }
}

@keyframes pan-up {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30%); }
}

@keyframes pan-down {
  0%, 100% { transform: translateY(-30%); }
  50% { transform: translateY(0); }
}

.animate-float {
  animation: float 16s ease-in-out infinite;
  transform-style: preserve-3d;
}

.animate-pan-up {
  animation: pan-up 25s ease-in-out infinite;
}

.animate-pan-down {
  animation: pan-down 25s ease-in-out infinite;
}
</style>
