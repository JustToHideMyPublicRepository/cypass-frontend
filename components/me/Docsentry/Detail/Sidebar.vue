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

        <UiAppTooltip v-if="hasVersions" class="block w-full"
          :content="isZipDownloaded ? 'Si après téléchargement le fichier ne vient pas, veuillez réessayer.' : 'Le téléchargement ne se fait qu\'une seule fois.'"
          width-class="w-64">
          <template #trigger>
            <UiBaseButton @click="$emit('download-zip')" class="w-full justify-start"
              :variant="isZipDownloaded ? 'warning' : 'accent'">
              <IconZip class="w-4 h-4 mr-2" /> Télécharger l'archive ZIP
            </UiBaseButton>
          </template>
        </UiAppTooltip>

        <UiBaseButton @click="$emit('share')" class="w-full justify-start" variant="ghost">
          <IconShare class="w-4 h-4 mr-2" /> Partager le document
        </UiBaseButton>

        <div class="pt-2 border-t border-ash/50 mt-2 space-y-3">
          <UiBaseButton v-if="!isArchived" @click="$emit('archive')" :disabled="loading"
            class="w-full justify-start text-warning hover:bg-warning/10" variant="ghost">
            <UiLogoLoader v-if="loading" size="xs" class="mr-2" />
            <IconArchive v-else class="w-4 h-4 mr-2" />
            Archiver le document
          </UiBaseButton>
          <template v-else>
            <UiBaseButton @click="$emit('unarchive')" :disabled="loading"
              class="w-full justify-start text-primary hover:bg-primary/10" variant="ghost">
              <UiLogoLoader v-if="loading" size="xs" class="mr-2" />
              <IconRotate v-else class="w-4 h-4 mr-2" />
              Désarchiver le document
            </UiBaseButton>

            <!-- Archived Date Info -->
            <div v-if="archivedAt" class="flex items-center gap-2 px-3 py-2 bg-ash/30 rounded-xl border border-ash/50">
              <div class="w-1.5 h-1.5 rounded-full bg-warning"></div>
              <p class="text-[10px] text-hsa font-medium uppercase tracking-wider">
                Archivé le <span class="text-BtW font-bold">{{ formatDate(archivedAt) }}</span>
              </p>
            </div>
          </template>
        </div>
      </div>
    </UiBaseCard>

    <!-- Certificate Download Count -->
    <div v-if="certificateDownloadCount !== undefined && certificateDownloadCount > 0"
      class="flex items-center justify-center gap-2 text-xs text-hsa bg-primary/5 rounded-lg p-3 border border-primary/10">
      <IconDownload class="w-4 h-4 text-primary" />
      <span>Certificat téléchargé <b class="text-BtW">{{ certificateDownloadCount }}</b> fois</span>
    </div>

    <!-- Multi-Version Generation History -->
    <MeDocsentryDetailGenerationHistory
      v-if="certificationMode === 'simple' && multiVersionGenerationCount !== undefined && multiVersionGenerationCount > 0"
      :generations="multiVersionGenerations || []" :count="multiVersionGenerationCount" />

    <!-- MultiVersion Generation Form -->
    <UiBaseCard v-if="certificationMode === 'simple' && canGenerateVersions">
      <h3 class="font-bold text-BtW mb-4 flex items-center gap-2">
        <IconFiles class="w-5 h-5 text-primary" />
        Multiversions
      </h3>
      <p v-if="hasVersions"
        class="text-[10px] text-warning font-bold leading-relaxed mb-4 uppercase tracking-widest border-l-2 border-warning pl-2">
        Une archive existe déjà. Générer de nouvelles versions écrasera le ZIP précédent.
      </p>
      <p v-else class="text-[10px] text-hsa font-medium leading-relaxed mb-4 uppercase tracking-widest">
        Générez des versions enfants personnalisées pour vos destinataires.
      </p>
      <MeDocsentryDetailMultiVersionForm :document-id="documentId" @update:loading="$emit('update:loading', $event)"
        @success="$emit('refresh-doc')" />
    </UiBaseCard>

    <!-- Sovereignty -->
    <UiBaseCard class="bg-primary/5 border-primary/20">
      <div class="flex items-center gap-3 mb-4">
        <div class="p-2 rounded bg-primary text-WtB">
          <IconFingerprint class="w-5 h-5" />
        </div>
        <h3 class="font-bold text-BtW">Souveraineté</h3>
      </div>
      <p class="text-sm text-hsa leading-relaxed">
        Ce document est certifié par l'infrastructure de confiance CYPASS, garantissant son origine et son intégrité
        immuable.
      </p>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import {
  IconShieldCheck, IconCertificate, IconShare, IconFingerprint,
  IconZip, IconFiles, IconDownload, IconArchive, IconRotate
} from '@tabler/icons-vue'
import { computed } from 'vue'
import { differenceInDays, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { MultiVersionGeneration } from '~/types/docsentry'

const props = defineProps<{
  documentId: string
  hasCertificate: boolean
  hasVersions: boolean
  createdAt: string
  isArchived: boolean
  loading?: boolean
  archivedAt?: string
  isZipDownloaded?: boolean
  certificateDownloadCount?: number
  certificationMode?: 'simple' | 'enrichie'
  multiVersionGenerations?: MultiVersionGeneration[]
  multiVersionGenerationCount?: number
}>()

defineEmits(['verify', 'download', 'share', 'download-zip', 'update:loading', 'refresh-doc', 'archive', 'unarchive'])

const canGenerateVersions = computed(() => {
  if (!props.createdAt) return false
  const now = new Date()
  const createdDate = parseISO(props.createdAt)
  return differenceInDays(now, createdDate) < 7
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
