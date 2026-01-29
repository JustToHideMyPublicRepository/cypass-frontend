<template>
  <div class="hidden lg:block lg:w-2/3 relative overflow-hidden transition-colors duration-500 bg-slate-900">

    <div
      class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 pointer-events-none mix-blend-overlay">
    </div>

    <!-- Animated Gradient Blobs -->
    <div
      class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-1000"
      :class="currentSlideData.blobColor1"></div>
    <div
      class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow transition-colors duration-1000"
      :class="currentSlideData.blobColor2" style="animation-delay: 2s"></div>

    <!-- Grid Overlay -->
    <div
      class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-[length:40px_40px] opacity-20">
    </div>

    <!-- Central Visual Content (Slideshow) -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">

      <TransitionGroup name="fade-slide" tag="div" class="relative w-full max-w-2xl h-[450px]">
        <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index"
          class="absolute inset-0 flex flex-col items-center justify-center space-y-8">

          <!-- App Frame Visual -->
          <UiAppFrame :type="slide.frameType" :title="slide.frameTitle" :glass="true"
            class="shadow-2xl transform rotate-y-[-3deg] rotate-x-[3deg] transition-transform hover:rotate-0 duration-700 w-full max-w-lg">
            <div class="p-8 text-center" :class="slide.frameBg">
              <!-- Icon -->
              <div
                class="mb-6 w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto transform transition-all duration-500 hover:scale-110"
                :class="slide.iconBg">
                <component :is="slide.icon" class="w-10 h-10" />
              </div>

              <h2 class="text-3xl font-bold text-white mb-4">{{ slide.title }}</h2>
              <p class="text-base text-slate-300 leading-relaxed">{{ slide.description }}</p>
            </div>
          </UiAppFrame>
        </div>
      </TransitionGroup>

      <!-- Slide Indicators -->
      <div class="flex gap-3 mt-8 z-20">
        <button v-for="(_, index) in slides" :key="index" @click="setSlide(index)"
          class="h-2 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-slate-400/50 hover:bg-slate-400'">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconShieldLock, IconCertificate, IconEye } from '@tabler/icons-vue'

const currentSlide = ref(0)
const slideInterval = ref<any>(null)

const slides = [
  {
    title: 'Souveraineté numérique',
    description: 'Accédez à une suite d\'outils sécurisés pour protéger vos données.',
    icon: IconShieldLock,
    iconBg: 'bg-gradient-to-br from-primary to-secondary',
    blobColor1: 'bg-blue-500/30',
    blobColor2: 'bg-indigo-500/30',
    frameType: 'card' as const,
    frameTitle: '',
    frameBg: 'bg-slate-900/80'
  },
  {
    title: 'Certification électronique',
    description: 'Signez et validez vos documents avec DocSentry.',
    icon: IconCertificate,
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    blobColor1: 'bg-green-500/30',
    blobColor2: 'bg-emerald-500/30',
    frameType: 'browser' as const,
    frameTitle: 'docsentry.cypass.bj',
    frameBg: 'bg-slate-900/80'
  },
  {
    title: 'Surveillance active',
    description: 'VigiTech détecte et neutralise les menaces en temps réel.',
    icon: IconEye,
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    blobColor1: 'bg-purple-500/30',
    blobColor2: 'bg-pink-500/30',
    frameType: 'terminal' as const,
    frameTitle: 'vigitech@cypass:~',
    frameBg: 'bg-slate-950'
  }
]

const currentSlideData = computed(() => slides[currentSlide.value])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const setSlide = (index: number) => {
  currentSlide.value = index
  resetTimer()
}

const resetTimer = () => {
  clearInterval(slideInterval.value)
  slideInterval.value = setInterval(nextSlide, 5000)
}

onMounted(() => {
  slideInterval.value = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  clearInterval(slideInterval.value)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
