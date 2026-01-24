<template>
  <UiBaseModal :show="show" title="Informations Personnelles" @close="$emit('close')">
    <form @submit.prevent="submit" class="space-y-6">
      <!-- Information Box -->
      <div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
        <div class="shrink-0 p-2 bg-primary/10 rounded-lg h-fit">
          <IconUserCheck class="w-5 h-5 text-primary" />
        </div>
        <p class="text-sm text-hsa leading-relaxed">
          Mettez à jour vos informations d'identité. Ces données sont utilisées pour la génération de vos certificats et
          documents officiels.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Prénom -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60 ml-1">Prénom</label>
          <div class="relative group">
            <IconUserCircle
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa group-focus-within:text-primary transition-colors" />
            <input v-model="form.first_name" type="text" required
              class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-ash border border-transparent focus:bg-WtB focus:border-primary/30 outline-none text-BtW transition-all font-medium placeholder:text-hsa/30"
              placeholder="Votre prénom" :disabled="isLoading" />
          </div>
        </div>

        <!-- Nom -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60 ml-1">Nom de
            famille</label>
          <div class="relative group">
            <IconUserSquareRounded
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa group-focus-within:text-primary transition-colors" />
            <input v-model="form.last_name" type="text" required
              class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-ash border border-transparent focus:bg-WtB focus:border-primary/30 outline-none text-BtW transition-all font-medium placeholder:text-hsa/30"
              placeholder="Votre nom" :disabled="isLoading" />
          </div>
        </div>
      </div>

      <!-- Organisation -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60 ml-1">Organisation /
          Entreprise</label>
        <div class="relative group">
          <IconBuilding
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa group-focus-within:text-primary transition-colors" />
          <input v-model="form.organization_name" type="text"
            class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-ash border border-transparent focus:bg-WtB focus:border-primary/30 outline-none text-BtW transition-all font-medium placeholder:text-hsa/30"
            placeholder="Nom de votre organisation (ex: Ministère de...)" :disabled="isLoading" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-6 flex justify-end gap-3">
        <UiBaseButton variant="ghost" type="button" @click="$emit('close')" :disabled="isLoading">
          Annuler
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary" :loading="isLoading" :disabled="!isDirty">
          Enregistrer les modifications
        </UiBaseButton>
      </div>
    </form>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'
import { IconUserCircle, IconUserSquareRounded, IconBuilding, IconUserCheck } from '@tabler/icons-vue'

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

const form = reactive({
  first_name: '',
  last_name: '',
  organization_name: ''
})

const isDirty = computed(() => {
  return form.first_name !== props.initialData.first_name ||
    form.last_name !== props.initialData.last_name ||
    form.organization_name !== props.initialData.organization_name
})

const syncForm = () => {
  form.first_name = props.initialData.first_name || ''
  form.last_name = props.initialData.last_name || ''
  form.organization_name = (props.initialData.organization_name === '-' || props.initialData.organization_name === 'N/A') ? '' : (props.initialData.organization_name || '')
}

watch(() => props.show, (newVal) => {
  if (newVal) syncForm()
}, { immediate: true })

const submit = () => {
  emit('submit', { ...form })
}
</script>
