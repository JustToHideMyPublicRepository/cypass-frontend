<template>
  <div class="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style="animation-delay: 100ms">
    <!-- Search Bar -->
    <div class="flex-1 relative group">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
      </div>
      <input ref="searchInput" :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text"
        class="block w-full pl-12 pr-16 py-3.5 bg-WtB border border-ash rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
        placeholder="Rechercher un raccourci...">
      <div class="hidden sm:flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
        <kbd
          class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">Ctrl</kbd>
        <span class="text-[10px] text-hsa">+</span>
        <kbd class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">K</kbd>
      </div>
    </div>

    <!-- Sorting Items -->
    <div class="flex items-center gap-2 bg-WtB border border-ash rounded-2xl p-1 shadow-sm">
      <UiBaseButton v-for="option in sortOptions" :key="option.value" @click="$emit('update:sortBy', option.value)"
        variant="ghost" class="!px-4 !py-2 !text-xs !font-bold !rounded-xl transition-all !h-auto"
        :class="sortBy === option.value ? '!bg-primary !text-WtB shadow-md' : 'hover:!bg-ash'">
        {{ option.label }}
      </UiBaseButton>
    </div>

    <!-- Sorting Groups -->
    <div class="flex items-center gap-2 bg-WtB border border-ash rounded-2xl p-1 shadow-sm">
      <UiBaseButton v-for="option in groupSortOptions" :key="option.value"
        @click="$emit('update:groupSort', option.value)" variant="ghost"
        class="!px-3 !py-2 !text-xs !font-bold !rounded-xl transition-all !flex !items-center !gap-1 !h-auto"
        :class="groupSort === option.value ? '!bg-primary !text-WtB shadow-md' : 'hover:!bg-ash'">
        <component :is="option.icon" class="w-3.5 h-3.5" />
        {{ option.label }}
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch, IconSortAscendingLetters, IconSortDescendingLetters, IconSortAscending, IconSortDescending } from '@tabler/icons-vue'

defineProps<{
  searchQuery: string
  sortBy: 'name' | 'key'
  groupSort: 'az' | 'za' | 'more' | 'less'
}>()

defineEmits(['update:searchQuery', 'update:sortBy', 'update:groupSort'])

const searchInput = ref<HTMLInputElement | null>(null)

const sortOptions = [
  { label: 'Par Nom', value: 'name' },
  { label: 'Par Touche', value: 'key' }
] as const

const groupSortOptions = [
  { label: 'A-Z', value: 'az', icon: IconSortAscendingLetters },
  { label: 'Z-A', value: 'za', icon: IconSortDescendingLetters },
  { label: 'Plus', value: 'more', icon: IconSortDescending },
  { label: 'Moins', value: 'less', icon: IconSortAscending }
] as const

defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>
