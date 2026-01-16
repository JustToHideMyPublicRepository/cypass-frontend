<template>
  <footer class="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        <!-- Brand Column -->
        <div class="space-y-6">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-cypass-blue to-cypass-green flex items-center justify-center text-white font-bold text-lg shadow-lg">
              C</div>
            <span class="text-2xl font-bold text-slate-900 dark:text-white">CYPASS</span>
          </NuxtLink>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Infrastructure nationale de confiance numérique. Nous sécurisons l'avenir numérique du Bénin avec des
            technologies de pointe.
          </p>
          <div class="flex gap-3">
            <a v-for="social in ['twitter', 'linkedin', 'github']" :key="social" href="#"
              class="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:bg-cypass-blue hover:border-cypass-blue transition-all duration-300">
              <component :is="getSocialIcon(social)" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Links Column 1 -->
        <div>
          <h4 class="text-slate-900 dark:text-white font-bold mb-6">Plateforme</h4>
          <ul class="space-y-3">
            <li v-for="link in NavFooter.links" :key="link.label">
              <NuxtLink :to="link.path"
                class="text-slate-500 dark:text-slate-400 hover:text-cypass-blue dark:hover:text-cypass-green text-sm transition-colors flex items-center gap-2 group">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-cypass-blue transition-colors"></span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Links Column 2 -->
        <div>
          <h4 class="text-slate-900 dark:text-white font-bold mb-6">Ressources</h4>
          <ul class="space-y-3">
            <li v-for="link in NavFooter.legal" :key="link.label">
              <NuxtLink :to="link.path"
                class="text-slate-500 dark:text-slate-400 hover:text-cypass-blue dark:hover:text-cypass-green text-sm transition-colors flex items-center gap-2 group">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-cypass-blue transition-colors"></span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter / Badge (Refined) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h4 class="text-slate-900 dark:text-white font-bold mb-2">Sécurité Certifiée</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Audité et validé par l'ASIN Bénin pour la conformité aux normes de sécurité nationales.
          </p>
          <div
            class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
            <IconShieldCheck class="w-8 h-8 text-green-600" />
            <div>
              <div class="text-xs font-bold text-green-800 dark:text-green-300">CONFORME</div>
              <div class="text-[10px] text-green-600 dark:text-green-400">RÉFÉRENTIEL GÉNÉRAL</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom Footer -->
      <div
        class="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-col md:flex-row items-center gap-2 md:gap-8">
          <p class="text-sm text-slate-500 dark:text-slate-500">
            &copy; {{ new Date().getFullYear() }} CYPASS. Tous droits réservés.
          </p>
        </div>

        <div class="flex items-center gap-2 opacity-70">
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">République du Bénin</span>
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

const NavFooter = {
  links: [
    { label: 'À propos', path: '/about' },
    { label: 'Nos Services', path: '/services' },
    { label: 'Partenaires', path: '/partners' },
    { label: 'Développeurs', path: '/developers' },
    { label: 'FAQ', path: '/faq' },
  ],
  legal: [
    { label: 'Mentions Légales', path: '/legal/mentions' },
    { label: 'Politique de Confidentialité', path: '/legal/privacy' },
    { label: 'CGU', path: '/legal/terms' },
    { label: 'Centre d\'aide', path: '/support' },
    { label: 'État du système', path: '/status' },
  ]
}

// -- Helper --
const getSocialIcon = (name: string) => {
  switch (name) {
    case 'twitter': return IconBrandX
    case 'linkedin': return IconBrandLinkedin
    case 'github': return IconBrandGithub
    default: return IconGlobe
  }
}
</script>
