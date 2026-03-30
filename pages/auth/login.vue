<template>
  <div class="w-full max-w-md">
    <AuthLoginHeader />
    <AuthLoginForm @forgot-password="showForgotModal = true" />

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

const showForgotModal = ref(false)
const forgotLoading = ref(false)

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
