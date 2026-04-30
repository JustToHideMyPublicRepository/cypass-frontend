<template>
  <section class="py-24 relative overflow-hidden bg-bgClr">
    <!-- Background Decors -->
    <div class="absolute top-0 right-0 w-1/2 h-[500px] bg-primary/5 rounded-bl-[100px] blur-3xl -z-10"></div>
    <div class="absolute bottom-0 left-0 w-1/2 h-[300px] bg-secondary/5 rounded-tr-[100px] blur-3xl -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-block px-4 py-1.5 rounded-full border border-ash bg-WtB text-[10px] font-bold uppercase tracking-[0.2em] text-hsa mb-4">
          Tarification
        </span>
        <h2 class="text-3xl md:text-5xl font-bold leading-tight text-BtW mb-4">
          Des offres adaptées à <span class="font-handwritting text-primary">vos besoins</span>
        </h2>
        <p class="text-hsa text-lg">
          Un modèle conçu pour les réalités économiques des PME africaines. <br class="hidden sm:block" />
          Pas de surprise, pas de frais cachés. Commencez gratuitement.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Card 1: Basique -->
        <div class="bg-ash/40 backdrop-blur-xl p-8 rounded-3xl border border-ash/50 flex flex-col hover:-translate-y-2 transition-transform duration-300">
          <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <IconUser class="w-7 h-7" />
          </div>
          <h3 class="text-2xl font-black text-BtW mb-2">Packs Basiques</h3>
          <p class="text-hsa mb-6 flex-1">
            Certifiez vos documents et signalez des incidents. Idéal pour les particuliers et les PME ayant un flux régulier.
          </p>
          <div class="mb-8">
            <p class="text-sm text-hsa font-medium">À partir de</p>
            <p class="text-3xl font-black text-BtW">0 <span class="text-xl">FCFA</span></p>
          </div>
          <NuxtLink to="/pricings?tab=basic" class="flex items-center text-sm font-bold text-primary hover:text-primary/80 group">
            Voir les packs
            <IconArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <!-- Card 2: Extensions -->
        <div class="bg-ash/40 backdrop-blur-xl p-8 rounded-3xl border border-secondary/20 flex flex-col hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent -z-10"></div>
          <div class="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
            <IconPuzzle class="w-7 h-7" />
          </div>
          <h3 class="text-2xl font-black text-BtW mb-2">Extensions</h3>
          <p class="text-hsa mb-6 flex-1">
            Boostez votre profil public : QR perso, badge Verified, historique des signalements, etc.
          </p>
          <div class="mb-8">
            <p class="text-sm text-hsa font-medium">À partir de</p>
            <p class="text-3xl font-black text-BtW">1 500 <span class="text-xl">FCFA</span><span class="text-sm text-hsa font-normal"> /mois</span></p>
          </div>
          <NuxtLink to="/pricings?tab=extension" class="flex items-center text-sm font-bold text-secondary hover:text-secondary/80 group">
            Découvrir les modules
            <IconArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <!-- Card 3: API -->
        <div class="bg-ash/40 backdrop-blur-xl p-8 rounded-3xl border border-ash/50 flex flex-col hover:-translate-y-2 transition-transform duration-300">
          <div class="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-success mb-6">
            <IconCode class="w-7 h-7" />
          </div>
          <h3 class="text-2xl font-black text-BtW mb-2">Intégration API</h3>
          <p class="text-hsa mb-6 flex-1">
            Connectez vos propres systèmes à l'écosystème CYPASS via nos webhooks et API REST souveraines.
          </p>
          <div class="mb-8">
            <p class="text-sm text-hsa font-medium">Test de l'API</p>
            <p class="text-3xl font-black text-BtW">Gratuit</p>
          </div>
          <NuxtLink to="/pricings?tab=api" class="flex items-center text-sm font-bold text-success hover:text-success/80 group">
            Consulter les tarifs API
            <IconArrowRight class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

      </div>
      
      <div class="mt-12 text-center">
        <UiBaseButton to="/pricings" variant="primary" class="rounded-full shadow-lg shadow-primary/20">
          Comparer toutes les offres
        </UiBaseButton>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { IconUser, IconPuzzle, IconCode, IconArrowRight } from '@tabler/icons-vue'
</script>
