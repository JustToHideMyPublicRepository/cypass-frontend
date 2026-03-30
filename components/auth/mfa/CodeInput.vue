<template>
  <div class="space-y-8">
    <div class="flex flex-col items-center">
      <label class="block text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
        Entrez votre code de sécurité
      </label>

      <!-- Input segmenté dynamique -->
      <div class="flex items-center justify-center gap-2 sm:gap-4">
        <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <input v-for="(_, i) in digits" :key="i" :id="'code-' + i" v-model="digits[i]" type="text" maxlength="1"
            placeholder="•" @input="handleDigitInput(i, $event)" @keydown.delete="handleBackspace(i, $event)"
            @paste="handlePaste" :disabled="loading" class="code-input" :class="[
              codeLength > 9 ? 'w-6 h-9 sm:w-7 sm:h-10 text-xs' : 'w-7 h-10 sm:w-9 sm:h-12 text-sm sm:text-lg',
              { 'is-filled': digits[i] }
            ]" />
        </div>

        <!-- Indicateur de chargement global -->
        <div v-if="loading" class="flex-shrink-0 ml-2">
          <UiLogoLoader size="sm" />
        </div>
      </div>
    </div>

    <!-- Actions secondaires -->
    <div class="text-center space-y-3">
      <template v-if="activeMethod === 'totp'">
        <p v-if="timeLeft > 0" class="text-xs text-hsa font-bold uppercase tracking-wider">
          Renvoyer le code dans <span class="text-primary font-black">{{ formattedTime }}</span>
        </p>
        <UiBaseButton v-else @click="handleResend" variant="ghost" size="sm" :loading="resendLoading"
          class="!text-[10px] font-black uppercase tracking-[0.2em] !text-primary">
          Renvoyer le code
        </UiBaseButton>
      </template>

      <button @click="resetSelection"
        class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors">
        Essayer une autre méthode
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'

const authStore = useAuthStore()
const toastStore = useToastStore()

const activeMethod = computed(() => authStore.mfaSession?.active_method)

const codeLength = computed(() => {
  if (activeMethod.value === 'authenticator') return 6
  return 9 // totp (email) par défaut
})

const digits = ref<string[]>([])
const loading = ref(false)
const resendLoading = ref(false)
const timeLeft = ref(600)
let timer: any = null

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
    digits.value = []
  }
}

const handleDigitInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const char = input.value.toUpperCase().slice(-1)

  if (char && !/^[A-Z0-9]$/.test(char)) {
    input.value = ''
    digits.value[index] = ''
    return
  }

  digits.value[index] = char
  input.value = char

  if (char && index < codeLength.value - 1) {
    focusInput(index + 1)
  }
  checkComplete()
}

const handleBackspace = (index: number, e: KeyboardEvent) => {
  if (!digits.value[index] && index > 0) focusInput(index - 1)
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text') || ''
  const clean = pasted.replace(/[^A-Z0-9]/g, '').toUpperCase().slice(0, codeLength.value)
  for (let i = 0; i < clean.length; i++) digits.value[i] = clean[i]
  focusInput(Math.min(clean.length, codeLength.value - 1))
  checkComplete()
}

const focusInput = (index: number) => {
  const el = document.getElementById(`code-${index}`)
  el?.focus()
}

const checkComplete = () => {
  const code = digits.value.join('')
  if (code.length === codeLength.value) verify(code)
}

const verify = async (code: string) => {
  loading.value = true
  let success = false

  if (activeMethod.value === 'authenticator') {
    success = await authStore.loginWithAuthenticator(code)
  } else {
    // totp (email)
    success = await authStore.verifyMfa(code)
  }

  if (success) {
    toastStore.showToast('success', 'Connecté', 'Authentification réussie.')
    setTimeout(() => navigateTo('/dashboard'), 500)
  } else {
    toastStore.showToast('error', 'Échec', authStore.error || 'Code invalide.')
    digits.value = Array(codeLength.value).fill('')
    focusInput(0)
  }
  loading.value = false
}

const handleResend = async () => {
  resendLoading.value = true
  const success = await authStore.resendMfa()
  if (success) {
    toastStore.showToast('success', 'Renvoyé', 'Nouveau code envoyé.')
    timeLeft.value = 600
  }
  resendLoading.value = false
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else clearInterval(timer)
  }, 1000)
}

watch(activeMethod, (newMethod) => {
  if (newMethod && ['totp', 'authenticator'].includes(newMethod)) {
    digits.value = Array(codeLength.value).fill('')
    setTimeout(() => focusInput(0), 100)
  }
}, { immediate: true })

onMounted(() => {
  startTimer()
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.code-input {
  @apply text-center rounded-xl sm:rounded-2xl border border-ashAct bg-hsa/10 transition-all duration-300 outline-none font-bold uppercase text-BtW;
}

.code-input:focus {
  @apply border-primary ring-4 ring-primary/10;
}

.code-input.is-filled {
  @apply border-primary/50 bg-primary/5 shadow-sm;
}
</style>
