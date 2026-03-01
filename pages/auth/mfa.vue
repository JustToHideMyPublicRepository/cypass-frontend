<template>
  <div class="w-full max-w-md">
    <div class="mb-8 text-center">
      <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
        <IconShieldCheck class="w-8 h-8" />
      </div>
      <h2 class="text-3xl font-black text-BtW tracking-tight mb-2 uppercase">Vérification</h2>
      <p class="text-hsa font-medium">Un code de sécurité a été envoyé à <br /><span class="text-BtW font-bold">{{
        authStore.mfaSession?.email }}</span></p>
    </div>

    <div class="bg-WtB shadow-2xl rounded-3xl p-6 md:p-8 border border-ash/50">
      <div class="space-y-6">
        <!-- Segmented Code Input -->
        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Code de
            sécurité</label>

          <div class="flex flex-col gap-4">
            <div class="flex justify-center items-center gap-2 md:gap-3">
              <!-- Group 1 -->
              <div class="flex gap-1 md:gap-2">
                <input v-for="i in 3" :key="i - 1" :id="'code-' + (i - 1)" v-model="digits[i - 1]" type="text"
                  maxlength="1" @input="handleDigitInput(i - 1, $event)"
                  @keydown.delete="handleBackspace(i - 1, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" />
              </div>

              <div class="w-2 h-0.5 bg-ashAct rounded-full"></div>

              <!-- Group 2 -->
              <div class="flex gap-1 md:gap-2">
                <input v-for="i in 3" :key="i + 2" :id="'code-' + (i + 2)" v-model="digits[i + 2]" type="text"
                  maxlength="1" @input="handleDigitInput(i + 2, $event)"
                  @keydown.delete="handleBackspace(i + 2, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" />
              </div>

              <div class="w-2 h-0.5 bg-ashAct rounded-full"></div>

              <!-- Group 3 -->
              <div class="flex gap-1 md:gap-2">
                <input v-for="i in 3" :key="i + 5" :id="'code-' + (i + 5)" v-model="digits[i + 5]" type="text"
                  maxlength="1" @input="handleDigitInput(i + 5, $event)"
                  @keydown.delete="handleBackspace(i + 5, $event)" @paste="handlePaste" :disabled="loading"
                  class="code-input" />
              </div>
            </div>

            <!-- Loading Indicator -->
            <div v-if="loading" class="flex justify-center text-primary mt-2">
              <IconLoader2 class="w-6 h-6 animate-spin" />
            </div>
          </div>
        </div>

        <!-- Countdown and Resend -->
        <div class="text-center">
          <p v-if="timeLeft > 0" class="text-sm text-hsa font-medium">
            Renvoyer le code dans <span class="text-primary font-bold">{{ formattedTime }}</span>
          </p>
          <UiBaseButton v-else @click="handleResend" variant="ghost" size="sm" :loading="resendLoading"
            class="!text-xs font-black uppercase tracking-widest !text-primary hover:!bg-primary/5">
            Renvoyer le code
          </UiBaseButton>
        </div>
      </div>

      <!-- Back to login link -->
      <div class="mt-8 pt-6 border-t border-ash/50 text-center">
        <button @click="goBack"
          class="text-sm text-hsa hover:text-primary transition-colors font-bold inline-flex items-center gap-2">
          <IconArrowLeft class="w-4 h-4" />
          Retour à la connexion
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShieldCheck, IconLoader2, IconArrowLeft } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

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

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

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

const handleDigitInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const char = input.value.toUpperCase().slice(-1)
  digits.value[index] = char
  input.value = char // Ensure only 1 char is displayed

  if (char && index < 8) {
    focusInput(index + 1)
  }

  checkComplete()
}

const handleBackspace = (index: number, e: KeyboardEvent) => {
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
    toastStore.showToast('success', 'Vérifié', authStore.message || 'Accès autorisé.')
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
    toastStore.showToast('success', 'Code renvoyé', authStore.message || 'Consultez vos emails.')
    timeLeft.value = 600
    startTimer()
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Échec du renvoi.')
  }
  resendLoading.value = false
}

const goBack = () => {
  authStore.mfaSession = null
  navigateTo('/auth/login')
}

onMounted(() => {
  if (!authStore.mfaSession) {
    navigateTo('/auth/login')
    return
  }

  const elapsed = Math.floor((Date.now() - authStore.mfaSession.loginTime) / 1000)
  timeLeft.value = Math.max(0, 600 - elapsed)

  startTimer()

  // Auto-focus first input
  setTimeout(() => focusInput(0), 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

useHead({
  title: 'Vérification MFA'
})
</script>

<style scoped>
.code-input {
  @apply w-10 h-14 md:w-12 md:h-16 text-center text-xl md:text-2xl font-black rounded-xl border border-ashAct focus:ring-4 focus:ring-primary/10 focus:border-primary bg-ash/30 transition-all outline-none text-BtW uppercase
}
</style>