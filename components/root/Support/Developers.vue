<template>
  <div id="developers" class="space-y-6 md:space-y-8 animate-fade-up pt-8 md:pt-12 border-t border-ash">
    <div class="text-center space-y-3 md:space-y-4">
      <span class="badge badge-primary">Espace Développeurs</span>
      <h2 class="text-2xl md:text-3xl font-bold text-BtW">Intégration & API</h2>
      <p class="text-hsa text-sm md:text-base max-w-2xl mx-auto">
        Accédez à nos ressources techniques pour intégrer CYPASS dans vos applications.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-4 md:gap-6">
      <div v-for="(item, index) in devResources" :key="index"
        class="group relative overflow-hidden glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl border border-ash/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.01] shadow-lg hover:shadow-primary/10 cursor-pointer">
        <div
          class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
          :class="item.colorBg">
          <component :is="item.icon" class="w-5 h-5 md:w-6 md:h-6" :class="item.colorText" />
        </div>
        <h3 class="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {{ item.title }}</h3>
        <p class="text-hsa text-sm leading-relaxed mb-4">
          {{ item.desc }}
        </p>
        <span class="flex items-center text-xs md:text-sm font-bold text-primary" :class="item.colorText">
          {{ item.action }}
          <IconArrowRight class="w-3.5 h-3.5 md:w-4 md:h-4 ml-1 transition-transform" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconRocket, IconApi, IconCode } from '@tabler/icons-vue'

const devResources = [
  {
    title: 'Démarrage Rapide',
    desc: 'Intégrez le bouton "Se connecter avec CYPASS" en moins de 10 minutes.',
    action: 'Voir le tutoriel',
    icon: IconRocket,
    colorBg: 'bg-primary/10',
    colorText: 'text-primary'
  },
  {
    title: 'Référence API',
    desc: 'Documentation complète des endpoints REST, schémas de données et codes d\'erreur.',
    action: 'Explorer l\'API',
    icon: IconApi,
    colorBg: 'bg-secondary/10',
    colorText: 'text-secondary'
  },
  {
    title: 'SDKs & Outils',
    desc: 'Bibliothèques officielles pour Node.js, Python, PHP, Java et Go.',
    action: 'Télécharger',
    icon: IconCode,
    colorBg: 'bg-success/10',
    colorText: 'text-success'
  }
]
</script>
