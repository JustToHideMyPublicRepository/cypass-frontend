<template>
  <div class="w-full py-6 px-2 overflow-x-auto no-scrollbar">
    <div class="flex items-start justify-between relative gap-4 min-w-max md:min-w-0">

      <!-- Ligne de progression en arrière-plan (Inactif) -->
      <div class="absolute top-[20px] left-8 right-8 h-1 bg-ashAct/30 rounded-full z-0"></div>

      <!-- Ligne de progression active (Animée) -->
      <div
        class="absolute top-[20px] left-8 h-1 bg-primary shadow-[0_0_20px_rgba(var(--color-primary),0.6)] transition-all duration-1000 ease-in-out z-0 origin-left"
        :style="{ width: `${progressWidth}%` }"></div>

      <!-- Nœuds d'étape (Steps) -->
      <div v-for="(step, index) in allSteps" :key="step.id"
        class="relative z-10 flex flex-col items-center flex-1 min-w-[70px] md:min-w-[100px] group">

        <!-- Cercle indicateur de l'étape -->
        <div
          class="w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 transform bg-WtB shadow-md group-hover:scale-110 active:scale-95 cursor-default"
          :class="[
            getStatusClasses(step.status),
            step.status === 'loading' ? 'scale-110 shadow-xl border-primary ring-4 ring-primary/10' : 'border-ashAct/50'
          ]">

          <!-- État : Terminé -->
          <div v-if="step.status === 'completed'" class="text-white animate-scale-in flex items-center justify-center">
            <IconCheck class="w-6 h-6 stroke-[3]" />
          </div>

          <!-- État : En cours (Chargement) -->
          <div v-else-if="step.status === 'loading'" class="relative flex items-center justify-center">
            <IconLoader2 class="w-6 h-6 text-primary animate-spin" />
            <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
          </div>

          <!-- État : Erreur -->
          <div v-else-if="step.status === 'error'" class="text-white animate-shake flex items-center justify-center">
            <IconX class="w-6 h-6 stroke-[3]" />
          </div>

          <!-- État : En attente -->
          <span v-else class="text-[10px] font-black tracking-tighter text-hsa/40">
            0{{ index + 1 }}
          </span>
        </div>

        <!-- Libellés textuels -->
        <div class="mt-5 text-center px-1 w-full overflow-hidden transition-all duration-500"
          :class="{ 'opacity-40': step.status === 'pending' }">
          <h4
            class="text-[9px] md:text-[10px] uppercase font-black tracking-widest transition-all duration-500 truncate mb-1.5"
            :class="step.status === 'pending' ? 'text-hsa/50 font-bold' : 'text-BtW'">
            {{ step.label }}
          </h4>
          <p class="text-[9px] font-bold text-hsa/60 leading-tight transition-opacity duration-700 hidden sm:block line-clamp-2 italic"
            :class="step.status === 'pending' ? 'opacity-0' : 'opacity-100'">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconCheck, IconX, IconLoader2 } from '@tabler/icons-vue'
import type { Step } from '~/utils/docsentry'

// Props recevant la liste des étapes
const props = defineProps<{
  steps: Step[]
}>()

// Ajout d'une étape finale de sécurité persistante
const allSteps = computed(() => {
  const steps = [...props.steps]
  const lastStep = steps[steps.length - 1]
  const isAllMainDone = lastStep && lastStep.status === 'completed'

  steps.push({
    id: 'deep-verification',
    label: 'Intégrité Globale',
    description: 'Vérification finale des couches de sécurité souveraines',
    status: isAllMainDone ? 'loading' : 'pending'
  })
  return steps
})

// Calcul de la largeur de la barre de progression
const progressWidth = computed(() => {
  const completed = props.steps.filter(s => s.status === 'completed').length
  const total = allSteps.value.length
  if (total <= 1) return 0
  // On limite la progression à 95% pour garder un effet visuel propre jusqu'au dernier nœud
  return Math.min((completed / (total - 1)) * 100 * 0.95, 95)
})

// Détermination des classes CSS selon l'état de l'étape
const getStatusClasses = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success border-success text-white shadow-success/20'
    case 'loading': return 'bg-primary/5 border-primary shadow-lg shadow-primary/20'
    case 'error': return 'bg-danger border-danger text-white shadow-danger/20'
    default: return 'bg-ash/20 border-ashAct/50 text-hsa/40'
  }
}
</script>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  75% {
    transform: translateX(3px);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out 3;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

h4,
p {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
