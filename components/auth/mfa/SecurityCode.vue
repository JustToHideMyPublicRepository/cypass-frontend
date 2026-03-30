<template>
  <div class="space-y-8">
    <div class="flex flex-col items-center">
      <label class="block text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
        Entrez un code de secours
      </label>

      <!-- Input formaté pour le code de secours -->
      <div class="w-full max-w-sm">
        <div class="relative flex items-center">
          <input
            v-model="securityCode"
            type="text"
            maxlength="14"
            placeholder="Ex: AZUB YMMH O3UK"
            :disabled="loading"
            class="w-full h-12 px-4 text-center text-lg sm:text-xl font-bold uppercase tracking-widest text-BtW bg-ash/10 border border-ashAct rounded-xl outline-none transition-all placeholder:text-hsa/30 focus:border-primary focus:bg-primary/5 focus:ring-4 focus:ring-primary/10"
            @input="handleInput"
            @keydown.enter="verifyCode"
          />
          <!-- Indicateur de chargement -->
          <div v-if="loading" class="absolute right-4 text-primary">
            <UiLogoLoader size="xs" />
          </div>
        </div>
        <p class="text-xs text-hsa text-center mt-3 font-medium">
          Saisissez l'un des 12 codes générés lors de l'activation.
        </p>
      </div>
    </div>

    <!-- Actions secondaires -->
    <div class="text-center space-y-3">
      <UiBaseButton
        @click="verifyCode"
        :disabled="rawCode.length !== 12 || loading"
        variant="primary"
        class="w-full mb-4"
      >
        Vérifier le code
      </UiBaseButton>

      <button
        @click="resetSelection"
        class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors"
      >
        Essayer une autre méthode
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

const authStore = useAuthStore()
const toastStore = useToastStore()

const securityCode = ref('')
const loading = ref(false)

const rawCode = computed(() => securityCode.value.replace(/\s+/g, '').toUpperCase())

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  // On ne garde que les caractères alphanumériques et on met en majuscules
  let cleaned = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  
  // Formatage (ex: AZUB YMMH O3UK)
  let formatted = ''
  for (let i = 0; i < cleaned.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' '
    formatted += cleaned[i]
  }
  
  securityCode.value = formatted
}

const verifyCode = async () => {
  if (rawCode.value.length !== 12 || loading.value) return

  loading.value = true
  const success = await authStore.loginWithSecurityCode(rawCode.value)

  if (success) {
    toastStore.showToast('success', 'Connecté', 'Authentification réussie.')
    // Redirect to dashboard explicitly 
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 500)
  } else {
    toastStore.showToast('error', 'Échec', authStore.error || 'Code de sécurité invalide.')
    securityCode.value = ''
  }
  loading.value = false
}

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
    securityCode.value = ''
  }
}
</script>
