<template>
  <div class="w-full max-w-md">
    <div class="bg-WtB shadow-xl rounded-2xl p-8 border border-ash space-y-5">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-2">Vérification de l'email</h2>
        <p v-if="authStore.loading" class="text-hsa mb-8">Nous vérifions votre compte...</p>
        <p v-else-if="success" class="text-hsa mb-8">Votre email a été vérifié. Vous pouvez maintenant vous connecter.
        </p>
        <p v-else class="text-hsa mb-8">Le lien de vérification est invalide ou a expiré.</p>
      </div>

      <div v-if="authStore.loading" class="flex flex-col items-center justify-center py-12">
        <IconLoader class="animate-spin h-12 w-12 text-primary" />
        <p class="mt-4">Veuillez patienter...</p>
      </div>

      <div v-else-if="success" class="text-center py-8">
        <div
          class="bg-success/10 text-success p-4 rounded-full mb-6 flex items-center justify-center mx-auto w-20 h-20">
          <IconCheck class="h-10 w-10" />
        </div>
        <h2 class="text-xl font-semibold mb-2">Succès !</h2>
        <p class="mb-8">{{ authStore.message || 'Votre compte a été activé avec succès.' }}</p>
        <UiBaseButton to="/auth/login" variant="primary">
          Se connecter
        </UiBaseButton>
      </div>

      <div v-else class="text-center py-8">
        <div class="bg-danger/10 text-danger p-4 rounded-full mb-6 flex items-center justify-center mx-auto w-20 h-20">
          <IconCircleX class="h-10 w-10" />
        </div>
        <h2 class="text-xl font-semibold mb-2">Erreur</h2>
        <p class="mb-4">{{ authStore.error || 'Le lien de vérification est invalide ou a expiré.' }}</p>

        <div class="space-y-4">
          <UiBaseButton @click="handleResend" :loading="resending" variant="primary" class="w-full">
            Renvoyer le lien de vérification
          </UiBaseButton>

          <UiBaseButton to="/auth/register" variant="secondary" class="w-full">
            Retour à l'inscription
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Resend Email Modal -->
    <ModalAuthMail :show="showResendModal" :loading="resending" :initial-email="emailToResend"
      @close="showResendModal = false" @submit="handleResendSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { IconCheck, IconLoader, IconCircleX } from '@tabler/icons-vue'

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

onMounted(async () => {
  const token = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token
  emailToResend.value = (Array.isArray(route.query.email) ? route.query.email[0] : route.query.email) || ''
  if (!token) {
    authStore.error = "Token de vérification manquant."
    toastStore.showToast('error', 'Erreur', authStore.error)
    return
  }

  const result = await authStore.verifyEmail(token)
  if (result) {
    success.value = true
    toastStore.showToast('success', 'Succès', authStore.message || 'Votre compte a été activé !')
  } else {
    toastStore.showToast('error', 'Échec de vérification', authStore.error || 'Le lien est invalide.')
  }
})

const handleResend = () => {
  if (!emailToResend.value) {
    showResendModal.value = true
  } else {
    handleResendSubmit(emailToResend.value)
  }
}

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
</script>
