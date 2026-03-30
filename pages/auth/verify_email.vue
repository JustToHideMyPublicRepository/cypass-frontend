<template>
  <div class="w-full max-w-md">
    <div class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50 overflow-hidden">
      <!-- En-tête de vérification -->
      <AuthVerifyHeader :status="status" />

      <!-- État : Chargement -->
      <AuthVerifyLoadingState v-if="status === 'loading'" />

      <!-- État : Succès -->
      <AuthVerifySuccessState v-else-if="status === 'success'" :message="authStore.message" />

      <!-- État : Erreur -->
      <AuthVerifyErrorState v-else :error="authStore.error" :resending="resending" @resend="handleResend" />
    </div>

    <!-- Modal Renvoyer l'email -->
    <ModalAuthMail :show="showResendModal" :loading="resending" :initial-email="emailToResend"
      @close="showResendModal = false" @submit="handleResendSubmit" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

// Utilisation du layout d'authentification
definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const success = ref(false)
const resending = ref(false)
const emailToResend = ref('')
const showResendModal = ref(false)

const status = computed(() => {
  if (authStore.loading) return 'loading'
  if (success.value) return 'success'
  return 'error'
})

onMounted(async () => {
  const token = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token
  emailToResend.value = (Array.isArray(route.query.email) ? route.query.email[0] : route.query.email) || ''

  if (!token) {
    authStore.error = "Token de vérification manquant."
    toastStore.showToast('error', 'Erreur', authStore.error)
    return
  }

  // Lancement de la vérification au montage du composant
  const result = await authStore.verifyEmail(token)
  if (result) {
    success.value = true
    toastStore.showToast('success', 'Succès', authStore.message || 'Votre compte a été activé !')
  } else {
    toastStore.showToast('error', 'Échec de vérification', authStore.error || 'Le lien est invalide.')
  }
})

// Déclenchement de la demande de renvoi d'email
const handleResend = () => {
  if (!emailToResend.value) {
    showResendModal.value = true
  } else {
    handleResendSubmit(emailToResend.value)
  }
}

// Soumission du formulaire de renvoi
const handleResendSubmit = async (email: string) => {
  resending.value = true
  const result = await authStore.resendVerification(email)

  if (result) {
    toastStore.showToast('success', 'Email envoyé', authStore.message || 'Un nouveau lien a été envoyé.')
    showResendModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Échec de l\'envoi.')
  }
  resending.value = false
}

// Métadonnées SEO
useHead({
  title: 'Vérification de l\'email',
  meta: [
    { name: 'description', content: 'Vérification de votre compte utilisateur sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
