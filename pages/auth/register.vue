<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Créer un compte</h2>
    <p class="text-slate-500 dark:text-slate-400 mb-8">Rejoignez la plateforme de souveraineté numérique.</p>

    <form @submit.prevent="handleRegister"
      class="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-700 space-y-5">

      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Prénom</label>
          <input type="text" v-model="form.firstName" required
            class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
            placeholder="Prénom" />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Nom</label>
          <input type="text" v-model="form.lastName" required
            class="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
            placeholder="Nom" />
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Email
          Professionnel</label>
        <div class="relative">
          <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="email" v-model="form.email" required
            class="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
            placeholder="nom@exemple.com" />
        </div>
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Mot de passe</label>
        <div class="relative">
          <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
            class="w-full pl-12 pr-12 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
            placeholder="••••••••" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
            <IconEye v-if="showPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="flex items-start gap-3">
        <div class="flex items-center h-5">
          <input id="terms" type="checkbox" v-model="form.acceptTerms" required
            class="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary bg-slate-50 dark:bg-slate-800" />
        </div>
        <label for="terms" class="text-sm text-slate-500 dark:text-slate-400 leading-tight">
          Je confirme avoir lu et j'accepte les <a href="#" class="text-primary hover:underline font-bold">Conditions
            Générales d'Utilisation</a> et la <a href="#" class="text-primary hover:underline font-bold">Politique de
            Confidentialité</a>.
        </label>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="isLoading"
        class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6">
        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
        <span v-else>Créer mon compte</span>
        <IconArrowRight v-if="!isLoading" class="w-5 h-5" />
      </button>

      <!-- Divider -->
      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span class="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase">Ou</span>
        <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <!-- Links -->
      <div class="text-center text-sm">
        <span class="text-slate-500 dark:text-slate-400">Vous avez déjà un compte ?</span>
        <NuxtLink to="/auth/login" class="font-bold text-primary hover:underline ml-1">Se connecter</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-vue'

definePageMeta({
  layout: 'auth'
})

const isLoading = ref(false)
const showPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  acceptTerms: false
})

const handleRegister = async () => {
  if (!form.acceptTerms) {
    alert("Veuillez accepter les conditions d'utilisation")
    return
  }

  isLoading.value = true

  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    console.log('Registering with:', form)
    // Add logic to handle registration (e.g., call auth store)
  }, 1500)
}

useHead({
  title: 'Inscription'
})
</script>
