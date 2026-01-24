<template>
  <UiBaseModal :show="show" title="Mot de passe oublié ?" @close="$emit('close')">
    <p class="text-hsa text-sm">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="forgot-email" class="block text-sm font-medium mb-1">Email</label>
          <div class="relative">
            <IconMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
            <input v-model="email" id="forgot-email" type="email" placeholder="nom@exemple.com" required
              class="w-full pl-12 pr-4 py-2 rounded-lg border border-ashAct focus:ring-2 focus:ring-primary focus:border-transparent bg-ash transition-shadow outline-none text-BtW" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <UiBaseButton @click="$emit('close')" variant="ghost" type="button">
            Annuler
          </UiBaseButton>
          <UiBaseButton type="submit" :loading="loading">
            Envoyer le lien
          </UiBaseButton>
        </div>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconMail } from '@tabler/icons-vue'

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
const email = ref('')

const handleSubmit = () => {
  emit('submit', email.value)
}
</script>
