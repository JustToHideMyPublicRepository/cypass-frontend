<template>
  <div class="text-center space-y-4 mb-10">
    <div
      class="mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
      <IconMailCog class="w-8 h-8" />
    </div>
    <div class="space-y-1">
      <h1 class="text-2xl font-black text-BtW tracking-tight">Gestion Newsletter</h1>
      <p v-if="hasAccess" class="text-sm font-medium text-hsa leading-relaxed">
        Gérez vos préférences pour l'adresse <span class="text-BtW font-bold">{{ email }}</span>
      </p>
      <p v-else class="text-sm font-medium text-hsa leading-relaxed">
        Oubliez les spams, gardez uniquement ce qui vous intéresse.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMailCog } from '@tabler/icons-vue'

defineProps<{
  hasAccess: boolean
  email?: string
}>()
</script>
