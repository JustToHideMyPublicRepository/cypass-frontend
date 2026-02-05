<template>
  <section class="py-12 md:py-20 bg-bgClr">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-10 md:mb-16 animate-fade-up">
        <h2 class="text-2xl md:text-4xl font-bold text-BtW mb-4">Nos valeurs fondatrices
        </h2>
        <p class="text-sm md:text-base text-hsa">Ce qui guide nos décisions et façonne notre technologie.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 md:gap-8">
        <div v-for="(value, index) in values" :key="value.title"
          class="card p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300 animate-fade-up"
          :style="{ animationDelay: `${index * 100}ms` }">
          <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-6" :class="value.iconBg">
            <component :is="value.icon" class="w-6 h-6 md:w-7 md:h-7" :class="value.iconColor" />
          </div>
          <h3 class="text-lg md:text-xl font-bold text-BtW mb-3">{{ value.title }}</h3>
          <p class="text-sm md:text-base text-hsa leading-relaxed">{{ value.desc }}</p>
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
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    title: 'Confiance',
    desc: 'La transparence est notre devise. Nos algorithmes sont auditables et nos certifications garantissent l\'intégrité de nos services.',
    icon: IconShieldCheck,
    iconBg: 'bg-success/10',
    iconColor: 'text-success'
  },
  {
    title: 'Innovation',
    desc: 'Nous anticipons les menaces de demain en intégrant l\'IA et l\'automatisation au cœur de nos processus de défense.',
    icon: IconBulb,
    iconBg: 'bg-purple-600/10',
    iconColor: 'text-purple-600'
  }
]
</script>
