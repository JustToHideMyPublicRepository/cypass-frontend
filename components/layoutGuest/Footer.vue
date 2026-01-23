<template>
  <footer class="bg-bgClr border-t border-ash pt-16 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        <!-- Brand Column -->
        <div class="space-y-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-xl bg-WtB flex items-center justify-center shadow-lg overflow-hidden p-0.5">
              <img src="/img/logo.png" alt="Logo CYPASS" class="w-full h-full object-contain" />
            </div>
            <span class="text-2xl font-bold text-BtW">CYPASS</span>
          </NuxtLink>
          <p class="text-hsa leading-relaxed text-sm">
            Infrastructure nationale de confiance numérique. Nous sécurisons l'avenir numérique du Bénin avec des
            technologies de pointe.
          </p>
          <div class="flex gap-3">
            <a v-for="social in socialLinks" :key="social" href="#"
              class="w-10 h-10 rounded-full bg-WtB border border-ash flex items-center justify-center text-hsa hover:text-white hover:bg-primary hover:border-primary transition-all duration-300">
              <component :is="getSocialIcon(social)" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div v-for="(group, index) in footerGroups" :key="index">
          <h4 class="font-bold mb-6">{{ group.title }}</h4>
          <ul class="space-y-3">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink :to="link.path" v-tooltip="getLinkTooltip(link.path)"
                class="text-hsa hover:text-primary transition-colors flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 rounded-full bg-ashAct group-hover:bg-primary transition-colors"></span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Badge (Refined) -->
        <div class="bg-WtB rounded-2xl p-6 border border-ash shadow-sm">
          <h4 class="font-bold mb-2">Sécurité Certifiée</h4>
          <p class="text-xs text-hsa mb-4">
            Audité et validé par l'ASIN Bénin pour la conformité aux normes de sécurité nationales.
          </p>
          <div class="flex items-center gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
            <IconShieldCheck class="w-8 h-8 text-success" />
            <div>
              <div class="text-xs font-bold text-success">CONFORME</div>
              <div class="text-[10px] text-success/80">RÉFÉRENTIEL GÉNÉRAL</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-ash pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-col md:flex-row items-center gap-2 md:gap-8">
          <p class="text-sm text-hsa">
            &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
          </p>
        </div>

        <div class="flex items-center gap-2 opacity-70">
          <span class="text-[10px] font-bold tracking-widest text-hsa uppercase">République du Bénin</span>
          <img src="https://flagcdn.com/w40/bj.png" alt="Flag of Benin" class="h-4 rounded shadow-sm opacity-80" />
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import {
  IconBrandX, IconBrandLinkedin, IconBrandGithub, IconShieldCheck, IconGlobe
} from '@tabler/icons-vue'
import { getLinkTooltip } from '~/data/shortcuts'

const socialLinks = ['twitter', 'linkedin', 'github']

const footerGroups = [
  {
    title: 'Plateforme',
    links: [
      { label: 'À propos', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Partenaires', path: '/partners' },
      { label: 'Développeurs', path: '/developers' },
      { label: 'FAQ', path: '/faq' },
    ]
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Mentions Légales', path: '/legal/mentions' },
      { label: 'Confidentialité', path: '/legal/privacy' },
      { label: 'CGU', path: '/legal/terms' },
      { label: 'Centre d\'aide', path: '/support' },
      { label: 'État du système', path: '/status' },
    ]
  }
]


// Helper
const getSocialIcon = (name: string) => {
  switch (name) {
    case 'twitter': return IconBrandX
    case 'linkedin': return IconBrandLinkedin
    case 'github': return IconBrandGithub
    default: return IconGlobe
  }
}
</script>
