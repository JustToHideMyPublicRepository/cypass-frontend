<template>
  <div class="text-center space-y-4 animate-fade-up">
    <span class="badge badge-success">Écosystème</span>
    <h1 class="text-4xl md:text-5xl font-black tracking-tight">
      Nos Partenaires <br />
      <span class="text-secondary">Institutionnels</span>
    </h1>
    <p class="text-lg text-hsa max-w-2xl mx-auto">
      Nous collaborons avec les acteurs clés de la sécurité et du numérique au Bénin pour garantir un service de
      confiance.
    </p>
    <UiBaseButton @click="$emit('open-modal')" class="mt-8">
      Devenir Partenaire
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
defineEmits(['open-modal'])
</script>
