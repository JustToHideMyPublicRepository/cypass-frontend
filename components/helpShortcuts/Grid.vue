<template>
  <div>
    <div v-if="categories.length > 0" class="grid md:grid-cols-3 gap-8 items-start">
      <div v-for="category in categories" :key="category.title" class="animate-fade-up">
        <h2 class="flex items-center gap-3 text-lg font-bold mb-6 text-BtW">
          <span class="w-2 h-6 bg-primary rounded-full"></span>
          {{ category.title }}
        </h2>

        <div class="space-y-3">
          <div v-for="s in getVisibleItems(category)" :key="s.label"
            class="flex items-center justify-between p-4 rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all group">
            <span class="text-BtW font-medium text-sm">{{ s.label }}</span>
            <div class="flex items-center gap-1">
              <template v-if="s.modifier">
                <kbd class="kbd-base uppercase">{{ s.modifier }}</kbd>
                <span class="text-hsa text-[10px]">+</span>
              </template>
              <template v-for="(k, index) in s.keys" :key="index">
                <kbd class="kbd-base uppercase">{{ k === 'enter' ? '↵' : k }}</kbd>
                <span v-if="(index as number) < s.keys.length - 1" class="text-hsa text-[10px]">+</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Toggle Button -->
        <div v-if="category.items.length > 3" class="mt-4">
          <button @click="toggleCategory(category.title)"
            class="flex items-center gap-2 text-xs font-bold text-hsa hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-ash">
            <component :is="isExpanded(category.title) ? IconChevronUp : IconChevronDown" class="w-4 h-4" />
            {{ isExpanded(category.title) ? 'Voir moins' : `Voir plus (${category.items.length - 3} de plus)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 text-center animate-fade-in">
      <div class="w-16 h-16 rounded-full bg-ash flex items-center justify-center mx-auto mb-4 text-hsa">
        <IconSearchOff class="w-8 h-8" />
      </div>
      <p class="text-hsa">Aucun raccourci ne correspond à votre recherche.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearchOff, IconChevronDown, IconChevronUp } from '@tabler/icons-vue'

defineProps<{
  categories: {
    title: string
    items: any[]
  }[]
}>()

const expandedCategories = ref<Set<string>>(new Set())

const toggleCategory = (title: string) => {
  if (expandedCategories.value.has(title)) {
    expandedCategories.value.delete(title)
  } else {
    expandedCategories.value.add(title)
  }
}

const isExpanded = (title: string) => expandedCategories.value.has(title)

const getVisibleItems = (category: any) => {
  if (isExpanded(category.title)) return category.items
  return category.items.slice(0, 3)
}
</script>

<style scoped>
.kbd-base {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-BtW);
  color: var(--color-WtB);
  border: 1px solid var(--color-ash);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 0 0 var(--color-hsa);
  min-width: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
