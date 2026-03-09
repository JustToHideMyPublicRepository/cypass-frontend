<template>
  <div class="w-full max-w-md mx-auto">
    <!-- En-tête -->
    <div class="mb-8 text-center text-BtW">
      <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
        <IconShieldCheck class="w-8 h-8" />
      </div>
      <h2 class="text-3xl font-black tracking-tight mb-2 uppercase">Vérification</h2>
      <p class="text-hsa font-medium leading-relaxed">
        Un code de sécurité a été envoyé à <br />
        <span class="font-bold text-BtW">{{ maskedEmail }}</span>
      </p>
    </div>

    <!-- Conteneur de saisie -->
    <div class="bg-WtB shadow-2xl rounded-3xl p-4 sm:p-8 border border-ash/50 overflow-hidden text-BtW">
      <div class="space-y-8">
        <!-- Groupe de saisie segmenté -->
        <div class="flex flex-col items-center">
          <label class="block text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
            Code de sécurité
          </label>

          <!-- Cases à remplir -->
          <div class="flex items-center justify-center gap-4 sm:gap-6">
            <div class="flex items-center gap-0.5 sm:gap-2">
              <!-- Groupe 1 (3 chiffres) -->
              <div class="flex gap-0.5 sm:gap-1">
                <input v-for="i in 3" :key="i - 1" :id="'code-' + (i - 1)" v-model="digits[i - 1]" type="text"
                  maxlength="1" placeholder="•" @input="handleDigitInput(i - 1, $event)"
                  @keydown.delete="handleBackspace(i - 1, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" :class="{ 'is-filled': digits[i - 1] }" />
              </div>

              <!-- Séparateur 1 -->
              <span class="font-bold text-lg px-0.5 select-none opacity-50 text-BtW">-</span>

              <!-- Groupe 2 (3 chiffres) -->
              <div class="flex gap-0.5 sm:gap-1">
                <input v-for="i in 3" :key="i + 2" :id="'code-' + (i + 2)" v-model="digits[i + 2]" type="text"
                  maxlength="1" placeholder="•" @input="handleDigitInput(i + 2, $event)"
                  @keydown.delete="handleBackspace(i + 2, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" :class="{ 'is-filled': digits[i + 2] }" />
              </div>

              <!-- Séparateur 2 -->
              <span class="font-bold text-lg px-0.5 select-none opacity-50 text-BtW">-</span>

              <!-- Groupe 3 (3 chiffres) -->
              <div class="flex gap-0.5 sm:gap-1">
                <input v-for="i in 3" :key="i + 5" :id="'code-' + (i + 5)" v-model="digits[i + 5]" type="text"
                  maxlength="1" placeholder="•" @input="handleDigitInput(i + 5, $event)"
                  @keydown.delete="handleBackspace(i + 5, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" :class="{ 'is-filled': digits[i + 5] }" />
              </div>
            </div>

            <!-- Indicateur de chargement -->
            <div v-if="loading" class="flex-shrink-0">
              <UiLogoLoader size="sm" />
            </div>
          </div>
        </div>

        <!-- Compte à rebours et Action de renvoi -->
        <div class="text-center space-y-3">
          <p v-if="timeLeft > 0" class="text-xs text-hsa font-bold uppercase tracking-wider text-BtW">
            Renvoyer le code dans <span class="text-primary font-black">{{ formattedTime }}</span>
          </p>
          <div v-else class="flex justify-center text-BtW">
            <UiBaseButton @click="handleResend" variant="ghost" size="sm" :loading="resendLoading"
              class="!text-[10px] font-black uppercase tracking-[0.2em] !text-primary hover:!bg-primary/5 px-6 py-2 rounded-xl">
              Renvoyer le code
            </UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Lien vers la page de login -->
      <div class="mt-8 pt-6 border-t border-ash/50 text-center">
        <button @click="goBack"
          class="text-[10px] text-hsa hover:text-primary transition-all font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 group">
          <IconArrowLeft class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Retour à la connexion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconLoader2, IconArrowLeft } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const toastStore = useToastStore()

const digits = ref(Array(9).fill(''))
const loading = ref(false)
const resendLoading = ref(false)
const timeLeft = ref(600)

let timer: any = null

/* --- État Calculé --- */

// Masquage de l'email pour la confidentialité
const maskedEmail = computed(() => {
  const email = authStore.mfaSession?.email || ''
  if (!email.includes('@')) return email

  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`
})

// Formattage du temps MM:SS
const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

/* --- Logique Métier --- */

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const focusInput = (index: number) => {
  if (index >= 0 && index < 9) {
    const el = document.getElementById(`code-${index}`)
    el?.focus()
  }
}

/* --- Gestionnaires d'Événements --- */

const handleDigitInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const char = input.value.toUpperCase().slice(-1)

  // N'accepte que l'alphanumérique
  if (char && !/^[A-Z0-9]$/.test(char)) {
    input.value = ''
    digits.value[index] = ''
    return
  }

  digits.value[index] = char
  input.value = char

  // Avance automatique
  if (char && index < 8) {
    focusInput(index + 1)
  }

  checkComplete()
}

const handleBackspace = (index: number, e: KeyboardEvent) => {
  // Recule si la case actuelle est vide
  if (!digits.value[index] && index > 0) {
    focusInput(index - 1)
  }
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const alphanumeric = pasted.replace(/[^A-Z0-9]/g, '').toUpperCase().slice(0, 9)

  for (let i = 0; i < alphanumeric.length; i++) {
    digits.value[i] = alphanumeric[i]
  }

  const nextIndex = Math.min(alphanumeric.length, 8)
  focusInput(nextIndex)

  checkComplete()
}

const checkComplete = () => {
  const code = digits.value.join('')
  if (code.length === 9) {
    verifyCode(code)
  }
}

const verifyCode = async (code: string) => {
  loading.value = true
  const success = await authStore.verifyMfa(code)

  if (success) {
    toastStore.showToast('success', 'Vérifié', authStore.message || 'Authentification réussie.')
    setTimeout(() => navigateTo('/dashboard'), 1000)
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Code incorrect ou expiré.')
  }
  loading.value = false
}

const handleResend = async () => {
  resendLoading.value = true
  const success = await authStore.resendMfa()

  if (success) {
    toastStore.showToast('success', 'Renvoyé', authStore.message || 'Nouveau code envoyé par email.')
    timeLeft.value = 600
    startTimer()
  } else {
    toastStore.showToast('error', 'Échec', authStore.error || 'Erreur lors du renvoi.')
  }
  resendLoading.value = false
}

const goBack = () => {
  authStore.mfaSession = null
  navigateTo('/auth/login')
}

/* --- Cycle de Vie --- */

onMounted(() => {
  if (!authStore.mfaSession) {
    navigateTo('/auth/login')
    return
  }

  const elapsed = Math.floor((Date.now() - authStore.mfaSession.loginTime) / 1000)
  timeLeft.value = Math.max(0, 600 - elapsed)

  startTimer()
  setTimeout(() => focusInput(0), 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

useHead({
  title: 'MFA Vérification',
  meta: [
    { name: 'description', content: 'Étape de vérification de sécurité par code MFA sur CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.code-input {
  /* Dimensions ultra-compactes pour mobile, s'adaptant aux écrans étroits */
  @apply w-7 h-10 text-center rounded-lg sm:rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW uppercase placeholder:text-ashAct/30;
}

.code-input.is-filled {
  @apply border-primary/50 bg-primary/5 shadow-sm;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>