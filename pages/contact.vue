<template>
  <div class="relative">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
        <span class="badge badge-primary mb-4">Contact & Support</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-6">
          Parlons de votre <span class="text-primary">sécurité</span>
        </h1>
        <p class="text-lg text-hsa">
          Notre équipe d'experts est disponible pour répondre à vos questions techniques, commerciales ou
          administratives.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
        <!-- Contact Form (Left) -->
        <div class="lg:col-span-7 animate-fade-up" style="animation-delay: 100ms;">
          <RcContactForm :form="form" :loading="loading" @submit="submitForm" />
        </div>

        <!-- Info & Map (Right) -->
        <div class="lg:col-span-5 space-y-8 animate-fade-left" style="animation-delay: 200ms;">
          <RcContactInfo />
          <RcContactMap />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Contact'
})

const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  loading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  loading.value = false
  alert('Message envoyé ! Nous vous répondrons sous 24h.')
  form.value = { name: '', email: '', subject: '', message: '' }
}
</script>
