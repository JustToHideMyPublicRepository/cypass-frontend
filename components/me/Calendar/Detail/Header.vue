<template>
  <div class="flex items-center gap-4 border-b border-ash pb-4">
    <NuxtLink to="/dashboard/calendar"
      class="p-2 rounded-xl bg-ash/30 hover:bg-ash/50 text-hsa hover:text-primary transition-colors">
      <IconArrowLeft class="w-5 h-5" />
    </NuxtLink>

    <div>
      <h1 class="text-2xl font-bold text-BtW capitalize">
        {{ formattedDate }}
      </h1>
      <p class="text-hsa font-medium">{{ dailyInsightText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

defineProps<{
  formattedDate: string
  dailyInsightText: string
}>()
</script>
