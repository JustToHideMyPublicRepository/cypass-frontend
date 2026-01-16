<template>
  <section class="py-32 relative overflow-hidden">
    <div class="absolute inset-0 bg-slate-50 dark:bg-slate-950"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cypass-blue/5 rounded-full blur-3xl">
    </div>

    <div class="max-w-4xl mx-auto px-4 text-center space-y-10 relative z-10">
      <h2 class="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
        Prêt à élever votre niveau de <span class="text-primary">sécurité</span> ?
      </h2>
      <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
        Rejoignez les institutions gouvernementales et entreprises stratégiques qui font confiance à
        l'infrastructure CYPASS.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-6">
        <NuxtLink to="/auth/login">
          <button class="btn btn-primary w-full sm:w-auto h-16 px-10 rounded-2xl text-xl shadow-2xl shadow-blue-500/30">
            Commencer maintenant
          </button>
        </NuxtLink>
        <button class="btn btn-secondary w-full sm:w-auto h-16 px-10 rounded-2xl text-xl">
          Parler à un expert
        </button>
      </div>
    </div>
  </section>
</template>
