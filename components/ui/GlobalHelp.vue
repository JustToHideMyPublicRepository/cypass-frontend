<template>
  <div class="fixed bottom-6 right-6 z-[60]">
    <!-- Trigger Button -->
    <button @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full bg-primary text-ash shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group">
      <IconHelp v-if="!isOpen" class="w-7 h-7" />
      <IconX v-else class="w-7 h-7" />

      <!-- Pulse Effect -->
      <span class="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none"></span>
    </button>

    <!-- Overlay Menu -->
    <Transition enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-4">
      <div v-if="isOpen"
        class="absolute bottom-full right-0 mb-4 w-72 bg-WtB/90 backdrop-blur-xl border border-ash rounded-3xl shadow-2xl overflow-hidden p-2">
        <div class="p-4 border-b border-ash mb-2">
          <h3 class="font-black text-BtW tracking-tight">Centre d'Aide</h3>
          <p class="text-xs text-hsa">Besoin d'un coup de main ?</p>
        </div>

        <div class="space-y-1">
          <NuxtLink v-for="link in helpLinks" :key="link.path" :to="link.path" @click="isOpen = false"
            class="flex items-center gap-3 p-3 rounded-2xl hover:bg-ash transition-all group/item">
            <div
              class="w-10 h-10 rounded-xl bg-ash flex items-center justify-center text-hsa group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
              <component :is="link.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-sm font-bold text-BtW group-hover/item:text-primary transition-colors">{{ link.label }}
              </div>
              <div class="text-[10px] text-hsa">{{ link.desc }}</div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-4 p-4 bg-ash/30 rounded-2xl border border-ash Act flex items-center justify-between">
          <span class="text-xs font-medium text-hsa">Raccourcis</span>
          <kbd class="px-2 py-1 rounded bg-BtW text-WtB text-[10px] font-black shadow-sm">?</kbd>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { IconHelp, IconX, IconLifebuoy, IconStatusChange, IconKeyboard, IconBook } from '@tabler/icons-vue'

const isOpen = ref(false)

const helpLinks = [
  {
    label: 'Support & Aide',
    desc: 'Contactez notre assistance',
    path: '/support',
    icon: IconLifebuoy
  },
  {
    label: 'État du système',
    desc: 'Disponibilité des services',
    path: '/status',
    icon: IconStatusChange
  },
  {
    label: 'Raccourcis Clavier',
    desc: 'Naviguez plus vite',
    path: '/help/shortcuts',
    icon: IconKeyboard
  },
  {
    label: 'Documentation',
    desc: 'Guides et tutoriels',
    path: '/docs', icon: IconBook
  },
]

// Close on outside click
const handleClickOutside = (e: MouseEvent) => {
  const el = e.target as HTMLElement
  if (!el.closest('.fixed.bottom-6.right-6')) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
