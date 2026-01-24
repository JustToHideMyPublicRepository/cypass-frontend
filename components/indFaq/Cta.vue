<template>
  <section class="py-20 text-center">
    <div class="max-w-2xl mx-auto px-4 animate-fade-up">
      <div
        class="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
        <!-- Decor -->
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2">
        </div>

        <div class="relative z-10">
          <h3 class="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
          <p class="text-slate-300 mb-8">Notre équipe de support est disponible 24/7 pour vous accompagner.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/support" class="btn bg-white text-slate-900 hover:bg-slate-100 border-none">
              <IconMessageCircle class="w-5 h-5 mr-2" />
              Ouvrir un ticket
            </NuxtLink>
            <a href="mailto:support@cypass.bj"
              class="btn bg-transparent border border-white/20 text-white hover:bg-white/10">
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
