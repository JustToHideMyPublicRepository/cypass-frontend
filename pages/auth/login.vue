<template>
  <div class="w-full max-w-md">
    <div class="mb-8">
      <h2 class="text-3xl font-black text-BtW tracking-tight mb-2 uppercase">Connexion</h2>
      <p class="text-hsa font-medium">Accédez à votre espace sécurisé CYPASS.</p>
    </div>

    <!-- Formulaire de connexion -->
    <form @submit.prevent="handleLogin" class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50">
      <div class="space-y-5">
        <!-- Champ Email -->
        <div>
          <label for="email" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconMail class="w-5 h-5" />
            </div>
            <input v-model="email" id="email" type="email" placeholder="votre@email.com" required
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW" />
          </div>
        </div>

        <!-- Champ Mot de passe -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mot de
              passe</label>
            <UiBaseButton type="button" @click="showForgotModal = true" variant="ghost" size="sm"
              class="!text-[10px] !text-primary hover:!bg-primary/5 !p-1 !h-auto !min-h-0 uppercase tracking-wider font-black">
              Oublié ?
            </UiBaseButton>
          </div>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconLock class="w-5 h-5" />
            </div>
            <input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
              placeholder="••••••••"
              class="w-full pl-12 pr-12 py-3 rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW" />

            <!-- Bascule d'affichage du mot de passe -->
            <UiBaseButton type="button" @click="showPassword = !showPassword" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-primary !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !min-h-0">
              <IconEye v-if="showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <div class="mt-8">
        <UiBaseButton type="submit" block :loading="loading" size="lg" class="shadow-lg shadow-primary/20">
          Se connecter
        </UiBaseButton>
      </div>

      <!-- Séparateur -->
      <div class="relative flex py-4 items-center mt-4">
        <div class="flex-grow border-t border-ash/50"></div>
        <span class="flex-shrink-0 mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ou</span>
        <div class="flex-grow border-t border-ash/50"></div>
      </div>

      <!-- Lien vers l'inscription -->
      <div class="mt-4 text-center">
        <p class="text-sm text-hsa">
          Pas encore de compte ?
          <NuxtLink to="/auth/register" class="text-primary font-black hover:underline ml-1">
            Créer un compte
          </NuxtLink>
        </p>
      </div>
    </form>

    <!-- Modal Mot de passe oublié -->
    <ModalAuthPassword :show="showForgotModal" :loading="forgotLoading" @close="showForgotModal = false"
      @submit="handleForgot" />
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
const showForgotModal = ref(false)
const forgotLoading = ref(false)

const authStore = useAuthStore()
const toastStore = useToastStore()

// Gestion de la connexion
const handleLogin = async () => {
  loading.value = true

  const success = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    toastStore.showToast('success', 'Bienvenue', authStore.message || 'Connexion réussie !')
    setTimeout(() => navigateTo('/dashboard'), 1000)
  } else {
    toastStore.showToast('error', 'Erreur de connexion', authStore.error || "Identifiants invalides.")
  }

  loading.value = false
}

// Gestion de l'oubli de mot de passe
const handleForgot = async (forgotEmail: string) => {
  forgotLoading.value = true
  const success = await authStore.forgotPassword(forgotEmail)

  if (success) {
    toastStore.showToast('success', 'Email envoyé', authStore.message || 'Vérifiez votre boîte de réception.')
    showForgotModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || "Impossible d'envoyer l'email.")
  }
  forgotLoading.value = false
}

// Métadonnées SEO
useHead({
  title: 'Connexion'
})
</script>
