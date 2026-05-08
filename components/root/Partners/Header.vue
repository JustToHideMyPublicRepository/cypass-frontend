<template>
  <div class="text-center space-y-3 md:space-y-4 animate-fade-up">
    <span class="badge badge-success">Écosystème</span>
    <h2> Nos Partenaires <br /> <span class="text-secondary">Institutionnels</span> </h2>
    <p class="mx-auto">
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
