<template>
  <div class="text-center space-y-6 md:space-y-8 animate-fade-up">
    <span class="badge badge-primary">Centre d'Aide</span>
    <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight">
      Comment pouvons-nous <span class="text-primary">vous aider ?</span>
    </h1>

    <!-- Barre de recherche -->
    <div class="max-w-2xl mx-auto relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
      </div>
      <input ref="searchInput" :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text"
        class="block w-full pl-12 pr-12 md:pr-16 py-3.5 md:py-4 bg-WtB border border-ash rounded-xl md:rounded-2xl shadow-lg shadow-ash/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm md:text-base"
        placeholder="Rechercher une réponse, une API ou un guide...">
      <div class="hidden md:flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2">
        <kbd
          class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">Ctrl</kbd>
        <span class="text-[10px] text-hsa">+</span>
        <kbd class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">K</kbd>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch } from '@tabler/icons-vue'

defineProps<{
  searchQuery: string
}>()

defineEmits(['update:searchQuery'])

const searchInput = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>
