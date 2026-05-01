<template>
  <UiBaseModal :show="show" title="Certificat de confiance" maxWidth="2xl" @close="$emit('close')">
    <div v-if="publicDocsentryStore.publicKeyInfo" class="flex flex-col md:flex-row gap-6 items-start py-2">
      <!-- Icône de certification premium -->
      <div
        class="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5 animate-fade-in border border-primary/10">
        <IconCertificate class="w-12 h-12" />
      </div>

      <div class="flex-1 space-y-4">
        <!-- Titre et statut -->
        <div>
          <h3 class="text-lg font-black text-BtW flex items-center gap-2">
            Certificat de confiance DocSentry
            <span class="badge badge-success !text-[10px]">Actif</span>
          </h3>
          <p class="text-xs text-hsa">{{ publicDocsentryStore.publicKeyInfo.usage }}</p>
        </div>

        <!-- Informations clés -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-3 bg-ash/30 rounded-xl border border-ash/50">
            <p class="text-[9px] text-hsa uppercase font-black mb-1">Organisation Émettrice</p>
            <p class="font-bold text-BtW text-xs">{{ publicDocsentryStore.publicKeyInfo.organization }}</p>
          </div>
          <div class="p-3 bg-ash/30 rounded-xl border border-ash/50">
            <p class="text-[9px] text-hsa uppercase font-black mb-1">Algorithme & Version</p>
            <p class="font-bold text-BtW text-xs uppercase">{{ publicDocsentryStore.publicKeyInfo.algorithm }} ({{
              publicDocsentryStore.publicKeyInfo.key_version }})</p>
          </div>
        </div>

        <!-- Détails de la clé (Fingerprint, Base64, Hex) -->
        <div class="space-y-4">
          <!-- Fingerprint -->
          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <p class="text-[9px] text-hsa uppercase font-black">Empreinte (Fingerprint)</p>
              <UiBaseButton @click="copy(publicDocsentryStore.publicKeyInfo.public_key.fingerprint)" variant="ghost"
                class="!text-[10px] !text-primary !font-bold hover:!underline !flex !items-center !gap-1 !p-0 !h-auto !bg-transparent hover:!bg-transparent">
                <IconCopy v-if="!copied" class="w-3 h-3" />
                <IconCheck v-else class="w-3 h-3 text-success" />
                {{ copied ? 'Copié' : 'Copier' }}
              </UiBaseButton>
            </div>
            <div
              class="p-3 bg-WtB/50 rounded-xl border border-ashAct font-code text-[11px] text-BtW break-all leading-tight shadow-inner">
              {{ publicDocsentryStore.publicKeyInfo.public_key.fingerprint }}
            </div>
          </div>

          <!-- Toggle pour plus de détails -->
          <div class="flex justify-center pt-1">
            <button @click="isDetailsExpanded = !isDetailsExpanded"
              class="text-[10px] font-bold text-hsa hover:text-primary flex items-center gap-1 transition-colors group">
              <component :is="isDetailsExpanded ? IconChevronUp : IconChevronDown"
                class="w-3 h-3 group-hover:animate-bounce-subtle" />
              {{ isDetailsExpanded ? 'Masquer les détails techniques' : 'Afficher les formats Base64 & Hex' }}
            </button>
          </div>

          <!-- Section extensible Base64 & Hex -->
          <transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2">
            <div v-show="isDetailsExpanded" class="grid grid-cols-1 gap-3 pt-2">
              <div class="space-y-1.5">
                <p class="text-[9px] text-hsa uppercase font-black px-1 opacity-70">Format Base64</p>
                <div
                  class="p-2.5 bg-ash/20 rounded-lg border border-ash/30 font-code text-[10px] text-hsa break-all leading-tight">
                  {{ publicDocsentryStore.publicKeyInfo.public_key.base64 }}
                </div>
              </div>
              <div class="space-y-1.5">
                <p class="text-[9px] text-hsa uppercase font-black px-1 opacity-70">Format Hexadécimal (Raw)</p>
                <div
                  class="p-2.5 bg-ash/20 rounded-lg border border-ash/30 font-code text-[10px] text-hsa break-all leading-tight">
                  {{ publicDocsentryStore.publicKeyInfo.public_key.hex }}
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Footer du certificat -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 text-[10px]">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-hsa italic font-medium">
            <span class="flex items-center gap-1">
              <IconCalendar class="w-3 h-3" />
              Émis {{ formatRelativeTime(publicDocsentryStore.publicKeyInfo.created_at) }}
              <span class="opacity-50">({{ formatShortDate(publicDocsentryStore.publicKeyInfo.created_at) }})</span>
            </span>
            <span class="hidden sm:inline opacity-30">|</span>
            <span class="flex items-center gap-1">
              Mis à jour le {{ formatShortDate(publicDocsentryStore.publicKeyInfo.issued_at, true) }}
            </span>
            <span class="hidden sm:inline opacity-30">|</span>
            <a :href="publicDocsentryStore.publicKeyInfo.documentation" target="_blank"
              class="text-primary hover:underline font-bold flex items-center gap-0.5 not-italic">
              Documentation
              <IconArrowUpRight class="w-3 h-3" />
            </a>
          </div>
          <p class="text-primary/50 font-black italic ml-auto">SÉCURITÉ PKI</p>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCertificate, IconCopy, IconCheck, IconCalendar, IconArrowUpRight, IconChevronDown, IconChevronUp } from '@tabler/icons-vue'
import { usePublicDocsentryStore } from '~/stores/back/public/docsentry'
import { useToastStore } from '~/stores/front/toast'
import { formatRelativeTime, formatShortDate } from '~/utils/date'

// Propriétés de la modale DocSentryTrust
defineProps<{
  show: boolean
}>()

defineEmits(['close'])

const publicDocsentryStore = usePublicDocsentryStore()
const copied = ref(false)
const isDetailsExpanded = ref(false)

const toast = useToastStore()

/**
 * Copie le fingerprint dans le presse-papier
 */
const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  toast.showToast('success', 'Copié', 'L\'empreinte a été copiée dans le presse-papier.')
  setTimeout(() => copied.value = false, 2000)
}
</script>
