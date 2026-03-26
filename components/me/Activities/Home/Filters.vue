<template>
  <UiBaseCard class="bg-ash/30 border border-dashed border-ash">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4 md:gap-8">
        <div class="flex items-center gap-2">
          <IconFilter class="w-4 h-4 text-hsa opacity-50" />
          <span class="text-xs font-bold text-hsa uppercase tracking-[0.2em]">Filtres :</span>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2 mr-2">
            <input type="checkbox" id="usePeriodToggle" :checked="modelValue.usePeriod"
              @change="updateFilter('usePeriod', ($event.target as HTMLInputElement).checked)"
              class="rounded border-ash text-primary focus:ring-primary" />
            <label for="usePeriodToggle"
              class="text-[10px] font-black text-hsa uppercase tracking-widest cursor-pointer">Période</label>
          </div>

          <div v-if="!modelValue.usePeriod" class="space-y-1">
            <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Date</label>
            <input type="date" :value="modelValue.date" :max="today" @change="handleDateChange"
              @input="updateFilter('date', ($event.target as HTMLInputElement).value)"
              class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <template v-else>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Du</label>
              <input type="date" :value="modelValue.start_date" :max="today"
                @input="updateFilter('start_date', ($event.target as HTMLInputElement).value)"
                class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Au</label>
              <input type="date" :value="modelValue.end_date" :max="today"
                @input="updateFilter('end_date', ($event.target as HTMLInputElement).value)"
                class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </template>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Catégorie</label>
            <select :value="modelValue.type" @change="updateFilter('type', ($event.target as HTMLSelectElement).value)"
              class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ash text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all">
              <option value="all">Toutes les actions</option>
              <option value="user_actions">Activités utilisateur</option>
              <option value="security">Sécurité</option>
              <option value="requests">Requêtes API</option>
              <option value="errors">Erreurs système</option>
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
                <kbd class="kbd-tip">Ctrl</kbd>
                <span class="text-[10px] text-hsa">+</span>
                <kbd class="kbd-tip">K</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeFilters" class="px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
        <p class="text-[10px] font-black text-primary uppercase tracking-widest">
          Affichage : {{ activeFilters.type === 'all' ? 'Toutes' : (getLogTypeInfo(activeFilters.type)?.label ||
            activeFilters.type) }} |
          {{ activeFilters.start_date ? `${formatDate(activeFilters.start_date)} -
          ${formatDate(activeFilters.end_date)}` :
            formatDate(activeFilters.date) }} |
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
import { getLogTypeInfo } from '~/utils/logs'

const today = format(new Date(), 'yyyy-MM-dd')

const props = defineProps<{
  modelValue: {
    date: string
    type: string
    search: string
    usePeriod?: boolean
    start_date?: string
    end_date?: string
  }
  activeFilters?: any
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const updateFilter = (key: string, value: string | boolean) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
  emit('change')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'd MMM yyyy', { locale: fr })
}

const handleDateChange = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  if (val > today) {
    updateFilter('date', today)
      // Force input refresh
      ; (e.target as HTMLInputElement).value = today
  } else {
    updateFilter('date', val)
  }
}
</script>
