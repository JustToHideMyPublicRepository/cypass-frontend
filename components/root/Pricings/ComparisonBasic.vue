<template>
  <div class="bg-ash/20 backdrop-blur-xl rounded-[4rem] border border-ash/50 overflow-hidden animate-fade-up">
    <div class="p-8 md:p-12">
      <h2 class="text-2xl font-black text-BtW mb-10 flex items-center gap-4">
        <div class="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
          <IconLayoutBoard class="w-6 h-6" />
        </div>
        Comparez les fonctionnalités
      </h2>

      <div class="overflow-auto max-h-[65vh] rounded-xl ring-1 ring-ash/5">
        <table class="w-full text-left border-collapse relative">
          <thead class="sticky top-0 z-20 bg-ash backdrop-blur-md">
            <tr class="border-b border-BtW">
              <th class="py-6 px-8 text-[10px] font-black text-hsa uppercase tracking-[0.2em] w-[40%]">Solution</th>
              <th v-for="t in tiers" :key="t.name"
                class="py-6 px-8 text-[10px] font-black text-center uppercase tracking-[0.2em]"
                :class="t.featured ? 'text-primary' : 'text-hsa'">
                {{ t.name }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ash/5">
            <tr v-for="row in comparison" :key="row.feature"
              class="group hover:bg-ashAct/30 even:bg-ashAct/20 transition-colors">
              <td class="py-6 px-8">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-bold text-BtW">{{ row.feature }}</p>
                  <UiAppTooltip v-if="row.tooltip" :content="row.tooltip" />
                </div>
              </td>
              <td class="py-6 px-8 text-center text-BtW">
                <IconCircleCheck v-if="row.basic" class="w-5 h-5 text-primary/40 mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
              <td class="py-6 px-8 text-center text-BtW">
                <IconCircleCheck v-if="row.starter" class="w-5 h-5 text-primary/70 mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
              <td class="py-6 px-8 text-center text-BtW">
                <IconCircleCheck v-if="row.business" class="w-5 h-5 text-primary mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
              <td class="py-6 px-8 text-center">
                <IconCircleCheck v-if="row.ent" class="w-5 h-5 text-primary mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck, IconLayoutBoard } from '@tabler/icons-vue'
import { pricingTiers, basicComparison } from '~/utils/pricing'

const tiers = pricingTiers
const comparison = basicComparison
</script>
