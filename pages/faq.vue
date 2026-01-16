<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <div
        class="absolute top-[10%] right-[30%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow">
      </div>
    </div>

    <div class="max-w-4xl mx-auto space-y-16">

      <div class="text-center space-y-4 animate-fade-up">
        <span class="badge badge-blue">Aide & Support</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Questions <span class="text-primary">Fréquentes</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          Tout ce que vous devez savoir pour utiliser CYPASS efficacement.
        </p>
      </div>

      <div class="space-y-6">
        <div v-for="(category, catIndex) in faqCategories" :key="catIndex" class="animate-fade-up"
          :style="{ animationDelay: `${catIndex * 100}ms` }">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-primary">{{
            category.title }}</h2>

          <div class="space-y-4">
            <div v-for="(item, index) in category.items" :key="index"
              class="glass-panel rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 transition-all duration-300"
              :class="{ 'shadow-lg shadow-primary/5': activeIndex === `${catIndex}-${index}` }">

              <button @click="toggle(`${catIndex}-${index}`)"
                class="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <span class="font-bold text-slate-800 dark:text-slate-200 text-lg">{{ item.question }}</span>
                <IconChevronDown class="w-5 h-5 text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-180 text-primary': activeIndex === `${catIndex}-${index}` }" />
              </button>

              <div v-show="activeIndex === `${catIndex}-${index}`"
                class="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center pt-12 animate-fade-up">
        <p class="text-slate-500 dark:text-slate-400 mb-4">Vous ne trouvez pas votre réponse ?</p>
        <NuxtLink to="/support" class="btn btn-primary">Contacter le support</NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const activeIndex = ref<string | null>(null)

const toggle = (id: string) => {
  activeIndex.value = activeIndex.value === id ? null : id
}

const faqCategories = [
  {
    title: 'Général',
    items: [
      {
        question: 'Qu\'est-ce que CYPASS ?',
        answer: 'CYPASS est l\'infrastructure nationale de confiance numérique du Bénin. Elle permet l\'authentification sécurisée, la signature électronique et l\'échange de documents certifiés pour les citoyens et les entreprises.'
      },
      {
        question: 'Est-ce un service gratuit ?',
        answer: 'L\'accès aux services de base (identité numérique, consultation) est gratuit pour tous les citoyens. Certains services avancés pour les entreprises peuvent être soumis à tarification.'
      }
    ]
  },
  {
    title: 'Compte & Sécurité',
    items: [
      {
        question: 'Comment créer un compte ?',
        answer: 'Vous avez besoin de votre Numéro Personnel d\'Identification (NPI) figurant sur votre carte CIP ou biométrique. Cliquez sur "Connexion" puis suivez la procédure d\'enrôlement.'
      },
      {
        question: 'J\'ai oublié mon mot de passe',
        answer: 'Rendez-vous sur la page de connexion et cliquez sur "Mot de passe oublié". Un lien de réinitialisation vous sera envoyé par email ou SMS sécurisé.'
      }
    ]
  },
  {
    title: 'Technique',
    items: [
      {
        question: 'Comment intégrer CYPASS à mon application ?',
        answer: 'Consultez notre documentation développeur pour accéder aux API OAuth2 et OpenID Connect. Des SDK sont disponibles pour les langages les plus courants.'
      }
    ]
  }
]
</script>
