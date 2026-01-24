<template>
  <div class="w-full max-w-md">
    <h2 class="text-2xl font-bold mb-2">Réinitialisation</h2>
    <p class="text-hsa mb-8">Définissez votre nouveau mot de passe.</p>

    <form @submit.prevent="handleReset" class="bg-WtB shadow-xl rounded-2xl p-8 border border-ash">
      <div v-if="!tokenValid" class="text-center py-4">
        <p class="text-danger mb-4">Lien de réinitialisation invalide ou expiré.</p>
        <NuxtLink to="/auth/login" class="text-primary hover:underline">
          Retour à la connexion
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium mb-1">Nouveau mot de passe</label>
          <div class="relative">
            <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
              placeholder="••••••••"
              class="w-full pl-12 pr-12 py-2 rounded-lg border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent bg-ash transition-shadow outline-none" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa hover:text-primary focus:outline-none">
              <IconEye v-if="showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <UtilsPasswordValidator v-if="password && password.length > 0" :password="password" class="mt-2" />
        </div>

        <div>
          <label for="confirm" class="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
          <div class="relative">
            <IconLockCheck class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="confirmPassword" id="confirm" :type="showConfirm ? 'text' : 'password'" required
              placeholder="••••••••"
              class="w-full pl-12 pr-12 py-2 rounded-lg border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent bg-ash transition-shadow outline-none" />
            <button type="button" @click="showConfirm = !showConfirm"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa hover:text-primary focus:outline-none">
              <IconEye v-if="showConfirm" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="confirmPassword && password !== confirmPassword"
            class="mt-1 text-xs text-danger flex items-center gap-1">
            <IconCircleX class="w-3 h-3" /> Les mots de passe ne correspondent pas
          </p>
        </div>

        <div class="mt-6">
          <UiBaseButton type="submit" block :loading="loading">
            Réinitialiser le mot de passe
          </UiBaseButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconLock, IconLockCheck, IconEye, IconEyeOff, IconCircleX } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const tokenValid = ref(true)

const isPasswordSecure = computed(() => {
  const p = password.value
  return (
    p.length >= 12 &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p)
  )
})

const token = route.query.token as string

onMounted(() => {
  if (!token) {
    tokenValid.value = false
    toastStore.showToast('error', 'Erreur', 'Token de réinitialisation manquant.')
  }
})

const handleReset = async () => {
  if (password.value !== confirmPassword.value) {
    toastStore.showToast('warning', 'Erreur', 'Les mots de passe ne correspondent pas.')
    return
  }

  if (!isPasswordSecure.value) {
    toastStore.showToast('warning', 'Sécurité', 'Le mot de passe ne respecte pas les critères de sécurité.')
    return
  }

  loading.value = true
  const success = await authStore.resetPassword({
    token,
    password: password.value,
    confirm: confirmPassword.value
  })

  if (success) {
    toastStore.showToast('success', 'Succès', authStore.message || 'Votre mot de passe a été réinitialisé.')
    setTimeout(() => navigateTo('/auth/login'), 2000)
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Échec de la réinitialisation.')
  }
  loading.value = false
}

useHead({
  title: 'Réinitialisation du mot de passe'
})
</script>
