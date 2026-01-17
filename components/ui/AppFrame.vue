<template>
  <div class="relative overflow-hidden transition-all duration-300" :class="[
    glass ? 'glass-panel backdrop-blur-md' : 'bg-slate-900 border border-slate-700/50',
    roundedClass,
    shadowClass
  ]">
    <!-- Header / Bar -->
    <div v-if="type !== 'simple'" class="flex items-center gap-2 border-b px-4 py-3" :class="[
      glass ? 'bg-slate-900/90 border-white/10' : 'bg-slate-800 border-slate-700',
      headerClass
    ]">
      <!-- Controls (Traffic Lights) -->
      <div v-if="controls" class="flex gap-2 mr-2">
        <div class="h-3 w-3 rounded-full bg-red-500/80"></div>
        <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
        <div class="h-3 w-3 rounded-full bg-green-500/80"></div>
      </div>

      <!-- Browser Address Bar -->
      <div v-if="type === 'browser' && url"
        class="flex-grow rounded-md bg-white/10 px-3 py-1 text-center text-xs font-code tracking-wide text-slate-300">
        {{ url }}
      </div>

      <!-- Terminal/Card Title -->
      <div v-else-if="title" class="flex-grow text-xs font-bold text-slate-400"
        :class="{ 'font-mono': type === 'terminal', 'uppercase tracking-wider': type === 'card' }">
        {{ title }}
      </div>

      <!-- Extra Header Slot (e.g. for icons) -->
      <div v-if="$slots.headerActions" class="ml-auto">
        <slot name="headerActions" />
      </div>
    </div>

    <!-- Body -->
    <div :class="[bodyBgClass, padding, bodyClass]">
      <slot />
    </div>

    <!-- Decorative Elements (Optional) -->
    <slot name="decorations" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

// Auto-determine background based on type if not glass
const bodyBgClass = computed(() => {
  if (props.glass) return ''

  switch (props.type) {
    case 'browser':
      return 'bg-slate-50 dark:bg-slate-900'
    case 'terminal':
      return 'bg-slate-900 text-slate-300 font-code text-xs'
    case 'card':
    default:
      return 'bg-white dark:bg-slate-900'
  }
})

const roundedClass = computed(() => props.rounded)
const shadowClass = computed(() => props.shadow)
</script>
