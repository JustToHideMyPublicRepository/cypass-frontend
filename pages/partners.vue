<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
    <div class="max-w-5xl mx-auto space-y-16">

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
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(partner, index) in partners" :key="partner.name"
          class="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div
            class="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 text-2xl font-bold text-slate-400">
            {{ partner.initials }}
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{{ partner.name }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">{{ partner.role }}</p>
          <a href="#" class="btn btn-secondary text-xs px-4 py-2">Visiter le site</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
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
