<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-hidden relative bg-bgClr">
    <!-- Theme Toggle (Top Right) -->
    <div class="absolute top-4 right-4 z-50">
      <UiThemeToggle />
    </div>

    <!-- Main Card -->
    <div
      class="w-full max-w-2xl bg-WtB/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-ash p-8 md:p-12 text-center transform transition-all hover:scale-[1.01] duration-500 relative z-10 animate-fade-up">

      <!-- Icon Container -->
      <div class="mb-8 relative inline-flex animate-fade-down" style="animation-delay: 200ms">
        <div
          class="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse">
        </div>
        <div
          class="relative w-28 h-28 mx-auto bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/20 transform rotate-3 hover:rotate-0 transition-all duration-300 group">
          <div
            class="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>
          <component :is="errorIcon" class="w-14 h-14" stroke-width="1.5" />
        </div>
      </div>

      <!-- Error Code -->
      <h1
        class="text-9xl font-black text-ash tracking-tighter select-none mb-6 leading-none animate-fade-up mix-blend-overlay dark:mix-blend-normal opacity-20"
        style="animation-delay: 300ms">
        {{ error?.statusCode || 'ERR' }}
      </h1>

      <!-- Message -->
      <div class="relative -mt-16 space-y-6 mb-12 animate-fade-up" style="animation-delay: 400ms">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight">
          {{ errorTitle }}
        </h2>
        <p class="text-xl text-hsa max-w-lg mx-auto leading-relaxed font-medium">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
        style="animation-delay: 500ms">
        <button @click="handleClearError"
          class="group relative px-8 py-4 bg-BtW text-WtB font-bold rounded-2xl shadow-xl shadow-ash/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div
            class="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300">
          </div>
          <span class="relative flex items-center gap-3">
            <IconArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </span>
        </button>

        <button v-if="error?.statusCode !== 404" @click="handleRefresh"
          class="group px-8 py-4 bg-WtB font-bold rounded-2xl border border-ash hover:bg-ash/10 transition-all duration-300 hover:border-primary/50">
          <span class="flex items-center gap-3">
            <IconRefresh class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            Réessayer
          </span>
        </button>
      </div>

      <!-- Technical Details -->
      <div v-if="error?.message && error?.statusCode !== 404" class="mt-12 pt-8 border-t border-ash animate-fade-up"
        style="animation-delay: 600ms">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ash/50 text-xs font-mono text-hsa">
          <IconBug class="w-3 h-3" />
          Code: {{ error?.statusCode }} • ID: {{ formatDate(new Date()) }}
        </div>
      </div>

    </div>

    <!-- Footer Copyright -->
    <div class="absolute bottom-8 w-full text-center">
      <p class="text-sm font-medium text-hsa">
        &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
      </p>
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
  IconBug,
  IconServer
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
    case 503: return "Maintenance"
    default: return "Erreur Inattendue"
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "Oups ! La destination que vous recherchez semble avoir disparu du cyberespace."
    case 403:
      return "Zone sécurisée. Vos identifiants ne vous permettent pas d'accéder à cette ressource."
    case 500:
      return "Nos protocoles ont rencontré une anomalie critique. L'équipe d'intervention est alertée."
    case 503:
      return "Nos systèmes effectuent une mise à jour de sécurité. Service rétabli sous peu."
    default:
      return "Une exception non gérée a interrompu votre session. Veuillez rafraîchir la page."
  }
})

const errorIcon = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return IconMoodSad
    case 403: return IconLock
    case 500: return IconServer
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
