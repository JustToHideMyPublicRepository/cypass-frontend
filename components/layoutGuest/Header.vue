<template>
  <div>
    <!-- Navbar -->
    <header class="fixed w-full top-0 z-50 transition-all duration-300 border-b border-transparent" :class="[
      scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-slate-200 dark:border-slate-800 h-16' : 'bg-transparent h-20'
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
                active-class="text-primary after:w-full">
                {{ item.label }}
              </NuxtLink>

              <!-- Button Link -->
              <NuxtLink v-else :to="item.path"
                class="btn btn-primary w-full sm:w-auto text-lg px-5 py-2.5 shadow-BtW/40 rounded-full text-sm ">
                {{ item.label }}
              </NuxtLink>
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
            <button @click="toggleTheme" class="p-2 rounded-full text-slate-500 hover:bg-ash transition-colors">
              <IconSun v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-400" />
              <IconMoon v-else class="w-5 h-5" />
            </button>

            <button @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none">
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
        class="fixed inset-0 z-40 md:hidden pt-24 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center">
        <div class="flex flex-col gap-6 w-full max-w-sm text-center">
          <NuxtLink v-for="item in NavHeader" :key="item.label" :to="item.path" @click="isMobileMenuOpen = false"
            class="p-4 rounded-xl text-lg font-medium transition-colors" :class="[
              item.isButton
                ? 'bg-primary text-white font-bold shadow-md'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 w-full text-center">
          <p class="text-sm text-slate-400 mb-4">Préférences</p>
          <button @click="toggleTheme"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
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
