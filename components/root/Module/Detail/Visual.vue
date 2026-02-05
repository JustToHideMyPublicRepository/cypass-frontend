<template>
  <div class="perspective-1000 p-4 md:p-8">
    <div class="absolute inset-0 bg-gradient-to-tr opacity-20 blur-3xl rounded-full -z-10"
      :class="service.theme === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500'">
    </div>

    <!-- VISUEL: SECUSCAN (Terminal) -->
    <UiAppFrame v-if="service.id === 'secuscan'" type="terminal" title="root@secuscan:~" :glass="true"
      class="shadow-2xl shadow-blue-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
      <div
        class="h-[400px] md:h-[500px] p-4 md:p-6 text-[10px] md:text-sm font-code space-y-3 md:space-y-4 overflow-hidden bg-slate-900/95 text-slate-300">
        <div class="flex gap-2">
          <span class="text-green-500">➜</span>
          <span class="text-blue-400">~</span>
          <span>secuscan --deep --target production</span>
        </div>
        <div class="pl-4 text-slate-500">Initialisation du protocole de scan profond v2.4...</div>
        <div class="pl-4 text-slate-500">Cible: 192.168.1.X (Cluster de Production)</div>
        <div class="pl-4 text-yellow-400">[WARN] Trafic élevé détecté, ajustement du débit...</div>
        <div class="pl-4">Scan des ports [0-65535]... <span class="text-green-400">100%</span></div>

        <div class="border-t border-slate-700 my-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-800 p-2 rounded">
            <div class="text-[9px] md:text-[10px] uppercase text-slate-500">Ports Ouverts</div>
            <div class="text-lg md:text-xl text-white font-bold">14</div>
          </div>
          <div class="bg-slate-800 p-2 rounded">
            <div class="text-[9px] md:text-[10px] uppercase text-slate-500">Vulnérabilités</div>
            <div class="text-lg md:text-xl text-danger font-bold">2</div>
          </div>
        </div>

        <div class="pl-4 mt-4 text-white uppercase text-[10px] md:text-xs tracking-wider">Rapport de Vulnérabilité :
        </div>
        <div class="pl-4 text-danger">1. CVE-2024-XXXX (Critique) - Mauvaise config SSL</div>
        <div class="pl-4 text-yellow-400">2. CVE-2023-XXXX (Moyen) - Fuite d'en-têtes</div>
        <div class="pl-4 text-green-500 mt-2">Génération du plan de remédiation... TERMINÉ</div>
        <span class="animate-pulse">_</span>
      </div>
    </UiAppFrame>

    <!-- VISUEL: VIGITECH (Radar) -->
    <UiAppFrame v-else-if="service.id === 'vigitech'" type="card" :glass="true"
      class="shadow-2xl shadow-green-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
      <div class="relative h-[400px] md:h-[500px] bg-slate-900 overflow-hidden flex flex-col">
        <!-- Grille/Radar BG -->
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.slate.800)_1px,transparent_1px)] bg-[length:30px_30px] md:bg-[length:40px_40px] opacity-20">
        </div>
        <div
          class="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,theme(colors.green.500/0.1)_360deg)] animate-spin-slow">
        </div>

        <!-- En-tête -->
        <div
          class="p-3 md:p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md z-10">
          <div class="flex items-center gap-2 text-green-500 font-code text-[10px] md:text-xs">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            SURVEILLANCE LIVE
          </div>
          <div class="text-[10px] md:text-xs text-slate-500 font-code">LATENCE: 12ms</div>
        </div>

        <!-- Radar Central -->
        <div class="flex-grow relative flex items-center justify-center">
          <div
            class="w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-green-500/20 rounded-full flex items-center justify-center relative">
            <div
              class="w-[140px] h-[140px] md:w-[200px] md:h-[200px] border border-green-500/40 rounded-full flex items-center justify-center">
              <div
                class="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border border-green-500/60 rounded-full flex items-center justify-center bg-green-500/5">
                <IconRadar2 class="w-8 h-8 md:w-10 md:h-10 text-green-500 animate-pulse" />
              </div>
            </div>
            <!-- Points d'Alerte -->
            <div class="absolute top-[20%] right-[30%] w-2 h-2 md:w-3 md:h-3 bg-danger rounded-full animate-ping"></div>
            <div class="absolute bottom-[20%] left-[30%] w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
            </div>
          </div>
        </div>

        <!-- Flux de Menaces -->
        <div class="h-[120px] md:h-[150px] bg-slate-950 border-t border-slate-800 p-3 md:p-4 space-y-2 z-10">
          <div
            class="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mb-1 md:mb-2 text-center md:text-left">
            Alertes Récentes</div>
          <div
            class="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-danger">
            <span class="font-code text-danger">CRITIQUE</span>
            <span class="truncate">Tentative DDoS detectée - Port 443</span>
            <span class="ml-auto text-slate-600 hidden sm:inline">Maintenant</span>
          </div>
          <div
            class="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-slate-300 p-2 bg-slate-900 rounded border border-slate-800 border-l-2 border-l-yellow-500">
            <span class="font-code text-warning">ALERTE</span>
            <span class="truncate">Connexion IP inhabituelle (45.2.X.X)</span>
            <span class="ml-auto text-slate-600 hidden sm:inline">Il y a 2m</span>
          </div>
        </div>
      </div>
    </UiAppFrame>

    <!-- VISUEL: DOCSENTRY (Certificat) -->
    <UiAppFrame v-else-if="service.id === 'docsentry'" type="card" :glass="true"
      class="shadow-2xl shadow-green-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
      <div
        class="h-[400px] md:h-[500px] bg-bgClr flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-green-400 to-emerald-600"></div>

        <div
          class="w-full max-w-sm bg-WtB rounded-lg shadow-xl border border-ash p-6 md:p-8 text-center relative z-10 translate-y-2">
          <div
            class="w-16 h-16 md:w-24 md:h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center text-success mb-4 md:mb-6 relative">
            <IconCertificate class="w-8 h-8 md:w-12 md:h-12" />
            <div class="absolute inset-0 border-4 border-success/20 rounded-full animate-ping-slow"></div>
          </div>

          <div
            class="inline-block px-3 py-1 bg-success/20 text-success text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 md:mb-4">
            Document Certifié
          </div>

          <h3 class="font-serif text-base md:text-2xl font-bold mb-1 md:mb-2 truncate">Contrat_Cadre_v2.pdf</h3>
          <p class="text-[9px] md:text-xs text-slate-500 mb-6 md:mb-8">Signé numériquement le 16 Jan 2024</p>

          <div class="text-left space-y-2 md:space-y-3 text-[10px] md:text-xs border-t border-ash pt-4 md:pt-6">
            <div class="flex justify-between">
              <span class="text-slate-500">Signataire</span>
              <span class="font-bold text-BtW">Ministère de l'Économie</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Algorithme</span>
              <span class="font-code text-BtW">SHA-256 / RSA-4096</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Empreinte</span>
              <span class="font-code truncate w-24 md:w-32">8f3a...29b1</span>
            </div>
          </div>
        </div>

        <!-- Motif de Fond -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5">
        </div>
      </div>
    </UiAppFrame>

    <!-- VISUEL: LEAKMONITOR (Explorateur) -->
    <UiAppFrame v-else type="browser" url="https://monitor.cypass.bj/dashboard" :glass="true"
      class="shadow-2xl shadow-blue-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
      <div class="h-[400px] md:h-[500px] bg-bgClr flex flex-col">
        <!-- Barre d'outils -->
        <div class="h-10 md:h-12 border-b border-ash flex items-center px-4 gap-2 md:gap-4 bg-WtB">
          <div class="px-2 md:px-3 py-1 bg-ash rounded text-[9px] md:text-xs text-slate-500">Filtre: Toutes Sources
          </div>
          <div
            class="px-2 md:px-3 py-1 bg-danger/20 text-danger rounded text-[9px] md:text-xs font-bold uppercase tracking-tighter sm:tracking-normal">
            Risque Élevé</div>
        </div>

        <!-- Contenu -->
        <div class="p-3 md:p-4 space-y-3 overflow-hidden">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-2 md:mb-4">
            <div class="p-3 md:p-4 bg-WtB rounded-lg shadow-sm border border-ash text-center">
              <div class="text-xl md:text-2xl font-bold text-BtW">0</div>
              <div class="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-tighter sm:tracking-normal">Fuites
                Actives</div>
            </div>
            <div class="p-3 md:p-4 bg-WtB rounded-lg shadow-sm border border-ash text-center">
              <div class="text-xl md:text-2xl font-bold text-BtW">124</div>
              <div class="text-[8px] md:text-[10px] text-slate-400 uppercase tracking-tighter sm:tracking-normal">
                Documents</div>
            </div>
            <div
              class="col-span-2 p-3 md:p-4 bg-gradient-to-r from-primary to-secondary rounded-lg shadow-sm text-white flex items-center justify-between px-4 md:px-6">
              <div>
                <div class="font-bold text-xs md:text-base">Protection Active</div>
                <div class="text-[9px] md:text-xs opacity-80">Scan : il y a 2 min</div>
              </div>
              <IconShieldCheck class="w-6 h-6 md:w-8 md:h-8 opacity-80" />
            </div>
          </div>

          <!-- Lignes Fictives -->
          <div v-for="i in 4" :key="i"
            class="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
            <div class="w-6 h-6 md:w-8 md:h-8 bg-ash rounded flex items-center justify-center text-slate-400">
              <IconFileText class="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="h-1.5 md:h-2 bg-ash rounded w-1/3 mb-1"></div>
              <div class="h-1.5 md:h-2 bg-ashAct rounded w-1/4"></div>
            </div>
            <div
              class="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-100 text-green-600 text-[8px] md:text-[10px] rounded font-bold">
              SÉCURISÉ</div>
          </div>
        </div>
      </div>
    </UiAppFrame>
  </div>
</template>

<script setup lang="ts">
import { IconRadar2, IconCertificate, IconFileText, IconShieldCheck } from '@tabler/icons-vue'

defineProps<{
  service: any
}>()
</script>
