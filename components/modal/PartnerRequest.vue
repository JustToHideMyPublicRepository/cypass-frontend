<template>
  <UiBaseModal :show="show" maxWidth="2xl" title="Devenir Partenaire" @close="$emit('close')">
    <div class="space-y-8 py-2 animate-fade-in">
      <!-- Introduction contextuelle -->
      <div
        class="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] flex items-center gap-5 backdrop-blur-sm shadow-inner">
        <div class="p-3 bg-primary/10 rounded-2xl text-primary shadow-lg shadow-primary/5">
          <IconWorldHeart class="w-8 h-8" />
        </div>
        <p class="text-sm text-hsa font-medium leading-relaxed">
          Rejoignez l'écosystème de confiance <strong class="text-BtW">CYPASS</strong>.
          Ensemble, bâtissons les standards de la souveraineté numérique.
        </p>
      </div>

      <!-- Formulaire de demande de partenariat -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-5">
          <!-- Champ Organisation -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Organisation /
              Institution</label>
            <div class="relative group">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                <IconBuildingSkyscraper class="w-5 h-5" />
              </div>
              <input v-model="form.organization_name" type="text" required class="input pl-12"
                placeholder="Ex: Cyber Solutions" />
            </div>
          </div>

          <!-- Champs de contact (Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Représentant</label>
              <div class="relative group">
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                  <IconUserCircle class="w-5 h-5" />
                </div>
                <input v-model="form.contact_name" type="text" required class="input pl-12" placeholder="Nom complet" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Email Professionnel</label>
              <div class="relative group">
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                  <IconMail class="w-5 h-5" />
                </div>
                <input v-model="form.email" type="email" required class="input pl-12" placeholder="email@company.com" />
              </div>
            </div>
          </div>

          <!-- Zone de Message/Projet -->
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Vision du partenariat</label>
            <textarea v-model="form.message" class="textarea input h-32 pt-4" required
              placeholder="Décrivez brièvement votre projet ou vos objectifs avec CYPASS..."></textarea>
          </div>
        </div>

        <!-- Actions du formulaire -->
        <div class="pt-6 flex flex-col sm:flex-row gap-4">
          <UiBaseButton type="button" @click="$emit('close')" variant="ghost"
            class="flex-1 !rounded-2xl font-bold border-none">
            Plus tard
          </UiBaseButton>
          <UiBaseButton type="submit"
            class="flex-1 !rounded-2xl font-black tracking-widest shadow-xl px-10 shadow-primary/10" :loading="loading">
            Transmettre
          </UiBaseButton>
        </div>
      </form>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { IconWorldHeart, IconBuildingSkyscraper, IconUserCircle, IconMail } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/toast'
import { useAuthStore } from '~/stores/auth'
import { useSupportStore } from '~/stores/support'

// Propriétés de la modale de partenariat
defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success'])
const toast = useToastStore()
const authStore = useAuthStore()
const supportStore = useSupportStore()
const loading = ref(false)

// État local du formulaire de partenariat
const form = reactive({
  organization_name: '',
  contact_name: '',
  email: '',
  message: ''
})

// Pré-remplit le formulaire avec les données de l'utilisateur connecté si disponible
onMounted(() => {
  if (authStore.user) {
    form.contact_name = authStore.fullName
    form.email = authStore.user.email
  }
})

// Gère la soumission de la demande de partenariat vers l'API support
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
    // Réinitialisation du formulaire après succès
    form.organization_name = ''
    form.contact_name = ''
    form.email = ''
    form.message = ''
    emit('success')
    emit('close')
  } else {
    toast.showToast('error', 'Échec de transmission', response.message || 'Une erreur système est survenue lors de l\'envoi.')
  }
  loading.value = false
}
</script>
