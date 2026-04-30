<template>
  <div class="group/flow relative">
    <!-- Carousel Control: Left -->
    <div class="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-30">
      <button @click="scroll(vigiTechScroll, 'left')"
        class="p-3 rounded-full bg-WtB/80 backdrop-blur-md shadow-xl border border-ash/30 text-secondary hover:bg-secondary hover:text-WtB transition-all transform hover:scale-110">
        <IconCircleChevronLeft class="w-6 h-6" />
      </button>
    </div>

    <!-- Carousel Control: Right -->
    <div class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-30">
      <button @click="scroll(vigiTechScroll, 'right')"
        class="p-3 rounded-full bg-WtB/80 backdrop-blur-md shadow-xl border border-ash/30 text-secondary hover:bg-secondary hover:text-WtB transition-all transform hover:scale-110">
        <IconCircleChevronRight class="w-6 h-6" />
      </button>
    </div>

    <!-- Carousel horizontal -->
    <div class="relative overflow-visible">
      <div ref="vigiTechScroll"
        class="flex overflow-x-auto gap-6 md:gap-10 pb-12 px-4 md:px-12 snap-x snap-mandatory scroll-smooth overflow-y-visible no-scrollbar">
        <div v-for="(step, index) in vigiTechSteps" :key="index"
          class="flex-shrink-0 w-[280px] md:w-[350px] snap-center flex flex-col items-center text-center group/step animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">

          <!-- Top: Iframe Visual -->
          <div class="w-full mb-6 relative">
            <UiAppFrame :type="(step.frameType as any) || 'browser'" :glass="true" rounded="rounded-2xl" padding="p-0"
              class="w-full aspect-video transform transition-all duration-500 ease-out z-20 shadow-lg group-hover/step:shadow-secondary/20 group-hover/step:translate-y-[-4px]">
              <div
                class="bg-WtB/40 backdrop-blur-2xl border-t border-white/20 p-4 flex items-center justify-center relative overflow-hidden h-full">
                <div
                  class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-5">
                </div>
                <div class="relative z-10 w-full scale-75 md:scale-90 transition-transform duration-500">
                  <component :is="step.visual" v-bind="step.visualProps" />
                </div>
              </div>
            </UiAppFrame>
          </div>

          <!-- Bottom: Text -->
          <div class="px-2 space-y-3">
            <h4
              class="text-lg font-extrabold text-BtW tracking-tight group-hover/step:text-secondary transition-colors flex items-center justify-center gap-2">
              <span
                class="flex-shrink-0 w-6 h-6 rounded-lg bg-secondary/10 text-secondary text-[10px] flex items-center justify-center border border-secondary/20">{{
                  index + 1 }}</span>
              {{ step.title }}
            </h4>
            <p
              class="text-sm text-hsa leading-relaxed font-light line-clamp-3 group-hover/step:line-clamp-none transition-all">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, h, ref, type Component } from 'vue'
import { IconSend, IconUser, IconPaperclip, IconEyeOff, IconCheck, IconCircleChevronLeft, IconCircleChevronRight, IconArrowRight } from '@tabler/icons-vue'

interface Step {
  title: string
  description: string
  visual: Component
  visualProps?: Record<string, any>
  frameType?: 'card' | 'browser' | 'terminal' | 'simple'
}

const vigiTechScroll = ref<HTMLElement | null>(null)

const scroll = (el: HTMLElement | null, direction: 'left' | 'right') => {
  if (!el) return
  const scrollAmount = 400
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
}

// Mockups
const MockSignalement = {
  render: () => h('div', { class: 'bg-WtB p-4 rounded-xl shadow-lg border border-ash/30 space-y-3 w-full max-w-[200px] mx-auto' }, [
    h('div', { class: 'h-6 bg-secondary/10 rounded-lg w-1/2' }),
    h('div', { class: 'space-y-1.5' }, [
      h('div', { class: 'h-2 bg-ash/50 rounded w-full' }),
      h('div', { class: 'h-2 bg-ash/50 rounded w-3/4' })
    ]),
    h('div', { class: 'h-8 bg-secondary/80 rounded-lg w-full flex items-center justify-center' }, [
      h(IconSend, { class: 'w-4 h-4 text-WtB' })
    ])
  ])
}

const MockIdentity = {
  render: () => h('div', { class: 'flex items-center justify-center gap-4' }, [
    h('div', { class: 'p-3 bg-ash rounded-xl opacity-40' }, [h(IconUser, { class: 'w-6 h-6' })]),
    h(IconArrowRight, { class: 'w-4 h-4 text-hsaAct' }),
    h('div', { class: 'p-4 bg-secondary/20 rounded-2xl border-2 border-secondary animate-pulse' }, [h(IconEyeOff, { class: 'w-8 h-8 text-secondary' })])
  ])
}

const MockProof = {
  render: () => h('div', { class: 'relative w-32 h-32 mx-auto' }, [
    h('div', { class: 'absolute inset-4 bg-ash rounded-lg border-2 border-dashed border-hsaAct overflow-hidden flex items-center justify-center' }, [
      h(IconPaperclip, { class: 'w-6 h-6 text-hsaAct' })
    ]),
    h('div', { class: 'absolute top-2 right-2 p-1.5 bg-success text-WtB rounded-full shadow-lg' }, [h(IconCheck, { class: 'w-3 h-3' })])
  ])
}


const MockPublication = {
  render: () => h('div', { class: 'relative w-full h-32 flex flex-col gap-2' }, [
    h('div', { class: 'bg-secondary p-2 rounded-lg shadow-lg translate-y-2' }, [
      h('div', { class: 'h-1.5 bg-white/30 w-1/2 rounded mb-1' }),
      h('div', { class: 'h-1.5 bg-white/10 w-full rounded' })
    ]),
    h('div', { class: 'bg-secondary/40 p-2 rounded-lg opacity-30 scale-90 translate-x-2' })
  ])
}


// Etape
const vigiTechSteps: Step[] = [
  {
    title: 'Soumettre l\'incident',
    description: 'Phishing, ransomware ou fraude : signaler la menace via notre formulaire.',
    visual: markRaw(MockSignalement)
  },
  {
    title: 'Mode anonyme',
    description: 'Choisir un mode de signalement : anonyme ou identifié.',
    visual: markRaw(MockIdentity)
  },
  {
    title: 'Preuve numérique',
    description: 'Joindre une capture d\'écran ou un PDF comme preuve optionnelle.',
    visual: markRaw(MockProof)
  },
  {
    title: 'Veille live',
    description: 'Publication immédiate sur le tableau de veille communautaire.',
    visual: markRaw(MockPublication)
  },
]
</script>

<style scoped>
@keyframes ring {
  0% {
    transform: rotate(0);
  }

  5% {
    transform: rotate(10deg);
  }

  10% {
    transform: rotate(-10deg);
  }

  15% {
    transform: rotate(10deg);
  }

  20% {
    transform: rotate(-10deg);
  }

  25% {
    transform: rotate(0);
  }
}

.animate-ring {
  animation: ring 2s infinite;
}
</style>
