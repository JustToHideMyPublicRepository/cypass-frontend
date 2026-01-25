<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">VigiTech</h1>
      <p class="text-hsa">Veille cybernétique et alertes en temps réel</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Feed -->
      <div class="lg:col-span-3 space-y-6">
        <UiBaseCard v-for="alert in cypassData.alerts" :key="alert.id" class="border-l-4" :class="[
          alert.severity === 'High' ? 'border-l-danger' :
            alert.severity === 'Medium' ? 'border-l-warning' : 'border-l-primary'
        ]">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div class="text-hsa">
                <div class="text-center w-12 pt-1">
                  <div class="text-xs font-bold uppercase">{{ new
                    Date(alert.timestamp).toLocaleString('default', { month: 'short' }) }}</div>
                  <div class="text-2xl font-bold leading-none">{{ new
                    Date(alert.timestamp).getDate() }}</div>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <UiStatusBadge :status="alert.severity" />
                  <span class="text-xs text-hsa">{{ new Date(alert.timestamp).toLocaleTimeString()
                  }}</span>
                </div>
                <h3 class="text-lg font-semibold">{{ alert.title }}</h3>
                <p class="text-hsa mt-2">{{ alert.description }}</p>
              </div>
            </div>
            <button class="text-hsa hover:text-primary">
              <IconShare class="w-5 h-5" />
            </button>
          </div>

          <!-- Mock comments/actions -->
          <div class="mt-4 pt-4 border-t border-ash flex gap-4 text-sm text-hsa">
            <button class="flex items-center gap-1 hover:text-BtW">
              <IconCheck class="w-4 h-4" /> Marquer comme lu
            </button>
            <button class="flex items-center gap-1 hover:text-BtW">
              <IconEye class="w-4 h-4" /> Voir log brut
            </button>
          </div>
        </UiBaseCard>
      </div>

      <!-- Sidebar Widgets -->
      <div class="space-y-6">
        <UiBaseCard title="Sources Surveillées">
          <ul class="space-y-3 text-sm">
            <li class="flex justify-between items-center text-hsa">
              <span>Traffic Réseau</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Logs Système</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Feeds CERT-BJ</span>
              <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            </li>
            <li class="flex justify-between items-center text-hsa">
              <span>Dark Web Monitor</span>
              <span class="w-2 h-2 rounded-full bg-warning"></span>
            </li>
          </ul>
        </UiBaseCard>

        <UiBaseCard class="bg-blue-600 text-white border-none">
          <h3 class="font-bold mb-2 flex items-center gap-2">
            <IconBroadcast class="w-5 h-5" /> Mode Veille
          </h3>
          <p class="text-sm text-blue-100 mb-4">Le système analyse 24/7 les menaces potentielles ciblant
            l'infrastructure gouvernementale.</p>
          <div class="w-full bg-blue-800/50 rounded-full h-1.5 mb-1 overflow-hidden">
            <div class="bg-white/80 h-1.5 rounded-full w-2/3 animate-[pulse_2s_infinite]"></div>
          </div>
          <div class="text-xs text-blue-200 text-right">Analyse en cours...</div>
        </UiBaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconShare, IconCheck, IconEye, IconBroadcast } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default'
})

const cypassData = useCypassData()

useHead({
  title: 'VigiTech'
})
</script>
