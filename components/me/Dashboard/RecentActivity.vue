<template>
  <UiBaseCard title="Activités récentes">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/notifications')">Voir tout
      </UiBaseButton>
    </template>
    <div class="space-y-4">
      <div v-if="loading && !notifications.length" class="py-10 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
      <div v-else-if="!notifications.length" class="py-10 text-center text-hsa">
        Aucune alerte récente
      </div>
      <div v-for="alert in notifications" :key="alert.id"
        class="flex items-start gap-4 p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
        @click="navigateTo(`/dashboard/notifications/${alert.id}`)">
        <div :class="[
          'w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-transform group-hover:scale-125',
          alert.is_read ? 'bg-hsa' : alert.priority === 'high' ? 'bg-danger' : 'bg-primary'
        ]"></div>
        <div class="min-w-0 flex-1">
          <h4 class="text-sm font-bold text-BtW truncate">{{ alert.title }}</h4>
          <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(alert.created_at) }}</p>
        </div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
defineProps<{
  notifications: any[]
  loading: boolean
  formatTime: (ts: string) => string
}>()
</script>
