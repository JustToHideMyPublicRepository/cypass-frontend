<template>
  <UiBaseModal :show="show" title="Configurer l'Authenticator" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Step 1: Explanation -->
      <div class="space-y-2">
        <h3 class="text-sm font-bold text-BtW flex items-center gap-2">
          <span class="flex items-center text-WtB justify-center w-5 h-5 rounded-full bg-primary text-[10px]">1</span>
          Scannez le QR Code
        </h3>
        <p class="text-xs text-hsa leading-relaxed">
          Ouvrez votre application d'authentification (Google Authenticator, Authy, Microsoft Authenticator, etc.) et
          scannez le code QR ci-dessous.
        </p>
      </div>

      <!-- QR Code Display -->
      <div class="flex flex-col items-center justify-center p-6 bg-WtB rounded-3xl border border-hsa shadow-inner">
        <div v-if="qrCodeInline" class="qr-code-container" v-html="qrCodeInline"></div>
        <div v-else class="w-[200px] h-[200px] flex items-center justify-center bg-ash/10 rounded-xl">
          <UiLogoLoader size="md" />
        </div>

        <div class="mt-4 text-center w-full">
          <p class="text-[10px] font-bold text-hsa uppercase tracking-widest mb-1">Ou saisissez la clé manuellement</p>
          <div v-if="secret"
            class="flex items-center justify-center gap-2 px-3 py-1.5 bg-ash/5 rounded-lg border border-ash/10 mx-auto w-fit">
            <code class="text-sm font-mono font-bold text-primary tracking-widest">{{ secret }}</code>
            <button @click="copySecret" class="p-1 hover:bg-primary/10 rounded transition-colors text-primary">
              <IconCheck v-if="copied" class="w-4 h-4" />
              <IconCopy v-else class="w-4 h-4" />
            </button>
          </div>
          <div v-else class="flex justify-center mt-2 px-3">
            <UiAppSkeleton height="32px" width="160px" class="rounded-lg opacity-50" />
          </div>
        </div>
      </div>

      <!-- Step 2: Verification -->
      <div class="space-y-4 pt-2 border-t border-ash/10">
        <div class="space-y-2">
          <h3 class="text-sm font-bold text-BtW flex items-center gap-2">
            <span class="flex items-center text-WtB justify-center w-5 h-5 rounded-full bg-primary text-[10px]">2</span>
            Confirmez l'activation
          </h3>
          <p class="text-xs text-hsa leading-relaxed">
            Saisissez le code à 6 chiffres généré par votre application pour finaliser la configuration.
          </p>
        </div>

        <div class="flex flex-col items-center space-y-4">
          <input v-model="verificationCode" type="text" maxlength="6" placeholder="000000"
            class="w-full max-w-[200px] text-center text-2xl font-black tracking-[0.5em] py-3 rounded-2xl bg-ash/5 border-2 border-dashed border-hsa/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-BtW placeholder:text-hsa/30"
            @keyup.enter="handleConfirm" />

          <UiBaseButton class="w-full" :loading="loading" :disabled="verificationCode.length !== 6"
            @click="handleConfirm">
            Vérifier et activer
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconLoader2, IconCopy, IconCheck } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  show: boolean
  qrCodeInline: string | null
  secret: string | null
  loading: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const verificationCode = ref('')
const copied = ref(false)
const toastStore = useToastStore()

const copySecret = () => {
  if (props.secret) {
    navigator.clipboard.writeText(props.secret)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
    toastStore.showToast('success', 'Copié !', 'La clé secrète a été copiée dans le presse-papier.')
  }
}

const handleConfirm = () => {
  if (verificationCode.value.length === 6) {
    emit('confirm', verificationCode.value)
  }
}

// Reset code when modal opens/closes
watch(() => props.show, (newVal) => {
  if (newVal) {
    verificationCode.value = ''
  }
})
</script>

<style scoped>
.qr-code-container :deep(svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: 200px;
  max-height: 200px;
}
</style>
