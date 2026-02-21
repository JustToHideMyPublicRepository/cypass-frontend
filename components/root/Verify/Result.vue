<template>
  <div class="animate-fade-up text-left">
    <!-- Succès -->
    <div v-if="result.verified"
      class="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-success/5 border border-success/20 overflow-hidden relative">
      <div class="absolute top-0 right-0 p-8 opacity-10">
        <IconRosetteDiscountCheck class="w-24 h-24 md:w-32 md:h-32 text-success" />
      </div>

      <div class="flex items-center gap-2 md:gap-3 text-success mb-4 md:mb-6 relative z-10">
        <IconRosetteDiscountCheck class="w-6 h-6 md:w-8 md:h-8" />
        <span class="text-xl md:text-2xl font-black italic">DOCUMENT AUTHENTIQUE</span>
      </div>

      <div class="space-y-6 relative z-10">
        <div v-if="result.document?.filename" class="p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-6">
          <p class="text-[10px] text-hsa uppercase font-black tracking-widest mb-1">Document Certifié</p>
          <p class="text-xl font-black text-BtW truncate">{{ result.document.filename }}</p>
        </div>
        <p class="text-BtW text-lg leading-relaxed">
          Confirmation d'authenticité pour ce document.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
            <p class="text-[10px] text-hsa uppercase font-black">Émetteur du Document</p>
            <p class="font-bold text-BtW">{{ result.document?.signer || 'CYPASS' }}</p>
          </div>
          <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
            <p class="text-[10px] text-hsa uppercase font-black">Type / Format</p>
            <p class="font-bold text-BtW uppercase">{{ result.document?.file_type || 'PDF' }} (Certifié)</p>
          </div>
          <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
            <p class="text-[10px] text-hsa uppercase font-black">Date d'Exécution</p>
            <p class="font-bold text-BtW">{{ formatDate(result.document?.created_at || result.verification_time) }}</p>
          </div>
          <div class="p-4 bg-WtB/50 rounded-2xl border border-ash/50 space-y-1">
            <p class="text-[10px] text-hsa uppercase font-black">Identifiant (ID)</p>
            <p class="font-code text-xs text-BtW">{{ result.document?.id || result.id || 'N/A' }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-[10px] text-hsa uppercase font-black tracking-widest px-1">Empreinte Numérique (SHA-256)</p>
          <div
            class="p-3 bg-ash/30 rounded-xl border border-ash/50 font-code text-[10px] text-hsa break-all opacity-80 select-none">
            {{ truncateHash(result.document?.hash || result.doc_hash || result.calculated_hash || 'Invalide') }}
          </div>
        </div>

        <!-- Signature Details -->
        <RootVerifySignatureDetails :signatureInfo="result.signature_info" />

        <div v-if="result.verified" class="space-y-4">
          <UiBaseButton variant="primary" block size="lg" @click="downloadCertificate">
            <IconDownload class="w-5 h-5 mr-2" /> Télécharger le Certificat CYPASS
          </UiBaseButton>

          <div class="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs italic">
            <div class="flex items-center gap-2 text-success font-black uppercase">
              <IconRosetteDiscountCheck class="w-4 h-4" />
              Vérifié le {{ formatDate(result.verification_time) }}
            </div>
            <UiBaseButton @click="$emit('reset')" variant="ghost"
              class="!text-primary !font-bold hover:!underline !p-0 !min-h-0 !h-auto !bg-transparent hover:!bg-transparent">
              Nouvelle vérification
            </UiBaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Echec -->
    <div v-else class="p-8 rounded-3xl bg-danger/5 border border-danger/20">
      <div class="flex items-center gap-3 text-danger mb-4">
        <IconShieldOff class="w-8 h-8" />
        <span class="text-xl font-black">ÉCHEC DE LA VÉRIFICATION</span>
      </div>
      <p class="text-hsa leading-relaxed mb-6">
        Attention, ce document n'a pas été trouvé dans la base de données CYPASS. <br>
        <strong>Causes possibles :</strong> modification du contenu, altération des métadonnées ou certificat non émis
        par CYPASS.
      </p>
      <div v-if="error || result.error || result.message"
        class="mb-4 p-4 bg-danger/10 rounded-xl text-xs text-danger font-code border border-danger/20">
        <p v-if="result.mode" class="mb-2 opacity-60 uppercase font-black tracking-tighter">[ MODE: {{ result.mode }} ]
        </p>
        <p class="font-bold mb-1">{{ error || result.error || result.message }}</p>
        <p v-if="result.details" class="opacity-80">{{ result.details }}</p>
      </div>
      <UiBaseButton variant="danger" block @click="$emit('reset')">Réessayer</UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRosetteDiscountCheck, IconLock, IconShieldOff, IconDownload } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useToastStore } from '~/stores/toast'

const props = defineProps<{
  result: any
  error: string | null
}>()

defineEmits(['reset'])

const toast = useToastStore()

const downloadCertificate = async () => {
  const id = props.result.document?.id || props.result.id
  const filename = props.result.document?.filename || 'document'

  if (!id) {
    toast.showToast('error', 'Erreur', 'Identifiant du document manquant.')
    return
  }

  try {
    const response = await $fetch('/api/documents/download', {
      query: { id, type: 'certificate' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(response as Blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Certificat_${filename}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    toast.showToast('error', 'Erreur', 'Impossible de télécharger le certificat.')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}

const truncateHash = (hash: string) => {
  if (!hash) return ''
  if (hash.length <= 24) return hash
  return hash.substring(0, 12) + '...' + hash.substring(hash.length - 12)
}
</script>
