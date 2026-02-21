<template>
  <div>
    <!-- Navbar -->
    <header class="fixed w-full top-0 z-50 transition-all duration-300 border-b border-transparent" :class="[
      scrolled ? 'bg-WtB/80 backdrop-blur-2xl shadow-sm border-ash h-16' : 'bg-transparent h-20'
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div class="flex justify-between items-center h-full">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="relative w-9 h-9">
              <div
                class="relative w-full h-full rounded-lg bg-white flex items-center justify-center overflow-hidden p-0.5">
                <img src="/img/logo.png" alt="Logo CYPASS" class="w-full h-full object-contain" />
              </div>
            </div>
            <span class="text-xl font-bold tracking-tight group-hover:text-BtW transition-colors">
              CYPASS
            </span>
          </NuxtLink>

          <!-- Search (Desktop) -->
          <div @click="searchStore.openSearch()"
            class="hidden lg:flex flex-1 max-w-sm mx-8 relative cursor-pointer group">
            <IconSearch
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-hsa group-hover:text-primary transition-colors" />
            <input type="text" placeholder="Rechercher..." readonly
              class="w-full pl-9 pr-4 py-2 rounded-xl bg-ash/50 border border-transparent group-hover:border-ash group-hover:bg-ash transition-all text-xs text-BtW placeholder-slate-400 cursor-pointer" />
          </div>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <template v-for="item in NavHeader" :key="item.label">
              <NuxtLink :to="item.path" v-tooltip="getLinkTooltip(item.path)"
                class="text-sm font-medium hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
                :class="{ 'text-primary after:w-full': isLinkActive(item.path) }">
                {{ item.label }}
              </NuxtLink>
            </template>

            <!-- Auth Action -->
            <template v-if="!authStore.user">
              <UiBaseButton to="/auth/login" v-tooltip="getLinkTooltip('/auth/login')"
                class="px-5 py-2.5 rounded-full text-sm">
                Connexion
              </UiBaseButton>
            </template>
            <template v-else>
              <LytGuestDropdown :auth-links="getAuthLinks(false)" />
            </template>

            <!-- Theme Toggle -->
            <UiThemeToggle class="ml-2" />

            <!-- Notifications (if authenticated) -->
            <ClientOnly v-if="authStore.user">
              <ModalGlobalNotificationDrop />
            </ClientOnly>
          </nav>

          <!-- Mobile Controls -->
          <div class="md:hidden flex items-center gap-2">
            <!-- Notifications (if authenticated) -->
            <ClientOnly v-if="authStore.user">
              <ModalGlobalNotificationDrop />
            </ClientOnly>

            <UiThemeToggle />

            <button @click="searchStore.openSearch()"
              class="p-2 rounded-lg text-hsa hover:bg-ash hover:text-primary transition-colors focus:outline-none">
              <IconSearch class="w-6 h-6" />
            </button>

            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="p-2 rounded-lg text-hsa hover:bg-ash transition-colors focus:outline-none">
              <component :is="isMobileMenuOpen ? IconX : IconMenu2" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Drawer -->
    <Transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 md:hidden pt-24 px-4 bg-WtB/95 backdrop-blur-xl flex flex-col items-center">
        <div class="flex flex-col gap-4 w-full max-w-sm text-center">
          <NuxtLink v-for="item in NavHeader" :key="item.label" :to="item.path" @click="isMobileMenuOpen = false"
            class="p-3 rounded-xl text-lg font-medium hover:bg-ash transition-colors"
            :class="{ 'text-primary': isLinkActive(item.path) }">
            {{ item.label }}
          </NuxtLink>

          <hr class="border-ash my-2" />

          <template v-if="!authStore.user">
            <UiBaseButton to="/auth/login" @click="isMobileMenuOpen = false" class="p-4 rounded-xl text-lg font-medium">
              Connexion
            </UiBaseButton>
          </template>
          <template v-else>
            <template v-for="link in getAuthLinks(true)" :key="link.path">
              <UiBaseButton v-if="link.type === 'link'" :to="link.path" @click="isMobileMenuOpen = false"
                class="p-4 rounded-xl text-lg font-medium">
                {{ link.label }}
              </UiBaseButton>
              <UiBaseButton v-else-if="link.type === 'button'" @click="link.action" variant="ghost"
                class="!p-4 rounded-xl !text-lg !font-medium" :class="link.class">
                {{ link.label }}
              </UiBaseButton>
            </template>
          </template>
        </div>

        <div class="mt-8 pt-8 border-t border-ash w-full text-center">
          <p class="text-sm text-hsa mb-4">CYPASS &copy; 2024</p>
        </div>
      </div>
    </Transition>

    <!-- Logout Modal -->
    <ModalGlobalLogout :show="authStore.isLogoutModalOpen" @close="authStore.closeLogoutModal()"
      @confirm="confirmLogout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconMenu2, IconX, IconSearch } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useSearchStore } from '~/stores/search'
import { getLinkTooltip } from '~/data/shortcuts'
import { useToastStore } from '~/stores/toast'

const route = useRoute()

const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Navigation Constants
const NavHeader = [
  { label: 'Vérifier', path: '/verify' },
  { label: 'Support', path: '/support' },
  { label: 'À propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

// Auth Links
const getAuthLinks = (forMobile: boolean) => {
  const links = [
    { label: 'Tableau de bord', path: '/dashboard', type: 'link', mobile: true },
    { label: 'Mon Profil', path: '/dashboard/profile', type: 'link' },
    { label: "Journal d'activité", path: '/dashboard/logs', type: 'link' },
    { label: 'Sessions actives', path: '/dashboard/sessions', type: 'link' },
    {
      label: 'Déconnexion',
      path: 'logout',
      type: 'button',
      action: handleLogout,
      class: 'text-danger hover:bg-danger/10',
      mobile: true
    },
  ]

  return forMobile ? links.filter(l => l.mobile) : links
}

const authStore = useAuthStore()
const toastStore = useToastStore()
const searchStore = useSearchStore()

const handleLogout = () => {
  isMobileMenuOpen.value = false
  authStore.openLogoutModal()
}

const confirmLogout = () => {
  authStore.closeLogoutModal()
  authStore.logout(false)
  toastStore.showToast('success', 'Déconnexion', authStore.message || 'Vous avez été déconnecté avec succès.')
}

// -- State & Logic --
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
