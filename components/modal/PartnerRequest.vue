<template>
  <UiBaseModal :show="show" maxWidth="2xl" title="Devenir Partenaire" @close="$emit('close')">
    <p class="text-hsa mb-6">Rejoignez l'écosystème de confiance CYPASS.</p>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-bold mb-1">Nom de l'organisation</label>
        <input type="text" required class="input" placeholder="Ex: Tech Solutions" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold mb-1">Contact</label>
          <input type="text" required class="input" placeholder="Nom complet" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-1">Email</label>
          <input type="email" required class="input" placeholder="email@company.com" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold mb-1">Message</label>
        <textarea class="textarea input h-24 pt-3" placeholder="Décrivez votre projet de partenariat..."></textarea>
      </div>

      <div class="pt-4 flex gap-3">
        <UiBaseButton type="button" @click="$emit('close')" variant="ghost" class="flex-1">Annuler</UiBaseButton>
        <UiBaseButton type="submit" class="flex-1" :loading="loading">Envoyer la demande</UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  emit('submit')
  // Simulated delay for UI feedback
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
}
</script>
