<template>
  <UiBaseCard title="Sessions Actives" subtitle="Appareils connectés">
    <template #header>
      <UiBaseButton variant="secondary" size="sm" class="!px-2 !py-1 !text-[10px]"
        @click="navigateTo('/dashboard/sessions')">Gérer</UiBaseButton>
    </template>
    <div class="space-y-1">
      <div v-if="loading && !sessions.length" class="py-10">
        <UiLogoLoader size="sm" />
      </div>
      <div v-else-if="!sessions.length" class="py-10 text-center text-hsa">
        Aucune session active
      </div>
      <div v-for="session in sessions" :key="session.id"
        class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all group">
        <div class="flex items-center gap-3 min-w-0">
          <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors">
            <component :is="getSessionIcon(session)" class="w-4 h-4 text-hsa group-hover:text-primary" />
          </div>
          <div class="min-w-0">
            <h4 class="text-sm font-bold text-BtW truncate">{{ formatSessionLabel(session) }}</h4>
            <p class="text-[10px] text-hsa mt-0.5">
              {{ session.ip_address }} • {{ session.is_current ? 'Active' : formatRelativeTime(session.last_used_at)
              }}
            </p>
          </div>
        </div>
        <div v-if="session.is_current" class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { markRaw } from 'vue'
import { formatRelativeTime } from '~/utils/date'
import { formatSessionLabel, getSessionIcon as getSessionIconRaw } from '~/utils/sessions'

const getSessionIcon = (session: any) => markRaw(getSessionIconRaw(session))

defineProps<{
  sessions: any[]
  loading: boolean
}>()
</script>
