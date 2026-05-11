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

      <!-- Champ Organisation (Liste déroulante de visualisation) -->
      <div class="space-y-3">
        <label class="text-[10px] font-black uppercase tracking-[0.2em] text-hsa ml-1">Mes Organisations / Espaces</label>
        <div class="relative group">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-hsa pointer-events-none">
            <IconBuilding class="w-5 h-5" />
          </div>
          <select class="input pl-12 pr-10 appearance-none w-full cursor-pointer bg-ash/5 text-sm font-bold border-ash/20 hover:border-primary/50 transition-colors"
            :value="form.organization_name && form.organization_name.length > 0 ? form.organization_name[0] : ''"
            title="Vos organisations sont synchronisées automatiquement">
            <option v-if="!form.organization_name || form.organization_name.length === 0" value="">Aucune organisation rattachée</option>
            <option v-else v-for="ws in form.organization_name" :key="ws" :value="ws">{{ ws }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-hsa pointer-events-none">
            <IconChevronDown class="w-4 h-4" />
          </div>
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
import { IconUserCircle, IconUserSquareRounded, IconBuilding, IconUserCheck, IconChevronDown } from '@tabler/icons-vue'

// Propriétés de la modale ProfileInfo
const props = defineProps<{
  show: boolean
  isLoading: boolean
  initialData: {
    first_name: string
    last_name: string
    organization_name: string[]
  }
}>()

const emit = defineEmits(['close', 'submit'])

// État local du formulaire (pour manipulation réactive)
const form = reactive({
  first_name: '',
  last_name: '',
  organization_name: [] as string[]
})

/**
 * Vérifie si des modifications ont été apportées par rapport aux données initiales
 */
const isDirty = computed(() => {
  return form.first_name !== props.initialData.first_name ||
    form.last_name !== props.initialData.last_name
})

/**
 * Synchronise l'état local avec les données parentales
 */
const syncForm = () => {
  form.first_name = props.initialData.first_name || ''
  form.last_name = props.initialData.last_name || ''

  const rawOrg = props.initialData.organization_name
  if (Array.isArray(rawOrg)) {
    form.organization_name = rawOrg
  } else if (typeof rawOrg === 'string' && (rawOrg as string).trim() !== '' && (rawOrg as string) !== '-' && (rawOrg as string) !== 'N/A') {
    // Cas de transition ou anciennes données : on transforme la chaîne en tableau
    form.organization_name = (rawOrg as string).includes(',') ? (rawOrg as string).split(',').map((s: string) => s.trim()) : [(rawOrg as string)]
  } else {
    form.organization_name = []
  }
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
