<template>
  <div class="w-full max-w-md">
    <div class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50 overflow-hidden">
      <!-- En-tête de vérification -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-black text-BtW uppercase tracking-tight mb-2">Vérification de l'email</h2>
        <p v-if="authStore.loading" class="text-hsa font-medium">Nous vérifions votre compte...</p>
        <p v-else-if="success" class="text-hsa font-medium">Votre email a été vérifié avec succès.</p>
        <p v-else class="text-hsa font-medium">Le lien de vérification est invalide ou a expiré.</p>
      </div>

      <!-- État : Chargement -->
      <div v-if="authStore.loading" class="flex flex-col items-center justify-center py-12">
        <div class="relative">
          <IconLoader class="animate-spin h-16 w-16 text-primary" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
        <p class="mt-6 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Veuillez patienter...
        </p>
      </div>

      <!-- État : Succès -->
      <div v-else-if="success" class="text-center py-6 animate-fade-up">
        <div
          class="bg-success/10 text-success p-6 rounded-3xl mb-6 flex items-center justify-center mx-auto w-24 h-24 shadow-inner">
          <IconCheck class="h-12 w-12" />
        </div>
        <h2 class="text-xl font-black text-BtW mb-2 uppercase">Félicitations !</h2>
        <p class="mb-8 text-hsa leading-relaxed">{{ authStore.message || 'Votre compte a été activé avec succès.' }}</p>
        <UiBaseButton to="/auth/login" variant="primary" block size="lg" class="shadow-lg shadow-primary/20">
          Se connecter
        </UiBaseButton>
      </div>

      <!-- État : Erreur -->
      <div v-else class="text-center py-6 animate-fade-up">
        <div
          class="bg-danger/10 text-danger p-6 rounded-3xl mb-6 flex items-center justify-center mx-auto w-24 h-24 shadow-inner">
          <IconCircleX class="h-12 w-12" />
        </div>
        <h2 class="text-xl font-black text-BtW mb-2 uppercase">Échec</h2>
        <p class="mb-8 text-hsa leading-relaxed">
          {{ authStore.error || 'Le lien de vérification est invalide ou a expiré.' }}
        </p>

        <div class="space-y-4">
          <UiBaseButton @click="handleResend" :loading="resending" variant="primary" block class="shadow-md">
            Renvoyer le lien
          </UiBaseButton>

          <UiBaseButton to="/auth/register" variant="ghost" size="sm"
            class="!text-slate-400 hover:!text-primary uppercase tracking-widest font-black !text-[10px]">
            Retour à l'inscription
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Modal Renvoyer l'email -->
    <ModalAuthMail :show="showResendModal" :loading="resending" :initial-email="emailToResend"
      @close="showResendModal = false" @submit="handleResendSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { IconCheck, IconLoader, IconCircleX } from '@tabler/icons-vue'

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
  title: 'Vérification de l\'email'
})
</script>
