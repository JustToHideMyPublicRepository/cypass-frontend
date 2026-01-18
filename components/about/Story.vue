<template>
  <section class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid lg:grid-cols-2 gap-16">
        <div class="animate-fade-right">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Notre Histoire</h2>
          <div class="space-y-8 relative pl-8 border-l-2 border-slate-200 dark:border-slate-800">
            <div v-for="event in timeline" :key="event.year" class="relative">
              <div
                class="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950 bg-primary">
              </div>
              <span class="text-primary font-bold text-sm block mb-1">{{ event.year }}</span>
              <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">{{ event.title }}</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ event.desc }}</p>
            </div>
          </div>
        </div>

        <div class="relative animate-fade-left">
          <UiAppFrame type="browser" url="https://cypass.bj/history" :glass="true"
            class="transform rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            <div class="h-[400px] bg-slate-950 p-0 overflow-hidden font-code text-xs relative">
              <!-- Terminal Header -->
              <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div class="text-slate-400">bash — 80x24</div>
              </div>

              <div class="p-6 space-y-4 text-slate-300">
                <div class="flex">
                  <span class="text-green-400 mr-2">root@cypass:~$</span>
                  <span class="typing-effect">./init_protocol.sh --verbose</span>
                </div>

                <div class="space-y-2 pl-4 border-l border-slate-800 ml-1">
                  <div class="text-slate-500">2023-01-15 09:00:00 [INFO] Initializing Core Systems...</div>
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400">➜</span>
                    <span>Loading Module: <span class="text-yellow-300">DocSentry v1.0</span></span>
                    <span class="text-green-500">[OK]</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400">➜</span>
                    <span>Establishing Secure Node </span>
                    <div class="w-16 h-1 bg-slate-800 rounded overflow-hidden">
                      <div class="h-full bg-green-500 w-full animate-pulse"></div>
                    </div>
                  </div>
                  <div class="text-slate-500">2024-06-20 14:30:12 [INFO] Deployment to Government Cloud Complete.</div>

                  <br />
                  <div class="flex">
                    <span class="text-green-400 mr-2">root@cypass:~$</span>
                    <span>tail -f /var/log/growth.log</span>
                  </div>

                  <div class="text-purple-300">
                    > 2024: 50+ Public Entities Connected<br />
                    > 2025: Private Sector Integration [PENDING]<br />
                    > 2026: AI Threat Detection [SCHEDULED]
                  </div>

                  <div class="animate-pulse">_</div>
                </div>
              </div>

              <!-- Matrix Rain Effect Overlay (Subtle) -->
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none"></div>
            </div>
          </UiAppFrame>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const timeline = [
  {
    year: '2023',
    title: 'La Genèse',
    desc: 'Lancement de l\'initiative CYPASS suite aux nouvelles directives de l\'ASIN pour la sécurisation des services publics.'
  },
  {
    year: '2024',
    title: 'Premiers Pilotes',
    desc: 'Déploiement réussi de DocSentry auprès de deux ministères clés. Validation du modèle de certification.'
  },
  {
    year: '2025',
    title: 'Expansion Nationale',
    desc: 'Ouverture de la plateforme au secteur privé et lancement du SOC communautaire VigiTech.'
  },
  {
    year: '2026',
    title: 'Vers l\'IA',
    desc: 'Intégration prévue de modèles d\'IA souverains pour la détection prédictive des menaces.'
  }
]
</script>
