<template>
  <div class="p-24 text-center bg-ash/5 border border-ash/10 rounded-[3rem]">
    <div class="w-20 h-20 bg-ash/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <IconShieldCheck class="w-10 h-10 text-hsa/40" />
    </div>
    <h3 class="text-xl font-black text-BtW">Tout est en ordre</h3>
    <p class="text-sm font-bold text-hsa mt-2">
      {{ activeTab === 'sent'
        ? "Vous n'avez envoyé aucun signalement."
        : "Vous n'avez reçu aucun signalement sur votre profil." }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck } from '@tabler/icons-vue'

defineProps<{
  activeTab: 'sent' | 'received'
}>()
</script>
