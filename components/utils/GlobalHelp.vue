<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[60]">
      <!-- Trigger Button -->
      <UiBaseButton @click.stop="store.toggleHelp()" variant="ghost"
        class="!rounded-full !bg-primary !text-ash shadow-2xl shadow-primary/40 !flex !items-center !justify-center hover:scale-110 active:scale-95 transition-all duration-300 group !p-2 !h-auto !w-auto">
        <IconHelp v-if="!store.isHelpOpen" class="w-6 h-6" />
        <IconX v-else class="w-6 h-6" />

        <!-- Pulse Effect -->
        <span class="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none"></span>
      </UiBaseButton>

      <!-- Overlay Menu -->
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0 translate-y-4"
        enter-to-class="transform scale-100 opacity-100 translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100 translate-y-0"
        leave-to-class="transform scale-95 opacity-0 translate-y-4">
        <div v-if="store.isHelpOpen"
          class="absolute bottom-full right-0 mb-4 w-72 bg-WtB border border-ash rounded-3xl shadow-2xl overflow-hidden p-2">
          <div class="p-4 border-b border-ash mb-2">
            <h3 class="font-black text-BtW tracking-tight">Centre d'aide</h3>
            <p class="text-xs text-hsa">Besoin d'un coup de main ?</p>
          </div>

          <div class="space-y-1">
            <NuxtLink v-for="link in helpLinks" :key="link.path" :to="link.path"
              :target="link.external ? '_blank' : undefined" @click="store.isHelpOpen = false"
              class="flex items-center gap-3 p-3 rounded-2xl hover:bg-ash transition-all group/item">
              <div
                class="w-10 h-10 rounded-xl bg-ash flex items-center justify-center text-hsa group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                <component :is="link.icon" class="w-4 h-4" />
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
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { IconHelp, IconX, IconLifebuoy, IconStatusChange, IconKeyboard, IconBrandWhatsapp } from '@tabler/icons-vue'
import { useShortcutsStore } from '~/stores/shortcuts'

const store = useShortcutsStore()

// Track when the menu was last opened to ignore immediate clicks
let lastOpenedAt = 0

watch(() => store.isHelpOpen, (isOpen) => {
  if (isOpen) {
    lastOpenedAt = Date.now()
  }
})

const helpLinks = [
  {
    label: 'Support WhatsApp',
    desc: 'Réponse rapide par message',
    path: 'https://wa.me/2290166523639?text=Bonjour%20CYPASS%2C%20j%27aimerais%20avoir%20de%20l%27aide',
    icon: IconBrandWhatsapp,
    external: true
  },
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
    path: '/shortcuts',
    icon: IconKeyboard
  },
]

// Close on outside click (with debounce to prevent immediate close after keyboard toggle)
const handleClickOutside = (e: MouseEvent) => {
  // Ignore clicks within 100ms of opening (keyboard toggle)
  if (Date.now() - lastOpenedAt < 100) return

  const el = e.target as HTMLElement
  if (!el.closest('.fixed.bottom-6.right-6')) {
    store.isHelpOpen = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
