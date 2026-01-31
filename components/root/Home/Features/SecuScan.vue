<template>
  <UiAppFrame type="terminal" title="root@secuscan:~" :glass="true"
    class="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1">
    <div class="h-[350px] p-4 text-xs font-code space-y-2 overflow-hidden bg-WtB text-hsa">
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>nmap -sV -p- target.gov.bj</span>
      </div>
      <div class="pl-4 text-hsa opacity-70">Starting Nmap 7.92 at 2024-01-16 14:00 CET</div>
      <div class="pl-4">Nmap scan report for target.gov.bj (10.0.0.1)</div>
      <div class="pl-4">Host is up (0.002s latency).</div>
      <div class="pl-4 text-hsa opacity-70">Not shown: 65532 closed tcp ports (reset)</div>
      <div class="pl-4 text-BtW font-bold">PORT STATE SERVICE VERSION</div>
      <div class="pl-4"><span class="text-success">80/tcp open http</span> nginx 1.18.0</div>
      <div class="pl-4"><span class="text-success">443/tcp open ssl/https</span> nginx 1.18.0</div>
      <div class="pl-4"><span class="text-warning">8080/tcp open http-proxy</span> unknown</div>
      <br>
      <div class="flex gap-2">
        <span class="text-success">➜</span>
        <span class="text-primary">~</span>
        <span>vuln-scan --target 10.0.0.1 --deep</span>
      </div>
      <div class="pl-4 text-hsa opacity-70">[+] Initializing vulnerability database...</div>
      <div class="pl-4 text-hsa opacity-70">[+] Checking CVE-2023-XXXX...</div>
      <div class="pl-4 text-danger">[!] POTENTIAL FLLAW DETECTED: Outdated SSL Protocol</div>
      <div class="pl-4 text-success">Generating Report........... DONE</div>
      <span class="animate-pulse">_</span>
    </div>
  </UiAppFrame>
</template>
