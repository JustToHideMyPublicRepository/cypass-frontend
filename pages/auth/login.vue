<template>
  <div class="w-full">
    <form @submit.prevent="handleLogin"
      class="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
        <IconAlertCircle class="w-4 h-4" />
        {{ error }}
      </div>

      <div class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email
            Professionnel</label>
          <input v-model="email" id="email" type="email" placeholder="nom@gouv.bj" required
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 dark:text-white transition-shadow" />
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Mot de
              passe</label>
            <a href="#" class="text-xs text-primary hover:underline">Oublié ?</a>
          </div>
          <input v-model="password" id="password" type="password" required
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-700 dark:text-white transition-shadow" />
        </div>
      </div>

      <div class="mt-6">
        <BaseButton type="submit" block :loading="loading">
          Se Connecter
        </BaseButton>
      </div>

      <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Pas encore de compte ?
          <NuxtLink to="/auth/register" class="text-primary font-medium hover:underline">Demander un accès</NuxtLink>
        </p>
      </div>

      <div class="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-300">
        <p class="font-bold">Comptes de test :</p>
        <p>admin@cypass.bj / (any password)</p>
        <p>jean.dupont@gouv.bj / (any password)</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const cypassData = useCypassData()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  if (cypassData.login(email.value, password.value)) {
    router.push('/dashboard')
  } else {
    error.value = "Identifiants invalides. Essayez les comptes de test."
  }

  loading.value = false
}
</script>
