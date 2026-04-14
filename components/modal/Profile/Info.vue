<template>
  <UiBaseModal :show="show" title="Informations personnelles" @close="$emit('close')">
    <form @submit.prevent="submit" class="space-y-8 py-2">
      <!-- Information -->
      <div class="p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 flex gap-4 backdrop-blur-sm">
        <div class="shrink-0 p-2.5 bg-primary/10 rounded-xl h-fit text-primary shadow-inner">
          <IconUserCheck class="w-6 h-6" />
        </div>
        <p class="text-sm text-hsa font-medium leading-relaxed">
          Mettez à jour vos informations d'identité.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Champ Prénom -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa ml-1">Prénom</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconUserCircle class="w-5 h-5" />
            </div>
            <input v-model="form.first_name" type="text" required class="input pl-12" placeholder="Votre prénom"
              :disabled="isLoading" />
          </div>
        </div>

        <!-- Champ Nom -->
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa ml-1">Nom de famille</label>
          <div class="relative group">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
              <IconUserSquareRounded class="w-5 h-5" />
            </div>
            <input v-model="form.last_name" type="text" required class="input pl-12" placeholder="Votre nom"
              :disabled="isLoading" />
          </div>
        </div>
      </div>

      <!-- Champ Organisation -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa ml-1">Organisation / Entreprise</label>
        <div class="relative group">
          <div
            class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconBuilding class="w-5 h-5" />
          </div>
          <input v-model="form.organization_name" type="text" class="input pl-12"
            placeholder="Nom de votre organisation (ex: Ministère de...)" :disabled="isLoading" />
        </div>
      </div>

      <!-- Footer des actions -->
      <div class="pt-6 flex flex-col sm:flex-row justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" :disabled="isLoading"
          class="!rounded-2xl border-none font-bold">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="isLoading" :disabled="!isDirty"
          class="!rounded-2xl font-black tracking-widest shadow-xl">
          Enregistrer
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { IconUserCircle, IconUserSquareRounded, IconBuilding, IconUserCheck } from '@tabler/icons-vue'

// Propriétés de la modale ProfileInfo
const props = defineProps<{
  show: boolean
  isLoading: boolean
  initialData: {
    first_name: string
    last_name: string
    organization_name: string
  }
}>()

const emit = defineEmits(['close', 'submit'])

// État local du formulaire (pour manipulation réactive)
const form = reactive({
  first_name: '',
  last_name: '',
  organization_name: ''
})

/**
 * Vérifie si des modifications ont été apportées par rapport aux données initiales
 */
const isDirty = computed(() => {
  return form.first_name !== props.initialData.first_name ||
    form.last_name !== props.initialData.last_name ||
    form.organization_name !== props.initialData.organization_name
})

/**
 * Synchronise l'état local avec les données parentales
 */
const syncForm = () => {
  form.first_name = props.initialData.first_name || ''
  form.last_name = props.initialData.last_name || ''
  // Nettoie les valeurs placeholder type '-' ou 'N/A'
  form.organization_name = (props.initialData.organization_name === '-' || props.initialData.organization_name === 'N/A') ? '' : (props.initialData.organization_name || '')
}

// Resynchronisation lors de l'ouverture de la modale
watch(() => props.show, (newVal) => {
  if (newVal) syncForm()
}, { immediate: true })

/**
 * Émet les nouvelles données vers le composant parent
 */
const submit = () => {
  emit('submit', { ...form })
}
</script>
