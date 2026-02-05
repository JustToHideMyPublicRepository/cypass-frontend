<template>
  <UiAppFrame type="terminal" title="root@secuscan:~" :glass="true"
    class="shadow-2xl shadow-blue-500/10 md:transform md:rotate-y-[-5deg] md:rotate-x-[5deg] md:hover:rotate-0 transition-transform duration-700">
    <div
      class="h-[400px] md:h-[500px] p-4 md:p-6 text-[10px] md:text-sm font-code space-y-3 md:space-y-4 overflow-hidden bg-slate-900/95 text-slate-300">
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>secuscan --deep --target production</span>
      </div>
      <div class="pl-4 text-slate-500">Initialisation du protocole de scan profond v2.4...</div>
      <div class="pl-4 text-slate-500">Cible: 192.168.1.X (Cluster de Production)</div>
      <div class="pl-4 text-warning">[WARN] Trafic élevé détecté, ajustement du débit...</div>
      <div class="pl-4">Scan des ports [0-65535]... <span class="text-success">100%</span></div>

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
</template>
