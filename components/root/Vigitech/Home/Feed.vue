<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <RootVigitechIncidentCard v-for="incident in incidents" :key="incident.id" :incident="incident"
        :detailUrl="`/vigitech/${incident.id}`" @report="$emit('report', incident.id)" />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.limit" class="flex items-center justify-between pt-6">
      <UiBaseButton variant="ghost" size="sm" :disabled="pagination.offset === 0" @click="$emit('change-page', -1)">
        <IconChevronLeft class="w-4 h-4 mr-2" /> Précédent
      </UiBaseButton>
      <div class="text-[10px] font-black text-hsa uppercase tracking-widest">
        Page {{ Math.floor(pagination.offset / pagination.limit) + 1 }}
      </div>
      <UiBaseButton variant="ghost" size="sm" :disabled="pagination.offset + pagination.limit >= pagination.total"
        @click="$emit('change-page', 1)">
        Suivant
        <IconChevronRight class="w-4 h-4 ml-2" />
      </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

defineProps<{
  incidents: any[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}>()

defineEmits(['report', 'change-page'])
</script>
