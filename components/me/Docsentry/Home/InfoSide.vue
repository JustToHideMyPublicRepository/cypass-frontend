<template>
  <UiBaseCard class="bg-gradient-to-br from-BtW to-hsa border-none relative overflow-hidden group">
    <div class="relative z-10 space-y-4">
      <!-- Section Trust -->
      <div class="space-y-2">
        <h3 class="font-bold flex items-center gap-2 text-WtB text-[13px]">
          <IconInfoCircle class="w-4 h-4 text-primary" />
          DocTrust
        </h3>
        <p class="text-[11px] leading-relaxed text-WtB/80">
          Vos documents sont protégés par une signature cryptographique immuable sur la blockchain CYPASS.
        </p>
        <UiBaseButton @click="$emit('open-trust')" variant="ghost"
          class="w-full !py-2 !px-3 rounded-lg !bg-WtB/5 border border-WtB/10 !text-[10px] !font-bold !uppercase tracking-wider hover:!bg-WtB/10 transition-colors !text-WtB">
          Certificat de confiance
        </UiBaseButton>
      </div>

      <div class="border-t border-WtB/10 pt-4 space-y-2">
        <h3 class="font-bold flex items-center gap-2 text-WtB text-[13px]">
          <IconDatabaseEdit class="w-4 h-4 text-primary" />
          Certif. enrichie
        </h3>
        <p class="text-[11px] leading-relaxed text-WtB/80">
          Ajoutez des métadonnées pour une comparaison manuelle simplifiée lors de la vérification.
        </p>
        <UiBaseButton @click="$emit('open-categories')" variant="ghost"
          class="w-full !py-2 !px-3 rounded-lg !bg-WtB/5 border border-WtB/10 !text-[10px] !font-bold !uppercase tracking-wider hover:!bg-WtB/10 transition-colors !text-WtB">
          Voir les catégories
        </UiBaseButton>
      </div>
    </div>

    <!-- Decorative element -->
    <div
      class="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-colors">
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconInfoCircle, IconDatabaseEdit } from '@tabler/icons-vue'

defineEmits(['open-trust', 'open-categories'])
</script>
