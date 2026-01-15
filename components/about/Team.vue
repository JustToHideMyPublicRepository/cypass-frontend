<template>
  <section class="py-20 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" data-aos="fade-up">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">L'Équipe CYPASS</h2>
          <p class="text-slate-600 dark:text-slate-400 max-w-xl">Des experts passionnés par la sécurité et
            déterminés à faire la différence.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="member in team" :key="member.name" class="group relative" data-aos="fade-up"
          :data-aos-delay="member.delay">
          <div
            class="absolute inset-0 bg-blue-500/10 rounded-2xl rotate-3 scale-95 group-hover:rotate-0 group-hover:scale-100 transition-all duration-300">
          </div>
          <div class="glass-panel p-4 rounded-2xl relative bg-white dark:bg-slate-900">
            <div class="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative">
              <img :src="member.image" :alt="member.name"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div class="flex gap-2">
                  <a href="#"
                    class="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors text-white">
                    <IconBrandLinkedin class="w-4 h-4" />
                  </a>
                  <a href="#"
                    class="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors text-white">
                    <IconBrandX class="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white text-lg">{{ member.name }}</h3>
            <p class="text-cypass-blue text-sm font-medium mb-2">{{ member.role }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { IconArrowRight, IconBrandLinkedin, IconBrandX } from '@tabler/icons-vue'

const team = [
  {
    name: "Charmaine YEBADOKPO",
    role: "Responsable Sécurité (CISO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Charmaine.png",
    delay: 0
  },
  {
    name: "Elisée ATONDE",
    role: "Responsable Technique (CTO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Elysee.png",
    delay: 100
  },
  {
    name: "Christelle AKIOLA",
    role: "Développeuse fronten-end",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Christelle.png",
    delay: 200
  },
  {
    name: "Steve Aster AFOVO",
    role: "Responsable Financier et Administratif (CFO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/SteveAster.png",
    delay: 300
  }
]
</script>
