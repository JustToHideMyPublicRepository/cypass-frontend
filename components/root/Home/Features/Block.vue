<template>
  <section id="features" ref="sectionEl" class="min-h-screen flex flex-col relative overflow-hidden" @mouseenter="pause"
    @mouseleave="resume">
    <!-- Animated background glow -->
    <div class="absolute inset-0 -z-10 transition-colors duration-1000"
      :class="currentService.theme === 'green' ? 'bg-gradient-to-br from-success/[0.03] via-transparent to-success/[0.02]' : 'bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02]'" />
    <div
      class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.07] transition-all duration-1000 -z-10"
      :class="currentService.theme === 'green' ? 'bg-success' : 'bg-primary'" />

    <!-- Section Header -->
    <div class="bg-bgClr/80 backdrop-blur-md z-30 border-b border-ash/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span
              class="inline-block px-4 py-1.5 rounded-full border border-ash bg-WtB text-[10px] font-bold uppercase tracking-[0.2em] text-hsa mb-4">
              Nos modules
            </span>

            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-BtW tracking-tight">
              Une plateforme, <span class="font-handwritting text-primary">quatre boucliers</span>
            </h2>
            <p class="text-hsa mt-3 text-base md:text-lg max-w-2xl">
              Des outils souverains pour protéger, certifier et surveiller votre écosystème numérique.
            </p>
          </div>

          <!-- Navigator -->
          <div class="flex-shrink-0 md:pb-2">
            <RootHomeFeaturesNavigator :items="featureServices.map(s => ({ title: s.title }))" :active="activeIndex"
              :theme="currentService.theme" @select="goTo" />
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Content -->
    <div class="flex-1 flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 md:py-16">
        <div class="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

          <!-- Text Column -->
          <div class="relative">
            <div class="h-0.5 w-24 bg-ash/30 rounded-full mb-6 overflow-hidden hidden md:block">
              <div v-if="!isPaused" :key="'progress-' + activeIndex" class="h-full rounded-full"
                :class="currentService.theme === 'green' ? 'bg-success' : 'bg-primary'"
                style="animation: progress-bar 300s linear forwards;" />
            </div>

            <Transition name="slide-text" mode="out-in">
              <div :key="activeIndex" class="space-y-6 md:space-y-8">
                <span class="badge" :class="currentService.status === 'available'
                  ? (currentService.theme === 'blue' ? 'badge-primary' : 'badge-success')
                  : 'bg-hsa text-ash border-hsa'">
                  {{ currentService.status === 'available' ? currentService.badge : 'Bientôt Disponible' }}
                </span>

                <h3 class="text-3xl md:text-5xl font-bold leading-tight">
                  {{ currentService.title }}<span
                    :class="currentService.theme === 'blue' ? 'text-primary' : 'text-success'">.</span>
                </h3>

                <h4 class="text-lg md:text-2xl text-hsa font-light">
                  {{ currentService.subtitle }}
                </h4>

                <p class="text-base md:text-lg text-hsa leading-relaxed">
                  {{ currentService.description }}
                </p>

                <div v-if="currentService.features" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div v-for="(feature, fi) in currentService.features" :key="feature.title"
                    class="flex items-start gap-4 animate-fade-up"
                    :style="{ animationDelay: `${fi * 100 + 200}ms`, animationFillMode: 'both' }">
                    <div :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      currentService.theme === 'blue' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                    ]">
                      <component :is="feature.icon" class="w-5 h-5" />
                    </div>
                    <div>
                      <h5 class="font-bold text-BtW">{{ feature.title }}</h5>
                      <p class="text-sm text-hsa mt-1">{{ feature.desc }}</p>
                    </div>
                  </div>
                </div>

                <ul v-if="currentService.list" class="space-y-3">
                  <li v-for="(item, li) in currentService.list" :key="item"
                    class="flex items-center gap-3 animate-fade-up"
                    :style="{ animationDelay: `${li * 100 + 200}ms`, animationFillMode: 'both' }">
                    <IconCheck
                      :class="['w-5 h-5 flex-shrink-0', currentService.theme === 'blue' ? 'text-primary' : 'text-success']" />
                    <span class="font-medium">{{ item }}</span>
                  </li>
                </ul>

                <div class="pt-2">
                  <UiBaseButton v-if="currentService.status === 'available'" :to="`/modules/${currentService.id}`"
                    variant="secondary" class="transition-all shadow-none"
                    :class="currentService.theme === 'blue' ? 'text-primary' : 'text-success'">
                    {{ currentService.cta }}
                    <IconArrowRight class="w-4 h-4 ml-2" />
                  </UiBaseButton>
                  <UiBaseButton v-else :to="`/modules/${currentService.id}`" variant="ghost"
                    class="text-hsa hover:text-primary">
                    Disponible prochainement
                  </UiBaseButton>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Visual Column -->
          <div class="relative">
            <Transition name="slide-visual" mode="out-in">
              <div :key="activeIndex" class="relative">
                <div class="absolute inset-0 blur-[100px] opacity-10 rounded-full"
                  :class="currentService.theme === 'blue' ? 'bg-primary' : 'bg-success'" />

                <RootHomeFeaturesDocsentry v-if="currentService.id === 'docsentry'" />
                <RootHomeFeaturesVigitech v-else-if="currentService.id === 'vigitech'" />
                <RootHomeFeaturesSecuscan v-else-if="currentService.id === 'secuscan'" />
                <RootHomeFeaturesLeakmonitor v-else-if="currentService.id === 'leakmonitor'" />

                <img v-else-if="currentService.image" :src="currentService.image" :alt="currentService.title"
                  class="rounded-3xl w-full object-cover h-[400px] shadow-2xl"
                  :class="{ 'grayscale opacity-60': currentService.status !== 'available' }" />

                <div v-if="currentService.status !== 'available'"
                  class="absolute inset-0 flex items-center justify-center bg-WtB/50 backdrop-blur-[1px] z-20 rounded-3xl">
                  <NuxtLink :to="`/modules/${currentService.id}`"
                    class="px-6 py-3 bg-BtW text-WtB rounded-full font-bold shadow-xl border border-ash hover:scale-105 transition-transform">
                    Bientôt Disponible
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconCheck, IconArrowRight } from '@tabler/icons-vue'
import { modules } from '@/data/modules'

const featureServices = computed(() => modules)

// Carousel State
const activeIndex = ref(0)
const isPaused = ref(false)
const progressKey = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const currentService = computed(() => featureServices.value[activeIndex.value])
const maxIndex = computed(() => featureServices.value.length - 1)
const sectionEl = ref<HTMLElement | null>(null)

// Whether this section is in the viewport (for wheel capture)
const isInView = ref(false)

// Navigation
function goTo(index: number) {
  activeIndex.value = index
  progressKey.value++
  resetTimer()
}

// Auto-rotation
function startTimer() {
  stopTimer()
  timer = setInterval(() => {
    if (!isPaused.value) {
      activeIndex.value = activeIndex.value < maxIndex.value ? activeIndex.value + 1 : 0
      progressKey.value++
    }
  }, 300000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function resetTimer() { startTimer() }
function pause() { isPaused.value = true }
function resume() {
  isPaused.value = false
  progressKey.value++
  resetTimer()
}

// Wheel capture: intercept scroll only when section is visible
let wheelCooldown = false

function onWheel(e: WheelEvent) {
  if (!isInView.value) return

  const goingDown = e.deltaY > 0
  const atFirst = activeIndex.value === 0
  const atLast = activeIndex.value === maxIndex.value

  // At boundary → let the page scroll naturally
  if ((goingDown && atLast) || (!goingDown && atFirst)) {
    return
  }

  // Intercept scroll to change module only on desktop
  if (window.innerWidth > 1024) {
    e.preventDefault()
  } else {
    return // Let natural scroll happen on mobile/tablet
  }

  if (wheelCooldown) return
  wheelCooldown = true

  if (goingDown) {
    activeIndex.value++
  } else {
    activeIndex.value--
  }
  progressKey.value++
  resetTimer()

  setTimeout(() => { wheelCooldown = false }, 600)
}

// IntersectionObserver to track visibility
let observer: IntersectionObserver | null = null

onMounted(() => {
  startTimer()

  window.addEventListener('wheel', onWheel, { passive: false })

  observer = new IntersectionObserver(
    ([entry]) => {
      isInView.value = entry.isIntersecting
    },
    { threshold: 0.4 }
  )

  if (sectionEl.value) {
    observer.observe(sectionEl.value)
  }
})

onUnmounted(() => {
  stopTimer()
  window.removeEventListener('wheel', onWheel)
  observer?.disconnect()
})
</script>

<style scoped>
.slide-text-enter-active {
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-text-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-text-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

.slide-text-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-visual-enter-active {
  transition: all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.slide-visual-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 1, 1);
}

.slide-visual-enter-from {
  opacity: 0;
  transform: scale(0.9) translateX(50px);
}

.slide-visual-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(-40px);
}

@keyframes progress-bar {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }

  100% {
    transform: scaleX(1);
    transform-origin: left;
  }
}
</style>
