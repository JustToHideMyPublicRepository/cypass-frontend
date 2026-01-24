<template>
  <div>
    <div v-if="categories.length > 0" class="grid md:grid-cols-2 gap-8">
      <div v-for="category in categories" :key="category.title" class="animate-fade-up">
        <h2 class="flex items-center gap-3 text-lg font-bold mb-6 text-BtW">
          <span class="w-2 h-6 bg-primary rounded-full"></span>
          {{ category.title }}
        </h2>

        <div class="space-y-3">
          <div v-for="s in category.items" :key="s.label"
            class="flex items-center justify-between p-4 rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all group">
            <span class="text-BtW font-medium text-sm">{{ s.label }}</span>
            <div class="flex items-center gap-1">
              <template v-if="s.modifier">
                <kbd class="kbd-base uppercase">{{ s.modifier }}</kbd>
                <span class="text-hsa text-[10px]">+</span>
              </template>
              <kbd class="kbd-base uppercase">{{ s.key }}</kbd>
            </div>
          </div>
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
import { IconSearchOff } from '@tabler/icons-vue'

defineProps<{
  categories: {
    title: string
    items: any[]
  }[]
}>()
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
