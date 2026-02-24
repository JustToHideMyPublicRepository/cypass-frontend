<template>
  <div class="space-y-6">
    <UiBaseCard>
      <h3 class="font-bold text-BtW mb-4">Actions</h3>
      <div class="space-y-3">
        <UiBaseButton @click="$emit('verify')" class="w-full justify-start" variant="primary">
          <IconShieldCheck class="w-4 h-4 mr-2" /> Vérifier l'authenticité
        </UiBaseButton>
        <UiBaseButton v-if="hasCertificate" @click="$emit('download')" class="w-full justify-start" variant="secondary">
          <IconCertificate class="w-4 h-4 mr-2" /> Télécharger le certificat
        </UiBaseButton>
        <UiBaseButton @click="$emit('share')" class="w-full justify-start" variant="ghost">
          <IconShare class="w-4 h-4 mr-2" /> Partager le document
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <UiBaseCard class="bg-primary/5 border-primary/20">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 rounded bg-primary text-WtB">
          <IconFingerprint class="w-5 h-5" />
        </div>
        <h3 class="font-bold text-BtW">Souveraineté</h3>
      </div>
      <p class="text-sm text-hsa leading-relaxed">
        Ce document est certifié par l'infrastructure de confiance CYPASS, garantissant son origine et son intégrité
        immuable sur le territoire national.
      </p>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconCertificate, IconShare, IconFingerprint } from '@tabler/icons-vue'

defineProps<{
  hasCertificate: boolean
}>()

defineEmits(['verify', 'download', 'share'])
</script>
