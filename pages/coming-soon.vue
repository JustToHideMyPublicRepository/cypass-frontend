<template>
  <div class="min-h-screen bg-bgClr flex flex-col items-center justify-center p-4">
    <div class="max-w-2xl w-full text-center space-y-8 animate-fade-up">

      <!-- Theme Toggle (Fixed relative to column) -->
      <div class="absolute top-6 right-6 z-30">
        <UiThemeToggle />
      </div>
      <!-- Icon & Status -->
      <div class="relative inline-block">
        <div class="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
          <component :is="serviceIcon" class="w-12 h-12" />
        </div>
        <div
          class="absolute -top-2 -right-2 px-3 py-1 bg-BtW text-WtB text-xs font-bold rounded-full shadow-lg border border-ash">
          Jalon #1
        </div>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-BtW">
          {{ serviceTitle }}<span class="text-primary">.</span>
        </h1>
        <p class="text-xl text-hsa font-light max-w-lg mx-auto leading-relaxed">
          {{ serviceDescription }}
        </p>
      </div>

      <!-- Visual Placeholder -->
      <div class="bg-WtB rounded-2xl border border-ash p-8 shadow-xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        <div class="relative z-10 flex flex-col items-center gap-6">
          <div class="flex gap-2">
            <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full bg-textClr animate-ping"
              :style="{ animationDelay: `${i * 200}ms` }"></div>
          </div>
          <div class="space-y-2 text-center">
            <div class="text-sm font-bold text-BtW uppercase tracking-widest">Phase de Développement</div>
            <div class="text-xs text-hsa">Status: Intégration des protocoles de sécurité</div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <template v-if="!authStore.user">
          <UiBaseButton to="/" variant="primary">
            Retour à l'accueil
          </UiBaseButton>
        </template>
        <template v-else>
          <UiBaseButton to="/dashboard" variant="primary">
            Retour au Dashboard
          </UiBaseButton>
        </template>

        <UiBaseButton to="/modules" variant="secondary">
          Voir les services actifs
        </UiBaseButton>
      </div>

      <p class="text-[10px] text-hsa uppercase tracking-[0.2em] font-bold opacity-50">
        Infrastructure Nationale de Confiance • République du Bénin
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { modules } from '@/data/modules'
import { IconRocket } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: false
})

const route = useRoute()
const authStore = useAuthStore()
const serviceId = computed(() => route.query.service as string)

const currentService = computed(() => modules.find(s => s.id === serviceId.value))

const serviceTitle = computed(() => currentService.value?.title || 'Prochainement')
const serviceDescription = computed(() => currentService.value?.description || "Nous préparons quelque chose d'exceptionnel pour renforcer votre sécurité numérique.")
const serviceIcon = computed(() => currentService.value?.icon || IconRocket)
</script>
