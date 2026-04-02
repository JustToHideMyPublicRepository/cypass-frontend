<template>
  <UiBaseCard class="p-6 md:p-8 overflow-hidden relative">
    <!-- Status Badge -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div class="flex items-center gap-4">
        <div :class="[
          'w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors',
          subscription.status === 'approved' ? 'bg-success/10 text-success' :
            subscription.status === 'canceled' ? 'bg-danger/10 text-danger' :
              'bg-warning/10 text-warning'
        ]">
          <IconReceipt class="w-8 h-8" />
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span :class="[
              'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest',
              subscription.status === 'approved' ? 'bg-success text-white' :
                subscription.status === 'canceled' ? 'bg-danger text-white' :
                  'bg-warning text-white'
            ]">
              {{ subscription.status === 'approved' ? 'Transaction Réussie' :
                subscription.status === 'canceled' ? 'Paiement Annulé' : 'En attente' }}
            </span>
            <span class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] opacity-40">#{{
              subscription.id.slice(-8) }}</span>
          </div>
          <h1 class="text-3xl font-black text-BtW tracking-tighter uppercase leading-none">
            {{ subscription.package_name }}
          </h1>
        </div>
      </div>
      <div class="text-left md:text-right">
        <p class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] opacity-40 mb-1">Montant payé</p>
        <p class="text-3xl font-black text-primary tracking-tighter">{{ formatAmount(subscription.amount) }} <span class="text-sm">FCFA</span></p>
      </div>
    </div>

    <!-- Grid Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-ash/50">
      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-ash/50 flex items-center justify-center shrink-0">
            <IconCalendar class="w-5 h-5 text-hsa" />
          </div>
          <div>
            <p class="text-[10px] font-black text-hsa uppercase tracking-widest opacity-60 mb-0.5">Date du paiement</p>
            <p class="text-sm font-bold text-BtW">{{ formatDate(subscription.created_at) }}</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-ash/50 flex items-center justify-center shrink-0">
            <IconCreditCard class="w-5 h-5 text-hsa" />
          </div>
          <div>
            <p class="text-[10px] font-black text-hsa uppercase tracking-widest opacity-60 mb-0.5">Méthode de paiement</p>
            <p class="text-sm font-bold text-BtW capitalize">{{ subscription.payment_method || 'FedaPay' }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-ash/50 flex items-center justify-center shrink-0">
            <IconPlus class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-[10px] font-black text-hsa uppercase tracking-widest opacity-60 mb-0.5">Crédits ajoutés</p>
            <p class="text-xl font-black text-primary">+{{ subscription.credits_awarded }} <span class="text-[10px] uppercase">unités</span></p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-ash/50 flex items-center justify-center shrink-0">
            <IconFingerprint class="w-5 h-5 text-hsa" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-black text-hsa uppercase tracking-widest opacity-60 mb-0.5">Référence FedaPay</p>
            <div class="flex items-center gap-2">
              <code class="text-xs font-bold text-BtW truncate">{{ subscription.fedapay_id || 'N/A' }}</code>
              <button v-if="subscription.fedapay_id" @click="copy(subscription.fedapay_id)" 
                class="p-1 hover:bg-ash/80 rounded transition-colors" title="Copier">
                <component :is="copied ? IconCheck : IconCopy" class="w-3.5 h-3.5 text-hsa" :class="{'text-success': copied}" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconReceipt, IconCalendar, IconCreditCard, IconPlus, IconFingerprint, IconCopy, IconCheck } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Subscription } from '~/types/subscription'
import { useToastStore } from '~/stores/front/toast'

const props = defineProps<{
  subscription: Subscription
}>()

const toastStore = useToastStore()
const copied = ref(false)

const formatAmount = (val: number | string) => {
  const amount = typeof val === 'string' ? parseFloat(val) : val
  return new Intl.NumberFormat('fr-FR').format(amount)
}

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch {
    return dateString
  }
}

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  toastStore.showToast('success', 'Copié', 'ID de transaction copié dans le presse-papier')
  setTimeout(() => copied.value = false, 2000)
}
</script>
