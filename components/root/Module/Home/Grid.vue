<template>
  <div class="grid lg:grid-cols-4 gap-10">
    <div v v-for="(service, index) in services" :key="service.id" class="group perspective-1000 animate-fade-up"
      :style="{ animationDelay: `${index * 150}ms` }">

      <UiAppFrame :type="service.status === 'available' ? (service.id === 'secuscan' ? 'terminal' : 'card') : 'card'"
        :title="service.title" :glass="true" :class="[
          'h-full transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl',
          service.theme === 'blue' ? 'hover:shadow-blue-500/20' : 'hover:shadow-green-500/20'
        ]" :header-class="service.status !== 'available' ? 'opacity-50' : ''">
        <template #headerActions>
          <div v v-if="service.status === 'available'" class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full animate-pulse"
              :class="service.theme === 'blue' ? 'bg-primary' : 'bg-success'"></span>
            <span class="text-[10px] font-bold uppercase tracking-wider"
              :class="service.theme === 'blue' ? 'text-primary' : 'text-success'">Online</span>
          </div>
          <div v-else class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-slate-500"></span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offline</span>
          </div>
        </template>

        <div class="p-1 h-full flex flex-col relative overflow-hidden group-hover:bg-ash/50 transition-colors">
          <!-- Background Gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            :class="service.theme === 'blue' ? 'from-primary to-transparent' : 'from-success to-transparent'">
          </div>

          <!-- Icon & Content -->
          <div class="flex items-start justify-between mb-8 relative z-10">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
              :class="service.theme === 'blue'
                ? 'bg-gradient-to-br from-primary to-secondary shadow-blue-500/30'
                : 'bg-gradient-to-br from-success to-teal-600 shadow-emerald-500/30'">
              <component :is="service.icon" class="w-8 h-8" />
            </div>

            <NuxtLink v-if="service.status === 'available'" :to="`/modules/${service.id}`"
              class="w-10 h-10 rounded-full border border-ash flex items-center justify-center text-slate-400 hover:bg-ash hover:text-primary transition-all">
              <IconArrowRight class="w-5 h-5" />
            </NuxtLink>
          </div>

          <div class="relative z-10 flex-grow">
            <h3 class="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {{ service.title }}
            </h3>
            <p class="text-hsa leading-relaxed text-base mb-6">
              {{ service.description }}
            </p>

            <!-- Mini Specs / Features -->
            <div class="grid grid-cols-2 gap-3 mb-6">
              <div v v-for="spec in service.specs" :key="spec"
                class="flex items-center gap-2 text-xs font-medium text-hsa bg-ash/50 rounded-lg px-2 py-1.5">
                <IconCheck class="w-3 h-3" :class="service.theme === 'blue' ? 'text-primary' : 'text-success'" />
                {{ spec }}
              </div>
            </div>
          </div>

          <!-- Action / Coming Soon -->
          <div class="relative z-10 mt-auto pt-6 border-t border-ash">
            <NuxtLink v v-if="service.status === 'available'" :to="`/modules/${service.id}`">
              <button
                class="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 group-hover:shadow-lg flex items-center justify-center gap-2"
                :class="service.theme === 'blue'
                  ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                  : 'bg-success/10 text-success hover:bg-success hover:text-white'">
                <span>Explorer le module</span>
                <IconArrowRight class="w-4 h-4" />
              </button>
            </NuxtLink>
            <NuxtLink v-else :to="`/coming-soon?service=${service.id}`">
              <button
                class="w-full py-3 rounded-xl bg-ash text-slate-400 font-bold text-sm text-center border border-ash hover:bg-ashAct/10 hover:text-hsa transition-colors">
                Bientôt Disponible
              </button>
            </NuxtLink>
          </div>

        </div>
      </UiAppFrame>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowRight, IconCheck } from '@tabler/icons-vue'

defineProps<{
  services: any[]
}>()
</script>
