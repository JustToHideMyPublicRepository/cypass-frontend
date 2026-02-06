<template>
  <div class="relative overflow-hidden transition-all duration-300 group/frame" :class="[
    glass ? 'glass-panel backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]' : 'bg-slate-900 border border-slate-800', roundedClass, shadowClass, 'hover:border-primary/30'
  ]">
    <!-- Effet de brillance au survol -->
    <div v-if="glass"
      class="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover/frame:opacity-100 transition-opacity duration-700 pointer-events-none">
    </div>
    <!-- En-tête / Barre supérieure -->
    <div v-if="type !== 'simple'" class="relative flex items-center gap-2 border-b px-4 py-3 z-10" :class="[glass ? 'bg-slate-900/90 border-white/10' : 'bg-slate-800 border-ashAct',
      headerClass
    ]">
      <!-- Contrôles de fenêtre (Style macOS) -->
      <div v-if="controls" class="flex gap-2 mr-2">
        <div class="h-3 w-3 rounded-full bg-success"></div>
        <div class="h-3 w-3 rounded-full bg-warning"></div>
        <div class="h-3 w-3 rounded-full bg-danger"></div>
      </div>

      <!-- Barre d'adresse (Style Navigateur) -->
      <div v-if="type === 'browser' && url"
        class="flex-grow rounded-md bg-white/10 px-3 py-1 text-center text-xs font-code tracking-wide text-slate-300">
        {{ url }}
      </div>

      <!-- Titre du Terminal ou de la Carte -->
      <div v-else-if="title" class="flex-grow text-xs font-bold text-slate-400"
        :class="{ 'font-code': type === 'terminal', 'uppercase tracking-wider': type === 'card' }">
        {{ title }}
      </div>

      <!-- Actions supplémentaires dans l'en-tête -->
      <div v-if="$slots.headerActions" class="ml-auto">
        <slot name="headerActions" />
      </div>
    </div>

    <!-- Corps du composant -->
    <div :class="[bodyBgClass, padding, bodyClass]">
      <slot />
    </div>

    <!-- Éléments décoratifs optionnels -->
    <slot name="decorations" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Interface des propriétés du composant
interface Props {
  type?: 'browser' | 'terminal' | 'card' | 'simple'
  title?: string
  url?: string
  controls?: boolean
  glass?: boolean
  padding?: string
  headerClass?: string
  bodyClass?: string
  rounded?: string
  shadow?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'card',
  title: '',
  url: '',
  controls: true,
  glass: false,
  padding: 'p-4',
  headerClass: '',
  bodyClass: '',
  rounded: 'rounded-2xl',
  shadow: 'shadow-2xl'
})

// Détermination dynamique de l'arrière-plan selon le type
const bodyBgClass = computed(() => {
  if (props.glass) return ''

  switch (props.type) {
    case 'browser':
      return 'bg-ash'
    case 'terminal':
      return 'bg-slate-900 text-slate-300 font-code text-xs'
    case 'card':
    default:
      return 'bg-WtB'
  }
})

const roundedClass = computed(() => props.rounded)
const shadowClass = computed(() => props.shadow)
</script>
