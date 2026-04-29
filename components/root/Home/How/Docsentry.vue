<template>
  <div class="mb-8 group/flow">
    <div class="max-w-7xl mx-auto mb-12 flex items-center justify-between px-4">
      <div class="flex items-center gap-5">
        <div
          class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
          <IconFileCheck class="w-7 h-7" />
        </div>
        <div>
          <h3 class="text-3xl md:text-4xl font-black text-BtW tracking-tighter">DocSentry</h3>
          <p class="text-primary font-bold uppercase tracking-widest text-[10px]">Certification & Vérification</p>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-4">
        <button @click="scroll(docSentryScroll, 'left')"
          class="p-2 rounded-xl bg-ash/20 hover:bg-ash/40 transition-colors text-BtW">
          <IconArrowLeft class="w-5 h-5" />
        </button>
        <button @click="scroll(docSentryScroll, 'right')"
          class="p-2 rounded-xl bg-ash/20 hover:bg-ash/40 transition-colors text-BtW">
          <IconArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Carousel horizontal -->
    <div class="relative">
      <div ref="docSentryScroll"
        class="flex overflow-x-auto gap-6 md:gap-10 pb-12 px-4 md:px-12 snap-x snap-mandatory scroll-smooth overflow-y-visible no-scrollbar">
        <div v-for="(step, index) in docSentrySteps" :key="index"
          class="flex-shrink-0 w-[280px] md:w-[350px] snap-center flex flex-col items-center text-center group/step animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">

          <!-- Top: Iframe Visual -->
          <div class="w-full mb-6 relative">
            <UiAppFrame :type="(step.frameType as any) || 'browser'" :glass="true" rounded="rounded-2xl" padding="p-0"
              class="w-full aspect-video transform transition-all duration-500 ease-out z-20 shadow-lg group-hover/step:shadow-primary/20 group-hover/step:translate-y-[-4px]">
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
              class="text-lg font-extrabold text-BtW tracking-tight group-hover/step:text-primary transition-colors flex items-center justify-center gap-2">
              <span
                class="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 text-primary text-[10px] flex items-center justify-center border border-primary/20">{{
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
import { IconFileCheck, IconUpload, IconFingerprint, IconKey, IconFileText, IconQrcode, IconCheck, IconLock, IconArrowLeft, IconArrowRight, IconRosetteDiscountCheck } from '@tabler/icons-vue'

interface Step {
  title: string
  description: string
  visual: Component
  visualProps?: Record<string, any>
  frameType?: 'card' | 'browser' | 'terminal' | 'simple'
}

const docSentryScroll = ref<HTMLElement | null>(null)

const scroll = (el: HTMLElement | null, direction: 'left' | 'right') => {
  if (!el) return
  const scrollAmount = 400
  el.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
}

// Visual Components
const MockUpload = {
  render: () => h('div', { class: 'text-center space-y-4' }, [
    h('div', { class: 'mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-slow border-2 border-dashed border-primary/30 shadow-inner' }, [
      h(IconUpload, { class: 'w-8 h-8 text-primary' })
    ]),
    h('div', { class: 'bg-WtB/80 p-3 rounded-xl border border-ash/50 shadow-sm' }, [
      h('p', { class: 'text-[10px] font-bold text-BtW truncate' }, 'contrat_v2.pdf'),
      h('div', { class: 'w-full h-1 bg-primary/20 mt-2 rounded-full overflow-hidden' }, [
        h('div', { class: 'h-full bg-primary w-2/3 animate-pulse' })
      ])
    ])
  ])
}

const MockValidation = {
  render: () => h('div', { class: 'space-y-2 w-full max-w-[200px] mx-auto' }, [
    ['Format PDF', true],
    ['Taille OK', true],
    ['Token Auth', true]
  ].map(([label, ok]) => h('div', { class: 'bg-WtB/60 p-2.5 rounded-lg border border-ash/30 flex items-center justify-between backdrop-blur-sm' }, [
    h('span', { class: 'text-[10px] font-bold text-BtW' }, label as string),
    h(IconCheck, { class: 'w-4 h-4 text-success' })
  ])))
}

const MockHashSignature = {
  render: () => h('div', { class: 'space-y-3 w-full' }, [
    // Hash Terminal
    h('div', { class: 'bg-hsaAct p-3 rounded-lg border border-white/10 font-code text-[8px] leading-tight relative overflow-hidden' }, [
      h('p', { class: 'text-success/80 mb-1' }, '> hashing...'),
      h('p', { class: 'text-WtB/80 break-all' }, 'e3b0c44298fc1c14...'),
      h(IconFingerprint, { class: 'absolute -right-2 -bottom-2 w-8 h-8 text-white/5' })
    ]),
    // Signature Animation
    h('div', { class: 'flex items-center justify-center gap-3' }, [
      h('div', { class: 'p-2 bg-primary/20 rounded-lg animate-pulse' }, [h(IconKey, { class: 'w-5 h-5 text-primary' })]),
      h('div', { class: 'flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-success/50 rounded-full relative overflow-hidden' }, [
        h('div', { class: 'absolute inset-0 bg-white/20 animate-marquee' })
      ]),
      h('div', { class: 'p-2 bg-success/20 rounded-lg' }, [h(IconLock, { class: 'w-5 h-5 text-success' })])
    ])
  ])
}

const MockCertificate = {
  render: () => h('div', { class: 'bg-white p-4 rounded shadow-xl w-32 h-44 mx-auto relative flex flex-col gap-3' }, [
    h('div', { class: 'h-3 bg-ash w-3/4 rounded' }),
    h('div', { class: 'space-y-1.5' }, [
      h('div', { class: 'h-1.5 bg-ash w-full rounded' }),
      h('div', { class: 'h-1.5 bg-ash w-full rounded' }),
      h('div', { class: 'h-1.5 bg-ash w-1/2 rounded' })
    ]),
    h('div', { class: 'mt-auto flex justify-end h-8' }, [
      h('div', { class: 'w-8 h-8 border border-primary/20 rounded flex items-center justify-center p-0.5 animate-pulse' }, [
        h(IconQrcode, { class: 'w-full h-full text-primary' })
      ])
    ])
  ])
}


const MockVerification = {
  render: () => h('div', { class: 'relative w-full h-[180px] bg-slate-900 rounded-2xl overflow-hidden shadow-inner' }, [
    h('div', { class: 'absolute inset-0 bg-success/10 flex flex-col items-center justify-center' }, [
      h(IconRosetteDiscountCheck, { class: 'w-12 h-12 text-success mb-2' }),
      h('div', { class: 'bg-white/95 px-3 py-1 rounded-lg shadow-lg' }, [
        h('span', { class: 'text-[9px] font-black text-success' }, 'AUTHENTIQUE')
      ])
    ]),
    h('div', { class: 'absolute top-0 left-0 right-0 h-0.5 bg-success/50 animate-pulse' })
  ])
}

// Etape
const docSentrySteps: Step[] = [
  {
    title: 'Soumission',
    description: 'Soumettre le document PDF via l\'interface graphique.',
    visual: markRaw(MockUpload)
  },
  {
    title: 'Validation',
    description: 'Vérification instantanée du type, de la taille.',
    visual: markRaw(MockValidation)
  },
  {
    title: 'Empreinte & Signature',
    description: 'Calcul de l\'empreinte unique et signature par clé privée Ed25519.',
    visual: markRaw(MockHashSignature)
  },
  {
    title: 'Certification',
    description: 'Génération du certificat PDF incluant le QR Code cryptographique.',
    visual: markRaw(MockCertificate)
  },
  {
    title: 'Vérification',
    description: 'Vérification publique par scan et sans compte requis.',
    visual: markRaw(MockVerification)
  }
]
</script>

<style scoped>
@keyframes bounce-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2.5s infinite;
}
</style>
