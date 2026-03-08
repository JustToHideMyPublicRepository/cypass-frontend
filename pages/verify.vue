<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="max-w-3xl w-full space-y-8 md:space-y-12 text-center animate-fade-up">
      <RootVerifyHeader />

      <RootVerifyZone v-model:verifyMode="verifyMode" v-model:pdfSubMode="pdfSubMode" v-model:hashInput="hashInput"
        v-model:pdfFile="pdfFile" v-model:qrFile="qrFile" :loading="loading" :result="result" :error="error"
        :activeSteps="activeSteps" @verify-hash="handleVerifyHash" @verify-file="handleVerifyFile" @reset="reset" />

      <RootVerifyBenefits v-if="!result" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconServer, IconLock, IconCertificate } from '@tabler/icons-vue'
import { useVerify } from '~/composables/useVerify'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Vérifier un document',
  meta: [
    { name: 'description', content: 'Vérifiez instantanément l\'authenticité et l\'intégrité de vos documents signés numériquement par CYPASS.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

const route = useRoute()
const {
  verifyMode,
  pdfSubMode,
  hashInput,
  pdfFile,
  qrFile,
  loading,
  result,
  error,
  activeSteps,
  handleVerifyFile,
  handleVerifyHash,
  reset
} = useVerify()

onMounted(() => {
  const h = route.query.h as string
  if (h) {
    verifyMode.value = 'hash'
    hashInput.value = h
    // Small delay to let the UI settle
    setTimeout(() => {
      handleVerifyHash()
    }, 100)
  }
})

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
    icon: IconCertificate,
    title: 'Preuve Légale',
    desc: 'Validité juridique conforme aux normes de signature électronique.'
  }
]
</script>
