<template>
  <div class="flex min-h-screen bg-bgClr transition-colors duration-300">
    <!-- Sidebar -->
    <LayoutDefaultSidebar :isOpen="isOpen" :isCollapsed="isCollapsed" @logout="handleLogout"
      @toggle-collapse="isCollapsed = !isCollapsed" />

    <!-- Overlay for mobile -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
      <!-- Topbar -->
      <LayoutDefaultHeader :user="user" @toggle-menu="isOpen = !isOpen" @logout="handleLogout" />

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

      <!-- Dashboard Footer -->
      <LayoutDefaultFooter class="shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isOpen = ref(false)
const isCollapsed = ref(false)
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}
</script>
