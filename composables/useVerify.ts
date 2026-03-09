import { ref, watch, computed } from 'vue'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { verifySteps, type Step } from '~/utils/docsentry'

export const useVerify = () => {
  const store = usePublicDocsentryStore()

  const verifyMode = ref<'file' | 'hash' | 'qr'>('file')
  const pdfSubMode = ref<'original' | 'certificate'>('original')
  const hashInput = ref('')
  const pdfFile = ref<File | null>(null)
  const qrFile = ref<File | null>(null)
  const loading = ref(false)
  const result = ref<any>(null)
  const error = ref<string | null>(null)
  const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(verifySteps)))

  const activeFile = computed(() => {
    if (verifyMode.value === 'file') return pdfFile.value
    if (verifyMode.value === 'qr') return qrFile.value
    return null
  })

  const resetSteps = () => {
    activeSteps.value = JSON.parse(JSON.stringify(verifySteps))
  }

  const runSteps = async () => {
    for (let i = 0; i < activeSteps.value.length; i++) {
      activeSteps.value[i].status = 'loading'
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300))
      activeSteps.value[i].status = 'completed'
    }
  }

  const handleVerifyFile = async () => {
    const currentFile = activeFile.value
    if (!currentFile) return

    loading.value = true
    error.value = null
    resetSteps()

    try {
      let successPromise: Promise<boolean>

      if (verifyMode.value === 'qr') {
        successPromise = store.verifyDocumentByQR(currentFile)
      } else {
        if (pdfSubMode.value === 'original') {
          successPromise = store.verifyDocumentFull(currentFile, null)
        } else {
          successPromise = store.verifyDocumentFull(null, currentFile)
        }
      }

      await runSteps()
      const success = await successPromise

      if (success) {
        result.value = store.verificationResult
      } else {
        error.value = store.error
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur de vérification'
    } finally {
      loading.value = false
    }
  }

  const handleVerifyHash = async () => {
    if (!hashInput.value) return
    loading.value = true
    error.value = null
    resetSteps()

    try {
      const successPromise = store.verifyDocumentByHash(hashInput.value)
      await runSteps()
      const success = await successPromise

      if (success) {
        result.value = store.verificationResult
      } else {
        error.value = store.error
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur de vérification'
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    pdfFile.value = null
    qrFile.value = null
    hashInput.value = ''
    result.value = null
    error.value = null
    resetSteps()
    store.error = null
    store.verificationResult = null
  }

  // Watchers to clear results when inputs change
  watch([pdfFile, qrFile, verifyMode, hashInput], () => {
    if (loading.value) return
    result.value = null
    error.value = null
    resetSteps()
  })

  return {
    verifyMode,
    pdfSubMode,
    hashInput,
    pdfFile,
    qrFile,
    loading,
    result,
    error,
    activeSteps,
    activeFile,
    handleVerifyFile,
    handleVerifyHash,
    reset
  }
}
