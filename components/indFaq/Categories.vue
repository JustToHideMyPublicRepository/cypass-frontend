<template>
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
    <div class="flex flex-wrap justify-center gap-4 mb-12">
      <button @click="$emit('update:selectedCategory', null)"
        class="px-6 py-2 rounded-full font-bold transition-all border"
        :class="!selectedCategory ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-WtB text-hsa border-ash hover:border-primary/50'">
        Tous
      </button>
      <button v-for="cat in categories" :key="cat.title" @click="$emit('update:selectedCategory', cat.title)"
        class="px-6 py-2 rounded-full font-bold transition-all border"
        :class="selectedCategory === cat.title ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-WtB text-hsa border-ash hover:border-primary/50'">
        {{ cat.title }}
      </button>
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
