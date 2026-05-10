<template>
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
      <div class="flex items-end">
        <span class="font-handwritting text-primary">
          {{ currentText }}<span
            class="inline-block w-[3px] h-[0.85em] bg-primary animate-pulse align-middle ml-0.5"></span>
        </span>
      </div>
    </h1>

    <p class="max-w-2xl mx-auto lg:mx-0 leading-relaxed">
      Avec CYPASS,
      <NuxtLink to="/verify"
        class="font-bold hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">
        chaque document</NuxtLink> émis devient une preuve,
      <NuxtLink to="/vigitech"
        class="font-bold hover:underline decoration-primary decoration-2 underline-offset-4 transition-all">chaque
        incident</NuxtLink> signalé devient une alerte et <span class="font-bold">chaque donnée sensible</span>
      devient surveillée.
    </p>

    <!-- Boutons -->
    <div class="space-y-4 pt-4 w-full md:max-w-fit mx-auto lg:mx-0">
      <!-- Boutons s-->
      <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start">
        <UiBaseButton :to="authStore.user ? `/dashboard/${wsStore.activeWorkspace?.slug || ''}/docsentry` : '/verify'" variant="accent"
          class="w-full sm:w-auto flex items-center justify-center gap-1.5 text-center h-full">
          <IconFileCheck class="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span class="leading-tight">{{ authStore.user ? 'Gestion documents' : 'Vérifier document' }}</span>
        </UiBaseButton>
        <UiBaseButton :to="authStore.user ? '/dashboard/vigitech' : '/vigitech'" variant="secondary"
          class="w-full sm:w-auto flex items-center justify-center gap-1.5 text-center h-full">
          <IconShieldCheck class="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span class="leading-tight">{{ authStore.user ? 'Gestion incidents' : 'Veille publique' }}</span>
        </UiBaseButton>
      </div>
    </div>

    <div
      class="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-xs md:text-sm font-semibold">
      <div v-for="feature in heroFeatures" :key="feature.label"
        class="flex items-center gap-2 bg-WtB/50 px-3 md:px-4 py-2 rounded-lg backdrop-blur-sm border border-ash/50">
        <component :is="feature.icon" class="w-5 h-5 text-primary" />
        <span>{{ feature.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, markRaw } from 'vue'
import { IconLockBolt, IconShieldCheck, IconAccessible, IconFileCheck, IconRosetteDiscountCheck, IconWorld } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

const authStore = useAuthStore()
const wsStore = useWorkspaceStore()

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
