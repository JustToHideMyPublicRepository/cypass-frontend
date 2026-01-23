<template>
  <div class="relative">
    <!-- Hero Section -->
    <section class="pb-20 px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div class="max-w-3xl mx-auto space-y-8 animate-fade-up">
        <span class="badge badge-primary mb-4">Support & Documentation</span>
        <h1 class="text-5xl md:text-6xl font-black tracking-tight leading-tight">
          Comment pouvons-nous <br /> <span class="text-primary">vous aider ?</span>
        </h1>

        <!-- Search Bar -->
        <div class="max-w-2xl mx-auto relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
          </div>
          <input ref="searchInput" v-model="searchQuery" type="text"
            class="block w-full pl-12 pr-16 py-4 bg-WtB border border-ash rounded-2xl shadow-lg shadow-ash/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            placeholder="Rechercher une réponse (ex: mot de passe, API, sécurité)...">
          <div class="hidden sm:flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2">
            <kbd class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct">CTRL</kbd>
            <span class="text-[10px] text-hsa">+</span>
            <kbd class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct">K</kbd>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Topics Grid -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button @click="selectedCategoryText = null" class="px-6 py-2 rounded-full font-bold transition-all border"
          :class="!selectedCategoryText ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-WtB text-hsa border-ash hover:border-primary/50'">
          Tous
        </button>
        <button v-for="cat in faqCategories" :key="cat.title" @click="selectedCategoryText = cat.title"
          class="px-6 py-2 rounded-full font-bold transition-all border"
          :class="selectedCategoryText === cat.title ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-WtB text-hsa border-ash hover:border-primary/50'">
          {{ cat.title }}
        </button>
      </div>
    </section>
    <section class="px-4 sm:px-6 lg:px-8 pb-12">
      <div class="max-w-6xl mx-auto">
        <!-- FAQ List -->
        <div class="max-w-3xl mx-auto space-y-12">
          <div v-for="(category, catIndex) in filteredCategories" :key="catIndex" class="animate-fade-up"
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

    <!-- Still need help? -->
    <section class="py-20 text-center">
      <div class="max-w-2xl mx-auto px-4 animate-fade-up">
        <div
          class="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
          <!-- Decor -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2">
          </div>

          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h3>
            <p class="text-slate-300 mb-8">Notre équipe de support est disponible 24/7 pour vous accompagner.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink to="/support" class="btn bg-white text-slate-900 hover:bg-slate-100 border-none">
                <IconMessageCircle class="w-5 h-5 mr-2" />
                Ouvrir un ticket
              </NuxtLink>
              <a href="mailto:support@cypass.bj"
                class="btn bg-transparent border border-white/20 text-white hover:bg-white/10">
                Envoyer un email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconChevronDown, IconSearch, IconMessageCircle, IconBulb } from '@tabler/icons-vue'
import { faqCategories } from '@/data/faq'

const searchInput = ref<HTMLInputElement | null>(null)

useShortcuts({
  searchCallback: () => searchInput.value?.focus()
})

definePageMeta({
  layout: 'guest'
})

const activeIndex = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategoryText = ref<string | null>(null)

// Filter FAQ based on search and selection
const filteredCategories = computed(() => {
  let categories = faqCategories

  // Filter by Category Selection
  if (selectedCategoryText.value) {
    categories = categories.filter(cat => cat.title === selectedCategoryText.value)
  }

  // Filter by Search
  if (searchQuery.value) {
    return categories.map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        item.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })).filter(cat => cat.items.length > 0)
  }

  return categories
})

const toggle = (id: string) => {
  activeIndex.value = activeIndex.value === id ? null : id
}

useHead({
  title: 'Questions Fréquentes'
})
</script>
