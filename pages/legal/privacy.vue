<template>
  <div class="relative py-8 md:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <RootLegalHeader badge="RGPD / APDP" theme="success"
        title="Politique de <span class='text-success'>Confidentialité</span>"
        subtitle="Nous nous engageons à protéger vos données personnelles avec la plus grande transparence et selon les standards de sécurité les plus élevés."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-8 md:gap-12">
        <!-- Sommaire -->
        <RootLegalSidebar :toc="toc" />

        <!-- Contenu Principal -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <!-- Données collectées -->
          <RootLegalSection id="collection" title="Données collectées" :index="1" theme="success">
            <p>Dans le cadre de l'utilisation du service CYPASS, nous limitons la collecte aux données strictement
              nécessaires :</p>
            <div class="grid md:grid-cols-2 gap-4 not-prose mt-6">
              <div class="p-5 rounded-2xl bg-ash/30 border border-ash/50 backdrop-blur-sm">
                <h4 class="font-bold text-success mb-3">Identité</h4>
                <ul class="text-sm text-hsa space-y-2">
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Nom et Prénoms
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Numéro Personnel d'Identification (NPI)
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Date de naissance
                  </li>
                </ul>
              </div>
              <div class="p-5 rounded-2xl bg-ash/30 border border-ash/50 backdrop-blur-sm">
                <h4 class="font-bold text-success mb-3">Technique</h4>
                <ul class="text-sm text-hsa space-y-2">
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Adresse IP et horodatage
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Métadonnées de signature
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-success"></div> Logs d'authentification
                  </li>
                </ul>
              </div>
            </div>
          </RootLegalSection>

          <!-- Finalités -->
          <RootLegalSection id="purpose" title="Finalités" :index="2" theme="success">
            <p>Vos données sont traitées exclusivement pour :</p>
            <ul class="mt-4 space-y-2 list-disc list-inside">
              <li>Garantir l'identification unique et l'authentification forte.</li>
              <li>Assurer la non-répudiation des signatures électroniques.</li>
              <li>Prévenir et détecter les tentatives de fraude ou d'intrusion.</li>
              <li>Assurer la maintenance et la sécurité de la plateforme.</li>
            </ul>
          </RootLegalSection>

          <!-- Vos droits -->
          <RootLegalSection id="rights" title="Vos droits" :index="3" theme="success">
            <p>
              Conformément au Code du Numérique en vigueur, vous disposez des droits suivants :
            </p>
            <ul class="not-prose grid gap-4 mt-6">
              <li
                class="flex items-center gap-4 p-4 rounded-xl border border-ash/50 bg-ash/10 hover:bg-ash/20 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <IconUserCheck class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-BtW">Accès et rectification</div>
                  <div class="text-[11px] text-hsa">Consultez et modifiez vos infos à tout moment.</div>
                </div>
              </li>
              <li
                class="flex items-center gap-4 p-4 rounded-xl border border-ash/50 bg-ash/10 hover:bg-ash/20 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <IconEraser class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-BtW">Effacement</div>
                  <div class="text-[11px] text-hsa">Supprimez vos données (selon les durées légales).</div>
                </div>
              </li>
              <li
                class="flex items-center gap-4 p-4 rounded-xl border border-ash/50 bg-ash/10 hover:bg-ash/20 transition-colors">
                <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <IconHistory class="w-5 h-5" />
                </div>
                <div>
                  <div class="text-sm font-bold text-BtW">Limitation</div>
                  <div class="text-[11px] text-hsa">Restreignez le traitement de vos informations.</div>
                </div>
              </li>
            </ul>
            <div class="mt-8 p-6 rounded-2xl bg-success/5 border border-success/20">
              <p class="text-sm leading-relaxed">
                Pour exercer ces droits, contactez notre Délégué à la Protection des Données (DPO) : <br>
                <a href="mailto:dpo@cypass.bj"
                  class="text-success font-black hover:underline inline-flex items-center gap-1 mt-1">
                  dpo@cypass.bj
                </a>
              </p>
            </div>
          </RootLegalSection>

          <!-- Sécurité -->
          <RootLegalSection id="security" title="Sécurité" :index="4" theme="success" type="success">
            <p>
              La sécurité est au cœur de CYPASS. Nous appliquons les standards les plus stricts : chiffrement de bout
              en bout (SHA-256), HSM pour la gestion des clés, et audits de sécurité réguliers par l'ASIN.
            </p>
          </RootLegalSection>
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

// Définition des ancres de navigation
const toc = [
  { id: 'collection', label: '1. Données Collectées' },
  { id: 'purpose', label: '2. Finalités' },
  { id: 'rights', label: '3. Vos Droits' },
  { id: 'security', label: '4. Sécurité' },
]

// Métadonnées SEO
useHead({
  title: 'Politique de Confidentialité'
})
</script>
