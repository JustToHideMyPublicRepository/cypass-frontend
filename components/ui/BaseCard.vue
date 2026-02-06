<template>
  <div
    class="bg-WtB rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-ash/50 p-6 md:p-8 transition-all hover:shadow-2xl hover:border-primary/20 group/card">
    <!-- En-tête de la carte -->
    <div v-if="$slots.header || title" class="mb-6 flex items-center justify-between">
      <h3 v-if="title" class="text-xl font-black text-BtW tracking-tight uppercase">{{ title }}</h3>
      <slot name="header"></slot>
    </div>

    <!-- Contenu de la carte -->
    <div class="text-hsa leading-relaxed">
      <slot></slot>
    </div>

    <!-- Pied de page de la carte -->
    <div v-if="$slots.footer" class="mt-6 pt-6 border-t border-ash/30">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props pour le titre de la carte
defineProps<{
  title?: string
}>()
</script>
