<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <CommonVigitechIncidentCard v-for="incident in incidents" :key="incident.id" :incident="incident"
        :detailUrl="`/vigitech/${incident.id}`" @report="$emit('report', incident.id)" />
    </div>

    <!-- Pagination Controls -->
    <UiAppPagination :current-page="currentPage" :total-pages="totalPages"
      @change-page="(delta) => $emit('change-page', delta)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
