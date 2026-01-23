<template>
  <div class="space-y-4">
    <UiBaseCard>
      <div class="flex items-center gap-4">
        <div class="p-3 bg-primary/10 rounded-xl">
          <IconFileCertificate class="w-6 h-6 text-primary" />
        </div>
        <div>
          <p class="text-xs font-bold text-hsa uppercase">Documents</p>
          <h4 class="text-xl font-bold">{{ statistics?.total_documents || 0 }}</h4>
        </div>
      </div>
    </UiBaseCard>

    <UiBaseCard>
      <div class="flex items-center gap-4">
        <div class="p-3 bg-danger/10 rounded-xl">
          <IconAlertTriangle class="w-6 h-6 text-danger" />
        </div>
        <div>
          <p class="text-xs font-bold text-hsa uppercase">Incidents</p>
          <h4 class="text-xl font-bold">{{ statistics?.total_incidents || 0 }}</h4>
        </div>
      </div>
    </UiBaseCard>
  </div>
</template>

<script setup lang="ts">
import { IconFileCertificate, IconAlertTriangle } from '@tabler/icons-vue'

defineProps<{
  statistics: any
}>()
</script>
