<template>
  <div class="relative pb-12 md:pb-20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto space-y-8 md:space-y-12">
      <!-- Fil d'Ariane -->
      <UiBreadcrumbs :items="breadcrumbItems" />

      <!-- Contenu de l'article -->
      <div v-if="article"
        class="grid lg:grid-cols-4 gap-8 md:gap-12 animate-fade-in rounded-[3rem] p-1 overflow-hidden">
        <!-- Article principal -->
        <article class="lg:col-span-3 space-y-8 glass-panel p-8 md:p-16 rounded-[2.8rem] border border-ash/30">
          <div class="space-y-4">
            <span class="badge badge-primary">{{ article.category }}</span>
            <h1 class="text-3xl md:text-5xl font-black text-BtW tracking-tight leading-tight">
              {{ article.title }}
            </h1>
          </div>

          <div class="prose prose-slate max-w-none text-hsa text-lg leading-relaxed space-y-6">
            <p v-for="(p, i) in article.content.split('\n')" :key="i"
              class="first-letter:text-2xl first-letter:font-black first-letter:text-primary">
              {{ p }}
            </p>
          </div>

          <div class="pt-12 border-t border-ash/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div class="space-y-1 text-center sm:text-left">
              <p class="text-sm font-bold text-BtW">Cet article vous a-t-il aidé ?</p>
              <p class="text-xs text-hsa">Dernière mise à jour : {{ formatLastUpdate(article.lastUpdate) }}</p>
            </div>
            <div class="flex gap-4">
              <UiBaseButton variant="ghost" size="sm"
                class="!rounded-2xl border border-ash/50 hover:bg-success/10 hover:text-success hover:border-success/30">
                <IconThumbUp class="w-4 h-4 mr-2" /> Oui
              </UiBaseButton>
              <UiBaseButton variant="ghost" size="sm"
                class="!rounded-2xl border border-ash/50 hover:bg-danger/10 hover:text-danger hover:border-danger/30">
                <IconThumbDown class="w-4 h-4 mr-2" /> Non
              </UiBaseButton>
            </div>
          </div>
        </article>

        <!-- Articles Liés -->
        <aside class="hidden lg:block space-y-8 pt-8">
          <div class="glass-panel p-8 rounded-[2rem] border border-ash/30 sticky top-24">
            <h4 class="text-xs font-black uppercase tracking-[0.2em] text-hsa mb-6">Articles liés</h4>
            <div class="space-y-6">
              <NuxtLink v-for="art in relatedArticles" :key="art.id" :to="`/support/${category?.id}/${art.id}`"
                class="block group text-left space-y-2">
                <p
                  class="text-sm font-bold text-BtW group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {{ art.title }}
                </p>
                <div class="h-1 w-0 group-hover:w-full bg-primary/20 transition-all duration-300 rounded-full"></div>
              </NuxtLink>
            </div>

            <div class="mt-12 pt-8 border-t border-ash/50">
              <p class="text-xs text-hsa font-medium mb-4 italic">Besoin d'une aide personnalisée ?</p>
              <UiBaseButton to="/contact" variant="accent" size="sm"
                class="w-full !py-4 font-black tracking-widest text-[10px] uppercase">
                Contacter un expert
              </UiBaseButton>
            </div>
          </div>
        </aside>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-hsa italic">Article non trouvé.</p>
        <NuxtLink to="/support" class="text-primary font-bold mt-4 inline-block underline">Retour au support</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { supportData } from '~/data/support'
import { IconThumbUp, IconThumbDown } from '@tabler/icons-vue'

const formatLastUpdate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  }).replace(/^\w/, (c) => c.toUpperCase())
}

const route = useRoute()
const categoryId = computed(() => route.params.category as string)
const slug = computed(() => route.params.slug as string)

const category = computed(() =>
  supportData.find(c => c.id === categoryId.value)
)

const article = computed(() =>
  category.value?.articles.find(a => a.id === slug.value)
)

const relatedArticles = computed(() =>
  category.value?.articles.filter(a => a.id !== slug.value).slice(0, 3) || []
)

const breadcrumbItems = computed(() => [
  { label: 'Support', path: '/support' },
  { label: category.value?.title || 'Catégorie', path: `/support/${category.value?.id}` },
  { label: article.value?.title || 'Article' }
])

definePageMeta({
  layout: 'guest'
})

useHead({
  title: computed(() => article.value ? `${article.value.title} - Centre d'aide` : 'Article - Support')
})
</script>
