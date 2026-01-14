<template>
  <div
    class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-cypass-blue selection:text-white">

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
                class="absolute inset-0 bg-gradient-to-br from-cypass-blue to-cypass-green rounded-lg blur opacity-70 group-hover:opacity-100 transition-opacity">
              </div>
              <div
                class="relative w-full h-full rounded-lg bg-gradient-to-br from-cypass-blue to-cypass-green flex items-center justify-center text-white font-bold shadow-sm">
                C
              </div>
            </div>
            <span
              class="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-cypass-blue dark:group-hover:text-cypass-green transition-colors">
              CYPASS
            </span>
          </NuxtLink>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <template v-for="item in NavHeader" :key="item.label">
              <!-- Standard Link -->
              <NuxtLink v-if="!item.isButton" :to="item.path"
                class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cypass-blue dark:hover:text-white transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-cypass-blue after:left-0 after:-bottom-1 after:transition-all hover:after:w-full"
                active-class="text-cypass-blue dark:text-white after:w-full">
                {{ item.label }}
              </NuxtLink>

              <!-- Button Link -->
              <NuxtLink v-else :to="item.path"
                class="px-5 py-2.5 rounded-full bg-gradient-to-r from-cypass-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300">
                {{ item.label }}
              </NuxtLink>
            </template>

            <!-- Theme Toggle -->
            <button @click="toggleTheme"
              class="ml-2 p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme">
              <IconSun v-if="colorMode.preference === 'dark'" class="w-5 h-5 text-yellow-400" />
              <IconMoon v-else class="w-5 h-5" />
            </button>
          </nav>

          <!-- Mobile Controls -->
          <div class="md:hidden flex items-center gap-4">
            <button @click="toggleTheme"
              class="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
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
                ? 'bg-cypass-blue text-white font-bold shadow-md'
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

    <!-- Content -->
    <main class="flex-grow pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          <!-- Brand Column -->
          <div class="space-y-6">
            <NuxtLink to="/" class="flex items-center gap-2">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-cypass-blue to-cypass-green flex items-center justify-center text-white font-bold text-lg shadow-lg">
                C</div>
              <span class="text-2xl font-bold text-slate-900 dark:text-white">CYPASS</span>
            </NuxtLink>
            <p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              Infrastructure nationale de confiance numérique. Nous sécurisons l'avenir numérique du Bénin avec des
              technologies de pointe.
            </p>
            <div class="flex gap-3">
              <a v-for="social in ['twitter', 'linkedin', 'github']" :key="social" href="#"
                class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-cypass-blue hover:border-cypass-blue transition-all duration-300">
                <component :is="getSocialIcon(social)" class="w-5 h-5" />
              </a>
            </div>
          </div>

          <!-- Links Column 1 -->
          <div>
            <h4 class="text-slate-900 dark:text-white font-bold mb-6">Plateforme</h4>
            <ul class="space-y-3">
              <li v-for="link in NavFooter.links" :key="link.label">
                <NuxtLink :to="link.path"
                  class="text-slate-500 dark:text-slate-400 hover:text-cypass-blue dark:hover:text-cypass-green text-sm transition-colors flex items-center gap-2 group">
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-cypass-blue transition-colors"></span>
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Links Column 2 -->
          <div>
            <h4 class="text-slate-900 dark:text-white font-bold mb-6">Ressources</h4>
            <ul class="space-y-3">
              <li v-for="link in NavFooter.legal" :key="link.label">
                <NuxtLink :to="link.path"
                  class="text-slate-500 dark:text-slate-400 hover:text-cypass-blue dark:hover:text-cypass-green text-sm transition-colors flex items-center gap-2 group">
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-cypass-blue transition-colors"></span>
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Newsletter / Badge (Refined) -->
          <div
            class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 class="text-slate-900 dark:text-white font-bold mb-2">Sécurité Certifiée</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Audité et validé par l'ANSSI Bénin pour la conformité aux normes de sécurité nationales.
            </p>
            <div
              class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
              <IconShieldCheck class="w-8 h-8 text-green-600" />
              <div>
                <div class="text-xs font-bold text-green-800 dark:text-green-300">CONFORME</div>
                <div class="text-[10px] text-green-600 dark:text-green-400">RÉFÉRENTIEL GÉNÉRAL</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Footer -->
        <div
          class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p class="text-sm text-slate-500 dark:text-slate-500">
              &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
            </p>
            <div class="hidden md:flex gap-4">
              <a href="#" class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Plan du site</a>
              <a href="#"
                class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Accessibilité</a>
            </div>
          </div>

          <div class="flex items-center gap-2 opacity-70">
            <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">République du Bénin</span>
            <img src="https://flagcdn.com/w40/bj.png" alt="Flag of Benin" class="h-4 rounded shadow-sm opacity-80" />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  IconMenu2,
  IconX,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconShieldCheck,
  IconSun,
  IconMoon
} from '@tabler/icons-vue'

const colorMode = useColorMode()

// -- Navigation Constants --
const NavHeader = [
  { label: 'Services', path: '/#features', isButton: false },
  { label: 'Documentation', path: '/docs', isButton: false },
  { label: 'Support', path: '/support', isButton: false },
  { label: 'Connexion', path: '/auth/login', isButton: true },
]

const NavFooter = {
  links: [
    { label: 'À propos', path: '/about' },
    { label: 'Nos Services', path: '/services' },
    { label: 'Partenaires', path: '/partners' },
    { label: 'Développeurs', path: '/developers' },
  ],
  legal: [
    { label: 'Mentions Légales', path: '/legal/mentions' },
    { label: 'Politique de Confidentialité', path: '/legal/privacy' },
    { label: 'CGU', path: '/legal/terms' },
    { label: 'Centre d\'aide', path: '/support' },
    { label: 'État du système', path: '/status' },
  ]
}

// -- Helper --
const getSocialIcon = (name: string) => {
  switch (name) {
    case 'twitter': return IconBrandTwitter
    case 'linkedin': return IconBrandLinkedin
    case 'github': return IconBrandGithub
    default: return IconBrandTwitter
  }
}

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

<style scoped>
/* Scoped styles if needed */
</style>
