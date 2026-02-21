<template>
  <UiBaseModal :show="show" title="Déconnexion" @close="$emit('close')">
    <div class="space-y-8 py-2 animate-fade-in">
      <!-- Encadré de confirmation premium -->
      <div
        class="p-6 bg-ash/30 border-2 border-ashAct/30 rounded-[2rem] flex items-start gap-5 shadow-inner backdrop-blur-sm">
        <div class="p-3 bg-WtB rounded-2xl shadow-xl text-warning shrink-0 border border-ash/50 animate-bounce-subtle">
          <IconLogout class="w-8 h-8" />
        </div>
        <div class="space-y-2">
          <h4 class="font-black text-BtW text-lg uppercase tracking-tight">Êtes-vous sûr de vouloir partir ?</h4>
          <p class="text-sm text-hsa leading-relaxed font-medium">
            Votre session actuelle sera terminée. Vous devrez vous reconnecter pour accéder à votre espace.
          </p>
        </div>
      </div>

      <!-- Actions de sortie -->
      <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-ash/50">
        <UiBaseButton variant="ghost" @click="$emit('close')" v-tooltip="getLinkTooltip('modal_cancel')"
          class="!rounded-2xl border-none font-bold">
          Rester connecté
        </UiBaseButton>
        <UiBaseButton variant="danger" @click="$emit('confirm')" v-tooltip="getLinkTooltip('modal_confirm')" auto-focus
          class="!rounded-2xl font-black tracking-widest shadow-2xl shadow-danger/20 px-10">
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
import { getLinkTooltip } from '~/data/shortcuts'

// Propriétés de la modale de déconnexion
const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'confirm'])
const shortcutStore = useShortcutsStore()

/**
 * Gestion des raccourcis clavier pour une navigation rapide (Y/N)
 */
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

// Enregistrement des écouteurs globaux
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite ease-in-out;
}

@keyframes bounce-subtle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}
</style>
