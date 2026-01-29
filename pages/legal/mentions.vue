<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <RootLegalHeader badge="Légal" title="Mentions <span class='text-primary'>Légales</span>"
        subtitle="Informations réglementaires relatives à l'éditeur du service CYPASS, conformément à la loi sur la confiance dans l'économie numérique."
        lastUpdate="15 Janvier 2026" />

      <div class="grid lg:grid-cols-4 gap-12">
        <RootLegalSidebar :toc="toc" />

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">
          <RootLegalSection id="editor" title="Éditeur du Service" :index="1">
            <p>
              La plateforme <strong>CYPASS</strong> est éditée par l'Agence des Systèmes d'Information et du Numérique
              (ASIN), établissement public à caractère administratif doté de la personnalité morale et de l'autonomie
              financière.
            </p>
            <div class="grid md:grid-cols-2 gap-6 not-prose mt-6">
              <div class="p-4 rounded-2xl bg-ash/50 border border-ash">
                <h4 class="font-bold mb-2">Siège Social</h4>
                <p class="text-sm text-hsa">
                  Avenue Jean-Paul II<br>
                  Immeuble ASIN<br>
                  Cotonou, Bénin
                </p>
              </div>
              <div class="p-4 rounded-2xl bg-ash/50 border border-ash">
                <h4 class="font-bold mb-2">Contact</h4>
                <p class="text-sm text-hsa">
                  Tél : +229 21 31 00 00<br>
                  Email : contact@asin.bj
                </p>
              </div>
            </div>
          </RootLegalSection>

          <RootLegalSection id="hosting" title="Hébergement" :index="2">
            <p>
              Le service est hébergé sur les infrastructures souveraines de l'État béninois, opérées par la Société
              Béninoise d'Infrastructures Numériques (SBIN).
            </p>
            <ul class="not-prose space-y-2 mt-4">
              <li class="flex items-center gap-3 text-sm text-hsa">
                <IconServer class="w-5 h-5 text-primary" />
                Centre de Données National, Cotonou
              </li>
              <li class="flex items-center gap-3 text-sm text-hsa">
                <IconCertificate class="w-5 h-5 text-primary" />
                Conforme au norme ISO 18004
              </li>
            </ul>
          </RootLegalSection>

          <RootLegalSection id="ip" title="Propriété Intellectuelle" :index="3">
            <p>
              L'ensemble des contenus (structure, design, textes, images, logo, base de données) présents sur le
              portail CYPASS est la propriété exclusive de l'État béninois, sauf mention contraire.
            </p>
            <p>
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

const toc = [
  { id: 'editor', label: '1. Éditeur du Service' },
  { id: 'hosting', label: '2. Hébergement' },
  { id: 'ip', label: '3. Propriété Intellectuelle' },
]

useHead({
  title: 'Mentions Légales'
})
</script>
