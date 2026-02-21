<template>
  <div class="search-trigger-container">
    <!-- Desktop -->
    <div @click="searchStore.openSearch()"
      class="hidden md:flex items-center flex-1 max-w-md relative cursor-pointer group animate-fade-in"
      :class="customClass">
      <IconSearch
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-hsa group-hover:text-primary transition-colors" />
      <input type="text" :value="route.query.q" placeholder="Rechercher..." readonly
        class="w-full pl-10 pr-4 py-2 rounded-xl bg-ash/50 border border-ashAct group-hover:border-primary/30 group-hover:bg-ash transition-all text-sm text-BtW placeholder-slate-400 cursor-pointer" />

      <div class="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
        <kbd class="kbd-tip">Ctrl</kbd>
        <span class="text-[10px] text-hsa">+</span>
        <kbd class="kbd-tip">Shift</kbd>
        <span class="text-[10px] text-hsa">+</span>
        <kbd class="kbd-tip">K</kbd>
      </div>
    </div>

    <!-- Mobile -->
    <button @click="searchStore.openSearch()"
      class="md:hidden p-2 rounded-lg text-hsa hover:bg-ash hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
      <IconSearch class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconSearch } from '@tabler/icons-vue'
import { useSearchStore } from '~/stores/search'
import { useRoute } from 'vue-router'

defineProps<{
  customClass?: string
}>()

const searchStore = useSearchStore()
const route = useRoute()
</script>

<style scoped>
.search-trigger-container {
  display: contents;
}

kbd {
  font-family: inherit;
}
</style>
