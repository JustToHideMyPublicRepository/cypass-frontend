<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 scale-110"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">

      <!-- Overlay de Drop Zone Global -->
      <div v-if="isDragging && activeHandlers.length > 0" class="fixed inset-0 z-[9999] pointer-events-none">
        <!-- Arrière-plan flouté avec teinte primaire -->
        <div class="absolute inset-0 bg-primary/10 backdrop-blur-[40px] transition-all duration-700"></div>

        <!-- Contenu central interactif -->
        <div class="absolute inset-0 flex items-center justify-center p-8">
          <div
            class="w-full max-w-2xl aspect-[16/10] rounded-[4rem] border-8 border-dashed border-white/20 flex flex-col items-center justify-center bg-primary/40 shadow-[0_0_150px_rgba(var(--color-primary),0.4)] animate-pulse-ultra">

            <!-- Conteneur d'icône flottante -->
            <div
              class="w-40 h-40 bg-WtB rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] scale-125 border-4 border-primary/20">
              <IconUpload class="w-20 h-20 text-primary animate-bounce-slow" />
            </div>

            <!-- Textes d'instruction -->
            <h2 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 text-center">
              Déposez pour analyser
            </h2>
            <p class="text-white/80 font-black uppercase tracking-[0.3em] text-xs md:text-sm">
              Relâchez votre document ici
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconUpload } from '@tabler/icons-vue'
import { useGlobalDropZone } from '~/composables/useDropZone'

const { isDragging, dragCounter, activeHandlers, handleGlobalDrop } = useGlobalDropZone()

// Gestion de l'entrée d'un fichier dans la zone de survol
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  if (activeHandlers.value.length === 0) return
  dragCounter.value++
  isDragging.value = true
}

// Gestion de la sortie de la zone de survol
const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

// Empêcher le comportement par défaut du navigateur
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

// Traitement du dépôt (drop) final
const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  dragCounter.value = 0

  if (e.dataTransfer?.files.length) {
    handleGlobalDrop(e.dataTransfer.files[0])
  }
}

// Enregistrement des écouteurs globaux au montage
onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('drop', onDrop)
})

// Nettoyage des écouteurs au démontage
onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('drop', onDrop)
})
</script>

<style scoped>
@keyframes pulse-ultra {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(0.97);
    opacity: 0.9;
  }
}

.animate-pulse-ultra {
  animation: pulse-ultra 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
