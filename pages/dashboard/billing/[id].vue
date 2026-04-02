<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    <!-- Breadcrumbs / Back -->
    <UiBaseButton to="/dashboard/billing" variant="ghost" class="!px-0 group/back hover:bg-transparent">
      <div
        class="flex items-center gap-2 text-hsa group-hover/back:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">
        <IconChevronLeft class="w-4 h-4 transition-transform group-hover/back:-translate-x-1" />
        Retour à la facturation
      </div>
    </UiBaseButton>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <UiLogoLoader size="md" />
      <p class="mt-4 text-sm font-bold text-hsa animate-pulse uppercase tracking-widest">Chargement des détails...</p>
    </div>

    <div v-else-if="!subscription" class="text-center py-20">
      <div class="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-6">
        <IconReceipt class="w-10 h-10" />
      </div>
      <h2 class="text-2xl font-black text-BtW mb-2">Transaction introuvable</h2>
      <p class="text-hsa font-medium mb-8">Nous n'avons pas pu trouver les détails de ce paiement.</p>
      <UiBaseButton to="/dashboard/billing" variant="primary">Retour</UiBaseButton>
    </div>

    <div v-else class="space-y-6">
      <!-- Header Detail -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-ash/50">
        <div class="space-y-1">
          <div class="flex items-center gap-3 mb-2">
            <span :class="[
              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
              subscription.status === 'approved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            ]">
              {{ subscription.status === 'approved' ? 'Transaction Réussie' : 'En attente' }}
            </span>
            <span class="text-[10px] font-black text-hsa uppercase tracking-[0.2em] opacity-40">#{{ subscription.id
              }}</span>
          </div>
          <h1 class="text-4xl font-black text-BtW tracking-tighter uppercase leading-none">
            {{ subscription.package_name }}
          </h1>
          <p class="text-hsa font-bold uppercase text-[10px] tracking-widest">
            Achat effectué le {{ formatDate(subscription.created_at) }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <UiBaseButton v-if="subscription.status === 'approved'"
            @click="subscriptionStore.downloadReceipt(subscription.id)" variant="primary"
            class="!rounded-2xl !py-4 font-black uppercase tracking-widest text-xs">
            <IconDownload class="w-4 h-4 mr-2" />
            Télécharger le reçu
          </UiBaseButton>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Summary Card -->
        <UiBaseCard class="p-8 space-y-6">
          <h3 class="text-sm font-black text-BtW uppercase tracking-widest border-b border-ash pb-4">Résumé du paiement
          </h3>

          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-hsa uppercase tracking-widest">Montant Total</span>
              <span class="text-lg font-black text-BtW">{{ subscription.amount }} FCFA</span>
            </div>
            <div class="flex justify-between items-center text-primary">
              <span class="text-xs font-bold uppercase tracking-widest">Crédits Ajoutés</span>
              <span class="text-lg font-black">+{{ subscription.credits_awarded }}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-ash/50">
              <span class="text-xs font-bold text-hsa uppercase tracking-widest">Méthode</span>
              <span class="text-sm font-black text-BtW flex items-center gap-2 uppercase">
                <IconCreditCard class="w-4 h-4 text-hsa" />
                FedaPay
              </span>
            </div>
          </div>
        </UiBaseCard>

        <!-- Technical Details -->
        <UiBaseCard class="p-8 space-y-6 bg-ash/10">
          <h3 class="text-sm font-black text-BtW uppercase tracking-widest border-b border-ash pb-4">Identifiants
            techniques</h3>

          <div class="space-y-4 font-mono text-[10px] break-all uppercase">
            <div>
              <p class="text-hsa font-bold mb-1 opacity-60 tracking-[0.2em]">Transaction FedaPay</p>
              <p class="text-BtW font-bold">{{ subscription.fedapay_id || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-hsa font-bold mb-1 opacity-60 tracking-[0.2em]">Référence Interne</p>
              <p class="text-BtW font-bold">INV-CYP-{{ subscription.id }}</p>
            </div>
          </div>
        </UiBaseCard>
      </div>

      <!-- Action Footer -->
      <div class="p-8 rounded-3xl bg-primary/5 border border-primary/20 flex items-center gap-6">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <IconAlertTriangle class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-black text-BtW uppercase tracking-tight">Besoin d'assistance ?</h4>
          <p class="text-xs text-hsa font-medium">Si vous rencontrez un problème avec cette transaction, notre support
            est disponible 24/7.</p>
        </div>
        <UiBaseButton to="/support" variant="ghost" class="!text-[10px] font-black uppercase !bg-ash">Contacter
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconReceipt, IconChevronLeft, IconDownload, IconCreditCard, IconAlertTriangle } from '@tabler/icons-vue'
import { useSubscriptionStore } from '~/stores/back/user/subscription'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Subscription } from '~/types/subscription'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const subscriptionStore = useSubscriptionStore()
const loading = ref(true)
const subscription = ref<Subscription | null>(null)

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr })
  } catch {
    return dateString
  }
}

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  const data = await subscriptionStore.getSubscription(id)
  if (data) {
    subscription.value = data
  }
  loading.value = false
})
</script>
