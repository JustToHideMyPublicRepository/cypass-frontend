<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-BtW">Sessions actives</h1>
        <p class="text-hsa">Gérez vos sessions actives sur d'autres appareils.</p>
      </div>
      <UiBaseButton variant="danger" outlined @click="revokeAll" :loading="revokingAll">
        Déconnecter toutes les autres sessions
      </UiBaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="sessions.length === 0" class="text-center py-12 text-hsa">
      Aucune session active trouvée.
    </div>

    <div v-else class="grid gap-4">
      <UiBaseCard v-for="session in sessions" :key="session.id"
        class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="p-3 bg-ash rounded-xl">
            <IconDeviceDesktop v-if="session.user_agent.includes('Windows') || session.user_agent.includes('Mac')"
              class="w-6 h-6 text-hsa" />
            <IconDeviceMobile v-else class="w-6 h-6 text-hsa" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-BtW">
                {{ formatUserAgent(session.user_agent) }}
              </h3>
              <span v-if="session.is_current"
                class="px-2 py-0.5 text-xs bg-success/10 text-success rounded-full font-medium">Actuelle</span>
            </div>
            <p class="text-sm text-hsa">
              {{ session.ip_address }} • <span :title="session.last_used_at">Dernière activité {{
                formatDate(session.last_used_at) }}</span>
            </p>
          </div>
        </div>

        <button v-if="!session.is_current" @click="confirmRevoke(session.id)"
          class="text-danger hover:bg-danger/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
          Révoquer
        </button>
      </UiBaseCard>
    </div>

    <!-- Confirm Modal -->
    <UiConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :loading="authStore.loading" variant="danger" confirmText="Déconnecter" @confirm="handleConfirmRevoke"
      @cancel="confirmModal.show = false" />
  </div>
</template>

<script setup lang="ts">
import { IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const authStore = useAuthStore()
const toastStore = useToastStore()
const sessions = ref<any[]>([])
const loading = ref(true)

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
  const success = await authStore.revokeSession(confirmModal.targetId, confirmModal.isAll)
  if (success) {
    toastStore.showToast('success', 'Succès', authStore.message || 'Action réussie.')
    confirmModal.show = false
    await loadSessions()
  } else {
    toastStore.showToast('error', 'Erreur', authStore.error || 'Une erreur est survenue.')
  }
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
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr })
}

useHead({
  title: 'Sessions Actives'
})
</script>
