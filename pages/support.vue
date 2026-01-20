<template>
  <div class="relative pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-16">
      <!-- Header -->
      <div class="text-center space-y-8 animate-fade-up">
        <span class="badge badge-primary">Centre d'Aide</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight">
          Comment pouvons-nous <span class="text-primary">vous aider ?</span>
        </h1>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
          </div>
          <input type="text"
            class="block w-full pl-12 pr-4 py-4 bg-WtB border border-ash rounded-2xl shadow-lg shadow-ash/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            placeholder="Rechercher une réponse, une API ou un guide...">
        </div>
      </div>

      <!-- Categories -->
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(category, index) in categories" :key="index"
          class="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer group animate-fade-up border border-ash/50"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-lg"
            :class="category.colorClass">
            <component :is="category.icon" class="w-7 h-7" />
          </div>
          <h3 class="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {{ category.title }}</h3>
          <p class="text-hsa text-sm leading-relaxed mb-6">{{ category.desc }}</p>
          <span class="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            Explorer
            <IconArrowRight class="w-4 h-4" />
          </span>
        </div>
      </div>

      <!-- FAQ Teaser -->
      <div
        class="glass-panel p-8 md:p-12 rounded-3xl animate-fade-up flex flex-col md:flex-row items-center justify-between gap-8 border border-ash/50">
        <div class="space-y-4 text-center md:text-left">
          <h3 class="text-2xl font-bold text-BtW">Questions Fréquentes</h3>
          <p class="text-hsa max-w-lg">
            Consultez notre base de connaissances pour trouver des réponses rapides aux questions les plus courantes.
          </p>
        </div>
        <UiBaseButton to="/faq" variant="primary" class="px-8">Voir la FAQ</UiBaseButton>
      </div>

      <!-- Developers Section (Merged from Docs) -->
      <div id="developers" class="space-y-8 animate-fade-up pt-12 border-t border-ash">
        <div class="text-center space-y-4">
          <span class="badge badge-primary">Espace Développeurs</span>
          <h2 class="text-3xl font-bold text-BtW">Intégration & API</h2>
          <p class="text-hsa max-w-2xl mx-auto">
            Accédez à nos ressources techniques pour intégrer CYPASS dans vos applications.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            class="group relative overflow-hidden glass-panel p-8 rounded-3xl border border-ash/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/10 cursor-pointer">
            <div
              class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconRocket class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              Démarrage Rapide</h3>
            <p class="text-hsa text-sm leading-relaxed mb-4">
              Intégrez le bouton "Se connecter avec CYPASS" en moins de 10 minutes.
            </p>
            <span class="flex items-center text-sm font-bold text-primary">
              Voir le tutoriel
              <IconArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div
            class="group relative overflow-hidden glass-panel p-8 rounded-3xl border border-ash/50 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-secondary/10 cursor-pointer">
            <div
              class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconApi class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold mb-2 group-hover:text-secondary transition-colors">
              Référence API</h3>
            <p class="text-hsa text-sm leading-relaxed mb-4">
              Documentation complète des endpoints REST, schémas de données et codes d'erreur.
            </p>
            <span class="flex items-center text-sm font-bold text-secondary">
              Explorer l'API
              <IconArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div
            class="group relative overflow-hidden glass-panel p-8 rounded-3xl border border-ash/50 hover:border-success/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-success/10 cursor-pointer">
            <div
              class="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconCode class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold mb-2 group-hover:text-success transition-colors">
              SDKs & Outils</h3>
            <p class="text-hsa text-sm leading-relaxed mb-4">
              Bibliothèques officielles pour Node.js, Python, PHP, Java et Go.
            </p>
            <span class="flex items-center text-sm font-bold text-success">
              Télécharger
              <IconArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="text-center space-y-6 pt-12 border-t border-ash">
        <p class="text-hsa">Besoin d'une assistance personnalisée ?</p>
        <div class="flex flex-wrap justify-center gap-4">
          <UiBaseButton href="mailto:support@cypass.bj" variant="secondary" class="border border-ash">
            <IconMail class="w-5 h-5 mr-2" /> Envoyer un email
          </UiBaseButton>
          <UiBaseButton href="tel:+22921310000" variant="secondary" class="border border-ash">
            <IconPhone class="w-5 h-5 mr-2" /> +229 21 31 00 00
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconArrowRight, IconUserCircle, IconShieldLock, IconTerminal2, IconMail, IconPhone, IconRocket, IconApi, IconCode } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const categories = [
  {
    title: 'Compte & Profil',
    desc: 'Gestion de votre identité, mise à jour des informations et paramètres de compte.',
    icon: IconUserCircle,
    colorClass: 'bg-primary/10 text-primary'
  },
  {
    title: 'Sécurité & Accès',
    desc: 'Double authentification, réinitialisation de mot de passe et historique de connexion.',
    icon: IconShieldLock,
    colorClass: 'bg-success/10 text-success'
  },
  {
    title: 'Développeurs & API',
    desc: 'Accédez directement à la section technique ci-dessous.',
    icon: IconTerminal2,
    colorClass: 'bg-secondary/10 text-secondary'
  }
]

useHead({
  title: 'Centre d\'aide'
})
</script>
