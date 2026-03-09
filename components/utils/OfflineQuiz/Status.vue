<template>
  <div class="mt-4 flex flex-col items-center gap-4">
    <Transition name="fade">
      <div v-if="connectionRestored"
        class="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center gap-4 animate-bounce-subtle">
        <div class="flex flex-col text-left">
          <span class="text-success text-xs font-black uppercase tracking-wider">Connexion rétablie</span>
          <span class="text-textClr/60 text-[10px] font-medium leading-tight">
            Souhaitez-vous recharger la page maintenant ?</span>
        </div>
        <button @click="reloadPage"
          class="px-4 py-2 bg-success text-slate-950 text-xs font-black rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95">
          Actualiser
        </button>
      </div>
      <div v-else class="inline-flex items-center gap-2 text-textClr/40 text-xs font-medium">
        <div class="w-2 h-2 rounded-full bg-warning border border-warning/50 animate-pulse"></div>
        En attente de rétablissement du réseau...
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  connectionRestored: boolean
}>()

const reloadPage = () => {
  if (process.client) {
    window.location.reload()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
