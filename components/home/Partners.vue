<template>
  <section class="py-12 border-y border-ash/50 bg-WtB/30 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-center text-xs font-bold text-hsa uppercase tracking-[0.2em] mb-8">Partenaires de
        Confiance & Institutionnels</p>
      <div
        class="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <template v-for="partner in partners" :key="partner.name">
          <a :href="partner.website" target="_blank"
            class="h-10 md:h-12 w-auto flex items-center justify-center hover:scale-110 transition-transform">
            <img v-if="partner.logo" :src="partner.logo" :alt="partner.name" class="h-full w-auto object-contain"
              @error="(e) => (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${partner.initials || partner.name}`" />
            <span v-else :class="partner.style || 'text-xl font-bold'">
              {{ partner.initials || partner.name }}
            </span>
          </a>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconShield } from '@tabler/icons-vue'
import { partners } from '@/data/partners'
</script>
