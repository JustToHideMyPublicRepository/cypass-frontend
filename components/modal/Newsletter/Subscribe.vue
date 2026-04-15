<template>
  <UiBaseModal :show="show" title="S'inscrire à la Newsletter" @close="$emit('close')">
    <form @submit.prevent="submit" class="space-y-6 py-2">
      <p class="text-sm text-hsa font-medium leading-relaxed">
        Restez informé(e) des dernières actualités, des mises à jour de sécurité et de nos offres exclusives.
      </p>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Prénom</label>
            <div class="relative group">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                <IconUser class="w-5 h-5" />
              </div>
              <input type="text" v-model="form.first_name" placeholder="Jean" class="input pl-12" />
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Nom</label>
            <div class="relative group">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
                <IconUser class="w-5 h-5" />
              </div>
              <input type="text" v-model="form.last_name" placeholder="Dupont" class="input pl-12" />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Adresse Email <span class="text-error">*</span></label>
          <div class="relative group">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconMail class="w-5 h-5" />
            </div>
            <input type="email" v-model="form.email" required placeholder="votre.email@exemple.com" class="input pl-12" autofocus />
          </div>
        </div>
      </div>

      <div class="pt-4 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" class="!rounded-2xl border-none">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="loading" class="!rounded-2xl shadow-lg min-w-[140px]">
          S'inscrire
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconMail, IconUser } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/front/toast'
import { usePublicNewsletterStore } from '~/stores/back/public/newsletter'

defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const loading = ref(false)
const toast = useToastStore()
const newsletterStore = usePublicNewsletterStore()

const form = ref({
  first_name: '',
  last_name: '',
  email: ''
})

const submit = async () => {
  if (!form.value.email) {
    toast.showToast('error', 'Erreur', 'L\'adresse email est requise.')
    return
  }

  loading.value = true
  try {
    const payload = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email
    }

    const response = await newsletterStore.subscribe(payload)

    if (response?.success) {
      toast.showToast('success', 'Succès', response.message || 'Un email de confirmation vous a été envoyé.')
      form.value = { first_name: '', last_name: '', email: '' }
      emit('close')
    } else {
      toast.showToast('error', 'Erreur', response?.message || 'Une erreur est survenue.')
    }
  } catch (e: any) {
    const msg = e.response?._data?.message || e.message || 'Erreur lors de l\'inscription.'
    toast.showToast('error', 'Erreur', msg)
  } finally {
    loading.value = false
  }
}
</script>
