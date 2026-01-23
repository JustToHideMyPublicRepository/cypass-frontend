<template>
  <UiBaseModal :show="show" title="Informations Personnelles" @close="$emit('close')">
    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Prénom -->
        <div class="space-y-3">
          <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Prénom</label>
          <div class="relative group">
            <IconUser
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ash group-focus-within:text-primary transition-colors" />
            <input v-model="form.prenom" type="text"
              class="w-full pl-12 pr-4 py-4 bg-ash/10 border border-transparent rounded-2xl focus:bg-WtB focus:border-primary/30 outline-none transition-all font-medium text-BtW"
              placeholder="Votre prénom" :disabled="isLoading" />
          </div>
        </div>

        <!-- Nom -->
        <div class="space-y-3">
          <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Nom</label>
          <div class="relative group">
            <IconUser
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ash group-focus-within:text-primary transition-colors" />
            <input v-model="form.nom" type="text"
              class="w-full pl-12 pr-4 py-4 bg-ash/10 border border-transparent rounded-2xl focus:bg-WtB focus:border-primary/30 outline-none transition-all font-medium text-BtW"
              placeholder="Votre nom" :disabled="isLoading" />
          </div>
        </div>
      </div>

      <!-- Organisation -->
      <div class="space-y-3">
        <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Organisation /
          Entreprise</label>
        <div class="relative group">
          <IconBuilding
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ash group-focus-within:text-primary transition-colors" />
          <input v-model="form.organisation" type="text"
            class="w-full pl-12 pr-4 py-4 bg-ash/10 border border-transparent rounded-2xl focus:bg-WtB focus:border-primary/30 outline-none transition-all font-medium text-BtW"
            placeholder="Nom de votre organisation" :disabled="isLoading" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3 pt-4">
        <button @click="submit" :disabled="isLoading || !isDirty"
          class="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50">
          <span v-if="!isLoading">Sauvegarder les modifications</span>
          <IconLoader v-else class="w-5 h-5 animate-spin mx-auto" />
        </button>
        <button @click="$emit('close')" :disabled="isLoading"
          class="w-full py-4 text-[10px] font-black uppercase tracking-widest text-hsa hover:text-BtW transition-colors">
          Fermer sans enregistrer
        </button>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { IconUser, IconBuilding, IconLoader } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  isLoading: boolean
  initialData: {
    prenom: string
    nom: string
    organisation: string
  }
}>()

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  prenom: '',
  nom: '',
  organisation: ''
})

const isDirty = computed(() => {
  return form.prenom !== props.initialData.prenom ||
    form.nom !== props.initialData.nom ||
    form.organisation !== props.initialData.organisation
})

const syncForm = () => {
  form.prenom = props.initialData.prenom
  form.nom = props.initialData.nom
  form.organisation = props.initialData.organisation
}

watch(() => props.show, (newVal) => {
  if (newVal) syncForm()
}, { immediate: true })

const submit = () => {
  emit('submit', { ...form })
}
</script>
