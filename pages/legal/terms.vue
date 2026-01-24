<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <IndLegalHeader badge="Règlement" theme="secondary"
        title="Conditions Générales <span class='text-secondary'>d'Utilisation</span>"
        subtitle="Les règles d'usage pour garantir un environnement numérique de confiance."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-12">
        <IndLegalSidebar :toc="toc" />

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <IndLegalSection id="acceptance" title="Acceptation" :index="1" theme="secondary">
            <p>
              L'accès aux services CYPASS implique l'acceptation sans réserve des présentes conditions. Tout
              utilisateur ne les acceptant pas doit renoncer à l'accès aux services.
            </p>
          </IndLegalSection>

          <IndLegalSection id="access" title="Conditions d'Accès" :index="2" theme="secondary">
            <p>Le service est accessible aux :</p>
            <ul>
              <li><strong>Citoyens :</strong> Disposant d'un NPI valide. L'accès est personnel et incessible.</li>
              <li><strong>Entreprises :</strong> Disposant d'un compte professionnel vérifié (RCCM, IFU).</li>
            </ul>
          </IndLegalSection>

          <IndLegalSection id="responsibility" title="Responsabilités" :index="3" theme="secondary">
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
          </IndLegalSection>

          <IndLegalSection id="modification" title="Modification" :index="4" theme="secondary">
            <p>
              L'ASIN se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés
              des changements majeurs.
            </p>
          </IndLegalSection>
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
