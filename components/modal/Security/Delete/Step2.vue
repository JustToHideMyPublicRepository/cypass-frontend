<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Consignes de vérification statistique -->
    <div class="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 shadow-inner">
      <p class="text-sm text-BtW font-black uppercase tracking-widest mb-2">Vérification de sécurité</p>
      <p class="text-xs text-hsa leading-relaxed font-medium">
        Pour confirmer votre identité, veuillez saisir le nombre exact d'éléments liés à votre compte.
        Actuellement : <strong class="text-primary">{{ statistics?.total_documents || 0 }}</strong>
        documents certifiés et
        <strong class="text-primary">{{ statistics?.total_incidents || 0 }}</strong> incidents reportés.
      </p>
    </div>

    <!-- Champs de saisie des statistiques -->
    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Documents</label>
        <input type="number" :value="modelValue.documents" min="0"
          @input="$emit('update:modelValue', { ...modelValue, documents: Math.max(0, Number(($event.target as HTMLInputElement).value)) })"
          @keydown="(e) => { if (e.key === '-') e.preventDefault() }" placeholder="0"
          class="input font-code text-center text-lg font-black" />
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Incidents</label>
        <input type="number" :value="modelValue.incidents" min="0"
          @input="$emit('update:modelValue', { ...modelValue, incidents: Math.max(0, Number(($event.target as HTMLInputElement).value)) })"
          @keydown="(e) => { if (e.key === '-') e.preventDefault() }" placeholder="0"
          class="input font-code text-center text-lg font-black" />
      </div>
    </div>

    <!-- Indicateur de validité -->
    <div v-if="statistics" class="text-[10px] text-center h-4">
      <span v-if="isValid"
        class="text-success font-black uppercase tracking-widest flex items-center justify-center gap-2 animate-bounce">
        <IconCheck class="w-4 h-4" /> Correspondance exacte
      </span>
      <span v-else class="text-hsa/40 font-bold uppercase tracking-widest">
        En attente de saisie exacte...
      </span>
    </div>

    <!-- Actions de l'étape 2 -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-ash/50">
      <UiBaseButton variant="ghost" @click="$emit('cancel')" v-tooltip="getLinkTooltip('modal_cancel')"
        class="!rounded-2xl border-none font-bold">
        Annuler
      </UiBaseButton>
      <UiBaseButton variant="primary" :disabled="!isValid" @click="$emit('next')"
        v-tooltip="getLinkTooltip('modal_next')" class="!rounded-2xl font-black tracking-widest shadow-xl">
        Étape finale
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from '@tabler/icons-vue'
import { getLinkTooltip } from '~/data/shortcuts'

defineProps<{
  modelValue: {
    documents: number | null
    incidents: number | null
  }
  statistics: any
  isValid: boolean
}>()

defineEmits(['update:modelValue', 'cancel', 'next'])
</script>
