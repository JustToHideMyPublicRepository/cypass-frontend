<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <!-- Background Decor -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]">
      </div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="max-w-3xl w-full space-y-12 text-center animate-fade-up">
      <IndVerifyHeader />

      <IndVerifyZone v-model:verifyMode="verifyMode" v-model:hashInput="hashInput" :file="file" :loading="loading"
        :result="result" :error="error" :activeSteps="activeSteps" @trigger-file="triggerFileSelect"
        @verify-hash="handleVerifyHash" @verify-file="handleVerifyFile" @reset="reset" />

      <IndVerifyBenefits v-if="!result" />

      <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileChange">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconServer, IconLock, IconCertificate } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDocumentsStore } from '~/stores/documents'
import { verifySteps, type Step } from '~/utils/docsentry'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Vérifier un document | CYPASS'
})

const store = useDocumentsStore()
const verifyMode = ref<'file' | 'hash'>('file')
const hashInput = ref('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)
const copied = ref(false)
const activeSteps = ref<Step[]>(JSON.parse(JSON.stringify(verifySteps)))

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

const triggerFileSelect = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
    result.value = null
    error.value = null
  }
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files.length) {
    file.value = e.dataTransfer.files[0]
    result.value = null
    error.value = null
  }
}

const handleVerifyFile = async () => {
  if (!file.value) return
  loading.value = true
  error.value = null
  resetSteps()

  try {
    const successPromise = store.verifyDocument(file.value)
    await runSteps()
    const success = await successPromise

    if (success) {
      result.value = store.verificationResult
    } else {
      error.value = store.error
    }
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
  } finally {
    loading.value = false
  }
}

const reset = () => {
  file.value = null
  hashInput.value = ''
  result.value = null
  error.value = null
  resetSteps()
  store.error = null
  store.verificationResult = null
}

const truncateHash = (hash: string) => {
  if (!hash) return ''
  if (hash.length <= 24) return hash
  return hash.substring(0, 12) + '...' + hash.substring(hash.length - 12)
}

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P p', { locale: fr })
  } catch (e) {
    return dateStr
  }
}

const publicBenefits = [
  {
    icon: IconLock,
    title: 'Confidentialité',
    desc: 'Le document est analysé puis immédiatement supprimé de nos serveurs.'
  },
  {
    icon: IconServer,
    title: 'Infrastructures d\'État',
    desc: 'Vérification effectuée sur les serveurs souverains du Bénin.'
  },
  {
    icon:
      IconCertificate,
    title: 'Preuve Légale',
    desc: 'Validité juridique conforme aux normes de signature électronique.'
  }
]
</script>
