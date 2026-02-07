<template>
  <UiBaseModal :show="show" title="Mot de passe oublié" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-6 py-2">
      <!-- Instruction de réinitialisation -->
      <p class="text-hsa text-sm font-medium leading-relaxed">
        Entrez votre adresse email pour recevoir un lien de réinitialisation sécurisé.
      </p>

      <!-- Champ Email -->
      <div class="space-y-2">
        <label for="forgot-email" class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Email</label>
        <div class="relative group">
          <div
            class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconMail class="w-5 h-5" />
          </div>
          <input v-model="email" id="forgot-email" type="email" placeholder="nom@exemple.com" required
            class="input pl-12" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <UiBaseButton @click="$emit('close')" variant="ghost" type="button" class="!rounded-2xl border-none">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading" class="!rounded-2xl shadow-lg">
          Envoyer le lien
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconMail } from '@tabler/icons-vue'

// Propriétés de la modale AuthPassword
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// État local de l'email
const email = ref('')

// Gestion de la soumission
const handleSubmit = () => {
  emit('submit', email.value)
}
</script>
