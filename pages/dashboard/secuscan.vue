<template>
   <div class="space-y-6">
      <div>
         <h1 class="text-2xl font-bold text-slate-900 dark:text-white">SecuScan</h1>
         <p class="text-slate-500 dark:text-slate-400">Audit et détection de vulnérabilités</p>
      </div>

      <!-- Scanner Input -->
      <BaseCard class="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none">
         <div class="max-w-3xl mx-auto py-8">
            <h2 class="text-xl font-semibold mb-4 text-center">Lancer un audit de sécurité</h2>
            <div class="flex gap-2">
               <div class="flex-1 relative">
                  <IconWorld class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="url" placeholder="https://example.gouv.bj"
                     class="w-full pl-10 pr-4 py-3 rounded-lg border-none bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-cypass-green" />
               </div>
               <BaseButton variant="primary" class="bg-cypass-green hover:bg-emerald-600 px-6">
                  Scanner
               </BaseButton>
            </div>
            <p class="text-xs text-slate-400 mt-2 text-center">Scan complet incluant OWASP Top 10 et conformité RGPD.
            </p>
         </div>
      </BaseCard>

      <!-- Results -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <!-- Chart Placeholder -->
         <BaseCard title="Synthèse des risques" class="lg:col-span-1">
            <div class="flex flex-col items-center justify-center py-8">
               <div
                  class="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
                  <span class="text-3xl font-bold text-slate-900 dark:text-white">85%</span>
                  <span class="absolute bottom-2 text-xs text-slate-500">Score</span>
                  <svg class="absolute inset-0 w-full h-full -rotate-90">
                     <circle cx="80" cy="80" r="76" stroke="currentColor" stroke-width="8" fill="none"
                        class="text-cypass-green" stroke-dasharray="477" stroke-dashoffset="71"></circle>
                  </svg>
               </div>
               <div class="mt-6 w-full space-y-3">
                  <div class="flex justify-between text-sm">
                     <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500"></span>
                        Critique</span>
                     <span class="font-medium">1</span>
                  </div>
                  <div class="flex justify-between text-sm">
                     <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Moyen</span>
                     <span class="font-medium">2</span>
                  </div>
                  <div class="flex justify-between text-sm">
                     <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        Faible</span>
                     <span class="font-medium">5</span>
                  </div>
               </div>
            </div>
         </BaseCard>

         <!-- Vulnerabilities List -->
         <BaseCard title="Vulnérabilités Détectées" class="lg:col-span-2">
            <div class="space-y-4">
               <div v-for="vuln in cypassData.vulnerabilities" :key="vuln.id"
                  class="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div class="flex items-start justify-between">
                     <div class="flex items-start gap-3">
                        <div :class="['mt-1 p-1.5 rounded-lg',
                           vuln.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                              vuln.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                        ]">
                           <IconBug class="w-5 h-5" />
                        </div>
                        <div>
                           <h3 class="font-semibold text-slate-900 dark:text-white">{{ vuln.type }}</h3>
                           <p class="text-sm text-slate-500 font-code mt-1">{{ vuln.url }}</p>
                        </div>
                     </div>
                     <StatusBadge :status="vuln.severity" />
                  </div>
                  <div class="mt-4 flex justify-between items-center">
                     <div class="text-xs text-slate-500">Détecté le 12/01/2026</div>
                     <BaseButton variant="secondary" size="sm">Détails</BaseButton>
                  </div>
               </div>
            </div>
         </BaseCard>
      </div>
   </div>
</template>

<script setup lang="ts">
import { IconWorld, IconBug } from '@tabler/icons-vue'

definePageMeta({
   layout: 'default',
   middleware: 'auth'
})

const cypassData = useCypassData()
</script>
