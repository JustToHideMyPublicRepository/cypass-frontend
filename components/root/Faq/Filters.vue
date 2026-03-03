<template>
  <section class="mb-10 lg:mb-0 space-y-6">
    <!-- Barre de recherche Sidebar -->
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <IconSearch class="w-4 h-4 text-hsa/50 group-focus-within:text-primary transition-colors" />
      </div>
      <input ref="searchInput" :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text"
        class="block w-full pl-10 pr-4 py-3 bg-ash border border-ash rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-bold placeholder:font-normal"
        placeholder="Rechercher...">
      <div class="hidden lg:flex items-center gap-1 absolute right-3 top-1/2 -translate-y-1/2">
        <kbd class="kbd-tip">Ctrl</kbd>
        <kbd class="kbd-tip">K</kbd>
      </div>
    </div>

    <!-- Filtres de catégories FAQ - Adapté pour Sidebar -->
    <div class="flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-2 md:gap-3">
      <UiBaseButton @click="$emit('update:selectedCategory', null)" variant="ghost"
        class="!px-5 !py-3 !rounded-2xl !font-bold transition-all border !text-sm !h-auto !justify-start w-full group"
        :class="!selectedCategory ? '!bg-primary !text-WtB !border-primary shadow-lg shadow-primary/20' : '!bg-ash text-hsa border-ash hover:!border-primary/50'">
        <IconHelp class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        Tous
      </UiBaseButton>
      <UiBaseButton v-for="cat in categories" :key="cat.title" @click="$emit('update:selectedCategory', cat.title)"
        variant="ghost"
        class="!px-5 !py-3 !rounded-2xl !font-bold transition-all border !text-sm !h-auto !justify-start w-full group"
        :class="selectedCategory === cat.title ? '!bg-primary !text-WtB !border-primary shadow-lg shadow-primary/20' : '!bg-ash text-hsa border-ash hover:!border-primary/50'">
        <component :is="cat.icon || IconHelp"
          class="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
        {{ cat.title }}
      </UiBaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconHelp, IconSearch } from '@tabler/icons-vue'

defineProps<{
  categories: any[]
  selectedCategory: string | null
  searchQuery: string
}>()

defineEmits(['update:selectedCategory', 'update:searchQuery'])

const searchInput = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>
