<template>
  <div class="space-y-8 py-4">
    <div class="flex flex-col items-center text-center">
      <div class="p-4 bg-primary/10 rounded-3xl mb-6 text-primary animate-pulse">
        <IconPasswordFingerprint class="w-12 h-12" />
      </div>
      
      <h3 class="text-lg font-bold text-BtW mb-2">Authentification par Passkey</h3>
      <p class="text-sm text-hsa max-w-xs mx-auto">
        Utilisez votre empreinte digitale, reconnaissance faciale ou le code de votre appareil pour vous connecter.
      </p>
    </div>

    <!-- Actions -->
    <div class="space-y-4">
      <UiBaseButton
        @click="handlePasskeyLogin"
        :loading="loading"
        variant="primary"
        class="w-full h-14 !rounded-2xl shadow-lg shadow-primary/20"
      >
        <IconFingerprint class="w-5 h-5 mr-2" />
        Vérifier mon identité
      </UiBaseButton>

      <div class="text-center">
        <button
          @click="resetSelection"
          class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors"
        >
          Essayer une autre méthode
        </button>
      </div>
    </div>

    <!-- Error message fallback if WebAuthn fails -->
    <div v-if="error" class="p-4 rounded-xl bg-danger/5 border border-danger/20 flex gap-3 items-start">
      <IconAlertCircle class="w-5 h-5 text-danger shrink-0" />
      <p class="text-xs text-danger font-medium leading-relaxed">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconFingerprint, IconPasswordFingerprint, IconAlertCircle } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { prepareAssertionOptions, prepareAssertionResponse } from '~/utils/webauthn'

const authStore = useAuthStore()
const toastStore = useToastStore()

const loading = ref(false)
const error = ref('')

const handlePasskeyLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 1. Get options from server
    const options = await authStore.getPasskeyOptions()
    if (!options) throw new Error(authStore.error || 'Impossible de charger les paramètres de sécurité.')

    // 2. Prepare options
    const publicKey = prepareAssertionOptions(options)

    // 3. Browser ceremony
    const credential = await navigator.credentials.get({ publicKey }) as PublicKeyCredential
    if (!credential) throw new Error('Aucune réponse reçue de l\'authentificateur.')

    // 4. Prepare response
    const assertion = prepareAssertionResponse(credential)

    // 5. Verify on server
    const success = await authStore.loginWithPasskey(assertion)
    
    if (success) {
      toastStore.showToast('success', 'Connecté', 'Authentification passkey réussie.')
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 500)
    } else {
      throw new Error(authStore.error || 'La validation de votre Passkey a échoué.')
    }
  } catch (err: any) {
    console.error('Passkey login error:', err)
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      // User cancelled
      return
    }
    error.value = err.message || 'Une erreur est survenue lors de l\'authentification.'
    toastStore.showToast('error', 'Erreur Passkey', error.value)
  } finally {
    loading.value = false
  }
}

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
  }
}

// Auto-trigger on mount for better UX
onMounted(() => {
  // Small delay to let the UI render
  setTimeout(() => {
    handlePasskeyLogin()
  }, 800)
})
</script>
