<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">

    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <div
        class="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow">
      </div>
    </div>

    <div class="max-w-7xl mx-auto">

      <!-- Hero Header -->
      <div class="text-center space-y-4 animate-fade-up mb-16">
        <span class="badge badge-blue">Légal</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Mentions <span class="text-primary">Légales</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Informations réglementaires relatives à l'éditeur du service CYPASS, conformément à la loi sur la confiance
          dans l'économie numérique.
        </p>
        <p class="text-sm text-slate-400">Dernière mise à jour : 15 Janvier 2026</p>
      </div>

      <div class="grid lg:grid-cols-4 gap-12">

        <!-- Sticky TOC -->
        <div class="hidden lg:block lg:col-span-1">
          <div class="sticky top-32 space-y-4">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4 px-4">Sommaire</h3>
            <nav class="flex flex-col space-y-1">
              <a v-for="item in toc" :key="item.id" :href="`#${item.id}`"
                class="px-4 py-2 text-sm rounded-lg transition-colors text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400">
                {{ item.label }}
              </a>
            </nav>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-8 animate-fade-up" style="animation-delay: 100ms">

          <section id="editor"
            class="glass-panel p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-lg">1</span>
              Éditeur du Service
            </h2>
            <div class="prose prose-slate dark:prose-invert max-w-none">
              <p>
                La plateforme <strong>CYPASS</strong> est éditée par l'Agence des Systèmes d'Information et du Numérique
                (ASIN), établissement public à caractère administratif doté de la personnalité morale et de l'autonomie
                financière.
              </p>
              <div class="grid md:grid-cols-2 gap-6 not-prose mt-6">
                <div
                  class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <h4 class="font-bold text-slate-900 dark:text-white mb-2">Siège Social</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Avenue Jean-Paul II<br>
                    Immeuble ASIN<br>
                    Cotonou, Bénin
                  </p>
                </div>
                <div
                  class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <h4 class="font-bold text-slate-900 dark:text-white mb-2">Contact</h4>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Tél : +229 21 31 00 00<br>
                    Email : contact@asin.bj
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="hosting"
            class="glass-panel p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-lg">2</span>
              Hébergement
            </h2>
            <div class="prose prose-slate dark:prose-invert max-w-none">
              <p>
                Le service est hébergé sur les infrastructures souveraines de l'État béninois, opérées par la Société
                Béninoise d'Infrastructures Numériques (SBIN).
              </p>
              <ul class="not-prose space-y-2 mt-4">
                <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <IconServer class="w-5 h-5 text-primary" />
                  Centre de Données National, Cotonou
                </li>
                <li class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <IconCertificate class="w-5 h-5 text-primary" />
                  Conforme au norme ISO 18004
                </li>
              </ul>
            </div>
          </section>

          <section id="ip"
            class="glass-panel p-8 md:p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span
                class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-lg">3</span>
              Propriété Intellectuelle
            </h2>
            <div class="prose prose-slate dark:prose-invert max-w-none">
              <p>
                L'ensemble des contenus (structure, design, textes, images, logo, base de données) présents sur le
                portail CYPASS est la propriété exclusive de l'État béninois, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments
                du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable
                de l'ASIN.
              </p>
            </div>
          </section>
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
