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
          Annuler
        </UiBaseButton>
        <UiBaseButton variant="danger" @click="$emit('confirm')" auto-focus>
          Se déconnecter
        </UiBaseButton>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconLogout } from '@tabler/icons-vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close', 'confirm'])
</script>
