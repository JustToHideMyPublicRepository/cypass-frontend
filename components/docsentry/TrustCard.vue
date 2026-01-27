<template>
  <UiBaseModal :show="show" title="Certificat de Confiance" maxWidth="2xl" @close="$emit('close')">
    <div v-if="store.publicKeyInfo" class="flex flex-col md:flex-row gap-6 items-start py-2">
      <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
        <IconCertificate class="w-10 h-10" />
      </div>

      <div class="flex-1 space-y-4">
        <div>
          <h3 class="text-lg font-black text-BtW flex items-center gap-2">
            Certificat de Confiance National
            <span class="badge badge-success !text-[10px]">Actif</span>
          </h3>
          <p class="text-xs text-hsa">{{ store.publicKeyInfo.usage }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-3 bg-ash/30 rounded-xl border border-ash/50">
            <p class="text-[9px] text-hsa uppercase font-black mb-1">Organisation Émettrice</p>
            <p class="font-bold text-BtW text-xs">{{ store.publicKeyInfo.organization }}</p>
          </div>
          <div class="p-3 bg-ash/30 rounded-xl border border-ash/50">
            <p class="text-[9px] text-hsa uppercase font-black mb-1">Algorithme & Version</p>
            <p class="font-bold text-BtW text-xs uppercase">{{ store.publicKeyInfo.algorithm }} ({{
              store.publicKeyInfo.key_version }})</p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center px-1">
            <p class="text-[9px] text-hsa uppercase font-black">Empreinte de la Clé (Fingerprint)</p>
            <button @click="copy(store.publicKeyInfo.public_key.fingerprint)"
              class="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
              <IconCopy v-if="!copied" class="w-3 h-3" />
              <IconCheck v-else class="w-3 h-3 text-success" />
              {{ copied ? 'Copié' : 'Copier' }}
            </button>
          </div>
          <div
            class="p-3 bg-WtB/50 rounded-xl border border-ashAct font-mono text-[11px] text-BtW break-all leading-tight">
            {{ store.publicKeyInfo.public_key.fingerprint }}
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 text-[10px]">
          <div class="flex items-center gap-4 text-hsa">
            <span class="flex items-center gap-1">
              <IconCalendar class="w-3 h-3" /> Mis à jour le {{ formatDate(store.publicKeyInfo.issued_at) }}
            </span>
            <a :href="store.publicKeyInfo.documentation" target="_blank"
              class="text-primary hover:underline font-bold flex items-center gap-0.5">
              Documentation
              <IconArrowUpRight class="w-3 h-3" />
            </a>
          </div>
          <p class="text-primary/50 font-black italic">SÉCURITÉ PKI BÉNIN</p>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCertificate, IconCopy, IconCheck, IconCalendar, IconArrowUpRight } from '@tabler/icons-vue'
import { useDocumentsStore } from '~/stores/documents'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const store = useDocumentsStore()
const copied = ref(false)

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'P', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
