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

          <!-- Search -->
          <UtilsGlobalSearchTrigger customClass="mx-8" />

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
              <!-- Guest Account Hints -->
              <template v-if="authStore.hints.length > 0">
                <LytGuestDropdown :hints="authStore.hints" />
              </template>

              <UiBaseButton v-else to="/auth/login" v-tooltip="getLinkTooltip('/auth/login')"
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

            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="p-2 rounded-lg text-hsa hover:bg-ash transition-colors focus:outline-none">
              <component :is="isMobileMenuOpen ? IconX : IconMenu2" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <LytGuestMobile :show="isMobileMenuOpen" :nav-header="NavHeader" :auth-links="getAuthLinks(true)"
      @close="isMobileMenuOpen = false" />

    <!-- Logout Modal -->
    <ModalGlobalLogout :show="profilStore.isLogoutModalOpen" @close="profilStore.closeLogoutModal()"
      @confirm="confirmLogout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconMenu2, IconX } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useProfilStore } from '~/stores/back/user/profil'
import { getLinkTooltip } from '~/data/shortcuts'
import { useToastStore } from '~/stores/front/toast'

const route = useRoute()

const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Navigation Constants
const NavHeader = [
  { label: 'Vérifier', path: '/verify' },
  { label: 'VigiTech', path: '/vigitech' },
  { label: 'Support', path: '/support' },
  { label: 'Tarifs', path: '/pricings' },
]

// Auth Links
const getAuthLinks = (forMobile: boolean) => {
  const links = [
    { label: 'Tableau de bord', path: '/dashboard', type: 'link', mobile: true },
    { label: 'Mon profil', path: '/dashboard/profile', type: 'link' },
    { label: "Journal d'activité", path: '/dashboard/activities', type: 'link' },
    { label: 'Sessions actives', path: '/dashboard/sessions', type: 'link' },
    { label: 'Centre d\'alertes', path: '/dashboard/reports', type: 'link' },
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
const profilStore = useProfilStore()
const toastStore = useToastStore()

const handleLogout = () => {
  isMobileMenuOpen.value = false
  profilStore.openLogoutModal()
}

const confirmLogout = () => {
  profilStore.closeLogoutModal()
  profilStore.logout(false)
  toastStore.showToast('success', 'Déconnexion', profilStore.message || 'Vous avez été déconnecté avec succès.')
}

// -- State & Logic --
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)

  // Fetch account hints if not logged in
  if (!authStore.user) {
    await authStore.fetchHints()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
