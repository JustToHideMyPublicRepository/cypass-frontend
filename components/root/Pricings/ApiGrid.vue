<template>
  <div class="max-w-7xl mx-auto mb-24 space-y-16">
    <!-- Header/Introduction API -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <h2 class="text-3xl font-black text-BtW">Endpoints de l'API</h2>
      <div class="flex items-center gap-3 bg-ash/30 px-5 py-2 rounded-full border border-ash/50 shadow-inner">
        <span class="text-sm font-bold text-BtW/80">Afficher la facturation unitaire</span>
      </div>
    </div>

    <!-- Modeles / Tarifs de base -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="tier in tiers" :key="tier.slug"
        class="bg-ash/40 backdrop-blur-3xl p-8 rounded-2xl border transition-all duration-300 flex flex-col hover:shadow-lg hover:-translate-y-1"
        :class="[
          tier.featured ? 'border-secondary shadow-secondary/10' : 'border-ash/50 hover:border-primary/30',
          tier.bgClass || 'bg-ash/40'
        ]">

        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <component :is="tier.icon" class="w-10 h-10 p-2 rounded-xl"
              :class="tier.featured ? 'bg-secondary/10 text-secondary' : 'bg-ash text-hsa'" />
            <span v-if="tier.subtitle" class="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              :class="tier.featured ? 'bg-secondary text-WtB' : 'bg-ash/80 text-hsa'">{{ tier.subtitle }}</span>
          </div>
          <h3 class="text-2xl font-black text-BtW">{{ tier.name }}</h3>
          <p class="text-[28px] font-black text-BtW mt-2">{{ tier.price }}</p>
          <p class="text-sm font-medium text-hsa mt-2 opacity-80 h-10">{{ tier.description }}</p>
        </div>

        <div class="space-y-4 mb-8 flex-1">
          <!-- Si la tier a une tarification dégressive -->
          <div v-if="tier.pricing && tier.pricing.length > 0">
            <h4 class="text-xs font-black text-hsa uppercase tracking-widest mb-3 border-b border-ash/10 pb-2">
              Tarification Dégressive</h4>
            <div class="space-y-2">
              <div v-for="(p, i) in tier.pricing" :key="i" class="flex items-center justify-between text-sm">
                <span class="font-bold text-hsa">{{ p.range }}</span>
                <span class="font-black text-BtW">{{ p.unitPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Afficher les features -->
          <ul v-else class="space-y-3 font-medium text-hsa text-sm">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2">
              <IconCircleCheck class="w-5 h-5 text-secondary shrink-0" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div v-if="tier.pricing && tier.pricing.length > 0" class="mb-8 border-t border-ash/10 pt-4">
          <h4 class="text-[10px] font-black text-hsa uppercase tracking-widest mb-3">Inclus dans l'offre</h4>
          <ul class="space-y-2 font-medium text-hsa text-[13px]">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2">
              <IconCircleCheck class="w-4 h-4 text-secondary/70 shrink-0 mt-0.5" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-auto pt-6 border-t border-ash/10">
          <NuxtLink :to="tier.link" class="block w-full text-center py-3 px-4 rounded-xl font-bold transition-all"
            :class="tier.featured ? 'bg-secondary text-WtB hover:bg-secondary/90' : 'bg-BtW text-WtB hover:opacity-90'">
            {{ tier.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck, IconWebhook, IconUsers, IconDatabase, IconArrowRight } from '@tabler/icons-vue'
import { apiTiers } from '~/utils/pricing'
const tiers = apiTiers
</script>
