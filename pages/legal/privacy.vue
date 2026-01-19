<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Header -->
      <div class="text-center space-y-4 animate-fade-up mb-16">
        <span class="badge badge-success">RGPD / APDP</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight">
          Politique de <span class="text-success">Confidentialité</span>
        </h1>
        <p class="text-lg text-hsa max-w-2xl mx-auto">
          Nous nous engageons à protéger vos données personnelles avec la plus grande transparence et selon les
          standards de sécurité les plus élevés.
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
                class="px-4 py-2 text-sm rounded-lg transition-colors text-hsa hover:text-success hover:bg-ash">
                {{ item.label }}
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <section id="collection" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-lg">1</span>
              Données Collectées
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>Dans le cadre de l'utilisation du service CYPASS, nous limitons la collecte aux données strictement
                nécessaires :</p>
              <div class="grid md:grid-cols-2 gap-4 not-prose mt-4">
                <div class="p-4 rounded-xl bg-ash/50">
                  <h4 class="font-bold mb-2">Identité</h4>
                  <ul class="text-sm text-hsa space-y-1">
                    <li>Nom et Prénoms</li>
                    <li>Numéro Personnel d'Identification (NPI)</li>
                    <li>Date de naissance</li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-ash/50">
                  <h4 class="font-bold mb-2">Technique</h4>
                  <ul class="text-sm text-hsa space-y-1">
                    <li>Adresse IP et horodatage</li>
                    <li>Métadonnées de signature</li>
                    <li>Logs d'authentification</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="purpose" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-lg">2</span>
              Finalités
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>Vos données sont traitées exclusivement pour :</p>
              <ul>
                <li>Garantir l'identification unique et l'authentification forte.</li>
                <li>Assurer la non-répudiation des signatures électroniques.</li>
                <li>Prévenir et détecter les tentatives de fraude ou d'intrusion.</li>
                <li>Assurer la maintenance et la sécurité de la plateforme.</li>
              </ul>
            </div>
          </section>

          <section id="rights" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-lg">3</span>
              Vos Droits
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>
                Conformément au Code du Numérique en vigueur, vous disposez des droits suivants :
              </p>
              <ul class="not-prose grid gap-3 mt-4">
                <li class="flex items-center gap-3 p-3 rounded-lg border border-ash">
                  <IconUserCheck class="w-5 h-5 text-success" />
                  <span class="text-sm font-medium">Droit d'accès et de rectification</span>
                </li>
                <li class="flex items-center gap-3 p-3 rounded-lg border border-ash">
                  <IconEraser class="w-5 h-5 text-success" />
                  <span class="text-sm font-medium">Droit à l'effacement (sous conditions légales)</span>
                </li>
                <li class="flex items-center gap-3 p-3 rounded-lg border border-ash">
                  <IconHistory class="w-5 h-5 text-success" />
                  <span class="text-sm font-medium">Droit à la limitation du traitement</span>
                </li>
              </ul>
              <p class="mt-6">
                Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) : <br>
                <a href="mailto:dpo@cypass.bj" class="text-success font-bold hover:underline">dpo@cypass.bj</a>
              </p>
            </div>
          </section>

          <section id="security" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50 bg-success/5">
            <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success text-lg">4</span>
              Sécurité
            </h2>
            <div class="prose prose-slate max-w-none">
              <p>
                La sécurité est au cœur de CYPASS. Nous appliquons les standards les plus stricts : chiffrement de bout
                en bout (SHA-256), HSM pour la gestion des clés, et audits de sécurité réguliers par l'ASIN.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUserCheck, IconEraser, IconHistory } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const toc = [
  { id: 'collection', label: '1. Données Collectées' },
  { id: 'purpose', label: '2. Finalités' },
  { id: 'rights', label: '3. Vos Droits' },
  { id: 'security', label: '4. Sécurité' },
]

useHead({
  title: 'Politique de Confidentialité'
})
</script>
