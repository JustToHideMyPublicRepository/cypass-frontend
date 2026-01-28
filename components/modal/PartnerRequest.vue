<template>
  <UiBaseModal :show="show" maxWidth="2xl" title="Devenir Partenaire" @close="$emit('close')">
    <p class="text-hsa mb-6">Rejoignez l'écosystème de confiance CYPASS.</p>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-bold mb-1">Nom de l'organisation</label>
        <input v-model="form.organization_name" type="text" required class="input" placeholder="Ex: Tech Solutions" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold mb-1">Contact</label>
          <input v-model="form.contact_name" type="text" required class="input" placeholder="Nom complet" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-1">Email</label>
          <input v-model="form.email" type="email" required class="input" placeholder="email@company.com" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold mb-1">Message</label>
        <textarea v-model="form.message" class="textarea input h-24 pt-3" required
          placeholder="Décrivez votre projet de partenariat..."></textarea>
      </div>

      <div class="pt-4 flex gap-3">
        <UiBaseButton type="button" @click="$emit('close')" variant="ghost" class="flex-1">Annuler</UiBaseButton>
        <UiBaseButton type="submit" class="flex-1" :loading="loading">Envoyer la demande</UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useToastStore } from '~/stores/toast'
import { useAuthStore } from '~/stores/auth'
import { useSupportStore } from '~/stores/support'

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success'])
const toast = useToastStore()
const authStore = useAuthStore()
const supportStore = useSupportStore()
const loading = ref(false)

const form = reactive({
  organization_name: '',
  contact_name: '',
  email: '',
  message: ''
})

onMounted(() => {
  if (authStore.user) {
    form.contact_name = authStore.fullName
    form.email = authStore.user.email
  }
})

const handleSubmit = async () => {
  loading.value = true
  const response = await supportStore.partnershipRequest({
    organization_name: form.organization_name,
    contact_name: form.contact_name,
    email: form.email,
    message: form.message
  })

  if (response.success) {
    toast.showToast('success', 'Demande envoyée', response.message || 'Votre demande a été transmise avec succès.')
    // Reset form
    form.organization_name = ''
    form.contact_name = ''
    form.email = ''
    form.message = ''
    emit('success')
    emit('close')
  } else {
    toast.showToast('error', 'Erreur', response.message || 'Une erreur est survenue lors de l\'envoi.')
  }
  loading.value = false
}
</script>
