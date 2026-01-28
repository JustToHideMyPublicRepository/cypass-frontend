<template>
  <header
    class="h-16 bg-WtB border-b border-ash flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <button @click="$emit('toggle-menu')" class="md:hidden text-hsa hover:text-BtW">
      <IconMenu2 class="w-6 h-6" />
    </button>

    <!-- Search -->
    <div class="hidden md:flex flex-1 max-w-md ml-8 relative">
      <IconSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-hsa" />
      <input type="text" placeholder="Rechercher une alerte, un document..." v-tooltip="searchTooltip"
        class="w-full pl-10 pr-4 py-2 rounded-lg bg-ash border-none focus:ring-2 focus:ring-primary text-sm text-BtW placeholder-slate-400" />
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-4">
      <ClientOnly>
        <UiThemeToggle />
        <ModalNotificationDrop />
      </ClientOnly>

      <!-- Profile Dropdown -->
      <div class="relative pl-4 border-l border-ash" ref="dropdownRef">
        <button @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-BtW">{{ authStore.fullName }}</div>
            <div class="flex items-center justify-end gap-1.5">
              <div :class="[
                'w-1.5 h-1.5 rounded-full',
                profilStore.profile?.email_verified ? 'bg-green-500' : 'bg-yellow-500'
              ]"></div>
              <div class="text-xs text-hsa">{{ authStore.user?.email || profilStore.profile?.email }}</div>
            </div>
          </div>
          <div class="w-10 h-10 rounded-full bg-ash overflow-hidden border border-ashAct">
            <img :src="authStore.avatarUrl" alt="Profile" class="w-full h-full object-cover" />
          </div>
          <IconChevronDown class="w-4 h-4 text-hsa transition-transform" :class="{ 'rotate-180': isDropdownOpen }" />
        </button>

        <!-- Dropdown Menu -->
        <Transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <div v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-WtB border border-ash shadow-lg z-50 overflow-hidden">
            <div class="p-3 border-b border-ash">
              <p class="text-sm font-medium text-BtW">{{ authStore.fullName }}</p>
              <div class="flex items-center gap-2">
                <p class="text-xs text-hsa truncate">{{ authStore.user?.email || profilStore.profile?.email }}</p>
                <div :class="[
                  'w-1.5 h-1.5 rounded-full shrink-0',
                  profilStore.profile?.email_verified ? 'bg-green-500' : 'bg-yellow-500'
                ]"></div>
              </div>
            </div>

            <div class="py-2">
              <NuxtLink v-for="link in dropdownLinks" :key="link.path" :to="link.path" @click="isDropdownOpen = false"
                v-tooltip="getLinkTooltip(link.path)"
                class="flex items-center gap-3 px-4 py-2 text-sm text-hsa hover:bg-ash hover:text-BtW transition-colors">
                <component :is="link.icon" class="w-4 h-4" />
                {{ link.label }}
              </NuxtLink>
            </div>

            <div class="border-t border-ash py-2">
              <button @click="$emit('logout')" v-tooltip="getLinkTooltip('logout')"
                class="flex items-center gap-3 px-4 py-2 w-full text-sm text-danger hover:bg-danger/10 transition-colors">
                <IconLogout class="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconMenu2, IconSearch, IconChevronDown, IconUser, IconSettings, IconHelp, IconDevices, IconLogout, IconKeyboard, IconActivity } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'
import { getLinkTooltip } from '~/data/shortcuts'

const authStore = useAuthStore()
const profilStore = useProfilStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const searchTooltip = '<span class="kbd-hint">CTRL</span> + <span class="kbd-hint">K</span>'

const dropdownLinks = [
  { label: 'Mon Profil', path: '/dashboard/profile', icon: IconUser },
  { label: 'Sessions', path: '/dashboard/sessions', icon: IconDevices },
  { label: 'Journal d\'activité', path: '/dashboard/logs', icon: IconActivity },
  { label: 'Paramètres', path: '/dashboard/settings', icon: IconSettings },
  { label: 'Raccourcis Clavier', path: '/help/shortcuts', icon: IconKeyboard },
  { label: 'Aide & Support', path: '/support', icon: IconHelp }
]

defineEmits(['toggle-menu', 'logout'])

// Close dropdown on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
