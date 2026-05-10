<template>
  <div class="shrink-0 border-b border-ash">
    <!-- Workspace Button -->
    <div class="h-16 flex items-center px-3 gap-2">
      <!-- Skeleton Loading State -->
      <div v-if="loading" class="flex-1 px-2 py-2 flex items-center gap-2.5">
        <UiAppSkeleton type="rect" width="2rem" height="2rem" class="shrink-0 !rounded-lg" />
        <div v-if="!isCollapsed" class="flex-1 space-y-1.5">
          <UiAppSkeleton type="text" width="60%" height="0.875rem" />
          <UiAppSkeleton type="text" width="40%" height="0.625rem" />
        </div>
      </div>

      <!-- Active Workspace Trigger & Info Tooltip -->
      <div v-else class="flex-1 flex items-center gap-2 min-w-0">
        <button @click="handleSwitcherToggle"
          class="flex flex-1 items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-ash/60 transition-all duration-200 group min-w-0"
          :class="{ 'justify-center': isCollapsed }"
          :title="isCollapsed ? (wsStore.activeWorkspace?.name || 'Workspaces') : ''">
          <!-- Workspace Avatar -->
          <div
            class="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm transition-all duration-200 border border-ash">
            <img :src="getWorkspaceLogoUrl(wsStore.activeWorkspace?.logo_url, wsStore.activeWorkspace?.name)"
              :alt="wsStore.activeWorkspace?.name || 'Workspace'" class="w-full h-full object-cover" />
          </div>
          <!-- Name + Chevron -->
          <div v-show="!isCollapsed" class="flex items-center gap-1.5 min-w-0 flex-1">
            <div class="min-w-0 flex-1 text-left">
              <p class="text-sm font-semibold text-BtW truncate leading-tight">
                {{ wsStore.activeWorkspace?.name || 'Workspace' }}
              </p>
              <div class="flex items-center gap-1.5">
                <span
                  class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight bg-ash/50 text-hsa border border-ash/20">
                  <component :is="WORKSPACE_TYPE_CONFIG[wsStore.activeWorkspace?.type || 'personal'].icon"
                    class="w-2.5 h-2.5" />
                  {{ getWorkspaceTypeLabel(wsStore.activeWorkspace?.type) }}
                </span>
              </div>
            </div>
            <IconChevronDown v-if="!wsStore.isSwitcherOpen"
              class="w-4 h-4 text-hsa shrink-0 group-hover:text-BtW transition-colors" />
            <IconChevronUp v-else class="w-4 h-4 text-hsa shrink-0 group-hover:text-BtW transition-colors" />
          </div>
        </button>

        <!-- Info Tooltip (Desktop & Expanded Only) -->
        <UiAppTooltip v-if="!isCollapsed" :content="tooltipContent" :title="wsStore.activeWorkspace?.name" width-class="w-56"
          position="bottom" class="shrink-0 mr-1" />
      </div>
    </div>

    <!-- Workspace Dropdown -->
    <Transition enter-active-class="transition duration-200 ease-out origin-top" enter-from-class="opacity-0 scale-y-95"
      enter-to-class="opacity-100 scale-y-100" leave-active-class="transition duration-150 ease-in origin-top"
      leave-from-class="opacity-100 scale-y-100" leave-to-class="opacity-0 scale-y-95">
      <div v-if="wsStore.isSwitcherOpen && !isCollapsed"
        class="border-t border-ash bg-WtB px-3 py-2 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
        <!-- Search -->
        <div v-if="wsStore.workspaces.length > 4" class="pb-2">
          <input v-model="wsSearch" type="text" placeholder="Rechercher..."
            class="w-full px-3 py-1.5 rounded-lg bg-ash/30 border border-ash text-xs text-BtW placeholder:text-hsa/50 outline-none focus:border-primary/40 transition-colors" />
        </div>

        <!-- Workspace List -->
        <button v-for="ws in filteredWorkspaces" :key="ws.id" @click="selectWorkspace(ws)" :class="[
          'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg transition-all duration-150 text-left group/ws',
          ws.id === wsStore.activeWorkspaceId
            ? 'bg-primary/10 text-primary'
            : 'text-hsa hover:bg-ash/50 hover:text-BtW'
        ]">
          <!-- Mini Avatar -->
          <div class="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-ash/50">
            <img :src="getWorkspaceLogoUrl(ws.logo_url, ws.name)" :alt="ws.name" class="w-full h-full object-cover" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-medium truncate">{{ ws.name }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[9px] text-hsa/60 flex items-center gap-1">
                <component :is="WORKSPACE_TYPE_CONFIG[ws.type].icon" class="w-2.5 h-2.5" />
                {{ getWorkspaceTypeLabel(ws.type) }}
              </span>
              <span v-if="ws.members_count" class="text-[9px] text-hsa/40">· {{ ws.members_count }} membre{{
                ws.members_count > 1 ? 's' : '' }}</span>
            </div>
          </div>
          <!-- Active indicator -->
          <div v-if="ws.id === wsStore.activeWorkspaceId" class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
        </button>

        <!-- Divider + Actions -->
        <div class="border-t border-ash/50 pt-1.5 mt-1.5 space-y-1">
          <button @click="wsStore.openModal()"
            class="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-hsa hover:bg-primary/10 hover:text-primary transition-all duration-150">
            <div class="w-6 h-6 rounded-md border border-dashed border-current flex items-center justify-center">
              <IconPlus class="w-3.5 h-3.5" />
            </div>
            <span class="text-xs font-medium">Nouveau workspace</span>
          </button>

          <NuxtLink to="/dashboard/manage/workspace" @click="wsStore.closeSwitcher()"
            class="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-hsa hover:bg-ash/50 hover:text-BtW transition-all duration-150">
            <div class="w-6 h-6 rounded-md bg-ash/20 flex items-center justify-center">
              <IconSettings class="w-3.5 h-3.5" />
            </div>
            <span class="text-xs font-medium">Gérer les workspaces</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Click-away overlay -->
  <Teleport to="body">
    <div v-if="wsStore.isSwitcherOpen" @click="wsStore.closeSwitcher()" class="fixed inset-0 z-40"></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconChevronDown, IconChevronUp, IconChevronLeft, IconPlus, IconSettings } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { getWorkspaceLogoUrl, getWorkspaceRoleLabel, getWorkspaceTypeLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

defineProps<{
  isCollapsed: boolean
  loading?: boolean
}>()

const emit = defineEmits(['toggle-collapse'])

const wsStore = useWorkspaceStore()
const wsSearch = ref('')

const filteredWorkspaces = computed(() => {
  if (!wsSearch.value) return wsStore.workspaces
  const q = wsSearch.value.toLowerCase()
  return wsStore.workspaces.filter(ws => ws.name.toLowerCase().includes(q))
})

const selectWorkspace = (ws: Workspace) => {
  wsStore.setActiveWorkspace(ws)
}

const handleSwitcherToggle = () => {
  wsStore.toggleSwitcher()
}

const tooltipContent = computed(() => {
  const ws = wsStore.activeWorkspace
  if (!ws) return 'Chargement...'
  let content = `Type: <b>${getWorkspaceTypeLabel(ws.type)}</b><br>`
  content += `Rôle: <b>${getWorkspaceRoleLabel(ws.role)}</b><br>`
  if (ws.country) content += `Pays: <b>${ws.country}</b><br>`
  if (ws.members_count !== undefined) content += `Membres: <b>${ws.members_count}</b>`
  return content
})
</script>
