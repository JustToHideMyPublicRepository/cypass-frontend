<template>
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
    <div v-for="(tier, index) in tiers" :key="tier.name"
      class="group relative bg-ash/40 backdrop-blur-3xl p-8 rounded-2xl border-2 transition-all duration-700 hover:scale-[1.02] flex flex-col h-full"
      :class="tier.featured ? 'border-primary/40 shadow-[0_40px_100px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20' : 'border-ash/50 hover:border-primary/30'">

      <div v-if="tier.featured"
        class="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-WtB px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
        Recommandé
      </div>

      <div class="space-y-6 flex-1">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-primary" :class="tier.bgClass">
            <component :is="tier.icon" class="w-7 h-7" />
          </div>
          <div>
            <h3 class="text-xl font-black text-BtW">{{ tier.name }}</h3>
            <p class="text-[10px] font-black text-hsa uppercase tracking-widest">{{ tier.subtitle }}</p>
          </div>
        </div>

        <div class="pt-4 border-t border-ash/10">
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black text-BtW">{{ tier.price }}</span>
          </div>
          <p class="text-xs text-hsa mt-2 leading-relaxed font-medium opacity-70">{{ tier.description }}</p>
        </div>

        <ul class="space-y-4 pt-6">
          <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-3">
            <IconCircleCheck class="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
            <span class="text-sm font-bold text-BtW/90 leading-snug">{{ feature }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-10">
        <UiBaseButton :variant="tier.featured ? 'primary' : 'secondary'"
          class="!w-full !rounded-[2rem] !py-5 !text-xs !font-black uppercase tracking-[0.2em]">
          {{ tier.cta }}
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck } from '@tabler/icons-vue'
import { pricingTiers } from '~/utils/pricing'

const tiers = pricingTiers
</script>
