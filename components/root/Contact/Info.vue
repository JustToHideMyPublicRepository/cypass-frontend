<template>
  <div class="bg-WtB rounded-2xl md:rounded-3xl p-6 md:p-8 border border-ash shadow-lg">
    <h3 class="text-lg md:text-xl font-bold mb-6">Coordonnées</h3>

    <div class="space-y-5 md:space-y-6">
      <div class="flex items-start gap-4">
        <div
          class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <IconMapPin class="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p class="font-bold mb-0.5 md:mb-1 text-sm md:text-base">Siège Social</p>
          <p class="text-hsa text-xs md:text-sm leading-relaxed">
            Immeuble des Services Publics<br />
            Avenue Jean-Paul II<br />
            Cotonou, Bénin
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div
          class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-success/10 text-success flex items-center justify-center flex-shrink-0">
          <IconMail class="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p class="font-bold mb-0.5 md:mb-1 text-sm md:text-base">Email</p>
          <a href="mailto:contact@cypass.bj"
            class="text-hsa text-xs md:text-sm hover:text-primary transition-colors block">contact@cypass.bj</a>
          <a href="mailto:support@cypass.bj"
            class="text-hsa text-xs md:text-sm hover:text-primary transition-colors block">support@cypass.bj</a>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div
          class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
          <IconPhone class="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p class="font-bold mb-0.5 md:mb-1 text-sm md:text-base">Téléphone</p>
          <p class="text-hsa text-xs md:text-sm">+229 21 00 00 00</p>
          <p class="text-[10px] md:text-xs text-ashAct mt-1">Lun-Ven, 8h00 - 18h30</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMapPin, IconMail, IconPhone } from '@tabler/icons-vue'
</script>
