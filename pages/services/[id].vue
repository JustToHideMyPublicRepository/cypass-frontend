<template>
  <div class="relative">
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div v-if="service"
        class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        :class="service.theme === 'blue' ? 'bg-blue-500' : 'bg-green-500'">
      </div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]">
      </div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>

    <div v-if="service" class="max-w-7xl mx-auto relative z-10">
      <div class="grid lg:grid-cols-12 gap-12">
        <!-- Left Content -->
        <div class="lg:col-span-7 space-y-12">
          <SvcDetailHeader :service="service" />
          <SvcDetailBenefits :benefits="service.benefits || []" :theme="service.theme" />
          <SvcDetailTechSpecs :specs="service.techSpecs || []" />
        </div>

        <!-- Right Visual (Sticky) -->
        <div class="lg:col-span-5 relative hidden lg:block">
          <div class="sticky top-32">
            <SvcDetailVisual :service="service" />
          </div>
        </div>
      </div>
    </div>

    <!-- 404 State -->
    <SvcDetailNotFound v-else />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { services } from '@/data/services'

const route = useRoute()
const serviceId = route.params.id

const service = computed(() => services.find(s => s.id === serviceId))

definePageMeta({
  layout: 'guest'
})

useHead({
  title: computed(() => service.value?.title || 'Détails du Service')
})
</script>
