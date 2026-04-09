<template>
  <div class="min-h-screen bg-bgClr flex flex-col items-center justify-center p-4">
    <div
      class="w-full max-w-xl bg-WtB rounded-3xl border border-ash shadow-2xl relative overflow-hidden transition-all duration-500">
      <!-- Decorative background -->
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

      <div class="p-8 relative z-10">
        <!-- Header -->
        <RootNewsletterManageHeader :has-access="hasAccess && status === 'success'" :email="email" />

        <!-- Verification Loader -->
        <RootNewsletterManageLoader v-if="hasAccess && status === 'loading'" />

        <!-- Verification Error -->
        <RootNewsletterManageError v-else-if="hasAccess && status === 'error'" :message="errorMessage"
          @reset="status = 'idle'" />

        <!-- Management Form (Access Granted) -->
        <RootNewsletterManageContent v-else-if="hasAccess && status === 'success'" v-model:first-name="firstName"
          v-model:last-name="lastName" :preferences="preferences" :loading-key="loadingKey" :loading="loading"
          @blur:profile="handleProfileUpdate" @toggle="(key, value) => togglePreference(key as PreferenceKey, value)"
          @confirm="confirmUnsubscribe = true" />

        <!-- Request Access View (No valid token) -->
        <RootNewsletterManageRequest v-else v-model="requestEmail" :loading="loading" @submit="requestLink" />
      </div>
    </div>

    <!-- Two-Step Unsubscribe Modal -->
    <ModalNewsletterUnsubscribe :show="confirmUnsubscribe" :loading="loading" @confirm="handleUnsubscribe"
      @close="confirmUnsubscribe = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { IconUserCode, IconRocket, IconShieldLock } from '@tabler/icons-vue'
import { usePublicNewsletterStore } from '~/stores/back/public/newsletter'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()
const newsletterStore = usePublicNewsletterStore()
const toast = useToastStore()

const token = computed(() => route.query.token as string)
const email = computed(() => route.query.email as string)
const hasAccess = computed(() => !!token.value && !!email.value)

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const loading = ref(false)
const requestEmail = ref('')
const confirmUnsubscribe = ref(false)

const firstName = ref('')
const lastName = ref('')

type PreferenceKey = 'marketing' | 'product' | 'security'
const loadingKey = ref<PreferenceKey | null>(null)

const preferences = reactive({
  marketing: {
    label: 'Marketing & Offres',
    desc: 'Bons plans, promotions et nouveaux partenariats.',
    icon: IconRocket,
    value: true
  },
  product: {
    label: 'Mises à jour Produit',
    desc: 'Découvrez les nouvelles fonctionnalités et outils.',
    icon: IconUserCode,
    value: true
  },
  security: {
    label: 'Alertes Sécurité',
    desc: 'Bulletins d\'alerte et bonnes pratiques Cyber.',
    icon: IconShieldLock,
    value: true
  }
})

onMounted(async () => {
  if (hasAccess.value) {
    status.value = 'loading'
    // We call updatePreferences with only credentials to fetch current state
    const res = await newsletterStore.updatePreferences({
      email: email.value,
      token: token.value
    })

    if (res.success) {
      status.value = 'success'
      // Load data
      firstName.value = res.data.first_name || ''
      lastName.value = res.data.last_name || ''

      if (res.data.settings) {
        preferences.marketing.value = !!res.data.settings.marketing
        preferences.product.value = !!res.data.settings.product
        preferences.security.value = !!res.data.settings.security
      }
    } else {
      status.value = 'error'
      errorMessage.value = res.message
    }
  }
})

// Request access logic
const requestLink = async () => {
  if (!requestEmail.value) return

  loading.value = true
  const res = await newsletterStore.requestManagementLink(requestEmail.value)
  loading.value = false

  if (res.success) {
    toast.showToast('success', 'Email envoyé', res.message)
    requestEmail.value = ''
  } else {
    toast.showToast('error', 'Erreur', res.message)
  }
}

// Update profile and preferences wrapper
const handleUpdate = async (silent: boolean = false) => {
  const payload = {
    email: email.value,
    token: token.value,
    first_name: firstName.value,
    last_name: lastName.value,
    marketing: preferences.marketing.value,
    product: preferences.product.value,
    security: preferences.security.value
  }

  const res = await newsletterStore.updatePreferences(payload)

  if (res.success) {
    if (!silent) {
      toast.showToast('success', 'Mis à jour', 'Vos informations ont été enregistrées avec succès.')
    }
    return true
  } else {
    toast.showToast('error', 'Erreur', res.message)
    return false
  }
}

// Handle profile update on blur
const handleProfileUpdate = async () => {
  await handleUpdate(false)
}

// Toggle a single preference and save
const togglePreference = async (key: PreferenceKey, value: boolean) => {
  loadingKey.value = key
  const oldValue = preferences[key].value
  preferences[key].value = value

  const success = await handleUpdate(true)

  if (!success) {
    // Revert on failure
    preferences[key].value = oldValue
  } else {
    toast.showToast('success', 'Préférence mise à jour', 'Votre choix a été enregistré.')
  }

  loadingKey.value = null
}

// Unsubscribe logic
const handleUnsubscribe = async (confirmationText: string) => {
  loading.value = true
  const res = await newsletterStore.unsubscribe({
    email: email.value,
    token: token.value,
    confirm: true,
    confirmation_text: confirmationText
  })
  loading.value = false
  confirmUnsubscribe.value = false

  if (res.success) {
    toast.showToast('success', 'Désinscrit', 'Vous avez été désabonné de la newsletter.')
    // Redirect to home after a short delay
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  } else {
    toast.showToast('error', 'Erreur', res.message)
  }
}

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Gérer mon abonnement Newsletter'
})
</script>

<style scoped>
.animate-in {
  animation-fill-mode: forwards;
}
</style>
