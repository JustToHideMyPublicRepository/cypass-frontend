<template>
  <section class="py-20 md:py-32 relative overflow-hidden">
    <!-- Section d'appel à l'action finale (Home) -->
    <div class="absolute inset-0 bg-bgClr"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl">
    </div>

    <div class="max-w-4xl mx-auto px-4 text-center space-y-6 md:space-y-10 relative z-10">
      <h2>
        Prêt à élever votre niveau de <span class="text-primary">sécurité</span> ?
      </h2>
      <p class="max-w-2xl mx-auto">
        Rejoignez les institutions gouvernementales et entreprises stratégiques qui font confiance à
        l'infrastructure CYPASS.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
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
