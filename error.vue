<template>
  <div
    class="min-h-screen bg-bgClr text-textClr font-body overflow-hidden relative flex items-center justify-center p-4">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse">
      </div>
      <div
        class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"
        style="animation-delay: 2s"></div>
    </div>

    <!-- Theme Toggle (Top Right) -->
    <div class="absolute top-6 right-6 z-50">
      <UiThemeToggle />
    </div>

    <!-- Content Container -->
    <div class="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

      <!-- Left side: Visual -->
      <div class="hidden lg:flex justify-center items-center">
        <div class="relative w-full aspect-square max-w-sm group">
          <!-- Geometric Shapes Animation -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[4rem] rotate-6 group-hover:rotate-12 transition-transform duration-700">
          </div>
          <div
            class="absolute inset-0 bg-WtB/10 backdrop-blur-md border border-ash/30 rounded-[4rem] -rotate-3 group-hover:-rotate-6 transition-transform duration-700 flex items-center justify-center">
            <div class="text-center">
              <div class="text-[10rem] font-black tracking-tighter text-BtW opacity-10 select-none leading-none">
                {{ error?.statusCode || '404' }}
              </div>
              <component :is="errorIcon" class="w-32 h-32 text-primary -mt-16 mx-auto animate-bounce-slow"
                stroke-width="1" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Content -->
      <div class="space-y-8 text-center lg:text-left">
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-fade-in">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Incident Détecté
          </div>
          <h1 class="text-5xl md:text-7xl font-black text-BtW tracking-tight leading-none">
            {{ errorTitle }}
          </h1>
          <p class="text-xl text-hsa leading-relaxed max-w-lg mx-auto lg:mx-0">
            {{ errorMessage }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <UiBaseButton @click="handleClearError" class="px-8 py-4 !rounded-2xl shadow-xl shadow-primary/20 flex gap-3">
            <IconArrowLeft class="w-5 h-5 relative z-10" />
            <span class="relative z-10">Accueil</span>
          </UiBaseButton>

          <UiBaseButton v-if="error?.statusCode !== 404" @click="handleRefresh" variant="secondary"
            class="px-8 py-4 !bg-BtW !text-WtB !rounded-2xl hover:!opacity-90 flex gap-3">
            <IconRefresh class="w-5 h-5" />
            Réessayer
          </UiBaseButton>
        </div>

        <!-- Technical Metadata -->
        <div class="pt-8 border-t border-ash/30 flex flex-wrap items-center gap-6 justify-center lg:justify-start">
          <div class="flex items-center gap-2 text-[10px] font-code text-hsa">
            <IconBug class="w-3 h-3 opacity-50" />
            REF-{{ error?.statusCode || 'UNKNOWN' }}
          </div>
          <div class="flex items-center gap-2 text-[10px] font-code text-hsa">
            <IconClock class="w-3 h-3 opacity-50" />
            {{ formatDate(new Date()) }}
          </div>
          <div v-if="error?.message" class="text-[10px] font-code text-primary truncate max-w-[200px]">
            {{ error.message }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer decoration -->
    <div
      class="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.5em] text-hsa opacity-20 pointer-events-none">
      Infrastructure de Confiance CYPASS
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconAlertTriangle, IconMoodSad, IconArrowLeft, IconRefresh, IconLock, IconBug, IconServer, IconClock
} from '@tabler/icons-vue'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404: return "Destination introuvable"
    case 403: return "Accès restreint"
    case 500: return "Défaut système"
    case 503: return "Maintenance"
    default: return "Anomalie inattendue"
  }
})

const errorMessage = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "Le segment de données que vous recherchez semble s'être volatilisé du réseau CYPASS."
    case 403:
      return "Zone hautement sécurisée. Vos protocoles d'accès actuels ne permettent pas l'entrée."
    case 500:
      return "Une exception fatale a été interceptée par nos couches de sécurité. L'équipe technique est sur le pont."
    case 503:
      return "Mise à jour majeure des systèmes de confiance en cours. Disponibilité imminente."
    default:
      return "Un flux de données irrégulier a interrompu la session. Nos systèmes se réinitialisent."
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

const handleClearError = () => {
  clearError({ redirect: '/' })
}

const handleRefresh = () => {
  window.location.reload()
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// SEO
useSeoMeta({
  title: errorTitle.value,
  ogTitle: `${errorTitle.value} | CYPASS`,
  description: errorMessage.value,
  ogDescription: errorMessage.value,
  twitterCard: 'summary_large_image',
})
</script>

<style scoped>
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 4s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
