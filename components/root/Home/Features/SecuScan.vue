<template>
  <UiAppFrame type="terminal" title="root@secuscan:~" :glass="true"
    class="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
    <div
      class="h-[300px] md:h-[350px] p-3 md:p-4 text-[10px] md:text-xs font-code space-y-2 overflow-hidden bg-WtB text-hsa">
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>nmap -sV -p- target.gov.bj</span>
      </div>
      <div class="pl-4 text-hsa opacity-70">Lancement de Nmap 7.92 à 2024-01-16 14:00 CET</div>
      <div class="pl-4">Rapport de scan Nmap pour target.gov.bj (10.0.0.1)</div>
      <div class="pl-4">L'hôte est actif (latence de 0.002s).</div>
      <div class="pl-4 text-hsa opacity-70">Non affiché : 65532 ports tcp fermés (reset)</div>
      <div class="pl-4 text-BtW font-bold uppercase tracking-tight">PORT ÉTAT SERVICE VERSION</div>
      <div class="pl-4"><span class="text-success">80/tcp ouvert http</span> nginx 1.18.0</div>
      <div class="pl-4"><span class="text-success">443/tcp ouvert ssl/https</span> nginx 1.18.0</div>
      <div class="pl-4"><span class="text-warning">8080/tcp ouvert http-proxy</span> inconnu</div>
      <br>
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>vuln-scan --target 10.0.0.1 --deep</span>
      </div>
      <div class="pl-4 text-hsa opacity-70">[+] Initialisation de la base de données...</div>
      <div class="pl-4 text-hsa opacity-70">[+] Vérification de CVE-2023-XXXX...</div>
      <div class="pl-4 text-danger font-bold">[!] FAILLE POTENTIELLE DÉTECTÉE : Protocole SSL obsolète</div>
      <div class="pl-4 text-success">Génération du rapport........... TERMINÉ</div>
      <span class="animate-pulse">_</span>
    </div>
  </UiAppFrame>
</template>
