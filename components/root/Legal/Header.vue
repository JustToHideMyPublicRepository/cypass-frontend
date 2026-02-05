<template>
  <div class="text-center space-y-4 animate-fade-up mb-12 md:mb-16">
    <span v-if="badge" :class="['badge', `badge-${theme}`]">{{ badge }}</span>
    <h1 class="text-3xl md:text-5xl font-black tracking-tight" v-html="title"></h1>
    <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto leading-relaxed">
      {{ subtitle }}
    </p>
    <p v-if="lastUpdate" class="text-[10px] md:text-sm text-slate-400 font-medium uppercase tracking-wider">
      Dernière mise à jour : {{ lastUpdate }}
    </p>
  </div>
</template>

<script setup lang="ts">
// Props du composant Header pour les pages légales
interface Props {
  badge?: string
  theme?: 'primary' | 'success' | 'secondary' | 'danger' | 'warning'
  title: string
  subtitle: string
  lastUpdate?: string
}

withDefaults(defineProps<Props>(), {
  theme: 'primary'
})
</script>
