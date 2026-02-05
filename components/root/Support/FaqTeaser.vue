<template>
  <div
    class="glass-panel p-6 md:p-12 rounded-2xl md:rounded-3xl animate-fade-up flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border border-ash/50 text-center md:text-left">
    <div class="space-y-3 md:space-y-4">
      <h3 class="text-xl md:text-2xl font-bold text-BtW">Questions Fréquentes</h3>
      <p class="text-hsa text-sm md:text-base max-w-lg">
        Consultez notre base de connaissances pour trouver des réponses rapides aux questions les plus courantes.
      </p>
    </div>
    <UiBaseButton to="/faq" variant="primary" class="w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base">
      Voir la FAQ</UiBaseButton>
  </div>
</template>
