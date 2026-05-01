<template>
  <div class="max-w-7xl mx-auto mb-24 space-y-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <h3 class="font-black mx-auto">{{ mainTitle }}</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <div v-for="(tier, index) in tiers" :key="tier.name"
        class="group relative bg-ash/40 backdrop-blur-3xl p-8 rounded-2xl border-2 transition-all duration-700 hover:scale-[1.02] flex flex-col h-full"
        :class="tier.featured ? 'border-primary/40 shadow-[0_40px_100px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20' : 'border-ash/50 hover:border-primary/30'">

        <div v-if="tier.featured"
          class="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-WtB px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
          Recommandé
        </div>

        <div class="space-y-6 flex-1">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-primary shrink-0"
              :class="tier.bgClass || 'bg-ash/10'">
              <component :is="tier.icon" class="w-7 h-7" />
            </div>
            <div>
              <h3 class="text-xl font-black text-BtW leading-tight">{{ tier.name }}</h3>
              <p v-if="tier.subtitle" class="text-[10px] font-black text-hsa uppercase tracking-widest mt-0.5">{{
                tier.subtitle }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-ash/10">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl lg:text-4xl font-black text-BtW">{{ tier.price }}</span>
            </div>
            <p class="text-xs text-hsa mt-2 leading-relaxed font-medium opacity-70">{{ tier.description }}</p>
          </div>

          <div v-if="tier.pricing" class="mt-4 bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
            <div v-for="(p, i) in tier.pricing" :key="i"
              class="flex justify-between items-center px-4 py-2 text-xs border-b border-primary/5 last:border-0">
              <span class="font-medium text-hsa">{{ p.range }}</span>
              <span class="font-bold text-BtW">{{ p.unitPrice }}</span>
            </div>
          </div>

          <ul class="space-y-4 pt-6 mt-auto">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-3">
              <IconCheck class="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
              <span class="text-sm font-bold text-BtW/90 leading-snug">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-10">
          <UiBaseButton :variant="tier.featured ? 'primary' : 'secondary'"
            class="!w-full !rounded-[2rem] !py-5 !text-xs !font-black uppercase tracking-[0.2em]"
            :disabled="loadingTier === tier.slug" @click="handleAction(tier)">
            <template v-if="loadingTier === tier.slug">
              <UiLogoLoader size="xs" container-class="text-WtB" />
            </template>
            <template v-else>
              {{ getCtaText(tier) }}
            </template>
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconCheck } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useSubscriptionStore } from '~/stores/back/user/subscription'

const props = defineProps<{
  tiers: any[]
}>()

const mainTitle = computed(() => {
  const firstTier = props.tiers?.[0]
  if (!firstTier) return ''
  const basicSlugs = ['free', 'starter', 'business', 'entreprise']
  return basicSlugs.includes(firstTier.slug) ? 'Offres basiques' : 'Extensions & Services supplémentaires'
})

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const loadingTier = ref<string | null>(null)

const getCtaText = (tier: any) => {
  if (!authStore.user && (tier.slug === 'starter' || tier.slug === 'business')) {
    return 'Se connecter'
  }
  return tier.cta
}

const handleAction = async (tier: any) => {
  // Cas 1: Redirection directe (Gratuit ou Entreprise)
  if (tier.link) {
    return navigateTo(tier.link)
  }

  // Cas 2: Non connecté -> Redirection login
  if (!authStore.user) {
    return navigateTo('/auth/login')
  }

  // Cas 3: Connexion et achat de pack
  loadingTier.value = tier.slug
  try {
    const checkoutUrl = await subscriptionStore.subscribe(tier.slug)
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  } finally {
    loadingTier.value = null
  }
}
</script>
