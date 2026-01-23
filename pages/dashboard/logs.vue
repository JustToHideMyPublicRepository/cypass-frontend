<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Historique d'activité</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">Consultez et filtrez les actions récentes sur votre compte.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button @click="refreshLogs"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          :disabled="loading">
          <IconRefresh class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          <span>Actualiser</span>
        </button>
      </div>
    </div>

    <!-- Stats Widgets -->
    <div v-if="profilStore.logStatistics" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <IconActivity class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Actions</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{ profilStore.logStatistics.total_logs }}
            </h3>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
            <IconCircleCheck class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Connexions Réussies</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{
              profilStore.logStatistics.by_action['USER_LOGIN'] || 0 }}</h3>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
            <IconAlertCircle class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Échecs de Connexion</p>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{{
              profilStore.logStatistics.by_action['LOGIN_FAILED'] || 0 }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label
          class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Période</label>
        <input type="date" v-model="filters.date"
          class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white" />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type
          d'action</label>
        <select v-model="filters.type"
          class="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white">
          <option value="all">Toutes les actions</option>
          <option value="user_actions">Actions utilisateur</option>
          <option value="system">Système</option>
          <option value="security">Sécurité</option>
        </select>
      </div>

      <div class="flex-none">
        <button @click="applyFilters"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-500/20">
          Filtrer
        </button>
      </div>
    </div>

    <!-- Logs Table -->
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div v-if="loading" class="p-12 flex justify-center">
        <IconRefresh class="w-10 h-10 animate-spin text-blue-600" />
      </div>

      <div v-else-if="!profilStore.logs.length" class="p-12 text-center">
        <div class="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconSearch class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Aucun log trouvé</h3>
        <p class="text-slate-500 dark:text-slate-400 mt-2">Essayez de modifier vos filtres pour voir plus de résultats.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-left">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Action</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Statut</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Détails</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">IP
                / Agent</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="log in profilStore.logs" :key="log.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg" :class="getActionClass(log.action)">
                    <component :is="getActionIcon(log.action)" class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="block font-medium text-slate-900 dark:text-white">{{ log.action_label }}</span>
                    <span class="block text-xs text-slate-500">{{ log.log_type }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1.5"
                  :class="log.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="log.status === 'success' ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ log.status === 'success' ? 'Réussi' : 'Échoué' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-[150px] truncate text-sm text-slate-600 dark:text-slate-400"
                  :title="formatDetails(log.details)">
                  {{ formatDetails(log.details) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm font-mono text-slate-700 dark:text-slate-300">{{ log.ip_address }}</span>
                  <span class="text-xs text-slate-500 truncate max-w-[150px]" :title="log.user_agent">{{
                    formatUA(log.user_agent) }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                {{ formatTimestamp(log.timestamp) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useProfilStore } from '~/stores/profil'
import {
  IconActivity,
  IconCircleCheck,
  IconAlertCircle,
  IconRefresh,
  IconActivity as IconAction,
  IconLogin,
  IconLogout,
  IconUser,
  IconLock,
  IconMail,
  IconPhoto,
  IconSearch,
  IconDeviceDesktop
} from '@tabler/icons-vue'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default'
})

const profilStore = useProfilStore()
const loading = ref(false)

const filters = reactive({
  date: '',
  type: 'all',
  limit: 50
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

onMounted(() => {
  fetchLogs()
})

const getActionIcon = (action: string) => {
  if (action.includes('LOGIN')) return IconLogin
  if (action.includes('LOGOUT')) return IconLogout
  if (action.includes('AVATAR')) return IconPhoto
  if (action.includes('PASSWORD')) return IconLock
  if (action.includes('EMAIL')) return IconMail
  if (action.includes('PROFILE')) return IconUser
  return IconAction
}

const getActionClass = (action: string) => {
  if (action.includes('LOGIN_FAILED')) return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  if (action.includes('LOGIN')) return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
  if (action.includes('PASSWORD')) return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
  return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
}

const formatDetails = (details: any) => {
  if (!details) return '-'
  if (typeof details === 'string') return details
  try {
    const keys = Object.keys(details)
    if (keys.length === 0) return '-'
    return keys.map(k => `${k}: ${details[k]}`).join(', ')
  } catch (e) {
    return '-'
  }
}

const formatUA = (ua: string) => {
  if (!ua) return '-'
  if (ua.includes('Chrome')) return 'Chrome / Windows'
  if (ua.includes('Firefox')) return 'Firefox / Desktop'
  if (ua.includes('Safari')) return 'Safari / Apple'
  if (ua === 'node') return 'Backend System'
  return ua
}

const formatTimestamp = (ts: string) => {
  try {
    return format(new Date(ts), 'dd MMM yyyy, HH:mm', { locale: fr })
  } catch (e) {
    return ts
  }
}
</script>
