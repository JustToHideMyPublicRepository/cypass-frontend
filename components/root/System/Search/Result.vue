<template>
  <main class="lg:col-span-3 space-y-6">
    <!-- État de chargement -->
    <div v-if="loading" class="space-y-4">
      <UiAppSkeleton v-for="i in 5" :key="i" height="80px" />
    </div>

    <!-- Saisie trop courte -->
    <div v-else-if="query.length === 1" class="bg-WtB rounded-2xl p-12 text-center border border-ash animate-fade-in">
      <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconKeyboard class="w-8 h-8 text-primary" />
      </div>
      <h3 class="text-lg font-bold text-BtW">Continuez à saisir...</h3>
      <p class="text-hsa">Veuillez saisir au moins 2 caractères pour lancer la recherche.</p>
    </div>

    <!-- État vide -->
    <div v-else-if="results.length === 0" class="bg-WtB rounded-2xl p-12 text-center border border-ash">
      <div class="w-16 h-16 bg-ash/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconSearch class="w-8 h-8 text-hsa" />
      </div>
      <h3 class="text-lg font-bold text-BtW">Aucun résultat</h3>
      <p class="text-hsa">Essayez avec d'autres mots-clés ou modifiez vos filtres.</p>
    </div>

    <!-- Liste des résultats -->
    <div v-else class="space-y-4">
      <div v-for="result in results" :key="result.id"
        class="bg-WtB border border-ash rounded-2xl p-4 transition-all group" :class="[
          result.isShortcut ? 'cursor-help opacity-80' : 'hover:shadow-lg cursor-pointer'
        ]" @click="!result.isShortcut && $emit('navigate', result)">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :class="getSearchIconStyle(result.type)">
            <component :is="getSearchIcon(result.type)" class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-xs font-black text-primary uppercase tracking-widest">{{ result.category }}</span>
              <span class="text-hsa text-[10px]">•</span>
              <span class="text-[10px] text-hsa">{{ result.type.toUpperCase() }}</span>
            </div>
            <h4 class="text-base font-bold text-BtW truncate transition-colors"
              :class="{ 'group-hover:text-primary': !result.isShortcut }">{{
                result.title }}</h4>
            <p class="text-sm text-hsa truncate line-clamp-1">{{ result.description }}</p>
          </div>
          <IconChevronRight v-if="!result.isShortcut"
            class="w-5 h-5 text-hsa group-hover:translate-x-1 transition-transform" />
          <IconSquareF1 v-else class="w-5 h-5 text-hsa/40" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { IconSearch, IconChevronRight, IconKeyboard, IconSquareF1 } from '@tabler/icons-vue'
import { getSearchIcon, getSearchIconStyle } from '~/utils/search'

defineProps<{
  results: any[]
  loading: boolean
  query: string
}>()

defineEmits(['navigate', 'modify', 'reset'])


</script>
