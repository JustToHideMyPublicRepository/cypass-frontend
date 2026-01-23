<template>
  <div class="space-y-6">
    <ProfileHeader />

    <!-- Loading State -->
    <div v-if="profilStore.loading && !profilStore.profile" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: User Card & Stats -->
      <div class="space-y-6">
        <ProfileSidebar :user="user" :status="profilStore.profile?.status || 'active'" />
        <ProfileStats :statistics="profilStore.statistics" />
      </div>

      <!-- Right Column: Personal Info & Security -->
      <div class="lg:col-span-2 space-y-6">
        <ProfilePersonalInfo v-model="form" :loading="profilStore.loading"
          :email-verified="!!profilStore.profile?.email_verified" @update="handleProfileUpdate" />

        <ProfileSecurity @open-email="showEmailModal = true" @open-password="showPasswordModal = true" />
      </div>
    </div>

    <!-- Modals -->
    <ModalProfileEmail :show="showEmailModal" :loading="profilStore.loading" @close="showEmailModal = false"
      @submit="handleEmailUpdate" />

    <ModalProfilePassword :show="showPasswordModal" :loading="profilStore.loading" @close="showPasswordModal = false"
      @submit="handlePasswordUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useProfilStore } from '~/stores/profil'
import { useToastStore } from '~/stores/toast'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: 'Mon Profil'
})

const authStore = useAuthStore()
const profilStore = useProfilStore()
const toastStore = useToastStore()

const user = computed(() => authStore.user)

const showEmailModal = ref(false)
const showPasswordModal = ref(false)

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  organisation: ''
})

onMounted(async () => {
  await profilStore.fetchProfile()
  if (profilStore.profile) {
    form.prenom = profilStore.profile.first_name
    form.nom = profilStore.profile.last_name
    form.email = profilStore.profile.email
    form.organisation = profilStore.profile.organization_name || 'N/A'
  }
})

const handleProfileUpdate = async () => {
  // Add backend integration for profile info update if needed
  toastStore.showToast('info', 'Information', 'La mise à jour du profil sera bientôt disponible.')
}

const handleEmailUpdate = async (data: any) => {
  const success = await profilStore.updateEmail(data.newEmail, data.password)
  if (success) {
    toastStore.showToast('success', 'Email modifié', profilStore.message || 'Vérifiez votre nouvelle adresse.')
    showEmailModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement d\'email.')
  }
}

const handlePasswordUpdate = async (data: any) => {
  const success = await profilStore.updatePassword(data.current, data.new, data.confirm)
  if (success) {
    toastStore.showToast('success', 'Mot de passe mis à jour', profilStore.message || 'Votre mot de passe a été changé.')
    showPasswordModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur', profilStore.error || 'Échec du changement de mot de passe.')
  }
}
</script>
