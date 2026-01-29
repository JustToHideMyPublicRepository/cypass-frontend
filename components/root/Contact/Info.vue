<template>
  <div class="bg-WtB rounded-3xl p-8 border border-ash shadow-lg">
    <h3 class="text-xl font-bold mb-6">Coordonnées</h3>

    <div class="space-y-6">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <IconMapPin class="w-6 h-6" />
        </div>
        <div>
          <p class="font-bold mb-1">Siège Social</p>
          <p class="text-hsa text-sm leading-relaxed">
            Immeuble des Services Publics<br />
            Avenue Jean-Paul II<br />
            Cotonou, Bénin
          </p>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center flex-shrink-0">
          <IconMail class="w-6 h-6" />
        </div>
        <div>
          <p class="font-bold mb-1">Email</p>
          <a href="mailto:contact@cypass.bj"
            class="text-hsa text-sm hover:text-primary transition-colors">contact@cypass.bj</a>
          <br />
          <a href="mailto:support@cypass.bj"
            class="text-hsa text-sm hover:text-primary transition-colors">support@cypass.bj</a>
        </div>
      </div>

      <div class="flex items-start gap-4">
        <div
          class="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
          <IconPhone class="w-6 h-6" />
        </div>
        <div>
          <p class="font-bold mb-1">Téléphone</p>
          <p class="text-hsa text-sm">+229 21 00 00 00</p>
          <p class="text-xs text-ashAct mt-1">Lun-Ven, 8h00 - 18h30</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMapPin, IconMail, IconPhone } from '@tabler/icons-vue'
</script>
