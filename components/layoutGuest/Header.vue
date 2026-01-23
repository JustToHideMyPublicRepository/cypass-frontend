<template>
  <div>
    <!-- Navbar -->
    <header class="fixed w-full top-0 z-50 transition-all duration-300 border-b border-transparent" :class="[
      scrolled ? 'bg-WtB/80 backdrop-blur-md shadow-sm border-ash h-16' : 'bg-transparent h-20'
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
              <div class="relative" ref="dropdownRef">
                <button @click="isDropdownOpen = !isDropdownOpen"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-ash transition-colors">
                  <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                    <img :src="authStore.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-semibold hidden lg:block">{{ authStore.user.first_name }}</span>
                </button>

                <Transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-WtB border border-ash shadow-lg z-50 overflow-hidden">
                    <div class="p-3 border-b border-ash bg-ash/20">
                      <p class="text-xs font-bold text-hsa uppercase tracking-wider">Connecté en tant que</p>
                      <p class="text-sm font-bold truncate text-BtW">{{ authStore.fullName }}</p>
                    </div>
                    <div class="py-1">
                      <NuxtLink to="/dashboard" @click="isDropdownOpen = false"
                        class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ash transition-colors">
                        Tableau de bord
                      </NuxtLink>
                      <NuxtLink to="/dashboard/profile" @click="isDropdownOpen = false"
                        class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-ash transition-colors">
                        Mon Profil
                      </NuxtLink>
                      <button @click="handleLogout"
                        class="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 w-full text-left transition-colors font-medium">
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>

            <!-- Theme Toggle -->
            <UiThemeToggle class="ml-2" />
          </nav>

          <!-- Mobile Controls -->
          <div class="md:hidden flex items-center gap-4">
            <UiThemeToggle />

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
            <UiBaseButton to="/dashboard" @click="isMobileMenuOpen = false" class="p-4 rounded-xl text-lg font-medium">
              Tableau de bord
            </UiBaseButton>
            <button @click="handleLogout" class="p-4 rounded-xl text-lg font-medium text-danger hover:bg-danger/10">
              Déconnexion
            </button>
          </template>
        </div>

        <div class="mt-8 pt-8 border-t border-ash w-full text-center">
          <p class="text-sm text-hsa mb-4">Préférences</p>
          <UiThemeToggle />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconMenu2, IconX } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { getLinkTooltip } from '~/data/shortcuts'

const route = useRoute()

const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Navigation Constants
const NavHeader = [
  { label: 'Services', path: '/services', isButton: false },
  { label: 'Support', path: '/support', isButton: false },
  { label: 'À propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

const authStore = useAuthStore()
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleLogout = () => {
  isDropdownOpen.value = false
  isMobileMenuOpen.value = false
  authStore.logout()
}

// Close dropdown on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

// -- State & Logic --
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>
