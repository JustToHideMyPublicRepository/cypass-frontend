<template>
  <div class="animate-fade-up text-left">
    <div v-if="result.verified"
      class="p-6 md:p-8 rounded-3xl bg-success/5 border border-success/20 overflow-hidden relative">
      <div class="absolute top-0 right-0 p-8 opacity-10">
        <IconRosetteDiscountCheck class="w-32 h-32 text-success" />
      </div>

      <div class="flex items-center gap-3 text-success mb-6 relative z-10">
        <IconRosetteDiscountCheck class="w-8 h-8" />
        <span class="text-2xl font-black italic">DOCUMENT AUTHENTIQUE</span>
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
            <p class="font-bold text-BtW">{{ result.document?.signer || 'CYPASS Network' }}</p>
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
            <p class="font-mono text-xs text-BtW">{{ result.document?.id || 'N/A' }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-[10px] text-hsa uppercase font-black tracking-widest px-1">Empreinte Numérique (SHA-256)</p>
          <div
            class="p-3 bg-ash/30 rounded-xl border border-ash/50 font-mono text-[10px] text-hsa break-all opacity-80 select-none">
            {{ truncateHash(result.document?.hash || result.doc_hash || '') }}
          </div>
        </div>

        <!-- Signature Details -->
        <div v-if="result.signature_info" class="p-5 bg-ash/5 rounded-2xl border border-ash/50 space-y-4">
          <h4 class="text-xs font-bold text-BtW flex items-center gap-2">
            <IconLock class="w-4 h-4 text-primary" /> Détails Techniques de la Signature
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-[11px]">
            <div class="flex justify-between md:block">
              <span class="text-hsa">Algorithme</span>
              <p class="font-bold text-BtW">{{ result.signature_info.algorithm || 'Ed25519' }}</p>
            </div>
            <div class="flex justify-between md:block">
              <span class="text-hsa">Statut de la Clé</span>
              <p class="font-bold" :class="result.signature_info.key_match ? 'text-success' : 'text-danger'">
                {{ result.signature_info.key_match ? 'Clé Correspondante ✓' : 'Conflit de Clé ✗' }}
              </p>
            </div>
            <div class="md:col-span-2">
              <span class="text-hsa">Empreinte de la Clé publique</span>
              <p class="font-mono text-[10px] text-BtW truncate">
                {{ result.signature_info.key_fingerprint || 'N/A' }}
              </p>
            </div>
            <div class="md:col-span-2">
              <span class="text-hsa">Date de Signature</span>
              <p class="font-bold text-BtW">{{ formatDate(result.signature_info.signed_at) }}</p>
            </div>
          </div>
        </div>

        <div v-if="result.verified" class="space-y-4">
          <UiBaseButton variant="primary" block size="lg" @click="downloadCertificate">
            <IconDownload class="w-5 h-5 mr-2" /> Télécharger le Certificat CYPASS
          </UiBaseButton>

          <div class="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs italic">
            <div class="flex items-center gap-2 text-success font-black uppercase">
              <IconRosetteDiscountCheck class="w-4 h-4" />
              Vérifié le {{ formatDate(result.verification_time) }}
            </div>
            <button @click="$emit('reset')" class="text-primary font-bold hover:underline">Nouvelle
              vérification</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-8 rounded-3xl bg-danger/5 border border-danger/20">
      <div class="flex items-center gap-3 text-danger mb-4">
        <IconShieldOff class="w-8 h-8" />
        <span class="text-xl font-black">ÉCHEC DE LA VÉRIFICATION</span>
      </div>
      <p class="text-hsa leading-relaxed mb-6">
        Attention, ce document ne peut pas être authentifié. <br>
        Causes possibles : modification du contenu, altération des métadonnées ou document non émis par CYPASS.
      </p>
      <div v-if="error" class="mb-6 p-4 bg-danger/10 rounded-xl text-xs text-danger font-mono">{{ error }}</div>
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
