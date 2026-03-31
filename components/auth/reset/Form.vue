<template>
  <form @submit.prevent="handleReset" class="space-y-5">
    <!-- Nouveau mot de passe -->
    <div>
      <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nouveau
        mot de passe</label>
      <div class="relative group">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
          <IconLock class="w-5 h-5" />
        </div>
        <input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" required
          placeholder="••••••••"
          class="w-full pl-12 pr-12 py-3 rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW" />

        <UiBaseButton type="button" @click="showPassword = !showPassword" variant="ghost"
          class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-primary !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !min-h-0">
          <IconEye v-if="showPassword" class="w-5 h-5" />
          <IconEyeOff v-else class="w-5 h-5" />
        </UiBaseButton>
      </div>
      <UtilsPasswordValidator v-if="password" :password="password" class="mt-3" />
    </div>

    <!-- Confirmation du mot de passe -->
    <div>
      <label for="confirm" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirmer
        le mot de passe</label>
      <div class="relative group">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
          <IconLockCheck class="w-5 h-5" />
        </div>
        <input v-model="confirmPassword" id="confirm" :type="showConfirm ? 'text' : 'password'" required
          placeholder="••••••••"
          class="w-full pl-12 pr-12 py-3 rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW" />

        <UiBaseButton type="button" @click="showConfirm = !showConfirm" variant="ghost"
          class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-primary !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !min-h-0">
          <IconEye v-if="showConfirm" class="w-5 h-5" />
          <IconEyeOff v-else class="w-5 h-5" />
        </UiBaseButton>
      </div>
      <p v-if="confirmPassword && password !== confirmPassword"
        class="mt-2 text-xs text-danger font-bold flex items-center gap-1 animate-pulse">
        <IconCircleX class="w-4 h-4" /> Les mots de passe ne correspondent pas
      </p>
    </div>

    <div class="pt-4">
      <UiBaseButton type="submit" block :loading="loading" size="lg" class="shadow-lg shadow-primary/20">
        Réinitialiser le mot de passe
      </UiBaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconLock, IconLockCheck, IconEye, IconEyeOff, IconCircleX } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  token: string
}>()

const authStore = useAuthStore()
const toastStore = useToastStore()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)

const isPasswordSecure = computed(() => {
  const p = password.value
  return (
    p.length >= 12 &&
    /[A-Z]/.test(p) &&
    /[a-z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p)
  )
})

const handleReset = async () => {
  if (password.value !== confirmPassword.value) {
    toastStore.showToast('warning', 'Erreur', 'Les mots de passe ne correspondent pas.')
    return
  }

  if (!isPasswordSecure.value) {
    toastStore.showToast('warning', 'Sécurité', 'Le mot de passe ne respecte pas les critères de sécurité.')
    return
  }

  loading.value = true
  const success = await authStore.resetPassword({
    token: props.token,
    password: password.value,
    confirm: confirmPassword.value
  })

  if (success) {
    toastStore.showToast('success', 'Succès', authStore.message || 'Votre mot de passe a été réinitialisé.')
    navigateTo('/auth/login')
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Échec de la réinitialisation.')
  }
  loading.value = false
}
</script>
