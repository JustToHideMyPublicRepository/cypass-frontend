<template>
  <div class="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
    <div class="text-7xl md:text-9xl font-black text-ashAct mb-6 md:mb-8">404</div>
    <h1 class="text-xl md:text-2xl font-bold text-BtW">Service introuvable</h1>
    <p class="text-sm md:text-base text-slate-500 mb-8 max-w-md">Le module que vous recherchez n'existe pas ou n'est
      plus disponible.</p>
    <UiBaseButton to="/modules" variant="primary">Retour au catalogue</UiBaseButton>
  </div>
</template>

<script setup lang="ts">
// Aucune logique requise
</script>
