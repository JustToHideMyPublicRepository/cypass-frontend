<template>
    <section id="features" class="py-32 relative">
        <!-- Section Decor -->
        <div
            class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-r from-cypass-blue/5 to-transparent skew-y-6 -z-10">
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-40">

            <!-- Feature 1 -->
            <div class="grid lg:grid-cols-2 gap-20 items-center group">
                <div class="order-2 lg:order-1 relative">
                    <div
                        class="absolute inset-0 bg-blue-500 blur-[120px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700">
                    </div>
                    <div
                        class="glass-panel rounded-3xl p-3 transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
                            alt="SecuScan" class="rounded-2xl w-full object-cover h-[400px] shadow-inner" />

                        <!-- Floating UI Element -->
                        <div
                            class="absolute top-8 left-[-20px] bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-2 animate-float">
                            <div class="flex items-center justify-between gap-8 mb-2">
                                <span class="text-xs font-bold text-slate-400 uppercase">Vulnérabilités</span>
                                <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            </div>
                            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden w-48">
                                <div class="bg-red-500 w-[75%] h-full rounded-full"></div>
                            </div>
                            <div class="text-xs font-mono text-red-500 mt-1">3 Critiques détectées</div>
                        </div>
                    </div>
                </div>

                <div class="order-1 lg:order-2 space-y-8" data-aos="fade-up">
                    <span class="badge badge-blue">Audit Automatisé</span>
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        SecuScan<span class="text-cypass-blue">.</span>
                    </h2>
                    <h3 class="text-2xl text-slate-500 dark:text-slate-400 font-light">
                        Anticipez les menaces avant l'impact.
                    </h3>
                    <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        Notre moteur d'analyse de nouvelle génération scanne en continu votre périmètre exposé.
                        Détection des failles OWASP Top 10, mauvaises configurations et certificats expirés.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-cypass-blue flex-shrink-0">
                                <IconBug class="w-5 h-5" />
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Scan Pentest</h4>
                                <p class="text-sm text-slate-500 mt-1">Simulation d'attaques réelles</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <div
                                class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-cypass-blue flex-shrink-0">
                                <IconFileReport class="w-5 h-5" />
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">Rapports PDF</h4>
                                <p class="text-sm text-slate-500 mt-1">Détaillés et actionnables</p>
                            </div>
                        </div>
                    </div>

                    <button class="btn btn-ghost text-cypass-blue pl-0 hover:pl-4 transition-all">
                        En savoir plus sur SecuScan
                        <IconArrowRight class="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>

            <!-- Feature 2 -->
            <div class="grid lg:grid-cols-2 gap-20 items-center group">
                <div class="space-y-8" data-aos="fade-up">
                    <span class="badge badge-green">Confiance Numérique</span>
                    <h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        DocSentry<span class="text-cypass-green">.</span>
                    </h2>
                    <h3 class="text-2xl text-slate-500 dark:text-slate-400 font-light">
                        La preuve par la cryptographie.
                    </h3>
                    <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        Infrastructure de clés publiques (PKI) souveraine pour la signature et la vérification de
                        documents officiels. Garantissez l'authenticité de chaque acte administratif.
                    </p>

                    <ul class="space-y-4">
                        <li v-for="item in ['Conformité eIDAS & RGS', 'Timestamping qualifié', 'Archivage à valeur probante']"
                            :key="item" class="flex items-center gap-3">
                            <IconCheck class="w-5 h-5 text-cypass-green" />
                            <span class="text-slate-700 dark:text-slate-200 font-medium">{{ item }}</span>
                        </li>
                    </ul>

                    <button class="btn btn-ghost text-cypass-green pl-0 hover:pl-4 transition-all">
                        Découvrir l'API de signature
                        <IconArrowRight class="w-4 h-4 ml-2" />
                    </button>
                </div>

                <div class="relative">
                    <div
                        class="absolute inset-0 bg-green-500 blur-[120px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700">
                    </div>
                    <div
                        class="glass-panel rounded-3xl p-8 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center transform hover:-translate-y-2 transition-transform duration-500">
                        <!-- Background Pattern -->
                        <div
                            class="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_1px,transparent_10px)]">
                        </div>

                        <div
                            class="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                            <div class="h-2 bg-gradient-to-r from-cypass-green to-emerald-400"></div>
                            <div class="p-8">
                                <div
                                    class="w-20 h-20 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-cypass-green mb-6 relative">
                                    <IconCertificate class="w-10 h-10 relative z-10" />
                                    <div
                                        class="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20">
                                    </div>
                                </div>
                                <h4 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">Certifié
                                    Conforme</h4>
                                <p class="text-xs text-slate-500 mb-6 uppercase tracking-wider">République du Bénin</p>

                                <div
                                    class="space-y-3 text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
                                    <div class="flex justify-between">
                                        <span>Signataire:</span>
                                        <span class="font-bold">DG Trésor</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Date:</span>
                                        <span>{{ new Date().toLocaleDateString() }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Hash:</span>
                                        <span class="text-cypass-green truncate w-20">a7f9...9b2</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="bg-slate-50 dark:bg-slate-800/50 p-3 border-t border-slate-100 dark:border-slate-800">
                                <div class="flex items-center justify-center gap-2 text-cypass-green text-sm font-bold">
                                    <IconShieldCheck class="w-4 h-4" /> Signature Valide
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    IconCheck,
    IconArrowRight,
    IconBug,
    IconFileReport,
    IconCertificate,
    IconShieldCheck
} from '@tabler/icons-vue'
</script>
