<template>
  <UiBaseCard title="Filtres & Recherche">
    <template #header>
      <button @click="isCollapsed = !isCollapsed" class="p-1 hover:bg-ash rounded-lg transition-colors text-hsa"
        :title="isCollapsed ? 'Déplier' : 'Replier'">
        <IconChevronDown class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': !isCollapsed }" />
      </button>
    </template>

    <div v-show="!isCollapsed" class="space-y-5 animate-fade-in">
      <!-- Search Input -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Nom du fichier</label>
        <div class="relative group">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa group-focus-within:text-primary transition-colors">
            <IconSearch class="w-4 h-4" />
          </span>
          <input v-model="localFilename" @keyup.enter="applySearch" type="text" placeholder="Rechercher..."
            class="w-full h-10 pl-9 pr-4 rounded-xl border border-ash bg-ash/50 focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-hsa/50 transition-all outline-none" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- File Type -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Type</label>
          <select v-model="model.file_type"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none">
            <option value="all">Tous</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Versions Filter -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Multiversion</label>
          <select v-model="model.with_versions"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none">
            <option value="all">Tous</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </select>
        </div>
      </div>

      <div class="grid gap-3" :class="model.certification_mode === 'enrichie' ? 'grid-cols-2' : 'grid-cols-1'">
        <!-- Mode Filter -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Certification</label>
          <select v-model="model.certification_mode"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none">
            <option value="all">Tous</option>
            <option value="simple">Simple</option>
            <option value="enrichie">Enrichie</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div v-if="model.certification_mode === 'enrichie'" class="space-y-1.5 animate-slide-up">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Catégorie</label>
          <select v-model="model.document_category"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer appearance-none">
            <option value="all">Toutes</option>
            <option v-for="cat in categories" :key="cat.key" :value="cat.key">
              {{ cat.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Advanced Dates -->
      <div class="space-y-4 pt-2 border-t border-ash">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Depuis le</label>
          <input v-model="model.date_start" type="datetime-local"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em] ml-1">Jusqu'au</label>
          <input v-model="model.date_end" type="datetime-local"
            class="w-full h-10 px-3 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-2">
        <UiBaseButton @click="applySearch" class="flex-1 h-10 rounded-xl font-bold text-xs uppercase tracking-wider">
          Appliquer
        </UiBaseButton>
        <UiBaseButton v-if="hasActiveFilters" @click="$emit('reset')" variant="ghost"
          class="!h-10 !px-3 !flex !items-center !justify-center text-hsa hover:!text-danger hover:!bg-danger/10 border border-ash !rounded-xl transition-all"
          title="Réinitialiser">
          <IconX class="w-4 h-4" />
        </UiBaseButton>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { IconSearch, IconX, IconChevronDown } from '@tabler/icons-vue'
import { type EnrichmentCategory } from '~/types/docsentry'

interface Filters {
  filename: string
  file_type: string
  date_start: string
  date_end: string
  with_versions: string
  certification_mode: string
  document_category: string
}

const props = defineProps<{
  availableTypes: string[]
  categories?: EnrichmentCategory[]
}>()

const emit = defineEmits(['reset'])

const model = defineModel<Filters>({ required: true })

const localFilename = ref(model.value.filename)
const isCollapsed = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('cps_docsentry_filters')
  if (saved !== null) {
    isCollapsed.value = JSON.parse(saved)
  }
})

watch(isCollapsed, (newVal) => {
  localStorage.setItem('cps_docsentry_filters', JSON.stringify(newVal))
})

watch(() => model.value.filename, (newVal) => {
  localFilename.value = newVal
})

const applySearch = () => {
  model.value.filename = localFilename.value
}

const hasActiveFilters = computed(() => {
  return model.value.filename !== '' ||
    model.value.file_type !== 'all' ||
    model.value.date_start !== '' ||
    model.value.date_end !== '' ||
    model.value.with_versions !== 'all' ||
    model.value.certification_mode !== 'all' ||
    model.value.document_category !== 'all'
})
</script>
