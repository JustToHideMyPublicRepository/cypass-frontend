<template>
    <section class="py-24 relative">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Questions Fréquentes</h2>
                <p class="text-slate-500 dark:text-slate-400">Tout ce que vous devez savoir sur la plateforme CYPASS.
                </p>
            </div>

            <div class="space-y-4">
                <div v-for="(item, index) in faqItems" :key="index"
                    class="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
                    :class="{ 'ring-2 ring-cypass-blue/50': activeIndex === index }" data-aos="fade-up"
                    :data-aos-delay="index * 100">
                    <button @click="toggle(index)"
                        class="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                        <span class="font-bold text-slate-900 dark:text-white text-lg">{{ item.question }}</span>
                        <span class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform duration-300"
                            :class="{ 'rotate-180 bg-cypass-blue text-white': activeIndex === index }">
                            <IconChevronDown class="w-5 h-5" />
                        </span>
                    </button>

                    <div v-show="activeIndex === index"
                        class="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                        {{ item.answer }}
                    </div>
                </div>
            </div>

            <div class="mt-12 text-center">
                <p class="text-slate-500 dark:text-slate-400 mb-4">Vous ne trouvez pas votre réponse ?</p>
                <NuxtLink to="/support" class="text-cypass-blue font-bold hover:underline">Contacter le support dédié
                    &rarr;</NuxtLink>
            </div>

        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronDown } from '@tabler/icons-vue'

const activeIndex = ref<number | null>(0)

const toggle = (index: number) => {
    activeIndex.value = activeIndex.value === index ? null : index
}

const faqItems = [
    {
        question: "CYPASS est-il obligatoire pour toutes les entreprises ?",
        answer: "L'utilisation de CYPASS est fortement recommandée pour les Opérateurs de Services Essentiels (OSE) et les administrations publiques, conformément à la stratégie nationale de cybersécurité. Pour le secteur privé standard, c'est une option premium garantissant la conformité."
    },
    {
        question: "Comment sont sécurisées les signatures numériques ?",
        answer: "Nos signatures utilisent des certificats X.509 conformes aux normes eIDAS et RGS. Chaque signature est horodatée et scellée cryptographiquement, garantissant l'intégrité et la non-répudiation du document."
    },
    {
        question: "Le scan de vulnérabilité impacte-t-il les performances ?",
        answer: "Non. SecuScan est conçu pour effectuer des tests non-intrusifs. Nous adaptons la vitesse des requêtes pour ne jamais perturber la disponibilité de vos services en production."
    },
    {
        question: "Où sont hébergées les données ?",
        answer: "Toutes les données sont hébergées souverainement sur le territoire de la République du Bénin, dans des datacenters certifiés Tier III/IV, garantissant la conformité avec le Code du Numérique."
    }
]
</script>
