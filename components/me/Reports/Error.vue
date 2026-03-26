<template>
  <div class="text-center py-20 bg-ash/10 rounded-[2.5rem] border-2 border-dashed border-ashAct">
    <IconBug class="w-16 h-16 mx-auto mb-4 opacity-10 text-danger" />
    <h3 class="text-xl font-black text-BtW">Chargement impossible</h3>
    <p class="text-xs text-hsa font-bold mt-2">
      Nous ne parvenons pas à charger vos rapports pour le moment.
    </p>
    <UiBaseButton @click="$emit('retry')" variant="ghost" size="sm" class="mt-8 !rounded-xl border-ashAct">
      <IconRefresh class="w-4 h-4 mr-2" />
      Réessayer
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
import { IconBug, IconRefresh } from '@tabler/icons-vue'

defineProps<{
  error?: string
}>()

defineEmits(['retry'])
</script>
