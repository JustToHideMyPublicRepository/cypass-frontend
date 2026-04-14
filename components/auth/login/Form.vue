<template>
  <form @submit.prevent="handleLogin" class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50">
    <div class="space-y-5">
      <!-- Champ Email (caché si hint sélectionné) -->
      <div v-if="!hint">
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

      <!-- Informations du compte sélectionné -->
      <div v-else class="flex flex-col items-center gap-3 py-2">
        <div class="relative w-20 h-20 rounded-full overflow-hidden border-4 border-WtB shadow-md">
          <img :src="getUserAvatarUrl(hint.avatar_url, hint.name)" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <div class="text-center">
          <p class="text-lg font-black text-BtW">{{ hint.name }}</p>
          <p class="text-sm text-hsa font-medium">{{ hint.email }}</p>
        </div>
        <button type="button" @click="$emit('back')"
          class="text-[10px] font-black text-primary uppercase hover:underline">
          Utiliser un autre compte
        </button>
      </div>

      <!-- Champ Mot de passe -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mot de
            passe</label>
          <UiBaseButton type="button" @click="$emit('forgotPassword')" variant="ghost" size="sm"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { IconEye, IconEyeOff, IconMail, IconLock } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { getUserAvatarUrl } from '~/utils/user'

defineEmits<{
  (e: 'forgotPassword'): void
  (e: 'back'): void
}>()

const props = defineProps<{
  hint?: any
}>()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const authStore = useAuthStore()
const toastStore = useToastStore()
const route = useRoute()

// Gestion de la connexion
const handleLogin = async () => {
  loading.value = true

  const result = await authStore.login({
    email: props.hint ? props.hint.email : email.value,
    password: password.value
  })

  if (result.requireMfa) {
    toastStore.showToast('success', 'Vérification requise', authStore.message || 'Un code a été envoyé.')
    loading.value = false
    navigateTo('/auth/mfa')
    return
  }

  if (result.success) {
    toastStore.showToast('success', 'Bienvenue', authStore.message || 'Connexion réussie !')
    const redirectPath = route.query.redirect as string || '/dashboard'
    navigateTo(redirectPath)
  } else {
    toastStore.showToast('error', 'Erreur de connexion', authStore.error || "Identifiants invalides.")
  }

  loading.value = false
}
</script>
