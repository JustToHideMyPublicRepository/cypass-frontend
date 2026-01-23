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
        <ProfileSidebar :user="user" :status="profilStore.profile?.status || 'active'"
          @open-avatar="showAvatarModal = true" />
        <ProfileStats :statistics="profilStore.statistics" />
      </div>

      <!-- Right Column: Personal Info & Security -->
      <div class="lg:col-span-2 space-y-6">
        <ProfilePersonalInfo v-model="form" :email-verified="!!profilStore.profile?.email_verified"
          @open-edit="showInfoModal = true" />

        <ProfileSecurity @open-email="showEmailModal = true" @open-password="showPasswordModal = true" />
      </div>
    </div>

    <!-- Modals -->
    <ModalProfileEmail :show="showEmailModal" :loading="profilStore.loading" @close="showEmailModal = false"
      @submit="handleEmailUpdate" />

    <ModalProfilePassword :show="showPasswordModal" :loading="profilStore.loading" @close="showPasswordModal = false"
      @submit="handlePasswordUpdate" />

    <ModalProfileAvatar :show="showAvatarModal" :current-avatar="user?.avatar_url" :is-loading="profilStore.loading"
      @close="showAvatarModal = false" @submit="handleAvatarUpload" />

    <ModalProfileInfo :show="showInfoModal" :is-loading="profilStore.loading" :initial-data="form"
      @close="showInfoModal = false" @submit="handleInfoUpdate" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
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
const showAvatarModal = ref(false)
const showInfoModal = ref(false)

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  organisation: ''
})

const syncFormWithProfile = () => {
  if (profilStore.profile) {
    form.prenom = profilStore.profile.first_name
    form.nom = profilStore.profile.last_name
    form.email = profilStore.profile.email
    form.organisation = profilStore.profile.organization_name || 'N/A'
  }
}

watch(() => profilStore.profile, syncFormWithProfile, { deep: true })

onMounted(async () => {
  await profilStore.fetchProfile()
  syncFormWithProfile()
})

const handleAvatarUpload = async (file: File) => {
  const success = await profilStore.uploadAvatar(file)
  if (success) {
    toastStore.showToast('success', 'Photo de profil', 'Votre photo a été mise à jour avec succès.')
    showAvatarModal.value = false
    // Update local user state
    if (authStore.user && profilStore.profile) {
      authStore.user.avatar_url = profilStore.profile.avatar_url
    }
  } else {
    toastStore.showToast('error', 'Erreur d\'upload', profilStore.error || 'Impossible de mettre à jour la photo.')
  }
}

const handleInfoUpdate = async (data: any) => {
  const success = await profilStore.updatePersonalInfo({
    first_name: data.prenom,
    last_name: data.nom,
    organization_name: data.organisation
  })
  if (success) {
    toastStore.showToast('success', 'Profil mis à jour', 'Vos informations ont été enregistrées.')
    showInfoModal.value = false
  } else {
    toastStore.showToast('error', 'Erreur de mise à jour', profilStore.error || 'Impossible d\'enregistrer les modifications.')
  }
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
