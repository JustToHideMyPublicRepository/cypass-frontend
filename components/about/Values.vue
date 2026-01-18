<template>
  <section class="py-20 bg-slate-50 dark:bg-slate-900/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Nos Valeurs Fondatrices
        </h2>
        <p class="text-slate-600 dark:text-slate-400">Ce qui guide nos décisions et façonne notre technologie.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="(value, index) in values" :key="value.title"
          class="card p-8 hover:-translate-y-2 transition-transform duration-300 animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-6" :class="value.iconBg">
            <component :is="value.icon" class="w-7 h-7" :class="value.iconColor" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ value.title }}</h3>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ value.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconLock, IconShieldCheck, IconBulb } from '@tabler/icons-vue'

const values = [
  {
    title: 'Souveraineté',
    desc: 'Nous croyons en une indépendance technologique totale. Nos infrastructures et nos données restent sous juridiction nationale.',
    icon: IconLock,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-primary'
  },
  {
    title: 'Confiance',
    desc: 'La transparence est notre devise. Nos algorithmes sont auditables et nos certifications garantissent l\'intégrité de nos services.',
    icon: IconShieldCheck,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-secondary'
  },
  {
    title: 'Innovation',
    desc: 'Nous anticipons les menaces de demain en intégrant l\'IA et l\'automatisation au cœur de nos processus de défense.',
    icon: IconBulb,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600'
  }
]
</script>
