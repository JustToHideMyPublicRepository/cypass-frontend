<template>
  <div class="flex">
    <!-- Sidebar -->
    <LayoutDefaultSidebar :isOpen="isOpen" @logout="handleLogout" />

    <!-- Overlay for mobile -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <LayoutDefaultHeader :user="user" @toggle-menu="isOpen = !isOpen" />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isOpen = ref(false)
const cypassData = useCypassData()

const user = computed(() => cypassData.currentUser)

const router = useRouter()
const handleLogout = () => {
  cypassData.logout()
  router.push('/auth/login')
}
</script>
