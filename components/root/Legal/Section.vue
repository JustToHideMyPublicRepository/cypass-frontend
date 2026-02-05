<template>
  <section :id="id" class="glass-panel p-6 md:p-10 rounded-3xl border border-ash/50 overflow-hidden"
    :class="{ 'bg-success/5': type === 'success', 'bg-ash/20': type === 'muted' }">
    <h2 v-if="title" class="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
      <span v-if="index"
        class="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg"
        :class="indexClass">
        {{ index }}
      </span>
      <span class="flex-1">{{ title }}</span>
    </h2>
    <div class="prose prose-slate max-w-none text-sm md:text-base leading-relaxed">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props du composant Section pour l'affichage du contenu légal
interface Props {
  id: string
  title?: string
  index?: number | string
  type?: 'default' | 'success' | 'muted'
  theme?: 'primary' | 'success' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  theme: 'primary'
})

// Détermination de la couleur de l'index selon le thème choisi
const indexClass = computed(() => {
  if (props.theme === 'success') return 'bg-success/10 text-success'
  if (props.theme === 'secondary') return 'bg-secondary/10 text-secondary'
  return 'bg-primary/10 text-primary'
})
</script>
