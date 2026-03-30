<template>
  <div class="w-full max-w-md mx-auto">
    <AuthMfaHeader />

    <div class="bg-WtB shadow-2xl rounded-3xl p-4 sm:p-8 border border-ash/50 overflow-hidden text-BtW">
      <!-- Écran 1 : Sélection de la méthode -->
      <AuthMfaMethodSelector v-if="!activeMethod" />

      <!-- Écran 2 : Saisie de Code (TOTP / Authenticator) -->
      <AuthMfaCodeInput v-else-if="isCodeView" />

      <!-- Écran 3 : Magic Link -->
      <AuthMfaMagicLink v-else-if="activeMethod === 'magic_link'" />

      <!-- Écran 4 : Code de sécurité (Backups) -->
      <AuthMfaSecurityCode v-else-if="activeMethod === 'security_code'" />

      <!-- Écran 5 : Passkey -->
      <AuthMfaPasskey v-else-if="activeMethod === 'passkey'" />

      <!-- Retour au login -->
      <AuthMfaFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const activeMethod = computed(() => authStore.mfaSession?.active_method)
const isCodeView = computed(() => ['totp', 'authenticator'].includes(activeMethod.value || ''))

onMounted(() => {
  if (!authStore.mfaSession) {
    navigateTo('/auth/login')
  }
})

useHead({ title: 'Double Authentification' })
</script>