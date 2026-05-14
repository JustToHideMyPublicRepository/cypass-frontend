<template>
  <div class="flex-1 overflow-y-auto px-3 py-6 space-y-8 scrollbar-hide">
    <!-- Main Links -->
    <nav class="space-y-1.5">
      <NuxtLink v-for="link in mainLinks" :key="link.path" :to="link.path" class="nav-link" @click="$emit('close'); wsStore.closeSwitcher()"
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
        <NuxtLink v-for="service in activeModules" :key="service.id" :to="getModulePath(service.id)" class="nav-link"
          @click="$emit('close'); wsStore.closeSwitcher()" v-tooltip="getLinkTooltip(getModulePath(service.id))" :class="{
            'justify-center px-0': isCollapsed,
            'active': isLinkActive(getModulePath(service.id))
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconLayoutDashboard as IconDashboard, IconCalendar } from '@tabler/icons-vue'
import { modules } from '@/data/modules'
import { getLinkTooltip } from '~/data/shortcuts'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

defineProps<{
  isCollapsed: boolean
}>()

defineEmits(['close'])

const route = useRoute()
const wsStore = useWorkspaceStore()

const mainLinks = computed(() => {
  const slug = wsStore.activeWorkspace?.slug
  return [
    { 
      label: 'Vue d\'ensemble', 
      path: slug ? `/dashboard/${slug}` : '/dashboard', 
      icon: IconDashboard 
    },
    { label: 'Calendrier', path: '/dashboard/calendar', icon: IconCalendar }
  ]
})

const activeModules = computed(() => modules.filter(s => s.status === 'available'))
const comingSoonModules = computed(() => modules.filter(s => s.status !== 'available'))

const getModulePath = (moduleId: string) => {
  const slug = wsStore.activeWorkspace?.slug
  // Only docsentry is moved for now as per user request
  if (moduleId === 'docsentry' && slug) {
    return `/dashboard/${slug}/docsentry`
  }
  return `/dashboard/${moduleId}`
}

const isLinkActive = (path: string) => {
  // exact match for overview
  if (wsStore.activeWorkspace?.slug && path === `/dashboard/${wsStore.activeWorkspace.slug}`) {
    return route.path === path
  }
  return route.path === path || (path !== '/dashboard' && route.path.startsWith(path + '/'))
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
