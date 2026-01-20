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
              <!-- Standard Link -->
              <NuxtLink v-if="!item.isButton" :to="item.path"
                class="text-sm font-medium hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
                :class="{ 'text-primary after:w-full': isLinkActive(item.path) }">
                {{ item.label }}
              </NuxtLink>

              <!-- Button Link -->
              <UiBaseButton v-else :to="item.path" class="w-full sm:w-auto text-lg px-5 py-2.5 rounded-full text-sm">
                {{ item.label }}
              </UiBaseButton>
            </template>

            <!-- Theme Toggle -->
            <button @click="toggleTheme" class="ml-2 p-2 rounded-full hover:bg-ash transition-colors"
              aria-label="Toggle Theme">
              <IconSun v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-400" />
              <IconMoon v-else class="w-5 h-5" />
            </button>
          </nav>

          <!-- Mobile Controls -->
          <div class="md:hidden flex items-center gap-4">
            <button @click="toggleTheme" class="p-2 rounded-full text-hsa hover:bg-ash transition-colors">
              <IconSun v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-400" />
              <IconMoon v-else class="w-5 h-5" />
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
        <div class="flex flex-col gap-6 w-full max-w-sm text-center">
          <NuxtLink v-for="item in NavHeader" :key="item.label" :to="item.path" @click="isMobileMenuOpen = false"
            class="p-4 rounded-xl text-lg font-medium transition-colors" :class="[
              item.isButton
                ? 'btn btn-primary shadow-md'
                : 'text-BtW hover:bg-ash'
            ]">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="mt-8 pt-8 border-t border-ash w-full text-center">
          <p class="text-sm text-hsa mb-4">Préférences</p>
          <button @click="toggleTheme"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-ash text-hsa hover:bg-ash/50 transition-colors">
            <IconSun v-if="colorMode.preference === 'dark'" class="w-4 h-4 text-yellow-500" />
            <IconMoon v-else class="w-4 h-4" />
            <span>{{ colorMode.preference === 'dark' ? 'Mode Clair' : 'Mode Sombre' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { IconMenu2, IconX, IconSun, IconMoon } from '@tabler/icons-vue'

const colorMode = useColorMode()
const route = useRoute()

const isLinkActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// -- Navigation Constants --
const NavHeader = [
  { label: 'Services', path: '/services', isButton: false },
  { label: 'Support', path: '/support', isButton: false },
  { label: 'À propos', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'Connexion', path: '/auth/login', isButton: true },
]

// -- State & Logic --
const isMobileMenuOpen = ref(false)
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
