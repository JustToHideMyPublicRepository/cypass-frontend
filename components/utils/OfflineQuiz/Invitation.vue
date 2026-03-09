<template>
  <Transition name="fade-slide" mode="out-in">
    <div v-if="show"
      class="bg-WtB/90 backdrop-blur-md border border-ash/50 rounded-2xl p-5 shadow-2xl ring-1 ring-white/10 animate-fade-in relative">
      <button @click="$emit('close')"
        class="absolute top-3 right-3 text-hsa hover:text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors"
        title="Fermer">
        <IconX class="w-5 h-5" />
      </button>

      <div class="flex items-start gap-4">
        <div class="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center shrink-0">
          <IconWifiOff class="w-6 h-6 text-warning" />
        </div>
        <div>
          <h2 class="text-base font-bold text-BtW mb-1 pr-6">Connexion perdue</h2>
          <p class="text-xs font-medium text-hsa mb-4">
            Envie de jouer à un mini-jeu de cybersécurité en attendant ?
          </p>
          <div class="flex items-center gap-2">
            <button @click="$emit('play')"
              class="flex-1 py-2 bg-primary text-WtB text-xs font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              Jouer
            </button>
            <button @click="$emit('reload')"
              class="flex-1 py-2 bg-ash text-WtB text-xs font-bold rounded-xl hover:bg-ash border border-ash">
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconWifiOff, IconX } from '@tabler/icons-vue'

defineProps<{
  show: boolean
}>()

defineEmits<{
  (e: 'play'): void
  (e: 'reload'): void
  (e: 'close'): void
}>()
</script>
