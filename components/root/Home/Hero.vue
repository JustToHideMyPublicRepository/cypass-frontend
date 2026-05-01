<template>
  <section class="relative py-8 overflow-hidden lg:overflow-visible">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Texte -->
        <div class="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-right">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-BtW shadow-lg backdrop-blur-md">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span class="text-xs font-bold uppercase tracking-widest">
              Certifiez, Signalez et Protégez</span>
          </div>

          <h1
            class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-textClr via-hsa to-BtW leading-[1.1] md:leading-tight">
            Votre bouclier <br class="hidden lg:block" />
            <span
              class="font-handwritting text-transparent bg-clip-text bg-gradient-to-r from-primary to-success relative">
              numérique
              <svg class="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 200 9" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.00025 6.99997C25.7509 9.37523 78.9113 9.81705 112.225 4.88566C145.539 -0.0457375 186.257 0.999738 198.001 2.99996"
                  stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
            </span>
            pour
            <div
              class="h-[1.5em] lg:h-[1.2em] relative overflow-hidden block w-full mt-2 lg:mt-4 text-[0.8em] md:text-[0.7em] lg:text-[0.65em] font-black text-center lg:text-left">
              <span
                class="font-handwritting text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary inline-block">
                {{ currentText }}
              </span>
              <span class="inline-block w-[3px] h-[0.9em] bg-primary animate-pulse align-middle ml-1"></span>
            </div>
          </h1>

          <p class="text-hsa max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Avec CYPASS,
            <NuxtLink to="/verify"
              class="font-bold hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
              chaque
              document</NuxtLink> émis devient une preuve,
            <NuxtLink to="/vigitech"
              class="font-bold hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">chaque
              incident</NuxtLink> signalé devient une alerte et <span class="font-bold">chaque donnée sensible</span>
            devient surveillée.
          </p>

          <!-- Boutons -->
          <div class="space-y-4 pt-4 max-w-fit mx-auto lg:mx-0">
            <!-- Bouton Principal -->
            <div class="flex justify-center lg:justify-start">
              <UiBaseButton :to="authStore.user ? '/dashboard' : '/auth/login'"
                class="w-full lg:w-[calc(100%+16px)] text-base md:text-lg px-8 md:px-12 py-3 md:py-4 shadow-BtW/40 !rounded-2xl">
                {{ authStore.user ? 'Tableau de bord' : 'Accéder au portail' }}
                <IconArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </UiBaseButton>
            </div>

            <!-- Boutons Secondaires -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <UiBaseButton :to="authStore.user ? '/dashboard/vigitech' : '/vigitech'" variant="accent"
                class="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 flex items-center justify-center gap-2">
                <IconShield class="w-4 h-4" />
                {{ authStore.user ? 'Gestion des incidents' : 'Veille communautaire' }}
              </UiBaseButton>
              <UiBaseButton :to="authStore.user ? '/dashboard/docsentry' : '/verify'" variant="secondary"
                class="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 font-bold flex items-center justify-center gap-2">
                <IconFileCheck class="w-4 h-4" />
                {{ authStore.user ? 'Gestion des documents' : 'Vérifier un document' }}
              </UiBaseButton>
            </div>
          </div>

          <div
            class="pt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-xs md:text-sm font-semibold text-hsa">
            <div v-for="feature in heroFeatures" :key="feature.label"
              class="flex items-center gap-2 bg-WtB/50 px-3 md:px-4 py-2 rounded-lg backdrop-blur-sm border border-ash/50">
              <component :is="feature.icon" class="w-5 h-5 text-primary" />
              <span>{{ feature.label }}</span>
            </div>
          </div>
        </div>

        <!-- Composition de carte de verre -->
        <div class="relative w-full perspective-1000 animate-fade-left mt-8 lg:mt-0 flex justify-center lg:block overflow-hidden lg:overflow-visible">
          <div
            class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse-slow">
          </div>

          <UiAppFrame type="browser" url="https://verify.cypass.bj/" :glass="true" rounded="rounded-3xl" padding="p-0"
            class="w-full max-w-[calc(100vw-32px)] lg:w-auto transform lg:translate-x-1/5 xl:translate-x-1/3 transition-transform duration-700 ease-out z-20 shadow-2xl mx-auto">

            <div
              class="bg-bgClr p-4 md:p-6 rounded-b-2xl h-auto md:h-[450px] relative overflow-hidden w-full lg:w-[500px] xl:w-[600px] max-w-full">
              <!-- Grille décorative -->
              <div
                class="absolute inset-0 bg-[url('https://heropatterns.com/img/patterns/circuit-board.png')] opacity-5">
              </div>

              <!-- Fake Verify UI -->
              <div
                class="p-5 sm:p-8 rounded-3xl bg-success/5 border border-success/20 relative z-10 shadow-lg text-left">
                <div class="absolute top-0 right-0 p-6 opacity-10">
                  <IconRosetteDiscountCheck class="w-16 h-16 md:w-24 md:h-24 text-success" />
                </div>
                <div class="flex items-center gap-2 md:gap-3 text-success mb-6 relative z-10">
                  <IconRosetteDiscountCheck class="w-6 h-6 md:w-8 md:h-8" />
                  <span class="text-base md:text-xl font-black italic">DOCUMENT AUTHENTIQUE</span>
                </div>

                <div class="p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-6">
                  <p class="text-[10px] text-hsa uppercase font-black tracking-widest mb-1">Document Certifié</p>
                  <p class="text-lg md:text-xl font-black text-BtW truncate">Contrat-Partenariat-2026.pdf</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Émetteur du Document</p>
                    <p class="font-bold text-BtW">CYPASS</p>
                  </div>
                  <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
                    <p class="text-[10px] text-hsa uppercase font-black">Date d'Exécution</p>
                    <p class="font-bold text-BtW">Aujourd'hui, 09:41</p>
                  </div>
                </div>

                <div class="space-y-2 mb-6">
                  <p class="text-[10px] text-hsa uppercase font-black tracking-widest px-1">Empreinte Numérique
                    (SHA-256)</p>
                  <div
                    class="flex items-center gap-2 p-3 bg-ash/30 rounded-xl border border-ash/50 font-code text-[10px] text-hsa opacity-80 break-all">
                    <IconFingerprint class="w-4 h-4 text-primary shrink-0" />
                    e3b0c44298fc1c149afbf4c8996fb924...
                  </div>
                </div>

                <div class="flex justify-center pt-2 pb-2">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=cypass-verify"
                    class="w-20 h-20 rounded-lg mix-blend-multiply opacity-80" alt="QR Code" />
                </div>
              </div>
            </div>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconShieldCheck, IconArrowRight, IconShield, IconFileCheck, IconRosetteDiscountCheck, IconFingerprint, IconWorld } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'

const authStore = useAuthStore()

const heroFeatures = [
  { label: 'Souveraineté', icon: markRaw(IconShieldCheck) },
  { label: 'Intégrité', icon: markRaw(IconRosetteDiscountCheck) },
  { label: 'Accessibilité', icon: markRaw(IconWorld) }
]

const animatedRoles = [
  'certifier vos contrats.',
  'signaler une fraude.',
  'Vérifier un document.',
  'détecter une falsification.',
  'protéger vos données.'
]

const currentRoleIndex = ref(0)
const currentText = ref('')
let typingInterval: ReturnType<typeof setInterval>
let erasingInterval: ReturnType<typeof setInterval>
let typingTimeout: ReturnType<typeof setTimeout>

const typeWord = () => {
  const word = animatedRoles[currentRoleIndex.value]
  let charIndex = 0
  currentText.value = ''

  typingInterval = setInterval(() => {
    if (charIndex < word.length) {
      currentText.value += word.charAt(charIndex)
      charIndex++
    } else {
      clearInterval(typingInterval)
      typingTimeout = setTimeout(eraseWord, 2500)
    }
  }, 45)
}

const eraseWord = () => {
  let charIndex = currentText.value.length

  erasingInterval = setInterval(() => {
    if (charIndex > 0) {
      currentText.value = currentText.value.slice(0, -1)
      charIndex--
    } else {
      clearInterval(erasingInterval)
      currentRoleIndex.value = (currentRoleIndex.value + 1) % animatedRoles.length
      typingTimeout = setTimeout(typeWord, 600)
    }
  }, 25)
}

onMounted(() => {
  typeWord()
})

onUnmounted(() => {
  clearInterval(typingInterval)
  clearInterval(erasingInterval)
  clearTimeout(typingTimeout)
})
</script>
