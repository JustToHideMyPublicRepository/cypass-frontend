<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <IndContactHeader />

      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
        <!-- Contact Form (Left) -->
        <div class="lg:col-span-7 animate-fade-up" style="animation-delay: 100ms;">
          <IndContactForm :form="form" :loading="loading" @submit="submitForm" />
        </div>

        <!-- Info & Map (Right) -->
        <div class="lg:col-span-5 space-y-8 animate-fade-left" style="animation-delay: 200ms;">
          <IndContactInfo />
          <IndContactMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToastStore } from '~/stores/toast'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Contact'
})

const toast = useToastStore()
const authStore = useAuthStore()
const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.fullName
    form.value.email = authStore.user.email
  }
})

const submitForm = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ success: boolean; message: string; data: any }>('/api/support/contact', {
      method: 'POST',
      body: {
        full_name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      }
    })

    if (response.success) {
      toast.showToast('success', 'Message envoyé', response.message || 'Nous avons bien reçu votre message. Nous vous répondrons sous 24h.')
      form.value = { name: '', email: '', subject: '', message: '' }
    } else {
      toast.showToast('error', 'Échec de l\'envoi', response.message || 'Une erreur est survenue.')
    }
  } catch (err) {
    toast.showToast('error', 'Erreur de connexion', 'Impossible de joindre le serveur. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
}
</script>
