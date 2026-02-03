<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isDragging && activeHandlers.length > 0" class="fixed inset-0 z-[9999] pointer-events-none">
        <!-- Backdrop Blur -->
        <div class="absolute inset-0 bg-primary/20 backdrop-blur-xl transition-all duration-500"></div>

        <!-- Center Content -->
        <div class="absolute inset-0 flex items-center justify-center p-6">
          <div
            class="w-full max-w-xl aspect-video rounded-[60px] border-8 border-dashed border-WtB/40 flex flex-col items-center justify-center bg-primary/80 shadow-[0_0_100px_rgba(var(--color-primary),0.3)] animate-pulse-gentle">
            <div class="w-32 h-32 bg-WtB rounded-full flex items-center justify-center mb-8 shadow-2xl scale-125">
              <IconUpload class="w-16 h-16 text-primary animate-bounce" />
            </div>
            <h2 class="text-4xl font-black text-WtB uppercase tracking-tighter mb-4">Déposez votre fichier</h2>
            <p class="text-WtB font-bold text-lg">Relâchez pour déposer le fichier</p>
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

const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  if (activeHandlers.value.length === 0) return
  dragCounter.value++
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  dragCounter.value--
  if (dragCounter.value <= 0) {
    dragCounter.value = 0
    isDragging.value = false
  }
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  dragCounter.value = 0

  if (e.dataTransfer?.files.length) {
    handleGlobalDrop(e.dataTransfer.files[0])
  }
}

onMounted(() => {
  window.addEventListener('dragenter', onDragEnter)
  window.addEventListener('dragleave', onDragLeave)
  window.addEventListener('dragover', onDragOver)
  window.addEventListener('drop', onDrop)
})

onUnmounted(() => {
  window.removeEventListener('dragenter', onDragEnter)
  window.removeEventListener('dragleave', onDragLeave)
  window.removeEventListener('dragover', onDragOver)
  window.removeEventListener('drop', onDrop)
})
</script>

<style scoped>
@keyframes pulse-gentle {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.95;
    transform: scale(0.98);
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
