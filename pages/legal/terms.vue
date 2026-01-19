<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Header -->
      <div class="text-center space-y-4 animate-fade-up mb-16">
        <span class="badge badge-secondary">Règlement</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight">
          Conditions Générales <span class="text-secondary">d'Utilisation</span>
        </h1>
        <p class="text-lg text-hsa max-w-2xl mx-auto">
          Les règles d'usage pour garantir un environnement numérique de confiance.
        </p>
        <p class="text-sm text-slate-400">Dernière mise à jour : 15 Janvier 2026</p>
      </div>

      <div class="grid lg:grid-cols-4 gap-12">

        <!-- Sticky TOC -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="sticky top-32 space-y-4">
            <h3 class="font-bold mb-4 px-4">Sommaire</h3>
            <nav class="flex flex-col space-y-1">
              <a v-for="item in toc" :key="item.id" :href="`#${item.id}`"
                class="px-4 py-2 text-sm rounded-lg transition-colors text-hsa hover:text-secondary hover:bg-ash">
                {{ item.label }}
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">

          <section id="acceptance" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-lg">1</span>
              Acceptation
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>
                L'accès aux services CYPASS implique l'acceptation sans réserve des présentes conditions. Tout
                utilisateur ne les acceptant pas doit renoncer à l'accès aux services.
              </p>
            </div>
          </section>

          <section id="access" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-lg">2</span>
              Conditions d'Accès
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>Le service est accessible aux :</p>
              <ul>
                <li><strong>Citoyens :</strong> Disposant d'un NPI valide. L'accès est personnel et incessible.</li>
                <li><strong>Entreprises :</strong> Disposant d'un compte professionnel vérifié (RCCM, IFU).</li>
              </ul>
            </div>
          </section>

          <section id="responsibility" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-lg">3</span>
              Responsabilités
            </h2>
            <div class="prose prose-slate max-w-none">
              <h4 class="font-bold">Utilisateur</h4>
              <p>
                L'utilisateur est seul responsable de la confidentialité de ses moyens d'authentification (mot de passe,
                certificats). Toute action effectuée avec ses identifiants est réputée effectuée par lui.
              </p>
              <h4 class="font-bold">CYPASS</h4>
              <p>
                L'ASIN met en œuvre tous les moyens raisonnables pour assurer la disponibilité du service, mais ne
                saurait être tenue pour responsable en cas de force majeure, problèmes techniques externes, ou
                interruption pour maintenance.
              </p>
            </div>
          </section>

          <section id="modification" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary text-lg">4</span>
              Modification
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>
                L'ASIN se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés
                des changements majeurs.
              </p>
            </div>
          </section>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

const toc = [
  { id: 'acceptance', label: '1. Acceptation' },
  { id: 'access', label: '2. Conditions d\'Accès' },
  { id: 'responsibility', label: '3. Responsabilités' },
  { id: 'modification', label: '4. Modification' },
]

useHead({
  title: 'Conditions Générales d\'Utilisation'
})
</script>
