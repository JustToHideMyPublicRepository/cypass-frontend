<template>
  <UiBaseCard class="bg-ash/30 border border-dashed border-ash">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 md:gap-8">
        <div class="flex items-center gap-2">
          <IconFilter class="w-4 h-4 text-hsa opacity-50" />
          <span class="text-xs font-bold text-hsa uppercase tracking-[0.2em]">Filtres :</span>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Date</label>
            <input type="date" :value="modelValue.date"
              @input="updateFilter('date', ($event.target as HTMLInputElement).value)"
              class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Catégorie</label>
            <select :value="modelValue.type" @change="updateFilter('type', ($event.target as HTMLSelectElement).value)"
              class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all">
              <option value="all">Toutes les actions</option>
              <option value="user_actions">Activités utilisateur</option>
              <option value="security">Sécurité</option>
              <option value="system">Système</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Recherche</label>
            <div class="relative group">
              <IconSearch
                class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hsa opacity-50 group-focus-within:text-primary transition-colors" />
              <input type="text" :value="modelValue.search"
                @input="updateFilter('search', ($event.target as HTMLInputElement).value)" placeholder="Filtrer..."
                class="block w-full pl-9 pr-16 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
              <div
                class="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 pointer-events-none">
                <kbd
                  class="px-1 py-0.5 rounded bg-ash text-[8px] font-bold text-hsa border border-ash uppercase">Ctrl</kbd>
                <span class="text-[10px] text-hsa">+</span>
                <kbd
                  class="px-1 py-0.5 rounded bg-ash text-[8px] font-bold text-hsa border border-ash uppercase">K</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeFilters" class="px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
        <p class="text-[10px] font-black text-primary uppercase tracking-widest">
          Affichage : {{ activeFilters.type === 'all' ? 'Toutes' : activeFilters.type }} |
          {{ formatDate(activeFilters.date) }} |
          Lim : {{ activeFilters.limit }}
        </p>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconFilter, IconSearch } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const props = defineProps<{
  modelValue: {
    date: string
    type: string
    search: string
  }
  activeFilters?: any
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const updateFilter = (key: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
  emit('change')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'd MMM yyyy', { locale: fr })
}
</script>
