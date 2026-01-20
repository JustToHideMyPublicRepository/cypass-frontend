<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vue d'ensemble</h1>
      <div class="text-sm text-hsa">Dernière mise à jour: Aujourd'hui à 12:45</div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Docs Stat -->
      <UiBaseCard class="bg-gradient-to-br from-blue-500 to-blue-600 border-none text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-blue-100 font-medium mb-1">Documents Certifiés</p>
            <h3 class="text-3xl font-bold">1,248</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconFileCertificate class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-blue-100">
          <span class="bg-white/20 px-1.5 py-0.5 rounded mr-2">+12%</span>
          depuis le mois dernier
        </div>
      </UiBaseCard>

      <!-- Alerts Stat -->
      <UiBaseCard class="bg-gradient-to-br from-red-500 to-red-600 border-none text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-red-100 font-medium mb-1">Alertes Critiques</p>
            <h3 class="text-3xl font-bold">3</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconAlertTriangle class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-red-100">
          <span class="bg-white/20 px-1.5 py-0.5 rounded mr-2">+1 new</span>
          cette semaine
        </div>
      </UiBaseCard>

      <!-- Vuln Stat -->
      <UiBaseCard class="bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-emerald-100 font-medium mb-1">Score Sécurité</p>
            <h3 class="text-3xl font-bold">A+</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconShieldLock class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-emerald-100">
          Base infrastructure saine
        </div>
      </UiBaseCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Alerts -->
      <UiBaseCard title="Alertes Récentes" class="h-full">
        <template #header>
          <UiBaseButton variant="secondary" size="sm">Voir tout</UiBaseButton>
        </template>
        <div class="space-y-4">
          <div v-for="alert in cypassData.alerts" :key="alert.id"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-ash/50 transition-colors">
            <div :class="[
              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
              alert.severity === 'High' ? 'bg-danger' :
                alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-primary'
            ]"></div>
            <div>
              <h4 class="text-sm font-semibold">{{ alert.title }}</h4>
              <p class="text-xs text-hsa mt-1">{{ alert.description }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ formatTime(alert.timestamp) }}</p>
            </div>
          </div>
        </div>
      </UiBaseCard>

      <!-- Recent Docs -->
      <UiBaseCard title="Derniers Documents" class="h-full">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-hsa uppercase bg-ash/50">
              <tr>
                <th class="px-4 py-3">Nom</th>
                <th class="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in cypassData.documents.slice(0, 3)" :key="doc.id"
                class="border-b border-ash last:border-0 hover:bg-ash/30">
                <td class="px-4 py-3 font-medium">{{ doc.name }}</td>
                <td class="px-4 py-3">
                  <UiStatusBadge :status="doc.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFileCertificate, IconAlertTriangle, IconShieldLock } from '@tabler/icons-vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth' // Mock middleware, assuming we might implement it
})

const cypassData = useCypassData()

// Basic date formatter for mock data
const formatTime = (ts: string) => {
  return new Date(ts).toLocaleString()
}

useHead({
  title: 'Tableau de bord'
})
</script>
