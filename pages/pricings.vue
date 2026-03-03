<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <!-- Decorative Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

    <div class="text-center space-y-4 mb-20 animate-fade-in">
      <h1 class="text-4xl md:text-6xl font-black text-BtW tracking-tight">
        Une protection <span class="text-gradient-primary">sans compromis</span>
      </h1>
      <p class="text-base md:text-xl text-hsa max-w-2xl mx-auto font-bold opacity-80 leading-relaxed">
        Sécurisez votre identité numérique et vos documents avec des solutions adaptées à vos besoins, de l'usage
        personnel aux infrastructures critiques.
      </p>
    </div>

    <!-- Pricing Tiers Grid -->
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
      <div v-for="(tier, index) in tiers" :key="tier.name"
        class="group relative bg-ash/40 backdrop-blur-3xl p-8 rounded-[3rem] border-2 transition-all duration-700 hover:scale-[1.02] flex flex-col h-full"
        :class="tier.featured ? 'border-primary/40 shadow-[0_40px_100px_rgba(var(--primary-rgb),0.15)] ring-1 ring-primary/20' : 'border-ash/50 hover:border-primary/30'">

        <div v-if="tier.featured"
          class="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-WtB px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
          Recommandé
        </div>

        <div class="space-y-6 flex-1">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-primary" :class="tier.bgClass">
              <component :is="tier.icon" class="w-7 h-7" />
            </div>
            <div>
              <h3 class="text-xl font-black text-BtW">{{ tier.name }}</h3>
              <p class="text-[10px] font-black text-hsa uppercase tracking-widest">{{ tier.subtitle }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-ash/10">
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-black text-BtW">{{ tier.price }}</span>
            </div>
            <p class="text-xs text-hsa mt-2 leading-relaxed font-medium opacity-70">{{ tier.description }}</p>
          </div>

          <ul class="space-y-4 pt-6">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-3">
              <IconCircleCheck class="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
              <span class="text-sm font-bold text-BtW/90 leading-snug">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-10">
          <UiBaseButton :variant="tier.featured ? 'primary' : 'secondary'"
            class="!w-full !rounded-[2rem] !py-5 !text-xs !font-black uppercase tracking-[0.2em]">
            {{ tier.cta }}
          </UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Comparison Table -->
    <div class="bg-ash/20 backdrop-blur-xl rounded-[4rem] border border-ash/50 overflow-hidden animate-fade-up">
      <div class="p-8 md:p-12">
        <h2 class="text-2xl font-black text-BtW mb-10 flex items-center gap-4">
          <div class="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <IconLayoutBoard class="w-6 h-6" />
          </div>
          Comparez les fonctionnalités
        </h2>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-ash/10">
                <th class="py-6 pr-4 text-[10px] font-black text-hsa uppercase tracking-[0.2em] w-[40%]">Solution</th>
                <th v-for="t in tiers" :key="t.name"
                  class="py-6 px-4 text-[10px] font-black text-center uppercase tracking-[0.2em]"
                  :class="t.featured ? 'text-primary' : 'text-hsa'">
                  {{ t.name }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ash/5">
              <tr v-for="row in comparison" :key="row.feature" class="group hover:bg-ash/5 transition-colors">
                <td class="py-6 pr-4">
                  <p class="text-sm font-bold text-BtW">{{ row.feature }}</p>
                </td>
                <td class="py-6 px-4 text-center">
                  <IconCircleCheck v-if="row.basic" class="w-5 h-5 text-primary/40 mx-auto" />
                  <span v-else class="text-hsa/30">—</span>
                </td>
                <td class="py-6 px-4 text-center">
                  <IconCircleCheck v-if="row.starter" class="w-5 h-5 text-primary/70 mx-auto" />
                  <span v-else class="text-hsa/30">—</span>
                </td>
                <td class="py-6 px-4 text-center">
                  <IconCircleCheck v-if="row.business" class="w-5 h-5 text-primary mx-auto" />
                  <span v-else class="text-hsa/30">—</span>
                </td>
                <td class="py-6 pl-4 text-center">
                  <IconCircleCheck v-if="row.ent" class="w-5 h-5 text-primary mx-auto" />
                  <span v-else class="text-hsa/30">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUser, IconBriefcase, IconBuildingSkyscraper, IconCircleCheck, IconLayoutBoard, IconActivity } from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})

const tiers = [
  {
    name: 'Individuel',
    subtitle: 'Gratuit',
    price: '0 FCFA',
    description: 'Protection essentielle pour découvrir CYPASS et sécuriser vos premiers documents.',
    icon: IconUser,
    bgClass: 'bg-primary/5',
    features: [
      '5 crédits de certification offerts',
      'Accès VigiTech Community',
      'Signalement d\'incidents',
      'Profil public certifié',
      'Vérification QR Camera'
    ],
    cta: 'Démarrer gratuitement',
    featured: false
  },
  {
    name: 'Pack Starter',
    subtitle: '100 crédits',
    price: '10.000 FCFA',
    description: 'Idéal pour les consultants et indépendants ayant un flux régulier de documents.',
    icon: IconBriefcase,
    bgClass: 'bg-secondary/5',
    features: [
      '100 certifications CYPASS',
      'Prix : 100 FCFA / unité',
      'Validité illimitée des crédits',
      'Rapports de sécurité hebdo',
      'Badges de confiance Pro',
      'Support prioritaire (e-mail)'
    ],
    cta: 'Acheter le pack',
    featured: true
  },
  {
    name: 'Pack Business',
    subtitle: '500 crédits',
    price: '40.000 FCFA',
    description: 'Conçu pour les TPE/PME souhaitant une gestion de confiance à grande échelle.',
    icon: IconBuildingSkyscraper,
    bgClass: 'bg-danger/5',
    features: [
      '500 certifications CYPASS',
      'Prix : 80 FCFA / unité',
      'Validité illimitée des crédits',
      'Tableau de bord premium',
      'Support prioritaire (WhatsApp)',
      'Accès API limité'
    ],
    cta: 'Acheter le pack',
    featured: false
  },
  {
    name: 'Entreprise',
    subtitle: 'Sur mesure',
    price: 'Contact',
    description: 'Infrastructure dédiée et volume illimité pour les grandes institutions.',
    icon: IconActivity,
    bgClass: 'bg-primary/10',
    features: [
      'Volume de crédits illimité',
      'Accès complet API & SDK',
      'Intégration Marque Blanche',
      'Formation cybersécurité',
      'SLA Garanti 99.9%',
      'Account Manager dédié'
    ],
    cta: 'Contacter le service',
    featured: false
  }
]

const comparison = [
  {
    feature: 'Certification DocSentry',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Vérification QR Camera',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Accès VigiTech Community',
    basic: true,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Badges de Confiance',
    basic: false,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Rapports hebdomadaires',
    basic: false,
    starter: true,
    business: true,
    ent: true
  },
  {
    feature: 'Support Prioritaire',
    basic: false,
    starter: false,
    business: true,
    ent: true
  },
  {
    feature: 'Accès API Document',
    basic: false,
    starter: false,
    business: true,
    ent: true
  },
  { feature: 'Intégration Marque Blanche', basic: false, starter: false, business: false, ent: true }
]

useHead({
  title: 'Packs et Tarifs de Certification'
})
</script>

<style scoped>
.text-gradient-primary {
  color: rgb(var(--color-primary));
  background-image: linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-secondary)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
</style>
