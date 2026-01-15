<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">

    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <div
        class="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[100px] animate-pulse-slow">
      </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-16">

      <!-- Header -->
      <div class="text-center space-y-8 animate-fade-up">
        <span class="badge badge-blue">Support 24/7</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Comment pouvons-nous <span class="text-cypass-blue">vous aider ?</span>
        </h1>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IconSearch class="w-5 h-5 text-slate-400 group-focus-within:text-cypass-blue transition-colors" />
          </div>
          <input type="text"
            class="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 focus:ring-2 focus:ring-cypass-blue focus:border-cypass-blue dark:text-white transition-all outline-none"
            placeholder="Rechercher une réponse (ex: Comment réinitialiser mon mot de passe...)">
        </div>
      </div>

      <!-- Categories -->
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(category, index) in categories" :key="index"
          class="glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer group animate-fade-up border border-slate-200/50 dark:border-slate-800/50"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div
            :class="`w-14 h-14 rounded-2xl ${category.color} flex items-center justify-center mb-6 text-white text-2xl shadow-lg`">
            <component :is="category.icon" class="w-7 h-7" />
          </div>
          <h3
            class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cypass-blue transition-colors">
            {{ category.title }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">{{ category.desc }}</p>
          <span class="text-cypass-blue text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
            Explorer
            <IconArrowRight class="w-4 h-4" />
          </span>
        </div>
      </div>

      <!-- FAQ Teaser -->
      <div
        class="glass-panel p-8 md:p-12 rounded-3xl animate-fade-up flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-200/50 dark:border-slate-800/50">
        <div class="space-y-4 text-center md:text-left">
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Questions Fréquentes</h3>
          <p class="text-slate-500 dark:text-slate-400 max-w-lg">
            Consultez notre base de connaissances pour trouver des réponses rapides aux questions les plus courantes.
          </p>
        </div>
        <NuxtLink to="/faq" class="btn btn-primary px-8">Voir la FAQ</NuxtLink>
      </div>

      <!-- Contact Section -->
      <div class="text-center space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800">
        <p class="text-slate-500 dark:text-slate-400">Vous ne trouvez pas ce que vous cherchez ?</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="mailto:support@cypass.bj" class="btn btn-ghost border border-slate-200 dark:border-slate-800">
            <IconMail class="w-5 h-5 mr-2" /> Envoyer un email
          </a>
          <a href="tel:+22921310000" class="btn btn-ghost border border-slate-200 dark:border-slate-800">
            <IconPhone class="w-5 h-5 mr-2" /> +229 21 31 00 00
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconArrowRight, IconUserCircle, IconShieldLock, IconTerminal2, IconMail, IconPhone } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const categories = [
  {
    title: 'Compte & Profil',
    desc: 'Gestion de votre identité, mise à jour des informations et paramètres de compte.',
    icon: IconUserCircle,
    color: 'bg-blue-500'
  },
  {
    title: 'Sécurité & Accès',
    desc: 'Double authentification, réinitialisation de mot de passe et historique de connexion.',
    icon: IconShieldLock,
    color: 'bg-green-500'
  },
  {
    title: 'Développeurs & API',
    desc: 'Intégration technique, documentation API et gestion des clés d\'accès.',
    icon: IconTerminal2,
    color: 'bg-purple-500'
  }
]
</script>
