<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Background Decor Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div
        class="absolute top-[10%] left-[10%] w-64 h-64 bg-cypass-blue/10 rounded-full blur-3xl opacity-60 animate-pulse-slow">
      </div>
      <div
        class="absolute bottom-[10%] right-[10%] w-96 h-96 bg-cypass-green/10 rounded-full blur-3xl opacity-60 animate-pulse-slower">
      </div>
      <div class="absolute top-[40%] right-[30%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl opacity-40">
      </div>
    </div>

    <!-- Main Card -->
    <div
      class="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center transform transition-all hover:scale-[1.01] duration-500 relative z-10 animate-fade-up">

      <!-- Icon Container -->
      <div class="mb-8 relative inline-block animate-fade-down" style="animation-delay: 200ms">
        <div class="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full blur-xl opacity-80 animate-pulse">
        </div>
        <div
          class="relative w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
          <component :is="errorIcon" class="w-12 h-12" stroke-width="1.5" />
        </div>
      </div>

      <!-- Error Code -->
      <h1
        class="text-8xl md:text-9xl font-black text-slate-200 dark:text-slate-800 tracking-tighter select-none mb-4 leading-none animate-fade-up"
        style="animation-delay: 300ms">
        {{ error?.statusCode || 'ERR' }}
      </h1>

      <!-- Message -->
      <div class="space-y-4 mb-10 animate-fade-up" style="animation-delay: 400ms">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
          {{ errorTitle }}
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
        style="animation-delay: 500ms">
        <button @click="handleClearError"
          class="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div
            class="absolute inset-0 bg-gradient-to-r from-cypass-blue to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>
          <span class="relative flex items-center gap-2">
            <IconArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </span>
        </button>

        <button v-if="error?.statusCode !== 404" @click="handleRefresh"
          class="group px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">
          <span class="flex items-center gap-2">
            <IconRefresh class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            Réessayer
          </span>
        </button>
      </div>

      <!-- Technical Details (Optional, collapsed usually, but just distinct style here) -->
      <div v-if="error?.message && error?.statusCode !== 404"
        class="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-up"
        style="animation-delay: 600ms">
        <p class="text-xs font-mono text-slate-400">
          Code: {{ error?.statusCode }} • ID: {{ formatDate(new Date()) }}
        </p>
      </div>

    </div>

    <!-- Footer Copyright -->
    <div class="absolute bottom-6 w-full text-center text-slate-400 text-sm opacity-60">
      &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconAlertTriangle,
  IconMoodSad,
  IconArrowLeft,
  IconRefresh,
  IconLock,
  IconBug
} from '@tabler/icons-vue'

// Props (Nuxt automatically provides 'error')
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

// Determine Title & Message based on standard HTTP codes
const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return "Page introuvable"
    case 403: return "Accès refusé"
    case 500: return "Erreur Serveur"
    case 503: return "Service Indisponible"
    default: return "Une erreur est survenue"
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "Oups ! La page que vous recherchez semble avoir disparu ou n'a jamais existé."
    case 403:
      return "Désolé, vous n'avez pas les autorisations nécessaires pour accéder à cette ressource critique."
    case 500:
      return "Nos serveurs rencontrent une difficulté momentanée. Nos équipes techniques ont été notifiées."
    case 503:
      return "Le service est temporairement en maintenance. Veuillez réessayer dans quelques instants."
    default:
      return "Un problème inattendu a empêché le chargement de la page. Essayez de rafraîchir."
  }
})

const errorIcon = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return IconMoodSad
    case 403: return IconLock
    case 500: return IconBug
    default: return IconAlertTriangle
  }
})

// Actions
const handleClearError = () => {
  clearError({ redirect: '/' })
}

const handleRefresh = () => {
  window.location.reload()
}

// Helper
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-slower {
  animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
