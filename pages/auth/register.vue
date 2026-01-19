<template>
  <div>
    <h2 class="text-2xl font-bold mb-2">Créer un compte</h2>
    <p class="text-hsa mb-8">Rejoignez la plateforme de souveraineté numérique.</p>

    <form @submit.prevent="handleRegister" class="bg-WtB shadow-xl rounded-2xl p-8 border border-ash space-y-5">
      <!-- Name Fields -->
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase tracking-wide">Prénom</label>
          <input type="text" v-model="form.firstName" required
            class="w-full px-4 py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW"
            placeholder="Prénom" />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-bold text-hsa uppercase tracking-wide">Nom</label>
          <input type="text" v-model="form.lastName" required
            class="w-full px-4 py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW"
            placeholder="Nom" />
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase tracking-wide">Email
          Professionnel</label>
        <div class="relative">
          <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input type="email" v-model="form.email" required
            class="w-full pl-12 pr-4 py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW"
            placeholder="nom@exemple.com" />
        </div>
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase tracking-wide">Mot de passe</label>
        <div class="relative">
          <IconLock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
            class="w-full pl-12 pr-12 py-3 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-BtW"
            placeholder="••••••••" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa hover:focus:outline-none">
            <IconEye v-if="showPassword" class="w-5 h-5" />
            <IconEyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="flex items-start gap-3">
        <div class="flex items-center h-5">
          <input id="terms" type="checkbox" v-model="form.acceptTerms" required
            class="w-4 h-4 rounded border-ashAct text-primary focus:ring-primary bg-ash" />
        </div>
        <label for="terms" class="text-sm text-hsa leading-tight">
          Je confirme avoir lu et j'accepte les <a href="#" class="text-primary hover:underline font-bold">Conditions
            Générales d'Utilisation</a> et la <a href="#" class="text-primary hover:underline font-bold">Politique de
            Confidentialité</a>.
        </label>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="isLoading"
        class="btn btn-primary w-full sm:w-auto text-lg px-5 py-2.5 shadow-BtW/40 rounded-full text-sm">
        <span v-if="isLoading" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
        <span v-else>Créer mon compte</span>
        <IconArrowRight v-if="!isLoading" class="w-5 h-5" />
      </button>

      <!-- Divider -->
      <div class="relative flex py-2 items-center">
        <div class="flex-grow border-t border-ash"></div>
        <span class="flex-shrink-0 mx-4 text-xs font-bold text-hsa uppercase">Ou</span>
        <div class="flex-grow border-t border-ash"></div>
      </div>

      <!-- Links -->
      <div class="text-center text-sm">
        <span class="text-hsa">Vous avez déjà un compte ?</span>
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
