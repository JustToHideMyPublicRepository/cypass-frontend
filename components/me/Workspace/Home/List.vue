<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading && !workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiBaseCard v-for="i in 6" :key="i" class="p-5">
        <div class="flex items-center gap-4">
          <UiAppSkeleton type="avatar" radius="16px" class="w-12 h-12" />
          <div class="flex-1 space-y-2">
            <UiAppSkeleton type="heading" width="60%" height="16px" />
            <UiAppSkeleton type="text" width="40%" height="10px" />
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Grid -->
    <div v-else-if="workspaces.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiBaseCard v-for="ws in workspaces" :key="ws.id"
        class="group/ws transition-all hover:shadow-md border-ash/30 bg-WtB p-3 relative overflow-hidden"
        :class="{ 'ring-1 ring-primary/40 !bg-primary/5': ws.id === activeWorkspaceId }">

        <!-- Active Indicator -->
        <div v-if="ws.id === activeWorkspaceId" class="absolute top-0 right-0 w-8 h-8">
          <div
            class="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-l-[32px] border-t-primary border-l-transparent opacity-10">
          </div>
          <IconCheck class="absolute top-1 right-1 w-3 h-3 text-primary" />
        </div>

        <div class="flex items-center gap-3">
          <!-- Logo -->
          <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`"
            class="w-10 h-10 rounded-xl overflow-hidden border border-ash bg-ash/10 shrink-0 shadow-sm block hover:ring-2 hover:ring-primary/20 transition-all">
            <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name" class="w-full h-full object-cover" />
          </NuxtLink>

          <!-- Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 overflow-hidden">
              <NuxtLink :to="`/dashboard/manage/workspace/${ws.id}`"
                class="text-xs font-bold text-BtW truncate leading-tight hover:text-primary transition-colors block tracking-tight">
                {{ ws.name }}
              </NuxtLink>
              <IconStarFilled v-if="ws.is_default" class="w-2.5 h-2.5 text-warning shrink-0" />
            </div>

            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center gap-1 text-[9px] font-bold text-hsa uppercase tracking-tighter">
                <component :is="WORKSPACE_TYPE_CONFIG[ws.type || 'personal'].icon"
                  class="w-2.5 h-2.5 text-primary opacity-70" />
                {{ getWorkspaceTypeLabel(ws.type).split(' ')[0] }}
              </span>

              <span
                class="inline-flex items-center gap-1 text-[9px] font-bold text-primary/80 uppercase tracking-tighter">
                <component :is="WORKSPACE_ROLE_CONFIG[ws.role || 'reader']?.icon" class="w-2.5 h-2.5" />
                {{ getWorkspaceRoleLabel(ws.role).split(' ')[0] }}
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-1 shrink-0">
            <button @click="$emit('edit', ws)"
              class="p-1.5 rounded-lg hover:bg-primary/10 text-hsa hover:text-primary transition-colors"
              title="Modifier">
              <IconEdit class="w-3.5 h-3.5" />
            </button>
            <button v-if="!ws.is_default" @click="$emit('setDefault', ws.id)"
              class="p-1.5 rounded-lg hover:bg-warning/10 text-hsa hover:text-warning transition-colors"
              title="Par défaut">
              <IconStar class="w-3.5 h-3.5" />
            </button>
            <button v-if="ws.role === 'owner' && !ws.is_default" @click="$emit('delete', ws)"
              class="p-1.5 rounded-lg hover:bg-danger/10 text-hsa hover:text-danger transition-colors"
              title="Supprimer">
              <IconTrash class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconEdit, IconTrash, IconCheck, IconStar, IconStarFilled } from '@tabler/icons-vue'
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspaces: Workspace[]
  activeWorkspaceId?: string | null
  loading: boolean
}>()

defineEmits(['edit', 'setDefault', 'delete'])
</script>
