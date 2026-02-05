<template>
  <section id="features" class="py-16 md:py-24 relative">
    <!-- Décoration de section -->
    <div class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-r from-primary/5 to-transparent skew-y-6 -z-10">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-40">

      <div v-for="(service, index) in featureServices" :key="service.id"
        class="grid lg:grid-cols-2 gap-12 md:gap-20 items-center group">

        <!-- Contenu Texte -->
        <div :class="['space-y-6 md:space-y-8', index % 2 === 1 ? 'lg:order-1' : 'lg:order-2']" class="animate-fade-up">
          <span class="badge"
            :class="service.status === 'available' ? (service.theme === 'blue' ? 'badge-primary' : 'badge-success') : 'bg-ash text-hsa border-ash'">
            {{ service.status === 'available' ? service.badge : 'Bientôt Disponible' }}
          </span>

          <h2 class="text-3xl md:text-5xl font-bold leading-tight">
            {{ service.title }}<span :class="service.theme === 'blue' ? 'text-primary' : 'text-success'">.</span>
          </h2>

          <h3 class="text-xl md:text-2xl text-hsa font-light">
            {{ service.subtitle }}
          </h3>

          <p class="text-base md:text-lg text-hsa leading-relaxed">
            {{ service.description }}
          </p>

          <!-- Liste des fonctionnalités -->
          <div v-if="service.features" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="feature in service.features" :key="feature.title" class="flex items-start gap-4">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                service.theme === 'blue' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
              ]">
                <component :is="feature.icon" class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-BtW">{{ feature.title }}</h4>
                <p class="text-sm text-hsa mt-1">{{ feature.desc }}</p>
              </div>
            </div>
          </div>

          <ul v-if="service.list" class="space-y-4">
            <li v-for="item in service.list" :key="item" class="flex items-center gap-3">
              <IconCheck :class="['w-5 h-5', service.theme === 'blue' ? 'text-primary' : 'text-success']" />
              <span class="font-medium">{{ item }}</span>
            </li>
          </ul>

          <div class="pt-4">
            <UiBaseButton v-if="service.status === 'available'" :to="`/modules/${service.id}`" variant="secondary"
              class="pl-0 hover:pl-4 transition-all !bg-transparent border-none shadow-none"
              :class="service.theme === 'blue' ? 'text-primary' : 'text-success'">
              {{ service.cta }}
              <IconArrowRight class="w-4 h-4 ml-2" />
            </UiBaseButton>
            <UiBaseButton v-else :to="`/coming-soon?service=${service.id}`" variant="ghost"
              class="text-hsa hover:text-primary">
              Disponible prochainement
            </UiBaseButton>
          </div>
        </div>

        <!-- Contenu Visuel -->
        <div class="relative" :class="index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'">
          <div
            :class="['absolute inset-0 blur-[120px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700', service.theme === 'blue' ? 'bg-primary' : 'bg-success']">
          </div>

          <!-- Visuels des composants -->
          <RootHomeFeaturesDocSentry v-if="service.id === 'docsentry'" />
          <RootHomeFeaturesVigiTech v-else-if="service.id === 'vigitech'" />
          <RootHomeFeaturesSecuScan v-else-if="service.id === 'secuscan'" />
          <RootHomeFeaturesLeakMonitor v-else-if="service.id === 'leakmonitor'" />

          <!-- Image de secours (au cas où) -->
          <img v-else-if="service.image" :src="service.image" :alt="service.title"
            class="rounded-3xl w-full object-cover h-[400px] shadow-2xl"
            :class="{ 'grayscale opacity-60': service.status !== 'available' }" />

          <div v-if="service.status !== 'available'"
            class="absolute inset-0 flex items-center justify-center bg-WtB/50 backdrop-blur-[1px] z-20 rounded-3xl group-hover:bg-WtB/40 transition-colors">
            <NuxtLink :to="`/coming-soon?service=${service.id}`"
              class="px-6 py-3 bg-BtW text-WtB rounded-full font-bold shadow-xl border border-ash hover:scale-105 transition-transform">
              Bientôt Disponible
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconCheck, IconArrowRight } from '@tabler/icons-vue'
import { modules } from '@/data/modules'

const featureServices = computed(() => modules)
</script>
