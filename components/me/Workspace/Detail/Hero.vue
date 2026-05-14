<template>
  <div class="relative group">
    <div class="h-48 rounded-[2.5rem] border border-ashAct overflow-hidden relative">

      <div class="absolute bottom-8 left-10 flex items-end gap-6 w-full pr-20">
        <!-- Large Logo -->
        <div class="w-24 h-24 rounded-[2.5rem] border-4 overflow-hidden shrink-0">
          <img :src="getWorkspaceLogoUrl(workspace.logo_url, workspace.name)" :alt="workspace.name"
            class="w-full h-full object-cover" />
        </div>
        <!-- Identity -->
        <div class="pb-2 space-y-2 flex-1 min-w-0">
          <h3>{{ workspace.name }}</h3>
          <div class="flex flex-wrap items-center gap-3">
            <span
              class="px-3 py-1 rounded-xl bg-ash/20 backdrop-blur-md text-[10px] font-bold text-hsa border border-ash/30 uppercase tracking-widest">
              <component :is="WORKSPACE_TYPE_CONFIG[workspace.type || 'personal'].icon"
                class="w-3.5 h-3.5 inline mr-1.5 text-primary" />
              {{ getWorkspaceTypeLabel(workspace.type) }}
            </span>
            <span
              class="px-3 py-1 rounded-xl bg-primary/10 backdrop-blur-md text-[10px] font-bold text-primary border border-primary/20 uppercase tracking-widest">
              <component :is="WORKSPACE_ROLE_CONFIG[workspace.role || 'reader'].icon"
                class="w-3.5 h-3.5 inline mr-1.5" />
              {{ getWorkspaceRoleLabel(workspace.role) }}
            </span>
            <span
              class="px-3 py-1 rounded-xl bg-ash/20 backdrop-blur-md text-[10px] font-bold border border-ash/30 uppercase tracking-widest"
              :class="WORKSPACE_STATUS_CONFIG[workspace.status || 'active'].color">
              <component :is="WORKSPACE_STATUS_CONFIG[workspace.status || 'active'].icon"
                class="w-3.5 h-3.5 inline mr-1.5" />
              {{ getWorkspaceStatusLabel(workspace.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWorkspaceLogoUrl, getWorkspaceTypeLabel, getWorkspaceRoleLabel, getWorkspaceStatusLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG, WORKSPACE_STATUS_CONFIG } from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

defineProps<{
  workspace: Workspace
}>()
</script>
