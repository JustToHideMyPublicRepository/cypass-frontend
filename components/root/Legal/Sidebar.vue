<template>
  <div class="hidden lg:block lg:col-span-1">
    <div class="sticky top-32 space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-4">Sommaire</h3>
      <nav class="flex flex-col space-y-1">
        <a v-for="item in toc" :key="item.id" :href="`#${item.id}`"
          class="px-4 py-2 text-sm rounded-lg transition-all duration-200 text-hsa hover:text-primary hover:bg-ash"
          :class="{ 'text-primary bg-ashAct/10 font-bold shadow-sm': activeSection === item.id }">
          {{ item.label }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Définition d'un élément du sommaire
export interface TocItem {
  id: string
  label: string
}

// Props pour le sommaire interactif
defineProps<{
  toc: TocItem[]
  activeSection?: string
}>()
</script>
