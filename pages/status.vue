<template>
  <div class="max-w-3xl mx-auto space-y-12 relative z-10 pb-10 px-4">
    <div class="text-center space-y-4 animate-fade-up">
      <h1 class="text-4xl md:text-5xl font-black tracking-tight">
        État du <span class="text-green-500">Système</span>
      </h1>
      <p class="text-lg text-hsa">
        Statut en temps réel de nos services et infrastructures.
      </p>
    </div>

    <!-- Main Status Card -->
    <div
      class="glass-panel p-8 rounded-3xl animate-fade-up border-l-4 border-green-500 flex items-center gap-6 shadow-lg shadow-green-500/10">
      <div
        class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 animate-pulse">
        <IconCheck class="w-8 h-8" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-BtW">Tous les systèmes sont opérationnels</h2>
        <p class="text-hsa">Dernière mise à jour : {{ new Date().toLocaleTimeString() }}</p>
      </div>
    </div>

    <!-- Components Grid -->
    <div class="space-y-4 animate-fade-up" style="animation-delay: 100ms">
      <h3 class="text-lg font-bold pl-2">Composants</h3>

      <div v-for="(component, index) in components" :key="component.name"
        class="glass-panel p-4 px-6 rounded-2xl flex items-center justify-between border border-ash/50">
        <span class="font-medium text-BtW">{{ component.name }}</span>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-green-500">{{ component.status }}</span>
          <div class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
        </div>
      </div>
    </div>

    <!-- Incidents History -->
    <div class="space-y-4 animate-fade-up" style="animation-delay: 200ms">
      <h3 class="text-lg font-bold pl-2">Historique des incidents</h3>
      <div class="glass-panel p-8 rounded-2xl text-center py-12 border border-ash/50">
        <p class="text-hsa">Aucun incident signalé au cours des 30 derniers jours.</p>
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
