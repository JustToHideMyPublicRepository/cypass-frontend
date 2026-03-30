<template>
  <div class="space-y-8">
    <MeSecurityHeader />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Left: MFA Methods List -->
      <div class="md:col-span-2 space-y-6">
        <MeSecurityMethods :methods="profilStore.profile?.mfa_methods || []" :loading="isInitialLoading"
          :updating-method="updatingMethod"
          @verify-backup-codes="showVerifyModal = true" @set-default="handleSetDefaultMethod"
          @setup-authenticator="handleSetupAuthenticator" @setup-passkey="showPasskeyModal = true"
          @toggle-method="handleToggleMethod" />
      </div>

      <!-- Right: Global Security Info -->
      <div class="space-y-6">
        <MeSecurityInfo />
      </div>
    </div>

    <!-- Modals -->
    <ModalSecurityVerifyPassword :show="showVerifyModal" :loading="securityStore.loading" :error="securityStore.error"
      @close="showVerifyModal = false" @confirm="handleVerifyPassword" />

    <ModalSecurityBackupCodes :show="showCodesModal" :codes="fetchedCodes || []" :expires-at="expiresAt"
      :loading="securityStore.loading" @close="showCodesModal = false" @reset="handleRegenerate" />

    <ModalSecurityAuthenticator :show="showAuthenticatorModal" :qr-code-inline="authenticatorData?.qr_code_inline || null"
      :secret="authenticatorData?.secret || null" :loading="securityStore.loading" @close="showAuthenticatorModal = false"
      @confirm="handleConfirmAuthenticator" />

    <ModalSecurityPasskey :show="showPasskeyModal" :loading="securityStore.loading" @close="showPasskeyModal = false"
      @success="showPasskeyModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfilStore } from '~/stores/back/user/profil'
import { useSecurityStore } from '~/stores/back/user/security'
import { useToastStore } from '~/stores/front/toast'

definePageMeta({
  layout: 'default'
})

const profilStore = useProfilStore()
const securityStore = useSecurityStore()
const toastStore = useToastStore()

const showVerifyModal = ref(false)
const showCodesModal = ref(false)
const showAuthenticatorModal = ref(false)
const showPasskeyModal = ref(false)
const fetchedCodes = ref<string[] | null>(null)
const expiresAt = ref<string>('')
const authenticatorData = ref<any>(null)
const updatingMethod = ref<string | null>(null)
const isInitialLoading = ref(true)

onMounted(async () => {
  await profilStore.getProfile()
  isInitialLoading.value = false
})

const handleSetupAuthenticator = async () => {
  authenticatorData.value = null
  showAuthenticatorModal.value = true
  
  const data = await securityStore.authenticatorSetup()
  if (data) {
    authenticatorData.value = data
  } else {
    showAuthenticatorModal.value = false
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Impossible d\'initialiser la configuration.')
  }
}

const handleConfirmAuthenticator = async (code: string) => {
  const success = await securityStore.authenticatorConfirm(code)
  if (success) {
    showAuthenticatorModal.value = false
    toastStore.showToast('success', 'Félicitations !', 'Votre application Authenticator est maintenant active.')
  } else {
    toastStore.showToast('error', 'Code invalide', securityStore.error || 'Le code saisi est incorrect.')
  }
}

const handleVerifyPassword = async (password: string) => {
  const data = await securityStore.getSecurityCodes(password)
  if (data) {
    fetchedCodes.value = data.codes
    expiresAt.value = data.expires_at
    showVerifyModal.value = false
    showCodesModal.value = true
    toastStore.showToast('success', 'Vérification réussie', 'Accès aux codes autorisé.')
  }
}

const handleRegenerate = async () => {
  const data = await securityStore.resetSecurityCodes()
  if (data) {
    fetchedCodes.value = data.codes
    expiresAt.value = data.expires_at
    toastStore.showToast('success', 'Nouveaux codes générés', 'Notez vos nouveaux codes précieusement.')
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Impossible de régénérer les codes.')
  }
}

const handleSetDefaultMethod = async (method: string) => {
  updatingMethod.value = method
  const success = await securityStore.setDefaultMfaMethod(method)
  if (success) {
    toastStore.showToast('success', 'Succès', 'Méthode par défaut mise à jour.')
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Impossible de mettre à jour la méthode.')
  }
  updatingMethod.value = null
}

const handleToggleMethod = async (method: string, action: 'enable' | 'disable' | 'reset') => {
  // Prevent disabling TOTP (redundant check with backend)
  if (method === 'totp' && action !== 'enable') return

  updatingMethod.value = method
  
  let success = false
  if (action === 'reset' && method === 'security_code') {
    // Specialized logic for security codes reset
    const data = await securityStore.resetSecurityCodes()
    if (data) {
      fetchedCodes.value = data.codes
      expiresAt.value = data.expires_at
      showCodesModal.value = true
      success = true
    }
  } else {
    success = await securityStore.toggleMfaMethod(method, action)
  }

  if (success) {
    const actionLabel = action === 'enable' ? 'activée' : (action === 'disable' ? 'désactivée' : 'réinitialisée')
    toastStore.showToast('success', 'Succès', `La méthode a été ${actionLabel}.`)
  } else {
    toastStore.showToast('error', 'Erreur', securityStore.error || 'Impossible de mettre à jour la méthode.')
  }
  
  updatingMethod.value = null
}

useHead({
  title: 'Centre de sécurité',
  meta: [
    { name: 'description', content: 'Gérez vos méthodes de double authentification pour sécuriser davantage votre compte.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
