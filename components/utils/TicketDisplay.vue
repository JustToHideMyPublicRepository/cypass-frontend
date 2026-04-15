<template>
  <div v-if="ticket" class="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between gap-4 mt-2 mb-2 transition-all">
    <div class="flex items-center gap-3 overflow-hidden">
      <div class="p-2 bg-primary/20 rounded-lg text-primary shrink-0">
        <IconTicket class="w-6 h-6" />
      </div>
      <div class="min-w-0">
        <p class="text-xs text-hsa font-medium uppercase tracking-wider mb-0.5">Numéro de ticket</p>
        <p class="text-sm md:text-base font-bold text-BtW font-mono truncate">{{ ticket }}</p>
      </div>
    </div>
    <button type="button" @click="copyTicket" class="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors flex shrink-0 bg-primary/5" title="Copier le numéro">
      <IconCopy v-if="!copied" class="w-5 h-5" />
      <IconCheck v-else class="w-5 h-5 text-green-500" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconTicket, IconCopy, IconCheck } from '@tabler/icons-vue'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  ticket: string | null
}>()

const toast = useToastStore()
const copied = ref(false)

const copyTicket = async () => {
  if (!props.ticket) return
  try {
    await navigator.clipboard.writeText(props.ticket)
    copied.value = true
    toast.showToast('success', 'Copié', 'Numéro de ticket copié dans le presse-papiers.')
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    toast.showToast('error', 'Erreur', 'Impossible de copier le ticket.')
  }
}
</script>
