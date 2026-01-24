<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <IndLegalHeader badge="RGPD / APDP" theme="success"
        title="Politique de <span class='text-success'>Confidentialité</span>"
        subtitle="Nous nous engageons à protéger vos données personnelles avec la plus grande transparence et selon les standards de sécurité les plus élevés."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-12">
        <IndLegalSidebar :toc="toc" />

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <IndLegalSection id="collection" title="Données Collectées" :index="1" theme="success">
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
          </IndLegalSection>

          <IndLegalSection id="purpose" title="Finalités" :index="2" theme="success">
            <p>Vos données sont traitées exclusivement pour :</p>
            <ul>
              <li>Garantir l'identification unique et l'authentification forte.</li>
              <li>Assurer la non-répudiation des signatures électroniques.</li>
              <li>Prévenir et détecter les tentatives de fraude ou d'intrusion.</li>
              <li>Assurer la maintenance et la sécurité de la plateforme.</li>
            </ul>
          </IndLegalSection>

          <IndLegalSection id="rights" title="Vos Droits" :index="3" theme="success">
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
          </IndLegalSection>

          <IndLegalSection id="security" title="Sécurité" :index="4" theme="success" type="success">
            <p>
              La sécurité est au cœur de CYPASS. Nous appliquons les standards les plus stricts : chiffrement de bout
              en bout (SHA-256), HSM pour la gestion des clés, et audits de sécurité réguliers par l'ASIN.
            </p>
          </IndLegalSection>
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
