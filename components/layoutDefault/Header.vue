<template>
  <header
    class="h-16 bg-WtB border-b border-ash flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <button @click="$emit('toggle-menu')" class="md:hidden text-hsa hover:text-BtW">
      <IconMenu2 class="w-6 h-6" />
    </button>

    <!-- Search -->
    <div class="hidden md:flex flex-1 max-w-md ml-8 relative">
      <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
      <input type="text" placeholder="Rechercher une alerte, un document..."
        class="w-full pl-10 pr-4 py-2 rounded-lg bg-ash border-none focus:ring-2 focus:ring-primary text-sm text-BtW placeholder-slate-400" />
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-4">
      <ClientOnly>
        <UiThemeToggle />
      </ClientOnly>

      <div class="flex items-center gap-3 pl-4 border-l border-ash">
        <div class="text-right hidden sm:block">
          <div class="text-sm font-medium text-BtW">{{ user?.name || 'Utilisateur' }}</div>
          <div class="text-xs text-hsa">{{ user?.email || 'user@cypass.bj' }}</div>
        </div>
        <div class="w-10 h-10 rounded-full bg-ash overflow-hidden">
          <img :src="user?.avatar || 'https://i.pravatar.cc/150'" alt="Profile" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { IconMenu2, IconSearch } from '@tabler/icons-vue'

defineProps<{
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
}>()

defineEmits(['toggle-menu'])
</script>
