<template>
  <UiBaseModal :show="show" title="Vérification de sécurité" @close="$emit('close')">
    <div class="space-y-6">
      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
        <div class="p-2 bg-primary/10 rounded-xl shrink-0">
          <IconShieldLock class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-BtW mb-1">Confirmation requise</h4>
          <p class="text-xs text-hsa leading-relaxed">
            Pour accéder à vos codes de sécurité, veuillez confirmer votre identité en saisissant votre mot de passe
            actuel.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase text-hsa tracking-widest ml-1">Mot de passe</label>
          <div class="relative group">
            <input :type="showPassword ? 'text' : 'password'" v-model="password"
              placeholder="Saisissez votre mot de passe"
              class="w-full px-4 py-4 rounded-2xl bg-ash border border-WtBAct focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none pr-12 font-medium"
              @keyup.enter="handleConfirm" />
            <button @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa hover:text-primary transition-colors">
              <IconEye v-if="!showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="error" class="p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3">
          <IconAlertCircle class="w-4 h-4 text-danger" />
          <p class="text-xs font-bold text-danger">{{ error }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-ash/30">
          <UiBaseButton variant="ghost" class="flex-1 order-2 sm:order-1 !rounded-2xl font-bold py-4 h-auto border-none"
            @click="$emit('close')">
            Annuler
          </UiBaseButton>
          <UiBaseButton variant="primary"
            class="flex-1 order-1 sm:order-2 !rounded-2xl font-black py-4 h-auto shadow-lg shadow-primary/20"
            :loading="loading" @click="handleConfirm">
            Confirmer
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconShieldLock, IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits(['close', 'confirm'])

const password = ref('')
const showPassword = ref(false)

const handleConfirm = () => {
  if (!password.value) return
  emit('confirm', password.value)
}

// Reset state when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    password.value = ''
    showPassword.value = false
  }
})
</script>
