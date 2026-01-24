<template>
  <div class="max-w-4xl mx-auto px-4 py-8 relative">
    <!-- Header -->
    <div class="text-center mb-12 animate-fade-up">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
        <IconKeyboard class="w-10 h-10" />
      </div>
      <h1 class="text-4xl font-black tracking-tight mb-4">Raccourcis Clavier</h1>
      <p class="text-lg text-hs">Naviguez plus rapidement sur CYPASS grâce à nos raccourcis.</p>

      <!-- Settings Trigger -->
      <button @click="showSettings = true"
        class="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ash/50 border border-ashAct text-hsa hover:text-primary hover:border-primary/50 transition-all text-sm font-bold">
        <IconSettings class="w-4 h-4" />
        Configurer mes raccourcis
      </button>
    </div>

    <!-- Power User Mode (Alt) -->
    <div class="mb-12 p-6 rounded-3xl bg-primary/5 border border-primary/20 animate-fade-up shadow-sm">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <IconBolt class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold text-BtW text-lg mb-1">Mode Expert (ALT)</h3>
          <p class="text-hsa text-sm leading-relaxed mb-4">
            Maintenez la touche <kbd class="kbd py-0.5 px-1.5 min-w-0">ALT</kbd> de votre clavier pour voir apparaître
            instantanément les indices de raccourcis sur tous les boutons et liens concernés.
          </p>
          <div
            class="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full">
            <IconInfoCircle class="w-4 h-4" />
            <span>En mode ALT, appuyez simplement sur la touche sans SHIFT</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls: Search & Sort -->
    <div class="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up" style="animation-delay: 100ms">
      <!-- Search Bar -->
      <div class="flex-1 relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
        </div>
        <input ref="searchInput" v-model="searchQuery" type="text"
          class="block w-full pl-12 pr-16 py-3.5 bg-WtB border border-ash rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm"
          placeholder="Rechercher un raccourci...">
        <div class="hidden sm:flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
          <kbd
            class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">Ctrl</kbd>
          <span class="text-[10px] text-hsa">+</span>
          <kbd
            class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">K</kbd>
        </div>
      </div>

      <!-- Sorting -->
      <div class="flex items-center gap-2 bg-WtB border border-ash rounded-2xl p-1 shadow-sm">
        <button v-for="option in sortOptions" :key="option.value" @click="sortBy = option.value"
          class="px-4 py-2 text-xs font-bold rounded-xl transition-all"
          :class="sortBy === option.value ? 'bg-primary text-white shadow-md' : 'text-hsa hover:bg-ash'">
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Shortcuts Grid -->
    <div class="grid md:grid-cols-2 gap-8">
      <div v-for="category in filteredShortcuts" :key="category.title" class="animate-fade-up">
        <h2 class="flex items-center gap-3 text-lg font-bold mb-6 text-BtW">
          <span class="w-2 h-6 bg-primary rounded-full"></span>
          {{ category.title }}
        </h2>

        <div class="space-y-3">
          <div v-for="s in category.items" :key="s.label"
            class="flex items-center justify-between p-4 rounded-2xl bg-WtB border border-ash hover:border-primary/30 hover:shadow-md transition-all group">
            <span class="text-BtW font-medium text-sm">{{ s.label }}</span>
            <div class="flex items-center gap-1">
              <template v-if="s.modifier">
                <kbd class="kbd uppercase">{{ s.modifier }}</kbd>
                <span class="text-hsa text-[10px]">+</span>
              </template>
              <kbd class="kbd uppercase">{{ s.key }}</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredShortcuts.length === 0" class="py-20 text-center animate-fade-in">
      <div class="w-16 h-16 rounded-full bg-ash flex items-center justify-center mx-auto mb-4 text-hsa">
        <IconSearchOff class="w-8 h-8" />
      </div>
      <p class="text-hsa">Aucun raccourci ne correspond à votre recherche.</p>
    </div>

    <!-- Footer Help -->
    <div class="mt-16 p-8 rounded-3xl bg-ash/30 border border-ash/50 text-center animate-fade-up"
      style="animation-delay: 200ms">
      <p class="text-hsa text-sm">Les raccourcis sont désactivés lorsque vous tapez dans un champ de saisie.</p>
      <div class="mt-6">
        <UiBaseButton to="/" variant="secondary" class="rounded-2xl">Retour à l'accueil</UiBaseButton>
      </div>
    </div>

    <!-- Settings Modal -->
    <ShortcutsSettingsModal :show="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  IconKeyboard, IconSearch, IconSearchOff, IconBolt, IconInfoCircle, IconSettings
} from '@tabler/icons-vue'
import { shortcutsData } from '@/data/shortcuts'
import { useShortcutsStore } from '~/stores/shortcuts'

definePageMeta({
  layout: 'guest'
})

useHead({
  title: 'Raccourcis Clavier'
})

const store = useShortcutsStore()
const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const sortBy = ref<'name' | 'key'>(store.sortBy)
const showSettings = ref(false)

// Persist sort preference to store
watch(sortBy, (newVal) => {
  store.sortBy = newVal
  store.save()
})

useShortcuts({
  searchCallback: () => searchInput.value?.focus()
})

const sortOptions = [
  { label: 'Par Nom', value: 'name' },
  { label: 'Par Touche', value: 'key' }
] as const

// Process shortcuts data
const structuredShortcuts = computed(() => {
  const global = Object.values(shortcutsData).filter(s => s.isGlobal)
  const contextual = Object.values(shortcutsData).filter(s => !s.isGlobal)

  return [
    { title: 'Navigation Globale', items: global },
    { title: 'Raccourcis Contextuels', items: contextual }
  ]
})

const filteredShortcuts = computed(() => {
  const query = searchQuery.value.toLowerCase()

  return structuredShortcuts.value.map(cat => {
    let items = [...cat.items]

    // Search filter
    if (query) {
      items = items.filter(s =>
        s.label.toLowerCase().includes(query) ||
        s.key.toLowerCase().includes(query)
      )
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.label.localeCompare(b.label)
      } else {
        return a.key.localeCompare(b.key)
      }
    })

    return { ...cat, items }
  }).filter(cat => cat.items.length > 0)
})
</script>

<style scoped>
.kbd {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-BtW);
  color: var(--color-WtB);
  border: 1px solid var(--color-ash);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 0 0 var(--color-hsa);
  min-width: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
