<template>
  <UiAppFrame type="terminal" title="root@secuscan:~" :glass="true"
    class="transform-gpu transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-[0_10px_30px_rgba(0,0,0,0.15)] group relative overflow-hidden">
    
    <!-- Effet Scanline -->
    <div class="absolute inset-x-0 inset-y-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-20 opacity-50 dark:opacity-20"></div>
    <div class="absolute top-10 left-0 w-full h-[3px] bg-success/40 blur-[1px] animate-scanline pointer-events-none z-20"></div>

    <div
      class="h-[300px] md:h-[350px] p-4 md:p-5 text-[10px] md:text-xs font-code space-y-2 overflow-hidden bg-[#0a0a0a] text-hsa relative z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>nmap -sV -p- target.gov.bj</span>
      </div>
      <div class="pl-4 text-hsa opacity-70">Lancement de Nmap 7.92 à {{ scanDate }} CET</div>
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

<script setup lang="ts">
import { getRandomPastDate } from '~/utils/date'
import { format } from 'date-fns'

const scanDate = computed(() => {
  const date = getRandomPastDate(5, 21)
  return format(date, 'yyyy-MM-dd HH:mm')
})
</script>

<style scoped>
@keyframes scanline {
  0% { transform: translateY(-10px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(340px); opacity: 0; }
}
.animate-scanline {
  animation: scanline 4s linear infinite;
}
</style>
