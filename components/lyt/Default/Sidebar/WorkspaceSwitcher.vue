<template>
  <div class="shrink-0 border-b border-ash transition-colors duration-300">
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
          <div :key="wsStore.activeWorkspace?.id"
            class="w-8 h-8 rounded-lg overflow-hidden shrink-0 shadow-sm transition-all duration-200 border border-ash">
            <img :src="activeWorkspaceLogo"
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
                <span v-if="wsStore.activeWorkspace?.role"
                  class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight bg-primary/10 text-primary border border-primary/20">
                  <component :is="WORKSPACE_ROLE_CONFIG[wsStore.activeWorkspace?.role || 'reader'].icon"
                    class="w-2.5 h-2.5" />
                  {{ getWorkspaceRoleLabel(wsStore.activeWorkspace?.role) }}
                </span>
              </div>
            </div>
            <IconChevronDown v-if="!wsStore.isSwitcherOpen"
              class="w-4 h-4 text-hsa shrink-0 group-hover:text-BtW transition-colors" />
            <IconChevronUp v-else class="w-4 h-4 text-hsa shrink-0 group-hover:text-BtW transition-colors" />
          </div>
        </button>

        <!-- Info Tooltip (Desktop & Expanded Only) -->
        <UiAppTooltip v-if="!isCollapsed" :content="tooltipContent" :title="wsStore.activeWorkspace?.name"
          width-class="w-56" position="bottom" class="shrink-0 mr-1" />
      </div>
    </div>

    <!-- Workspace Dropdown -->
    <Transition enter-active-class="transition duration-200 ease-out origin-top" enter-from-class="opacity-0 scale-y-95"
      enter-to-class="opacity-100 scale-y-100" leave-active-class="transition duration-150 ease-in origin-top"
      leave-from-class="opacity-100 scale-y-100" leave-to-class="opacity-0 scale-y-95">
      <div v-if="wsStore.isSwitcherOpen && !isCollapsed"
        class="border-t border-ash bg-ashAct/10 px-3 py-2 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
        <!-- Actions Grid (Top) -->
        <div class="grid grid-cols-2 gap-2 pb-2 mb-2 border-b border-ash/50">
          <button @click="wsStore.openModal()" title="Nouveau workspace"
            class="flex items-center justify-center p-2 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-all duration-150 border border-primary/20">
            <IconPlus class="w-4 h-4" />
          </button>
          <NuxtLink to="/dashboard/manage/workspace" @click="wsStore.closeSwitcher()" title="Gérer les workspaces"
            class="flex items-center justify-center p-2 rounded-lg text-hsa bg-hsa/20 hover:bg-hsa/50 transition-all duration-150 border border-ash">
            <IconSettings class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Search -->
        <div v-if="wsStore.workspaces.length > 2" class="pb-2">
          <input v-model="wsSearch" type="text" placeholder="Rechercher..."
            class="w-full px-3 py-1.5 rounded-lg bg-ash/30 border border-ash text-xs text-BtW placeholder:text-hsa/50 outline-none focus:border-primary/40 transition-colors" />
        </div>

        <!-- Workspace List -->
        <div class="space-y-1">
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
                <span v-if="ws.members_count" class="text-[9px]">· {{ ws.members_count }} membre(s)</span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <UiLogoLoader v-if="switchingId === ws.id" size="xs" color="primary" />
              <button v-else @click.stop="toggleDefault(ws.id)"
                class="p-1.5 rounded-md transition-all hover:bg-primary/10 group/star"
                :class="ws.is_default ? 'text-warning' : 'text-hsa/20 hover:text-warning/60'"
                :title="ws.is_default ? 'Workspace par défaut' : 'Définir par défaut'">
                <IconStarFilled v-if="ws.is_default" class="w-3 h-3" />
                <IconStar v-else class="w-3 h-3" />
              </button>
              <div v-if="ws.id === wsStore.activeWorkspaceId && switchingId !== ws.id" class="w-1.5 h-1.5 rounded-full bg-primary"></div>
            </div>
          </button>
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
import { useRoute } from 'vue-router'
import { IconChevronDown, IconChevronUp, IconPlus, IconSettings, IconStar, IconStarFilled } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { useToastStore } from '~/stores/front/toast'
import { getWorkspaceLogoUrl, getWorkspaceRoleLabel, getWorkspaceTypeLabel, WORKSPACE_TYPE_CONFIG, WORKSPACE_ROLE_CONFIG } from '~/utils/workspace'
import type { Workspace } from '~/types/workspace'

defineProps<{
  isCollapsed: boolean
  loading?: boolean
}>()

const emit = defineEmits(['toggle-collapse'])

const wsStore = useWorkspaceStore()
const toast = useToastStore()
const wsSearch = ref('')
const router = useRouter()

const toggleDefault = async (id: string) => {
  switchingId.value = id
  const success = await wsStore.setDefaultWorkspace(id)
  switchingId.value = null
  
  if (success) {
    toast.showToast('success', 'Succès', 'Workspace par défaut mis à jour.')
  } else {
    toast.showToast('error', 'Erreur', wsStore.error || 'Impossible de définir le workspace par défaut.')
  }
}

const filteredWorkspaces = computed(() => {
  if (!wsSearch.value) return wsStore.workspaces
  const q = wsSearch.value.toLowerCase()
  return wsStore.workspaces.filter(ws => ws.name.toLowerCase().includes(q))
})

const route = useRoute()
const switchingId = ref<string | null>(null)

const selectWorkspace = async (ws: Workspace) => {
  if (ws.id === wsStore.activeWorkspaceId) return
  
  switchingId.value = ws.id
  const oldSlug = wsStore.activeWorkspace?.slug
  
  // Simulation d'un petit délai pour l'effet visuel comme demandé
  await new Promise(resolve => setTimeout(resolve, 600))
  
  wsStore.setActiveWorkspace(ws)
  
  if (ws.slug) {
    const currentPath = route.path
    if (oldSlug && currentPath.includes(`/dashboard/${oldSlug}`)) {
      const newPath = currentPath.replace(`/dashboard/${oldSlug}`, `/dashboard/${ws.slug}`)
      router.push(newPath)
    } else if (currentPath.startsWith('/dashboard')) {
      // On est déjà sur le dashboard (ex: /dashboard/activities)
      // On reste sur la page, le store a déjà été mis à jour
    } else {
      router.push(`/dashboard/${ws.slug}`)
    }
  }
  
  switchingId.value = null
  wsStore.closeSwitcher()
}

const handleSwitcherToggle = () => {
  wsStore.toggleSwitcher()
}

const activeWorkspaceLogo = computed(() => {
  return getWorkspaceLogoUrl(wsStore.activeWorkspace?.logo_url, wsStore.activeWorkspace?.name)
})

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
