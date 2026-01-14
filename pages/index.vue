<template>
  <div class="relative overflow-hidden font-sans">
    
    <!-- Background Decor Elements -->
    <div class="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-cypass-blue/5 to-transparent -z-10"></div>
    <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cypass-blue/10 rounded-full blur-3xl opacity-50 -z-10 animate-pulse-slow"></div>
    <div class="absolute top-20 -left-20 w-[400px] h-[400px] bg-cypass-green/10 rounded-full blur-3xl opacity-50 -z-10"></div>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          
          <!-- Text Content -->
          <div class="text-center lg:text-left space-y-8" data-aos="fade-right">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-cypass-blue dark:text-blue-300 text-sm font-semibold border border-blue-100 dark:border-blue-800 shadow-sm">
               <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
               Plateforme Nationale Unifiée
            </div>
            
            <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Souveraineté <span class="text-transparent bg-clip-text bg-gradient-to-r from-cypass-blue to-blue-500">Numérique</span> & Sécurité
            </h1>
            
            <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              CYPASS est l'infrastructure critique protégeant l'écosystème numérique du Bénin. 
              Certification de documents, veille cybernétique et audits de sécurité en temps réel.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <NuxtLink to="/auth/login" class="w-full sm:w-auto">
                 <BaseButton class="w-full h-14 px-8 text-lg rounded-xl shadow-xl bg-gradient-to-r from-cypass-blue to-blue-700 hover:to-blue-800 border-0 ring-4 ring-blue-500/20 transition-transform transform hover:-translate-y-1">
                   Accéder au Portail
                 </BaseButton>
               </NuxtLink>
               <NuxtLink to="#features" class="w-full sm:w-auto">
                 <BaseButton variant="secondary" class="w-full h-14 px-8 text-lg rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                   Découvrir les services
                 </BaseButton>
               </NuxtLink>
            </div>
            
            <div class="pt-8 flex items-center justify-center lg:justify-start gap-8 text-slate-400">
               <div class="flex items-center gap-2">
                  <IconShieldCheck class="w-5 h-5 text-cypass-green" />
                  <span class="text-sm font-medium">Données Chiffrées</span>
               </div>
               <div class="flex items-center gap-2">
                  <IconServer class="w-5 h-5 text-cypass-green" />
                  <span class="text-sm font-medium">Hébergé au Bénin</span>
               </div>
               <div class="flex items-center gap-2">
                  <IconCertificate class="w-5 h-5 text-cypass-green" />
                  <span class="text-sm font-medium">Conforme RGPD/Loi Numérique</span>
               </div>
            </div>
          </div>

          <!-- Hero Graphic/Illustration Mock -->
          <div class="relative hidden lg:block" data-aos="fade-left">
             <div class="relative z-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <!-- Mock Dashboard UI Header -->
                <div class="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                   <div class="flex gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-red-500"></div>
                      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div class="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <div class="ml-4 px-3 py-1 bg-slate-800 rounded text-xs text-slate-400 font-mono w-64">cypass.bj/dashboard/surveillance</div>
                </div>
                <!-- Mock Dashboard Body -->
                <div class="p-6 grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 h-[400px]">
                   <div class="col-span-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 flex flex-col justify-between relative overflow-hidden">
                       <div class="absolute inset-0 grid grid-cols-6 gap-2 opacity-10">
                          <div v-for="n in 24" :key="n" class="bg-blue-500 rounded-sm"></div>
                       </div>
                       <div class="relative z-10">
                          <div class="text-sm font-semibold text-blue-600 dark:text-blue-300">Flux de Menaces en Temps Réel</div>
                          <div class="text-3xl font-bold text-slate-900 dark:text-white mt-1">12 Tentatives bloquées</div>
                       </div>
                       <div class="h-12 flex gap-1 items-end relative z-10">
                          <div v-for="h in [40, 60, 30, 80, 50, 90, 70, 45, 60, 80]" :key="h" :style="{height: h + '%'}" class="bg-blue-500 w-full rounded-t-sm opacity-80"></div>
                       </div>
                   </div>
                   <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                       <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mb-2">
                          <IconCheck class="w-6 h-6" />
                       </div>
                       <div class="font-bold text-slate-900 dark:text-white">Système Sain</div>
                       <div class="text-xs text-slate-500 mt-1">Audit automatique il y a 5 min</div>
                   </div>
                   <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-2">
                          <IconFileAnalytics class="w-6 h-6" />
                       </div>
                       <div class="font-bold text-slate-900 dark:text-white">5 Docs en attente</div>
                       <div class="text-xs text-slate-500 mt-1">Signature requise</div>
                   </div>
                </div>
             </div>
             <!-- Decorative elements behind image -->
             <div class="absolute -z-10 top-10 -right-10 w-full h-full bg-gradient-to-br from-cypass-green to-teal-500 rounded-2xl opacity-20 transform rotate-12 blur-sm"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Strip -->
    <section class="py-10 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p class="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Confiance & Partenaires Institutionnels</p>
          <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
             <!-- Placeholder Logo Texts for now -->
             <span class="text-xl font-bold font-serif text-slate-700 dark:text-slate-300">RÉPUBLIQUE DU BÉNIN</span>
             <span class="text-xl font-bold font-sans text-slate-700 dark:text-slate-300">ANSSI</span>
             <span class="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">ASIN</span>
             <span class="text-xl font-bold font-sans text-slate-700 dark:text-slate-300">BJ-CSIRT</span>
          </div>
       </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 relative">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          <!-- Feature 1: SecuScan -->
          <div class="grid lg:grid-cols-2 gap-16 items-center">
             <div class="order-2 lg:order-1 relative">
                <div class="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full"></div>
                <div class="relative bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-100 dark:border-slate-700">
                   <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Security Dashboard" class="rounded-xl w-full object-cover h-[400px]" />
                   <div class="absolute bottom-6 right-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce-slow">
                      <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span class="font-bold text-slate-900 dark:text-white">Scan Actif: 98%</span>
                   </div>
                </div>
             </div>
             <div class="order-1 lg:order-2 space-y-6">
                <div class="inline-block p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-cypass-blue dark:text-blue-300 mb-2">
                   <IconScanEye class="w-8 h-8" />
                </div>
                <h2 class="text-4xl font-bold text-slate-900 dark:text-white">SecuScan: Audit de Vulnérabilité Automatisé</h2>
                <p class="text-lg text-slate-600 dark:text-slate-300">
                   Détectez et corrigez les failles de sécurité avant qu'elles ne soient exploitées. Notre moteur d'analyse scanne en continu vos infrastructures web exposées.
                </p>
                <ul class="space-y-3">
                   <li class="flex items-start gap-3">
                      <IconCheck class="w-6 h-6 text-cypass-green flex-shrink-0" />
                      <span class="text-slate-700 dark:text-slate-300">Détection OWASP Top 10</span>
                   </li>
                   <li class="flex items-start gap-3">
                      <IconCheck class="w-6 h-6 text-cypass-green flex-shrink-0" />
                      <span class="text-slate-700 dark:text-slate-300">Rapports de conformité détaillés</span>
                   </li>
                   <li class="flex items-start gap-3">
                      <IconCheck class="w-6 h-6 text-cypass-green flex-shrink-0" />
                      <span class="text-slate-700 dark:text-slate-300">Scoring de risque en temps réel</span>
                   </li>
                </ul>
             </div>
          </div>

          <!-- Feature 2: DocSentry -->
          <div class="grid lg:grid-cols-2 gap-16 items-center">
             <div class="space-y-6">
                <div class="inline-block p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-cypass-green dark:text-green-300 mb-2">
                   <IconFileCertificate class="w-8 h-8" />
                </div>
                <h2 class="text-4xl font-bold text-slate-900 dark:text-white">DocSentry: Certification Documentaire</h2>
                <p class="text-lg text-slate-600 dark:text-slate-300">
                    Garantissez l'authenticité de chaque acte administratif. Une infrastructure de signature numérique infalsifiable pour l'État et les citoyens.
                </p>
                <div class="grid grid-cols-2 gap-4 pt-4">
                   <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <h4 class="font-bold text-slate-900 dark:text-white">Signature Électronique</h4>
                      <p class="text-sm text-slate-500 mt-1">Conforme eIDAS & Normes Bénin</p>
                   </div>
                   <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <h4 class="font-bold text-slate-900 dark:text-white">Archivage Légal</h4>
                      <p class="text-sm text-slate-500 mt-1">Conservation sécurisée à long terme</p>
                   </div>
                </div>
             </div>
              <div class="relative">
                 <div class="absolute inset-0 bg-cypass-green blur-[100px] opacity-20 rounded-full"></div>
                 <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 rotate-1 hover:rotate-0 transition-transform duration-500">
                     <!-- Mock Certificate UI -->
                     <div class="border-4 border-double border-slate-200 dark:border-slate-700 p-8 text-center h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900">
                         <IconCertificate class="w-16 h-16 text-cypass-green mb-4" />
                         <h3 class="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">Certificat de Conformité</h3>
                         <p class="text-slate-500 text-sm mb-8">Document signé numériquement par CYPASS Authority</p>
                         <div class="w-full max-w-xs bg-slate-100 h-2 rounded mb-2"></div>
                         <div class="w-full max-w-xs bg-slate-100 h-2 rounded mb-2"></div>
                         <div class="w-full max-w-xs bg-slate-100 h-2 rounded mb-8"></div>
                         <div class="flex items-center gap-2 text-cypass-green font-bold border rounded px-4 py-2 border-cypass-green">
                            <IconCheck class="w-5 h-5" /> Vérifié Valide
                         </div>
                     </div>
                 </div>
              </div>
          </div>

          <!-- Feature 3: VigiTech -->
          <div class="grid lg:grid-cols-2 gap-16 items-center">
             <div class="order-2 lg:order-1 relative">
                <div class="absolute inset-0 bg-purple-500 blur-[100px] opacity-20 rounded-full"></div>
                 <div class="relative bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-700">
                   <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" alt="Cyber Grid" class="rounded-xl w-full object-cover h-[400px] opacity-80" />
                   <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-24 h-24 rounded-full border-4 border-white/20 animate-ping absolute"></div>
                      <div class="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-10"></div>
                   </div>
                </div>
             </div>
             <div class="order-1 lg:order-2 space-y-6">
                 <div class="inline-block p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 mb-2">
                   <IconRadar2 class="w-8 h-8" />
                </div>
                <h2 class="text-4xl font-bold text-slate-900 dark:text-white">VigiTech: Surveillance Active</h2>
                <p class="text-lg text-slate-600 dark:text-slate-300">
                   Une tour de contrôle unifiée pour surveiller l'état de santé de vos infrastructures critiques. Alertes intelligentes et réponse aux incidents.
                </p>
                <div class="flex gap-4">
                   <BaseButton variant="primary">Découvrir le SOC</BaseButton>
                </div>
             </div>
          </div>
       </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20 bg-cypass-blue text-white relative overflow-hidden">
       <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div class="space-y-2">
                <div class="text-4xl md:text-5xl font-extrabold text-blue-200">99.9%</div>
                <div class="text-blue-100 font-medium">Uptime Garanti</div>
             </div>
             <div class="space-y-2">
                <div class="text-4xl md:text-5xl font-extrabold text-blue-200">50k+</div>
                <div class="text-blue-100 font-medium">Documents Sécurisés</div>
             </div>
             <div class="space-y-2">
                <div class="text-4xl md:text-5xl font-extrabold text-blue-200">0</div>
                <div class="text-blue-100 font-medium">Incidents Critiques</div>
             </div>
             <div class="space-y-2">
                <div class="text-4xl md:text-5xl font-extrabold text-blue-200">24/7</div>
                <div class="text-blue-100 font-medium">Support Gouvernemental</div>
             </div>
          </div>
       </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-white dark:bg-slate-950">
       <div class="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 class="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">Prêt à sécuriser votre avenir numérique ?</h2>
          <p class="text-xl text-slate-600 dark:text-slate-300">
             Rejoignez les institutions qui font confiance à CYPASS pour leur souveraineté numérique.
          </p>
          <div class="flex justify-center gap-4">
             <NuxtLink to="/auth/login">
                <BaseButton class="bg-cypass-green hover:bg-emerald-600 text-lg px-8 py-3 h-auto rounded-full">
                   Créer un compte organisation
                </BaseButton>
             </NuxtLink>
          </div>
       </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { 
  IconShieldCheck, 
  IconServer, 
  IconCertificate, 
  IconScanEye, 
  IconFileCertificate, 
  IconRadar2, 
  IconCheck, 
  IconFileAnalytics 
} from '@tabler/icons-vue'

definePageMeta({
  layout: 'guest'
})
</script>

<style scoped>
/* Custom animations mainly handled by Tailwind, but adding some specific utilities if needed */
.animate-pulse-slow {
   animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-bounce-slow {
   animation: bounce 3s infinite;
}
</style>
