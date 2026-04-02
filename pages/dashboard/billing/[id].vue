<template>
  <div class="space-y-6">
    <MeBillingDetailHeader />

    <!-- Loading State -->
    <MeBillingDetailLoading v-if="loading" />

    <!-- Content -->
    <div v-else-if="subscription" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <MeBillingDetailInfo :subscription="subscription" />
      </div>

      <div class="lg:col-span-1">
        <MeBillingDetailSupport :approved="subscription.status === 'approved'"
          @download="subscriptionStore.downloadReceipt(subscription.id)" />
      </div>
    </div>

    <!-- Error State -->
    <MeBillingDetailError v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSubscriptionStore } from '~/stores/back/user/subscription'
import type { Subscription } from '~/types/subscription'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const subscriptionStore = useSubscriptionStore()
const loading = ref(true)
const subscription = ref<Subscription | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  const data = await subscriptionStore.getSubscription(id)
  if (data) {
    subscription.value = data
  }
  loading.value = false
})

useHead({
  title: computed(() => subscription.value ? `Facture #${subscription.value.id.slice(-8).toUpperCase()} - ${subscription.value.package_name}` : 'Détails du paiement'),
  meta: [
    {
      name: 'description',
      content: computed(() => subscription.value
        ? `Détails de votre paiement de ${subscription.value.amount} FCFA pour le pack ${subscription.value.package_name}.`
        : 'Consultez les détails techniques de votre transaction CYPASS.')
    },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
