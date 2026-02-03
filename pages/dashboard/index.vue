<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Vue d'ensemble</h1>
      <div class="text-sm text-hsa">Dernière mise à jour: {{ currentTime }}</div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Docs Stat -->
      <UiBaseCard class="bg-gradient-to-br from-primary to-secondary border-none text-WtB">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium mb-1">Documents Certifiés</p>
            <h3 class="text-3xl font-bold">{{ documentsStore.pagination?.total || 0 }}</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconFileCertificate class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm opacity-80">
          Total documents sécurisés
        </div>
      </UiBaseCard>

      <!-- Alerts Stat -->
      <UiBaseCard class="bg-gradient-to-br from-danger to-dangerAct border-none text-WtB">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium mb-1">Alertes Non Lues</p>
            <h3 class="text-3xl font-bold">{{ notificationsStore.unreadCount }}</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconAlertTriangle class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm opacity-80">
          {{ notificationsStore.unreadCount > 0 ? 'Action requise immédiate' : 'Aucune alerte en attente' }}
        </div>
      </UiBaseCard>

      <!-- Sessions Stat -->
      <UiBaseCard class="bg-gradient-to-br from-ash to-hsa/20 border-ash text-BtW">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium mb-1 text-hsa">Appareils Actifs</p>
            <h3 class="text-3xl font-bold">{{ activeSessionsCount }}</h3>
          </div>
          <div class="p-2 bg-primary/10 rounded-lg text-primary">
            <IconDevices class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-hsa">
          Sessions en cours
        </div>
      </UiBaseCard>

      <!-- Vuln Stat -->
      <UiBaseCard class="bg-gradient-to-br from-success to-successAct border-none text-BtW">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium mb-1">Score Sécurité</p>
            <h3 class="text-3xl font-bold">A+</h3>
          </div>
          <div class="p-2 bg-white/20 rounded-lg">
            <IconShieldLock class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm opacity-80">
          Base infrastructure saine
        </div>
      </UiBaseCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Alerts -->
      <UiBaseCard title="Alertes Récentes">
        <template #header>
          <UiBaseButton variant="secondary" size="sm" @click="navigateTo('/dashboard/notifications')">Voir tout
          </UiBaseButton>
        </template>
        <div class="space-y-4">
          <div v-if="notificationsStore.loading && !notificationsStore.notifications.length" class="py-10 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="!notificationsStore.notifications.length" class="py-10 text-center text-hsa">
            Aucune alerte récente
          </div>
          <div v-for="alert in notificationsStore.notifications.slice(0, 4)" :key="alert.id"
            class="flex items-start gap-4 p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
            @click="navigateTo(`/dashboard/notifications/${alert.id}`)">
            <div :class="[
              'w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-transform group-hover:scale-125',
              alert.is_read ? 'bg-ash' : alert.priority === 'high' ? 'bg-danger' : 'bg-primary'
            ]"></div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-bold text-BtW truncate">{{ alert.title }}</h4>
              <p class="text-[10px] text-hsa mt-0.5">{{ formatTime(alert.created_at) }}</p>
            </div>
          </div>
        </div>
      </UiBaseCard>

      <!-- Recent Docs -->
      <UiBaseCard title="Documents Orphelins" subtitle="Derniers documents certifiés">
        <template #header>
          <UiBaseButton variant="secondary" size="sm" @click="navigateTo('/dashboard/docsentry')">Gérer</UiBaseButton>
        </template>
        <div class="space-y-1">
          <div v-if="documentsStore.loading && !documentsStore.documents.length" class="py-10 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="!documentsStore.documents.length" class="py-10 text-center text-hsa">
            Aucun document récent
          </div>
          <div v-for="doc in documentsStore.documents.slice(0, 5)" :key="doc.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-ash/50 transition-all cursor-pointer group"
            @click="navigateTo(`/dashboard/docsentry/${doc.id}`)">
            <div class="flex items-center gap-3 min-w-0">
              <div class="p-2 bg-ash rounded-lg group-hover:bg-primary/10 transition-colors">
                <IconFileCertificate class="w-4 h-4 text-hsa group-hover:text-primary" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-bold text-BtW truncate">{{ doc.name }}</p>
                <p class="text-[10px] text-hsa">{{ formatTime(doc.created_at) }}</p>
              </div>
            </div>
            <UiStatusBadge :status="doc.status" size="sm" />
          </div>
        </div>
      </UiBaseCard>

      <!-- Activity Feed -->
      <UiBaseCard title="Journal d'Activité">
        <template #header>
          <UiBaseButton variant="secondary" size="sm" @click="navigateTo('/dashboard/logs')">Logs</UiBaseButton>
        </template>
        <div class="space-y-4">
          <div v-if="loading && !profilStore.logs.length" class="py-10 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
          <div v-else-if="!profilStore.logs.length" class="py-10 text-center text-hsa">
            Aucune activité enregistrée
          </div>
          <div v-for="log in profilStore.logs.slice(0, 5)" :key="log.id" class="flex gap-3 text-sm">
            <div class="h-8 w-8 rounded-lg bg-ash flex items-center justify-center shrink-0">
              <IconHistory class="w-4 h-4 text-hsa" />
            </div>
            <div class="min-w-0">
              <p class="text-xs text-BtW break-words"><span class="font-bold">{{ log.action }}</span></p>
              <p class="text-[10px] text-hsa">{{ formatTime(log.timestamp) }}</p>
            </div>
          </div>
        </div>
      </UiBaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IconFileCertificate, IconAlertTriangle, IconShieldLock, IconHistory, IconDevices } from '@tabler/icons-vue'
import { format } from 'date-fns'
import { useDocumentsStore } from '~/stores/documents'
import { useNotificationsStore } from '~/stores/notifications'
import { useProfilStore } from '~/stores/profil'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const documentsStore = useDocumentsStore()
const notificationsStore = useNotificationsStore()
const profilStore = useProfilStore()
const authStore = useAuthStore()

const currentTime = ref('')
const activeSessionsCount = ref(0)
const loading = ref(true)

onMounted(async () => {
  const now = new Date()
  currentTime.value = `${format(now, 'dd/MM/yyyy')} à ${format(now, 'HH:mm')}`

  // Parallel fetch
  await Promise.all([
    documentsStore.fetchDocuments(5, 0),
    notificationsStore.fetchNotifications(5, 0),
    profilStore.fetchLogs({ limit: 5 }),
    authStore.fetchSessions().then(sessions => {
      activeSessionsCount.value = sessions?.length || 0
    })
  ])
  loading.value = false
})

// Basic date formatter
const formatTime = (ts: string) => {
  try {
    return format(new Date(ts), 'dd/MM HH:mm')
  } catch (e) {
    return ts
  }
}

useHead({
  title: 'Tableau de bord'
})
</script>
