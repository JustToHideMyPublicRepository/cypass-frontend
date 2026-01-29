<template>
  <section class="px-4 sm:px-6 lg:px-8 pb-12">
    <div class="max-w-6xl mx-auto">
      <div class="max-w-3xl mx-auto space-y-12">
        <div v-for="(category, catIndex) in categories" :key="catIndex" class="animate-fade-up"
          :style="{ animationDelay: `${200 + catIndex * 100}ms` }">
          <h2 class="flex items-center gap-3 text-2xl font-bold mb-8">
            <span class="w-8 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></span>
            {{ category.title }}
          </h2>

          <div class="space-y-4">
            <div v-for="(item, index) in category.items" :key="index"
              class="group bg-WtB rounded-2xl border border-ash overflow-hidden transition-all duration-300 hover:border-primary/50"
              :class="{ 'shadow-lg ring-1 ring-primary/20': activeIndex === `${catIndex}-${index}` }">

              <button @click="toggle(`${catIndex}-${index}`)"
                class="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <span class="font-bold text-lg pr-4 group-hover:text-primary transition-colors">{{
                  item.question }}</span>
                <div
                  class="w-8 h-8 rounded-full bg-ash flex items-center justify-center transition-colors group-hover:bg-primary/10">
                  <IconChevronDown class="w-5 h-5 text-hsa transition-transform duration-300"
                    :class="{ 'rotate-180 text-primary': activeIndex === `${catIndex}-${index}` }" />
                </div>
              </button>

              <div v-show="activeIndex === `${catIndex}-${index}`"
                class="px-6 pb-8 text-hsa leading-relaxed max-w-none prose prose-slate">
                {{ item.answer }}

                <div class="mt-4 pt-4 border-t border-dashed border-ash flex items-center gap-2 text-xs text-hsa">
                  <IconBulb class="w-4 h-4 text-yellow-500" />
                  <span>Cela a-t-il répondu à votre question ?</span>
                  <button class="hover:text-primary underline">Oui</button>
                  <span>•</span>
                  <button class="hover:text-primary underline">Non</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown, IconBulb } from '@tabler/icons-vue'

defineProps<{
  categories: any[]
}>()

const activeIndex = ref<string | null>(null)

const toggle = (id: string) => {
  activeIndex.value = activeIndex.value === id ? null : id
}
</script>
