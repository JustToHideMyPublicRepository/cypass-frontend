<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md text-center space-y-8">
      <div v-if="loading" class="space-y-6">
        <UiLogoLoader size="lg" class="mx-auto" />
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-BtW uppercase tracking-tight">Vérification en cours</h2>
          <p class="text-hsa font-medium">Nous vérifions votre accèss...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-WtB p-8 rounded-3xl border border-ash/50 shadow-2xl space-y-6">
        <div class="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
          <IconAlertCircle class="w-10 h-10" />
        </div>
        <div class="space-y-2">
          <h2 class="text-xl font-black text-BtW uppercase tracking-tight">Lien invalide</h2>
          <p class="text-hsa font-medium">{{ error }}</p>
        </div>
        <UiBaseButton class="w-full" @click="goToLogin">
          Retour à la connexion
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconAlertCircle } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(true)
const error = ref<string | null>(null)

const verify = async () => {
  const email = route.query.email as string
  const token = route.query.token as string

  if (!email || !token) {
    error.value = "Informations de connexion manquantes."
    loading.value = false
    return
  }

  const success = await authStore.verifyMagicLink(email, token)

  if (success) {
    toastStore.showToast('success', 'Connecté', 'Authentification par lien magique réussie.')
    navigateTo('/dashboard')
  } else {
    error.value = authStore.error || "Ce lien a expiré ou a déjà été utilisé."
    loading.value = false
  }
}

const goToLogin = () => {
  navigateTo('/auth/login')
}

onMounted(() => {
  verify()
})

useHead({
  title: 'Vérification du lien magique'
})
</script>
