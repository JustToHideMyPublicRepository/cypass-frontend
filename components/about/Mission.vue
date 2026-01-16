<template>
  <section class="py-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Text Content -->
        <div class="space-y-8 animate-fade-right">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Notre Mission
            </h2>
            <div class="h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Dans un monde hyper-connecté, la donnée est devenue l'actif le plus précieux des nations et des
            entreprises. Notre mission est de construire une infrastructure souveraine, robuste et
            résiliente capable de protéger ces actifs contre les menaces émergentes.
          </p>
          <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Nous démocratisons l'accès aux technologies de cybersécurité avancées (PKI, SOC, SIEM) pour
            permettre à chaque PME, administration et citoyen béninois d'interagir numériquement en toute
            confiance.
          </p>

          <div class="grid grid-cols-2 gap-6 pt-4">
            <div class="flex flex-col gap-2">
              <span class="text-4xl font-black text-primary">100%</span>
              <span class="text-sm text-slate-500 font-medium uppercase tracking-wide">Souverain</span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="text-4xl font-black text-primary">24/7</span>
              <span class="text-sm text-slate-500 font-medium uppercase tracking-wide">Protection</span>
            </div>
          </div>
        </div>

        <!-- Visual Abstract -->
        <div class="relative animate-fade-left">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-3xl blur-2xl opacity-20">
          </div>
          <div
            class="relative glass-panel rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-8">
            <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
              alt="Data Center" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
            <div
              class="relative z-10 bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-700 text-center">
              <span class="block text-5xl mb-4">🛡️</span>
              <h3 class="text-xl font-bold text-white mb-2">Gardien du Numérique</h3>
              <p class="text-slate-400 text-sm">Protection proactive des infrastructures critiques.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
