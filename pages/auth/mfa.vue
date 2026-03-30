<template>
  <div class="w-full max-w-md mx-auto">
    <!-- En-tête -->
    <div class="mb-8 text-center text-BtW">
      <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4">
        <IconShieldCheck v-if="!activeMethod || !activeMethodInfo" class="w-8 h-8" />
        <component v-else :is="activeMethodInfo.icon" class="w-8 h-8" />
      </div>
      <h2 class="text-3xl font-black tracking-tight mb-2 uppercase">
        {{ activeMethod && activeMethodInfo ? activeMethodInfo.label : 'Vérification' }}
      </h2>
      <p class="text-hsa font-medium leading-relaxed">
        {{ subTitle }}
      </p>
    </div>

    <!-- Conteneur Principal -->
    <div class="bg-WtB shadow-2xl rounded-3xl p-4 sm:p-8 border border-ash/50 overflow-hidden text-BtW">
      <!-- Écran 1 : Sélection de la méthode (si plusieurs dispo et aucune active) -->
      <div v-if="!activeMethod" class="space-y-4">
        <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] mb-6 text-center">
          Choisissez une méthode sécurisée
        </p>
        <div class="grid grid-cols-1 gap-3">
          <button v-for="method in availableMethods" :key="method" @click="handleSelectMethod(method)"
            class="flex items-center gap-4 p-4 rounded-2xl border border-ashAct bg-ash/5 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-left group">
            <div
              :class="['p-3 rounded-xl transition-colors', getMfaMethodInfo(method).bg, getMfaMethodInfo(method).color]">
              <component :is="getMfaMethodInfo(method).icon" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-BtW group-hover:text-primary transition-colors">{{
                getMfaMethodInfo(method).label }}</h4>
              <p class="text-[10px] text-hsa font-medium">{{ getMfaMethodInfo(method).description }}</p>
            </div>
            <IconChevronRight
              class="w-5 h-5 text-hsa/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      <!-- Écran 2 : Saisie de Code (TOTP Email, Authenticator, Security Code) -->
      <div v-else-if="isCodeView" class="space-y-8">
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

      <!-- Écran 3 : Magic Link -->
      <div v-else-if="activeMethod === 'magic_link'" class="space-y-8 text-center py-4">
        <div class="flex justify-center">
          <div
            class="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center animate-pulse">
            <IconMailFast class="w-10 h-10" />
          </div>
        </div>
        <div class="space-y-2">
          <h3 class="font-black text-BtW uppercase tracking-tighter text-xl">Lien envoyé !</h3>
          <p class="text-sm text-hsa font-medium">Consultez votre boîte mail et cliquez sur le lien pour vous connecter.
          </p>
        </div>

        <div class="pt-4 space-y-4">
          <UiBaseButton @click="handleMagicLink" :loading="loading" variant="secondary"
            class="w-full py-4 text-xs font-black uppercase tracking-widest">
            Renvoyer le lien
          </UiBaseButton>
          <button @click="resetSelection"
            class="text-[10px] text-secondary hover:text-primary hover:underline font-black uppercase tracking-widest transition-colors">
            Essayer une autre méthode
          </button>
        </div>
      </div>

      <!-- Retour au login -->
      <div class="mt-8 pt-6 border-t border-ash/50 text-center">
        <button @click="goBack"
          class="text-[10px] text-hsa hover:text-primary transition-all font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 group">
          <IconArrowLeft class="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          {{ activeMethod ? 'Retour aux méthodes' : 'Retour à la connexion' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { IconShieldCheck, IconArrowLeft, IconChevronRight, IconMailFast } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useToastStore } from '~/stores/front/toast'
import { getMfaMethodInfo } from '~/utils/mfa'

definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()
const toastStore = useToastStore()

/* --- État --- */
const activeMethod = computed(() => authStore.mfaSession?.active_method)
const availableMethods = computed(() => authStore.mfaSession?.available_methods || [])
const activeMethodInfo = computed(() => activeMethod.value ? getMfaMethodInfo(activeMethod.value) : null)

const codeLength = computed(() => {
  if (activeMethod.value === 'authenticator') return 6
  if (activeMethod.value === 'security_code') return 12
  return 9 // totp (email) par défaut
})

const digits = ref<string[]>([])
const loading = ref(false)
const resendLoading = ref(false)
const timeLeft = ref(600)
let timer: any = null

/* --- État Calculé (doit être défini avant les Watchers) --- */
const isCodeView = computed(() => ['totp', 'authenticator', 'security_code'].includes(activeMethod.value || ''))



/* --- Autres États Calculés --- */

const subTitle = computed(() => {
  if (!activeMethod.value) return 'Choisissez une méthode pour confirmer votre identité.'
  if (activeMethod.value === 'totp') return `Un code a été envoyé à ${maskedEmail.value}`
  if (activeMethod.value === 'authenticator') return 'Ouvrez votre application authenticator.'
  if (activeMethod.value === 'magic_link') return `Un lien a été envoyé à ${maskedEmail.value}`
  if (activeMethod.value === 'security_code') return 'Saisissez l\'un de vos codes de secours.'
  return 'Vérification de sécurité requise.'
})

const maskedEmail = computed(() => {
  const email = authStore.mfaSession?.email || ''
  if (!email.includes('@')) return email
  const [local, domain] = email.split('@')
  return local.length <= 2 ? `${local[0]}***@${domain}` : `${local[0]}***${local[local.length - 1]}@${domain}`
})

const formattedTime = computed(() => {
  const mins = Math.floor(timeLeft.value / 60)
  const secs = timeLeft.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

/* --- Méthodes --- */

const handleSelectMethod = async (method: string) => {
  loading.value = true
  await authStore.selectMfaMethod(method)
  loading.value = false
}

const resetSelection = () => {
  if (authStore.mfaSession) {
    authStore.mfaSession.active_method = null
    digits.value = []
  }
}

const handleMagicLink = async () => {
  loading.value = true
  const success = await authStore.loginWithMagicLink()
  if (success) {
    toastStore.showToast('success', 'Email envoyé', 'Le lien magique est en route.')
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Impossible d\'envoyer l\'email.')
  }
  loading.value = false
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
    // totp or security_code
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

const goBack = () => {
  if (activeMethod.value) {
    resetSelection()
  } else {
    authStore.mfaSession = null
    navigateTo('/auth/login')
  }
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else clearInterval(timer)
  }, 1000)
}

// Recréer le tableau de digits quand la méthode change
watch(activeMethod, (newMethod) => {
  if (newMethod) {
    digits.value = Array(codeLength.value).fill('')
    if (isCodeView.value) {
      setTimeout(() => focusInput(0), 100)
    }

    // Autostart Magic Link if selected
    if (newMethod === 'magic_link') {
      handleMagicLink()
    }
  }
}, { immediate: true })

onMounted(() => {
  if (!authStore.mfaSession) {
    navigateTo('/auth/login')
    return
  }
  startTimer()
})

onUnmounted(() => { if (timer) clearInterval(timer) })

useHead({ title: 'Double Authentification' })
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