<template>
  <aside class="space-y-6">
    <UiBaseCard title="Recherches récentes">
      <!-- État vide -->
      <div v-if="searchStore.recentSearches.length === 0 && searchStore.recentQueries.length === 0"
        class="text-center py-6">
        <div class="w-12 h-12 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-3">
          <IconClock class="w-6 h-6 text-hsa" />
        </div>
        <p class="text-sm text-hsa">Aucune recherche récente</p>
      </div>

      <!-- Liste des recherches récentes -->
      <div v-else class="space-y-6">
        <!-- Thèmes -->
        <div v-if="searchStore.recentQueries.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-hsa uppercase tracking-widest">Thèmes</span>
            <button v-if="searchStore.recentSearches.length === 0" @click="searchStore.clearRecentSearches()"
              class="text-[10px] font-medium text-hsa hover:text-red-400">
              Effacer
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="query in searchStore.recentQueries" :key="query" @click="$emit('query-click', query)"
              class="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-ash/30 border border-ash hover:border-primary/30 hover:bg-primary/5 transition-all">
              <IconHistory class="w-3 h-3 text-hsa" />
              <span class="text-xs font-bold text-BtW">{{ query }}</span>
              <IconX @click.stop="searchStore.removeRecentQuery(query)"
                class="w-3 h-3 text-hsa hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </div>
        </div>

        <!-- Pages -->
        <div v-if="searchStore.recentSearches.length > 0" class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-hsa uppercase tracking-widest">Pages consultées</span>
            <button @click="searchStore.clearRecentSearches()"
              class="text-[10px] font-medium text-hsa hover:text-red-400">
              Effacer tout
            </button>
          </div>
          <div class="space-y-1">
            <div v-for="recent in searchStore.recentSearches" :key="recent.id"
              class="group flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-ash/50 transition-all">
              <button @click="$emit('navigate', recent)" class="flex items-center gap-3 flex-1 text-left min-w-0">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  :class="getSearchIconStyle(recent.type)">
                  <component :is="getSearchIcon(recent.type)" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-BtW truncate">{{ recent.title }}</div>
                  <div class="text-xs text-hsa truncate">{{ recent.description }}</div>
                </div>
              </button>
              <button @click.stop="searchStore.removeRecentSearch(recent.id)"
                class="opacity-0 group-hover:opacity-100 p-1.5 text-hsa hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all shrink-0">
                <IconX class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </UiBaseCard>
  </aside>
</template>

<script setup lang="ts">
import { IconClock, IconX, IconHistory } from '@tabler/icons-vue'
import { useSearchStore } from '~/stores/search'
import { getSearchIcon, getSearchIconStyle } from '~/utils/search'

const searchStore = useSearchStore()

defineEmits(['navigate', 'query-click'])
</script>
