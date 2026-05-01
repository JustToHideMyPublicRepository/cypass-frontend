<template>
  <UiBaseModal :show="show" title="Catégories de documents enrichis" maxWidth="2xl" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <div class="flex flex-col md:flex-row gap-6 items-start">
        <div
          class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5 border border-primary/10">
          <IconListDetails class="w-10 h-10" />
        </div>

        <div class="flex-1 space-y-2">
          <h3 class="text-lg font-black text-BtW">Certification enrichie</h3>
          <p class="text-xs text-hsa leading-relaxed">
            La certification enrichie permet d'associer des métadonnées déclaratives à vos documents. Lors de la
            vérification, ces données s'afficheront pour permettre un contrôle visuel direct avec le document physique.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="category in store.enrichmentCategories" :key="category.key"
          class="p-4 bg-ash/30 rounded-2xl border border-ash/50 hover:border-primary/30 transition-all group">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-WtB transition-colors">
              <component :is="getIconByCategory(category.key)" class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-BtW">{{ category.label }}</h4>
          </div>

          <div class="space-y-2">
            <div v-for="field in category.fields" :key="field.key"
              class="flex items-center justify-between text-[11px]">
              <span class="text-hsa font-medium">{{ field.label }}</span>
              <span v-if="field.required" class="text-[9px] uppercase font-black text-primary/70">Requis</span>
              <span v-else class="text-[9px] uppercase font-black text-hsa/50 italic">Optionnel</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
        <IconBulb class="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div class="space-y-1">
          <p class="text-xs font-bold text-BtW">Comment ça marche ?</p>
          <p class="text-[11px] text-hsa leading-relaxed">
            Choisissez une catégorie lors de l'envoi de votre document, remplissez les champs correspondants et CYPASS
            générera une preuve cryptographique incluant ces informations.
          </p>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import {  IconListDetails,  IconSchool,  IconFileCertificate,  IconClipboardText,  IconFileText,  IconBulb } from '@tabler/icons-vue'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = usePublicDocsentryStore()

const getIconByCategory = (key: string) => {
  switch (key) {
    case 'diplome': return IconSchool
    case 'attestation': return IconFileCertificate
    case 'certificat': return IconClipboardText
    case 'releve_notes': return IconFileText
    default: return IconFileText
  }
}
</script>
