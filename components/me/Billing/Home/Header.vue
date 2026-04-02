<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
    <div>
      <h1 class="text-2xl font-bold text-BtW tracking-tight">Facturation & abonnements</h1>
      <p class="text-hsa font-medium">
        Gérez vos abonnements, crédits et factures
      </p>
    </div>

    <div class="flex items-center gap-3">
      <UiBaseButton variant="ghost" @click="$emit('refresh')" :loading="loading">
        <template #icon>
          <IconRefresh class="w-4 h-4" />
        </template>
        Actualiser
      </UiBaseButton>
      <UiBaseButton to="/pricings" variant="primary"
        class="!rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3">
        Changer mon plan
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconRefresh } from '@tabler/icons-vue'

defineProps<{
  loading?: boolean
}>()

defineEmits(['refresh'])
</script>
