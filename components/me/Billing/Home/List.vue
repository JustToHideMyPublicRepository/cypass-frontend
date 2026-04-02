<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <h2 class="text-lg font-bold text-BtW tracking-tight">Dernières transactions</h2>
      <span class="text-xs font-bold text-hsa">
        {{ subscriptions.length }} {{ subscriptions.length > 1 ? 'dernières transactions' : 'dernière transaction' }}
      </span>
    </div>

    <!-- Loading State -->
    <MeBillingHomeLoading v-if="loading && subscriptions.length === 0" :count="3" />

    <div v-else-if="subscriptions.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-ash/10 rounded-3xl border-2 border-dashed border-ash">
      <div class="w-16 h-16 bg-ashAct rounded-full flex items-center justify-center mb-4 text-hsa/30">
        <IconReceipt class="w-8 h-8" />
      </div>
      <p class="text-sm font-bold text-hsa">Aucune transaction trouvée.</p>
      <UiBaseButton to="/pricings" variant="ghost" class="mt-4 !text-xs font-black uppercase">Voir les packs
      </UiBaseButton>
    </div>

    <div v-else class="grid grid-cols-1 gap-3">
      <UiBaseCard v-for="sub in subscriptions" :key="sub.id"
        class="group/item hover:border-primary/30 transition-all duration-300">
        <div class="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <!-- Icon & Date -->
          <div class="flex items-center gap-4 flex-1">
            <div :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors',
              sub.status === 'approved' ? 'bg-success/10 text-success' : 'bg-ash/50 text-hsa'
            ]">
              <IconReceipt class="w-6 h-6" />
            </div>
            <div class="min-w-0">
              <NuxtLink :to="`/dashboard/billing/${sub.id}`" class="font-black text-BtW truncate uppercase tracking-tight text-sm hover:text-primary transition-colors">
                {{ sub.package_name }}
              </NuxtLink>
              <p class="text-[10px] font-bold text-hsa flex items-center gap-1.5 uppercase">
                <IconCalendar class="w-3 h-3" />
                {{ formatDate(sub.created_at) }}
              </p>
              <div v-if="sub.fedapay_id"
                class="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 bg-ashAct/50 rounded-lg w-fit group/copy cursor-pointer border border-ash/50 hover:border-primary/30 transition-all"
                @click="copyToClipboard(sub.fedapay_id)">
                <span class="text-[8px] font-black text-hsa uppercase tracking-[0.1em]">Ref: {{ sub.fedapay_id }}</span>
                <component :is="copiedId === sub.fedapay_id ? IconCheck : IconCopy"
                  class="w-2.5 h-2.5 text-hsa group-hover/copy:text-primary transition-colors"
                  :class="{ 'text-success': copiedId === sub.fedapay_id }" />
              </div>
            </div>
          </div>

          <!-- Amount & Credits -->
          <div class="flex flex-wrap items-center gap-6 md:px-6">
            <template v-if="sub.status === 'approved'">
              <div class="text-right min-w-[80px]">
                <p class="text-[9px] font-black text-hsa uppercase tracking-widest opacity-60">Montant</p>
                <p class="text-sm font-black text-BtW">{{ formatAmount(sub.amount) }} FCFA</p>
              </div>
              <div class="text-right min-w-[80px]">
                <p class="text-[9px] font-black text-hsa uppercase tracking-widest opacity-60">Crédits</p>
                <p class="text-sm font-black text-primary">+{{ sub.credits_awarded }}</p>
              </div>
            </template>
            <div v-else class="min-w-[160px] text-right">
              <p class="text-[9px] font-black text-hsa uppercase tracking-widest opacity-60">Info</p>
              <p class="text-xs font-bold" :class="sub.status === 'pending' ? 'text-warning' : 'text-danger'">
                {{ sub.status === 'pending' ? 'Paiement non finalisé' : 'Transaction annulée' }}
              </p>
            </div>
            <div class="min-w-[100px] flex justify-end">
              <span :class="[
                'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter',
                sub.status === 'approved' ? 'bg-success/10 text-success' :
                  sub.status === 'canceled' ? 'bg-danger/10 text-danger' :
                    'bg-warning/10 text-warning'
              ]">
                {{ sub.status === 'approved' ? 'Payé' : sub.status === 'canceled' ? 'Annulé' : 'En attente' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 md:border-l border-ash/50 md:pl-6">
            <UiBaseButton @click="$emit('download', sub.id)" v-if="sub.status === 'approved'" variant="ghost"
              class="!h-10 !w-10 !p-0 !rounded-xl !bg-ash/50 hover:!bg-primary/10 hover:text-primary transition-all"
              title="Télécharger le reçu">
              <IconDownload class="w-4 h-4" />
            </UiBaseButton>
            <UiBaseButton v-if="sub.status === 'pending' && sub.metadata?.url" :to="sub.metadata.url" variant="ghost" target="_blank"
              class="!h-10 !w-10 !p-0 !rounded-xl !bg-primary/10 text-primary hover:!bg-primary/20 transition-all"
              title="Finaliser le paiement">
              <IconCreditCard class="w-4 h-4" />
            </UiBaseButton>
            <UiBaseButton :to="`/dashboard/billing/${sub.id}`" variant="ghost"
              class="!h-10 !w-10 !p-0 !rounded-xl !bg-ash/50 hover:!bg-primary/10 hover:text-primary transition-all"
              title="Détails de la transaction">
              <IconExternalLink class="w-4 h-4" />
            </UiBaseButton>
          </div>
        </div>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconReceipt, IconCalendar, IconDownload, IconExternalLink, IconCopy, IconCheck, IconCreditCard } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Subscription } from '~/types/subscription'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  subscriptions: Subscription[]
  loading?: boolean
}>()

const emit = defineEmits(['download'])

const toastStore = useToastStore()
const copiedId = ref<string | null>(null)

const formatAmount = (val: number | string) => {
  const amount = typeof val === 'string' ? parseFloat(val) : val
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(amount))
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
  } catch {
    return dateString
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  copiedId.value = text
  toastStore.showToast('success', 'Copié', 'ID de transaction copié dans le presse-papier')
  setTimeout(() => {
    if (copiedId.value === text) copiedId.value = null
  }, 2000)
}
</script>
