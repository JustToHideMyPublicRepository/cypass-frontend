<template>
  <form @submit.prevent="handleRegister"
    class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50 space-y-5">
    <!-- Champs Nom et Prénom -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénom</label>
        <input type="text" v-model="form.firstName" required
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-BtW"
          placeholder="Prénom" />
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</label>
        <input type="text" v-model="form.lastName" required
          class="w-full px-4 py-3 rounded-xl bg-ash/30 border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-BtW"
          placeholder="Nom" />
      </div>
    </div>

    <!-- Email Professionnel -->
    <div class="space-y-2">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Professionnel</label>
      <div class="relative group">
        <div
          class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
          <IconMail class="w-5 h-5" />
        </div>
        <input type="email" v-model="form.email" required
          class="w-full pl-12 pr-4 py-3 rounded-xl bg-ash/30 border transition-all outline-none text-BtW"
          :class="form.email && !isEmailValid ? 'border-danger/50 ring-4 ring-danger/10' : 'border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary'"
          placeholder="votre@exemple.com" />
      </div>
      <p v-if="form.email && !isEmailValid" class="text-[10px] font-bold text-danger ml-1 animate-fade-in">
        Les adresses avec "+" ne sont pas autorisées.
      </p>
    </div>

    <!-- Mot de passe -->
    <div class="space-y-2">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
      <div class="relative group">
        <div
          class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
          <IconLock class="w-5 h-5" />
        </div>
        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
          class="w-full pl-12 pr-12 py-3 rounded-xl bg-ash/30 border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-BtW"
          placeholder="••••••••" />

        <!-- Bascule d'affichage du mot de passe -->
        <UiBaseButton type="button" @click="showPassword = !showPassword" variant="ghost"
          class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-primary !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !min-h-0">
          <IconEye v-if="showPassword" class="w-5 h-5" />
          <IconEyeOff v-else class="w-5 h-5" />
        </UiBaseButton>
      </div>

      <!-- Validateur de complexité du mot de passe -->
      <UtilsPasswordValidator v-if="form.password" :password="form.password" class="mt-3" />
    </div>

    <!-- Acceptation des conditions -->
    <div class="flex items-start gap-3 p-3 rounded-xl transition-all duration-300"
      :class="form.acceptTerms ? 'bg-primary/5 border border-primary/20' : 'bg-ash/20 border border-ash/50 opacity-60'">
      <div class="flex items-center h-6">
        <input id="terms" type="checkbox" v-model="form.acceptTerms"
          class="w-5 h-5 rounded border-ashAct text-primary focus:ring-primary bg-ash/50 cursor-pointer" />
      </div>
      <label for="terms" class="text-sm text-hsa leading-snug cursor-pointer select-none">
        Je confirme avoir lu et j'accepte les
        <NuxtLink to="/legal/terms" class="text-primary hover:underline font-black">CGU</NuxtLink>
        et la
        <NuxtLink to="/legal/privacy" class="text-primary hover:underline font-black">Politique de Confidentialité
        </NuxtLink>.
      </label>
    </div>

    <!-- Bouton d'inscription -->
    <div class="pt-2">
      <UiBaseButton type="submit" block :loading="isLoading" :disabled="!isFormValid || isLoading" size="lg"
        class="shadow-lg shadow-primary/20 group disabled:opacity-50 disabled:grayscale">
        Créer mon compte
        <IconArrowRight v-if="!isLoading" class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </UiBaseButton>
    </div>

    <!-- Séparateur -->
    <div class="relative flex py-2 items-center">
      <div class="flex-grow border-t border-ash/50"></div>
      <span class="flex-shrink-0 mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ou</span>
      <div class="flex-grow border-t border-ash/50"></div>
    </div>

    <!-- Lien de retour à la connexion -->
    <div class="text-center text-sm">
      <span class="text-hsa">Vous avez déjà un compte ?</span>
      <NuxtLink to="/auth/login" class="font-black text-primary hover:underline ml-1">
        Se connecter
      </NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { IconMail, IconLock, IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { EMAIL_REGEX } from '~/utils/validation'

const isLoading = ref(false)
const showPassword = ref(false)

// Modèle de données du formulaire
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  acceptTerms: false
})

const authStore = useAuthStore()
const toastStore = useToastStore()

// Validation de l'email (Pas de "+" autorisé)
const isEmailValid = computed(() => {
  if (!form.email) return false
  return EMAIL_REGEX.test(form.email)
})

// Validation globale du formulaire
const isFormValid = computed(() => {
  return (
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    isEmailValid.value &&
    form.password.length >= 12 &&
    form.acceptTerms
  )
})

// Gestion de la création de compte
const handleRegister = async () => {
  if (!isFormValid.value) return

  isLoading.value = true

  const success = await authStore.register({
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    password: form.password,
    accept_conditions: form.acceptTerms
  })

  isLoading.value = false

  if (success) {
    toastStore.showToast('success', 'Félicitations', authStore.message || 'Compte créé avec succès')
    navigateTo('/auth/login')
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || "Une erreur est survenue")
  }
}
</script>
