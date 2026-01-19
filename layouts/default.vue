<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-WtB border-r border-ash transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="h-16 flex items-center px-6 border-b border-ash">
        <div
          class="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold mr-2">
          C</div>
        <span class="text-xl font-bold text-BtW">CYPASS</span>
      </div>

      <nav class="p-4 space-y-2">
        <NuxtLink to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
          active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
          <IconDashboard class="w-5 h-5" />
          <span>Vue d'ensemble</span>
        </NuxtLink>

        <div class="px-4 py-2 text-xs font-semibold text-hsa uppercase tracking-wider mt-6">Modules</div>

        <NuxtLink to="/dashboard/docsentry"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
          active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
          <IconFileCertificate class="w-5 h-5" />
          <span>DocSentry</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/secuscan"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
          active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
          <IconScanEye class="w-5 h-5" />
          <span>SecuScan</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/vigitech"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-hsa hover:bg-ash hover:text-BtW transition-colors"
          active-class="bg-primary text-white hover:bg-primary/90 hover:text-white">
          <IconRadar2 class="w-5 h-5" />
          <span>VigiTech</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-ash">
        <button @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-danger hover:bg-danger/10 hover:text-dangerAct transition-colors">
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
        class="h-16 bg-WtB border-b border-ash flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <button @click="isOpen = !isOpen" class="md:hidden text-hsa hover:text-BtW">
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
            <button @click="toggleColorMode" class="p-2 text-hsa hover:bg-ash rounded-full transition-colors">
              <IconMoon v-if="$colorMode.value === 'light'" class="w-5 h-5" />
              <IconSun v-else class="w-5 h-5" />
            </button>
          </ClientOnly>

          <div class="flex items-center gap-3 pl-4 border-l border-ash">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-medium text-BtW">{{ user?.name || 'Utilisateur' }}</div>
              <div class="text-xs text-hsa">{{ user?.email || 'user@cypass.bj' }}</div>
            </div>
            <div class="w-10 h-10 rounded-full bg-ash overflow-hidden">
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
