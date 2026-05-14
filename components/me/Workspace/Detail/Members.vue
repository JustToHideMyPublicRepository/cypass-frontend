<template>
  <UiBaseCard class="p-8 border-ash/30 shadow-sm rounded-[2.5rem]">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <IconUsers class="w-5 h-5 text-primary" />
        <h5>Membres</h5>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="member in members" :key="member.user_id"
        class="flex items-center gap-3 p-4 rounded-2xl bg-ash/5 border border-ash/10 group/item hover:bg-WtB hover:shadow-md transition-all cursor-default">
        <!-- Avatar ou initiales -->
        <div v-if="member.avatar_url"
          class="w-12 h-12 rounded-xl overflow-hidden border border-ash/20 group-hover/item:scale-110 transition-transform shrink-0">
          <img :src="resolveAvatarUrl(member.avatar_url)" :alt="`${member.first_name} ${member.last_name}`"
            class="w-full h-full object-cover" />
        </div>
        <div v-else
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xs font-black text-primary border border-ash/20 group-hover/item:scale-110 transition-transform shrink-0">
          {{ getInitials(member.first_name, member.last_name) }}
        </div>

        <!-- Nom et rôle -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-black text-BtW truncate">{{ member.first_name }} {{ member.last_name }}</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <component :is="getRoleConfig(member.role).icon" class="w-3 h-3"
              :class="getRoleConfig(member.role).color" />
            <p class="text-[10px] font-bold uppercase tracking-tighter" :class="getRoleConfig(member.role).color">
              {{ getRoleConfig(member.role).label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!members.length"
        class="flex items-center justify-center p-6 rounded-2xl bg-ash/5 border border-ash/10 text-hsa">
        <p class="text-sm">Aucun membre trouvé.</p>
      </div>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { IconUsers } from '@tabler/icons-vue'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '~/types/workspace'
import { WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'

defineProps<{
  workspace: Workspace
  members: WorkspaceMember[]
}>()

const getRoleConfig = (role: WorkspaceRole) => {
  return WORKSPACE_ROLE_CONFIG[role] || WORKSPACE_ROLE_CONFIG.reader
}

const getInitials = (firstName: string, lastName: string): string => {
  return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`
}

const resolveAvatarUrl = (url: string | null): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const cleanPath = url.replace(/^\/+/, '').replace(/^uploads\//i, '').replace(/^\/+/, '')
  return `/uploads/${cleanPath}`
}
</script>
