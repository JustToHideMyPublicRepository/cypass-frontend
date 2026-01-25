<template>
  <section class="py-12 border-y border-ash/50 bg-WtB/30 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-bold text-hsa uppercase tracking-[0.2em] mb-8">Partenaires de
        Confiance & Institutionnels</p>
      <div class="relative overflow-hidden md:overflow-visible">
        <div
          class="flex items-center gap-12 md:gap-16 no-scrollbar animate-marquee md:animate-none md:flex-wrap md:justify-center">
          <!-- First set of partners -->
          <template v-for="partner in partners" :key="partner.name">
            <a :href="partner.website" target="_blank"
              class="flex-shrink-0 h-10 md:h-12 w-auto flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110">
              <template v-if="partner.logo && !erroredLogos.has(partner.name)">
                <img :src="partner.logo" :alt="partner.name" class="h-full w-auto object-contain"
                  @error="handleImageError(partner.name)" />
              </template>
              <span v-else
                :class="partner.style || 'text-xl font-bold text-hsa/70 group-hover:text-primary transition-colors'">
                {{ partner.initials || partner.name }}
              </span>
            </a>
          </template>
          <!-- Second set of partners (only visible/used on mobile for marquee loop) -->
          <template v-for="partner in partners" :key="partner.name + '-loop'">
            <a :href="partner.website" target="_blank"
              class="flex-shrink-0 h-10 md:h-12 w-auto flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110 md:hidden">
              <template v-if="partner.logo && !erroredLogos.has(partner.name)">
                <img :src="partner.logo" :alt="partner.name" class="h-full w-auto object-contain"
                  @error="handleImageError(partner.name)" />
              </template>
              <span v-else
                :class="partner.style || 'text-xl font-bold text-hsa/70 group-hover:text-primary transition-colors'">
                {{ partner.initials || partner.name }}
              </span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { partners } from '@/data/partners'

const erroredLogos = ref(new Set<string>())
const handleImageError = (name: string) => {
  erroredLogos.value.add(name)
}
</script>
