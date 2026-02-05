<template>
  <div class="relative py-8 md:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête de la page -->
      <RootLegalHeader badge="Légal" title="Mentions <span class='text-primary'>Légales</span>"
        subtitle="Informations réglementaires relatives à l'éditeur du service CYPASS, conformément à la loi sur la confiance dans l'économie numérique."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-8 md:gap-12">
        <!-- Sommaire (caché sur mobile) -->
        <RootLegalSidebar :toc="toc" />

        <!-- Contenu Principal -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <!-- Éditeur -->
          <RootLegalSection id="editor" title="Éditeur du service" :index="1">
            <p>
              La plateforme <strong>CYPASS</strong> est éditée par l'Agence des Systèmes d'Information et du Numérique
              (ASIN), établissement public à caractère administratif doté de la personnalité morale et de l'autonomie
              financière.
            </p>
            <div class="grid md:grid-cols-2 gap-4 md:gap-6 not-prose mt-6">
              <div class="p-5 rounded-2xl bg-ash/30 border border-ash/50 backdrop-blur-sm">
                <h4 class="font-bold mb-2">Siège Social</h4>
                <p class="text-sm text-hsa leading-relaxed">
                  Avenue Jean-Paul II<br>
                  Immeuble ASIN<br>
                  Cotonou, Bénin
                </p>
              </div>
              <div class="p-5 rounded-2xl bg-ash/30 border border-ash/50 backdrop-blur-sm">
                <h4 class="font-bold mb-2">Contact</h4>
                <p class="text-sm text-hsa leading-relaxed">
                  Tél : +229 01XXXXXXXX<br>
                  Email : support@cypass.bj
                </p>
              </div>
            </div>
          </RootLegalSection>

          <!-- Hébergement -->
          <RootLegalSection id="hosting" title="Hébergement" :index="2">
            <p>
              Le service est hébergé sur les infrastructures souveraines de l'État béninois, opérées par la Société
              Béninoise d'Infrastructures Numériques (SBIN).
            </p>
            <ul class="not-prose space-y-3 mt-6">
              <li class="flex items-center gap-3 text-sm text-hsa">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <IconServer class="w-5 h-5" />
                </div>
                Centre de Données National, Cotonou
              </li>
              <li class="flex items-center gap-3 text-sm text-hsa">
                <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <IconCertificate class="w-5 h-5" />
                </div>
                Conforme au norme ISO 18004
              </li>
            </ul>
          </RootLegalSection>

          <!-- Propriété intellectuelle -->
          <RootLegalSection id="ip" title="Propriété intellectuelle" :index="3">
            <p>
              L'ensemble des contenus (structure, design, textes, images, logo, base de données) présents sur le
              portail CYPASS est la propriété exclusive de l'État béninois, sauf mention contraire.
            </p>
            <p class="mt-4">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments
              du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable
              de l'ASIN.
            </p>
          </RootLegalSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconServer, IconCertificate } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

// Définition du sommaire pour la navigation rapide
const toc = [
  { id: 'editor', label: '1. Éditeur du Service' },
  { id: 'hosting', label: '2. Hébergement' },
  { id: 'ip', label: '3. Propriété Intellectuelle' },
]

// Métadonnées SEO
useHead({
  title: 'Mentions Légales'
})
</script>
