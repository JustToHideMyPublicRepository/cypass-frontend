<template>
  <div class="max-w-7xl mx-auto mb-24 space-y-16">
    <!-- Header/Introduction API -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <h2 class="text-3xl font-black text-BtW">Endpoints de l'API</h2>
      <div class="flex items-center gap-3 bg-ash/30 px-5 py-2 rounded-full border border-ash/50 shadow-inner">
        <span class="text-sm font-bold text-BtW/80">Afficher la facturation unitaire</span>
      </div>
    </div>

    <!-- Modeles / Tarifs de base -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="tier in tiers" :key="tier.slug"
        class="bg-ash/40 backdrop-blur-3xl p-8 rounded-2xl border transition-all duration-300 flex flex-col hover:shadow-lg hover:-translate-y-1"
        :class="[
          tier.featured ? 'border-secondary shadow-secondary/10' : 'border-ash/50 hover:border-primary/30',
          tier.bgClass || 'bg-ash/40'
        ]">

        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <component :is="tier.icon" class="w-10 h-10 p-2 rounded-xl"
              :class="tier.featured ? 'bg-secondary/10 text-secondary' : 'bg-ash text-hsa'" />
            <span v-if="tier.subtitle" class="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              :class="tier.featured ? 'bg-secondary text-BtW' : 'bg-ash/80 text-hsa'">{{ tier.subtitle }}</span>
          </div>
          <h3 class="text-2xl font-black text-BtW">{{ tier.name }}</h3>
          <p class="text-[28px] font-black text-BtW mt-2">{{ tier.price }}</p>
          <p class="text-sm font-medium text-hsa mt-2 opacity-80 h-10">{{ tier.description }}</p>
        </div>

        <div class="space-y-4 mb-8 flex-1">
          <!-- Si la tier a une tarification dégressive -->
          <div v-if="tier.pricing && tier.pricing.length > 0">
            <h4 class="text-xs font-black text-hsa uppercase tracking-widest mb-3 border-b border-ash/10 pb-2">
              Tarification Dégressive</h4>
            <div class="space-y-2">
              <div v-for="(p, i) in tier.pricing" :key="i" class="flex items-center justify-between text-sm">
                <span class="font-bold text-hsa">{{ p.range }}</span>
                <span class="font-black text-BtW">{{ p.unitPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Afficher les features -->
          <ul v-else class="space-y-3 font-medium text-hsa text-sm">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2">
              <IconCircleCheck class="w-5 h-5 text-secondary shrink-0" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div v-if="tier.pricing && tier.pricing.length > 0" class="mb-8 border-t border-ash/10 pt-4">
          <h4 class="text-[10px] font-black text-hsa uppercase tracking-widest mb-3">Inclus dans l'offre</h4>
          <ul class="space-y-2 font-medium text-hsa text-[13px]">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start gap-2">
              <IconCircleCheck class="w-4 h-4 text-secondary/70 shrink-0 mt-0.5" />
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-auto pt-6 border-t border-ash/10">
          <NuxtLink :to="tier.link" class="block w-full text-center py-3 px-4 rounded-xl font-bold transition-all"
            :class="tier.featured ? 'bg-secondary text-BtW hover:bg-secondary/90' : 'bg-BtW text-WtB hover:opacity-90'">
            {{ tier.cta }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Platform Features -->
    <div class="pt-8">
      <h2 class="text-3xl font-black text-BtW mb-8">Tarification des Webhooks & Services</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="bg-ash/40 backdrop-blur-md p-8 rounded-2xl border border-ash/50 flex flex-col h-full">
          <div class="mb-3">
            <IconWebhook class="w-8 h-8 text-secondary mb-4" />
            <h3 class="text-lg font-black text-BtW">Webhooks Réception</h3>
          </div>
          <p class="text-sm text-hsa mb-6 font-medium leading-relaxed flex-1">Recevez les statuts de certification et
            KYC de vos flux de manière asynchrone sur vos propres domaines.</p>
          <div class="mt-auto pt-5 border-t border-ash/10">
            <div class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">Coût par appel</div>
            <div class="text-lg font-black text-BtW">Inclus (<span class="text-sm text-success">Gratuit</span>)</div>
          </div>
        </div>

        <div class="bg-ash/40 backdrop-blur-md p-8 rounded-2xl border border-ash/50 flex flex-col h-full">
          <div class="mb-3">
            <IconUsers class="w-8 h-8 text-primary mb-4" />
            <h3 class="text-lg font-black text-BtW">ActiveDirectory & SSO</h3>
          </div>
          <p class="text-sm text-hsa mb-6 font-medium leading-relaxed flex-1">Synchronisation SCIM/SSO pour gérer les
            accès et automatiser la certification des documents des collaborateurs.</p>
          <div class="mt-auto pt-5 border-t border-ash/10">
            <div class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">Coût de maintenance</div>
            <div class="text-lg font-black text-BtW">50K FCFA / mois</div>
          </div>
        </div>

        <div
          class="bg-ash/40 backdrop-blur-md p-8 rounded-2xl border border-ash/50 flex flex-col h-full bg-gradient-to-br from-ash/40 to-ash/20">
          <div class="mb-3">
            <IconDatabase class="w-8 h-8 text-danger mb-4" />
            <h3 class="text-lg font-black text-BtW">Déploiement Sur-mesure</h3>
          </div>
          <p class="text-sm text-hsa mb-6 font-medium leading-relaxed flex-1">Déploiement exclusif et cloisonnement de
            CYPASS Engine au sein de votre propre infrastructure On-Premise.</p>
          <div class="mt-auto pt-5 border-t border-ash/10">
            <div class="text-[10px] font-black text-hsa uppercase tracking-widest mb-1">Coût par noeud actif</div>
            <div class="text-lg font-black text-BtW">Sur devis</div>
            <NuxtLink to="/contact" class="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:underline">
              Contacter l'équipe commerciale
              <IconArrowRight class="w-4 h-4" />
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCircleCheck, IconWebhook, IconUsers, IconDatabase, IconArrowRight } from '@tabler/icons-vue'
import { apiTiers } from '~/utils/pricing'
const tiers = apiTiers
</script>
