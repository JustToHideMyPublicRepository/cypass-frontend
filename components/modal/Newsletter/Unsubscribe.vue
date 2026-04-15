<template>
  <UiBaseModal :show="show" max-width="lg" @close="handleClose">
    <div class="py-4 md:py-6 text-center space-y-6 animate-fade-up">
      <!-- Icon based on step -->
      <div v-if="step === 1"
        class="w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-4 bg-danger/10 text-danger transition-all shadow-lg shadow-danger/10">
        <IconAlertTriangle class="w-10 h-10" />
      </div>
      <div v-else
        class="w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-4 bg-primary/10 text-primary transition-all shadow-lg shadow-primary/10">
        <IconShieldLock class="w-10 h-10" />
      </div>

      <!-- Content Step 1 -->
      <div v-if="step === 1" class="space-y-3 px-6">
        <h3 class="text-2xl font-black text-BtW tracking-tight uppercase leading-tight">Désinscription</h3>
        <p class="text-sm md:text-base text-hsa font-medium leading-relaxed">
          Êtes-vous sûr de vouloir vous désabonner complètement ? Cette action est immédiate et vous ne recevrez plus
          nos actualités.
        </p>
      </div>

      <!-- Content Step 2 -->
      <div v-else class="space-y-6 px-6">
        <div class="space-y-3">
          <h3 class="text-2xl font-black text-BtW tracking-tight uppercase leading-tight">Confirmation finale</h3>
          <p class="text-xs text-hsa font-medium leading-relaxed">
            Pour confirmer, veuillez saisir le texte ci-dessous exactement.
          </p>
        </div>

        <div class="bg-bgClr rounded-2xl p-4 border border-ash/30 space-y-4">
          <div class="flex items-center justify-between gap-4">
            <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em]">Texte à copier</p>
            <button @click="copyText"
              class="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
              <IconCopy v-if="!copied" class="w-3 h-3" />
              <IconCheck v-else class="w-3 h-3" />
              {{ copied ? 'Copié !' : 'Copier' }}
            </button>
          </div>

          <div class="bg-WtB border border-ash/50 rounded-xl p-3 text-center">
            <code class="text-sm font-mono font-bold text-BtW tracking-widest select-all">{{ CONFIRMATION_TEXT }}</code>
          </div>

          <div class="space-y-2 text-left">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Saisie de contrôle</label>
            <input v-model="confirmationInput" type="text" :placeholder="CONFIRMATION_TEXT"
              class="input text-center !font-mono !text-xs tracking-widest uppercase border-primary/20 focus:border-primary" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 px-6 pb-2">
        <UiBaseButton variant="ghost" class="flex-1 order-2 sm:order-1 !rounded-2xl font-bold py-4 h-auto border-none"
          @click="handleClose" type="button">
          Annuler
        </UiBaseButton>

        <UiBaseButton v-if="step === 1" variant="danger"
          class="flex-1 order-1 sm:order-2 !rounded-2xl font-black py-4 h-auto shadow-lg" @click="step = 2">
          Oui, continuer
        </UiBaseButton>

        <UiBaseButton v-else variant="danger"
          class="flex-1 order-1 sm:order-2 !rounded-2xl font-black py-4 h-auto shadow-lg" :loading="loading"
          :disabled="!isValid" @click="$emit('confirm', confirmationInput)">
          Me désabonner
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconAlertTriangle, IconShieldLock, IconCopy, IconCheck } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', text: string): void
}>()

const CONFIRMATION_TEXT = 'JE RETIRE MON ABONNEMENT'
const step = ref(1)
const confirmationInput = ref('')
const copied = ref(false)

const isValid = computed(() => confirmationInput.value === CONFIRMATION_TEXT)

const copyText = () => {
  navigator.clipboard.writeText(CONFIRMATION_TEXT)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const handleClose = () => {
  emit('close')
}

// Reset state when modal is opened/closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    // We delay reset slightly to avoid UI flicker during closing transition
    setTimeout(() => {
      step.value = 1
      confirmationInput.value = ''
      copied.value = false
    }, 300)
  }
})
</script>
