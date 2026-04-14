<template>
  <div class="p-8 text-center animate-fade-in">
    <!-- Icon Container -->
    <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" :class="bgClass">
      <component :is="icon" class="w-8 h-8" :class="iconClass" />
    </div>

    <!-- Content -->
    <h3 class="text-BtW font-bold mb-1">{{ title }}</h3>
    <p class="text-hsa text-sm max-w-[280px] mx-auto leading-relaxed">
      <slot>{{ description }}</slot>
    </p>

    <!-- Optional Query Display -->
    <p v-if="query" class="mt-4 text-xs font-medium text-hsa opacity-60">
      Recherche pour : <span class="text-BtW">"{{ query }}"</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconSearch, IconKeyboard, IconSearchOff } from '@tabler/icons-vue'

const props = defineProps<{
  type: 'welcome' | 'too-short' | 'no-results'
  query?: string
}>()

const icon = computed(() => {
  switch (props.type) {
    case 'welcome': return IconSearch
    case 'too-short': return IconKeyboard
    case 'no-results': return IconSearchOff
    default: return IconSearch
  }
})

const bgClass = computed(() => {
  switch (props.type) {
    case 'welcome': return 'bg-ash/30'
    case 'too-short': return 'bg-primary/10'
    case 'no-results': return 'bg-danger/10'
    default: return 'bg-ash/30'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'welcome': return 'text-hsa'
    case 'too-short': return 'text-primary'
    case 'no-results': return 'text-danger'
    default: return 'text-hsa'
  }
})

const title = computed(() => {
  switch (props.type) {
    case 'welcome': return 'Recherche globale'
    case 'too-short': return 'Continuez à saisir...'
    case 'no-results': return 'Aucun résultat'
    default: return ''
  }
})

const description = computed(() => {
  switch (props.type) {
    case 'welcome': return 'Trouvez instantanément vos documents, alertes et paramètres.'
    case 'too-short': return 'Veuillez saisir au moins 2 caractères pour lancer la recherche.'
    case 'no-results': return 'Nous n\'avons rien trouvé correspondant à votre recherche.'
    default: return ''
  }
})
</script>
