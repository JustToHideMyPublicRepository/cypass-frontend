<template>
  <header
    class="h-16 bg-WtB border-b border-ash flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="flex items-center gap-2 md:hidden">
      <button @click="$emit('toggle-menu')" class="p-2 -ml-2 text-hsa hover:text-BtW transition-colors">
        <IconMenu2 class="w-6 h-6" />
      </button>
    </div>

    <UtilsGlobalSearchTrigger customClass="ml-2 md:ml-8" />

    <!-- Right actions -->
    <div class="flex items-center gap-4">
      <ClientOnly>
        <UiThemeToggle />
        <ModalGlobalNotificationDrop />
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
                profilStore.profile?.email_verified ? 'bg-success' : 'bg-warning'
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
                class="flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 font-medium" :class="[
                  isLinkActive(link.path)
                    ? 'text-primary'
                    : 'text-hsa hover:bg-ash hover:text-BtW'
                ]">
                <component :is="link.icon" class="w-4 h-4" />
                {{ link.label }}
              </NuxtLink>
            </div>

            <div class="border-t border-ash py-2">
              <UiBaseButton @click="$emit('logout')" v-tooltip="getLinkTooltip('logout')" variant="ghost"
                class="!text-sm !flex !items-center !justify-start gap-3 px-4 py-2 w-full text-danger hover:!bg-danger/10 hover:text-dangerAct transition-all duration-200 font-medium !rounded-none">
                <IconLogout class="w-4 h-4" />
                Déconnexion
              </UiBaseButton>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'nuxt/app'
import { IconChevronDown, IconUser, IconSettings, IconHelp, IconDevices, IconLogout, IconKeyboard, IconActivity, IconMenu2 } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'
import { getLinkTooltip } from '~/data/shortcuts'
const authStore = useAuthStore()
const profilStore = useProfilStore()
const route = useRoute()

const isLinkActive = (path: string) => {
  return route.path === path || (path !== '/dashboard' && route.path.startsWith(path))
}

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const dropdownLinks = [
  { label: 'Mon Profil', path: '/dashboard/profile', icon: IconUser },
  { label: 'Sessions', path: '/dashboard/sessions', icon: IconDevices },
  { label: 'Journal d\'activité', path: '/dashboard/logs', icon: IconActivity },
  { label: 'Paramètres', path: '/dashboard/settings', icon: IconSettings },
  { label: 'Raccourcis Clavier', path: '/system/shortcuts', icon: IconKeyboard },
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
