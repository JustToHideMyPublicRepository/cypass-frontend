<template>
  <div class="max-w-7xl mx-auto mb-24 space-y-16">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <h3 class="mx-auto">Endpoints de l'API</h3>
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
          <h5>{{ tier.name }}</h5>
          <h4>{{ tier.price }}</h4>
          <p class="text-xs mt-2 font-medium">{{ tier.description }}</p>
        </div>

        <div class="space-y-4 mb-8 flex-1">
          <!-- Afficher les features -->
          <ul class="space-y-4 pt-6">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-3">
              <IconCircleCheck class="w-5 h-5 text-secondary shrink-0 transition-transform group-hover:scale-110" />
              <span class="text-sm leading-snug">{{ feature }}</span>
            </li>
          </ul>

          <!-- Si la tier a une tarification dégressive -->
          <div v-if="tier.pricing && tier.pricing.length > 0"
            class="mt-4 bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
            <div class="px-4 py-2 bg-primary/10 border-b border-primary/10">
              <h4 class="text-[10px] font-black text-primary uppercase tracking-widest">Tarification Dégressive</h4>
            </div>
            <div class="p-2 space-y-1">
              <div v-for="(p, i) in tier.pricing" :key="i"
                class="flex justify-between items-center px-3 py-1.5 text-xs rounded-lg hover:bg-primary/5 transition-colors">
                <span class="font-medium text-hsa">{{ p.range }}</span>
                <span class="font-bold text-BtW">{{ p.unitPrice }}</span>
              </div>
            </div>
          </div>
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
import { IconCircleCheck } from '@tabler/icons-vue'
import { apiTiers } from '~/utils/pricing'
const tiers = apiTiers
</script>
