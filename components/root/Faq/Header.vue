<template>
  <section class="pb-10 md:pb-16 text-center relative z-10">
    <div class="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-up">
      <span class="badge badge-primary mb-2 md:mb-4">Support & Documentation</span>
      <h1 class="text-3xl md:text-6xl font-black tracking-tight leading-tight">
        Comment pouvons-nous <br /> <span class="text-primary">vous aider ?</span>
      </h1>

      <!-- Barre de recherche -->
      <div class="max-w-2xl mx-auto relative group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IconSearch class="w-5 h-5 text-hsa/50 group-focus-within:text-primary transition-colors" />
        </div>
        <input ref="searchInput" :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text"
          class="block w-full pl-12 pr-6 md:pr-16 py-3.5 md:py-4 bg-WtB border border-ash rounded-2xl shadow-lg shadow-ash/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm md:text-base"
          placeholder="Rechercher une réponse (ex: mot de passe, API)...">
        <div class="hidden md:flex items-center gap-1 absolute right-4 top-1/2 -translate-y-1/2 px-2">
          <kbd
            class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">CTRL</kbd>
          <span class="text-[10px] text-hsa">+</span>
          <kbd
            class="px-1.5 py-0.5 rounded bg-ash text-[10px] font-bold text-hsa border border-ashAct uppercase">K</kbd>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch } from '@tabler/icons-vue'

defineProps<{
  searchQuery: string
}>()

defineEmits(['update:searchQuery'])

const searchInput = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => searchInput.value?.focus()
})
</script>
