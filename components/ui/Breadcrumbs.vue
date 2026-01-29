<template>
  <nav class="flex mb-4" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink to="/"
          class="inline-flex items-center text-xs font-medium text-hsa hover:text-primary transition-colors">
          <IconHome class="w-3.5 h-3.5 mr-1.5" />
          Accueil
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="index">
        <div class="flex items-center">
          <IconChevronRight class="w-4 h-4 text-hsa/40 mx-1" />
          <NuxtLink v-if="item.path" :to="item.path"
            class="ml-1 text-xs font-medium text-hsa hover:text-primary transition-colors md:ml-2">
            {{ item.label }}
          </NuxtLink>
          <span v-else class="ml-1 text-xs font-semibold text-BtW md:ml-2 truncate max-w-[150px] md:max-w-xs">
            {{ item.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { IconHome, IconChevronRight } from '@tabler/icons-vue'

interface BreadcrumbItem {
  label: string
  path?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>
