<template>
  <section class="py-20 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-fade-up">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-BtW mb-2">L'Équipe CYPASS</h2>
          <p class="text-hsa max-w-xl">Des experts passionnés par la sécurité et
            déterminés à faire la différence.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="member in team" :key="member.name" class="group relative animate-fade-up"
          :style="{ animationDelay: `${member.delay}ms` }">
          <UiAppFrame type="card" :title="member.role" :glass="true" class="h-full">
            <template #headerActions>
              <div class="flex gap-2">
                <div class="w-2 h-2 rounded-full bg-primary/50"></div>
                <div class="w-2 h-2 rounded-full bg-ashAct"></div>
              </div>
            </template>
            <div class="p-4 relative">
              <div class="aspect-[4/5] rounded-xl overflow-hidden mb-4 relative">
                <img :src="member.image" :alt="member.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div class="flex gap-2">
                    <a v-for="social in member.socials" :key="social.name" :href="social.url"
                      class="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm transition-colors text-white"
                      :title="social.name">
                      <component :is="social.icon" class="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-BtW text-lg">{{ member.name }}</h3>
              <!-- Role is now in the frame title, maybe duplicative? -->
              <!-- The user asked to use AppFrame like in developers.vue which uses type="terminal" mostly or card. -->
              <!-- Let's keep the content clean inside. -->
            </div>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBrandLinkedin, IconBrandX, IconBrandFacebook } from '@tabler/icons-vue'

const team = [
  {
    name: "Charmaine YEBADOKPO",
    role: "Responsable Sécurité (CISO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Charmaine.png",
    delay: 0,
    socials: [
      {
        name: 'LinkedIn',
        icon: IconBrandLinkedin,
        url: '#'
      },
      {
        name: 'Facebook',
        icon: IconBrandFacebook,
        url: '#'
      }
    ]
  },
  {
    name: "Elisée ATONDE",
    role: "Responsable Technique (CTO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Elysee.png",
    delay: 100,
    socials: [
      {
        name: 'LinkedIn',
        icon: IconBrandLinkedin,
        url: '#'
      },
      {
        name: 'Facebook',
        icon: IconBrandFacebook,
        url: '#'
      }
    ]
  },
  {
    name: "Christelle AKIOLA",
    role: "Développeuse fronten-end",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/Christelle.png",
    delay: 200,
    socials: [
      {
        name: 'LinkedIn',
        icon: IconBrandLinkedin,
        url: '#'
      },
      {
        name: 'Facebook',
        icon: IconBrandFacebook,
        url: '#'
      }
    ]
  },
  {
    name: "Steve Aster AFOVO",
    role: "Responsable Financier et Administratif (CFO)",
    image: "https://cdn.jsdelivr.net/gh/progestionsoft/Files/_General/Images/Team/SteveAster.png",
    delay: 300,
    socials: [
      {
        name: 'LinkedIn',
        icon: IconBrandLinkedin,
        url: '#'
      },
      {
        name: 'Facebook',
        icon: IconBrandFacebook,
        url: '#'
      },
      {
        name: 'X',
        icon: IconBrandX,
        url: '#'
      }
    ]
  }
]
</script>
