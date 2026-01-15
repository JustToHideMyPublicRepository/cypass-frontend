<template>
    <section id="features" class="py-32 relative">
        <!-- Section Decor -->
        <div
            class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-r from-cypass-blue/5 to-transparent skew-y-6 -z-10">
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-40">

            <div v-for="(service, index) in featureServices" :key="service.id"
                class="grid lg:grid-cols-2 gap-20 items-center group">

                <!-- Text Content -->
                <div :class="['space-y-8', index % 2 === 1 ? 'lg:order-1' : 'lg:order-2']" class="animate-fade-up">
                    <span class="badge"
                        :class="service.status === 'available' ? (service.theme === 'blue' ? 'badge-blue' : 'badge-green') : 'bg-slate-100 text-slate-500 border-slate-200'">
                        {{ service.status === 'available' ? service.badge : 'Bientôt Disponible' }}
                    </span>

                    <h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        {{ service.title }}<span
                            :class="`text-cypass-${service.theme === 'blue' ? 'blue' : 'green'}`">.</span>
                    </h2>

                    <h3 class="text-2xl text-slate-500 dark:text-slate-400 font-light">
                        {{ service.subtitle }}
                    </h3>

                    <p class="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        {{ service.description }}
                    </p>

                    <!-- Features List -->
                    <div v-if="service.features" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="feature in service.features" :key="feature.title" class="flex items-start gap-4">
                            <div
                                :class="`w-10 h-10 rounded-lg bg-${service.theme === 'blue' ? 'blue' : 'green'}-50 dark:bg-${service.theme === 'blue' ? 'blue' : 'green'}-900/20 flex items-center justify-center text-cypass-${service.theme === 'blue' ? 'blue' : 'green'} flex-shrink-0`">
                                <component :is="feature.icon" class="w-5 h-5" />
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 dark:text-white">{{ feature.title }}</h4>
                                <p class="text-sm text-slate-500 mt-1">{{ feature.desc }}</p>
                            </div>
                        </div>
                    </div>

                    <ul v-if="service.list" class="space-y-4">
                        <li v-for="item in service.list" :key="item" class="flex items-center gap-3">
                            <IconCheck :class="`w-5 h-5 text-cypass-${service.theme === 'blue' ? 'blue' : 'green'}`" />
                            <span class="text-slate-700 dark:text-slate-200 font-medium">{{ item }}</span>
                        </li>
                    </ul>

                    <div class="pt-4">
                        <NuxtLink v-if="service.status === 'available'" :to="`/services/${service.id}`">
                            <button
                                :class="`btn btn-ghost text-cypass-${service.theme === 'blue' ? 'blue' : 'green'} pl-0 hover:pl-4 transition-all`">
                                {{ service.cta }}
                                <IconArrowRight class="w-4 h-4 ml-2" />
                            </button>
                        </NuxtLink>
                        <button v-else disabled class="btn btn-ghost text-slate-400 pl-0 cursor-not-allowed">
                            Disponible prochainement
                        </button>
                    </div>
                </div>

                <!-- Visual Content -->
                <div class="relative" :class="index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'">
                    <div
                        :class="`absolute inset-0 bg-${service.theme === 'blue' ? 'blue' : 'green'}-500 blur-[120px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700`">
                    </div>

                    <div
                        class="glass-panel rounded-3xl p-3 transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1 relative overflow-hidden">
                        <!-- Image or Composition based on Service ID -->
                        <img v-if="service.image" :src="service.image" :alt="service.title"
                            class="rounded-2xl w-full object-cover h-[400px] shadow-inner"
                            :class="{ 'grayscale opacity-60': service.status !== 'available' }" />

                        <!-- Use DocSentry Composition (from original code) for DocSentry -->
                        <div v-if="service.id === 'docsentry'"
                            class="p-4 min-h-[400px] flex items-center justify-center">
                            <!-- Reusing the DocSentry visual composition -->
                            <div
                                class="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                <div class="h-2 bg-gradient-to-r from-cypass-green to-emerald-400"></div>
                                <div class="p-8 text-center">
                                    <div
                                        class="w-20 h-20 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-cypass-green mb-6 relative">
                                        <IconCertificate class="w-10 h-10 relative z-10" />
                                        <div
                                            class="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20">
                                        </div>
                                    </div>
                                    <h4 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        Certifié Conforme</h4>
                                    <p class="text-xs text-slate-500 mb-6 uppercase tracking-wider">République du Bénin
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Coming Soon Overlay -->
                        <div v-if="service.status !== 'available'"
                            class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-20">
                            <span class="px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-xl">Bientôt
                                Disponible</span>
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
    IconShieldCheck,
    IconRadar2,
    IconEye
} from '@tabler/icons-vue'

const featureServices = [
    {
        id: 'docsentry',
        title: 'DocSentry',
        subtitle: 'La preuve par la cryptographie.',
        description: 'Infrastructure de clés publiques (PKI) souveraine pour la signature et la vérification de documents officiels. Garantissez l\'authenticité de chaque acte administratif.',
        badge: 'Confiance Numérique',
        theme: 'green',
        status: 'available',
        cta: 'Découvrir l\'API de signature',
        list: ['Conformité eIDAS & RGS', 'Timestamping qualifié', 'Archivage à valeur probante']
    },
    {
        id: 'vigitech',
        title: 'VigiTech',
        subtitle: 'Réseau d\'alerte communautaire.',
        description: 'Une plateforme collaborative pour le signalement et la gestion des incidents de cybersécurité. Protégez votre communauté en temps réel.',
        badge: 'Veille & Alerte',
        theme: 'green', // Using green as secondary theme
        status: 'available',
        cta: 'Rejoindre le réseau',
        features: [
            { title: 'Signalement Anonyme', desc: 'Déclarez les incidents en toute sécurité.', icon: IconRadar2 },
            { title: 'Alertes Ciblées', desc: 'Recevez uniquement ce qui vous concerne.', icon: IconShieldCheck }
        ],
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'secuscan',
        title: 'SecuScan',
        subtitle: 'Anticipez les menaces avant l\'impact.',
        description: 'Notre moteur d\'analyse de nouvelle génération scanne en continu votre périmètre exposé. Détection des failles OWASP Top 10.',
        badge: 'Audit Automatisé',
        theme: 'blue',
        status: 'coming_soon',
        cta: 'En savoir plus',
        features: [
            { title: 'Scan Pentest', desc: 'Simulation d\'attaques réelles', icon: IconBug },
            { title: 'Rapports PDF', desc: 'Détaillés et actionnables', icon: IconFileReport }
        ],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: 'leakmonitor',
        title: 'LeakMonitor',
        subtitle: 'Surveillance des données sensibles.',
        description: 'Détection proactive des fuites de données et traçabilité des accès aux documents sensibles au sein de votre organisation.',
        badge: 'Protection des Données',
        theme: 'blue',
        status: 'coming_soon',
        cta: 'En savoir plus',
        features: [
            { title: 'Traçabilité', desc: 'Journalisation immuable des accès.', icon: IconEye },
            { title: 'Alertes Fuites', desc: 'Notification immédiate en cas d\'exfiltration.', icon: IconBug } // Using generic icon
        ],
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800'
    }
]
</script>
