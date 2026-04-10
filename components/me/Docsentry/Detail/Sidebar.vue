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
        <UiBaseButton v-if="hasVersions" @click="$emit('download-zip')" class="w-full justify-start" variant="accent">
          <IconZip class="w-4 h-4 mr-2" /> Télécharger l'archive ZIP
        </UiBaseButton>
        <UiBaseButton @click="$emit('share')" class="w-full justify-start" variant="ghost">
          <IconShare class="w-4 h-4 mr-2" /> Partager le document
        </UiBaseButton>
      </div>
    </UiBaseCard>

    <!-- MultiVersion Generation Form (Sidebar) -->
    <UiBaseCard v-if="canGenerateVersions">
      <h3 class="font-bold text-BtW mb-4 flex items-center gap-2">
        <IconFiles class="w-5 h-5 text-primary" />
        Multiversions
      </h3>
      <p class="text-[10px] text-hsa font-medium leading-relaxed mb-4 uppercase tracking-widest">
        Générez des versions enfants personnalisées pour vos destinataires.
      </p>
      <MeDocsentryDetailMultiVersionForm :document-id="documentId" @update:loading="$emit('update:loading', $event)" />
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
import {
  IconShieldCheck, IconCertificate, IconShare, IconFingerprint,
  IconZip, IconFiles
} from '@tabler/icons-vue'
import { computed } from 'vue'
import { differenceInDays, parseISO } from 'date-fns'

const props = defineProps<{
  documentId: string
  hasCertificate: boolean
  hasVersions: boolean
  createdAt: string
}>()

defineEmits(['verify', 'download', 'share', 'download-zip', 'update:loading'])

const canGenerateVersions = computed(() => {
  if (!props.createdAt) return false
  const now = new Date()
  const createdDate = parseISO(props.createdAt)
  return differenceInDays(now, createdDate) < 7
})
</script>
