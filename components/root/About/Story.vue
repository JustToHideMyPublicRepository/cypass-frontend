<template>
  <section class="py-12 md:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid lg:grid-cols-2 gap-12 md:gap-16">
        <div class="animate-fade-right">
          <h2 class="text-2xl md:text-4xl font-bold mb-6">Notre Histoire</h2>
          <div class="space-y-8 relative pl-6 md:pl-8 border-l-2 border-ash">
            <div v-for="event in timeline" :key="event.year" class="relative">
              <div
                class="absolute -left-[33px] md:-left-[41px] top-0 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-WtB bg-primary">
              </div>
              <span class="text-primary font-bold text-sm block mb-1">{{ event.year }}</span>
              <h3 class="font-bold text-base md:text-lg mb-2">{{ event.title }}</h3>
              <p class="text-xs md:text-sm text-hsa leading-relaxed">{{ event.desc }}</p>
            </div>
          </div>
        </div>

        <div class="relative animate-fade-left">
          <UiAppFrame type="browser" url="https://cypass.bj/history" :glass="true"
            class="transform rotate-0 md:rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl">
            <div
              class="h-[300px] md:h-[400px] bg-slate-950 p-0 overflow-hidden font-code text-[10px] md:text-xs relative">
              <!-- En-tête du terminal -->
              <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <div class="text-slate-400">bash — 80x24</div>
              </div>

              <div class="p-4 md:p-6 space-y-3 md:space-y-4 text-slate-300">
                <div class="flex">
                  <span class="text-green-400 mr-2">root@cypass:~$</span>
                  <span class="typing-effect">./init_protocol.sh --verbose</span>
                </div>

                <div class="space-y-2 pl-4 border-l border-slate-800 ml-1">
                  <div class="text-slate-500">2025-04-15 09:00:00 [INFO] Inscription au Programme CyberIncub...</div>
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400 text-[8px] md:text-xs">➜</span>
                    <span>Lancement : <span class="text-yellow-300">Phase d'Accélération</span></span>
                    <span class="text-green-500">[OK]</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400 text-[8px] md:text-xs">➜</span>
                    <span>Établissement du SOC Communautaire </span>
                    <div class="w-12 md:w-16 h-1 bg-slate-800 rounded overflow-hidden">
                      <div class="h-full bg-green-500 w-full animate-pulse"></div>
                    </div>
                  </div>
                  <div class="text-slate-500">2025-11-20 14:30:12 [INFO] Déploiement des modules de confiance terminé.
                  </div>

                  <br />
                  <div class="flex">
                    <span class="text-green-400 mr-2">root@cypass:~$</span>
                    <span>tail -f /var/log/growth.log</span>
                  </div>

                  <div class="text-purple-300">
                    > Oct. 25: Sélection & Incubation Cyber [OK]<br />
                    > Nov. 25: Lancement MVP & Expansion [EN COURS]<br />
                    > 2026: Déploiement du MVP et une expansion [CONTINUE]
                  </div>

                  <div class="animate-pulse">_</div>
                </div>
              </div>

              <!-- Effet Matrix Rain Overlay (Subtil) -->
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
    year: 'Avril 2025',
    title: 'L\'éveil',
    desc: 'Candidature au programme CyberIncub, marquant la première étape vers la révolution de la confiance numérique.'
  },
  {
    year: 'Octobre 2025',
    title: 'La sélection',
    desc: 'CYPASS est officiellement sélectionné parmi les dossiers les plus prometteurs pour intégrer l\'écosystème cyber.'
  },
  {
    year: 'Novembre 2025',
    title: 'L\'envol',
    desc: 'Démarrage officiel du programme d\'incubation et accélération du développement des modules DocSentry et VigiTech.'
  },
  {
    year: '2026',
    title: 'L\'horizon',
    desc: 'L\'aventure continue avec le déploiement du MVP et une expansion continue de notre solution de confiance numérique.'
  }
]
</script>
