<template>
  <UiBaseModal :show="show" title="Confirmer la déconnexion" @close="$emit('close')">
    <div class="space-y-6">
      <div class="p-4 bg-ash/30 border border-ash rounded-xl flex items-start gap-4">
        <div class="p-2 bg-WtB rounded-lg shadow-sm">
          <IconLogout class="w-6 h-6 text-warning" />
        </div>
        <div>
          <h4 class="font-bold text-BtW">Êtes-vous sûr de vouloir partir ?</h4>
          <p class="text-sm text-hsa mt-1">
            Votre session actuelle sera terminée. Vous devrez vous reconnecter pour accéder à votre espace.
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <UiBaseButton variant="ghost" @click="$emit('close')">
          <span v-if="shortcutStore.showButtonHints"
            class="mr-2 px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold">N</span>
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="danger" @click="$emit('confirm')" auto-focus>
          <span v-if="shortcutStore.showButtonHints"
            class="mr-2 px-1.5 py-0.5 rounded bg-WtB/20 text-[10px] font-bold">Y</span>
          Se déconnecter
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { IconLogout } from '@tabler/icons-vue'
import { useShortcutsStore } from '~/stores/shortcuts'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'confirm'])
const shortcutStore = useShortcutsStore()

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.show) return
  const key = e.key.toLowerCase()
  if (key === 'y') {
    e.preventDefault()
    emit('confirm')
  } else if (key === 'n') {
    e.preventDefault()
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
