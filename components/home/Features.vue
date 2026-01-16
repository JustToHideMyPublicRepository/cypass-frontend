<template>
  <section id="features" class="py-32 relative">
    <!-- Section Decor -->
    <div class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-r from-primary/5 to-transparent skew-y-6 -z-10">
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
            {{ service.title }}<span :class="`text-cypass-${service.theme === 'blue' ? 'blue' : 'green'}`">.</span>
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

          <!-- DocSentry Visual -->
          <UiAppFrame v-if="service.id === 'docsentry'" type="card"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1" :glass="true">
            <template #headerActions>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validé</span>
              </div>
            </template>
            <div class="p-4 min-h-[350px] flex items-center justify-center">
              <div
                class="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div class="h-2 bg-gradient-to-r from-cypass-green to-emerald-400"></div>
                <div class="p-8 text-center">
                  <div
                    class="w-20 h-20 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-cypass-green mb-6 relative">
                    <IconCertificate class="w-10 h-10 relative z-10" />
                    <div class="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-20">
                    </div>
                  </div>
                  <h4 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Certifié Conforme</h4>
                  <p class="text-xs text-slate-500 mb-6 uppercase tracking-wider">République du Bénin
                  </p>
                  <div
                    class="text-[10px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                    SHA-256: 8f3a...29b1
                  </div>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- VigiTech Visual -->
          <UiAppFrame v-else-if="service.id === 'vigitech'" type="card"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true">
            <div class="relative h-[350px] overflow-hidden bg-slate-900 flex items-center justify-center">
              <!-- Radar Background -->
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.green.900/0.2)_1px,transparent_1px)] bg-[length:24px_24px]">
              </div>
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>

              <!-- Radar Circles -->
              <div class="absolute w-[400px] h-[400px] border border-green-900/30 rounded-full"></div>
              <div class="absolute w-[300px] h-[300px] border border-green-500/20 rounded-full"></div>
              <div class="absolute w-[200px] h-[200px] border border-green-500/40 rounded-full animate-pulse"></div>

              <!-- Scanning Line -->
              <div
                class="absolute w-[200px] h-[200px] bg-gradient-to-tr from-transparent to-green-500/20 rounded-full animate-spin-slow origin-bottom-left"
                style="transform-origin: center;"></div>

              <!-- Alert Points -->
              <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-red-500 rounded-full"></div>

              <div class="absolute bottom-[40%] right-[30%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>

              <!-- Overlay Text -->
              <div
                class="absolute bottom-6 left-6 right-6 p-4 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700">
                <div class="flex items-center gap-3">
                  <IconRadar2 class="w-6 h-6 text-green-500 animate-spin-slow" />
                  <div>
                    <div class="text-xs font-bold text-white uppercase tracking-wider">Menace Détectée</div>
                    <div class="text-[10px] text-slate-400 font-mono">IP: 192.168.X.X • Port Scan Multiples</div>
                  </div>
                  <button
                    class="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded hover:bg-red-500/30">Bloquer</button>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- SecuScan Visual -->
          <UiAppFrame v-else-if="service.id === 'secuscan'" type="terminal" title="root@secuscan:~" :glass="true"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
            <div class="h-[350px] p-4 text-xs font-mono space-y-2 overflow-hidden bg-slate-900/90 text-slate-300">
              <div class="flex gap-2">
                <span class="text-green-500">➜</span>
                <span class="text-blue-400">~</span>
                <span>nmap -sV -p- target.gov.bj</span>
              </div>
              <div class="pl-4 text-slate-500">Starting Nmap 7.92 at 2024-01-16 14:00 CET</div>
              <div class="pl-4">Nmap scan report for target.gov.bj (10.0.0.1)</div>
              <div class="pl-4">Host is up (0.002s latency).</div>
              <div class="pl-4 text-slate-500">Not shown: 65532 closed tcp ports (reset)</div>
              <div class="pl-4 text-white">PORT STATE SERVICE VERSION</div>
              <div class="pl-4"><span class="text-green-400">80/tcp open http</span> nginx 1.18.0</div>
              <div class="pl-4"><span class="text-green-400">443/tcp open ssl/https</span> nginx 1.18.0</div>
              <div class="pl-4"><span class="text-yellow-400">8080/tcp open http-proxy</span> unknown</div>
              <br>
              <div class="flex gap-2">
                <span class="text-green-500">➜</span>
                <span class="text-blue-400">~</span>
                <span>vuln-scan --target 10.0.0.1 --deep</span>
              </div>
              <div class="pl-4 text-slate-500">[+] Initializing vulnerability database...</div>
              <div class="pl-4 text-slate-500">[+] Checking CVE-2023-XXXX...</div>
              <div class="pl-4 text-red-400">[!] POTENTIAL FLLAW DETECTED: Outdated SSL Protocol</div>
              <div class="pl-4 text-green-500">Generating Report........... DONE</div>
              <span class="animate-pulse">_</span>
            </div>
          </UiAppFrame>

          <!-- LeakMonitor Visual -->
          <UiAppFrame v-else-if="service.id === 'leakmonitor'" type="browser" url="https://monitor.cypass.bj/alerts"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true">
            <div class="h-[350px] bg-slate-50 dark:bg-slate-900 p-4 overflow-hidden relative">
              <!-- Header Stats -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div
                  class="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] text-slate-500 uppercase">Fuites</div>
                  <div class="text-lg font-bold text-red-500">0</div>
                </div>
                <div
                  class="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] text-slate-500 uppercase">Sources</div>
                  <div class="text-lg font-bold text-slate-700 dark:text-white">142</div>
                </div>
                <div
                  class="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div class="text-[10px] text-slate-500 uppercase">Status</div>
                  <div class="text-lg font-bold text-green-500">Actif</div>
                </div>
              </div>

              <!-- File List -->
              <div class="space-y-2">
                <div v-for="i in 4" :key="i"
                  class="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div :class="i === 1 ? 'bg-red-50 text-red-500' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'"
                    class="w-8 h-8 rounded flex items-center justify-center">
                    <IconFileReport class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">CONFIDENTIEL_RAPPORT_{{
                      2023 + i
                      }}.pdf</div>
                    <div class="text-[10px] text-slate-400">Detecté sur Pastebin • Il y a {{ i * 5 }} min</div>
                  </div>
                  <div v-if="i === 1" class="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">KRITIK
                  </div>
                  <div v-else class="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded">SECURE</div>
                </div>
              </div>

              <!-- Blur overlay for depth -->
              <div
                class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent">
              </div>
            </div>
          </UiAppFrame>

          <!-- Fallback Image (just in case) -->
          <img v-else-if="service.image" :src="service.image" :alt="service.title"
            class="rounded-3xl w-full object-cover h-[400px] shadow-2xl"
            :class="{ 'grayscale opacity-60': service.status !== 'available' }" />

          <div v-if="service.status !== 'available'"
            class="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-[1px] z-20 rounded-3xl">
            <span
              class="px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-xl border border-slate-700">Bientôt
              Disponible</span>
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
    theme: 'green',
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
