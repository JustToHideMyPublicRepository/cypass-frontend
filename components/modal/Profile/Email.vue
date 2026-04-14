<template>
  <UiBaseModal :show="show" title="Email" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-6 py-2">
      <!-- Alerte de sécurité -->
      <div class="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/20 backdrop-blur-sm">
        <div class="flex gap-4">
          <div class="shrink-0 p-2 bg-primary/10 rounded-xl h-fit text-primary shadow-inner">
            <IconAlertCircle class="w-6 h-6" />
          </div>
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Un email de vérification sera envoyé à votre nouvelle adresse. Vous devrez le confirmer pour finaliser le
            changement de compte.
          </p>
        </div>
      </div>

      <div class="space-y-5">
        <!-- Champ Nouvel Email -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Nouvel Email</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconMail class="w-5 h-5" />
            </div>
            <input type="email" v-model="form.newEmail" required placeholder="nouveau@exemple.com"
              class="input pl-12 transition-all outline-none"
              :class="form.newEmail && !isEmailValid ? 'border-danger/30 ring-danger/10' : ''" />
          </div>
          <p v-if="form.newEmail && !isEmailValid" class="text-[10px] font-bold text-danger ml-2 animate-fade-in">
            Les adresses avec "+" ne sont pas autorisées.
          </p>
        </div>

        <!-- Champ Mot de passe actuel -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Mot de passe actuel</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconLock class="w-5 h-5" />
            </div>
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required placeholder="••••••••"
              class="input pl-12 pr-14" />
            <UiBaseButton type="button" @click="showPassword = !showPassword" variant="ghost"
              class="!absolute !right-2 !top-1/2 !-translate-y-1/2 text-hsa hover:!text-BtW transition-colors !p-2 !bg-transparent hover:!bg-transparent !h-auto !w-auto !rounded-xl">
              <IconEye v-if="showPassword" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading" :disabled="!isFormValid || loading"
          class="!rounded-2xl font-black tracking-widest shadow-xl disabled:opacity-50">
          Confirmer
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { IconMail, IconLock, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-vue'
import { EMAIL_REGEX } from '~/utils/validation'

// Propriétés de la modale ProfileEmail
defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'submit'])

// Visibilité du mot de passe
const showPassword = ref(false)

// État local du formulaire
const form = reactive({
  newEmail: '',
  password: ''
})

// Validation de l'email
const isEmailValid = computed(() => {
  if (!form.newEmail) return false
  return EMAIL_REGEX.test(form.newEmail)
})

// Validation du formulaire
const isFormValid = computed(() => {
  return isEmailValid.value && form.password.length > 0
})

// Gestion de la soumission sécurisée
const handleSubmit = () => {
  if (!isFormValid.value) return
  emit('submit', { ...form })
}
</script>
