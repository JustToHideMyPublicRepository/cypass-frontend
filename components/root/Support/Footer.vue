<template>
  <div class="text-center space-y-4 md:space-y-6 pt-8 md:pt-12 border-t border-ash">
    <p class="text-hsa text-sm md:text-base">Besoin d'une assistance personnalisée ?</p>
    <div class="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
      <UiBaseButton href="mailto:support@cypass.bj" variant="secondary" class="border border-ash justify-center">
        <IconMail class="w-5 h-5 mr-2" /> Envoyer un email
      </UiBaseButton>
      <UiBaseButton href="tel:+22901XXXXXXXX" variant="ghost" class="border border-ash justify-center">
        <IconPhone class="w-5 h-5 mr-2" /> +229 01XXXXXXXX
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMail, IconPhone } from '@tabler/icons-vue'
</script>
