<template>
  <div class="w-full max-w-md">
    <AuthLoginHeader :title="selectedHint ? 'Bon retour !' : (showHints ? 'Choisissez un compte' : 'Connexion')"
      :subtitle="selectedHint ? `Connectez-vous à votre compte ${selectedHint.name}` : (showHints ? 'Utilisez un compte enregistré pour vous connecter plus rapidement' : 'Entrez vos identifiants pour accéder à votre espace sécurisé')" />

    <div v-if="showHints && !selectedHint">
      <AuthLoginHints :hints="authStore.hints" :loading="hintLoading" @select="handleSelectHint" @remove="handleRemoveHint"
        @clear-all="handleClearAll" @use-another="handleUseAnother" />
    </div>

    <template v-else>
      <AuthLoginForm :prefilled-email="selectedHint?.email_hash ? '' : ''" :hint="selectedHint"
        @forgot-password="showForgotModal = true" @back="handleBack" />
    </template>

    <!-- Modal Mot de passe oublié -->
    <ModalAuthPassword :show="showForgotModal" :loading="forgotLoading" @close="showForgotModal = false"
      @submit="handleForgot" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const toastStore = useToastStore()

const showHints = ref(false)
const selectedHint = ref<any>(null)
const showForgotModal = ref(false)
const forgotLoading = ref(false)
const hintLoading = ref(false)

const handleSelectHint = (hint: any) => {
  selectedHint.value = hint
}

const handleRemoveHint = async (id: string) => {
  hintLoading.value = true
  const success = await authStore.removeHint(id)
  if (success && authStore.hints.length === 0) {
    showHints.value = false
    handleUseAnother()
  }
  hintLoading.value = false
}

const handleClearAll = async () => {
  hintLoading.value = true
  await authStore.clearAllHints()
  showHints.value = false
  handleUseAnother()
  hintLoading.value = false
}

const handleUseAnother = () => {
  showHints.value = false
  selectedHint.value = null
  // Nettoyer l'URL
  navigateTo({ path: '/auth/login', query: {} }, { replace: true })
}

const handleBack = () => {
  selectedHint.value = null
  showHints.value = authStore.hints.length > 0
  if (!showHints.value) {
    handleUseAnother()
  }
}

onMounted(async () => {
  if (authStore.hints.length === 0) {
    await authStore.fetchHints()
  }

  const hintId = useRoute().query.hint as string
  if (hintId === '0') {
    showHints.value = false
    selectedHint.value = null
  } else if (hintId) {
    const hint = authStore.hints.find(h => h.id === hintId)
    if (hint) {
      selectedHint.value = hint
    }
  }

  if (authStore.hints.length > 0 && hintId !== '0') {
    showHints.value = true
  }
})

// Gestion de l'oubli de mot de passe
const handleForgot = async (forgotEmail: string) => {
  forgotLoading.value = true
  const success = await authStore.forgotPassword(forgotEmail)

  if (success) {
    toastStore.showToast('success', 'Email envoyé', authStore.message || 'Vérifiez votre boîte de réception.')
    showForgotModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || "Impossible d'envoyer l'email.")
  }
  forgotLoading.value = false
}

// Métadonnées SEO
useHead({
  title: 'Connexion',
  meta: [
    { name: 'description', content: 'Connectez-vous à votre espace sécurisé CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
