<template>
  <nav class="flex mb-6 overflow-x-auto scrollbar-hide py-1" aria-label="Fil d'Ariane">
    <ol class="inline-flex items-center space-x-2 md:space-x-4 whitespace-nowrap">
      <!-- Lien vers l'accueil -->
      <li class="inline-flex items-center">
        <NuxtLink to="/"
          class="inline-flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-hsa hover:text-primary transition-all duration-300 group/home">
          <IconHome class="w-3.5 h-3.5 mr-2 group-hover/home:scale-110 transition-transform" />
          Accueil
        </NuxtLink>
      </li>

      <!-- Éléments de navigation dynamiques -->
      <li v-for="(item, index) in items" :key="index" class="group/item">
        <div class="flex items-center">
          <IconChevronRight class="w-4 h-4 text-ashAct/50 mx-1 md:mx-2" />

          <NuxtLink v-if="item.path" :to="item.path"
            class="text-[10px] md:text-xs font-black uppercase tracking-widest text-hsa hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-primary hover:after:w-full after:transition-all after:duration-300">
            {{ item.label }}
          </NuxtLink>

          <span v-else
            class="text-[10px] md:text-xs font-black uppercase tracking-widest text-BtW truncate max-w-[120px] md:max-w-xs opacity-90">
            {{ item.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { IconHome, IconChevronRight } from '@tabler/icons-vue'

// Interface pour les éléments du fil d'Ariane
interface BreadcrumbItem {
  label: string
  path?: string
}

// Propriétés du composant
defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
