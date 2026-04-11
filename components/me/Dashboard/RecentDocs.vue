<template>
  <UiBaseCard title="Derniers documents" subtitle="Derniers documents certifiés">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="router.push('/dashboard/docsentry')">Gérer</UiBaseButton>
    </template>
    <div class="space-y-1">
      <!-- Loading State -->
      <div v-if="loading && !documents.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!documents.length" class="py-10 text-center text-hsa">
        Aucun document récent
      </div>

      <!-- Documents List -->
      <div v-for="doc in documents" :key="doc.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="router.push(`/dashboard/docsentry/${doc.id}`)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 rounded-lg transition-colors"
            :class="getDocumentStyle(doc.has_versions).bgColor">
            <component :is="getDocumentStyle(doc.has_versions).icon" class="w-4 h-4"
              :class="getDocumentStyle(doc.has_versions).color" />
          </div>
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-BtW truncate">{{ doc.filename }}</h4>
            <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(doc.created_at) }}</p>
          </div>
        </div>
        <UiStatusBadge :status="getDocStatus(doc)" size="sm" />
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { getDocumentStyle } from '~/utils/docsentry'

const router = useRouter()

defineProps<{
  documents: any[]
  loading: boolean
  formatTime: (ts: string) => string
  getDocStatus: (doc: any) => string
}>()
</script>
