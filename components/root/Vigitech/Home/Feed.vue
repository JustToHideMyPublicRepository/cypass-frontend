<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <RootVigitechIncidentCard v-for="incident in incidents" :key="incident.id" :incident="incident"
        :detailUrl="`/vigitech/${incident.id}`" @report="$emit('report', incident.id)" />
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex items-center justify-between pt-6 mt-6 border-t border-ash">
      <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">
        Page {{ currentPage }} sur {{ totalPages }}
      </p>
      <div class="flex items-center gap-2">
        <UiBaseButton @click="$emit('change-page', -1)" :disabled="pagination.offset === 0" variant="secondary"
          class="flex items-center gap-1 !px-3 !py-1.5 !text-xs !font-medium">
          <IconChevronLeft class="w-3 h-3" /> Précédent
        </UiBaseButton>
        <UiBaseButton @click="$emit('change-page', 1)"
          :disabled="pagination.offset + pagination.limit >= pagination.total" variant="secondary"
          class="flex items-center gap-1 !px-3 !py-1.5 !text-xs !font-medium">
          Suivant
          <IconChevronRight class="w-3 h-3" />
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const props = defineProps<{
  incidents: any[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}>()

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.limit))
const currentPage = computed(() => Math.floor(props.pagination.offset / props.pagination.limit) + 1)

defineEmits(['report', 'change-page'])
</script>
