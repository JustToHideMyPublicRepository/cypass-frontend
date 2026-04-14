<template>
  <UiBaseModal :show="show" title="Vérifier un document" maxWidth="2xl" @close="close">
    <div class="max-h-[70vh] overflow-y-auto pr-2 no-scrollbar py-2">
      <RootVerifyZone v-model:verifyMode="verifyMode" v-model:pdfSubMode="pdfSubMode" v-model:hashInput="hashInput"
        v-model:pdfFile="pdfFile" v-model:qrFile="qrFile" :loading="loading" :result="vResult" :error="vError"
        :activeSteps="activeSteps" :is-modal="true" @reset="reset" />
    </div>

    <!-- Actions Footer -->
    <template #footer>
      <div v-if="!vResult" class="flex flex-col sm:flex-row gap-4 w-full">
        <UiBaseButton variant="ghost" class="flex-1 !rounded-2xl font-bold py-4 h-auto border-none" @click="close">
          Annuler</UiBaseButton>
        <UiBaseButton v-if="(verifyMode === 'file' || verifyMode === 'qr') && activeFile" variant="primary"
          class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading" @click="handleVerifyFile">
          Analyser le document
        </UiBaseButton>
        <UiBaseButton v-else-if="verifyMode === 'hash'" variant="primary"
          class="flex-1 !rounded-2xl font-black py-4 h-auto shadow-xl" :loading="loading" :disabled="!hashInput"
          @click="handleVerifyHash">
          Chercher le hash
        </UiBaseButton>
      </div>
      <div v-else class="w-full">
        <UiBaseButton variant="secondary" class="!rounded-2xl font-black py-4 h-auto" block @click="close">
          Fermer la console
        </UiBaseButton>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useVerify } from '~/composables/useVerify'

const props = defineProps<{
  show: boolean
  result?: any
}>()

const emit = defineEmits(['close', 'reset'])

const {
  verifyMode,
  pdfSubMode,
  hashInput,
  pdfFile,
  qrFile,
  loading,
  result: vResult,
  error: vError,
  activeSteps,
  activeFile,
  handleVerifyFile,
  handleVerifyHash,
  reset
} = useVerify()

// Sync props.result if provided
watch(() => props.result, (newVal) => {
  if (newVal) vResult.value = newVal
}, { immediate: true })

const close = () => {
  reset()
  emit('close')
}

// Ensure results are cleared when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) reset()
})
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
