<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Historique d'activité</h1>
        <p class="text-hsa font-medium">Suivi en temps réel des actions sur votre compte.</p>
      </div>

      <div class="flex items-center gap-3">
        <UiBaseButton variant="ghost" @click="refreshLogs" :loading="loading">
          <template #icon>
            <IconRefresh class="w-4 h-4" />
          </template>
          Actualiser
        </UiBaseButton>
      </div>
    </div>

    <!-- Stats Widgets - Elegant & Minimalist -->
    <div v-if="profilStore.logStatistics" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UiBaseCard class="bg-primary/[0.03] border-primary/10">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary/10 rounded-2xl">
            <IconActivity class="w-6 h-6 text-primary" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Total Actions</p>
            <p class="text-2xl font-black text-BtW leading-tight">{{ profilStore.logStatistics.total_logs }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-success/[0.03] border-success/10">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-success/10 rounded-2xl">
            <IconCircleCheck class="w-6 h-6 text-success" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Succès</p>
            <p class="text-2xl font-black text-BtW leading-tight">{{ profilStore.logStatistics.by_action['USER_LOGIN']
              || 0
            }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-danger/[0.03] border-danger/10">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-danger/10 rounded-2xl">
            <IconAlertCircle class="w-6 h-6 text-danger" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Échecs</p>
            <p class="text-2xl font-black text-BtW leading-tight">{{ profilStore.logStatistics.by_action['LOGIN_FAILED']
              ||
              0 }}</p>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Filters Bar -->
    <UiBaseCard class="py-3 px-4 bg-ash/50 backdrop-blur-sm border-ashAct">
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-2">
          <IconFilter class="w-4 h-4 text-hsa" />
          <span class="text-xs font-bold text-hsa uppercase tracking-wider">Filtres :</span>
        </div>

        <div class="flex items-center gap-4">
          <select v-model="filters.type" @change="applyFilters"
            class="bg-ash border border-ashAct rounded-lg px-3 py-1.5 text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all">
            <option value="all">Toutes les catégories</option>
            <option value="user_actions">Activités utilisateur</option>
            <option value="security">Sécurité & Accès</option>
            <option value="system">Système</option>
          </select>

          <input type="date" v-model="filters.date" @change="applyFilters"
            class="bg-ash border border-ashAct rounded-lg px-3 py-1.5 text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
        </div>

        <div class="ml-auto">
          <p class="text-[10px] text-hsa font-bold uppercase">{{ profilStore.logs.length }} résultats affichés</p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Content Area -->
    <div class="relative">
      <!-- Loading Overlay -->
      <div v-if="loading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-WtB/50 backdrop-blur-[2px] rounded-2xl py-20">
        <div class="flex flex-col items-center gap-3">
          <IconRefresh class="w-10 h-10 animate-spin text-primary" />
          <p class="text-sm font-bold text-hsa animate-pulse">Chargement des activités...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && (!profilStore.logs || profilStore.logs.length === 0)"
        class="text-center py-20 bg-ash/20 rounded-2xl border-2 border-dashed border-ashAct">
        <IconHistory class="w-16 h-16 mx-auto mb-6 opacity-20 text-hsa" />
        <h3 class="text-lg font-black text-BtW uppercase tracking-wider">Aucune activité</h3>
        <p class="text-hsa max-w-xs mx-auto mt-2">Nous n'avons trouvé aucun log correspondant à vos critères de
          recherche.
        </p>
        <UiBaseButton variant="ghost" class="mt-6" @click="resetFilters">
          Réinitialiser les filtres
        </UiBaseButton>
      </div>

      <!-- Logs Timeline / Cards -->
      <div v-if="!loading && profilStore.logs && profilStore.logs.length > 0" class="space-y-4">
        <div v-for="(log, index) in profilStore.logs" :key="log.id || index" class="group">
          <!-- Optional: Date Separator -->
          <div v-if="isNewDay(index)" class="flex items-center gap-4 py-6 first:pt-0">
            <div class="h-[1px] flex-grow bg-ashAct"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-hsa opacity-50">
              {{ formatDayHeader(log.timestamp) }}
            </span>
            <div class="h-[1px] flex-grow bg-ashAct"></div>
          </div>

          <UiBaseCard
            class="relative overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-ashAct"
            :class="{ 'border-l-4 border-l-danger bg-danger/[0.02]': log.status !== 'success' }">
            <div class="flex items-center gap-4 md:gap-6">
              <!-- Action Icon -->
              <div class="shrink-0 p-3 rounded-2xl transition-colors" :class="getActionClass(log.action)">
                <component :is="getActionIcon(log.action)" class="w-6 h-6" />
              </div>

              <!-- Main Info -->
              <div class="flex-grow min-w-0 space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-BtW text-lg">
                    {{ log.action_label }}
                  </h3>
                  <span v-if="log.status !== 'success'"
                    class="px-2 py-0.5 text-[10px] bg-danger text-white rounded-full font-black uppercase">
                    Échec
                  </span>
                </div>

                <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <p class="text-xs text-hsa flex items-center gap-1.5 min-w-[120px]">
                    <IconClock class="w-3.5 h-3.5" /> {{ formatTime(log.timestamp) }}
                  </p>
                  <p class="text-xs text-hsa flex items-center gap-1.5 font-mono">
                    <IconMapPin class="w-3.5 h-3.5" /> {{ log.ip_address }}
                  </p>
                  <p class="text-xs text-hsa flex items-center gap-1.5 truncate max-w-[200px]" :title="log.user_agent">
                    <IconDeviceDesktop class="w-3.5 h-3.5" /> {{ formatUA(log.user_agent) }}
                  </p>
                </div>
              </div>

              <!-- Details Toggle (simplified for now) -->
              <div v-if="log.details && (Object.keys(log.details).length > 0)"
                class="hidden md:block shrink-0 px-4 py-2 bg-ash/50 rounded-xl text-[10px] font-black uppercase text-hsa tracking-widest whitespace-nowrap">
                {{ formatQuickDetails(log.details) }}
              </div>
            </div>
          </UiBaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProfilStore } from '~/stores/profil'
import {
  IconActivity,
  IconCircleCheck,
  IconAlertCircle,
  IconRefresh,
  IconHistory,
  IconClock,
  IconMapPin,
  IconDeviceDesktop,
  IconFilter,
  IconLogin,
  IconLogout,
  IconUser,
  IconLock,
  IconMail,
  IconPhoto
} from '@tabler/icons-vue'
import { format, isSameDay, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default'
})

const profilStore = useProfilStore()
const loading = ref(false)

const filters = reactive({
  date: '',
  type: 'all',
  limit: 100
})

const fetchLogs = async () => {
  loading.value = true
  await profilStore.fetchLogs({
    limit: filters.limit,
    type: filters.type,
    date: filters.date || undefined
  })
  loading.value = false
}

const applyFilters = () => {
  fetchLogs()
}

const refreshLogs = () => {
  fetchLogs()
}

const resetFilters = () => {
  filters.date = ''
  filters.type = 'all'
  fetchLogs()
}

onMounted(() => {
  fetchLogs()
})

// Helpers
const getActionIcon = (action: string) => {
  const a = action.toUpperCase()
  if (a.includes('LOGIN')) return IconLogin
  if (a.includes('LOGOUT')) return IconLogout
  if (a.includes('AVATAR')) return IconPhoto
  if (a.includes('PASSWORD')) return IconLock
  if (a.includes('EMAIL')) return IconMail
  if (a.includes('PROFILE')) return IconUser
  return IconActivity
}

const getActionClass = (action: string) => {
  const a = action.toUpperCase()
  if (a.includes('FAILED')) return 'bg-danger/10 text-danger'
  if (a.includes('LOGIN')) return 'bg-success/10 text-success'
  if (a.includes('PASSWORD') || a.includes('EMAIL')) return 'bg-warning/10 text-warning'
  return 'bg-primary/10 text-primary'
}

const formatTime = (ts: string) => {
  try {
    return format(new Date(ts), 'HH:mm', { locale: fr })
  } catch (e) {
    return ts
  }
}

const formatDayHeader = (ts: string) => {
  try {
    const date = new Date(ts)
    if (isSameDay(date, new Date())) return "Aujourd'hui"
    return format(date, 'EEEE d MMMM yyyy', { locale: fr })
  } catch (e) {
    return ts
  }
}

const isNewDay = (index: number) => {
  if (index === 0) return true
  const current = profilStore.logs[index].timestamp
  const previous = profilStore.logs[index - 1].timestamp
  try {
    return !isSameDay(new Date(current), new Date(previous))
  } catch (e) {
    return false
  }
}

const formatUA = (ua: string) => {
  if (!ua) return 'Inconnu'
  if (ua.includes('Windows')) return 'Windows PC'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('Android')) return 'Android'
  if (ua === 'node') return 'Système'
  return 'Navigateur'
}

const formatQuickDetails = (details: any) => {
  if (!details) return ''
  const entries = Object.entries(details)
  if (entries.length === 0) return ''
  const [key, value] = entries[0]
  return `${key}: ${value}`
}

useHead({
  title: 'Activités récentes'
})
</script>
