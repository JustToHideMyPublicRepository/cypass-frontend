<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 bg-WtB border-r border-ash transform transition-all duration-300 ease-in-out md:static shrink-0',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Logo Header -->
    <div class="h-16 flex items-center px-4 border-b border-ash overflow-hidden">
      <NuxtLink to="/" class="flex items-center gap-2 group min-w-max">
        <div
          class="w-8 h-8 rounded-lg bg-WtB flex items-center justify-center shadow-sm border border-ash p-0.5 shrink-0">
          <img src="/img/logo.png" alt="Logo CYPASS" class="w-full h-full object-contain" />
        </div>
        <span v-show="!isCollapsed"
          class="text-xl font-bold text-BtW group-hover:text-primary transition-colors">CYPASS</span>
      </NuxtLink>

      <!-- Desktop Collapse Toggle -->
      <button @click="$emit('toggle-collapse')"
        class="hidden md:flex ml-auto p-1.5 rounded-lg hover:bg-ash text-hsa hover:text-BtW transition-colors">
        <IconChevronLeft :class="['w-5 h-5 transition-transform duration-300', isCollapsed ? 'rotate-180' : '']" />
      </button>
    </div>

    <div class="h-[calc(100vh-8rem)] overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
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
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-ash bg-ash/10">
      <button @click="$emit('logout')" v-tooltip="getLinkTooltip('logout')"
        class="flex items-center gap-3 px-4 py-2 w-full rounded-xl text-danger hover:bg-danger/10 hover:text-dangerAct transition-all duration-200 group-logout font-medium"
        :class="{ 'justify-center px-0': isCollapsed }" :title="isCollapsed ? 'Déconnexion' : ''">
        <IconLogout class="w-5 h-5 group-logout-hover:scale-110 transition-transform shrink-0" />
        <span v-show="!isCollapsed" class="truncate">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconLayoutDashboard as IconDashboard, IconLogout, IconChevronLeft } from '@tabler/icons-vue'
import { modules } from '@/data/modules'
import { getLinkTooltip } from '~/data/shortcuts'

defineProps<{
  isOpen: boolean
  isCollapsed: boolean
}>()

defineEmits(['logout', 'toggle-collapse', 'close'])


const mainLinks = [
  { label: 'Vue d\'ensemble', path: '/dashboard', icon: IconDashboard }
]

const activeModules = computed(() => modules.filter(s => s.status === 'available'))
const comingSoonModules = computed(() => modules.filter(s => s.status !== 'available'))

const route = useRoute()
const isLinkActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path === path || route.path.startsWith(path + '/')
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
