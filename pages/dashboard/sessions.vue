<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Sessions actives</h1>
        <p class="text-hsa">Gérez vos sessions actives sur d'autres appareils. ({{ sessions.length }} au total)</p>
      </div>
      <div class="flex gap-3">
        <UiBaseButton variant="ghost" @click="loadSessions" :loading="loading">
          Actualiser
        </UiBaseButton>
        <UiBaseButton v-if="otherSessions.length > 0" variant="danger" outlined @click="revokeAll"
          :loading="revokingAll">
          Déconnecter toutes les autres sessions
        </UiBaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="space-y-8">
      <div v-if="sessions.length === 0"
        class="text-center py-12 text-hsa bg-ash/30 rounded-2xl border border-dashed border-ashAct">
        <IconHistory class="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>Aucune session active trouvée.</p>
      </div>

      <!-- Session Actuelle -->
      <section v-if="currentSession">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-hsa mb-4 flex items-center gap-2">
          <IconShieldCheck class="w-4 h-4 text-success" /> Session actuelle
        </h2>
        <UiBaseCard class="border-l-4 border-l-success bg-success/5">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div class="p-4 bg-WtB rounded-2xl shadow-sm border border-ashAct">
                <IconDeviceDesktop
                  v-if="currentSession.user_agent.includes('Windows') || currentSession.user_agent.includes('Mac')"
                  class="w-8 h-8 text-primary" />
                <IconDeviceMobile v-else class="w-8 h-8 text-primary" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-BtW">
                    {{ formatUserAgent(currentSession.user_agent) }}
                  </h3>
                  <span class="px-2 py-0.5 text-xs bg-success text-white rounded-full font-bold">ACTUELLE</span>
                </div>
                <p class="text-sm font-mono text-hsa bg-ash px-2 py-0.5 rounded inline-block">
                  {{ currentSession.ip_address }}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pt-2">
                  <p class="text-xs text-hsa flex items-center gap-1.5">
                    <IconPlus class="w-3.5 h-3.5" /> Créée le : {{ formatFullDate(currentSession.created_at) }}
                  </p>
                  <p class="text-xs text-hsa flex items-center gap-1.5">
                    <IconHistory class="w-3.5 h-3.5" /> Dernière activité : {{ formatDate(currentSession.last_used_at)
                    }}
                  </p>
                  <p class="text-xs text-hsa flex items-center gap-1.5 font-medium">
                    <IconClock class="w-3.5 h-3.5" /> Expire le : {{ formatFullDate(currentSession.expires_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </UiBaseCard>
      </section>

      <!-- Autres Sessions -->
      <section v-if="otherSessions.length > 0">
        <h2 class="text-sm font-semibold uppercase tracking-wider text-hsa mb-4">Autres appareils connectés</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UiBaseCard v-for="session in otherSessions" :key="session.id"
            class="relative group border border-ash hover:border-primary/30 transition-all duration-300">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-ash rounded-xl group-hover:bg-primary/10 transition-colors">
                <IconDeviceDesktop v-if="session.user_agent.includes('Windows') || session.user_agent.includes('Mac')"
                  class="w-6 h-6 text-hsa group-hover:text-primary transition-colors" />
                <IconDeviceMobile v-else class="w-6 h-6 text-hsa group-hover:text-primary transition-colors" />
              </div>
              <div class="flex-grow min-w-0">
                <h3 class="font-bold text-BtW truncate">
                  {{ formatUserAgent(session.user_agent) }}
                </h3>
                <p class="text-xs font-mono text-hsa mb-2">
                  {{ session.ip_address }}
                </p>

                <div class="space-y-1">
                  <p class="text-[10px] text-hsa uppercase font-semibold">Dernière activité</p>
                  <p class="text-xs text-BtW">
                    Il y a {{ formatDate(session.last_used_at) }}
                    <span class="text-hsa text-[10px]">({{ formatFullDate(session.last_used_at) }})</span>
                  </p>
                  <p class="text-[10px] text-hsa uppercase font-semibold pt-1">Expiration</p>
                  <p class="text-xs text-BtW">{{ formatFullDate(session.expires_at) }}</p>
                </div>
              </div>

              <button @click="confirmRevoke(session.id)"
                class="absolute top-4 right-4 p-2 text-hsa hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Déconnecter cet appareil">
                <IconLogout class="w-5 h-5" />
              </button>
            </div>
          </UiBaseCard>
        </div>
      </section>
    </div>

    <!-- Confirm Modal -->
    <UiConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :loading="authStore.loading" variant="danger" confirmText="Déconnecter" @confirm="handleConfirmRevoke"
      @cancel="confirmModal.show = false" />
  </div>
</template>

<script setup lang="ts">
import { IconDeviceDesktop, IconDeviceMobile, IconShieldCheck, IconClock, IconHistory, IconPlus, IconLogout } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { format, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()
const toastStore = useToastStore()
const sessions = ref<any[]>([])
const loading = ref(true)
const revokingAll = ref(false)

const currentSession = computed(() => sessions.value.find(s => s.is_current))
const otherSessions = computed(() => sessions.value.filter(s => !s.is_current))

// Modal State
const confirmModal = reactive({
  show: false,
  title: '',
  message: '',
  targetId: '',
  isAll: false
})

const loadSessions = async () => {
  loading.value = true
  sessions.value = await authStore.fetchSessions()
  loading.value = false
}

onMounted(() => {
  loadSessions()
})

const confirmRevoke = (id: string) => {
  confirmModal.targetId = id
  confirmModal.isAll = false
  confirmModal.title = 'Révoquer la session'
  confirmModal.message = 'Voulez-vous vraiment déconnecter cet appareil ?'
  confirmModal.show = true
}

const revokeAll = () => {
  confirmModal.targetId = ''
  confirmModal.isAll = true
  confirmModal.title = 'Déconnecter toutes les autres sessions'
  confirmModal.message = 'Voulez-vous vraiment déconnecter TOUTES les autres sessions actives ?'
  confirmModal.show = true
}

const handleConfirmRevoke = async () => {
  if (confirmModal.isAll) revokingAll.value = true

  const success = await authStore.revokeSession(confirmModal.targetId, confirmModal.isAll)
  if (success) {
    toastStore.showToast('success', 'Succès', authStore.message || 'Action réussie.')
    confirmModal.show = false
    await loadSessions()
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Une erreur est survenue.')
  }
  revokingAll.value = false
}

// Helpers
const formatUserAgent = (ua: string) => {
  if (ua.includes('Windows')) return 'Windows PC'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('Linux')) return 'Linux Desktop'
  if (ua.includes('iPhone')) return 'iPhone'
  if (ua.includes('Android')) return 'Android Device'
  return 'Appareil Inconnu'
}

const formatDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), { locale: fr })
}

const formatFullDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr })
}

useHead({
  title: 'Sessions Actives'
})
</script>
