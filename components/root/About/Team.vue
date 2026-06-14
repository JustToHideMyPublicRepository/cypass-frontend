<template>
  <section class="py-12 md:py-20 relative overflow-hidden bg-bgClr">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="flex flex-col items-center text-center mb-12 animate-fade-up">
        <span class="badge badge-primary mb-4">L'Équipe CYPASS</span>
        <h3>Des experts dévoués à votre sécurité</h3>
        <p class="max-w-2xl mt-2 text-hsa">
          Une synergie de talents passionnés par la protection de vos actifs numériques et déterminés à façonner un
          cyberespace de confiance.
        </p>
      </div>

      <!-- Team Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
        <div v-for="(member, idx) in team" :key="member.name" class="group relative animate-fade-up" :class="[
          idx < 2 ? 'lg:col-span-3 col-span-1' : 'lg:col-span-2 col-span-1',
          idx === 4 ? 'md:col-span-2 lg:col-span-2 md:max-w-md md:mx-auto w-full' : ''
        ]" :style="{ animationDelay: `${member.delay}ms` }">

          <!-- Container -->
          <UiAppFrame type="card" :title="member.role" :glass="true"
            class="h-full hover:scale-[1.01] transition-all duration-300" padding="p-5">
            <!-- Card Content -->
            <div class="flex flex-col h-full justify-between">
              <!-- Image Container -->
              <div
                class="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-500">
                <img :src="member.image" :alt="member.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105" />

                <!-- Subtle vignette overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500">
                </div>

                <!-- Quote and Socials -->
                <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <p
                    class="text-white font-handwritting text-[12px] max-w-[75%] line-clamp-3 pr-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    "{{ member.quote }}"
                  </p>

                  <!-- Socials -->
                  <div class="flex gap-1.5 ml-auto shrink-0">
                    <a v-for="(social, sIdx) in member.socials" :key="social.name" :href="social.url" target="_blank"
                      rel="noopener noreferrer"
                      class="p-2 bg-ashAct hover:bg-ash text-textClr hover:text-primary rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                      :title="social.name" :style="{ transitionDelay: `${sIdx * 50}ms` }">
                      <component :is="socialIcons[social.name]" class="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Details -->
              <div class="px-1 flex flex-col justify-between flex-grow">
                <h5 class="group-hover:text-primary transition-colors duration-300">
                  {{ member.name }}
                </h5>
              </div>
            </div>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBrandLinkedin, IconBrandX, IconBrandFacebook } from '@tabler/icons-vue'
import { getTeamImageUrl, getLinkedinUrl, getFacebookUrl, getXUrl } from '~/utils/links'

const socialIcons: Record<string, any> = {
  LinkedIn: IconBrandLinkedin,
  Facebook: IconBrandFacebook,
  X: IconBrandX
}

// Membres de l'équipe
const team = [
  {
    name: "Charmaine YEBADOKPO",
    role: "Responsable Sécurité (CISO)",
    image: getTeamImageUrl("CharmaineYebadokpo.png"),
    delay: 200,
    quote: "Anticiper les menaces pour garantir la résilience de vos systèmes.",
    socials: [
      { name: 'LinkedIn', url: getLinkedinUrl("charmaine-a-yebadokpo-586aba1b2") },
      { name: 'Facebook', url: getFacebookUrl("yeb.charme") },
    ]
  },
  {
    name: "Christelle AKIOLA",
    role: "Développeuse front-end",
    image: getTeamImageUrl("ChristelleAkiola.png"),
    delay: 300,
    quote: "Allier esthétique moderne, performance et sécurité de l'interface.",
    socials: [
      { name: 'Facebook', url: getFacebookUrl("naomie.abiodoun") },
    ]
  },
  {
    name: "Elisée ATONDE",
    role: "Responsable Technique (CTO)",
    image: getTeamImageUrl("EliseeAtonde.png"),
    delay: 100,
    quote: "La robustesse technique est la fondation de la confiance numérique.",
    socials: [
      { name: 'LinkedIn', url: getLinkedinUrl("elisée-atonde-7b189a1bb") },
      { name: 'Facebook', url: getFacebookUrl("profile.php?id=100072329951064") },
      { name: 'X', url: getXUrl("elisee_atonde") },
    ]
  },
  {
    name: "Maurice Codjo",
    role: "Product Owner & Dev FullStack",
    image: getTeamImageUrl("MauriceCodjo.png"),
    delay: 400,
    quote: "Traduire les besoins métiers en fonctionnalités intuitives et sécurisées.",
    socials: [
      { name: 'LinkedIn', url: getLinkedinUrl("maurice-codjo-6a82b82a3/") },
      { name: 'Facebook', url: getFacebookUrl("profile.php?id=100070643959821") }
    ]
  },
  {
    name: "Steve Aster AFOVO",
    role: "Responsable Recherche & Développement (R&D)",
    image: getTeamImageUrl("SteveAsterAfovo.png"),
    delay: 0,
    quote: "Innover aujourd'hui pour concevoir les remparts de demain.",
    socials: [
      { name: 'LinkedIn', url: getLinkedinUrl("SteveAsterAfovo") },
      { name: 'Facebook', url: getFacebookUrl("SteveAsterAfovo1") },
      { name: 'X', url: getXUrl("SteveAsterAfovo") },
    ]
  },
]
</script>
