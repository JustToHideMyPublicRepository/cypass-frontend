<template>
  <section class="py-12 md:py-20 text-center">
    <!-- Section d'appel à l'action pour le support -->
    <div class="max-w-2xl mx-auto animate-fade-up">
      <div
        class="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-hsa to-hsaAct text-WtB shadow-2xl relative overflow-hidden">
        <!-- Décoration -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2">
        </div>

        <div class="relative z-10">
          <h4 class="text-WtB mb-3">Vous ne trouvez pas votre réponse ?</h4>
          <p class="text-ash mb-6">Notre équipe de support est disponible 24/7 pour vous accompagner.</p>
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <UiBaseButton variant="secondary" to="/support">
              <IconMessageCircle class="w-5 h-5 mr-2" />
              <span class="relative z-10">Ouvrir un ticket</span>
            </UiBaseButton>
            <a href="mailto:support@cypass.bj"
              class="btn bg-transparent border border-WtB/20 text-WtB hover:bg-WtB/10 px-6 py-2.5">
              Envoyer un email
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconMessageCircle } from '@tabler/icons-vue'
</script>
