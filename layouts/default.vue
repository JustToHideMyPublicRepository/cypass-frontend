<template>
  <div class="bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="h-16 flex items-center px-6 border-b border-slate-800">
        <div
          class="w-8 h-8 rounded bg-gradient-to-br from-primary to-cypass-green flex items-center justify-center text-white font-bold mr-2">
          C</div>
        <span class="text-xl font-bold">CYPASS</span>
      </div>

      <nav class="p-4 space-y-2">
        <NuxtLink to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-primary text-white">
          <IconDashboard class="w-5 h-5" />
          <span>Vue d'ensemble</span>
        </NuxtLink>

        <div class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">Modules</div>

        <NuxtLink to="/dashboard/docsentry"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-primary text-white">
          <IconFileCertificate class="w-5 h-5" />
          <span>DocSentry</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/secuscan"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-primary text-white">
          <IconScanEye class="w-5 h-5" />
          <span>SecuScan</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/vigitech"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          active-class="bg-primary text-white">
          <IconRadar2 class="w-5 h-5" />
          <span>VigiTech</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <button @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors">
          <IconLogout class="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black/50 z-40 md:hidden"></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header
        class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <button @click="isOpen = !isOpen" class="md:hidden text-slate-500 hover:text-slate-700">
          <IconMenu2 class="w-6 h-6" />
        </button>

        <!-- Search -->
        <div class="hidden md:flex flex-1 max-w-md ml-8 relative">
          <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Rechercher une alerte, un document..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm" />
        </div>

        <!-- Right actions -->
        <div class="flex items-center gap-4">
          <ClientOnly>
            <button @click="toggleColorMode"
              class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <IconMoon v-if="$colorMode.value === 'light'" class="w-5 h-5" />
              <IconSun v-else class="w-5 h-5" />
            </button>
          </ClientOnly>

          <div class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-medium text-slate-900 dark:text-white">{{ user?.name || 'Utilisateur' }}</div>
              <div class="text-xs text-slate-500">{{ user?.email || 'user@cypass.bj' }}</div>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img :src="user?.avatar || 'https://i.pravatar.cc/150'" alt="Profile"
                class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IconLayoutDashboard as IconDashboard,
  IconFileCertificate,
  IconScanEye,
  IconRadar2,
  IconLogout,
  IconMenu2,
  IconSearch,
  IconMoon,
  IconSun
} from '@tabler/icons-vue'

const isOpen = ref(false)
const colorMode = useColorMode()
const cypassData = useCypassData()

const user = computed(() => cypassData.currentUser)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const router = useRouter()
const handleLogout = () => {
  cypassData.logout()
  router.push('/auth/login')
}
</script>
