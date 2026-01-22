<template>
  <div class="w-full max-w-md">
    <h2 class="text-2xl font-bold mb-2">Connexion</h2>
    <p class="text-hsa mb-8">Accédez à votre espace sécurisé CYPASS.</p>

    <form @submit.prevent="handleLogin" class="bg-WtB shadow-xl rounded-2xl p-8 border border-ash">
      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-1">Email</label>
          <div class="relative">
            <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="email" id="email" type="email" placeholder="nom@exemple.com" required
              class="w-full pl-12 pr-4 py-2 rounded-lg border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent bg-ash transition-shadow outline-none" />
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label for="password" class="block text-sm font-medium text-BtW">Mot de
              passe</label>
            <a href="#" class="text-xs text-primary hover:underline">Oublié ?</a>
          </div>
          <div class="relative">
            <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
              class="w-full pl-12 pr-12 py-2 rounded-lg border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent bg-ash transition-shadow outline-none" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa hover:text-primary focus:outline-none">
              <IconEye v-if="showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <UiBaseButton type="submit" block :loading="loading">
          Se Connecter
        </UiBaseButton>
      </div>

      <div class="relative flex py-2 items-center pt-6">
        <div class="flex-grow border-t border-ash"></div>
        <span class="flex-shrink-0 mx-4 text-xs font-bold text-hsa uppercase">Ou</span>
        <div class="flex-grow border-t border-ash"></div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-hsa">
          Pas encore de compte ?
          <NuxtLink to="/auth/register" class="text-primary font-medium hover:underline">Créer un compte
          </NuxtLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconEye, IconEyeOff, IconMail, IconLock } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)


const authStore = useAuthStore()
const toastStore = useToastStore()

const handleLogin = async () => {
  loading.value = true

  const success = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    toastStore.showToast('success', 'Bienvenue', 'Connexion réussie !')
    setTimeout(() => navigateTo('/dashboard'), 1500)
  } else {
    toastStore.showToast('error', 'Erreur de connexion', authStore.error || "Identifiants invalides.")
  }

  loading.value = false
}

useHead({
  title: 'Connexion'
})
</script>
