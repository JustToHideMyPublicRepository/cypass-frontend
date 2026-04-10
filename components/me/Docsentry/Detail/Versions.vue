<template>
  <UiBaseCard>
    <div class="flex items-center gap-4 mb-6">
      <div class="p-3 rounded-xl bg-secondary/10 text-secondary">
        <IconFiles class="w-8 h-8" />
      </div>
      <div>
        <h2 class="text-xl font-bold text-BtW">Versions personnalisées</h2>
        <p class="text-sm text-hsa">{{ versions.length }} version{{ versions.length > 1 ? 's' : '' }} générée{{ versions.length > 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="version in paginatedVersions" :key="version.id" 
        class="bg-ash/20 border border-ashAct/30 rounded-2xl p-4 hover:bg-ash/30 transition-all group">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-WtB rounded-xl flex items-center justify-center text-secondary border border-ashAct/20 shadow-sm">
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

    <!-- Pagination -->
    <UiAppPagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @change-page="handlePageChange" 
    />
  </UiBaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconFiles, IconUserCheck, IconCopy, IconCheck } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { type DocumentVersion } from '~/types/docsentry'
import UiAppPagination from '~/components/ui/AppPagination.vue'

const props = defineProps<{
  versions: DocumentVersion[]
}>()

const emit = defineEmits(['copy'])

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
