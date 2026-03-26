<template>
  <UiBaseModal :show="show" maxWidth="lg" title="Signaler cet utilisateur" @close="$emit('close')">
    <div class="space-y-6 py-2 animate-fade-in">
      <!-- Contexte -->
      <div
        class="p-5 bg-danger/5 border border-danger/20 rounded-[2rem] flex items-center gap-4 backdrop-blur-sm shadow-inner">
        <div class="p-3 bg-danger/10 rounded-2xl text-danger shadow-lg shadow-danger/5">
          <IconFlag class="w-7 h-7" />
        </div>
        <p class="text-sm text-hsa font-medium leading-relaxed">
          Ce signalement sera examiné par un <strong class="text-BtW">administrateur</strong>.
          Aidez-nous à modérer la plateforme en signalant les comportements inappropriés.
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
              <option v-for="r in userReportReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
            <IconChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <!-- Détails -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Détails</label>
          <div class="relative">
            <textarea v-model="form.details"
              class="w-full p-4 pb-10 rounded-xl bg-WtB border border-ash/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner"
              rows="4" maxlength="1000" placeholder="Décrivez pourquoi vous signalez cet utilisateur..."
              required></textarea>
            <div class="absolute bottom-3 right-4 text-[10px] font-black tracking-widest"
              :class="form.details.length > 900 ? (form.details.length >= 1000 ? 'text-danger' : 'text-warning') : 'text-hsa/50'">
              {{ form.details.length }} / 1000
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <UiBaseButton type="button" @click="$emit('close')" variant="ghost"
            class="flex-1 !rounded-2xl font-bold border-none">
            Annuler
          </UiBaseButton>
          <UiBaseButton type="submit"
            class="flex-1 !rounded-2xl font-black tracking-widest shadow-xl px-10 !bg-danger hover:!bg-danger/90"
            :loading="loading" :disabled="!form.reason || !form.details.trim()">
            Signaler
          </UiBaseButton>
        </div>
      </form>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { IconFlag, IconChevronDown } from '@tabler/icons-vue'
import { useReportUserStore } from '~/stores/back/user/reportUser'
import { useToastStore } from '~/stores/front/toast'
import { userReportReasons } from '~/utils/vigitech'

const props = defineProps<{
  show: boolean
  targetId: string
}>()

const emit = defineEmits(['close', 'success'])
const store = useUserVigitechStore()
const reportUserStore = useReportUserStore()
const toast = useToastStore()
const loading = ref(false)

// Payload de signalement
const form = reactive({
  reason: '',
  details: ''
})

/**
 * Envoie le signalement
 */
const handleSubmit = async () => {
  if (!form.reason) return
  loading.value = true

  try {
    const success = await reportUserStore.reportUser(props.targetId, form.reason, form.details)

    if (success) {
      toast.showToast('success', 'Signalement envoyé', reportUserStore.message || 'Votre signalement a été transmis.')
      form.reason = ''
      form.details = ''
      emit('success')
      emit('close')
    } else {
      toast.showToast('error', 'Erreur', reportUserStore.error || 'Impossible d\'envoyer le signalement.')
    }
  } catch (err: any) {
    toast.showToast('error', 'Erreur', err.data?.message || err.message || 'Une erreur est survenue.')
  } finally {
    loading.value = false
  }
}
</script>
