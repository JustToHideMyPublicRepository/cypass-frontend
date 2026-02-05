<template>
  <div class="text-center space-y-3 md:space-y-4 animate-fade-up">
    <span class="badge badge-success">Écosystème</span>
    <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight">
      Nos Partenaires <br />
      <span class="text-secondary">Institutionnels</span>
    </h1>
    <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto leading-relaxed">
      Nous collaborons avec les acteurs clés de la sécurité et du numérique au Bénin pour garantir un service de
      confiance.
    </p>
    <div class="pt-4 md:pt-6">
      <UiBaseButton @click="$emit('open-modal')" class="px-6 py-3 w-full sm:w-auto">
        Devenir Partenaire
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['open-modal'])
</script>
