<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 bg-WtB border-r border-ash transform transition-all duration-300 ease-in-out md:static shrink-0 flex flex-col',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Workspace Switcher Header -->
    <div class="shrink-0 border-b border-ash">
      <!-- Workspace Button -->
      <div class="h-16 flex items-center px-3 gap-2">
        <button @click="handleSwitcherToggle"
          class="flex items-center gap-2.5 flex-1 min-w-0 px-2 py-2 rounded-xl hover:bg-ash/60 transition-all duration-200 group"
          :class="{ 'justify-center': isCollapsed }"
          :title="isCollapsed ? (wsStore.activeWorkspace?.name || 'Workspaces') : ''">
          <!-- Workspace Avatar -->
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold shadow-sm transition-all duration-200"
            :class="wsStore.activeWorkspace?.logo_url
              ? 'bg-WtB border border-ash p-0.5'
              : 'bg-gradient-to-br from-primary/80 to-secondary/80 text-white'">
            <img v-if="wsStore.activeWorkspace?.logo_url" :src="wsStore.activeWorkspace.logo_url"
              :alt="wsStore.activeWorkspace.name" class="w-full h-full object-cover rounded-md" />
            <span v-else>{{ wsStore.workspaceInitial }}</span>
          </div>
          <!-- Name + Chevron -->
          <div v-show="!isCollapsed" class="flex items-center gap-1 min-w-0 flex-1">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-BtW truncate leading-tight">
                {{ wsStore.activeWorkspace?.name || 'Workspace' }}
              </p>
              <p class="text-[10px] text-hsa truncate capitalize">
                {{ wsStore.activeWorkspace?.type || '' }}
                <span v-if="wsStore.activeWorkspace?.role" class="text-primary/70">· {{ wsStore.activeWorkspace.role
                }}</span>
              </p>
            </div>
            <IconSelector class="w-4 h-4 text-hsa shrink-0 group-hover:text-BtW transition-colors" />
          </div>
        </button>

        <!-- Desktop Collapse Toggle -->
        <button @click="$emit('toggle-collapse')"
          class="hidden md:flex p-1.5 rounded-lg hover:bg-ash text-hsa hover:text-BtW transition-colors shrink-0">
          <IconChevronLeft :class="['w-5 h-5 transition-transform duration-300', isCollapsed ? 'rotate-180' : '']" />
        </button>
      </div>

      <!-- Workspace Dropdown -->
      <Transition enter-active-class="transition duration-200 ease-out origin-top"
        enter-from-class="opacity-0 scale-y-95" enter-to-class="opacity-100 scale-y-100"
        leave-active-class="transition duration-150 ease-in origin-top" leave-from-class="opacity-100 scale-y-100"
        leave-to-class="opacity-0 scale-y-95">
        <div v-if="wsStore.isSwitcherOpen && !isCollapsed"
          class="border-t border-ash bg-WtB px-3 py-2 space-y-1 max-h-64 overflow-y-auto no-scrollbar">
          <!-- Search (if many workspaces) -->
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
            <div class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold" :class="ws.logo_url
              ? 'bg-WtB border border-ash p-0.5'
              : 'bg-gradient-to-br from-primary/60 to-secondary/60 text-white'">
              <img v-if="ws.logo_url" :src="ws.logo_url" :alt="ws.name" class="w-full h-full object-cover rounded" />
              <span v-else>{{ ws.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium truncate">{{ ws.name }}</p>
              <p class="text-[9px] opacity-60 capitalize">{{ ws.type }}
                <span v-if="ws.members_count"> · {{ ws.members_count }} membre{{ ws.members_count > 1 ? 's' : ''
                }}</span>
              </p>
            </div>
            <!-- Active indicator -->
            <div v-if="ws.id === wsStore.activeWorkspaceId" class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
          </button>

          <!-- Divider + Create -->
          <div class="border-t border-ash/50 pt-1.5 mt-1.5">
            <button @click="wsStore.openCreateModal()"
              class="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-hsa hover:bg-primary/10 hover:text-primary transition-all duration-150">
              <div class="w-6 h-6 rounded-md border border-dashed border-current flex items-center justify-center">
                <IconPlus class="w-3.5 h-3.5" />
              </div>
              <span class="text-xs font-medium">Nouveau workspace</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Scrollable Navigation -->
    <div class="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
      <!-- Main Links -->
      <nav class="space-y-1.5">
        <NuxtLink v-for="link in mainLinks" :key="link.path" :to="link.path" class="nav-link" @click="$emit('close')"
          v-tooltip="getLinkTooltip(link.path)" :class="{
            'justify-center px-0': isCollapsed,
            'active': isLinkActive(link.path)
          }" :title="isCollapsed ? link.label : ''">
          <component :is="link.icon" class="w-5 h-5 icon" />
          <span v-show="!isCollapsed" class="truncate">{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Active Modules -->
      <div class="space-y-4">
        <div v-show="!isCollapsed" class="px-4 text-[10px] font-bold text-hsa uppercase tracking-[0.2em] truncate">
          Modules actifs</div>
        <div v-show="isCollapsed" class="border-t border-ash mx-2"></div>
        <nav class="space-y-1.5">
          <NuxtLink v-for="service in activeModules" :key="service.id" :to="`/dashboard/${service.id}`" class="nav-link"
            @click="$emit('close')" v-tooltip="getLinkTooltip('/dashboard/' + service.id)" :class="{
              'justify-center px-0': isCollapsed,
              'active': isLinkActive(`/dashboard/${service.id}`)
            }" :title="isCollapsed ? service.title : ''">
            <component :is="service.icon" class="w-5 h-5 icon" />
            <span v-show="!isCollapsed" class="truncate">{{ service.title }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Coming Soon Modules -->
      <div class="space-y-4">
        <div v-show="!isCollapsed" class="px-4 text-[10px] font-bold text-hsa uppercase tracking-[0.2em] truncate">
          Bientôt disponible</div>
        <div v-show="isCollapsed" class="border-t border-ash mx-2"></div>
        <div class="space-y-1.5">
          <NuxtLink v-for="service in comingSoonModules" :key="service.id" :to="`/coming-soon?service=${service.id}`"
            class="nav-link light-link group/item relative" :class="{ 'justify-center px-0': isCollapsed }"
            :title="isCollapsed ? `${service.title} (Bientôt disponible)` : ''">
            <component :is="service.icon" class="w-5 h-5 icon opacity-50" />
            <span v-show="!isCollapsed" class="opacity-50 decoration-hsa truncate">
              {{ service.title }}</span>
            <span v-show="!isCollapsed"
              class="absolute right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-ashAct text-hsa opacity-0 group-hover/item:opacity-100 transition-opacity">
              Détails
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer Action -->
    <div class="shrink-0 p-4 border-t border-ash bg-ash/10 space-y-4">
      <!-- Plan Preview (if not collapsed) -->
      <div v-if="!isCollapsed && profilStore.profile?.plan"
        class="px-2 py-3 rounded-xl bg-ash/50 border border-ash/50 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-black text-hsa uppercase tracking-widest">Plan</span>
          <span class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase" :class="planBadgeClass">
            {{ profilStore.profile.plan.name }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-[9px] font-black text-hsa uppercase tracking-widest">Crédits</span>
          <span class="text-[10px] font-black text-BtW">{{ profilStore.profile.plan.credits }}</span>
        </div>
        <div class="w-full bg-ash h-1 rounded-full overflow-hidden">
          <div class="bg-primary h-full transition-all duration-500" :style="{ width: `${planUsageProgress}%` }"></div>
        </div>
        <NuxtLink to="/dashboard/billing" @click="$emit('close')"
          class="flex items-center justify-between group/manage pt-1.5 hover:opacity-80 transition-opacity">
          <span
            class="text-[9px] font-black text-hsa uppercase tracking-[0.2em] group-hover/manage:text-primary transition-colors">
            Gérer mon abonnement</span>
          <IconChevronRight class="w-3 h-3 text-hsa group-hover/manage:text-primary transition-colors" />
        </NuxtLink>
      </div>

      <UiBaseButton @click="$emit('logout')" v-tooltip="getLinkTooltip('logout')" variant="ghost"
        class="!flex !items-center !justify-start gap-3 px-4 py-2 w-full !rounded-xl text-danger hover:!bg-danger/10 hover:text-dangerAct transition-all duration-200 group-logout font-medium"
        :class="{ '!justify-center !px-0': isCollapsed }" :title="isCollapsed ? 'Déconnexion' : ''">
        <IconLogout class="w-5 h-5 group-logout-hover:scale-110 transition-transform shrink-0" />
        <span v-show="!isCollapsed" class="truncate">Déconnexion</span>
      </UiBaseButton>
    </div>
  </aside>

  <!-- Click-away overlay for switcher -->
  <Teleport to="body">
    <div v-if="wsStore.isSwitcherOpen" @click="wsStore.closeSwitcher()" class="fixed inset-0 z-40"></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconLayoutDashboard as IconDashboard, IconCalendar, IconLogout, IconChevronLeft, IconChevronRight, IconSelector, IconPlus } from '@tabler/icons-vue'
import { modules } from '@/data/modules'
import { getLinkTooltip } from '~/data/shortcuts'
import { useProfilStore } from '~/stores/back/user/profil'
import { useWorkspaceStore } from '~/stores/back/user/workspace'
import { getPlanInfo, getPlanBadgeClass } from '~/utils/pricing'
import type { Workspace } from '~/types/workspace'

const authStore = useAuthStore()
const profilStore = useProfilStore()
const wsStore = useWorkspaceStore()

const wsSearch = ref('')

const planBadgeClass = computed(() => getPlanBadgeClass(profilStore.profile?.plan?.name))
const planUsageProgress = computed(() => {
  const plan = profilStore.profile?.plan
  if (!plan) return 0
  const info = getPlanInfo(plan.name)
  if (info.credits === 1000000) return 100
  return Math.min(100, Math.round((plan.credits / info.credits) * 100))
})

defineProps<{
  isOpen: boolean
  isCollapsed: boolean
}>()

defineEmits(['logout', 'toggle-collapse', 'close'])

const mainLinks = [
  { label: 'Vue d\'ensemble', path: '/dashboard', icon: IconDashboard },
  { label: 'Calendrier', path: '/dashboard/calendar', icon: IconCalendar }
]

const activeModules = computed(() => modules.filter(s => s.status === 'available'))
const comingSoonModules = computed(() => modules.filter(s => s.status !== 'available'))

const route = useRoute()
const isLinkActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path === path || route.path.startsWith(path + '/')
}

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
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium;
}

/* Base Link State */
.nav-link:not(.active):not(.disabled) {
  @apply text-hsa hover:bg-ash hover:text-BtW;
}

/* Active Link State */
.nav-link.active {
  @apply bg-primary text-WtB shadow-lg shadow-primary/20;
}

/* Hover effect on active link */
.nav-link.active:hover {
  @apply bg-secondary text-ash;
}

/* Disabled/Coming Soon State */
.nav-link.disabled {
  @apply cursor-not-allowed select-none text-hsa opacity-50 grayscale-[0.5];
}

.nav-link.light-link {
  @apply text-hsa hover:bg-ash hover:text-BtW opacity-60 hover:opacity-100 transition-all;
}

.icon {
  @apply transition-transform duration-200;
}

.nav-link:hover .icon:not(.active) {
  @apply scale-110;
}
</style>
