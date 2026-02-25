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
          {{ subtitle }}
          <br>
          <span class="text-[10px] opacity-70">Ce signalement sera examiné par un administrateur.</span>
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
              <option v-for="r in currentReasons" :key="r.value" :value="r.value">{{ r.label }}</option>
            </select>
            <IconChevronDown
              class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hsa pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <!-- Détails -->
        <div class="space-y-2">
          <label class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] ml-1">Détails</label>
          <textarea v-model="form.details"
            class="textarea input h-28 pt-4 w-full p-4 rounded-xl bg-WtB border border-ash/50 font-medium text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
            rows="4" :placeholder="placeholder" required></textarea>
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
            Signaler
          </UiBaseButton>
        </div>
      </form>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { IconFlag, IconChevronDown } from '@tabler/icons-vue'
import { useVigitechStore } from '~/stores/vigitech'
import { useToastStore } from '~/stores/toast'
import { reportReasons, userReportReasons } from '~/utils/vigitech'

const props = defineProps<{
  show: boolean
  title: string
  subtitle: string
  targetId: string
  type: 'incident' | 'user'
}>()

const emit = defineEmits(['close', 'success'])
const store = useVigitechStore()
const toast = useToastStore()
const loading = ref(false)

const currentReasons = computed(() => {
  return props.type === 'user' ? userReportReasons : reportReasons
})

const placeholder = computed(() => {
  return props.type === 'user'
    ? 'Décrivez pourquoi vous signalez cet utilisateur...'
    : 'Décrivez pourquoi vous signalez cet incident...'
})

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

  let success = false
  let message = ''

  try {
    if (props.type === 'user') {
      const response: any = await $fetch('/api/profile/report', {
        method: 'POST',
        body: { reported_user_id: props.targetId, reason: form.reason, details: form.details }
      })
      success = response.success
      message = response.message
    } else {
      const result = await store.reportIncident(props.targetId, form.reason, form.details)
      success = result.success
      message = result.message
    }

    if (success) {
      toast.showToast('success', 'Signalement envoyé', message || 'Votre signalement a été transmis.')
      form.reason = ''
      form.details = ''
      emit('success')
      emit('close')
    } else {
      toast.showToast('error', 'Erreur', message || 'Impossible d\'envoyer le signalement.')
    }
  } catch (err: any) {
    toast.showToast('error', 'Erreur', err.data?.message || err.message || 'Une erreur est survenue.')
  } finally {
    loading.value = false
  }
}
</script>
