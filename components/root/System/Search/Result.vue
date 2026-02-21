<template>
  <main class="lg:col-span-3 space-y-6">
    <!-- État de chargement -->
    <div v-if="loading" class="space-y-4">
      <UiAppSkeleton v-for="i in 5" :key="i" height="80px" />
    </div>

    <!-- État vide -->
    <div v-else-if="results.length === 0" class="bg-WtB rounded-2xl p-12 text-center border border-ash">
      <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconSearch class="w-8 h-8 text-hsa" />
      </div>
      <h3 class="text-lg font-bold text-BtW">Aucun résultat</h3>
      <p class="text-hsa">Essayez avec d'autres mots-clés ou modifiez vos filtres.</p>
    </div>

    <!-- Liste des résultats -->
    <div v-else class="space-y-4">
      <div v-for="result in results" :key="result.id"
        class="bg-WtB border border-ash rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer group"
        @click="$emit('navigate', result)">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :class="[
            result.type === 'navigation' ? 'bg-blue-500/10 text-blue-500' :
              result.type === 'document' ? 'bg-orange-500/10 text-orange-500' :
                'bg-purple-500/10 text-purple-500'
          ]">
            <component :is="getIcon(result.type)" class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-black text-primary uppercase tracking-widest">{{ result.category }}</span>
              <span class="text-hsa text-[10px]">•</span>
              <span class="text-[10px] text-hsa">{{ result.type.toUpperCase() }}</span>
            </div>
            <h4 class="text-base font-bold text-BtW truncate group-hover:text-primary transition-colors">{{
              result.title }}</h4>
            <p class="text-sm text-hsa truncate line-clamp-1">{{ result.description }}</p>
          </div>
          <IconChevronRight class="w-5 h-5 text-hsa group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconSearch, IconFileDescription, IconLayoutDashboard, IconSettings, IconChevronRight } from '@tabler/icons-vue'

defineProps<{
  results: any[]
  loading: boolean
}>()

defineEmits(['navigate'])

const getIcon = (type: string) => {
  switch (type) {
    case 'navigation': return IconLayoutDashboard
    case 'document': return IconFileDescription
    case 'action': return IconSettings
    default: return IconSearch
  }
}
</script>
