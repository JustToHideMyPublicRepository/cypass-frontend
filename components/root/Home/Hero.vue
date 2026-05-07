<template>
  <section class="relative py-8 overflow-hidden lg:overflow-visible">
    <!-- Texture subtile (appliquée uniquement au Hero) -->
    <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%222%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-4 gap-6 items-center">
        <!-- Texte -->
        <div
          class="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-right lg:col-span-3">
          <div class="inline-flex items-center gap-2">
            <IconLockBolt class="w-5 h-5 ml-2 text-primary" />
            <span class="text-xs font-bold uppercase tracking-widest">
              Certifiez, Signalez et Protégez
            </span>
          </div>

          <h1>
            Votre bouclier
            <span class="font-handwritting text-secondary relative">
              numérique
            </span>
            pour
            <div class="min-h-[1.8em] flex items-end">
              <span class="font-handwritting text-primary">
                {{ currentText }}<span
                  class="inline-block w-[3px] h-[0.85em] bg-primary animate-pulse align-middle ml-0.5"></span>
              </span>
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
          <div class="space-y-4 pt-4 w-full md:max-w-fit mx-auto lg:mx-0">
            <!-- Boutons s-->
            <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start">
              <UiBaseButton :to="authStore.user ? '/dashboard/docsentry' : '/verify'" variant="secondary"
                class="w-full sm:w-auto text-[11px] md:text-base px-1.5 md:px-8 py-2.5 md:py-3 font-bold flex items-center justify-center gap-1.5 text-center h-full">
                <IconFileCheck class="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span class="leading-tight">{{ authStore.user ? 'Gestion documents' : 'Vérifier document' }}</span>
              </UiBaseButton>
              <UiBaseButton :to="authStore.user ? '/dashboard/vigitech' : '/vigitech'" variant="accent"
                class="w-full sm:w-auto text-[11px] md:text-base px-1.5 md:px-8 py-2.5 md:py-3 font-bold flex items-center justify-center gap-1.5 text-center h-full">
                <IconShieldCheck class="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span class="leading-tight">{{ authStore.user ? 'Gestion incidents' : 'Veille publique' }}</span>
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
        <div
          class="relative w-full perspective-1000 animate-fade-left mt-8 lg:mt-0 flex justify-center lg:block overflow-visible lg:col-span-1">
          <div
            class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-[80px] opacity-40 animate-pulse-slow">
          </div>

          <UiAppFrame type="browser" url="https://verify.cypass.bj/" :glass="true" rounded="rounded-3xl" padding="p-0"
            class="w-full max-w-[calc(100vw-32px)] lg:w-fit z-20 shadow-2xl lg:mx-0 lg:translate-x-32 xl:translate-x-32 transition-transform duration-700 ease-out">
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
import { IconLockBolt, IconShieldCheck, IconAccessible, IconFileCheck, IconRosetteDiscountCheck, IconFingerprint, IconWorld } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'

const authStore = useAuthStore()

const heroFeatures = [
  { label: 'Souveraineté', icon: markRaw(IconWorld) },
  { label: 'Intégrité', icon: markRaw(IconRosetteDiscountCheck) },
  { label: 'Accessibilité', icon: markRaw(IconAccessible) }
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
