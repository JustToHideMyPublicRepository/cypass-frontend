<template>
  <section class="max-w-6xl mx-auto mb-10 md:mb-12">
    <div class="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
      <UiBaseButton @click="$emit('update:selectedCategory', null)" variant="ghost"
        class="!px-4 md:!px-6 !py-2 !rounded-full !font-bold transition-all border !text-sm md:!text-base !h-auto"
        :class="!selectedCategory ? '!bg-primary !text-WtB !border-primary shadow-lg shadow-primary/20' : '!bg-WtB text-hsa border-ash hover:!border-primary/50'">
        Tous
      </UiBaseButton>
      <UiBaseButton v-for="cat in categories" :key="cat.title" @click="$emit('update:selectedCategory', cat.title)"
        variant="ghost"
        class="!px-4 md:!px-6 !py-2 !rounded-full !font-bold transition-all border !text-sm md:!text-base !h-auto"
        :class="selectedCategory === cat.title ? '!bg-primary !text-WtB !border-primary shadow-lg shadow-primary/20' : '!bg-WtB text-hsa border-ash hover:!border-primary/50'">
        {{ cat.title }}
      </UiBaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  categories: any[]
  selectedCategory: string | null
}>()

defineEmits(['update:selectedCategory'])
</script>
