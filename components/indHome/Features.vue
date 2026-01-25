<template>
  <section id="features" class="py-32 relative">
    <!-- Section Decor -->
    <div class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-r from-primary/5 to-transparent skew-y-6 -z-10">
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-40">

      <div v-for="(service, index) in featureServices" :key="service.id"
        class="grid lg:grid-cols-2 gap-20 items-center group">

        <!-- Text Content -->
        <div :class="['space-y-8', index % 2 === 1 ? 'lg:order-1' : 'lg:order-2']" class="animate-fade-up">
          <span class="badge"
            :class="service.status === 'available' ? (service.theme === 'blue' ? 'badge-primary' : 'badge-success') : 'bg-ash text-hsa border-ash'">
            {{ service.status === 'available' ? service.badge : 'Bientôt Disponible' }}
          </span>

          <h2 class="text-4xl md:text-5xl font-bold leading-tight">
            {{ service.title }}<span :class="service.theme === 'blue' ? 'text-primary' : 'text-success'">.</span>
          </h2>

          <h3 class="text-2xl text-hsa font-light">
            {{ service.subtitle }}
          </h3>

          <p class="text-lg text-hsa leading-relaxed">
            {{ service.description }}
          </p>

          <!-- Features List -->
          <div v-if="service.features" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="feature in service.features" :key="feature.title" class="flex items-start gap-4">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                service.theme === 'blue' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
              ]">
                <component :is="feature.icon" class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-BtW">{{ feature.title }}</h4>
                <p class="text-sm text-hsa mt-1">{{ feature.desc }}</p>
              </div>
            </div>
          </div>

          <ul v-if="service.list" class="space-y-4">
            <li v-for="item in service.list" :key="item" class="flex items-center gap-3">
              <IconCheck :class="['w-5 h-5', service.theme === 'blue' ? 'text-primary' : 'text-success']" />
              <span class="font-medium">{{ item }}</span>
            </li>
          </ul>

          <div class="pt-4">
            <UiBaseButton v-if="service.status === 'available'" :to="`/modules/${service.id}`" variant="secondary"
              class="pl-0 hover:pl-4 transition-all !bg-transparent border-none shadow-none"
              :class="service.theme === 'blue' ? 'text-primary' : 'text-success'">
              {{ service.cta }}
              <IconArrowRight class="w-4 h-4 ml-2" />
            </UiBaseButton>
            <UiBaseButton v-else :to="`/coming-soon?service=${service.id}`" variant="ghost"
              class="text-hsa hover:text-primary">
              Disponible prochainement
            </UiBaseButton>
          </div>
        </div>

        <!-- Visual Content -->
        <div class="relative" :class="index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'">
          <div
            :class="['absolute inset-0 blur-[120px] opacity-10 rounded-full group-hover:opacity-20 transition-opacity duration-700', service.theme === 'blue' ? 'bg-primary' : 'bg-success']">
          </div>

          <!-- DocSentry Visual -->
          <UiAppFrame v-if="service.id === 'docsentry'" type="card"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-1" :glass="true">
            <template #headerActions>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-successAct animate-pulse"></span>
                <span class="text-[10px] font-bold text-hsa uppercase tracking-widest">Validé</span>
              </div>
            </template>
            <div class="p-4 min-h-[350px] flex items-center justify-center">
              <div class="relative z-10 w-full max-w-sm bg-WtB shadow-2xl rounded-xl overflow-hidden border border-ash">
                <div class="h-2 bg-gradient-to-r from-secondary to-primary"></div>
                <div class="p-8 text-center">
                  <div
                    class="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center text-success mb-6 relative">
                    <IconCertificate class="w-10 h-10 relative z-10" />
                    <div class="absolute inset-0 rounded-full border-2 border-success/50 animate-ping opacity-20">
                    </div>
                  </div>
                  <h4 class="font-serif text-2xl font-bold mb-2">
                    Certifié Conforme</h4>
                  <p class="text-xs text-hsa mb-6 uppercase tracking-wider">République du Bénin
                  </p>
                  <div class="text-[10px] font-code text-ashAct border-t border-ash pt-4">
                    SHA-256: 8f3a...29b1
                  </div>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- VigiTech Visual -->
          <UiAppFrame v-else-if="service.id === 'vigitech'" type="card"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true">
            <div class="relative h-[350px] overflow-hidden bg-WtB flex items-center justify-center">
              <!-- Radar Background -->
              <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-success)_1px,transparent_1px)] opacity-20 bg-[length:24px_24px]">
              </div>
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-WtB/50 to-WtB"></div>

              <!-- Radar Circles -->
              <div class="absolute w-[400px] h-[400px] border border-success/30 rounded-full"></div>
              <div class="absolute w-[300px] h-[300px] border border-success/20 rounded-full"></div>
              <div class="absolute w-[200px] h-[200px] border border-success/40 rounded-full animate-pulse"></div>

              <!-- Scanning Line -->
              <div
                class="absolute w-[200px] h-[200px] bg-gradient-to-tr from-transparent to-success/20 rounded-full animate-spin-slow origin-bottom-left"
                style="transform-origin: center;"></div>

              <!-- Alert Points -->
              <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-danger rounded-full animate-ping"></div>
              <div class="absolute top-[30%] left-[60%] w-3 h-3 bg-danger rounded-full"></div>

              <div class="absolute bottom-[40%] right-[30%] w-2 h-2 bg-warning rounded-full animate-pulse"></div>

              <!-- Overlay Text -->
              <div
                class="absolute bottom-6 left-6 right-6 p-4 bg-ash/90 backdrop-blur-sm rounded-xl border border-ashAct">
                <div class="flex items-center gap-3">
                  <IconRadar2 class="w-6 h-6 text-success animate-spin-slow" />
                  <div>
                    <div class="text-xs font-bold text-BtW uppercase tracking-wider">Menace Détectée</div>
                    <div class="text-[10px] text-hsa font-code">IP: 192.168.X.X • Port Scan Multiples</div>
                  </div>
                  <button
                    class="ml-auto px-3 py-1 bg-danger/10 text-danger text-xs font-bold rounded hover:bg-danger/20">Bloquer</button>
                </div>
              </div>
            </div>
          </UiAppFrame>

          <!-- SecuScan Visual -->
          <UiAppFrame v-else-if="service.id === 'secuscan'" type="terminal" title="root@secuscan:~" :glass="true"
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

          <!-- LeakMonitor Visual -->
          <UiAppFrame v-else-if="service.id === 'leakmonitor'" type="browser" url="https://monitor.cypass.bj/alerts"
            class="transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1" :glass="true">
            <div class="h-[350px] bg-bgClr p-4 overflow-hidden relative">
              <!-- Header Stats -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
                  <div class="text-[10px] text-hsa uppercase">Fuites</div>
                  <div class="text-lg font-bold text-danger">0</div>
                </div>
                <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
                  <div class="text-[10px] text-hsa uppercase">Sources</div>
                  <div class="text-lg font-bold text-BtW">142</div>
                </div>
                <div class="bg-WtB p-3 rounded-lg shadow-sm border border-ash">
                  <div class="text-[10px] text-hsa uppercase">Status</div>
                  <div class="text-lg font-bold text-success">Actif</div>
                </div>
              </div>

              <!-- File List -->
              <div class="space-y-2">
                <div v-for="i in 4" :key="i"
                  class="flex items-center gap-3 p-3 bg-WtB rounded-lg border border-ash shadow-sm">
                  <div :class="i === 1 ? 'bg-danger/10 text-danger' : 'bg-ash text-hsa'"
                    class="w-8 h-8 rounded flex items-center justify-center">
                    <IconFileReport class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-bold truncate">CONFIDENTIEL_RAPPORT_{{
                      2023 + i
                    }}.pdf</div>
                    <div class="text-[10px] text-hsa">Detecté sur Pastebin • Il y a {{ i * 5 }} min</div>
                  </div>
                  <div v-if="i === 1" class="px-2 py-0.5 bg-danger text-white text-[10px] font-bold rounded">KRITIK
                  </div>
                  <div v-else class="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold rounded">SECURE</div>
                </div>
              </div>

              <!-- Blur overlay for depth -->
              <div class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-bgClr to-transparent">
              </div>
            </div>
          </UiAppFrame>

          <!-- Fallback Image (just in case) -->
          <img v-else-if="service.image" :src="service.image" :alt="service.title"
            class="rounded-3xl w-full object-cover h-[400px] shadow-2xl"
            :class="{ 'grayscale opacity-60': service.status !== 'available' }" />

          <div v-if="service.status !== 'available'"
            class="absolute inset-0 flex items-center justify-center bg-WtB/50 backdrop-blur-[1px] z-20 rounded-3xl group-hover:bg-WtB/40 transition-colors">
            <NuxtLink :to="`/coming-soon?service=${service.id}`"
              class="px-6 py-3 bg-BtW text-WtB rounded-full font-bold shadow-xl border border-ash hover:scale-105 transition-transform">
              Bientôt Disponible
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconCheck, IconArrowRight, IconFileReport, IconCertificate, IconRadar2 } from '@tabler/icons-vue'
import { modules } from '@/data/modules'

const featureServices = computed(() => modules)
</script>
