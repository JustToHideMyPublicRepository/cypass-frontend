<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Historique d'activité</h1>
        <p class="text-hsa font-medium">
          Suivi en temps réel pour <span class="text-primary font-bold">{{ profilStore.logUser?.email || 'votre compte'
          }}</span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UiBaseButton variant="ghost" @click="refreshLogs" :loading="loading">
          <template #icon>
            <IconRefresh class="w-4 h-4" />
          </template>
          Actualiser
        </UiBaseButton>
        <UiBaseButton variant="secondary" outlined @click="resetFilters">
          Réinitialiser
        </UiBaseButton>
      </div>
    </div>

    <!-- Stats Summary (Optional, matching sessions.vue type of layout) -->
    <div v-if="profilStore.logStatistics" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UiBaseCard class="bg-primary/5 border-l-4 border-l-primary">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
            <IconActivity class="w-6 h-6 text-primary" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Total Actions</p>
            <p class="text-xl font-bold text-BtW leading-tight">{{ profilStore.logStatistics.total_logs ?? 0 }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-secondary/5 border-l-4 border-l-secondary">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
            <IconList class="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Logs Affichés</p>
            <p class="text-xl font-bold text-BtW leading-tight">{{ profilStore.logs?.length || 0 }}</p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-success/5 border-l-4 border-l-success">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
            <IconCircleCheck class="w-6 h-6 text-success" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Connexions</p>
            <p class="text-xl font-bold text-BtW leading-tight">{{ profilStore.logStatistics.by_action?.['USER_LOGIN']
              ||
              profilStore.logStatistics.by_action?.['Connexion réussie'] || 0 }}
            </p>
          </div>
        </div>
      </UiBaseCard>

      <UiBaseCard class="bg-danger/5 border-l-4 border-l-danger">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-ash rounded-xl shadow-sm border border-ashAct">
            <IconAlertCircle class="w-6 h-6 text-danger" />
          </div>
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">Échecs</p>
            <p class="text-xl font-bold text-BtW leading-tight">{{ profilStore.logStatistics.by_action?.['LOGIN_FAILED']
              || profilStore.logStatistics.by_action?.['Tentative de connexion échouée'] || 0
            }}</p>
          </div>
        </div>
      </UiBaseCard>
    </div>

    <!-- Filters Section -->
    <UiBaseCard class="bg-ash/30 border border-dashed border-ashAct">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-4 md:gap-8">
          <div class="flex items-center gap-2">
            <IconFilter class="w-4 h-4 text-hsa opacity-50" />
            <span class="text-xs font-bold text-hsa uppercase tracking-[0.2em]">Filtres :</span>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Date</label>
              <input type="date" v-model="filters.date" @change="applyFilters"
                class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ashAct text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-black text-hsa/40 uppercase tracking-widest ml-1">Catégorie</label>
              <select v-model="filters.type" @change="applyFilters"
                class="block w-full px-3 py-1.5 rounded-lg bg-WtB border border-ashAct text-xs font-bold text-BtW outline-none focus:ring-1 focus:ring-primary transition-all">
                <option value="all">Toutes les actions</option>
                <option value="user_actions">Activités utilisateur</option>
                <option value="security">Sécurité</option>
                <option value="system">Système</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="profilStore.logFilters" class="px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
          <p class="text-[10px] font-black text-primary uppercase tracking-widest">
            Affichage : {{ profilStore.logFilters.type === 'all' ? 'Toutes' : profilStore.logFilters.type }} |
            {{ formatDate(profilStore.logFilters.date) }} |
            Lim : {{ itemsPerPage }}
          </p>
        </div>
      </div>
    </UiBaseCard>

    <!-- Content Area -->
    <div class="relative min-h-[400px]">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-pulse">
        <IconRefresh class="w-12 h-12 animate-spin text-primary opacity-20 mb-4" />
        <p class="text-hsa font-bold uppercase tracking-widest text-xs">Chargement en cours...</p>
      </div>

      <div v-else-if="!profilStore.logs || profilStore.logs.length === 0"
        class="text-center py-20 bg-ash/10 rounded-2xl border-2 border-dashed border-ashAct">
        <IconHistory class="w-16 h-16 mx-auto mb-4 opacity-10 text-hsa" />
        <p class="text-hsa font-bold">Aucune activité enregistrée pour cette sélection.</p>
        <p class="text-xs text-hsa mt-2 opacity-60">Essayez de modifier vos filtres ou de changer la date.</p>
      </div>

      <div v-else class="space-y-8">
        <div v-for="(logGroup, date) in groupedLogs" :key="date" class="space-y-4">
          <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-hsa opacity-40 flex items-center gap-4">
            {{ formatFullDate(date) }}
            <div class="h-px bg-ashAct flex-grow"></div>
          </h2>

          <div class="grid grid-cols-1 gap-4">
            <UiBaseCard v-for="log in logGroup" :key="log.id"
              class="group hover:border-primary/30 transition-all duration-300 relative border border-ashAct"
              :class="{ 'border-l-4 border-l-danger': log.status !== 'success' }">
              <div class="flex items-center gap-4">
                <div class="p-3 rounded-xl transition-colors shrink-0" :class="getActionClass(log.action)">
                  <component :is="getActionIcon(log.action)" class="w-5 h-5" />
                </div>

                <div class="flex-grow min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-BtW truncate">
                      {{ log.action_label }}
                    </h3>
                    <span v-if="log.status !== 'success'"
                      class="px-2 py-0.5 text-[8px] bg-danger text-white rounded-full font-black uppercase">
                      Échec
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <p class="text-[11px] text-hsa flex items-center gap-1.5">
                      <IconClock class="w-3.5 h-3.5 opacity-40" /> {{ formatTime(log.timestamp) }}
                    </p>
                    <p class="text-[11px] font-mono text-hsa flex items-center gap-1.5 opacity-60">
                      <IconPlus class="w-3.5 h-3.5 opacity-40" /> {{ log.ip_address }}
                    </p>
                    <p class="text-[11px] text-hsa flex items-center gap-1.5 truncate max-w-[200px]"
                      :title="log.user_agent">
                      <IconDeviceDesktop class="w-3.5 h-3.5 opacity-40" /> {{ formatUA(log.user_agent) }}
                    </p>
                  </div>
                </div>

                <div v-if="log.details && Object.keys(log.details).length > 0" class="hidden md:block">
                  <span class="text-[9px] font-black uppercase tracking-widest text-hsa/40 bg-ash px-2 py-1 rounded-lg">
                    {{ formatQuickDetails(log.details) }}
                  </span>
                </div>
              </div>
            </UiBaseCard>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex items-center justify-between pt-6 mt-6 border-t border-ashAct">
          <p class="text-[10px] font-black uppercase tracking-widest text-hsa opacity-60">
            Page {{ currentPage }} sur {{ totalPages }}
          </p>
          <div class="flex items-center gap-1">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="p-1 rounded-lg border border-ash hover:bg-ash transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-hsa hover:text-BtW">
              <IconChevronLeft class="w-4 h-4" />
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="p-1 rounded-lg border border-ash hover:bg-ash transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-hsa hover:text-BtW">
              <IconChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useProfilStore } from '~/stores/profil'
import {
  IconActivity, IconCircleCheck, IconAlertCircle, IconRefresh, IconHistory,
  IconClock, IconPlus, IconDeviceDesktop, IconFilter, IconLogin, IconLogout,
  IconUser, IconLock, IconMail, IconPhoto, IconMapPin, IconChevronLeft, IconChevronRight, IconList,
} from '@tabler/icons-vue'
import { format, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const profilStore = useProfilStore()
const loading = ref(false)

const filters = reactive({
  date: format(new Date(), 'yyyy-MM-dd'),
  type: 'all',
  limit: 10
})

const currentPage = ref(1)
const itemsPerPage = computed(() => filters.limit)

// Fetch max logs for client-side pagination
const fetchLogs = async () => {
  loading.value = true
  await profilStore.fetchLogs({
    limit: 500, // Fetch max allowed by backend
    type: filters.type,
    date: filters.date || undefined
  })
  currentPage.value = 1 // Reset to first page on filter change
  loading.value = false
}

const paginatedLogs = computed(() => {
  if (!profilStore.logs) return []
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return profilStore.logs.slice(start, end)
})

const totalPages = computed(() => {
  if (!profilStore.logs) return 1
  return Math.ceil(profilStore.logs.length / itemsPerPage.value)
})

const groupedLogs = computed(() => {
  if (!paginatedLogs.value || !Array.isArray(paginatedLogs.value)) return {}
  const groups: Record<string, any[]> = {}

  paginatedLogs.value.forEach(log => {
    try {
      if (!log.timestamp) return

      // Handle "YYYY-MM-DD HH:mm:ss" vs "YYYY-MM-DDTHH:mm:ss"
      const normalizedTs = log.timestamp.includes('T') ? log.timestamp : log.timestamp.replace(' ', 'T')
      const dateObj = new Date(normalizedTs)

      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', log.timestamp)
        return
      }

      const dateKey = format(dateObj, 'yyyy-MM-dd')
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(log)
    } catch (e) {
      console.error('Error grouping log:', e, log)
    }
  })

  // Sort dates descending
  const sortedGroups: Record<string, any[]> = {}
  Object.keys(groups).sort((a, b) => b.localeCompare(a)).forEach(key => {
    sortedGroups[key] = groups[key]
  })

  return sortedGroups
})

const applyFilters = () => {
  fetchLogs()
}

const refreshLogs = () => {
  fetchLogs()
}

const resetFilters = () => {
  filters.date = format(new Date(), 'yyyy-MM-dd')
  filters.type = 'all'
  filters.limit = 10
  fetchLogs()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

onMounted(() => {
  fetchLogs()
})

// Helpers
const getActionIcon = (action: string) => {
  if (!action) return IconActivity
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
  if (!action) return 'bg-ash text-hsa'
  const a = action.toUpperCase()
  if (a.includes('FAILED')) return 'bg-danger/10 text-danger'
  if (a.includes('LOGIN')) return 'bg-success/10 text-success'
  if (a.includes('PASSWORD') || a.includes('EMAIL')) return 'bg-warning/10 text-warning'
  return 'bg-ash text-hsa'
}

const formatTime = (ts: string) => {
  if (!ts) return '--:--'
  try {
    const normalizedTs = ts.includes('T') ? ts : ts.replace(' ', 'T')
    const date = new Date(normalizedTs)
    if (isNaN(date.getTime())) return '--:--'
    return format(date, 'HH:mm')
  } catch (e) {
    return '--:--'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return format(new Date(dateString), 'd MMM yyyy', { locale: fr })
}

const formatFullDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    if (isSameDay(date, new Date())) return "Aujourd'hui"
    return format(date, 'EEEE d MMMM yyyy', { locale: fr })
  } catch (e) {
    return dateString
  }
}

const formatUA = (ua: string) => {
  if (!ua) return 'Navigateur'
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
  title: 'Historique d\'activité'
})
</script>
