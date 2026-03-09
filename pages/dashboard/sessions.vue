<template>
  <div class="space-y-6">
    <MeSessionsHeader :sessions-count="sessions.length" :has-other-sessions="otherSessions.length > 0"
      :loading="loading" :revoking-all="revokingAll" @refresh="loadSessions" @revoke-all="revokeAll" />

    <!-- Loading State -->
    <div v-if="loading" class="space-y-8">
      <div>
        <UiAppSkeleton width="150px" height="16px" class="mb-4" />
        <UiAppSkeleton height="160px" />
      </div>
      <div>
        <UiAppSkeleton width="200px" height="16px" class="mb-4" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <UiAppSkeleton v-for="i in 2" :key="i" height="140px" />
        </div>
      </div>
    </div>

    <MeSessionsList v-else :sessions="sessions" :current-session="currentSession" :other-sessions="otherSessions"
      @confirm-revoke="confirmRevoke" />

    <!-- Confirm Modal -->
    <UiConfirmModal :show="confirmModal.show" :title="confirmModal.title" :message="confirmModal.message"
      :loading="profilStore.loading" variant="danger" confirmText="Déconnecter" @confirm="handleConfirmRevoke"
      @cancel="confirmModal.show = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/back/user/auth'
import { useProfilStore } from '~/stores/back/user/profil'
import { useToastStore } from '~/stores/front/toast'

const authStore = useAuthStore()
const profilStore = useProfilStore()
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
  sessions.value = await profilStore.sessionsGet()
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

  const success = await profilStore.sessionsDelete(confirmModal.targetId, confirmModal.isAll)
  if (success) {
    toastStore.showToast('success', 'Succès', profilStore.message || 'Action réussie.')
    confirmModal.show = false
    await loadSessions()
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Une erreur est survenue.')
  }
  revokingAll.value = false
}

useHead({
  title: 'Sessions actives',
  meta: [
    { name: 'description', content: 'Contrôlez les appareils et sessions actuellement connectés à votre compte.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
