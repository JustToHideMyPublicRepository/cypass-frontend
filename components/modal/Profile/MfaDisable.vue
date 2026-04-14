<template>
  <UiBaseModal :show="show" title="Suspendre le MFA" max-width="sm" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Alerte de sécurité premium -->
      <div class="p-5 rounded-[1.5rem] bg-warning/5 border border-warning/20 backdrop-blur-sm">
        <div class="flex gap-4">
          <div class="shrink-0 p-2.5 bg-warning/10 rounded-xl h-fit text-warning shadow-inner">
            <IconAlertTriangle class="w-6 h-6" />
          </div>
          <p class="text-sm text-hsa font-medium leading-relaxed">
            Pour votre sécurité, le MFA ne peut pas être désactivé définitivement.
            Veuillez choisir une durée de suspension.
          </p>
        </div>
      </div>

      <div class="text-center space-y-5">
        <div class="grid grid-cols-4 gap-2">
          <button v-for="days in [1, 2, 3, 7]" :key="days" @click="selectedDays = days"
            class="p-3 rounded-xl border-2 transition-all font-bold text-sm"
            :class="selectedDays === days ? 'border-primary bg-primary/5 text-primary' : 'border-hsa/30 hover:border-hsa/50 text-hsa hover:bg-hsa/5'">
            {{ days }}j
          </button>
        </div>

        <p class="text-[10px] text-hsa opacity-60 italic">
          Le MFA se réactivera automatiquement le <br />
          <span class="text-BtW not-italic font-bold">{{ reactivationDate }}</span>
        </p>

        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-ash/30">
          <UiBaseButton variant="ghost" class="flex-1 order-2 sm:order-1 !rounded-2xl font-bold py-4 h-auto border-none"
            @click="$emit('close')">
            Garder
          </UiBaseButton>
          <UiBaseButton variant="warning"
            class="flex-1 order-1 sm:order-2 !rounded-2xl font-black py-4 h-auto shadow-lg" :loading="loading"
            @click="handleConfirm">
            Suspendre
          </UiBaseButton>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconAlertTriangle } from '@tabler/icons-vue'

const props = defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const selectedDays = ref(3)

const reactivationDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + selectedDays.value)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
})

const handleConfirm = () => {
  emit('confirm', selectedDays.value)
}
</script>
