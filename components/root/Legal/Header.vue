<template>
  <div class="text-center space-y-4 animate-fade-up mb-16">
    <span v-if="badge" :class="['badge', `badge-${theme}`]">{{ badge }}</span>
    <h1 class="text-4xl md:text-5xl font-black tracking-tight" v-html="title"></h1>
    <p class="text-lg text-hsa max-w-2xl mx-auto">
      {{ subtitle }}
    </p>
    <p v-if="lastUpdate" class="text-sm text-slate-400">Dernière mise à jour : {{ lastUpdate }}</p>
  </div>
</template>

<script setup lang="ts">
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
