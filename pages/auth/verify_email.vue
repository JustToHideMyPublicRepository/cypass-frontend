<template>
  <div class="w-full max-w-md">
    <div class="bg-WtB shadow-xl rounded-2xl p-8 border border-ash space-y-5">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-2">Vérification de l'email</h2>
        <p class="text-hsa mb-8">Nous vérifions votre compte...</p>
      </div>

      <div v-if="authStore.loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p class="mt-4">Veuillez patienter...</p>
      </div>

      <div v-else-if="success" class="text-center py-8">
        <div class="bg-success/10 text-success p-4 rounded-xl mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Succès !</h2>
        <p class="mb-8">{{ authStore.message || 'Votre compte a été activé avec succès.' }}</p>
        <UiBaseButton to="/auth/login" variant="primary">
          Se connecter
        </UiBaseButton>
      </div>

      <div v-else class="text-center py-8">
        <div class="bg-danger/10 text-danger p-4 rounded-xl mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Erreur</h2>
        <p class="mb-8">{{ authStore.error || 'Le lien de vérification est invalide ou a expiré.' }}</p>
        <UiBaseButton to="/auth/register" variant="secondary">
          Retour à l'inscription
        </UiBaseButton>
      </div>
    </div>

    <UiAppToast v-model="toast.show" :type="toast.type" :title="toast.title" :message="toast.message" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const success = ref(false)

const toast = reactive({
  show: false,
  type: 'info' as any,
  title: '',
  message: ''
})

const showToast = (type: string, title: string, message: string) => {
  toast.type = type
  toast.title = title
  toast.message = message
  toast.show = true
}

onMounted(async () => {
  const token = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token
  if (!token) {
    authStore.error = "Token de vérification manquant."
    showToast('error', 'Erreur', authStore.error)
    return
  }

  const result = await authStore.verifyEmail(token)
  if (result) {
    success.value = true
    showToast('success', 'Succès', authStore.message || 'Votre compte a été activé !')
  } else {
    showToast('error', 'Échec de vérification', authStore.error || 'Le lien est invalide.')
  }
})
</script>
