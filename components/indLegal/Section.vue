<template>
  <section :id="id" class="glass-panel p-8 md:p-10 rounded-3xl border border-ash/50"
    :class="{ 'bg-success/5': type === 'success', 'bg-ash/20': type === 'muted' }">
    <h2 v-if="title" class="text-2xl font-bold mb-6 flex items-center gap-3">
      <span v v-if="index" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" :class="indexClass">
        {{ index }}
      </span>
      {{ title }}
    </h2>
    <div class="prose prose-slate max-w-none">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

const indexClass = computed(() => {
  if (props.theme === 'success') return 'bg-success/10 text-success'
  if (props.theme === 'secondary') return 'bg-secondary/10 text-secondary'
  return 'bg-primary/10 text-primary'
})
</script>
