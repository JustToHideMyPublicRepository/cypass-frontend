<template>
  <UiBaseModal :show="show" title="Vérifier un document" maxWidth="md" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Mode Switcher -->
      <div v-if="!result && !loading" class="flex justify-center">
        <div class="flex p-1 bg-ash rounded-xl border border-ash">
          <button @click="verifyMode = 'file'" class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            :class="verifyMode === 'file' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
            Fichier
          </button>
          <button @click="verifyMode = 'hash'" class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all"
            :class="verifyMode === 'hash' ? 'bg-WtB text-primary shadow-sm' : 'text-hsa hover:text-BtW'">
            Hash
          </button>
        </div>
      </div>

      <!-- File Zone -->
      <div v-if="!file && verifyMode === 'file' && !result"
        class="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group bg-primary/5"
        @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleDrop">
        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
        <div
          class="w-16 h-16 bg-WtB rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary shadow-sm border border-ash group-hover:scale-110 transition-transform">
          <IconRosetteDiscountCheck class="w-8 h-8" />
        </div>
        <p class="font-bold text-BtW text-sm">Vérifier par fichier PDF</p>
        <p class="text-[10px] text-hsa mt-1 uppercase tracking-widest">Glissez un document signé ici</p>
      </div>

      <!-- Hash Zone -->
      <div v-else-if="verifyMode === 'hash' && !result" class="space-y-3 py-4">
        <label class="text-[10px] font-black text-hsa uppercase tracking-widest px-1">Code SHA-256</label>
        <div class="relative">
          <IconHash class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa" />
          <input v-model="hashInput" type="text"
            class="w-full pl-10 pr-4 py-3 rounded-xl bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none transition-all font-mono text-xs"
            placeholder="Entrez le hash du document...">
        </div>
      </div>

      <div v-if="(file || result) && verifyMode === 'file' || result" class="space-y-6">
        <!-- Selected File Header -->
        <div v-if="file && !result" class="bg-ash/20 rounded-2xl p-4 border border-ash">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <IconFileText class="w-6 h-6" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-BtW truncate">{{ file.name }}</p>
              <p class="text-xs text-hsa">Prêt pour vérification</p>
            </div>
            <button @click="handleReset" class="text-hsa hover:text-danger p-2 transition-colors">
              <IconX class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Result View -->
        <div v-if="result" class="animate-fade-up">
          <div v-if="result.verified"
            class="p-5 rounded-2xl bg-success/5 border border-success/20 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10">
              <IconRosetteDiscountCheck class="w-16 h-16 text-success" />
            </div>

            <div class="flex items-center gap-3 text-success mb-4 relative z-10">
              <IconRosetteDiscountCheck class="w-6 h-6" />
              <span class="font-black text-sm uppercase">AUTHENTICITÉ CONFIRMÉE</span>
            </div>

            <div class="space-y-4 text-[11px] leading-relaxed relative z-10">
              <p class="text-hsa">Émis par : <strong class="text-BtW">{{ result.document?.signer || 'CYPASS Network'
              }}</strong></p>

              <div class="grid grid-cols-2 gap-3 pt-2 border-t border-success/10">
                <div v-if="result.document?.id" class="space-y-1">
                  <p class="text-[9px] text-hsa uppercase font-bold">Identifiant</p>
                  <p class="font-mono text-BtW bg-ash/50 p-1 rounded">{{ result.document.id }}</p>
                </div>
                <div v-if="result.document?.created_at" class="space-y-1">
                  <p class="text-[9px] text-hsa uppercase font-bold">Date Émission</p>
                  <p class="text-BtW font-bold">{{ formatDate(result.document.created_at) }}</p>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between items-center group/hash px-1">
                  <p class="text-[9px] text-hsa uppercase font-bold">Empreinte SHA-256</p>
                  <button v-if="result.document?.hash || result.doc_hash"
                    @click="copy(result.document?.hash || result.doc_hash)"
                    class="text-primary hover:underline font-bold flex items-center gap-1">
                    <IconCopy v-if="!copied" class="w-3 h-3" />
                    <IconCheck v-else class="w-3 h-3 text-success" />
                    Copier
                  </button>
                </div>
                <div class="p-2 bg-WtB/50 rounded-lg border border-ash/50 font-mono text-[10px] break-all text-hsa">
                  {{ result.document?.hash || result.doc_hash || 'Hash indisponible' }}
                </div>
              </div>

              <!-- Signature Summary -->
              <div v-if="result.signature_info" class="mt-4 p-3 bg-WtB/30 rounded-xl border border-ash/30">
                <div class="flex justify-between mb-2">
                  <span class="text-hsa text-[9px] uppercase font-bold">Vérification Signature</span>
                  <span class="text-success font-black text-[9px] uppercase">Ed25519 OK ✓</span>
                </div>
                <div class="space-y-1">
                  <p class="text-hsa">Algorithme : <span class="text-BtW uppercase font-bold">{{
                    result.signature_info.algorithm }}</span></p>
                  <p class="text-hsa">Empreinte Clé : <span class="font-mono text-BtW select-all">{{
                    result.signature_info.key_fingerprint || 'N/A' }}</span></p>
                  <p class="text-hsa">Signé à : <span class="text-BtW font-bold">{{
                    formatDate(result.signature_info.signed_at) }}</span></p>
                </div>
              </div>

              <div class="pt-2 text-center">
                <button @click="handleReset"
                  class="text-primary text-[10px] font-black uppercase hover:underline">Nouvelle vérification</button>
              </div>
            </div>
          </div>

          <div v-else class="p-5 rounded-2xl bg-danger/5 border border-danger/20">
            <div class="flex items-center gap-3 text-danger mb-2">
              <IconShieldOff class="w-6 h-6" />
              <span class="font-black">ÉCHEC DE VÉRIFICATION</span>
            </div>
            <p class="text-xs text-hsa leading-relaxed">Le document n'est pas certifié ou a été modifié.</p>
            <div v-if="error" class="mt-3 p-2 bg-danger/10 rounded-lg text-[10px] font-mono text-danger">{{ error }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="error && !result" class="p-4 rounded-2xl bg-danger/5 border border-danger/20 text-danger text-sm">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div v-if="!result" class="flex gap-3 w-full">
        <UiBaseButton variant="secondary" block @click="close">Annuler</UiBaseButton>
        <UiBaseButton v-if="verifyMode === 'file' && file" variant="primary" block :loading="loading"
          @click="handleVerify">
          Analyser le document
        </UiBaseButton>
        <UiBaseButton v-else-if="verifyMode === 'hash'" variant="primary" block :loading="loading"
          :disabled="!hashInput" @click="handleVerifyInternalHash">
          Chercher le hash
        </UiBaseButton>
      </div>
      <div v-else class="w-full">
        <UiBaseButton variant="secondary" block @click="close">Fermer</UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IconSearch, IconFileText, IconShieldOff, IconX, IconHash,
  IconCopy, IconCheck, IconRosetteDiscountCheck
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'

const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  result: any
}>()

const emit = defineEmits(['close', 'verify', 'reset'])

const store = useDocumentsStore()
const verifyMode = ref<'file' | 'hash'>('file')
const hashInput = ref('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)

const triggerFileSelect = () => fileInput.value?.click()

const handleReset = () => {
  file.value = null
  hashInput.value = ''
  emit('reset')
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files.length) {
    file.value = e.dataTransfer.files[0]
  }
}

const handleVerify = () => {
  if (file.value) {
    emit('verify', file.value)
  }
}

const handleVerifyInternalHash = async () => {
  if (!hashInput.value) return
  await store.verifyDocumentByHash(hashInput.value)
}

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const close = () => {
  file.value = null
  hashInput.value = ''
  emit('close')
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
