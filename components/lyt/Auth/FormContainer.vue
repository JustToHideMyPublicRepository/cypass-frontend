<template>
  <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
    <div class="flex flex-col justify-center min-h-full px-4 sm:px-10 lg:px-12 xl:px-16 py-8 md:py-12 max-w-lg mx-auto">

      <!-- Logo et Lien vers l'Accueil -->
      <div class="mb-8 md:mb-10 animate-fade-down">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl p-0.5 shadow-sm border border-ash/50 bg-WtB">
            <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
              <img src="/img/logo.png" alt="Cypass Logo" class="w-full h-full object-contain" />
            </div>
          </div>
          <span
            class="text-2xl font-black tracking-tight text-BtW group-hover:text-primary transition-colors">CYPASS</span>
        </NuxtLink>
      </div>

      <!-- Zone de contenu (Slot) -->
      <div class="animate-fade-up">
        <slot />
      </div>

      <!-- Pied de page du formulaire -->
      <div
        class="mt-8 text-center text-[10px] md:text-xs animate-fade-in pb-4 text-slate-400 font-medium uppercase tracking-widest">
        &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
      </div>
    </div>
  </div>
</template>
