<template>
  <div class="h-screen w-full flex overflow-hidden">
    <!-- Left Column: Form Area (1/3) -->
    <div
      class="w-full lg:w-1/3 h-full z-10 bg-WtB shadow-2xl lg:shadow-none relative flex flex-col border-r border-ash">

      <!-- Theme Toggle (Fixed relative to column) -->
      <button @click="toggleTheme"
        class="absolute top-6 right-6 p-2 rounded-full text-hsa hover:bg-ash/50 transition-colors z-30">
        <IconSun v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-500" />
        <IconMoon v-else class="w-5 h-5" />
      </button>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
        <div class="flex flex-col justify-center min-h-full px-8 sm:px-12 lg:px-16 xl:px-24 py-12">

          <div class="mb-10 animate-fade-down">
            <NuxtLink to="/" class="inline-flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl p-0.5">
                <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <img src="/img/logo.png" alt="Cypass Logo" class="w-full h-full object-contain" />
                </div>
              </div>
              <span class="text-2xl font-black tracking-tight">CYPASS</span>
            </NuxtLink>
          </div>

          <div class="animate-fade-up">
            <slot />
          </div>

          <div class="mt-8 text-center text-xs animate-fade-in pb-4 text-hsa">
            &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
          </div>

        </div>
      </div>
    </div>

    <!-- Right Column: Visual Area (2/3) -->
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

        <TransitionGroup name="fade-slide" tag="div" class="relative w-full max-w-2xl h-[400px]">
          <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index"
            class="absolute inset-0 flex flex-col items-center justify-center space-y-8">

            <!-- Glass Card -->
            <div
              class="glass-panel p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl bg-slate-900/40">

              <!-- Icon -->
              <div
                class="mb-6 w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto transform transition-all duration-500 hover:scale-110"
                :class="slide.iconBg">
                <component :is="slide.icon" class="w-10 h-10" />
              </div>

              <h2 class="text-4xl font-bold text-white mb-4 transition-colors">{{ slide.title }}
              </h2>
              <p class="text-lg text-slate-300 leading-relaxed transition-colors">
                {{ slide.description }}
              </p>
            </div>

          </div>
        </TransitionGroup>

        <!-- Slide Indicators -->
        <div class="flex gap-3 mt-12 z-20">
          <button v-for="(_, index) in slides" :key="index" @click="setSlide(index)"
            class="h-2 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-slate-400/50 hover:bg-slate-400'">
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { IconSun, IconMoon, IconShieldLock, IconCertificate, IconServer, IconEye } from '@tabler/icons-vue'

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

// -- Slideshow Logic --
const currentSlide = ref(0)
const slideInterval = ref<any>(null)

const slides = [
  {
    title: 'Souveraineté numérique',
    description: 'Accédez à une suite d\'outils sécurisés conçus pour protéger vos données et garantir votre indépendance technologique.',
    icon: IconShieldLock,
    iconBg: 'bg-gradient-to-br from-primary to-seconadry',
    blobColor1: 'bg-blue-500/30',
    blobColor2: 'bg-indigo-500/30'
  },
  {
    title: 'Certification électronique',
    description: 'Signez et validez vos documents officiels avec DocSentry, la solution de confiance reconnue par l\'État.',
    icon: IconCertificate,
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
    blobColor1: 'bg-green-500/30',
    blobColor2: 'bg-emerald-500/30'
  },
  {
    title: 'Surveillance active',
    description: 'VigiTech surveille en permanence votre infrastructure pour détecter et neutraliser les menaces avant qu\'elles n\'agissent.',
    icon: IconEye,
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    blobColor1: 'bg-purple-500/30',
    blobColor2: 'bg-pink-500/30'
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
