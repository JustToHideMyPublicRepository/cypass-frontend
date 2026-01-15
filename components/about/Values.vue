<template>
    <section class="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Nos Valeurs Fondatrices
                </h2>
                <p class="text-slate-600 dark:text-slate-400">Ce qui guide nos décisions et façonne notre technologie.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Value 1 -->
                <div class="card p-8 hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up"
                    data-aos-delay="0">
                    <div
                        class="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-cypass-blue flex items-center justify-center mb-6">
                        <IconLock class="w-7 h-7" />
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Souveraineté</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Nous croyons en une indépendance technologique totale. Nos infrastructures et nos données
                        restent sous juridiction nationale.
                    </p>
                </div>

                <!-- Value 2 -->
                <div class="card p-8 hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up"
                    data-aos-delay="100">
                    <div
                        class="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 text-cypass-green flex items-center justify-center mb-6">
                        <IconShieldCheck class="w-7 h-7" />
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Confiance</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        La transparence est notre devise. Nos algorithmes sont auditables et nos certifications
                        garantissent l'intégrité de nos services.
                    </p>
                </div>

                <!-- Value 3 -->
                <div class="card p-8 hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up"
                    data-aos-delay="200">
                    <div
                        class="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-6">
                        <IconBulb class="w-7 h-7" />
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">Innovation</h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Nous anticipons les menaces de demain en intégrant l'IA et l'automatisation au cœur de nos
                        processus de défense.
                    </p>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup lang="ts">
import { IconLock, IconShieldCheck, IconBulb } from '@tabler/icons-vue'
</script>
