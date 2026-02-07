<template>
  <UiBaseModal :show="show" title="Email de vérification" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-6 py-2">
      <!-- Message d'instruction -->
      <p class="text-sm text-hsa font-medium leading-relaxed">
        Veuillez entrer votre adresse email pour recevoir un nouveau lien de vérification sécurisé.
      </p>

      <!-- Champ de saisie de l'email -->
      <div class="space-y-2">
        <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Adresse Email</label>
        <div class="relative group">
          <div
            class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconMail class="w-5 h-5" />
          </div>
          <input type="email" v-model="email" required placeholder="votre@email.com" class="input pl-12" autofocus />
        </div>
      </div>

      <!-- Actions de la modale -->
      <div class="pt-4 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" class="!rounded-2xl border-none">
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

// Propriétés de la modale AuthMail
const props = defineProps<{
  show: boolean
  loading?: boolean
  initialEmail?: string
}>()

const emit = defineEmits(['close', 'submit'])

// État local de l'email
const email = ref(props.initialEmail || '')

// Gestion de la soumission du formulaire
const handleSubmit = () => {
  if (email.value) {
    emit('submit', email.value)
  }
}
</script>
