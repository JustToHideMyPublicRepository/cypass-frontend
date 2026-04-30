<template>
  <div class="bg-ash/20 backdrop-blur-xl rounded-[4rem] border border-ash/50 overflow-hidden animate-fade-up">
    <div class="p-8 md:p-12">
      <h2 class="text-2xl font-black text-BtW mb-10 flex items-center gap-4">
        <div class="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
          <IconCode class="w-6 h-6" />
        </div>
        Comparatif des offres API
      </h2>

      <div class="overflow-auto max-h-[65vh] rounded-xl ring-1 ring-ash/5">
        <table class="w-full text-left border-collapse min-w-[600px] relative">
          <thead class="sticky top-0 z-20">
            <tr class="border-b border-ash/20">
              <th class="py-6 pr-4 text-[10px] font-black text-hsa uppercase tracking-[0.2em] w-[40%]">SLA & Technique
              </th>
              <th v-for="t in tiers" :key="t.name"
                class="py-6 px-4 text-[10px] font-black text-center uppercase tracking-[0.2em]"
                :class="t.featured ? 'text-secondary' : 'text-hsa'">
                {{ t.name }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ash/5">
            <tr v-for="row in comparison" :key="row.feature" class="group hover:bg-ash/5 transition-colors">
              <td class="py-6 pr-4">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-bold text-BtW">{{ row.feature }}</p>
                  <UiAppTooltip v-if="row.tooltip" :content="row.tooltip" />
                </div>
              </td>
              <td class="py-6 px-4 text-center">
                <span v-if="typeof row.free === 'string'" class="text-sm font-bold text-BtW">{{ row.free }}</span>
                <IconCircleCheck v-else-if="row.free === true" class="w-5 h-5 text-secondary/40 mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
              <td class="py-6 px-4 text-center">
                <span v-if="typeof row.starter === 'string'" class="text-sm font-bold text-BtW">{{ row.starter }}</span>
                <IconCircleCheck v-else-if="row.starter === true" class="w-5 h-5 text-secondary/70 mx-auto" />
                <span v-else class="text-hsa/30">—</span>
              </td>
              <td class="py-6 px-4 text-center">
                <span v-if="typeof row.ent === 'string'" class="text-sm font-bold text-BtW">{{ row.ent }}</span>
                <IconCircleCheck v-else-if="row.ent === true" class="w-5 h-5 text-secondary mx-auto" />
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
import { IconCircleCheck, IconCode } from '@tabler/icons-vue'
import { apiTiers, apiComparison } from '~/utils/pricing'

const tiers = apiTiers
const comparison = apiComparison
</script>
