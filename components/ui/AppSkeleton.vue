<template>
  <!-- Conteneur principal du Skeleton -->
  <div :class="[
    'bg-ash relative overflow-hidden',
    animated ? 'animate-pulse' : '',
    typeClasses[type],
    customClass
  ]" :style="style">
    <!-- Effet de balayage -->
    <div v-if="animated"
      class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ash/20 to-transparent shimmer animate-shimmer">
    </div>

    <!-- Éléments récursifs si count > 1 -->
    <template v-if="count > 1">
      <div v-for="i in count" :key="i" :class="[
        'bg-ash/80 relative overflow-hidden mb-2 last:mb-0',
        typeClasses[type],
      ]" :style="style"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Interface des propriétés du Skeleton
interface Props {
  type?: 'text' | 'avatar' | 'rect' | 'heading' | 'card' | 'table-row' | 'circle'
  width?: string
  height?: string
  radius?: string
  count?: number
  animated?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'rect',
  count: 1,
  animated: true,
  class: ''
})

const customClass = computed(() => props.class)

// Classes de styles prédéfinies selon le type
const typeClasses = {
  text: 'h-4 w-full rounded',
  avatar: 'h-12 w-12 rounded-full shrink-0',
  rect: 'rounded-xl',
  heading: 'h-8 w-1/2 rounded-lg',
  card: 'h-32 w-full rounded-2xl',
  'table-row': 'h-16 w-full rounded-lg',
  circle: 'rounded-full'
}

// Calcul dynamique des styles inline
const style = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  if (props.radius) s.borderRadius = props.radius
  return s
})
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
