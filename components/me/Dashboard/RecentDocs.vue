<template>
  <UiBaseCard title="Documents Orphelins" subtitle="Derniers documents certifiés">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/docsentry')">Gérer</UiBaseButton>
    </template>
    <div class="space-y-1">
      <div v-if="loading && !documents.length" class="py-10 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      <div v-else-if="!documents.length" class="py-10 text-center text-hsa">
        Aucun document récent
      </div>
      <div v-for="doc in documents" :key="doc.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="navigateTo(`/dashboard/docsentry/${doc.id}`)">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors">
            <IconFileCertificate class="w-4 h-4 text-hsa group-hover:text-primary" />
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
import { IconFileCertificate } from '@tabler/icons-vue'

defineProps<{
  documents: any[]
  loading: boolean
  formatTime: (ts: string) => string
  getDocStatus: (doc: any) => string
}>()
</script>
