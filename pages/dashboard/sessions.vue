<template>
  <div class="space-y-6">
    <MeSessionsHeader :sessions-count="sessions.length" :has-other-sessions="otherSessions.length > 0"
      :loading="loading" :revoking-all="revokingAll" @refresh="loadSessions" @revoke-all="revokeAll" />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <MeSessionsList v-else :sessions="sessions" :current-session="currentSession" :other-sessions="otherSessions"
      @confirm-revoke="confirmRevoke" />

    <!-- Confirm Modal -->
    <UiConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :loading="authStore.loading" variant="danger" confirmText="Déconnecter" @confirm="handleConfirmRevoke"
      @cancel="confirmModal.show = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

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

useHead({
  title: 'Sessions actives'
})
</script>
