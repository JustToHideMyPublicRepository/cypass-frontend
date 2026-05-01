<template>
  <UiBaseModal :show="show" title="Certifier un document" maxWidth="xl" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <p class="text-sm text-hsa leading-relaxed">
        Choisissez le type de certification que vous souhaitez appliquer à votre document PDF.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Option Simple -->
        <button @click="$emit('select', 'simple')"
          class="flex flex-col items-center p-6 rounded-2xl border-2 border-ash bg-ash/20 hover:border-primary/50 hover:bg-primary/5 transition-all group text-center">
          <div
            class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <IconCertificate class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-BtW mb-2">Certification simple</h4>
          <p class="text-[10px] text-hsa uppercase tracking-wider leading-relaxed">
            Attestation standard d'intégrité et d'origine.
          </p>
        </button>

        <!-- Option Enrichie -->
        <button @click="$emit('select', 'enriched')"
          class="flex flex-col items-center p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all group text-center">
          <div
            class="w-12 h-12 rounded-xl bg-primary text-WtB flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
            <IconDatabaseEdit class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-BtW mb-2">Certification enrichie</h4>
          <p class="text-[10px] text-hsa uppercase tracking-wider leading-relaxed">
            Ajoutez des métadonnées déclaratives vérifiables.
          </p>
          <div
            class="mt-3 px-2 py-0.5 rounded-full bg-primary/10 text-[8px] font-black text-primary uppercase tracking-widest">
            Recommandé
          </div>
        </button>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { IconCertificate, IconDatabaseEdit } from '@tabler/icons-vue'

defineProps<{
  show: boolean
}>()

defineEmits(['close', 'select'])
</script>
