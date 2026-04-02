<template>
  <div class="space-y-6">
    <MeBillingHomeHeader :loading="loading" @refresh="fetchData" />

    <MeBillingHomeStats :plan-name="profilStore.profile?.plan?.name || 'Individuel'"
      :credits="profilStore.profile?.plan?.credits ?? 0" :total-credits="totalPackCredits" />

    <MeBillingHomeList :subscriptions="subscriptions" :loading="loading"
      @download="subscriptionStore.downloadReceipt" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSubscriptionStore } from '~/stores/back/user/subscription'
import { useProfilStore } from '~/stores/back/user/profil'
import { getPlanInfo } from '~/utils/pricing'
import type { Subscription } from '~/types/subscription'

definePageMeta({
  layout: 'default'
})

const subscriptionStore = useSubscriptionStore()
const profilStore = useProfilStore()
const loading = ref(true)
const subscriptions = ref<Subscription[]>([])

const totalPackCredits = computed(() => {
  const plan = profilStore.profile?.plan
  if (!plan) return '...'
  const info = getPlanInfo(plan.name)
  return info.credits === 1000000 ? 'Illimité' : info.credits
})

const fetchData = async () => {
  loading.value = true
  const data = await subscriptionStore.getLatestSubscriptions()
  if (data) {
    subscriptions.value = data
  }
  loading.value = false
}

onMounted(() => {
  fetchData()
})

useHead({
  title: 'Facturation & Abonnements',
  meta: [
    { name: 'description', content: 'Gérez vos abonnements, crédits et factures CYPASS.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
