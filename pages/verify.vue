<template>
  <div class="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="max-w-3xl w-full space-y-8 md:space-y-12 text-center animate-fade-up">
      <RootVerifyHeader />

      <RootVerifyZone v-model:verifyMode="verifyMode" v-model:pdfSubMode="pdfSubMode" v-model:hashInput="hashInput"
        v-model:pdfFile="pdfFile" v-model:qrFile="qrFile" :loading="loading" :result="result" :error="error"
        :activeSteps="activeSteps" @verify-hash="handleVerifyHash" @verify-file="handleVerifyFile" @reset="reset" />

      <RootVerifyBenefits v-if="!result" @open-enrich="modals.enrich = true" />
    </div>

    <!-- Modals -->
    <modalDocsentryInfoEnrich :show="modals.enrich" @close="modals.enrich = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useVerify } from '~/composables/useVerify'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'

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
const publicStore = usePublicDocsentryStore()

const modals = reactive({
  enrich: false
})

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
  publicStore.fetchEnrichmentCategories()
})
</script>
