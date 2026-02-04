<template>
  <div class="w-full py-4 px-1 overflow-x-auto no-scrollbar">
    <div class="flex items-start justify-between relative gap-2 min-w-0">
      <!-- Background Connecting Line -->
      <div class="absolute top-[18px] left-6 right-6 h-0.5 bg-ashAct/50 rounded-full z-0"></div>

      <!-- Animated Progress Line -->
      <div
        class="absolute top-[18px] left-6 h-0.5 bg-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)] transition-all duration-1000 z-0 origin-left"
        :style="{ width: `${progressWidth}%` }"></div>

      <!-- Step Nodes -->
      <div v-for="(step, index) in allSteps" :key="step.id"
        class="relative z-10 flex flex-col items-center flex-1 min-w-[60px] md:min-w-[80px]">
        <!-- Node Circle -->
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-500 transform bg-WtB shadow-sm"
          :class="[
            getStatusClasses(step.status),
            step.status === 'loading' ? 'scale-110 shadow-xl border-primary ring-4 ring-primary/10' : 'border-ashAct'
          ]">
          <!-- Completed State -->
          <div v-if="step.status === 'completed'" class="text-white animate-scale-in flex items-center justify-center">
            <IconCheck class="w-5 h-5 stroke-[3]" />
          </div>

          <!-- Loading State -->
          <div v-else-if="step.status === 'loading'" class="relative flex items-center justify-center">
            <IconLoader2 class="w-5 h-5 text-primary animate-spin" />
            <div class="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse"></div>
          </div>

          <!-- Error State -->
          <div v-else-if="step.status === 'error'" class="text-white animate-shake flex items-center justify-center">
            <IconX class="w-5 h-5 stroke-[3]" />
          </div>

          <!-- Pending State -->
          <span v-else class="text-[9px] font-black tracking-tighter text-hsa/40">
            0{{ index + 1 }}
          </span>
        </div>

        <!-- Text Labels -->
        <div class="mt-4 text-center px-1 w-full overflow-hidden">
          <h4
            class="text-[8px] md:text-[9px] uppercase font-black tracking-widest transition-all duration-500 truncate mb-1"
            :class="step.status === 'pending' ? 'text-hsa/30' : 'text-BtW'">
            {{ step.label }}
          </h4>
          <p class="text-[8px] font-bold text-hsa/40 leading-tight transition-opacity duration-700 hidden sm:block line-clamp-2"
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

const props = defineProps<{
  steps: Step[]
}>()

// Final persistent "safety" step
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

const progressWidth = computed(() => {
  const completed = props.steps.filter(s => s.status === 'completed').length
  const total = allSteps.value.length
  if (total <= 1) return 0
  // Calculate width from first node to current node
  // We want to reach the center of the next node
  return Math.min((completed / (total - 1)) * 100 * 0.94, 94)
})

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success border-success text-white'
    case 'loading': return 'bg-primary/5 border-primary shadow-lg shadow-primary/20'
    case 'error': return 'bg-danger border-danger text-white'
    default: return 'bg-ash/20 border-ashAct text-hsa/40'
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
  animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
  animation: shake 0.2s ease-in-out infinite;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom transitions for labels */
h4,
p {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
