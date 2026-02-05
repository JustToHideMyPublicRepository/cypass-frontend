<template>
  <div class="hidden lg:block lg:w-2/3 relative overflow-hidden transition-colors duration-500 bg-slate-900">

    <!-- Texture de bruit pour le grain -->
    <div
      class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 pointer-events-none mix-blend-overlay">
    </div>

    <!-- Blobs de dégradé animés -->
    <div
      class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-1000"
      :class="currentSlideData.blobColor1"></div>
    <div
      class="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse-slow transition-colors duration-1000"
      :class="currentSlideData.blobColor2" style="animation-delay: 2s"></div>

    <!-- Grille de fond -->
    <div
      class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.05)_2px,transparent_2px)] bg-[length:40px_40px] opacity-10">
    </div>

    <!-- Contenu central visuel (Slideshow) -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-12 z-20">

      <TransitionGroup name="fade-slide" tag="div" class="relative w-full max-w-2xl h-[450px]">
        <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index"
          class="absolute inset-0 flex flex-col items-center justify-center space-y-8">

          <!-- Visuel AppFrame -->
          <UiAppFrame :type="slide.frameType" :title="slide.frameTitle" :glass="true"
            class="shadow-2xl transform rotate-y-[-3deg] rotate-x-[3deg] transition-transform hover:rotate-0 duration-700 w-full max-w-lg border border-white/10">
            <div class="p-10 text-center" :class="slide.frameBg">
              <!-- Icône -->
              <div
                class="mb-8 w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-2xl mx-auto transform transition-all duration-500 hover:scale-110"
                :class="slide.iconBg">
                <component :is="slide.icon" class="w-12 h-12" />
              </div>

              <h2 class="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{{ slide.title }}</h2>
              <p class="text-lg text-slate-300/90 leading-relaxed max-w-md mx-auto">{{ slide.description }}</p>
            </div>
          </UiAppFrame>
        </div>
      </TransitionGroup>

      <!-- Indicateurs de slides -->
      <div class="flex gap-3 mt-12 z-20">
        <button v-for="(_, index) in slides" :key="index" @click="setSlide(index)"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'w-10 bg-primary' : 'w-4 bg-slate-400/30 hover:bg-slate-400/50'">
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

// Définition des slides pour le visuel d'authentification
const slides = [
  {
    title: 'Souveraineté numérique',
    description: 'Accédez à une suite d\'outils sécurisés pour protéger vos données et votre identité numérique.',
    icon: IconShieldLock,
    iconBg: 'bg-gradient-to-br from-primary to-secondary',
    blobColor1: 'bg-blue-500/20',
    blobColor2: 'bg-indigo-500/20',
    frameType: 'card' as const,
    frameTitle: 'SÉCURITÉ',
    frameBg: 'bg-slate-900/40'
  },
  {
    title: 'Certification de confiance',
    description: 'Signez, validez et authentifiez vos documents avec la puissance de DocSentry.',
    icon: IconCertificate,
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    blobColor1: 'bg-green-500/20',
    blobColor2: 'bg-emerald-500/20',
    frameType: 'browser' as const,
    frameTitle: 'docsentry.cypass.bj',
    frameBg: 'bg-slate-900/40'
  },
  {
    title: 'Vigilance permanente',
    description: 'VigiTech surveille, détecte et neutralise les menaces cyber en temps réel.',
    icon: IconEye,
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    blobColor1: 'bg-purple-500/20',
    blobColor2: 'bg-pink-500/20',
    frameType: 'terminal' as const,
    frameTitle: 'vigitech@cypass:~',
    frameBg: 'bg-slate-950/80'
  }
]

const currentSlideData = computed(() => slides[currentSlide.value])

// Passage à la slide suivante
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

// Sélection directe d'une slide
const setSlide = (index: number) => {
  currentSlide.value = index
  resetTimer()
}

// Réinitialisation du minuteur automatique
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
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-20px);
}
</style>
