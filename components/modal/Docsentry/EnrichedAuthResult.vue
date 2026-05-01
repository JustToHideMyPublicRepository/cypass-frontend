<template>
  <div class="space-y-6">
    <div class="p-6 rounded-[2rem] bg-primary/5 border-2 border-primary/20 animate-fade-up shadow-lg shadow-primary/5">
      <div class="flex items-center gap-4 text-primary mb-5">
        <div class="p-2 bg-primary/10 rounded-xl">
          <IconCircleCheck class="w-6 h-6" />
        </div>
        <span class="font-black text-sm tracking-widest uppercase">Certification enrichie réussie</span>
      </div>

      <div class="space-y-5 text-[11px]">
        <!-- IDs et Hash -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-primary/10 pb-5">
          <div class="space-y-1">
            <span class="text-hsa font-bold tracking-widest uppercase text-[9px]">ID Document</span>
            <div class="font-code text-BtW bg-primary/5 px-2 py-1.5 rounded-lg border border-primary/10 truncate">
              {{ result.document_id }}
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-hsa font-bold tracking-widest uppercase text-[9px]">Catégorie</span>
            <div class="font-bold text-primary flex items-center gap-2 bg-primary/5 px-2 py-1.5 rounded-lg border border-primary/10">
              <component :is="getDocCategoryIcon(category?.key)" class="w-3.5 h-3.5" />
              {{ category?.label }}
            </div>
          </div>
        </div>

        <!-- Métadonnées certifiées -->
        <div v-if="Object.keys(metadata).length > 0" class="space-y-3 p-4 bg-ash/20 rounded-2xl border border-ashAct/20">
          <span class="text-[9px] text-hsa font-black uppercase tracking-widest flex items-center gap-2">
            <IconDatabase class="w-3 h-3" />
            Métadonnées Certifiées
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <div v-for="(value, key) in metadata" :key="key" class="flex flex-col">
              <span class="text-[9px] text-hsa/70 font-bold uppercase truncate">{{ getFieldLabel(key) }}</span>
              <span class="text-BtW font-medium truncate">{{ value || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Empreinte Digitale -->
        <div class="space-y-2 pt-1 border-t border-primary/10">
          <div class="flex justify-between items-center px-1">
            <span class="text-hsa font-bold tracking-widest uppercase text-[9px]">Hash (SHA-256)</span>
            <UiBaseButton @click="copyHash(result.doc_hash)" variant="ghost"
              class="!p-1.5 hover:!bg-primary/10 text-primary rounded-lg transition-all !h-auto !w-auto flex items-center gap-2">
              <span class="text-[9px] font-black uppercase">{{ copied ? 'Copié' : 'Copier' }}</span>
              <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
              <IconCheck v-else class="w-3.5 h-3.5 text-success" />
            </UiBaseButton>
          </div>
          <div class="font-code text-BtW break-all bg-WtB/50 p-3 rounded-xl border border-ashAct/30 leading-relaxed shadow-sm">
            {{ result.doc_hash }}
          </div>
        </div>

        <!-- Preuve Cryptographique -->
        <div class="space-y-2 mt-2">
          <p class="text-[9px] text-hsa font-black tracking-[0.2em] uppercase ml-1">Signature Numérique Souveraine</p>
          <p class="font-code text-[9px] text-BtW break-all bg-WtB/50 p-4 rounded-2xl border border-ashAct/30 shadow-inner leading-relaxed">
            {{ result.cryptographic_proof.digital_signature }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCircleCheck, IconCopy, IconCheck, IconDatabase } from '@tabler/icons-vue'
import { getDocCategoryIcon } from '~/utils/docsentry'

const props = defineProps<{
  result: any
  category: any
  metadata: Record<string, any>
}>()

const copied = ref(false)

const getFieldLabel = (key: string) => {
  const field = props.category?.fields.find((f: any) => f.key === key)
  return field ? field.label : key
}

const copyHash = (hash: string) => {
  navigator.clipboard.writeText(hash)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>
