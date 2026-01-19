<template>
  <section class="py-24 relative overflow-hidden bg-bgClr">
    <!-- Background Elements -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]">
    </div>
    <div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-ash to-transparent">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-up">
        <span
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Pipeline de Sécurité
        </span>
        <h2 class="text-3xl md:text-5xl font-bold text-BtW mb-6">
          Protection en <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-success">
            temps réel</span>
        </h2>
        <p class="text-lg text-hsa">
          Une approche systémique pour sécuriser, certifier et surveiller votre infrastructure critique.
        </p>
      </div>

      <!-- Pipeline Container -->
      <div class="relative grid md:grid-cols-3 gap-8">
        <!-- Connecting Line (Desktop) -->
        <div
          class="hidden md:block absolute top-[25%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent">
        </div>
        <div
          class="hidden md:block absolute top-[25%] left-0 h-0.5 w-[30%] bg-gradient-to-r from-transparent to-primary blur-[2px] animate-beam">
        </div>

        <!-- Metric Floating Elements -->
        <div class="absolute -top-10 left-10 hidden lg:block animate-float-slow">
          <div class="font-code text-[10px] text-primary/40">RX: 104.2 Mb/s</div>
        </div>
        <div class="absolute -bottom-10 right-10 hidden lg:block animate-float-delayed">
          <div class="font-code text-[10px] text-success/40">SYS: STABLE</div>
        </div>

        <!-- Step 1: Audit (Terminal) -->
        <div class="group relative pt-12 md:pt-0">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- Terminal Window -->
            <UiAppFrame type="terminal" title="secuscan_audit.sh" rounded="rounded-lg" shadow="shadow-2xl"
              class="transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-primary/20"
              body-class="h-[180px] flex flex-col">
              <div class="text-success space-y-1">
                <p>> init_secuscan --target=all</p>
                <p class="text-slate-400">Scanning ports [22, 80, 443]...</p>
                <p class="flex items-center gap-2">
                  <span class="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <span class="block h-full bg-success animate-[width_2s_ease-in-out_infinite]"
                      style="width: 70%"></span>
                  </span>
                  <span class="text-blue-300">Done</span>
                </p>
                <p>> analyzing_vulnerabilities...</p>
                <p class="text-yellow-300">! Warning: Config check recommended</p>
                <p class="text-success">> optimization_complete</p>
                <span class="animate-pulse">_</span>
              </div>
            </UiAppFrame>

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span class="font-bold">01</span>
              </div>
              <h3 class="text-lg font-bold text-BtW mb-2">Audit SecuScan</h3>
              <p class="text-sm text-hsa">Analyse automatique de votre surface d'attaque et
                identification des vulnérabilités.</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Certification (Digital ID) -->
        <div class="group relative pt-12 md:pt-0">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- ID Card -->
            <div
              class="bg-WtB rounded-xl shadow-2xl border border-ash p-1 relative overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-secondary/20 h-[213px]">
              <!-- Scanning Light Effect -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-transparent -translate-y-full group-hover:animate-scan z-20 pointer-events-none">
              </div>

              <div class="h-full bg-bgClr rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
                <!-- Card Header -->
                <div class="flex justify-between items-start">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center text-secondary">
                      <IconKey class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="text-[10px] text-hsa uppercase font-bold tracking-wider">CYPASS ID</div>
                      <div class="text-xs font-bold text-BtW">DocSentry Cert</div>
                    </div>
                  </div>
                  <IconVersions class="w-8 h-8 text-ashAct" />
                </div>

                <!-- Chip -->
                <div class="my-4 flex items-center gap-4">
                  <div
                    class="w-10 h-8 rounded border border-ashAct bg-gradient-to-br from-yellow-200 to-yellow-400 relative overflow-hidden opacity-80">
                    <div class="absolute inset-0 border-t border-b border-yellow-600/20 top-1/2 -translate-y-1/2"></div>
                    <div class="absolute inset-0 border-l border-r border-yellow-600/20 left-1/2 -translate-x-1/2">
                    </div>
                  </div>
                  <div class="font-code text-[10px] text-hsa tracking-tighter">
                    KEY: 8F3A-29B1-XXXX<br>
                    EXP: 12/2028
                  </div>
                </div>

                <!-- Status Footer -->
                <div class="flex items-center justify-between border-t border-ash pt-3">
                  <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span class="text-[10px] font-bold text-success uppercase">Vérifié</span>
                  </div>
                  <div class="text-[10px] text-hsa font-code">
                    #CS-8812
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10 text-secondary mb-3 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                <span class="font-bold">02</span>
              </div>
              <h3 class="text-lg font-bold text-BtW mb-2">Certification</h3>
              <p class="text-sm text-hsa">Émission de certificats numériques qualifiés et
                identité organisationnelle.</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Monitoring (Radar) -->
        <div class="group relative pt-12 md:pt-0">
          <div class="relative z-10 mx-auto w-full max-w-[320px]">
            <!-- Radar Interface -->
            <div
              class="bg-slate-900 rounded-xl shadow-2xl border border-slate-700/50 p-4 h-[213px] relative overflow-hidden transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-success/20">

              <!-- Radar Grid Background -->
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.slate.800)_1px,transparent_1px)] bg-[length:10px_10px] opacity-20">
              </div>

              <!-- Rotating Radar -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-32 h-32 rounded-full border border-success/30 relative">
                  <div class="absolute inset-0 rounded-full border border-success/10 animate-[ping_3s_linear_infinite]">
                  </div>
                  <div
                    class="absolute w-full h-full rounded-full bg-gradient-to-r from-transparent via-success/10 to-transparent animate-spin-slow opacity-50">
                  </div>
                </div>
              </div>

              <!-- Overlay UI -->
              <div class="relative z-10 h-full flex flex-col justify-between">
                <div class="flex justify-between items-start">
                  <div class="text-[10px] font-code text-success/80">SYSTEM_ACTIVE</div>
                  <IconWifi class="w-4 h-4 text-success animate-pulse" />
                </div>

                <div class="space-y-2 font-code text-[10px]">
                  <div class="flex justify-between text-slate-400">
                    <span>UPTIME</span>
                    <span class="text-white">99.99%</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>LATENCY</span>
                    <span class="text-white">12ms</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>THREATS</span>
                    <span class="text-success">0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-success/10 text-success mb-3 group-hover:bg-success group-hover:text-white transition-colors duration-300">
                <span class="font-bold">03</span>
              </div>
              <h3 class="text-lg font-bold text-BtW mb-2">Protection Continue</h3>
              <p class="text-sm text-hsa">Surveillance 24/7 par VigiTech et alerting en temps
                réel.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconKey, IconWifi, IconVersions } from '@tabler/icons-vue'
</script>

<style scoped>
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(200%);
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

@keyframes beam {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: translateX(200%);
    opacity: 0;
  }
}

.animate-beam {
  animation: beam 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@keyframes width {

  0%,
  100% {
    width: 0%;
  }

  50% {
    width: 100%;
  }
}
</style>
