<template>
  <UiBaseModal :show="aiStore.isModalOpen" title="Analyse documentaire IA" maxWidth="2xl" @close="aiStore.closeModal()">
    <div class="flex flex-col h-[75vh]">
      <!-- Header Info -->
      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4 shrink-0">
        <p class="text-xs text-hsa font-medium leading-relaxed">
          Synthèse stratégique de la page actuelle. Le modèle marqué par une étoile sera votre favori pour l'analyses
          directe.
        </p>
      </div>

      <!-- Scrollable AI List (Optimized Grid) -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 shrink-0 md:overflow-visible overflow-y-auto max-h-40 md:max-h-none no-scrollbar">
        <div v-for="ai in aiOptions" :key="ai.name" class="relative group/ai-container">
          <button @click="analyzeWith(ai)"
            class="w-full flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group/ai h-full"
            :class="[
              aiStore.lastUsedAi === ai.name
                ? 'border-primary bg-primary/5'
                : 'border-ash hover:border-primary/30 hover:bg-ash/20'
            ]">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm overflow-hidden p-1.5"
              :class="aiStore.lastUsedAi === ai.name ? 'bg-primary' : 'bg-ash/50 group-hover/ai:bg-primary/10'">
              <img :src="ai.logo" :alt="ai.name" class="w-full h-full object-contain"
                :class="{ 'grayscale group-hover/ai:grayscale-0': aiStore.lastUsedAi !== ai.name }">
            </div>

            <div class="text-center">
              <div class="flex flex-col items-center gap-0.5">
                <div class="flex items-center gap-1">
                  <span
                    class="text-[11px] font-black text-BtW group-hover/ai:text-primary transition-colors leading-tight">{{
                      ai.name }}</span>
                  <UiAppTooltip :content="ai.desc" :title="ai.name" widthClass="w-48" />
                </div>
                <span v-if="aiStore.lastUsedAi === ai.name"
                  class="text-[7px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-1 py-0.2 rounded">Dernier
                  utilisé</span>
              </div>
            </div>
          </button>

          <!-- Toggle pour préférence (Overlay on top right) -->
          <button @click.stop="togglePreference(ai.name)"
            class="absolute right-1.5 top-1.5 p-1.5 rounded-lg transition-all z-10"
            :title="aiStore.preferredAi === ai.name ? 'Retirer des favoris' : 'Définir par défaut'"
            :class="aiStore.preferredAi === ai.name ? 'text-warning bg-warning/10' : 'text-hsa/20 hover:text-warning/50 hover:bg-ash/50'">
            <IconStar v-if="aiStore.preferredAi === ai.name" class="w-3.5 h-3.5 fill-current" />
            <IconStar v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Prompt Preview Area (Expanded) -->
      <div class="pt-4 flex-grow flex flex-col min-h-0 bg-WtB z-10 border-t border-ash">
        <div class="flex items-center justify-between mb-3 px-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-hsa/60 flex items-center gap-2">
              <IconPencil class="w-3 h-3" /> Personnaliser le prompt
            </span>
            <button @click="aiStore.isSettingsOpen = true"
              class="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-ash transition-all shadow-sm"
              title="Modifier les instructions">
              <IconSettingsSmall class="w-3 h-3" />
            </button>
          </div>

          <button @click="copyPrompt"
            class="text-[10px] font-black flex items-center gap-1.5 transition-all px-2 py-1 rounded-md"
            :class="copied ? 'text-success bg-success/10' : 'text-primary hover:underline'">
            <IconCheck v-if="copied" class="w-3 h-3" />
            <IconCopy v-else class="w-3 h-3" />
            {{ copied ? 'Copié !' : 'Copier' }}
          </button>
        </div>

        <div class="space-y-3 flex-grow flex flex-col min-h-0">
          <!-- Metadata (Compressed) -->
          <div
            class="p-2 bg-ash/30 rounded-xl text-[9px] text-hsa/60 font-mono flex items-center gap-4 overflow-hidden whitespace-nowrap shrink-0">
            <div class="flex items-center gap-1.5 min-w-0">
              <IconLink class="w-3 h-3 shrink-0" /> <span class="truncate">{{ pageUrl }}</span>
            </div>
            <div class="flex items-center gap-1.5 min-w-0 italic">
              <IconTag class="w-3 h-3 shrink-0" /> <span class="truncate">{{ pageTitle }}</span>
            </div>
          </div>

          <!-- Prompt Content Block -->
          <div
            class="flex-grow bg-ash/10 rounded-2xl p-4 text-[10px] leading-relaxed text-BtW font-medium overflow-y-auto no-scrollbar border border-dashed border-ashAct/50">
            <div class="space-y-4">
              <div class="opacity-60 border-l-2 border-primary/20 pl-3">
                <p class="whitespace-pre-wrap">{{ aiStore.customRole }}</p>
              </div>
              <div class="space-y-2">
                <p class="whitespace-pre-wrap">{{ aiStore.customObjective }}</p>
                <p class="whitespace-pre-wrap">{{ aiStore.customWork }}</p>
                <p class="whitespace-pre-wrap italic opacity-80">{{ aiStore.customConstraints }}</p>
              </div>
              <div class="pt-4 border-t border-ash/50 text-hsa italic">
                <p class="whitespace-pre-wrap">{{ aiStore.customFormat }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { IconStar, IconCopy, IconCheck, IconPencil, IconLink, IconTag, IconSettings as IconSettingsSmall } from '@tabler/icons-vue'
import { useAiAnalysisStore } from '~/stores/front/aiAnalysis'
import { useToastStore } from '~/stores/front/toast'
import { useRoute } from 'vue-router'

const aiStore = useAiAnalysisStore()
const toastStore = useToastStore()
const route = useRoute()

const copied = ref(false)

const aiOptions = [
  {
    name: 'ChatGPT',
    desc: 'L\'expert polyvalent d\'OpenAI',
    logo: 'https://cdn-icons-png.flaticon.com/256/16459/16459818.png',
    url: 'https://chatgpt.com/?q='
  },
  {
    name: 'Claude',
    desc: 'L\'analyste précis d\'Anthropic',
    logo: 'https://cdn.simpleicons.org/claude/D97757',
    url: 'https://claude.ai/new?q='
  },
  {
    name: 'Perplexity',
    desc: 'Recherche et synthèse en temps réel',
    logo: 'https://cdn.simpleicons.org/perplexity/20B2AA',
    url: 'https://www.perplexity.ai/?q='
  }
]

const pageTitle = ref('')
const pageUrl = ref('')
const routeName = ref('')

const refreshContext = () => {
  pageTitle.value = document.title || 'Page CYPASS'
  pageUrl.value = window.location.href
  routeName.value = route.name?.toString() || 'Inconnue'
}

// Refresh when modal opens
watch(() => aiStore.isModalOpen, (newVal) => {
  if (newVal) {
    refreshContext()
  }
}, { immediate: true })

// Also refresh on route changes if modal is open
watch(() => route.fullPath, () => {
  if (aiStore.isModalOpen) {
    refreshContext()
  }
})

const generatedPrompt = computed(() => {
  return aiStore.getGeneratedPrompt(
    pageTitle.value,
    pageUrl.value,
    routeName.value
  )
})

const analyzeWith = (ai: any) => {
  refreshContext() // Final check before sending
  aiStore.triggerAiAnalysis(ai.name, generatedPrompt.value)
}

const togglePreference = (name: string) => {
  if (aiStore.preferredAi === name) {
    aiStore.setPreferredAi(null)
  } else {
    aiStore.setPreferredAi(name)
  }
}

const copyPrompt = () => {
  navigator.clipboard.writeText(generatedPrompt.value)
  copied.value = true
  toastStore.showToast('success', 'Prompt copié', 'Le prompt a été copié avec succès.')

  setTimeout(() => {
    copied.value = false
  }, 3000)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
