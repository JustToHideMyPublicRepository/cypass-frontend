<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-50 bg-WtB border-r border-ash transform transition-all duration-300 ease-in-out md:static shrink-0 flex flex-col',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    isCollapsed ? 'w-20' : 'w-64'
  ]">
    <!-- Workspace Switcher Header -->
    <LytDefaultSidebarWorkspaceSwitcher :is-collapsed="isCollapsed" :loading="wsStore.loading" />

    <!-- Scrollable Navigation -->
    <LytDefaultSidebarNavigation :is-collapsed="isCollapsed" @close="$emit('close')" />

    <!-- Footer Action -->
    <LytDefaultSidebarPlanPreview :is-collapsed="isCollapsed" @close="$emit('close')" @logout="$emit('logout')" />
  </aside>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/back/user/workspace'

const wsStore = useWorkspaceStore()

defineProps<{
  isOpen: boolean
  isCollapsed: boolean
}>()

defineEmits(['logout', 'close'])
</script>
