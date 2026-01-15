<template>
    <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">

        <!-- Background Decor -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div
                class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cypass-blue/10 rounded-full blur-[120px]">
            </div>
            <div
                class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]">
            </div>
        </div>

        <div v-if="service" class="max-w-7xl mx-auto relative z-10">
            <!-- Hero -->
            <div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
                <div class="space-y-6 animate-fade-right">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-cypass-blue text-xs font-bold uppercase tracking-wider">
                        Service {{ service.status === 'available' ? 'Certifié' : 'En développement' }}
                    </div>
                    <h1 class="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
                        {{ service.title }}
                    </h1>
                    <p class="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        {{ service.fullDescription }}
                    </p>
                    <div v-if="service.status === 'available'" class="flex flex-col sm:flex-row gap-4 pt-4">
                        <button class="btn btn-primary">Demander une démo</button>
                        <button class="btn btn-secondary">Documentation Technique</button>
                    </div>
                    <div v-else class="pt-4">
                        <button disabled class="btn btn-secondary opacity-50 cursor-not-allowed">Bientôt
                            Disponible</button>
                    </div>
                </div>
                <div
                    class="relative h-[400px] rounded-3xl overflow-hidden glass-panel p-2 animate-fade-left shadow-2xl shadow-cypass-blue/10">
                    <div class="absolute inset-0 bg-gradient-to-br from-cypass-blue/20 via-transparent to-transparent">
                    </div>
                    <!-- Placeholder for dynamic service image/illustration -->
                    <div
                        class="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                        <component :is="service.icon" class="w-24 h-24 opacity-50" />
                    </div>
                </div>
            </div>

            <!-- Benefits -->
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="(benefit, index) in service.benefits" :key="index"
                    class="glass-panel p-8 rounded-2xl animate-fade-up hover:-translate-y-1 transition-transform duration-300 border border-slate-200/50 dark:border-slate-800/50"
                    :style="{ animationDelay: `${index * 100}ms` }">
                    <div
                        class="w-12 h-12 rounded-xl bg-cypass-blue/10 flex items-center justify-center mb-4 text-cypass-blue">
                        <IconCheck class="w-6 h-6" />
                    </div>
                    <h3 class="font-bold text-xl text-slate-900 dark:text-white mb-2">{{ benefit.title }}</h3>
                    <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ benefit.qty }}</p>
                </div>
            </div>

        </div>

        <div v-else class="text-center pt-20">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Service introuvable</h1>
            <NuxtLink to="/services" class="text-cypass-blue hover:underline mt-4 inline-block">Retour au catalogue
            </NuxtLink>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { IconScanEye, IconCertificate, IconRadar2, IconEye, IconCheck } from '@tabler/icons-vue'

const route = useRoute()
const serviceId = route.params.id

// Types
interface Benefit {
    title: string
    qty: string
}

interface Service {
    title: string
    fullDescription: string
    icon: any
    status: 'available' | 'coming_soon'
    benefits: Benefit[]
}

// Mock Data Database
const servicesData: Record<string, Service> = {
    'secuscan': {
        title: 'SecuScan',
        fullDescription: 'Une solution complète d\'analyse de vulnérabilité qui scanne en continu vos applications, API et infrastructures cloud pour détecter les failles de sécurité avant les attaquants.',
        icon: IconScanEye,
        status: 'coming_soon',
        benefits: [
            { title: 'OWASP Top 10', qty: 'Couverture complète des failles web courantes.' },
            { title: 'Rapports PDF', qty: 'Exports détaillés pour les équipes techniques et la direction.' },
            { title: 'Zéro Faux Positif', qty: 'Algorithme de validation par IA pour réduire le bruit.' }
        ]
    },
    'docsentry': {
        title: 'DocSentry',
        fullDescription: 'Infrastructure PKI souveraine permettant la signature électronique qualifiée, le cachetage serveur et l\'archivage à valeur probante de tous vos documents administratifs.',
        icon: IconCertificate,
        status: 'available',
        benefits: [
            { title: 'eIDAS Ready', qty: 'Conforme aux règlements européens et béninois.' },
            { title: 'API REST', qty: 'Intégration facile dans vos workflows existants.' },
            { title: 'Preuve Légale', qty: 'Validité juridique garantie devant les tribunaux.' }
        ]
    },
    'vigitech': {
        title: 'VigiTech',
        fullDescription: 'Votre tour de contrôle cybernétique. Un réseau d\'alerte communautaire qui permet de signaler anonymement les incidents et de recevoir des notifications ciblées.',
        icon: IconRadar2,
        status: 'available',
        benefits: [
            { title: 'Alerte Communautaire', qty: 'Signalement collaboratif des menaces.' },
            { title: 'Veille Ciblée', qty: 'Notifications filtrées par secteur d\'activité.' },
            { title: 'Réponse Rapide', qty: 'Validation et diffusion immédiate des alertes.' }
        ]
    },
    'leakmonitor': {
        title: 'LeakMonitor',
        fullDescription: 'Système avancé de surveillance des fuites de données et de traçabilité des accès aux documents sensibles. Détecte les comportements anormaux et prévient les exfiltrations.',
        icon: IconEye,
        status: 'coming_soon',
        benefits: [
            { title: 'DLP Avancé', qty: 'Data Loss Prevention pour vos documents critiques.' },
            { title: 'Audit Log', qty: 'Journalisation inviolable de tous les accès.' },
            { title: 'Alertes Temps Réel', qty: 'Soyez notifié dès qu\'une anomalie est détectée.' }
        ]
    }
}

const service = computed<Service | undefined>(() => servicesData[serviceId as string])

definePageMeta({
    layout: 'guest'
})
</script>
