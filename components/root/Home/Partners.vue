<template>
  <section class="py-12 border-y border-ash/50 bg-WtB/30 backdrop-blur-sm overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <p class="text-center text-xs font-bold text-hsa uppercase tracking-[0.2em]">Partenaires de
        Confiance & Institutionnels</p>
    </div>

    <div class="relative">
      <div class="flex items-center gap-12 md:gap-24 animate-scroll whitespace-nowrap px-4 hover:pause-scroll">
        <!-- Double the list for seamless loop -->
        <template v-for="i in 2" :key="i">
          <template v-for="partner in partners" :key="partner.name + i">
            <a :href="partner.website" target="_blank" :title="partner.name"
              class="inline-flex flex-shrink-0 h-10 md:h-12 w-auto items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-110">
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
        </template>
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

<style scoped>
.animate-scroll {
  display: flex;
  width: max-content;
  animation: scroll 40s linear infinite;
}

.hover\:pause-scroll:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    /* 
       We translate by half since we doubled the content. 
       This ensures the list loops perfectly.
    */
    transform: translateX(-50%);
  }
}

/* Hide scrollbar but allow functional scrolling just in case */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
