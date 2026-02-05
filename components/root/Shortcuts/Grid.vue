<template>
  <div>
    <div v-if="categories.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
      <div v-for="category in categories" :key="category.title" class="animate-fade-up">
        <h2 class="flex items-center gap-2 md:gap-3 text-base md:text-lg font-bold mb-4 md:mb-6 text-BtW">
          <span class="w-1.5 h-5 md:w-2 md:h-6 bg-primary rounded-full"></span>
          {{ category.title }}
        </h2>

        <div class="space-y-2.5 md:space-y-3">
          <div v-for="s in getVisibleItems(category)" :key="s.label"
            class="flex items-center justify-between p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all group">
            <span class="text-BtW font-medium text-xs md:text-sm">{{ s.label }}</span>
            <div class="flex items-center gap-1">
              <template v-if="s.modifier">
                <template v-for="(m, midx) in s.modifier.split('+')" :key="'mod-' + midx">
                  <kbd class="kbd-hint">{{ m.trim() }}</kbd>
                  <span class="text-hsa text-[9px] md:text-[10px]">+</span>
                </template>
              </template>
              <template v-for="(k, index) in s.keys" :key="index">
                <kbd class="kbd-hint">{{ k === 'enter' ? '↵' : k }}</kbd>
                <span v-if="(index as number) < s.keys.length - 1" class="text-hsa text-[9px] md:text-[10px]">+</span>
              </template>
            </div>
          </div>
        </div>

        <!-- Bouton de bascule -->
        <div v-if="category.items.length > 3" class="mt-3 md:mt-4">
          <UiBaseButton @click="toggleCategory(category.title)" variant="ghost"
            class="!flex !items-center !gap-2 !text-[11px] md:!text-xs !font-bold text-hsa hover:!text-primary transition-colors !px-3 md:!px-4 !py-1.5 md:!py-2 !rounded-xl hover:!bg-ash !h-auto">
            <component :is="isExpanded(category.title) ? IconChevronUp : IconChevronDown"
              class="w-3.5 h-3.5 md:w-4 md:h-4" />
            {{ isExpanded(category.title) ? 'Voir moins' : `Voir plus (${category.items.length - 3} de plus)` }}
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- État Vide -->
    <div v-else class="py-12 md:py-20 text-center animate-fade-in">
      <div class="w-12 h-12 md:w-16 md:h-16 rounded-full bg-ash flex items-center justify-center mx-auto mb-4 text-hsa">
        <IconSearchOff class="w-6 h-6 md:w-8 md:h-8" />
      </div>
      <p class="text-hsa text-sm md:text-base">Aucun raccourci ne correspond à votre recherche.</p>
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
