<template>
  <UiBaseModal :show="show" title="Renvoyer l'email de vérification" @close="$emit('close')">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <p class="text-sm text-hsa">
        Veuillez entrer votre adresse email pour recevoir un nouveau lien de vérification.
      </p>

      <div class="space-y-1">
        <label class="text-xs font-bold text-hsa uppercase">Adresse Email</label>
        <div class="relative">
          <IconMail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
          <input type="email" v-model="email" required placeholder="votre@email.com"
            class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ash border border-ashAct focus:ring-2 focus:ring-primary outline-none text-BtW"
            autofocus />
        </div>
      </div>

      <div class="pt-4 flex justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading">
          Envoyer le lien
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconMail } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  loading?: boolean
  initialEmail?: string
}>()

const emit = defineEmits(['close', 'submit'])

const email = ref(props.initialEmail || '')

const handleSubmit = () => {
  if (email.value) {
    emit('submit', email.value)
  }
}
</script>
