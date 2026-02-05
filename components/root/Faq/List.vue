<template>
  <section class="pb-10 md:pb-12">
    <div class="max-w-6xl mx-auto">
      <div class="max-w-3xl mx-auto space-y-8 md:space-y-12">
        <div v-for="(category, catIndex) in categories" :key="catIndex" class="animate-fade-up"
          :style="{ animationDelay: `${200 + catIndex * 100}ms` }">
          <h2 class="flex items-center gap-3 text-xl md:text-2xl font-bold mb-6 md:mb-8">
            <span class="w-8 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></span>
            {{ category.title }}
          </h2>

          <div class="space-y-3 md:space-y-4">
            <div v-for="(item, index) in category.items" :key="index"
              class="group bg-WtB rounded-xl md:rounded-2xl border border-ash overflow-hidden transition-all duration-300 hover:border-primary/50"
              :class="{ 'shadow-lg ring-1 ring-primary/20': activeIndex === `${catIndex}-${index}` }">

              <UiBaseButton @click="toggle(`${catIndex}-${index}`)" variant="ghost"
                class="!w-full !flex !items-center !justify-between !p-4 md:!p-6 !text-left focus:outline-none !h-auto !bg-transparent hover:!bg-transparent">
                <span
                  class="font-bold text-base md:text-lg pr-4 group-hover:text-primary transition-colors leading-snug">{{
                    item.question }}</span>
                <div
                  class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-ash flex items-center justify-center transition-colors group-hover:bg-primary/10 flex-shrink-0">
                  <IconChevronDown class="w-4 h-4 md:w-5 h-5 text-hsa transition-transform duration-300"
                    :class="{ 'rotate-180 text-primary': activeIndex === `${catIndex}-${index}` }" />
                </div>
              </UiBaseButton>

              <div v-show="activeIndex === `${catIndex}-${index}`"
                class="px-4 md:px-6 pb-6 md:pb-8 text-hsa leading-relaxed max-w-none text-sm md:text-base prose prose-slate">
                {{ item.answer }}

                <div
                  class="mt-4 pt-4 border-t border-dashed border-ash flex items-center gap-2 text-[10px] md:text-xs text-hsa">
                  <IconBulb class="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
                  <span>Cela a-t-il répondu à votre question ?</span>
                  <UiBaseButton variant="ghost"
                    class="hover:!text-primary !underline !p-0 !h-auto !text-inherit !font-inherit !bg-transparent">Oui
                  </UiBaseButton>
                  <span>•</span>
                  <UiBaseButton variant="ghost"
                    class="hover:!text-primary !underline !p-0 !h-auto !text-inherit !font-inherit !bg-transparent">Non
                  </UiBaseButton>
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
