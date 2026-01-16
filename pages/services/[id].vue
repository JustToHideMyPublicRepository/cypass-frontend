<template>
  <div class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">

    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <div v-if="service"
        class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        :class="service.theme === 'blue' ? 'bg-blue-500' : 'bg-green-500'">
      </div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]">
      </div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>

    <div v-if="service" class="max-w-7xl mx-auto relative z-10">

      <!-- Sticky/Grid Layout -->
      <div class="grid lg:grid-cols-12 gap-12">

        <!-- Left Content (Scrollable) -->
        <div class="lg:col-span-7 space-y-12">

          <!-- Header -->
          <div class="space-y-6 animate-fade-right">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm text-xs font-bold uppercase tracking-wider transition-colors"
              :class="service.theme === 'blue'
                ? 'bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800'
                : 'bg-green-50/50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-800'">
              <span class="w-2 h-2 rounded-full animate-pulse"
                :class="service.theme === 'blue' ? 'bg-blue-500' : 'bg-green-500'"></span>
              Module {{ service.status === 'available' ? 'Actif' : 'En Développement' }}
            </div>

            <h1 class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {{ service.title }}<span class="text-primary">.</span>
            </h1>

            <p class="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
              {{ service.fullDescription }}
            </p>

            <div v-if="service.status === 'available'" class="flex flex-col sm:flex-row gap-4 pt-4">
              <button class="btn btn-primary shadow-xl shadow-primary/20">
                Demander une démo
                <IconArrowRight class="w-5 h-5 ml-2" />
              </button>
              <button class="btn btn-secondary">
                <IconFileText class="w-5 h-5 mr-2" />
                Documentation API
              </button>
            </div>
            <div v-else class="pt-4">
              <div
                class="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
                <IconClock class="w-5 h-5" />
                Disponible prochainement
              </div>
            </div>
          </div>

          <!-- Detailed Features Grid -->
          <div class="grid sm:grid-cols-2 gap-6">
            <div v-for="(benefit, index) in service.benefits" :key="index"
              class="glass-panel p-6 rounded-2xl animate-fade-up border border-slate-200/50 dark:border-slate-800/50 group hover:border-primary/20 transition-colors"
              :style="{ animationDelay: `${index * 100}ms` }">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300"
                :class="service.theme === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500'">
                <IconCheck class="w-5 h-5" />
              </div>
              <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">{{ benefit.title }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{{ benefit.qty }}</p>
            </div>
          </div>

          <!-- "How it works" Mini Section -->
          <div class="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Spécifications Techniques</h3>
            <div class="space-y-4">
              <div v-for="spec in service.techSpecs" :key="spec.label"
                class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/50">
                <span class="text-slate-500 dark:text-slate-400 font-medium">{{ spec.label }}</span>
                <span
                  class="text-slate-900 dark:text-white font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{{
                  spec.value }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Visual (Sticky) -->
        <div class="lg:col-span-5 relative hidden lg:block">
          <div class="sticky top-32 perspective-1000">
            <div class="absolute inset-0 bg-gradient-to-tr opacity-20 blur-3xl rounded-full -z-10"
              :class="service.theme === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500'">
            </div>

            <!-- DYNAMIC VISUALS BASED ON ID -->

            <!-- VISUAL: SECUSCAN (Terminal) -->
            <UiAppFrame v-if="serviceId === 'secuscan'" type="terminal" title="root@secuscan:~" :glass="true"
              class="shadow-2xl shadow-blue-500/10 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700">
              <div class="h-[500px] p-6 text-sm font-mono space-y-4 overflow-hidden bg-slate-900/95 text-slate-300">
                <div class="flex gap-2">
                  <span class="text-green-500">➜</span>
                  <span class="text-blue-400">~</span>
                  <span>secuscan --deep --target production</span>
                </div>
                <div class="pl-4 text-slate-500">Initializing deep scan protocol v2.4...</div>
                <div class="pl-4 text-slate-500">Target: 192.168.1.X (Production Cluster)</div>
                <div class="pl-4 text-yellow-400">[WARN] High traffic detected, adjusting throttle...</div>
                <div class="pl-4">Scanning ports [0-65535]... <span class="text-green-400">100%</span></div>

                <div class="border-t border-slate-700 my-4"></div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-slate-800 p-2 rounded">
                    <div class="text-[10px] uppercase text-slate-500">Open Ports</div>
                    <div class="text-xl text-white font-bold">14</div>
                  </div>
                  <div class="bg-slate-800 p-2 rounded">
                    <div class="text-[10px] uppercase text-slate-500">Vulns Found</div>
                    <div class="text-xl text-red-400 font-bold">2</div>
                  </div>
                </div>

                <div class="pl-4 mt-4 text-white">VULNERABILITY REPORT:</div>
                <div class="pl-4 text-red-400">1. CVE-2024-XXXX (Critical) - SSL Misconfiguration</div>
                <div class="pl-4 text-yellow-400">2. CVE-2023-XXXX (Medium) - Header leakage</div>
                <div class="pl-4 text-green-500 mt-2">Generating remediation plan... DONE</div>
                <span class="animate-pulse">_</span>
              </div>
            </UiAppFrame>

            <!-- VISUAL: VIGITECH (Radar) -->
            <UiAppFrame v-else-if="serviceId === 'vigitech'" type="card" :glass="true"
              class="shadow-2xl shadow-green-500/10 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700">
              <div class="relative h-[500px] bg-slate-900 overflow-hidden flex flex-col">
                <!-- Map/Radar BG -->
                <div
                  class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.slate.800)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20">
                </div>
                <div
                  class="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,theme(colors.green.500/0.1)_360deg)] animate-spin-slow">
                </div>

                <!-- Header -->
                <div
                  class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md z-10">
                  <div class="flex items-center gap-2 text-green-500 font-mono text-xs">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    LIVE MONITORING
                  </div>
                  <div class="text-xs text-slate-500 font-mono">LATENCY: 12ms</div>
                </div>

                <!-- Central Radar -->
                <div class="flex-grow relative flex items-center justify-center">
                  <div
                    class="w-[300px] h-[300px] border border-green-500/20 rounded-full flex items-center justify-center relative">
                    <div
                      class="w-[200px] h-[200px] border border-green-500/40 rounded-full flex items-center justify-center">
                      <div
                        class="w-[100px] h-[100px] border border-green-500/60 rounded-full flex items-center justify-center bg-green-500/5">
                        <IconRadar2 class="w-10 h-10 text-green-500 animate-pulse" />
                      </div>
                    </div>
                    <!-- Blips -->
                    <div class="absolute top-[20%] right-[30%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div class="absolute bottom-[20%] left-[30%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
                    </div>
                  </div>
                </div>

                <!-- Threat Feed -->
                <div class="h-[150px] bg-slate-950 border-t border-slate-800 p-4 space-y-2 z-10">
                  <div class="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Recent Alerts</div>
                  <div
                    class="flex items-center gap-3 text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-red-500">
                    <span class="font-mono text-red-400">CRITICAL</span>
                    <span>DDoS Attempt detected on Port 443</span>
                    <span class="ml-auto text-slate-600">Now</span>
                  </div>
                  <div
                    class="flex items-center gap-3 text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-yellow-500">
                    <span class="font-mono text-yellow-400">WARN</span>
                    <span>Unusual login location (IP: 45.2.X.X)</span>
                    <span class="ml-auto text-slate-600">2m ago</span>
                  </div>
                </div>
              </div>
            </UiAppFrame>

            <!-- VISUAL: DOCSENTRY (Certificate) -->
            <UiAppFrame v-else-if="serviceId === 'docsentry'" type="card" :glass="true"
              class="shadow-2xl shadow-green-500/10 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700">
              <div
                class="h-[500px] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

                <div
                  class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-8 text-center relative z-10">
                  <div
                    class="w-24 h-24 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mb-6 relative">
                    <IconCertificate class="w-12 h-12" />
                    <div class="absolute inset-0 border-4 border-green-500/20 rounded-full animate-ping-slow"></div>
                  </div>

                  <div
                    class="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                    Document Certifié
                  </div>

                  <h3 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">Contrat_Cadre_v2.pdf
                  </h3>
                  <p class="text-xs text-slate-500 mb-8">Signé numériquement le 16 Jan 2024</p>

                  <div class="text-left space-y-3 text-xs border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Signataire</span>
                      <span class="font-bold text-slate-800 dark:text-slate-200">Ministère de l'Économie</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Algorithme</span>
                      <span class="font-mono text-slate-800 dark:text-slate-200">SHA-256 / RSA-4096</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-500">Empreinte</span>
                      <span class="font-mono text-slate-800 dark:text-slate-200 truncate w-32">8f3a...29b1</span>
                    </div>
                  </div>
                </div>

                <!-- Background Pattern -->
                <div
                  class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5">
                </div>
              </div>
            </UiAppFrame>

            <!-- VISUAL: LEAKMONITOR (File Browser) -->
            <UiAppFrame v-else type="browser" url="https://monitor.cypass.bj/dashboard" :glass="true"
              class="shadow-2xl shadow-blue-500/10 transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700">
              <div class="h-[500px] bg-slate-50 dark:bg-slate-900 flex flex-col">
                <!-- Toolbar -->
                <div
                  class="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 bg-white dark:bg-slate-950">
                  <div class="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500">Filter: All
                    Sources</div>
                  <div class="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-500 rounded text-xs font-bold">High Risk
                    Only</div>
                </div>

                <!-- Content -->
                <div class="p-4 space-y-3 overflow-hidden">
                  <div class="grid grid-cols-4 gap-4 mb-4">
                    <div
                      class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                      <div class="text-2xl font-bold text-slate-800 dark:text-white">0</div>
                      <div class="text-[10px] text-slate-400 uppercase">Fuites Actives</div>
                    </div>
                    <div
                      class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                      <div class="text-2xl font-bold text-slate-800 dark:text-white">124</div>
                      <div class="text-[10px] text-slate-400 uppercase">Documents</div>
                    </div>
                    <div
                      class="col-span-2 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm text-white flex items-center justify-between px-6">
                      <div>
                        <div class="font-bold">Protection Active</div>
                        <div class="text-xs opacity-80">Dernier scan: 2 min</div>
                      </div>
                      <IconShieldCheck class="w-8 h-8 opacity-80" />
                    </div>
                  </div>

                  <!-- Mock Lines -->
                  <div v-for="i in 5" :key="i"
                    class="flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                    <div
                      class="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-slate-400">
                      <IconFileText class="w-4 h-4" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-1"></div>
                      <div class="h-2 bg-slate-100 dark:bg-slate-800/50 rounded w-1/4"></div>
                    </div>
                    <div class="px-2 py-1 bg-green-100 text-green-600 text-[10px] rounded font-bold">SECURE</div>
                  </div>
                </div>
              </div>
            </UiAppFrame>

          </div>
        </div>

      </div>

    </div>

    <!-- 404 State -->
    <div v-else class="min-h-[50vh] flex flex-col items-center justify-center text-center">
      <div class="text-9xl font-black text-slate-200 dark:text-slate-800 mb-8">404</div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Service introuvable</h1>
      <p class="text-slate-500 mb-8">Le module que vous recherchez n'existe pas ou n'est plus disponible.</p>
      <NuxtLink to="/services" class="btn btn-primary">Retour au catalogue
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import {
  IconScanEye,
  IconCertificate,
  IconRadar2,
  IconEye,
  IconCheck,
  IconArrowRight,
  IconFileText,
  IconClock,
  IconShieldCheck
} from '@tabler/icons-vue'

const route = useRoute()
const serviceId = route.params.id

// Types
interface Benefit {
  title: string
  qty: string
}

interface TechSpec {
  label: string
  value: string
}

interface Service {
  title: string
  fullDescription: string
  icon: any
  status: 'available' | 'coming_soon'
  theme: 'blue' | 'green'
  benefits: Benefit[]
  techSpecs: TechSpec[]
}

// Mock Data Database
const servicesData: Record<string, Service> = {
  'secuscan': {
    title: 'SecuScan',
    fullDescription: 'Une solution complète d\'analyse de vulnérabilité qui scanne en continu vos applications, API et infrastructures cloud pour détecter les failles de sécurité avant les attaquants, garantissant une posture de sécurité robuste.',
    icon: IconScanEye,
    status: 'coming_soon',
    theme: 'blue',
    benefits: [
      { title: 'OWASP Top 10', qty: 'Couverture complète des failles web courantes.' },
      { title: 'Rapports PDF', qty: 'Exports détaillés pour les équipes techniques et la direction.' },
      { title: 'Zéro Faux Positif', qty: 'Algorithme de validation par IA pour réduire le bruit.' },
      { title: 'Scan Continu', qty: 'Surveillance 24/7 de votre périmètre exposé.' }
    ],
    techSpecs: [
      { label: 'Scanner Engine', value: 'Nmap / OpenVAS Custom' },
      { label: 'Compliance', value: 'ISO 27001' },
      { label: 'Deployment', value: 'SaaS / On-Premise' }
    ]
  },
  'docsentry': {
    title: 'DocSentry',
    fullDescription: 'Infrastructure PKI souveraine permettant la signature électronique qualifiée, le cachetage serveur et l\'archivage à valeur probante de tous vos documents administratifs, en totale conformité avec les réglementations en vigueur.',
    icon: IconCertificate,
    status: 'available',
    theme: 'green',
    benefits: [
      { title: 'eIDAS Ready', qty: 'Conforme aux règlements européens et béninois.' },
      { title: 'API REST', qty: 'Intégration facile dans vos workflows existants.' },
      { title: 'Preuve Légale', qty: 'Validité juridique garantie devant les tribunaux.' },
      { title: 'Archivage Long', qty: 'Conservation sécurisée jusqu\'à 10 ans.' }
    ],
    techSpecs: [
      { label: 'Signature Stds', value: 'PAdES / XAdES' },
      { label: 'Encryption', value: 'RSA-4096 / AES-256' },
      { label: 'Hébergement', value: 'Souverain (BJ)' }
    ]
  },
  'vigitech': {
    title: 'VigiTech',
    fullDescription: 'Votre tour de contrôle cybernétique. Un réseau d\'alerte communautaire et un SOC (Security Operations Center) qui permet de signaler anonymement les incidents et de recevoir des notifications ciblées en temps réel.',
    icon: IconRadar2,
    status: 'available',
    theme: 'green',
    benefits: [
      { title: 'Alerte Communautaire', qty: 'Signalement collaboratif des menaces.' },
      { title: 'Veille Ciblée', qty: 'Notifications filtrées par secteur d\'activité.' },
      { title: 'Réponse Rapide', qty: 'Validation et diffusion immédiate des alertes.' },
      { title: 'SOC Virtuel', qty: 'Dashboards de surveillance unifiés.' }
    ],
    techSpecs: [
      { label: 'Protocoles', value: 'STIX / TAXII' },
      { label: 'SLA Réponse', value: '< 15 min' },
      { label: 'Support', value: '24/7' }
    ]
  },
  'leakmonitor': {
    title: 'LeakMonitor',
    fullDescription: 'Système avancé de surveillance des fuites de données et de traçabilité des accès aux documents sensibles. Détecte les comportements anormaux, surveille le darkweb et prévient les exfiltrations de données critiques.',
    icon: IconEye,
    status: 'coming_soon',
    theme: 'blue',
    benefits: [
      { title: 'DLP Avancé', qty: 'Data Loss Prevention pour vos documents critiques.' },
      { title: 'Audit Log', qty: 'Journalisation inviolable de tous les accès.' },
      { title: 'Alertes Temps Réel', qty: 'Soyez notifié dès qu\'une anomalie est détectée.' },
      { title: 'Veille Darkweb', qty: 'Scan proactif des bases de données fuitées.' }
    ],
    techSpecs: [
      { label: 'Detection', value: 'AI / Pattern Matching' },
      { label: 'Sources', value: 'Darkweb / Pastebin' },
      { label: 'Notification', value: 'Email / SMS / Webhook' }
    ]
  }
}

const service = computed<Service | undefined>(() => servicesData[serviceId as string])

definePageMeta({
  layout: 'guest'
})
</script>
