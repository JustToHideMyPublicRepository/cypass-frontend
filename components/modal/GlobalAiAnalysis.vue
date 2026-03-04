<template>
  <UiBaseModal :show="aiStore.isModalOpen" title="Analyse documentaire IA" maxWidth="2xl" @close="aiStore.closeModal()">
    <div class="flex flex-col h-[75vh]">
      <!-- Header Info -->
      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4 shrink-0">
        <p class="text-xs text-hsa font-medium leading-relaxed">
          Synthèse stratégique de la page actuelle. Le modèle marqué par une étoile sera votre favori pour l'analyse
          directe.
        </p>
      </div>

      <!-- Scrollable AI List (Reduced Height) -->
      <div class="max-h-48 overflow-y-auto pr-2 space-y-3 no-scrollbar pb-4 border-b border-ash/50 shrink-0">
        <div v-for="ai in aiOptions" :key="ai.name" class="relative group/ai-container">
          <button @click="analyzeWith(ai)"
            class="w-full flex items-center gap-4 p-4 rounded-3xl border-2 transition-all group/ai" :class="[
              aiStore.lastUsedAi === ai.name
                ? 'border-primary bg-primary/5'
                : 'border-ash hover:border-primary/50 hover:bg-ash/30'
            ]">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm overflow-hidden p-2"
              :class="aiStore.lastUsedAi === ai.name ? 'bg-primary' : 'bg-ash group-hover/ai:bg-primary/20'">
              <img :src="ai.logo" :alt="ai.name" class="w-full h-full object-contain"
                :class="{ 'grayscale group-hover/ai:grayscale-0': aiStore.lastUsedAi !== ai.name }">
            </div>
            <div class="flex-grow text-left">
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-BtW group-hover/ai:text-primary transition-colors">{{ ai.name
                }}</span>
                <span v-if="aiStore.lastUsedAi === ai.name"
                  class="text-[9px] font-black uppercase tracking-tighter text-primary bg-primary/10 px-1.5 py-0.5 rounded">Dernier
                  utilisé</span>
              </div>
              <div class="text-[10px] text-hsa font-medium">{{ ai.desc }}</div>
            </div>

            <IconExternalLink
              class="w-4 h-4 text-hsa opacity-0 group-hover/ai:opacity-100 transition-all translate-x-2 group-hover/ai:translate-x-0" />
          </button>

          <!-- Toggle pour préférence -->
          <button @click.stop="togglePreference(ai.name)"
            class="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all"
            :title="aiStore.preferredAi === ai.name ? 'Retirer des favoris' : 'Définir par défaut'"
            :class="aiStore.preferredAi === ai.name ? 'text-warning' : 'text-hsa/20 hover:text-warning/50'">
            <IconStar v-if="aiStore.preferredAi === ai.name" class="w-5 h-5 fill-current" />
            <IconStar v-else class="w-5 h-5" />
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
import { ref, computed } from 'vue'
import {
  IconStar, IconExternalLink, IconCopy, IconCheck,
  IconPencil, IconLink, IconTag, IconSettings as IconSettingsSmall
} from '@tabler/icons-vue'
import { useAiAnalysisStore } from '~/stores/aiAnalysis'
import { useToastStore } from '~/stores/toast'
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

const pageTitle = computed(() => document.title || 'Page CYPASS')
const pageUrl = computed(() => window.location.href)
const routeName = computed(() => route.name?.toString() || 'Inconnue')

const generatedPrompt = computed(() => {
  return aiStore.getGeneratedPrompt(
    pageTitle.value,
    pageUrl.value,
    routeName.value
  )
})

const analyzeWith = (ai: any) => {
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
