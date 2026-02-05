<template>
  <div class="max-w-3xl mx-auto space-y-8 md:space-y-12 relative z-10 px-4 sm:px-6">
    <div class="text-center space-y-3 md:space-y-4 animate-fade-up">
      <h1 class="text-3xl md:text-5xl font-black tracking-tight">
        État du <span class="text-green-500">Système</span>
      </h1>
      <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto">
        Statut en temps réel de nos services et infrastructures.
      </p>
    </div>

    <!-- Main Status Card -->
    <div
      class="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl animate-fade-up border-l-4 border-success flex flex-col sm:flex-row items-center gap-4 md:gap-6 shadow-lg shadow-success/10 text-center sm:text-left">
      <div
        class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-success/20 flex items-center justify-center text-success animate-pulse shrink-0">
        <IconCheck class="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <div>
        <h2 class="text-xl md:text-2xl font-bold leading-tight">Tous les systèmes sont opérationnels</h2>
        <p class="text-sm md:text-base text-hsa mt-1">Dernière mise à jour : {{ new Date().toLocaleTimeString() }}</p>
      </div>
    </div>

    <!-- Components Grid -->
    <div class="space-y-3 md:space-y-4 animate-fade-up" style="animation-delay: 100ms">
      <h3 class="text-base md:text-lg font-bold pl-2">Composants</h3>

      <div v-for="(component, index) in components" :key="component.name"
        class="glass-panel p-4 md:px-6 rounded-xl md:rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 border border-ash/50">
        <span class="font-medium text-sm md:text-base">{{ component.name }}</span>
        <div class="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span class="text-xs font-bold text-success">{{ component.status }}</span>
          <div class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </div>
      </div>
    </div>

    <!-- Incidents History -->
    <div class="space-y-3 md:space-y-4 animate-fade-up" style="animation-delay: 200ms">
      <h3 class="text-base md:text-lg font-bold pl-2">Historique des incidents</h3>
      <div class="glass-panel p-6 md:p-8 rounded-xl md:rounded-2xl text-center py-8 md:py-12 border border-ash/50">
        <p class="text-sm md:text-base text-hsa">Aucun incident signalé au cours des 30 derniers jours.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const components = [
  { name: 'API Gateway', status: 'Opérationnel' },
  { name: 'Base de Données', status: 'Opérationnel' },
  { name: 'Serveur d\'Authentification (OAuth2)', status: 'Opérationnel' },
  { name: 'Service de Notification', status: 'Opérationnel' },
  { name: 'Interface Web (Frontend)', status: 'Opérationnel' },
]

useHead({
  title: 'Statut de services'
})
</script>
