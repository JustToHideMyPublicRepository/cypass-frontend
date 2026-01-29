<template>
  <UiBaseCard>
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa">
              <IconSearch class="w-5 h-5 transition-colors group-focus-within:text-primary" />
            </span>
            <input v-model="localFilename" @keyup.enter="applySearch" type="text"
              placeholder="Rechercher par nom de fichier..."
              class="w-full h-11 pl-10 pr-4 rounded-xl border border-ash bg-ash/50 focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-hsa transition-all" />
          </div>
          <UiBaseButton @click="applySearch" class="h-11 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            Rechercher
          </UiBaseButton>
        </div>
        <div class="flex gap-2">
          <select v-model="model.file_type"
            class="h-11 px-4 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer">
            <option value="all">Tous les types</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <UiBaseButton variant="secondary" @click="showAdvancedFilters = !showAdvancedFilters"
            class="h-11 px-4 rounded-xl"
            :class="{ 'bg-primary/10 text-primary border-primary/20': showAdvancedFilters }">
            <IconFilter class="w-4 h-4 mr-2" /> {{ showAdvancedFilters ? 'Réduire' : 'Filtres' }}
          </UiBaseButton>
          <button v-if="hasActiveFilters" @click="$emit('reset')"
            class="h-11 w-11 flex items-center justify-center text-hsa hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
            title="Réinitialiser les filtres">
            <IconX class="w-5 h-5" />
          </button>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-ash">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em]">Date de début</label>
            <input v-model="model.date_start" type="datetime-local"
              class="w-full h-11 px-4 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-hsa uppercase tracking-[0.1em]">Date de fin</label>
            <input v-model="model.date_end" type="datetime-local"
              class="w-full h-11 px-4 rounded-xl border border-ash bg-ash/50 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
        </div>
      </Transition>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconSearch, IconFilter, IconX } from '@tabler/icons-vue'

interface Filters {
  filename: string
  file_type: string
  date_start: string
  date_end: string
}

const props = defineProps<{
  availableTypes: string[]
}>()

const emit = defineEmits(['reset'])

const model = defineModel<Filters>({ required: true })

const showAdvancedFilters = ref(false)
const localFilename = ref(model.value.filename)

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
    model.value.date_end !== ''
})
</script>
