<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 bg-WtB border-r border-ash transform transition-all duration-300 ease-in-out md:static shrink-0 flex flex-col relative h-[100dvh] md:h-screen overflow-hidden md:overflow-visible',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Floating Toggle Button (Desktop) -->
    <button @click="$emit('toggle-collapse')"
      class="hidden md:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-hsa border border-ash items-center justify-center text-WtB hover:bg-hsa/80 transition-all duration-200 z-[60] shadow-sm group">
      <IconChevronLeft :class="['w-3.5 h-3.5 transition-transform duration-300', isCollapsed ? 'rotate-180' : '']" />
    </button>

    <!-- Workspace Switcher Header -->
    <LytDefaultSidebarWorkspaceSwitcher :is-collapsed="isCollapsed" :loading="wsStore.loading" />

    <!-- Scrollable Navigation -->
    <LytDefaultSidebarNavigation :is-collapsed="isCollapsed" @close="$emit('close')" />

    <!-- Footer Action -->
    <LytDefaultSidebarPlanPreview :is-collapsed="isCollapsed" @close="$emit('close')" @logout="$emit('logout')" />
  </aside>
</template>

<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { useWorkspaceStore } from '~/stores/back/user/workspace'

const wsStore = useWorkspaceStore()

defineProps<{
  isOpen: boolean
  isCollapsed: boolean
}>()

defineEmits(['logout', 'toggle-collapse', 'close'])
</script>
