<template>
  <div class="space-y-8 pb-12">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-BtW tracking-tight flex items-center gap-3">
          <IconReceipt class="w-8 h-8 text-primary" />
          Facturation & Abonnements
        </h1>
        <p class="text-hsa font-medium mt-1">Gérez vos abonnements, crédits et factures CYPASS.</p>
      </div>
      <UiBaseButton to="/pricings" variant="primary"
        class="!rounded-2xl !py-4 font-black uppercase tracking-widest text-xs">
        Changer mon plan
      </UiBaseButton>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UiBaseCard class="p-6 bg-primary/5 border-primary/20">
        <p class="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Plan Actuel</p>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-black text-BtW uppercase">{{ profilStore.profile?.plan?.name || 'Individuel' }}</h3>
          <span class="px-2 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase">Actif</span>
        </div>
      </UiBaseCard>

      <UiBaseCard class="p-6">
        <p class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">Crédits Restants</p>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-black text-BtW">{{ profilStore.profile?.plan?.credits ?? 0 }}</h3>
          <span class="text-[10px] font-bold text-hsa truncate max-w-[100px]">Sur {{ totalPackCredits }}</span>
        </div>
      </UiBaseCard>

      <UiBaseCard class="p-6">
        <p class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">Prochaine Facture</p>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-black text-BtW">Automatique</h3>
          <IconReceipt class="w-5 h-5 text-hsa opacity-30" />
        </div>
      </UiBaseCard>
    </div>

    <!-- Transactions List -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-black text-BtW tracking-tight">Dernières Transactions</h2>
        <span class="text-xs font-bold text-hsa">{{ subscriptions.length }} derniers paiements</span>
      </div>

      <div v-if="loading && subscriptions.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-ash/10 rounded-3xl border-2 border-dashed border-ash">
        <UiLogoLoader size="md" />
        <p class="mt-4 text-sm font-bold text-hsa animate-pulse">Récupération de vos factures...</p>
      </div>

      <div v-else-if="subscriptions.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-ash/10 rounded-3xl border-2 border-dashed border-ash">
        <div class="w-16 h-16 bg-ashAct rounded-full flex items-center justify-center mb-4">
          <IconReceipt class="w-8 h-8 text-hsa opacity-30" />
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
                'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                sub.status === 'approved' ? 'bg-success/10 text-success' : 'bg-ash/50 text-hsa'
              ]">
                <IconReceipt class="w-6 h-6" />
              </div>
              <div class="min-w-0">
                <h4 class="font-black text-BtW truncate uppercase tracking-tight">{{ sub.package_name }}</h4>
                <p class="text-[10px] font-bold text-hsa flex items-center gap-1.5 uppercase">
                  <IconCalendar class="w-3 h-3" />
                  {{ formatDate(sub.created_at) }}
                </p>
                <div v-if="sub.fedapay_id"
                  class="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 bg-ashAct/50 rounded-lg w-fit group/copy cursor-pointer border border-ash/50 hover:border-primary/30 transition-all"
                  @click="copyToClipboard(sub.fedapay_id)">
                  <span class="text-[8px] font-black text-hsa uppercase tracking-[0.1em]">Ref: {{ sub.fedapay_id
                    }}</span>
                  <IconCopy class="w-2.5 h-2.5 text-hsa group-hover/copy:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <!-- Amount & Credits -->
            <div class="flex flex-wrap items-center gap-6 md:px-6">
              <div class="text-right min-w-[80px]">
                <p class="text-[9px] font-black text-hsa uppercase tracking-widest opacity-60">Montant</p>
                <p class="text-sm font-black text-BtW">{{ sub.amount }} FCFA</p>
              </div>
              <div class="text-right min-w-[80px]">
                <p class="text-[9px] font-black text-hsa uppercase tracking-widest opacity-60">Crédits</p>
                <p class="text-sm font-black text-primary">+{{ sub.credits_awarded }}</p>
              </div>
              <div class="min-w-[100px] flex justify-end">
                <span :class="[
                  'px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter',
                  sub.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                ]">
                  {{ sub.status === 'approved' ? 'Payé' : 'En attente' }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 md:border-l border-ash/50 md:pl-6">
              <UiBaseButton @click="subscriptionStore.downloadReceipt(sub.id)" v-if="sub.status === 'approved'"
                variant="ghost"
                class="!h-10 !w-10 !p-0 !rounded-xl !bg-ash/50 hover:!bg-primary/10 hover:text-primary transition-all"
                title="Télécharger le reçu">
                <IconDownload class="w-4 h-4" />
              </UiBaseButton>
              <UiBaseButton :to="`/dashboard/billing/${sub.id}`" variant="ghost"
                class="!h-10 !w-10 !p-0 !rounded-xl !bg-ash/50 hover:!bg-primary/10 hover:text-primary transition-all"
                title="Détails">
                <IconExternalLink class="w-4 h-4" />
              </UiBaseButton>
            </div>
          </div>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { IconReceipt, IconCalendar, IconDownload, IconExternalLink, IconCreditCard, IconCopy } from '@tabler/icons-vue'
import { useSubscriptionStore } from '~/stores/back/user/subscription'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getPlanInfo } from '~/utils/pricing'
import type { Subscription } from '~/types/subscription'

definePageMeta({
  layout: 'default'
})

const subscriptionStore = useSubscriptionStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()
const loading = ref(true)
const subscriptions = ref<Subscription[]>([])

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toastStore.showToast('success', 'Copié', 'ID de transaction copié dans le presse-papier')
}

const totalPackCredits = computed(() => {
  const plan = profilStore.profile?.plan
  if (!plan) return '...'
  const info = getPlanInfo(plan.name)
  return info.credits === 1000000 ? 'Illimité' : info.credits
})

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
  } catch {
    return dateString
  }
}

onMounted(async () => {
  loading.value = true
  const data = await subscriptionStore.getLatestSubscriptions()
  if (data) {
    subscriptions.value = data
  }
  loading.value = false
})
</script>
