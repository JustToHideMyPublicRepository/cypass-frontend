<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]">
      </div>
      <div
        class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cypass-blue/10 rounded-full blur-[100px] animate-pulse-slow">
      </div>
      <div
        class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse-slower">
      </div>
    </div>

    <div class="max-w-7xl mx-auto space-y-20 relative z-10">

      <div class="text-center space-y-4 animate-fade-up">
        <span class="badge badge-green">Écosystème</span>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Nos Partenaires <br />
          <span class="text-cypass-green">Institutionnels</span>
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Nous collaborons avec les acteurs clés de la sécurité et du numérique au Bénin pour garantir un service de
          confiance.
        </p>
        <button @click="isModalOpen = true" class="btn btn-primary mt-8">
          Devenir Partenaire
        </button>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(partner, index) in partners" :key="partner.name"
          class="group glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 animate-fade-up relative overflow-hidden border border-slate-200/50 dark:border-slate-800/50 hover:shadow-xl hover:shadow-cypass-blue/10"
          :style="{ animationDelay: `${index * 100}ms` }">

          <div
            class="absolute inset-0 bg-gradient-to-br from-cypass-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>

          <div
            class="relative w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-inner flex items-center justify-center mb-6 text-2xl font-bold text-slate-400 group-hover:text-cypass-blue transition-colors group-hover:scale-110 duration-300">
            {{ partner.initials }}
          </div>
          <h3
            class="relative text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cypass-blue transition-colors">
            {{ partner.name }}</h3>
          <p class="relative text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{{ partner.role }}</p>
          <a href="#" class="relative btn btn-ghost btn-sm text-xs px-4 hover:bg-cypass-blue/10">Visiter le site</a>
        </div>
      </div>

    </div>

    <!-- Partner Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" @click="isModalOpen = false"></div>

        <!-- Modal Panel -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div
            class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 animate-fade-up"
            @click.stop>
            <!-- Close Button -->
            <button @click="isModalOpen = false"
              class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <IconX class="w-6 h-6" />
            </button>

            <!-- Header -->
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white">Devenir Partenaire</h3>
              <p class="text-slate-500 dark:text-slate-400 mt-2">Rejoignez l'écosystème de confiance CYPASS.</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="submitPartnerRequest" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom de
                  l'organisation</label>
                <input type="text" required class="input input-bordered w-full bg-slate-50 dark:bg-slate-800"
                  placeholder="Ex: Tech Solutions" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact</label>
                  <input type="text" required class="input input-bordered w-full bg-slate-50 dark:bg-slate-800"
                    placeholder="Nom complet" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" required class="input input-bordered w-full bg-slate-50 dark:bg-slate-800"
                    placeholder="email@company.com" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                <textarea class="textarea textarea-bordered w-full bg-slate-50 dark:bg-slate-800 h-24"
                  placeholder="Décrivez votre projet de partenariat..."></textarea>
              </div>

              <div class="pt-4 flex gap-3">
                <button type="button" @click="isModalOpen = false" class="btn btn-ghost flex-1">Annuler</button>
                <button type="submit" class="btn btn-primary flex-1">Envoyer la demande</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconX } from '@tabler/icons-vue'

const isModalOpen = ref(false)

const submitPartnerRequest = () => {
  // Simulate API call
  console.log('Partner request submitted')
  // Close modal after delay to simulate success
  setTimeout(() => {
    isModalOpen.value = false
  }, 1000)
}

const partners = [
  {
    name: 'ASIN',
    initials: 'ASIN',
    role: 'Agence des Systèmes d\'Information et du Numérique'
  },
  {
    name: 'BJ-CSIRT',
    initials: 'CSIRT',
    role: 'Centre de Réponse aux Incidents de Sécurité Informatique'
  },
  {
    name: 'ARCEP',
    initials: 'ARCEP',
    role: 'Autorité de Régulation des Communications Électroniques'
  },
  {
    name: 'Ministère du Numérique et de la Digitalisation',
    initials: 'MND',
    role: 'Ministère de tutelle'
  },
  {
    name: 'APIEX',
    initials: 'APIEX',
    role: 'Agence de Promotion des Investissements et des Exportations'
  },
]

definePageMeta({
  layout: 'guest'
})
</script>
