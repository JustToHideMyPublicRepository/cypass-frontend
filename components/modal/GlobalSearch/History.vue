<template>
  <div class="animate-fade-in space-y-6">
    <!-- Thèmes de recherche -->
    <div v-if="searchStore.recentQueries.length > 0" class="space-y-3">
      <div class="flex items-center justify-between px-2">
        <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Thèmes de recherche</h3>
        <button @click.stop="searchStore.clearRecentQueries()"
          class="text-xs font-medium text-hsa hover:text-red-400 transition-colors">
          Tout effacer
        </button>
      </div>
      <div class="flex flex-wrap gap-2 px-2">
        <div v-for="query in searchStore.recentQueries" :key="query"
          class="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-ash/50 border border-ash hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
          @click="$emit('select-query', query)">
          <IconHistory class="w-3.5 h-3.5 text-hsa" />
          <span class="text-xs font-bold text-BtW">{{ query }}</span>
          <button @click.stop="searchStore.removeRecentQuery(query)"
            class="p-0.5 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconX class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Pages consultées -->
    <div v-if="searchStore.recentSearches.length > 0" class="space-y-3">
      <div class="flex items-center justify-between px-2">
        <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Pages consultées</h3>
        <button @click.stop="searchStore.clearRecentSearches()"
          class="text-xs font-medium text-hsa hover:text-red-400 transition-colors">
          Tout effacer
        </button>
      </div>

      <div class="space-y-1">
        <div v-for="recent in searchStore.recentSearches" :key="recent.id"
          class="group flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-ash/50 transition-all duration-200">
          <button @click="$emit('select-result', recent)" class="flex items-center gap-3 flex-1 text-left">
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
            class="opacity-0 group-hover:opacity-100 p-1.5 text-hsa hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Retirer">
            <IconX class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconHistory, IconX } from '@tabler/icons-vue'
import { useSearchStore } from '~/stores/search'
import { getSearchIcon, getSearchIconStyle } from '~/utils/search'

const searchStore = useSearchStore()

defineEmits(['select-query', 'select-result'])
</script>
