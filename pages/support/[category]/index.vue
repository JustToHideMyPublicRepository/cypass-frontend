<template>
  <div class="relative pb-12 md:pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <!-- Fil d'Ariane -->
      <UiBreadcrumbs :items="breadcrumbItems" />

      <!-- En-tête de catégorie -->
      <div v-if="category" class="flex flex-col md:flex-row md:items-center gap-6 animate-fade-in">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
          :class="category.colorClass">
          <component :is="category.icon" class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-BtW tracking-tight uppercase mb-2">{{ category.title }}</h1>
          <p class="text-hsa max-w-2xl">{{ category.desc }}</p>
        </div>
      </div>

      <!-- Liste des articles -->
      <div v-if="category" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <NuxtLink v-for="article in category.articles" :key="article.id" :to="`/support/${category.id}/${article.id}`"
          class="glass-panel p-8 rounded-3xl border border-ash/50 text-left hover:border-primary/30 group transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-xl">
          <h3 class="text-xl font-bold text-BtW group-hover:text-primary mb-4 transition-colors leading-tight">
            {{ article.title }}</h3>
          <p class="text-hsa text-sm line-clamp-3 leading-relaxed mb-6">{{ article.content }}</p>
          <span
            class="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
            Lire l'article
            <IconArrowRight class="w-4 h-4" />
          </span>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-hsa italic">Catégorie non trouvée.</p>
        <NuxtLink to="/support" class="text-primary font-bold mt-4 inline-block underline">Retour au support</NuxtLink>
      </div>

      <RootSupportFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { supportData } from '~/data/support'
import { IconArrowRight } from '@tabler/icons-vue'

const route = useRoute()
const categoryId = computed(() => route.params.category as string)

const category = computed(() =>
  supportData.find(c => c.id === categoryId.value)
)

const breadcrumbItems = computed(() => [
  { label: 'Support', path: '/support' },
  { label: category.value?.title || 'Catégorie' }
])

definePageMeta({
  layout: 'guest'
})

useHead({
  title: computed(() => category.value ? `${category.value.title} - Support` : 'Catégorie - Support'),
  meta: [
    { name: 'description', content: computed(() => category.value?.desc || 'Consultez les articles d\'aide pour cette catégorie sur CYPASS.') },
    { name: 'robots', content: 'index, follow' }
  ]
})
</script>
