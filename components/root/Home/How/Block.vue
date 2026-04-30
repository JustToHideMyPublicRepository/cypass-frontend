<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <!-- Éléments d'arrière-plan -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:32px_32px]">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- En-tête -->
      <div class="text-center max-w-3xl mx-auto mb-12 md:mb-20 animate-fade-up">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Comment ça marche ?
        </span>
        <h2 class="font-extrabold text-BtW tracking-tight">
          Protection en <span
            class="font-handwritting text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            temps réel </span>
        </h2>
        <p class="text-hsa leading-relaxed">
          Un processus fluide, étape par étape, pour garantir votre sécurité numérique.
        </p>
      </div>

      <!-- Sélecteur de Flux -->
      <div class="max-w-4xl mx-auto mb-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <!-- Tab DocSentry -->
        <button @click="activeTab = 'docsentry'"
          class="group/tab flex items-center gap-5 transition-all duration-700 ease-out text-left"
          :class="activeTab === 'docsentry' ? 'scale-100 opacity-100' : 'scale-90 opacity-40 hover:opacity-70'">
          <div
            class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
            <IconFileCheck class="w-7 h-7" />
          </div>
          <div>
            <h3 class="font-black text-BtW tracking-tighter text-xl">DocSentry</h3>
            <p class="text-primary font-bold uppercase tracking-widest text-xs">Certification & Vérification</p>
          </div>
        </button>

        <!-- Divider -->
        <div class="h-px w-20 bg-ash/30 md:hidden"></div>

        <!-- Tab VigiTech -->
        <button @click="activeTab = 'vigitech'"
          class="group/tab flex items-center gap-5 transition-all duration-700 ease-out text-left"
          :class="activeTab === 'vigitech' ? 'scale-100 opacity-100' : 'scale-90 opacity-40 hover:opacity-70'">
          <div
            class="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-lg">
            <IconShieldCheck class="w-7 h-7" />
          </div>
          <div>
            <h3 class="font-black text-BtW tracking-tighter text-xl">VigiTech</h3>
            <p class="text-secondary font-bold uppercase tracking-widest text-xs">Signalement & Veille</p>
          </div>
        </button>
      </div>

      <!-- Contenu des Flux -->
      <div class="relative min-h-[400px]">
        <transition name="flow-fade" mode="out-in">
          <RootHomeHowDocsentry v-if="activeTab === 'docsentry'" key="docsentry" />
          <RootHomeHowVigitech v-else key="vigitech" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconFileCheck, IconShieldCheck } from '@tabler/icons-vue'

const activeTab = ref<'docsentry' | 'vigitech'>('docsentry')
let rotationInterval: any = null

const startRotation = () => {
  // 5 minutes = 300,000 ms
  rotationInterval = setInterval(() => {
    activeTab.value = activeTab.value === 'docsentry' ? 'vigitech' : 'docsentry'
  }, 300000)
}

onMounted(() => {
  startRotation()
})

onUnmounted(() => {
  if (rotationInterval) clearInterval(rotationInterval)
})
</script>

<style scoped>
.flow-fade-enter-active,
.flow-fade-leave-active {
  transition: all 0.5s ease;
}

.flow-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.flow-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
