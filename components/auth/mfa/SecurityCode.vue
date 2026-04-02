<template>
  <div class="space-y-8">
    <!-- Écran 1 : Saisie du code -->
    <template v-if="!newCode">
      <div class="flex flex-col items-center">
        <label class="block text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
          Entrez un code de secours
        </label>

        <!-- Input formaté pour le code de secours -->
        <div class="w-full max-w-sm">
          <div class="relative flex items-center">
            <input v-model="securityCode" type="text" maxlength="14" placeholder="Ex: AZUB YMMH O3UK"
              :disabled="loading"
              class="w-full h-12 px-4 text-center text-lg sm:text-xl font-bold uppercase tracking-widest text-BtW bg-ash/10 border border-ashAct rounded-xl outline-none transition-all placeholder:text-hsa/30 focus:border-primary focus:bg-primary/5 focus:ring-4 focus:ring-primary/10"
              @input="handleInput" @keydown.enter="verifyCode" />
            <!-- Indicateur de chargement -->
            <div v-if="loading" class="absolute right-4 text-primary">
              <UiLogoLoader size="xs" />
            </div>
          </div>
          <p class="text-xs text-hsa text-center mt-3 font-medium">
            Saisissez les 12 caractères d'un de vos codes de secours.
          </p>
        </div>
      </div>

      <!-- Actions secondaires -->
      <div class="text-center space-y-3">
        <UiBaseButton @click="verifyCode" :disabled="rawCode.length !== 12 || loading" variant="primary"
          class="w-full mb-4">
          Vérifier le code
        </UiBaseButton>

        <button @click="resetSelection"
          class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors">
          Essayer une autre méthode
        </button>
      </div>
    </template>

    <!-- Écran 2 : Affichage du nouveau code de remplacement -->
    <template v-else>
      <div class="flex flex-col items-center space-y-6">
        <div class="p-4 bg-success/10 rounded-full text-success">
          <IconCheck class="w-8 h-8" />
        </div>

        <div class="text-center space-y-2">
          <h3 class="font-bold text-BtW">Code de secours validé !</h3>
          <p class="text-xs text-hsa max-w-[280px]">
            Ce code a été utilisé. Un nouveau code de remplacement a été généré pour le remplacer.
            <span class="text-danger font-bold uppercase">Notez-le précieusement !</span>
          </p>
        </div>

        <div class="w-full p-4 bg-ash/20 border-2 border-dashed border-success/30 rounded-2xl relative group">
          <p class="text-center text-2xl font-black text-BtW tracking-widest select-all">
            {{ newCode }}
          </p>
        </div>

        <UiBaseButton variant="primary" class="w-full" @click="handleFinalize">
          J'ai noté mon nouveau code
        </UiBaseButton>

        <p class="text-[10px] text-hsa font-medium">
          Redirection automatique dans <span class="text-primary font-black">{{ countdown }}s</span>
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconCheck } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

const authStore = useAuthStore()
const toastStore = useToastStore()

const securityCode = ref('')
const loading = ref(false)
const newCode = ref<string | null>(null)
const countdown = ref(10)
let timerInterval: any = null

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
  const response: any = await authStore.loginWithSecurityCode(rawCode.value)

  // On vérifie si l'action a réussi (elle renvoie un objet avec success/message)
  if (response && (response.success || response.message)) {
    toastStore.showToast('success', 'Code validé', 'Votre code de secours a été accepté.')

    // On extrait le nouveau code de la réponse (data.new_recovery_code)
    if (response.data?.new_recovery_code) {
      newCode.value = response.data.new_recovery_code
      startCountdown()
    } else {
      // Fallback si non trouvé mais succès quand même
      handleFinalize()
    }
  } else {
    toastStore.showToast('error', 'Échec', authStore.error || 'Code de sécurité invalide.')
    securityCode.value = ''
  }
  loading.value = false
}

const startCountdown = () => {
  countdown.value = 10
  timerInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timerInterval)
      handleFinalize()
    }
  }, 1000)
}

// Nouvelle méthode pour gérer les données de retour
const handleFinalize = () => {
  if (timerInterval) clearInterval(timerInterval)
  window.location.href = '/dashboard'
}

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
    securityCode.value = ''
  }
}
</script>
