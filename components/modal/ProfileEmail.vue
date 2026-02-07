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
              class="input pl-12" />
          </div>
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
        <UiBaseButton type="submit" variant="primary" :loading="loading"
          class="!rounded-2xl font-black tracking-widest shadow-xl">
          Confirmer
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconMail, IconLock, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-vue'

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

// Gestion de la soumission sécurisée
const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
