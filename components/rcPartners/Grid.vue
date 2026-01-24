<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-for="(partner, index) in partners" :key="partner.name"
      class="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 animate-fade-up"
      :style="{ animationDelay: `${index * 100}ms` }">
      <div
        class="w-24 h-24 rounded-full bg-ash flex items-center justify-center mb-6 text-2xl font-bold text-hsa border border-ashAct overflow-hidden p-4">
        <template v-if="partner.logo && !erroredLogos.has(partner.name)">
          <img :src="partner.logo" :alt="partner.name" class="w-full h-full object-contain"
            @error="handleImageError(partner.name)" />
        </template>
        <span v-else>{{ partner.initials || partner.name.charAt(0) }}</span>
      </div>
      <h3 class="text-xl font-bold mb-2">{{ partner.name }}</h3>
      <p class="text-sm text-hsa mb-6">{{ partner.role }}</p>
      <UiBaseButton :href="partner.website" target="_blank" variant="secondary" class="text-xs px-4 py-2">Visiter le
        site</UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  partners: any[]
}>()

const erroredLogos = ref(new Set<string>())

const handleImageError = (name: string) => {
  erroredLogos.value.add(name)
}
</script>
