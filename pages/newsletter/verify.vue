<template>
  <div class="min-h-screen bg-bgClr flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-WtB rounded-3xl p-8 border border-ash shadow-2xl relative overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div class="text-center relative z-10 space-y-6">
        <!-- Icon container -->
        <div class="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg border border-ash"
          :class="status === 'loading' ? 'bg-ash/10' : status === 'success' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'">
          <UiLogoLoader v-if="status === 'loading'" size="sm" />
          <IconMailCheck v-else-if="status === 'success'" class="w-10 h-10 text-success" />
          <IconMailX v-else class="w-10 h-10 text-error" />
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-black text-BtW tracking-tight">Vérification de l'email</h1>
          <p class="text-sm font-medium leading-relaxed"
            :class="status === 'success' ? 'text-success' : status === 'error' ? 'text-error' : 'text-hsa'">
            {{ message }}
          </p>
        </div>

        <div class="pt-6">
          <NuxtLink to="/">
            <UiBaseButton variant="primary" class="w-full !rounded-2xl min-h-[3rem]">
              Retourner à l'accueil
            </UiBaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconMailCheck, IconMailX } from '@tabler/icons-vue'
import { usePublicNewsletterStore } from '~/stores/back/public/newsletter'

const route = useRoute()
const newsletterStore = usePublicNewsletterStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Vérification de votre abonnement en cours...')

definePageMeta({
  layout: 'guest'
})

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    status.value = 'error'
    message.value = 'Jeton de vérification manquant ou invalide.'
    return
  }

  try {
    const response = await newsletterStore.verify(token)

    if (response?.success) {
      status.value = 'success'
      message.value = response.message || 'Votre abonnement à la newsletter a été confirmé avec succès.'
    } else {
      status.value = 'error'
      message.value = response?.message || 'La vérification a échoué. Le lien peut être expiré.'
    }
  } catch (e: any) {
    status.value = 'error'
    message.value = e.message || 'Une erreur est survenue lors de la vérification.'
  }
})

useHead({
  title: 'Vérification Newsletter'
})
</script>
