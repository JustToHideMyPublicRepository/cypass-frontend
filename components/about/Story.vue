<template>
  <section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid lg:grid-cols-2 gap-16">
        <div data-aos="fade-right">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Notre Histoire</h2>
          <div class="space-y-8 relative pl-8 border-l-2 border-slate-200 dark:border-slate-800">
            <div v-for="event in timeline" :key="event.year" class="relative">
              <div
                class="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950 bg-cypass-blue">
              </div>
              <span class="text-cypass-blue font-bold text-sm block mb-1">{{ event.year }}</span>
              <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">{{ event.title }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ event.desc }}</p>
            </div>
          </div>
        </div>

        <div class="relative" data-aos="fade-left">
          <!-- Decorative visual -->
          <div class="grid grid-cols-2 gap-4 h-full">
            <div class="space-y-4 mt-12">
              <div class="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse-slow"></div>
              <div class="h-64 rounded-2xl bg-blue-100 dark:bg-blue-900/20"></div>
            </div>
            <div class="space-y-4">
              <div class="h-64 rounded-2xl bg-cypass-blue/10"></div>
              <div class="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const timeline = [
  {
    year: '2023',
    title: 'La Genèse',
    desc: 'Lancement de l\'initiative CYPASS suite aux nouvelles directives de l\'ASIN pour la sécurisation des services publics.'
  },
  {
    year: '2024',
    title: 'Premiers Pilotes',
    desc: 'Déploiement réussi de DocSentry auprès de deux ministères clés. Validation du modèle de certification.'
  },
  {
    year: '2025',
    title: 'Expansion Nationale',
    desc: 'Ouverture de la plateforme au secteur privé et lancement du SOC communautaire VigiTech.'
  },
  {
    year: '2026',
    title: 'Vers l\'IA',
    desc: 'Intégration prévue de modèles d\'IA souverains pour la détection prédictive des menaces.'
  }
]
</script>
