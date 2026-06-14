<template>
  <div class="flex-1 overflow-y-auto w-full no-scrollbar">
    <div class="flex flex-col justify-center min-h-full px-4 sm:px-10 lg:px-12 xl:px-16 py-8 md:py-12 max-w-lg mx-auto">

      <!-- Logo et Lien vers l'Accueil -->
      <div class="mb-8 md:mb-10 animate-fade-down">
        <NuxtLink to="/" class="inline-flex items-center gap-3 group">
          <img :src="logoUrl" alt="Cypass Logo" class="h-10 w-auto object-contain" />
          <span
            class="text-2xl font-black tracking-tight text-BtW group-hover:text-primary transition-colors">CYPASS</span>
        </NuxtLink>
      </div>

      <!-- Zone de contenu (Slot) -->
      <div class="animate-fade-up">
        <slot />
      </div>

      <!-- Pied de page du formulaire -->
      <div
        class="mt-8 text-center text-[10px] md:text-xs animate-fade-in pb-4 text-slate-400 font-medium uppercase tracking-widest">
        &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LOGOS } from '~/utils/links'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const logoUrl = computed(() => {
  return isDark.value ? LOGOS.mobileWhite : LOGOS.mobileColor
})
</script>

