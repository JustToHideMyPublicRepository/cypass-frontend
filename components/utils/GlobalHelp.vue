<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[60]">
      <!-- Bouton de déclenchement -->
      <UiBaseButton @click.stop="store.toggleHelp()" variant="ghost"
        class="!rounded-full !bg-primary !text-ash shadow-2xl shadow-primary/40 !flex !items-center !justify-center hover:scale-110 active:scale-95 transition-all duration-300 group !p-2 !h-auto !w-auto">
        <IconHelp v-if="!store.isHelpOpen" class="w-6 h-6" />
        <IconX v-else class="w-6 h-6" />

        <!-- Effet de pulsation -->
        <span class="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 pointer-events-none"></span>
      </UiBaseButton>

      <!-- Menu flottant d'aide -->
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

          <!-- Liste des liens d'aide -->
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

            <!-- Bouton IA -->
            <div class="relative group/ia-wrap mt-2">
              <button @click="handleAiClick"
                class="w-full flex items-center gap-3 p-3 rounded-2xl transition-all group/ia border border-dashed"
                :class="aiAnalysisStore.preferredAi ? 'border-primary/40 bg-primary/5 hover:bg-primary/10' : 'border-primary/20 hover:bg-primary/10'">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm"
                  :class="aiAnalysisStore.preferredAi ? 'bg-primary text-ash' : 'bg-primary/10 text-primary group-hover/ia:bg-primary group-hover/ia:text-ash'">
                  <IconSparkles class="w-4 h-4" />
                </div>
                <div class="text-left flex-grow">
                  <div class="text-sm font-black text-BtW group-hover/ia:text-primary transition-colors">
                    Analyse IA <span v-if="aiAnalysisStore.preferredAi" class="text-[10px] opacity-60 font-medium">({{
                      aiAnalysisStore.preferredAi }})</span>
                  </div>
                  <div class="text-[10px] text-hsa italic">{{ aiAnalysisStore.preferredAi ? 'Lancer l\'analyse directe'
                    :
                    'Analyser cette page avec l\'IA' }}</div>
                </div>
              </button>

              <!-- Reset Preference -->
              <button v-if="aiAnalysisStore.preferredAi" @click.stop="aiAnalysisStore.setPreferredAi(null)"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-ash/50 text-hsa hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover/ia-wrap:opacity-100 shadow-sm"
                title="Réinitialiser la préférence IA">
                <IconRotate class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Section Raccourcis -->
          <div class="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
            <span class="text-xs font-medium text-primary">Raccourcis</span>
            <kbd class="kbd-hint">?</kbd>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import {
  IconHelp, IconX, IconLifebuoy, IconStatusChange,
  IconKeyboard, IconBrandWhatsapp, IconSparkles, IconRotate
} from '@tabler/icons-vue'
import { useShortcutsStore } from '~/stores/front/shortcuts'
import { useAiAnalysisStore } from '~/stores/front/aiAnalysis'
import { useRoute } from 'vue-router'

const store = useShortcutsStore()
const aiAnalysisStore = useAiAnalysisStore()
const route = useRoute()

const handleAiClick = () => {
  if (aiAnalysisStore.preferredAi) {
    const prompt = aiAnalysisStore.getGeneratedPrompt(
      document.title || 'Page CYPASS',
      window.location.href,
      route.name?.toString() || 'Inconnue'
    )
    aiAnalysisStore.triggerAiAnalysis(aiAnalysisStore.preferredAi, prompt)
  } else {
    aiAnalysisStore.openModal()
  }
  store.isHelpOpen = false
}

// Horodatage de l'ouverture pour éviter les fermetures immédiates
let lastOpenedAt = 0

watch(() => store.isHelpOpen, (isOpen) => {
  if (isOpen) {
    lastOpenedAt = Date.now()
  }
})

// Définition des liens d'assistance
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
    path: '/system/status',
    icon: IconStatusChange
  },
  {
    label: 'Raccourcis clavier',
    desc: 'Naviguez plus vite',
    path: '/system/shortcuts',
    icon: IconKeyboard
  },
]

// Gestion du clic à l'extérieur pour fermer le menu
const handleClickOutside = (e: MouseEvent) => {
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
