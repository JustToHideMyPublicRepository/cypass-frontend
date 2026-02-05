<template>
  <div class="relative">
    <div v-if="service" class="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
      <UiBreadcrumbs :items="[
        { label: 'Services', path: '/modules' },
        { label: service.title }
      ]" class="mb-8 md:mb-12" />
      <div class="grid lg:grid-cols-12 gap-8 md:gap-12">
        <!-- Contenu de Gauche -->
        <div class="lg:col-span-7 space-y-8 md:space-y-12">
          <RootModuleDetailHeader :service="service" />
          <RootModuleDetailBenefits :benefits="service.benefits || []" :theme="service.theme" />
          <RootModuleDetailTechSpecs :specs="service.techSpecs || []" />
        </div>

        <!-- Visuel de Droite (Fixe sur Desktop, sous le contenu sur Mobile) -->
        <div class="lg:col-span-12 lg:hidden mt-8">
          <RootModuleDetailVisual :service="service" />
        </div>
        <div class="lg:col-span-5 relative hidden lg:block">
          <div class="sticky top-32">
            <RootModuleDetailVisual :service="service" />
          </div>
        </div>
      </div>
    </div>

    <!-- État 404 -->
    <RootModuleDetailNotFound v-else />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { modules } from '@/data/modules'

const route = useRoute()
const serviceId = route.params.id

const service = computed(() => modules.find(s => s.id === serviceId))

definePageMeta({
  layout: 'guest'
})

useHead({
  title: computed(() => service.value?.title || 'Détails du Service')
})
</script>
