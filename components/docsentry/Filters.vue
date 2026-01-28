<template>
  <UiBaseCard>
    <div class="space-y-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-hsa">
              <IconSearch class="w-5 h-5" />
            </span>
            <input v-model="localFilename" @keyup.enter="applySearch" type="text"
              placeholder="Rechercher par nom de fichier..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-ash bg-ash focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-hsa" />
          </div>
          <UiBaseButton @click="applySearch" class="px-4">
            Rechercher
          </UiBaseButton>
        </div>
        <div class="flex gap-2">
          <select v-model="model.file_type"
            class="px-4 py-2 rounded-lg border border-ash bg-ash text-sm focus:ring-2 focus:ring-primary">
            <option value="all">Tous les types</option>
            <option v-for="type in availableTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <UiBaseButton variant="secondary" @click="showAdvancedFilters = !showAdvancedFilters"
            :class="{ 'bg-primary/10 text-primary': showAdvancedFilters }">
            <IconFilter class="w-4 h-4 mr-2" /> {{ showAdvancedFilters ? 'Réduire' : 'Filtres' }}
          </UiBaseButton>
          <button v-if="hasActiveFilters" @click="$emit('reset')"
            class="p-2 text-hsa hover:text-danger p-2 transition-colors" title="Réinitialiser les filtres">
            <IconX class="w-5 h-5" />
          </button>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-ash">
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-hsa uppercase">Date de début</label>
            <input v-model="model.date_start" type="datetime-local"
              class="w-full px-4 py-2 rounded-lg border border-ash bg-ash text-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-hsa uppercase">Date de fin</label>
            <input v-model="model.date_end" type="datetime-local"
              class="w-full px-4 py-2 rounded-lg border border-ash bg-ash text-sm focus:ring-2 focus:ring-primary" />
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
