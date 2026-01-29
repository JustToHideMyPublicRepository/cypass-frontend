<template>
  <div class="text-center space-y-6 pt-12 border-t border-ash">
    <p class="text-hsa">Besoin d'une assistance personnalisée ?</p>
    <div class="flex flex-wrap justify-center gap-4">
      <UiBaseButton href="mailto:support@cypass.bj" variant="secondary" class="border border-ash">
        <IconMail class="w-5 h-5 mr-2" /> Envoyer un email
      </UiBaseButton>
      <UiBaseButton href="tel:+22921310000" variant="secondary" class="border border-ash">
        <IconPhone class="w-5 h-5 mr-2" /> +229 21 31 00 00
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMail, IconPhone } from '@tabler/icons-vue'
</script>
