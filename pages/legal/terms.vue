<template>
  <div class="relative py-8 md:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <RootLegalHeader badge="Règlement" theme="secondary"
        title="Conditions Générales <span class='text-secondary'>d'Utilisation</span>"
        subtitle="Les règles d'usage pour garantir un environnement numérique de confiance."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-8 md:gap-12">
        <!-- Sommaire -->
        <RootLegalSidebar :toc="toc" />

        <!-- Contenu Principal -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <!-- Acceptation -->
          <RootLegalSection id="acceptance" title="Acceptation" :index="1" theme="secondary">
            <p>
              L'accès aux services CYPASS implique l'acceptation sans réserve des présentes conditions. Tout
              utilisateur ne les acceptant pas doit renoncer à l'accès aux services.
            </p>
          </RootLegalSection>

          <!-- Conditions d'Accès -->
          <RootLegalSection id="access" title="Conditions d'accès" :index="2" theme="secondary">
            <p>Le service est accessible aux :</p>
            <ul class="mt-4 space-y-4">
              <li class="flex items-start gap-3 p-4 rounded-xl bg-ash/20 border border-ash/50">
                <div
                  class="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5 font-bold text-xs">
                  A</div>
                <div>
                  <strong class="text-BtW">Citoyens :</strong>
                  <p class="text-sm text-hsa mt-1">Disposant d'un NPI valide. L'accès est personnel et incessible.</p>
                </div>
              </li>
              <li class="flex items-start gap-3 p-4 rounded-xl bg-ash/20 border border-ash/50">
                <div
                  class="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-0.5 font-bold text-xs">
                  B</div>
                <div>
                  <strong class="text-BtW">Entreprises :</strong>
                  <p class="text-sm text-hsa mt-1">Disposant d'un compte professionnel vérifié (RCCM, IFU).</p>
                </div>
              </li>
            </ul>
          </RootLegalSection>

          <!-- Responsabilités -->
          <RootLegalSection id="responsibility" title="Responsabilités" :index="3" theme="secondary">
            <div class="space-y-6">
              <div>
                <h4 class="font-bold text-secondary mb-2">Utilisateur</h4>
                <p>
                  L'utilisateur est seul responsable de la confidentialité de ses moyens d'authentification (mot de
                  passe,
                  certificats). Toute action effectuée avec ses identifiants est réputée effectuée par lui.
                </p>
              </div>
              <div class="border-t border-ash/50 pt-6">
                <h4 class="font-bold text-secondary mb-2">CYPASS</h4>
                <p>
                  L'ASIN met en œuvre tous les moyens raisonnables pour assurer la disponibilité du service, mais ne
                  saurait être tenue pour responsable en cas de force majeure, problèmes techniques externes, ou
                  interruption pour maintenance.
                </p>
              </div>
            </div>
          </RootLegalSection>

          <!-- Modification -->
          <RootLegalSection id="modification" title="Modification" :index="4" theme="secondary">
            <p>
              L'ASIN se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés
              des changements majeurs.
            </p>
          </RootLegalSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

// Définition des ancres de navigation
const toc = [
  { id: 'acceptance', label: '1. Acceptation' },
  { id: 'access', label: '2. Conditions d\'Accès' },
  { id: 'responsibility', label: '3. Responsabilités' },
  { id: 'modification', label: '4. Modification' },
]

// Métadonnées SEO
useHead({
  title: 'Conditions Générales d\'Utilisation'
})
</script>
