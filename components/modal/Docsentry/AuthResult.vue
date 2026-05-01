<template>
  <div class="space-y-6">
    <div class="p-6 rounded-[2rem] bg-success/5 border-2 border-success/20 animate-fade-up shadow-lg shadow-success/5">
      <div class="flex items-center gap-4 text-success mb-5">
        <div class="p-2 bg-success/10 rounded-xl">
          <IconCircleCheck class="w-6 h-6" />
        </div>
        <span class="font-black text-sm tracking-widest">Document certifié avec succès</span>
      </div>

      <div class="space-y-4 text-[11px]">
        <div class="flex justify-between items-center py-2 border-b border-success/10">
          <span class="text-hsa font-bold tracking-widest">ID Document</span>
          <span class="font-code text-BtW bg-success/5 px-2 py-1 rounded-lg border border-success/10">{{
            result.document_id }}</span>
        </div>

        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between items-center group/hash">
            <span class="text-hsa font-bold tracking-widest">Hash (SHA-256)</span>
            <UiBaseButton @click="copyHash(result.doc_hash)" variant="ghost"
              class="!p-1.5 hover:!bg-primary/10 text-primary rounded-lg transition-all !h-auto !w-auto flex items-center gap-2"
              title="Copier le hash">
              <span class="text-[9px] font-black uppercase">{{ copied ? 'Copié' : 'Copier' }}</span>
              <IconCopy v-if="!copied" class="w-3.5 h-3.5" />
              <IconCheck v-else class="w-3.5 h-3.5 text-success" />
            </UiBaseButton>
          </div>
          <div
            class="font-code text-BtW break-all bg-WtB/50 p-3 rounded-xl border border-ashAct/30 leading-relaxed shadow-sm"
            :class="{ 'text-success': copied }">
            {{ result.doc_hash }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-3">
          <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20">
            <span class="text-[9px] text-hsa font-black block mb-1">Algorithme</span>
            <span class="font-black text-BtW uppercase">{{ result.cryptographic_proof.algorithm }}</span>
          </div>
          <div class="p-3 bg-ash/20 rounded-xl border border-ashAct/20 text-right">
            <span class="text-[9px] text-hsa font-black block mb-1">Empreinte Clé</span>
            <span class="font-code text-BtW">{{ result.cryptographic_proof.key_fingerprint }}</span>
          </div>
        </div>

        <div class="space-y-2 mt-2">
          <p class="text-[10px] text-hsa font-black tracking-[0.2em] ml-1">Signature Numérique</p>
          <p
            class="font-code text-[10px] text-BtW break-all bg-WtB/50 p-4 rounded-2xl border border-ashAct/30 shadow-inner">
            {{ result.cryptographic_proof.digital_signature }}
          </p>
        </div>
      </div>
    </div>

    <!-- Section Multi-version (Génération de versions enfants) -->
    <MeDocsentryDetailMultiVersionForm ref="multiVersionFormRef" :document-id="result.document_id" collapsible
      @update:loading="$emit('update:loading', $event)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCircleCheck, IconCopy, IconCheck } from '@tabler/icons-vue'

const props = defineProps<{
  result: any
}>()

const emit = defineEmits(['update:loading'])

const copied = ref(false)
const multiVersionFormRef = ref<any>(null)

const copyHash = (hash: string) => {
  navigator.clipboard.writeText(hash)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// Reset function exposed
const resetForm = () => {
  if (multiVersionFormRef.value) {
    multiVersionFormRef.value.reset()
  }
}

defineExpose({ resetForm })
</script>
