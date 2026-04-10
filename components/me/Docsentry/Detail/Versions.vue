<template>
  <UiBaseCard>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-xl bg-secondary/10 text-secondary">
          <IconFiles class="w-8 h-8" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-BtW">Versions personnalisées</h2>
          <p class="text-sm text-hsa">{{ versions.length }} version{{ versions.length > 1 ? 's' : '' }} affichée{{
            versions.length > 1 ? 's' : '' }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconSearch class="h-5 w-5 text-hsa" />
        </div>
        <input v-model="search" type="text" @keyup.enter="onSearchSubmit"
          class="block w-full pl-10 pr-24 py-2 border border-ashAct/50 rounded-xl leading-5 bg-ash/30 text-BtW placeholder-hsa focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
          placeholder="Rechercher par nom..." />
        <div class="absolute inset-y-1 right-1">
          <button @click="onSearchSubmit"
            class="h-full px-3 bg-primary text-WtB text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Rechercher
          </button>
        </div>
      </div>
      <div class="w-full sm:w-48 relative">
        <select v-model="sort" @change="onSortChange"
          class="block w-full pl-3 pr-10 py-2 border border-ashAct/50 rounded-xl leading-5 bg-ash/30 text-BtW focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors appearance-none cursor-pointer">
          <option value="recent" class="bg-gray-800 text-white">Plus récents</option>
          <option value="old" class="bg-gray-800 text-white">Plus anciens</option>
          <option value="name_asc" class="bg-gray-800 text-white">Nom (A-Z)</option>
          <option value="name_desc" class="bg-gray-800 text-white">Nom (Z-A)</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-hsa">
          <IconChevronDown class="h-4 w-4" />
        </div>
      </div>
    </div>

    <div class="relative min-h-[100px] transition-opacity" :class="{ 'opacity-50 pointer-events-none': loading }">
      <div v-if="loading"
        class="absolute inset-0 bg-WtB/20 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
        <UiLogoLoader size="lg" />
      </div>

      <div class="space-y-4" v-if="versions.length > 0">
        <div v-for="version in paginatedVersions" :key="version.id"
          class="bg-ash/20 border border-ashAct/30 rounded-2xl p-4 hover:bg-ash/30 transition-all group">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 bg-WtB rounded-xl flex items-center justify-center text-secondary border border-ashAct/20 shadow-sm">
                <IconUserCheck class="w-6 h-6" />
              </div>
              <div>
                <p class="font-bold text-BtW">{{ version.recipient }}</p>
                <p class="text-[10px] text-hsa font-medium tracking-wider uppercase">Destinataire</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-[11px]">
              <div class="flex flex-col items-end">
                <span class="text-hsa font-bold tracking-widest uppercase text-[9px]">Signé le</span>
                <span class="text-BtW font-medium">{{ formatDate(version.signed_at) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-ashAct/20">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-hsa font-black tracking-widest uppercase">Hash de la version</span>
              <button @click="handleCopy(version.hash, version.id)"
                class="text-[10px] font-black flex items-center gap-1 transition-colors"
                :class="copiedId === version.id ? 'text-success' : 'text-primary hover:underline'">
                <IconCheck v-if="copiedId === version.id" class="w-3.5 h-3.5" />
                <IconCopy v-else class="w-3 h-3" />
                {{ copiedId === version.id ? 'Copié' : 'Copier' }}
              </button>
            </div>
            <div class="font-code text-[11px] text-BtW break-all opacity-80"
              :class="{ 'text-success': copiedId === version.id }">
              {{ version.hash }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 text-hsa">
        Aucune version trouvée.
      </div>

      <!-- Pagination -->
      <UiAppPagination v-if="versions.length > 0" :current-page="currentPage" :total-pages="totalPages"
        @change-page="handlePageChange" />
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconFiles, IconUserCheck, IconCopy, IconCheck, IconSearch, IconChevronDown, IconLoader2 } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { type DocumentVersion } from '~/types/docsentry'
import UiAppPagination from '~/components/ui/AppPagination.vue'

const props = defineProps<{
  versions: DocumentVersion[]
  loading?: boolean
}>()

const emit = defineEmits(['copy', 'update-filters'])

const search = ref('')
const sort = ref('recent')

const onSearchSubmit = () => {
  emit('update-filters', { search: search.value, sort: sort.value })
}

const onSortChange = () => {
  emit('update-filters', { search: search.value, sort: sort.value })
}

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(props.versions.length / itemsPerPage))

const paginatedVersions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.versions.slice(start, end)
})

const handlePageChange = (direction: number) => {
  currentPage.value += direction
}

// Copy Feedback
const copiedId = ref<string | null>(null)

const handleCopy = (hash: string, id: string) => {
  emit('copy', hash, id)
  copiedId.value = id
  setTimeout(() => {
    if (copiedId.value === id) {
      copiedId.value = null
    }
  }, 2000)
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: fr })
  } catch (e) {
    return dateStr
  }
}
</script>
