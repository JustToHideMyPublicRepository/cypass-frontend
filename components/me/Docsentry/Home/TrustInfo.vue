<template>
  <UiBaseCard class="bg-gradient-to-br from-BtW to-hsa border-none relative overflow-hidden group">
    <div class="relative z-10 space-y-3">
      <h3 class="font-bold flex items-center gap-2 text-WtB">
        <IconInfoCircle class="w-5 h-5 text-primary" />
        DocSentry Trust
      </h3>
      <p class="text-[11px] leading-relaxed text-WtB">
        Vos documents sont protégés par une signature cryptographique immuable sur la blockchain CYPASS.
      </p>
      <UiBaseButton @click="$emit('open-trust')" variant="ghost"
        class="w-full !py-2 !px-3 rounded-lg !bg-WtB/5 border border-WtB/10 !text-[10px] !font-bold !uppercase tracking-wider hover:!bg-WtB/10 transition-colors !text-WtB">
        En savoir plus
      </UiBaseButton>
    </div>
    <!-- Decorative element -->
    <div
      class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors">
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconInfoCircle } from '@tabler/icons-vue'

defineEmits(['open-trust'])
</script>
