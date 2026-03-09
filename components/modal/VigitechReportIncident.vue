<template>
  <UiBaseModal :show="show" maxWidth="lg" :title="title" @close="$emit('close')">
    <div class="space-y-6 py-2 animate-fade-in">
      <!-- Contexte -->
      <div
        class="p-5 bg-danger/5 border border-danger/20 rounded-[2rem] flex items-center gap-4 backdrop-blur-sm shadow-inner">
        <div class="p-3 bg-danger/10 rounded-2xl text-danger shadow-lg shadow-danger/5">
          <IconFlag class="w-7 h-7" />
        </div>
        <p class="text-sm text-hsa font-medium leading-relaxed">
          Ce signalement sera examiné par un <strong class="text-BtW">administrateur</strong>.
          L'incident pourra être masqué si jugé inapproprié.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Raison -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Motif du signalement</label>
          <div class="relative group">
            <select v-model="form.reason" required
              class="w-full h-12 px-4 rounded-xl bg-WtB border border-ash/50 font-bold text-sm outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
              <option value="" disabled>Sélectionnez un motif</option>
              <option v-for="r in reportReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
            <IconChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <!-- Détails -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Détails
            <span class="text-hsa/50"></span></label>
          <textarea v-model="form.details" class="textarea input h-28 pt-4" rows="4"
            placeholder="Décrivez pourquoi vous signalez cet incident..." required></textarea>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <UiBaseButton type="button" @click="$emit('close')" variant="ghost"
            class="flex-1 !rounded-2xl font-bold border-none">
            Annuler
          </UiBaseButton>
          <UiBaseButton type="submit"
            class="flex-1 !rounded-2xl font-black tracking-widest shadow-xl px-10 shadow-danger/10 !bg-danger hover:!bg-danger/90"
            :loading="loading" :disabled="!form.reason">
            {{ isEditMode ? 'Enregistrer' : 'Signaler' }}
          </UiBaseButton>
        </div>
      </form>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { IconFlag, IconChevronDown } from '@tabler/icons-vue'
import { useReportIncidentStore } from '~/stores/back/user/reportIncident'
import { useToastStore } from '~/stores/front/toast'
import { reportReasons } from '~/utils/vigitech'

const props = defineProps<{
  show: boolean
  incidentId: string
  report?: any
}>()

const isEditMode = computed(() => !!props.report)
const title = computed(() => isEditMode.value ? 'Modifier le signalement' : 'Signaler cet incident')

const emit = defineEmits(['close', 'success'])
const reportIncidentStore = useReportIncidentStore()
const toast = useToastStore()
const loading = ref(false)

// Payload de signalement
const form = reactive({
  reason: '',
  details: ''
})

// Pré-remplissage en mode édition
watch(() => props.show, (isVisible) => {
  if (isVisible && props.report) {
    form.reason = props.report.reason || ''
    form.details = props.report.details || ''
  } else if (!isVisible) {
    form.reason = ''
    form.details = ''
  }
})

/**
 * Envoie le signalement (Création ou Modification)
 */
const handleSubmit = async () => {
  if (!form.reason) return
  loading.value = true

  let result: any = null
  if (isEditMode.value && props.report) {
    result = true
  } else {
    result = await reportIncidentStore.reportIncident(props.incidentId, form.reason, form.details)
  }

  // Handle boolean vs object result
  const success = typeof result === 'boolean' ? result : result?.success

  if (success) {
    toast.showToast('success', isEditMode.value ? 'Signalement mis à jour' : 'Signalement envoyé', reportIncidentStore.message || 'Action effectuée avec succès.')
    form.reason = ''
    form.details = ''
    emit('success')
    emit('close')
  } else {
    toast.showToast('error', 'Erreur', reportIncidentStore.error || 'Impossible d\'effectuer l\'action.')
  }
  loading.value = false
}
</script>
