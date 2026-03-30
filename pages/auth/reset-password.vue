<template>
  <div class="w-full max-w-md">
    <AuthResetHeader />

    <div class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50">
      <AuthResetInvalidState v-if="!tokenValid" />
      <AuthResetForm v-else :token="token" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { useToastStore } from '~/stores/front/toast'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const toastStore = useToastStore()

const tokenValid = ref(true)
const token = (route.query.token as string) || ''

onMounted(() => {
  if (!token) {
    tokenValid.value = false
    toastStore.showToast('error', 'Erreur', 'Token de réinitialisation manquant.')
  }
})

// Métadonnées SEO
useHead({
  title: 'Réinitialisation du mot de passe',
  meta: [
    { name: 'description', content: 'Définissez votre nouveau mot de passe sécurisé sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
