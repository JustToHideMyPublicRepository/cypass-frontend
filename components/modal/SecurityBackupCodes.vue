<template>
  <UiBaseModal :show="show" title="Vos codes de secours" @close="$emit('close')" width="max-w-md">
    <div class="space-y-6">
      <div class="p-4 bg-warning/5 border border-warning/10 rounded-2xl flex items-start gap-4">
        <div class="p-2 bg-warning/10 rounded-xl shrink-0">
          <IconAlertTriangle class="w-6 h-6 text-warning" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-BtW mb-1">Information importante</h4>
          <p class="text-xs text-hsa leading-relaxed">
            Chaque code ne peut être utilisé qu'une seule fois. Conservez-les dans un endroit sûr et secret (physique ou
            gestionnaire de mots de passe).
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div v-for="(code, index) in codes" :key="index"
          class="flex items-center justify-between p-4 rounded-2xl bg-ash border border-ashAct group relative overflow-hidden transition-all hover:border-primary/30">
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <code class="font-mono font-black text-BtW text-lg tracking-[0.2em] relative z-10">
            {{ revealedCodes[index] ? code : '•••• •••• ••••' }}
          </code>
          <div class="flex items-center gap-1 relative z-10">
            <button @click="toggleReveal(index)" class="p-2 text-hsa hover:text-primary transition-colors"
              title="Afficher/Masquer">
              <IconEye v-if="!revealedCodes[index]" class="w-5 h-5" />
              <IconEyeOff v-else class="w-5 h-5" />
            </button>
            <button @click="copy(code, index)" class="p-2 text-hsa hover:text-success transition-colors" title="Copier">
              <IconCheck v-if="copiedIndex === index" class="w-5 h-5" />
              <IconCopy v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t border-ash/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-0.5 text-center sm:text-left">
          <p class="text-[10px] font-black uppercase text-hsa tracking-widest opacity-60">Expiration des codes</p>
          <p class="text-xs font-bold text-BtW italic">{{ formatDate(expiresAt) }}</p>
        </div>
        <UiBaseButton variant="secondary" size="sm" class="!rounded-xl font-bold py-2.5 px-4 h-auto" :loading="loading"
          @click="$emit('reset')">
          <IconRefresh class="w-4 h-4 mr-2" />
          Régénérer les codes
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconAlertTriangle, IconEye, IconEyeOff, IconCopy, IconCheck, IconRefresh } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  show: boolean
  codes: string[]
  expiresAt: string
  loading?: boolean
}>()

const emit = defineEmits(['close', 'reset'])

const revealedCodes = ref<boolean[]>([])
const copiedIndex = ref<number | null>(null)

watch(() => props.codes, (newCodes) => {
  if (newCodes?.length) {
    revealedCodes.value = new Array(newCodes.length).fill(false)
  }
}, { immediate: true })

const toggleReveal = (index: number) => {
  revealedCodes.value[index] = !revealedCodes.value[index]
}

const copy = (code: string, index: number) => {
  navigator.clipboard.writeText(code)
  copiedIndex.value = index
  setTimeout(() => copiedIndex.value = null, 2000)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Jamais'
  try {
    return format(new Date(dateString), 'd MMMM yyyy HH:mm', { locale: fr })
  } catch {
    return 'Jamais'
  }
}
</script>
