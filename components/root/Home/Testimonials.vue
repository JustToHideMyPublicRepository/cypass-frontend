<template>
  <section class="py-16 md:py-24 relative overflow-hidden bg-bgClr">
    <!-- Élément de décoration -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ash to-transparent">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center mb-10 md:mb-16 animate-fade-up">
        <span class="badge badge-success mb-4">Confiance Accordée</span>
        <h2 class="text-2xl md:text-5xl font-black tracking-tight mb-4">
          Ils sécurisent leur avenir avec <span class="text-primary">CYPASS</span>
        </h2>
        <p class="text-base md:text-lg text-hsa max-w-2xl mx-auto">
          Des institutions publiques aux leaders du secteur privé, découvrez ceux qui nous font confiance pour leur
          souveraineté numérique.
        </p>
      </div>

      <!-- Conteneur de grille -->
      <div class="relative">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(testimonial, index) in testimonials" :key="index"
            class="glass-panel p-6 md:p-8 rounded-2xl relative group hover:scale-[1.01] transition-transform duration-300 border border-ash/50 animate-fade-up"
            :style="{ animationDelay: `${index * 150}ms` }">

            <!-- Icône de citation -->
            <div
              class="absolute top-6 right-8 text-6xl font-serif text-primary opacity-50 group-hover:text-primary/20 transition-colors">
              ”</div>

            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-full bg-ash flex items-center justify-center font-bold text-lg text-primary overflow-hidden border border-ashAct">
                <img v-if="testimonial.avatar" :src="testimonial.avatar" :alt="testimonial.author"
                  class="w-full h-full object-cover" />
                <span v-else>{{ testimonial.initials }}</span>
              </div>
              <div>
                <div class="font-bold text-BtW">{{ testimonial.author }}</div>
                <div class="text-xs text-hsa uppercase tracking-wide font-bold">{{ testimonial.role }}</div>
              </div>
            </div>

            <p class="text-hsa leading-relaxed italic relative z-10">
              "{{ testimonial.quote }}"
            </p>

            <div class="mt-6 flex items-center gap-2 text-xs font-bold text-BtW uppercase tracking-wider">
              <component :is="testimonial.icon" class="w-4 h-4" />
              {{ testimonial.organization }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconBuildingBank, IconBuildingSkyscraper, IconShieldCheck, IconServer, IconBuildingHospital } from '@tabler/icons-vue'

interface Testimonial {
  initials: string
  author: string
  role: string
  quote: string
  organization: string
  icon: any
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    initials: 'AD',
    author: 'Alain Dossou',
    role: 'DSI, Ministère du Numérique',
    quote: 'CYPASS nous a permis d\'accélérer la dématérialisation de nos procédures administratives tout en garantissant une conformité totale avec le Code du Numérique.',
    organization: 'Gouvernement',
    icon: IconBuildingSkyscraper
  },
  {
    initials: 'SK',
    author: 'Sarah Kouton',
    role: 'CISO, Banque Atlantique',
    quote: 'La solution DocSentry est la seule sur le marché à offrir ce niveau de garantie juridique pour nos signatures électroniques. Indispensable pour notre secteur.',
    organization: 'Secteur Bancaire',
    icon: IconBuildingBank
  },
  {
    initials: 'JP',
    author: 'Jean-Paul Agbo',
    role: 'Directeur Technique, InnovTech',
    quote: 'Avec VigiTech, nous avons une visibilité en temps réel sur les menaces émergentes. C\'est comme avoir une équipe SOC dédiée, mais mutualisée.',
    organization: 'Technologie',
    icon: IconServer
  }
]
</script>
