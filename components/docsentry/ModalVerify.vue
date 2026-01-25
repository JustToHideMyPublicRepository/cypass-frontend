<template>
  <UiBaseModal :show="show" title="Vérifier un document" maxWidth="md" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <div v-if="!file"
        class="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer group bg-primary/5"
        @click="triggerFileSelect" @dragover.prevent @drop.prevent="handleDrop">
        <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
        <div
          class="w-16 h-16 bg-WtB rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary shadow-sm border border-ash group-hover:scale-110 transition-transform">
          <IconSearch class="w-8 h-8" />
        </div>
        <p class="font-bold text-BtW">Vérifier l'authenticité</p>
        <p class="text-xs text-hsa mt-1">Glissez le PDF déjà signé ici</p>
      </div>

      <div v-else class="bg-ash/20 rounded-2xl p-4 border border-ash">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <IconFileText class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-BtW truncate">{{ file.name }}</p>
            <p class="text-xs text-hsa">Prêt pour vérification</p>
          </div>
          <button @click="handleReset" class="text-hsa hover:text-danger p-2">
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
            <span class="font-black">DOCUMENT VÉRIFIÉ !</span>
          </div>
          <div class="space-y-3 text-xs leading-relaxed relative z-10">
            <p class="text-hsa">Ce document est authentique et a été émis par <strong>
                {{ result.document?.signer || 'CYPASS' }}
              </strong>.</p>
            <div class="grid grid-cols-2 gap-4 pt-2 border-t border-success/10">
              <div v-if="result.document?.id">
                <p class="text-[10px] text-hsa uppercase">ID Document</p>
                <p class="font-mono text-BtW">{{ result.document.id }}</p>
              </div>
              <div v-if="result.document?.created_at">
                <p class="text-[10px] text-hsa uppercase">Date Signature</p>
                <p class="text-BtW">{{ formatDate(result.document.created_at) }}</p>
              </div>
            </div>
            <div v-if="result.document?.hash"
              class="mt-2 p-2 bg-WtB rounded border border-ash/50 font-mono text-[9px] break-all text-hsa">
              Hash: {{ result.document.hash }}
            </div>
            <p v-else class="mt-2 text-[10px] italic text-success">{{ result.message }}</p>
          </div>
        </div>

        <div v-else class="p-5 rounded-2xl bg-danger/5 border border-danger/20">
          <div class="flex items-center gap-3 text-danger mb-2">
            <IconShieldOff class="w-6 h-6" />
            <span class="font-black">SIGNATURE INVALIDE</span>
          </div>
          <p class="text-xs text-hsa">Le document a été modifié ou n'a pas été émis par CYPASS.</p>
        </div>
      </div>

      <div v-if="error" class="p-4 rounded-2xl bg-danger/5 border border-danger/20 text-danger text-sm">
        {{ error }}
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <UiBaseButton variant="secondary" block @click="close">Fermer</UiBaseButton>
        <UiBaseButton v-if="file && !result" variant="primary" block :loading="loading" @click="handleVerify">
          Vérifier maintenant
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch, IconFileText, IconShieldCheck, IconShieldOff, IconX } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  show: boolean
  loading: boolean
  error: string | null
  result: any
}>()

const emit = defineEmits(['close', 'verify', 'reset'])

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileSelect = () => fileInput.value?.click()

const handleReset = () => {
  file.value = null
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

const close = () => {
  file.value = null
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
